-- Applied remotely as initial_public_service_status through Supabase MCP.
create table public.service_status (
  id text primary key,
  state text not null default 'active' check (state in ('active','paused','hidden')),
  message_en text not null default 'This tool is temporarily unavailable.',
  message_hi text not null default 'यह टूल अभी उपलब्ध नहीं है।',
  updated_at timestamptz not null default now()
);
alter table public.service_status enable row level security;
revoke all on public.service_status from anon, authenticated;
grant select on public.service_status to anon, authenticated;
grant all on public.service_status to service_role;
create policy public_service_status on public.service_status for select to anon, authenticated using (true);
insert into public.service_status(id,state) values ('monthly','active'),('compare','active'),('guidance','active'),('sia','paused');
comment on table public.service_status is 'Public tool availability only. No personal financial inputs. Only trusted management access can write until admin authorization is configured.';
