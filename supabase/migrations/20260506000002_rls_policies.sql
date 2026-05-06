-- =============================================================================
-- Invoxa — Row Level Security policies
-- =============================================================================
-- Implements section 9 of docs/instructions.md.
--
-- Conventions:
-- - All tables have RLS enabled.
-- - Admin (is_admin()) has full access.
-- - Users only see/touch their own data.
-- - Sensitive write paths (invoice creation, number changes, email_logs) run
--   from Edge Functions using the service_role key, which bypasses RLS by
--   design.
-- =============================================================================

-- profiles --------------------------------------------------------------------
alter table profiles enable row level security;

create policy "profiles_self_or_admin_read"
  on profiles for select
  using (id = auth.uid() or is_admin());

create policy "profiles_self_update_safe_fields"
  on profiles for update
  using (id = auth.uid())
  with check (
    id = auth.uid()
    -- Users cannot promote themselves; role/status changes go through admin.
    and role = (select role from profiles p2 where p2.id = auth.uid())
    and status = (select status from profiles p2 where p2.id = auth.uid())
  );

create policy "profiles_admin_full_update"
  on profiles for update
  using (is_admin())
  with check (is_admin());

create policy "profiles_admin_insert"
  on profiles for insert
  with check (is_admin());

create policy "profiles_admin_delete"
  on profiles for delete
  using (is_admin());

-- user_billing_profiles -------------------------------------------------------
alter table user_billing_profiles enable row level security;

create policy "billing_profiles_self_or_admin_read"
  on user_billing_profiles for select
  using (user_id = auth.uid() or is_admin());

create policy "billing_profiles_self_or_admin_insert"
  on user_billing_profiles for insert
  with check (user_id = auth.uid() or is_admin());

create policy "billing_profiles_self_or_admin_update"
  on user_billing_profiles for update
  using (user_id = auth.uid() or is_admin())
  with check (user_id = auth.uid() or is_admin());

create policy "billing_profiles_admin_delete"
  on user_billing_profiles for delete
  using (is_admin());

-- projects --------------------------------------------------------------------
alter table projects enable row level security;

-- All authenticated users can read projects. The detail view (members,
-- compensation, invoices) is restricted by the per-table policies below.
create policy "projects_authenticated_read"
  on projects for select
  to authenticated
  using (true);

create policy "projects_admin_insert"
  on projects for insert
  with check (is_admin());

create policy "projects_admin_update"
  on projects for update
  using (is_admin())
  with check (is_admin());

create policy "projects_admin_delete"
  on projects for delete
  using (is_admin());

-- user_project_assignments ----------------------------------------------------
alter table user_project_assignments enable row level security;

create policy "assignments_self_or_admin_read"
  on user_project_assignments for select
  using (user_id = auth.uid() or is_admin());

create policy "assignments_admin_insert"
  on user_project_assignments for insert
  with check (is_admin());

create policy "assignments_admin_update"
  on user_project_assignments for update
  using (is_admin())
  with check (is_admin());

create policy "assignments_admin_delete"
  on user_project_assignments for delete
  using (is_admin());

-- compensation_settings -------------------------------------------------------
alter table compensation_settings enable row level security;

create policy "compensation_self_or_admin_read"
  on compensation_settings for select
  using (user_id = auth.uid() or is_admin());

create policy "compensation_admin_insert"
  on compensation_settings for insert
  with check (is_admin());

create policy "compensation_admin_update"
  on compensation_settings for update
  using (is_admin())
  with check (is_admin());

create policy "compensation_admin_delete"
  on compensation_settings for delete
  using (is_admin());

-- tasks -----------------------------------------------------------------------
alter table tasks enable row level security;

create policy "tasks_self_or_admin_read"
  on tasks for select
  using (user_id = auth.uid() or is_admin());

create policy "tasks_self_insert"
  on tasks for insert
  with check (user_id = auth.uid() or is_admin());

-- Users can only edit/delete their own tasks while not yet billed.
create policy "tasks_self_update_unbilled"
  on tasks for update
  using (
    (user_id = auth.uid() and invoice_id is null)
    or is_admin()
  )
  with check (
    (user_id = auth.uid() and invoice_id is null)
    or is_admin()
  );

