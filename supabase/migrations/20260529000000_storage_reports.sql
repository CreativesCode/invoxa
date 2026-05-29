-- =============================================================================
-- Invoxa — Storage bucket for task reports (worked-hours justification PDFs)
-- =============================================================================
-- Bucket: reports
--   - Private (not public)
--   - 10 MB max file size
--   - Only application/pdf MIME type
--   - Path convention: {user_id}/tasks-{period_start}_{period_end}.pdf
--
-- A worker generates a monthly report of their tasks (grouped by project) to
-- hand to their manager as justification of the hours worked. Mirrors the
-- `invoices` bucket setup.
--
-- Policies on storage.objects (filtered to this bucket):
--   - Authenticated users can READ their own files (folder = their user id)
--   - Admins can READ all files
--   - INSERT/UPDATE/DELETE only happen via service_role (edge functions),
--     which bypasses RLS by design.
-- =============================================================================

-- Create the bucket if it doesn't exist
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'reports',
  'reports',
  false,
  10485760, -- 10 MB
  array['application/pdf']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Drop any prior versions of these policies to keep this migration idempotent
drop policy if exists "reports_pdf_owner_read" on storage.objects;
drop policy if exists "reports_pdf_admin_read" on storage.objects;

-- Owner read: the first folder in the path must match the caller's user id
create policy "reports_pdf_owner_read"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'reports'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Admin read: full access to the bucket
create policy "reports_pdf_admin_read"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'reports'
    and is_admin()
  );
