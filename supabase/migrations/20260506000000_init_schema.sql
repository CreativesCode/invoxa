-- =============================================================================
-- Invoxa — Initial schema
-- =============================================================================
-- Implements the data model defined in docs/instructions.md sections 8 and 6.
-- Multi-project monthly invoices: a single invoice per (user, period) groups
-- items from all projects the user participated in.
-- Per-user invoice number sequences with admin-controlled change requests.
-- =============================================================================

-- Required extensions ---------------------------------------------------------
create extension if not exists "pgcrypto";

-- Enums ------------------------------------------------------------------------
create type user_role as enum ('admin', 'user');
create type user_status as enum ('active', 'inactive', 'invited');
create type project_status as enum ('active', 'inactive');
create type payment_type as enum ('hourly', 'fixed');
create type invoice_status as enum (
  'draft',
  'generated',
  'sent',
  'reviewed',
  'approved',
  'rejected',
  'paid',
  'cancelled'
);
create type invoice_request_status as enum ('pending', 'completed', 'expired');
create type invoice_number_change_status as enum (
  'pending',
  'approved',
  'rejected',
  'applied'
);
create type email_status as enum ('pending', 'sent', 'failed');
create type email_type as enum (
  'invitation',
  'invoice_request',
  'invoice_generated',
  'invoice_number_change_request',
  'invoice_number_change_resolved'
);

-- Helper function: keep updated_at fresh -------------------------------------
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- profiles --------------------------------------------------------------------
-- Extends Supabase Auth users with role and status info.
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text not null,
  user_code text unique,           -- short code used in invoice numbers (e.g. RCA)
  role user_role not null default 'user',
  status user_status not null default 'invited',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on profiles
  for each row execute function set_updated_at();

-- user_billing_profiles -------------------------------------------------------
create table user_billing_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references profiles(id) on delete cascade,
  legal_name text,
  tax_id text,
  address text,
  city text,
  country text,
  billing_email text,
  bank_name text,
  bank_account text,
  payment_method text,
  default_invoice_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger user_billing_profiles_set_updated_at
  before update on user_billing_profiles
  for each row execute function set_updated_at();

-- projects --------------------------------------------------------------------
create table projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  status project_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger projects_set_updated_at
  before update on projects
  for each row execute function set_updated_at();

-- user_project_assignments ----------------------------------------------------
-- N:M relation; a user can belong to many projects simultaneously.
create table user_project_assignments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  project_id uuid not null references projects(id) on delete cascade,
  is_current boolean not null default true,
  start_date date not null default current_date,
  end_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, project_id, start_date)
);

create index idx_user_project_assignments_user on user_project_assignments(user_id);
create index idx_user_project_assignments_project on user_project_assignments(project_id);

create trigger user_project_assignments_set_updated_at
  before update on user_project_assignments
  for each row execute function set_updated_at();

-- compensation_settings -------------------------------------------------------
-- Per user/project compensation. A user can have different rates per project.
create table compensation_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  project_id uuid not null references projects(id) on delete cascade,
  payment_type payment_type not null,
  hourly_rate numeric(12, 2),
  monthly_rate numeric(12, 2),
  currency text not null default 'USD',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint compensation_rate_consistency check (
    (payment_type = 'hourly' and hourly_rate is not null) or
    (payment_type = 'fixed' and monthly_rate is not null)
  )
);

create unique index idx_compensation_active_per_user_project
  on compensation_settings(user_id, project_id)
  where is_active = true;

create trigger compensation_settings_set_updated_at
  before update on compensation_settings
  for each row execute function set_updated_at();

-- invoices --------------------------------------------------------------------
-- One invoice per user per period. project_id removed because a single invoice
-- can group multiple projects; per-project breakdown lives in invoice_items.
create table invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete restrict,
  invoice_number text not null unique,
  user_invoice_sequence integer not null,
  invoice_date date not null,
  period_start date not null,
  period_end date not null,
  currency text not null,
  subtotal numeric(14, 2) not null default 0,
  tax_amount numeric(14, 2) not null default 0,
  total numeric(14, 2) not null default 0,
  status invoice_status not null default 'draft',
  notes text,
  pdf_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint invoices_period_valid check (period_end >= period_start),
  unique (user_id, user_invoice_sequence)
);

