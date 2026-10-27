-- Commercial links are owner-managed. No customer finances are stored here.
create table public.partner_links (
 id uuid primary key default gen_random_uuid(),
 partner text not null check(length(partner) between 1 and 100),
 kind text not null check(kind in ('affiliate','referral')),
 category text not null default 'other' check(category in ('credit_card','savings_account','loan','demat','insurance','other')),
 eligibility_tag text not null default 'not_assessed' check(eligibility_tag in ('not_assessed','fd_backed','income_based')),
 title_en text not null check(length(title_en) between 1 and 120),
 title_hi text not null check(length(title_hi) between 1 and 120),
 description_en text not null default '' check(length(description_en)<=600),
 description_hi text not null default '' check(length(description_hi)<=600),
 destination_url text not null check(length(destination_url)<=2000 and destination_url like 'https://%'),
 terms_url text not null check(length(terms_url)<=2000 and terms_url like 'https://%'),
 disclosure_en text not null check(length(disclosure_en) between 20 and 600),
 disclosure_hi text not null check(length(disclosure_hi) between 20 and 600),
 state text not null default 'draft' check(state in ('draft','active','paused','archived')),
 promotion_approved boolean not null default false,
 approval_note text not null default '' check(length(approval_note)<=1200),
 reviewed_on date not null default current_date,
 expires_at timestamptz,
 sort_order integer not null default 100 check(sort_order between 0 and 9999),
 revision integer not null default 1,
 updated_by uuid references auth.users(id),
 updated_at timestamptz not null default now(),
 check(state<>'active' or (promotion_approved and length(approval_note)>=10))
);
alter table public.partner_links enable row level security;
revoke all on public.partner_links from public,anon,authenticated;
grant all on public.partner_links to service_role;
grant select(id,partner,kind,category,eligibility_tag,title_en,title_hi,description_en,description_hi,destination_url,terms_url,disclosure_en,disclosure_hi,reviewed_on,expires_at,sort_order) on public.partner_links to anon,authenticated;
create policy published_partner_links on public.partner_links for select to anon,authenticated using (
 state='active' and promotion_approved and reviewed_on>=current_date-90 and reviewed_on<=current_date
 and (expires_at is null or expires_at>now())
);
create function private.audit_partner_change() returns trigger language plpgsql security definer set search_path='' as $$
declare actor text;
begin
 select username into actor from public.admin_accounts where user_id=new.updated_by and enabled and role='owner';
 if actor is null then raise exception 'An enabled owner is required'; end if;
 new.updated_at:=now();
 if tg_op='UPDATE' then new.revision:=old.revision+1; else new.revision:=1; end if;
 insert into public.admin_activity(actor_id,actor_username,action,target,details)
 values(new.updated_by,actor,'partner.'||lower(tg_op),new.id::text,jsonb_build_object('state',new.state,'partner',new.partner,'revision',new.revision));
 return new;
end $$;
revoke all on function private.audit_partner_change() from public,anon,authenticated;
create trigger audit_partner_change before insert or update on public.partner_links for each row execute function private.audit_partner_change();

create table public.sia_config (
 id boolean primary key default true check(id),
 primary_provider text not null default 'groq' check(primary_provider in ('groq','gemini')),
 fallback_enabled boolean not null default true,
 groq_model text not null default 'openai/gpt-oss-20b' check(groq_model in ('openai/gpt-oss-20b','openai/gpt-oss-120b','qwen/qwen3.8-27b')),
 gemini_model text not null default 'gemini-2.5-flash-lite' check(gemini_model in ('gemini-2.5-flash-lite','gemini-3.1-flash-lite')),
 daily_limit integer not null default 100 check(daily_limit between 1 and 500),
 free_accounts_confirmed boolean not null default false,
 last_tested_at timestamptz,
 last_test_ok boolean not null default false,
 provider_checks jsonb not null default '{}'::jsonb,
 updated_at timestamptz not null default now()
);
alter table public.sia_config enable row level security;
revoke all on public.sia_config from public,anon,authenticated;
grant all on public.sia_config to service_role;
create policy sia_config_service_only on public.sia_config for all to service_role using(true) with check(true);
insert into public.sia_config(id) values(true);

create table private.sia_usage (
 day date not null, bucket text not null, attempts integer not null default 0,
 responses integer not null default 0, failures integer not null default 0,
 primary key(day,bucket)
);
alter table private.sia_usage enable row level security;
revoke all on private.sia_usage from public,anon,authenticated;
grant all on private.sia_usage to service_role;
create policy sia_service_only on private.sia_usage for all to service_role using(true) with check(true);
-- Reserve before contacting either provider. Global plus pseudonymous client caps.
create function public.reserve_sia_request(p_client text) returns boolean language plpgsql security invoker set search_path='' as $$
declare cap integer; used integer;
begin
 if p_client !~ '^[a-f0-9]{64}$' then return false; end if;
 perform pg_advisory_xact_lock(817221);
 select daily_limit into cap from public.sia_config where id and free_accounts_confirmed;
 if cap is null or not exists(select 1 from public.service_status where id='sia' and state='active') then return false; end if;
 select attempts into used from private.sia_usage where day=current_date and bucket='global';
 if coalesce(used,0)>=cap then return false; end if;
 select attempts into used from private.sia_usage where day=current_date and bucket=p_client;
 if coalesce(used,0)>=15 then return false; end if;
 insert into private.sia_usage(day,bucket,attempts) values(current_date,'global',1),(current_date,p_client,1)
 on conflict(day,bucket) do update set attempts=private.sia_usage.attempts+1;
 delete from private.sia_usage where day<current_date-7;
 return true;
end $$;
create function public.finish_sia_request(p_success boolean) returns void language sql security invoker set search_path='' as $$
 update private.sia_usage set responses=responses+case when p_success then 1 else 0 end,
 failures=failures+case when p_success then 0 else 1 end where day=current_date and bucket='global'
$$;
create function public.sia_usage_today() returns table(attempts integer,responses integer,failures integer) language sql security invoker set search_path='' as $$
 select attempts,responses,failures from private.sia_usage where day=current_date and bucket='global'
$$;
revoke all on function public.reserve_sia_request(text),public.finish_sia_request(boolean),public.sia_usage_today() from public,anon,authenticated;
grant execute on function public.reserve_sia_request(text),public.finish_sia_request(boolean),public.sia_usage_today() to service_role;
