-- =============================================================================
-- Invoxa — Make handle_new_user read user_code from auth metadata
-- =============================================================================
-- Allows the invite-user edge function to pass user_code in raw_user_meta_data
-- so the auto-created profile already includes it.
-- =============================================================================

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta_role text;
  resolved_role user_role;
  meta_user_code text;
begin
  meta_role := new.raw_user_meta_data ->> 'role';
  meta_user_code := new.raw_user_meta_data ->> 'user_code';

  if meta_role = 'admin' then
    resolved_role := 'admin';
  else
    resolved_role := 'user';
  end if;

  insert into profiles (id, email, full_name, user_code, role, status)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(meta_user_code, ''),
    resolved_role,
    'invited'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;
