-- =============================================================================
-- Invoxa — Fix ambiguous column reference in generate_user_invoice
-- =============================================================================
-- The previous version returned a `table (invoice_id uuid, ...)`. The OUT
-- column names collided with real columns of the same name in `invoices`,
-- `invoice_items` and `tasks`, so PostgreSQL raised
--   "column reference invoice_id is ambiguous"
-- on the INSERT/UPDATE statements.
--
-- Fix: return jsonb instead. No OUT params, no name collisions.
-- =============================================================================

drop function if exists generate_user_invoice(uuid, date, date);

create or replace function generate_user_invoice(
  p_user_id uuid,
  p_period_start date,
  p_period_end date
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_year integer;
  v_invoice_number text;
  v_user_invoice_sequence integer;
  v_billing_complete boolean;
  v_currency text;
  v_currency_count integer;
  v_subtotal numeric := 0;
  v_invoice_id uuid;
  v_compensation record;
  v_total_hours numeric;
  v_project_subtotal numeric;
  v_project_count integer := 0;
begin
  if p_period_end < p_period_start then
    raise exception 'period_end debe ser igual o posterior a period_start';
  end if;

  -- 1. User active
  if not exists (
    select 1 from profiles where id = p_user_id and status = 'active'
  ) then
    raise exception 'Usuario no activo';
  end if;

  -- 2. Billing profile complete
  select
    legal_name is not null and length(legal_name) > 0
    and tax_id is not null and length(tax_id) > 0
    and billing_email is not null and length(billing_email) > 0
    and country is not null and length(country) > 0
  into v_billing_complete
  from user_billing_profiles
  where user_id = p_user_id;

  if v_billing_complete is null or v_billing_complete = false then
    raise exception 'Perfil de facturación incompleto';
  end if;

  -- 3. No existing non-cancelled invoice for this period
  if exists (
    select 1 from invoices
    where user_id = p_user_id
      and period_start = p_period_start
      and period_end = p_period_end
      and status <> 'cancelled'
  ) then
    raise exception 'Ya existe una factura para este periodo';
  end if;

  -- 4. Currency consistency check
  select count(distinct cs.currency)
  into v_currency_count
  from compensation_settings cs
  inner join user_project_assignments upa
    on upa.user_id = cs.user_id
    and upa.project_id = cs.project_id
  where cs.user_id = p_user_id
    and cs.is_active = true
    and upa.is_current = true;

  if v_currency_count > 1 then
    raise exception 'Tienes proyectos con monedas distintas. Genera facturas separadas o unifica la moneda';
  end if;

  if v_currency_count = 0 then
    raise exception 'No tienes proyectos activos en este periodo';
  end if;

  select cs.currency
  into v_currency
  from compensation_settings cs
  inner join user_project_assignments upa
    on upa.user_id = cs.user_id
    and upa.project_id = cs.project_id
  where cs.user_id = p_user_id
    and cs.is_active = true
    and upa.is_current = true
  limit 1;

  -- 5. Generate invoice number
  v_year := extract(year from p_period_start)::integer;

  select t.invoice_number, t.sequence_number
  into v_invoice_number, v_user_invoice_sequence
  from next_invoice_number(p_user_id, v_year) t;

  -- 6. Insert invoice header
  insert into invoices (
    user_id,
    invoice_number,
    user_invoice_sequence,
    invoice_date,
    period_start,
    period_end,
    currency,
    subtotal,
    tax_amount,
    total,
    status
  )
  values (
    p_user_id,
    v_invoice_number,
    v_user_invoice_sequence,
    current_date,
    p_period_start,
    p_period_end,
    v_currency,
    0,
    0,
    0,
    'generated'
  )
  returning invoices.id into v_invoice_id;

  -- 7. Per-project items
  for v_compensation in (
    select
      cs.project_id,
      cs.payment_type,
      cs.hourly_rate,
      cs.monthly_rate,
      cs.currency,
      p.name as project_name
    from compensation_settings cs
    inner join user_project_assignments upa
      on upa.user_id = cs.user_id
      and upa.project_id = cs.project_id
    inner join projects p on p.id = cs.project_id
    where cs.user_id = p_user_id
      and cs.is_active = true
      and upa.is_current = true
    order by p.name
  ) loop
    if v_compensation.payment_type = 'hourly' then
      select coalesce(sum(t.hours), 0)
      into v_total_hours
      from tasks t
      where t.user_id = p_user_id
        and t.project_id = v_compensation.project_id
        and t.task_date >= p_period_start
        and t.task_date <= p_period_end
        and t.invoice_id is null;

      if v_total_hours > 0 then
        v_project_subtotal := v_total_hours * v_compensation.hourly_rate;
        v_subtotal := v_subtotal + v_project_subtotal;
        v_project_count := v_project_count + 1;

        insert into invoice_items (
          invoice_id,
          project_id,
          payment_type,
          description,
          quantity,
          unit_price,
          total
        )
        values (
          v_invoice_id,
          v_compensation.project_id,
          'hourly',
          'Horas trabajadas — ' || v_compensation.project_name,
          v_total_hours,
          v_compensation.hourly_rate,
          v_project_subtotal
        );

        update tasks t
        set invoice_id = v_invoice_id
        where t.user_id = p_user_id
          and t.project_id = v_compensation.project_id
          and t.task_date >= p_period_start
          and t.task_date <= p_period_end
          and t.invoice_id is null;
      end if;
    else
      v_project_subtotal := v_compensation.monthly_rate;
      v_subtotal := v_subtotal + v_project_subtotal;
      v_project_count := v_project_count + 1;

      insert into invoice_items (
        invoice_id,
        project_id,
        payment_type,
        description,
        quantity,
        unit_price,
        total
      )
      values (
        v_invoice_id,
        v_compensation.project_id,
        'fixed',
        'Tarifa mensual — ' || v_compensation.project_name,
        1,
        v_compensation.monthly_rate,
        v_project_subtotal
      );
    end if;
  end loop;

  if v_project_count = 0 then
    raise exception 'No hay horas registradas ni proyectos con tarifa fija para facturar en este periodo';
  end if;

  update invoices
  set subtotal = v_subtotal,
      total = v_subtotal
  where invoices.id = v_invoice_id;

  return jsonb_build_object(
    'invoice_id', v_invoice_id,
    'invoice_number', v_invoice_number,
    'total', v_subtotal,
    'currency', v_currency
  );
end;
$$;
