-- =============================================================================
-- Invoxa — Auto-activate profile when auth email is confirmed
-- =============================================================================
-- Two complementary fixes for the "user stuck in 'invited' status" problem:
--
-- 1. handle_new_user: when a user is *inserted* with email already confirmed
--    (e.g. created via dashboard with "Auto Confirm User" or invited and
--    auto-confirmed in the same operation), seed the profile as 'active'.
--
-- 2. activate_profile_on_confirmation: when a user's email_confirmed_at
--    transitions from null → not null *after* insert (the standard
--    invitation flow: user clicks link → Supabase sets email_confirmed_at),
--    flip profiles.status from 'invited' → 'active'.
-- =============================================================================

-- 1. Updated handle_new_user — seed status based on email confirmation
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
  resolved_status user_status;
begin
  meta_role := new.raw_user_meta_data ->> 'role';
  meta_user_code := new.raw_user_meta_data ->> 'user_code';

  if meta_role = 'admin' then
    resolved_role := 'admin';
  else
    resolved_role := 'user';
  end if;

  if new.email_confirmed_at is not null then
    resolved_status := 'active';
  else
    resolved_status := 'invited';
  end if;

  insert into profiles (id, email, full_name, user_code, role, status)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(meta_user_code, ''),
    resolved_role,
    resolved_status
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- 2. Trigger that watches for email confirmation after insert

create or replace function activate_profile_on_confirmation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email_confirmed_at is not null
     and (
       old.email_confirmed_at is null
       or old.email_confirmed_at is distinct from new.email_confirmed_at
     )
  then
    update profiles
    set status = 'active'
    where id = new.id
      and status = 'invited';
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_confirmed on auth.users;

create trigger on_auth_user_confirmed
  after update on auth.users
  for each row execute function activate_profile_on_confirmation();
