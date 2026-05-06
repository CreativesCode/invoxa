-- =============================================================================
-- Invoxa — Helper functions and auto-profile trigger
-- =============================================================================

-- is_admin(uuid) --------------------------------------------------------------
-- Returns true if the given user (defaults to auth.uid()) has admin role.
-- SECURITY DEFINER lets RLS policies call it without recursive permission
-- checks against the profiles table.
create or replace function is_admin(check_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role = 'admin' from profiles where id = check_user_id),
    false
  );
$$;

-- handle_new_user -------------------------------------------------------------
-- Auto-creates a profile row whenever a new auth.users row is inserted.
-- Reads full_name and role hints from raw_user_meta_data when present.
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta_role text;
  resolved_role user_role;
begin
  meta_role := new.raw_user_meta_data ->> 'role';

  if meta_role = 'admin' then
    resolved_role := 'admin';
  else
    resolved_role := 'user';
  end if;

  insert into profiles (id, email, full_name, role, status)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    resolved_role,
    'invited'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- next_invoice_number ---------------------------------------------------------
-- Computes the next invoice number for a given user using a per-user advisory
-- lock to avoid race conditions. Format: INF-{USER_CODE}-YYYY-NNNN.
-- Falls back to a short prefix derived from the user's UUID when user_code is
-- not set.
create or replace function next_invoice_number(
  p_user_id uuid,
  p_year integer
)
returns table (invoice_number text, sequence_number integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_code text;
  v_next_seq integer;
  v_invoice_number text;
begin
  -- Lock the per-user sequence space.
  perform pg_advisory_xact_lock(hashtext('invoice_number:' || p_user_id::text));

  select user_code into v_user_code
  from profiles
  where id = p_user_id;

  if v_user_code is null or v_user_code = '' then
    v_user_code := upper(substring(replace(p_user_id::text, '-', ''), 1, 6));
  end if;

  select coalesce(max(user_invoice_sequence), 0) + 1
  into v_next_seq
  from invoices
  where user_id = p_user_id;

  v_invoice_number :=
    'INF-' || v_user_code || '-' || p_year::text || '-' ||
    lpad(v_next_seq::text, 4, '0');

  invoice_number := v_invoice_number;
  sequence_number := v_next_seq;
  return next;
end;
$$;

-- apply_invoice_number_change ------------------------------------------------
-- Centralizes the logic to change an invoice number safely:
-- - Validates uniqueness within the user's sequence.
-- - Updates invoices.invoice_number.
-- - Records an entry in invoice_number_history.
-- Returns the updated invoice id.
create or replace function apply_invoice_number_change(
  p_invoice_id uuid,
  p_new_invoice_number text,
  p_changed_by uuid,
  p_change_request_id uuid default null,
  p_reason text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_invoice invoices%rowtype;
  v_existing_count integer;
begin
  select * into v_invoice from invoices where id = p_invoice_id for update;

  if not found then
    raise exception 'Invoice % not found', p_invoice_id;
  end if;

  if v_invoice.invoice_number = p_new_invoice_number then
    return v_invoice.id;
  end if;

  select count(*) into v_existing_count
  from invoices
  where invoice_number = p_new_invoice_number
    and id <> p_invoice_id;

  if v_existing_count > 0 then
    raise exception
      'Invoice number % already exists', p_new_invoice_number;
  end if;

  insert into invoice_number_history (
    invoice_id,
    previous_invoice_number,
    new_invoice_number,
    change_request_id,
    changed_by,
    reason
  ) values (
    v_invoice.id,
    v_invoice.invoice_number,
    p_new_invoice_number,
    p_change_request_id,
    p_changed_by,
    p_reason
  );

  update invoices
  set invoice_number = p_new_invoice_number
  where id = v_invoice.id;

  return v_invoice.id;
end;
$$;