-- A single non-cancelled invoice per (user, period) — section 14 rule.
create unique index idx_invoices_unique_period
  on invoices(user_id, period_start, period_end)
  where status <> 'cancelled';

create index idx_invoices_user on invoices(user_id);
create index idx_invoices_status on invoices(status);

create trigger invoices_set_updated_at
  before update on invoices
  for each row execute function set_updated_at();

-- invoice_items ---------------------------------------------------------------
-- Each item is tied to a specific project and payment_type, enabling mixed
-- hourly/fixed lines in the same invoice.
create table invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references invoices(id) on delete cascade,
  project_id uuid not null references projects(id) on delete restrict,
  payment_type payment_type not null,
  description text not null,
  quantity numeric(12, 2) not null,
  unit_price numeric(12, 2) not null,
  total numeric(14, 2) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_invoice_items_invoice on invoice_items(invoice_id);
create index idx_invoice_items_project on invoice_items(project_id);

create trigger invoice_items_set_updated_at
  before update on invoice_items
  for each row execute function set_updated_at();

-- tasks -----------------------------------------------------------------------
-- Hourly users only. invoice_id is set when the task gets billed.
create table tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  project_id uuid not null references projects(id) on delete restrict,
  invoice_id uuid references invoices(id) on delete set null,
  name text not null,
  description text,
  task_date date not null,
  hours numeric(6, 2) not null check (hours > 0),
  observations text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_tasks_user_date on tasks(user_id, task_date);
create index idx_tasks_project on tasks(project_id);
create index idx_tasks_invoice on tasks(invoice_id);

create trigger tasks_set_updated_at
  before update on tasks
  for each row execute function set_updated_at();

-- invoice_requests ------------------------------------------------------------
create table invoice_requests (
  id uuid primary key default gen_random_uuid(),
  requested_by uuid not null references profiles(id) on delete restrict,
  user_id uuid not null references profiles(id) on delete cascade,
  period_start date not null,
  period_end date not null,
  status invoice_request_status not null default 'pending',
  sent_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint invoice_requests_period_valid check (period_end >= period_start)
);

create index idx_invoice_requests_user on invoice_requests(user_id);
create index idx_invoice_requests_status on invoice_requests(status);

create trigger invoice_requests_set_updated_at
  before update on invoice_requests
  for each row execute function set_updated_at();

-- invoice_number_change_requests ---------------------------------------------
-- User-submitted requests need admin approval; admin-submitted apply directly.
create table invoice_number_change_requests (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references invoices(id) on delete cascade,
  requested_by uuid not null references profiles(id) on delete restrict,
  requested_by_role user_role not null,
  current_invoice_number text not null,
  requested_invoice_number text not null,
  reason text,
  status invoice_number_change_status not null default 'pending',
  reviewed_by uuid references profiles(id) on delete set null,
  reviewed_at timestamptz,
  review_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_invoice_number_requests_invoice on invoice_number_change_requests(invoice_id);
create index idx_invoice_number_requests_status on invoice_number_change_requests(status);

create trigger invoice_number_change_requests_set_updated_at
  before update on invoice_number_change_requests
  for each row execute function set_updated_at();

-- invoice_number_history -----------------------------------------------------
-- Audit log of every consecutive number change applied to an invoice.
create table invoice_number_history (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references invoices(id) on delete cascade,
  previous_invoice_number text not null,
  new_invoice_number text not null,
  change_request_id uuid references invoice_number_change_requests(id) on delete set null,
  changed_by uuid not null references profiles(id) on delete restrict,
  changed_at timestamptz not null default now(),
  reason text
);

create index idx_invoice_number_history_invoice on invoice_number_history(invoice_id);

-- email_logs ------------------------------------------------------------------
create table email_logs (
  id uuid primary key default gen_random_uuid(),
  recipient_email text not null,
  subject text not null,
  type email_type not null,
  status email_status not null default 'pending',
  provider_response jsonb,
  created_at timestamptz not null default now()
);

create index idx_email_logs_recipient on email_logs(recipient_email);
create index idx_email_logs_type on email_logs(type);
