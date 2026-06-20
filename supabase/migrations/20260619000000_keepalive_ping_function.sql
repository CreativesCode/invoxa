-- =============================================================================
-- Invoxa — RPC `public.ping()` for keepalive
-- =============================================================================
-- Supabase free pauses the project after ~7 days without database activity.
-- A GitHub Actions cron invokes this function daily via
-- POST /rest/v1/rpc/ping with the anon key, keeping the project active.
--
-- "Touching" the REST API alone is not enough — Supabase's inactivity counter
-- measures activity on the database, not the edge. A trivial SQL RPC guarantees
-- the ping counts.
--
-- Returns `now()` so the ping is observable in the workflow logs.
--
-- Permissions:
--   - revoke all from public  → close the permissive default
--   - grant execute to anon, authenticated → enough for the ping; exposes
--     nothing sensitive (only the server clock).
-- =============================================================================

create or replace function public.ping()
returns timestamptz
language sql
stable
as $$
  select now();
$$;

revoke all on function public.ping() from public;
grant execute on function public.ping() to anon, authenticated;
