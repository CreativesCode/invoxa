-- =============================================================================
-- Invoxa — In-app notifications
-- =============================================================================
-- Sólo notificaciones internas (no email/push). Se entregan al frontend vía
-- Supabase Realtime suscribiéndose a la tabla `notifications` filtrada por
-- `user_id = auth.uid()`.
--
-- Eventos cubiertos por triggers:
--   - invoice_requests INSERT
--       admin -> usuario destinatario (le piden la factura)
--   - invoice_requests UPDATE status -> completed/expired
--       admin que la creó (informa)
--   - invoices INSERT
--       admins (factura nueva pendiente de revisión)
--   - invoices UPDATE status (cualquier transición)
--       dueño de la factura (su estado cambió)
--   - invoice_number_change_requests INSERT
--       requester=user  -> admins (hay solicitud nueva)
--       requester=admin -> dueño de la factura (admin aplicó algo)
--   - invoice_number_change_requests UPDATE status
--       dueño de la factura (aprobada / rechazada / aplicada)
-- =============================================================================

create type notification_type as enum (
  'invoice_request_created',
  'invoice_request_completed',
  'invoice_request_expired',
  'invoice_created',
  'invoice_status_changed',
  'invoice_number_change_requested',
  'invoice_number_change_resolved'
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  type notification_type not null,
  title text not null,
  body text,
  -- Recurso al que apunta la notificación. Se usa para construir la URL de
  -- destino en el cliente sin tener que joinear nada.
  resource_table text,
  resource_id uuid,
  -- Datos adicionales que el cliente quiera mostrar (estado nuevo/anterior,
  -- número de factura, periodo, etc.).
  metadata jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_notifications_user_unread
  on notifications(user_id, created_at desc)
  where read_at is null;

create index idx_notifications_user_recent
  on notifications(user_id, created_at desc);

-- Realtime: publicación que el cliente suscribe ----------------------------
-- Supabase ya provee la publicación `supabase_realtime` por defecto.
alter publication supabase_realtime add table notifications;

-- RLS ----------------------------------------------------------------------
alter table notifications enable row level security;

-- El usuario sólo ve sus propias notificaciones; admin ve todas (útil para
-- soporte, no se expone en UI por defecto).
create policy "notifications_self_or_admin_read"
  on notifications for select
  using (user_id = auth.uid() or is_admin());

-- Sólo se permite marcar como leídas las propias. No se pueden cambiar otros
-- campos: el `with check` exige que el usuario siga siendo el dueño y que el
-- cuerpo no haya sido reescrito (la inserción la hacen los triggers como
-- SECURITY DEFINER, así que no se necesita policy de INSERT para usuarios).
create policy "notifications_self_mark_read"
  on notifications for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "notifications_admin_update"
  on notifications for update
  using (is_admin())
  with check (is_admin());

-- INSERT/DELETE quedan restringidos a service_role / SECURITY DEFINER. No se
-- agregan policies, así RLS bloquea la inserción directa desde el cliente.

-- Helper de inserción --------------------------------------------------------
create or replace function notify_user(
  p_user_id uuid,
  p_type notification_type,
  p_title text,
  p_body text default null,
  p_resource_table text default null,
  p_resource_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  if p_user_id is null then
    return null;
  end if;

  insert into notifications (
    user_id, type, title, body, resource_table, resource_id, metadata
  ) values (
    p_user_id, p_type, p_title, p_body, p_resource_table, p_resource_id,
    coalesce(p_metadata, '{}'::jsonb)
  )
  returning id into v_id;

  return v_id;
end;
$$;

-- Helper para describir un periodo en formato corto en español -------------
create or replace function format_period(p_start date, p_end date)
returns text
language sql
immutable
as $$
  select to_char(p_start, 'YYYY-MM-DD') || ' a ' || to_char(p_end, 'YYYY-MM-DD');
$$;

-- =============================================================================
-- Triggers: invoice_requests
-- =============================================================================
create or replace function notify_on_invoice_request_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_period text := format_period(new.period_start, new.period_end);
begin
  if tg_op = 'INSERT' then
    -- Notificar al usuario al que le piden la factura.
    perform notify_user(
      new.user_id,
      'invoice_request_created',
      'Nueva solicitud de factura',
      'Tienes una solicitud para generar tu factura del periodo ' || v_period || '.',
      'invoice_requests',
      new.id,
      jsonb_build_object(
        'period_start', new.period_start,
        'period_end', new.period_end,
        'requested_by', new.requested_by
      )
    );
    return new;
  end if;

  if tg_op = 'UPDATE' and new.status is distinct from old.status then
    if new.status = 'completed' then
      -- Avisar al admin que pidió la factura que ya fue generada.
      perform notify_user(
        new.requested_by,
        'invoice_request_completed',
        'Solicitud de factura completada',
        'La solicitud para el periodo ' || v_period || ' fue completada.',
        'invoice_requests',
        new.id,
        jsonb_build_object(
          'period_start', new.period_start,
          'period_end', new.period_end,
          'user_id', new.user_id
        )
      );
    elsif new.status = 'expired' then
      perform notify_user(
        new.requested_by,
        'invoice_request_expired',
        'Solicitud de factura expirada',
        'La solicitud para el periodo ' || v_period || ' expiró sin respuesta.',
        'invoice_requests',
        new.id,
        jsonb_build_object(
          'period_start', new.period_start,
          'period_end', new.period_end,
          'user_id', new.user_id
        )
      );
    end if;
    return new;
  end if;

  return new;
end;
$$;

drop trigger if exists invoice_requests_notify on invoice_requests;
create trigger invoice_requests_notify
  after insert or update on invoice_requests
  for each row execute function notify_on_invoice_request_change();

-- =============================================================================
-- Triggers: invoices
-- =============================================================================
create or replace function notify_on_invoice_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin_id uuid;
  v_period text;
begin
  if tg_op = 'INSERT' then
    v_period := format_period(new.period_start, new.period_end);
    -- Avisar a todos los admins activos que hay una factura nueva por revisar.
    for v_admin_id in
      select id from profiles where role = 'admin' and status = 'active'
    loop
      perform notify_user(
        v_admin_id,
        'invoice_created',
        'Nueva factura generada',
        'La factura ' || new.invoice_number || ' (' || v_period || ') está lista para revisión.',
        'invoices',
        new.id,
        jsonb_build_object(
          'invoice_number', new.invoice_number,
          'user_id', new.user_id,
          'period_start', new.period_start,
          'period_end', new.period_end,
          'total', new.total,
          'currency', new.currency
        )
      );
    end loop;
    return new;
  end if;

  if tg_op = 'UPDATE' and new.status is distinct from old.status then
    -- Avisar al dueño de la factura del cambio de estado.
    perform notify_user(
      new.user_id,
      'invoice_status_changed',
      'Tu factura cambió de estado',
      'La factura ' || new.invoice_number || ' pasó de ' || old.status || ' a ' || new.status || '.',
      'invoices',
      new.id,
      jsonb_build_object(
        'invoice_number', new.invoice_number,
        'previous_status', old.status,
        'new_status', new.status
      )
    );
    return new;
  end if;

  return new;
end;
$$;

drop trigger if exists invoices_notify on invoices;
create trigger invoices_notify
  after insert or update on invoices
  for each row execute function notify_on_invoice_change();

-- =============================================================================
-- Triggers: invoice_number_change_requests
-- =============================================================================
create or replace function notify_on_invoice_number_change_request()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin_id uuid;
  v_invoice_owner uuid;
begin
  select user_id into v_invoice_owner
  from invoices where id = coalesce(new.invoice_id, old.invoice_id);

  if tg_op = 'INSERT' then
    if new.requested_by_role = 'user' then
      -- Notificar a todos los admins de la nueva solicitud.
      for v_admin_id in
        select id from profiles where role = 'admin' and status = 'active'
      loop
        perform notify_user(
          v_admin_id,
          'invoice_number_change_requested',
          'Nueva solicitud de cambio de consecutivo',
          'Hay una solicitud para cambiar ' || new.current_invoice_number ||
            ' por ' || new.requested_invoice_number || '.',
          'invoice_number_change_requests',
          new.id,
          jsonb_build_object(
            'invoice_id', new.invoice_id,
            'current_invoice_number', new.current_invoice_number,
            'requested_invoice_number', new.requested_invoice_number,
            'requested_by', new.requested_by
          )
        );
      end loop;
    else
      -- Cambio aplicado directamente por admin: avisar al dueño de la factura.
      if v_invoice_owner is not null and v_invoice_owner <> new.requested_by then
        perform notify_user(
          v_invoice_owner,
          'invoice_number_change_resolved',
          'Tu factura cambió de número',
          'El número de factura cambió de ' || new.current_invoice_number ||
            ' a ' || new.requested_invoice_number || '.',
          'invoice_number_change_requests',
          new.id,
          jsonb_build_object(
            'invoice_id', new.invoice_id,
            'current_invoice_number', new.current_invoice_number,
            'requested_invoice_number', new.requested_invoice_number,
            'status', new.status
          )
        );
      end if;
    end if;
    return new;
  end if;

  if tg_op = 'UPDATE' and new.status is distinct from old.status then
    -- Sólo notificamos resoluciones (approved / rejected / applied) al usuario
    -- que originó la solicitud. Si el solicitante fue admin no se notifica a
    -- sí mismo (ya lo hace el INSERT contra el dueño de la factura).
    if new.status in ('approved', 'rejected', 'applied')
       and new.requested_by_role = 'user' then
      perform notify_user(
        new.requested_by,
        'invoice_number_change_resolved',
        case new.status
          when 'approved' then 'Tu solicitud fue aprobada'
          when 'rejected' then 'Tu solicitud fue rechazada'
          when 'applied'  then 'El cambio de consecutivo fue aplicado'
        end,
        case
          when new.status = 'rejected' and new.review_notes is not null
            then 'Motivo: ' || new.review_notes
          else 'Solicitud para cambiar ' || new.current_invoice_number ||
               ' por ' || new.requested_invoice_number || '.'
        end,
        'invoice_number_change_requests',
        new.id,
        jsonb_build_object(
          'invoice_id', new.invoice_id,
          'previous_status', old.status,
          'new_status', new.status,
          'review_notes', new.review_notes
        )
      );
    end if;
    return new;
  end if;

  return new;
end;
$$;

drop trigger if exists invoice_number_change_requests_notify
  on invoice_number_change_requests;
create trigger invoice_number_change_requests_notify
  after insert or update on invoice_number_change_requests
  for each row execute function notify_on_invoice_number_change_request();
