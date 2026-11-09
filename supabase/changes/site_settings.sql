-- Owner-managed homepage display settings (announcement, headline, example questions,
-- visible sections and calculators). Public read; writes only through admin-console.
create table if not exists public.site_settings (
 id boolean primary key default true check (id),
 content jsonb not null default '{}'::jsonb check (jsonb_typeof(content)='object' and octet_length(content::text)<=20000),
 revision integer not null default 1,
 updated_at timestamptz not null default now(),
 updated_by uuid references auth.users(id)
);
alter table public.site_settings enable row level security;
revoke all on public.site_settings from public,anon,authenticated;
grant select(content,revision,updated_at) on public.site_settings to anon,authenticated;
grant all on public.site_settings to service_role;
drop policy if exists public_read_site_settings on public.site_settings;
create policy public_read_site_settings on public.site_settings for select to anon,authenticated using (true);
insert into public.site_settings(id) values (true) on conflict (id) do nothing;
