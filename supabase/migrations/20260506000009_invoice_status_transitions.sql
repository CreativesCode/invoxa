-- =============================================================================
-- Invoxa — Enforce invoice status transitions
-- =============================================================================
-- A factura sigue un workflow lineal con dos estados terminales:
--   draft     -> generated | cancelled
--   generated -> sent | reviewed | approved | rejected | cancelled
--   sent      -> reviewed | approved | rejected | cancelled
--   reviewed  -> approved | rejected | cancelled
--   approved  -> paid | cancelled
--   rejected  -> generated | cancelled
--   paid      -> (terminal)
--   cancelled -> (terminal)
--
-- The check runs as a BEFORE UPDATE trigger so any path (admin panel, edge
-- function, RPC) is forced through it. SECURITY DEFINER triggers like the
-- one that auto-completes invoice_requests are unaffected because they
-- target *other* tables.
-- =============================================================================

create or replace function check_invoice_status_transition()
returns trigger
language plpgsql
as $$
declare
  v_allowed boolean;
begin
  if new.status = old.status then
    return new;
  end if;

  v_allowed := case old.status
    when 'draft'     then new.status in ('generated', 'cancelled')
    when 'generated' then new.status in ('sent', 'reviewed', 'approved', 'rejected', 'cancelled')
    when 'sent'      then new.status in ('reviewed', 'approved', 'rejected', 'cancelled')
    when 'reviewed'  then new.status in ('approved', 'rejected', 'cancelled')
    when 'approved'  then new.status in ('paid', 'cancelled')
    when 'rejected'  then new.status in ('generated', 'cancelled')
    when 'paid'      then false
    when 'cancelled' then false
    else false
  end;

  if not v_allowed then
    raise exception
      'Transición de estado no permitida: % → %', old.status, new.status;
  end if;

  return new;
end;
$$;

drop trigger if exists invoices_check_status_transition on invoices;
create trigger invoices_check_status_transition
  before update of status on invoices
  for each row execute function check_invoice_status_transition();
