-- =============================================================================
-- Invoxa — Auto-complete invoice_requests when an invoice is generated
-- =============================================================================
-- When `generate_user_invoice` (or any other path) inserts a row into
-- `invoices`, mark all matching pending invoice_requests for the same
-- (user_id, period_start, period_end) as completed. Avoids the admin having
-- to track that manually.
-- =============================================================================

create or replace function complete_invoice_requests_on_invoice()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update invoice_requests
  set status = 'completed',
      completed_at = now()
  where user_id = new.user_id
    and period_start = new.period_start
    and period_end = new.period_end
    and status = 'pending';
  return new;
end;
$$;

drop trigger if exists invoices_complete_requests on invoices;
create trigger invoices_complete_requests
  after insert on invoices
  for each row execute function complete_invoice_requests_on_invoice();