create policy "tasks_self_delete_unbilled"
  on tasks for delete
  using (
    (user_id = auth.uid() and invoice_id is null)
    or is_admin()
  );

-- invoices --------------------------------------------------------------------
alter table invoices enable row level security;

create policy "invoices_self_or_admin_read"
  on invoices for select
  using (user_id = auth.uid() or is_admin());

-- Invoice creation/update goes through Edge Functions with service_role, which
-- bypasses RLS. We still allow admins to act directly from authenticated
-- contexts (e.g. status changes from the admin panel).
create policy "invoices_admin_insert"
  on invoices for insert
  with check (is_admin());

create policy "invoices_admin_update"
  on invoices for update
  using (is_admin())
  with check (is_admin());

create policy "invoices_admin_delete"
  on invoices for delete
  using (is_admin());

-- invoice_items ---------------------------------------------------------------
alter table invoice_items enable row level security;

create policy "invoice_items_self_or_admin_read"
  on invoice_items for select
  using (
    is_admin()
    or exists (
      select 1 from invoices i
      where i.id = invoice_items.invoice_id
        and i.user_id = auth.uid()
    )
  );

create policy "invoice_items_admin_insert"
  on invoice_items for insert
  with check (is_admin());

create policy "invoice_items_admin_update"
  on invoice_items for update
  using (is_admin())
  with check (is_admin());

create policy "invoice_items_admin_delete"
  on invoice_items for delete
  using (is_admin());

-- invoice_requests ------------------------------------------------------------
alter table invoice_requests enable row level security;

create policy "invoice_requests_self_or_admin_read"
  on invoice_requests for select
  using (user_id = auth.uid() or is_admin());

create policy "invoice_requests_admin_insert"
  on invoice_requests for insert
  with check (is_admin());

create policy "invoice_requests_admin_update"
  on invoice_requests for update
  using (is_admin())
  with check (is_admin());

create policy "invoice_requests_admin_delete"
  on invoice_requests for delete
  using (is_admin());

-- invoice_number_change_requests ---------------------------------------------
alter table invoice_number_change_requests enable row level security;

create policy "invoice_number_requests_self_or_admin_read"
  on invoice_number_change_requests for select
  using (
    is_admin()
    or requested_by = auth.uid()
    or exists (
      select 1 from invoices i
      where i.id = invoice_number_change_requests.invoice_id
        and i.user_id = auth.uid()
    )
  );

-- Users can request changes only for their own invoices, and only as 'pending'.
-- Admins can insert directly with any status (used when applying a change
-- without a prior user request).
create policy "invoice_number_requests_user_insert_for_own"
  on invoice_number_change_requests for insert
  with check (
    is_admin()
    or (
      requested_by = auth.uid()
      and requested_by_role = 'user'
      and status = 'pending'
      and exists (
        select 1 from invoices i
        where i.id = invoice_number_change_requests.invoice_id
          and i.user_id = auth.uid()
      )
    )
  );

-- Only admins can review/approve/reject. Users cannot edit a submitted
-- request — they would need to cancel and resubmit (admin-only delete).
create policy "invoice_number_requests_admin_update"
  on invoice_number_change_requests for update
  using (is_admin())
  with check (is_admin());

create policy "invoice_number_requests_admin_delete"
  on invoice_number_change_requests for delete
  using (is_admin());

-- invoice_number_history -----------------------------------------------------
alter table invoice_number_history enable row level security;

create policy "invoice_number_history_self_or_admin_read"
  on invoice_number_history for select
  using (
    is_admin()
    or exists (
      select 1 from invoices i
      where i.id = invoice_number_history.invoice_id
        and i.user_id = auth.uid()
    )
  );

-- History rows are inserted by SECURITY DEFINER functions / Edge Functions.
-- No direct writes from regular sessions.
create policy "invoice_number_history_admin_insert"
  on invoice_number_history for insert
  with check (is_admin());

-- email_logs ------------------------------------------------------------------
alter table email_logs enable row level security;

-- Email logs may include sensitive info; only admin can read.
create policy "email_logs_admin_read"
  on email_logs for select
  using (is_admin());

create policy "email_logs_admin_insert"
  on email_logs for insert
  with check (is_admin());
