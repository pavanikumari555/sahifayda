create extension if not exists pg_cron;
create extension if not exists pg_net with schema extensions;
revoke all on schema net from public,anon,authenticated;
revoke all on all functions in schema net from public,anon,authenticated;
revoke all on all tables in schema net from public,anon,authenticated;
create table public.source_watch_settings(id boolean primary key default true check(id),enabled boolean not null default true,last_run timestamptz);
create table public.source_watch(
 id uuid primary key default gen_random_uuid(),label text not null,source_url text unique not null,enabled boolean not null default true,
 content_hash text,last_checked timestamptz,check_status text not null default 'not_checked',excerpt text not null default ''
);
create table public.source_alerts(
 id bigint generated always as identity primary key,source_id uuid not null references public.source_watch(id),kind text not null,
 summary text not null,created_at timestamptz not null default now(),reviewed_at timestamptz,reviewed_by uuid references auth.users(id)
);
create table private.source_job_token_hash(id boolean primary key default true check(id),hash text not null);
alter table public.source_watch_settings enable row level security;
alter table public.source_watch enable row level security;
alter table public.source_alerts enable row level security;
alter table private.source_job_token_hash enable row level security;
revoke all on public.source_watch_settings,public.source_watch,public.source_alerts,private.source_job_token_hash from public,anon,authenticated;
grant all on public.source_watch_settings,public.source_watch,public.source_alerts,private.source_job_token_hash to service_role;
grant usage,select on sequence public.source_alerts_id_seq to service_role;
create policy source_settings_service_only on public.source_watch_settings for all to service_role using(true) with check(true);
create policy source_watch_service_only on public.source_watch for all to service_role using(true) with check(true);
create policy source_alerts_service_only on public.source_alerts for all to service_role using(true) with check(true);
create policy source_token_service_only on private.source_job_token_hash for all to service_role using(true) with check(true);
insert into public.source_watch_settings(id) values(true);
insert into public.source_watch(label,source_url) values
 ('IDFC FIRST WOW official product terms','https://www.idfcfirst.bank.in/credit-card/wow'),
 ('HDFC Biz First official eligibility','https://www.hdfc.bank.in/business-credit-cards/biz-first-credit-card'),
 ('NPCI UPI information','https://www.npci.org.in/what-we-do/upi/faqs'),
 ('Groq API limits','https://console.groq.com/docs/rate-limits'),
 ('Gemini API terms','https://ai.google.dev/gemini-api/terms');
do $$ begin
 if not exists(select 1 from vault.secrets where name='sahifayda_source_watch_token') then
  perform vault.create_secret(encode(extensions.gen_random_bytes(32),'hex'),'sahifayda_source_watch_token');
 end if;
 insert into private.source_job_token_hash(id,hash) select true,encode(extensions.digest(decrypted_secret,'sha256'),'hex') from vault.decrypted_secrets where name='sahifayda_source_watch_token';
end $$;
create function public.verify_source_job_token(p_token text) returns boolean language sql stable security invoker set search_path='' as $$
 select length(p_token)=64 and exists(select 1 from private.source_job_token_hash where hash=encode(extensions.digest(p_token,'sha256'),'hex'))
$$;
create function public.claim_source_watch() returns boolean language plpgsql security invoker set search_path='' as $$
declare claimed boolean;
begin
 update public.source_watch_settings set last_run=now() where id and enabled and (last_run is null or last_run<now()-interval '15 minutes') returning true into claimed;
 return coalesce(claimed,false);
end $$;
revoke all on function public.verify_source_job_token(text),public.claim_source_watch() from public,anon,authenticated;
grant execute on function public.verify_source_job_token(text),public.claim_source_watch() to service_role;
select cron.schedule('sahifayda_daily_review','30 4 * * *',$job$
 select net.http_post(
  url:='https://xkkmjuqziqrpggtgxlxc.supabase.co/functions/v1/source-watch',
  headers:=jsonb_build_object('Content-Type','application/json','X-Job-Token',(select decrypted_secret from vault.decrypted_secrets where name='sahifayda_source_watch_token' limit 1)),
  body:='{}'::jsonb,timeout_milliseconds:=120000
 );
$job$);
