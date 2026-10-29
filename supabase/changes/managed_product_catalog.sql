-- Public information only. Customer applications and chat are never stored here.
create table public.product_catalog (
 id text primary key check (id ~ '^[a-z][a-z0-9_]{0,63}$'),
 name text not null check (length(name) between 1 and 120),
 category text not null check(category in ('credit_card','savings_account','demat','loan','insurance','credit_line','other','shopping')),
 state text not null default 'draft' check(state in ('draft','active','paused','archived')),
 reviewed_on date not null, review_until date not null,
 content jsonb not null check(jsonb_typeof(content)='object' and octet_length(content::text)<=60000),
 revision integer not null default 1, updated_at timestamptz not null default now(), updated_by uuid references auth.users(id),
 check(review_until>=reviewed_on and review_until<=reviewed_on+90)
);
alter table public.product_catalog enable row level security;
revoke all on public.product_catalog from anon,authenticated;
grant select(id,name,category,state,reviewed_on,review_until,content,revision) on public.product_catalog to anon,authenticated;
grant all on public.product_catalog to service_role;
create policy public_active_products on public.product_catalog for select to anon,authenticated using (state='active');
create index product_catalog_category_state on public.product_catalog(category,state);
create function private.audit_catalog_change() returns trigger language plpgsql set search_path='' as $$
begin
 if tg_op='UPDATE' then new.revision=old.revision+1; end if;
 new.updated_at=now();
 insert into public.admin_activity(actor_id,actor_username,action,target,details)
 select new.updated_by,a.username,'catalog.'||lower(tg_op),new.id,jsonb_build_object('state',new.state,'revision',new.revision)
 from public.admin_accounts a where a.user_id=new.updated_by;
 return new;
end $$;
revoke all on function private.audit_catalog_change() from public,anon,authenticated;
create trigger audit_product_catalog before insert or update on public.product_catalog for each row execute function private.audit_catalog_change();

alter table public.partner_links drop constraint partner_links_category_check;
alter table public.partner_links add constraint partner_links_category_check check(category in ('credit_card','savings_account','loan','demat','insurance','other','credit_line','shopping'));
alter table public.partner_reports drop constraint partner_reports_event_type_check;
alter table public.partner_reports add constraint partner_reports_event_type_check check(event_type in ('account_opened','card_issued','loan_disbursed','policy_issued','other','application_submitted','loan_approved','purchase_completed','app_activated'));

-- A paused/expired product also blocks every mapped commercial route.
create policy mapped_product_available on public.partner_links as restrictive for select to anon,authenticated using (
 product_key is null or exists(select 1 from public.product_catalog p where p.id=product_key and p.state='active' and p.reviewed_on<=current_date and p.review_until>=current_date)
);
create or replace function public.record_partner_click(p_link uuid,p_event uuid) returns boolean language plpgsql set search_path='' as $$
declare created integer; item public.partner_links%rowtype;
begin
 select * into item from public.partner_links where id=p_link and state='active' and promotion_approved
 and reviewed_on between current_date-90 and current_date and (expires_at is null or expires_at>now()) for share;
 if not found then return false; end if;
 if item.product_key is not null then
  perform 1 from public.product_catalog where id=item.product_key and state='active' and category=item.category and reviewed_on<=current_date and review_until>=current_date for share;
  if not found then return false; end if;
 end if;
 insert into private.partner_click_events(event_id,link_id) values(p_event,p_link) on conflict(event_id) do nothing;
 get diagnostics created=row_count;
 if created=1 then
  insert into private.partner_daily_stats(link_id,day,clicks) values(p_link,current_date,1)
  on conflict(link_id,day) do update set clicks=private.partner_daily_stats.clicks+1;
 elsif not exists(select 1 from private.partner_click_events where event_id=p_event and link_id=p_link) then return false;
 end if;
 delete from private.partner_click_events where occurred_at<now()-interval '90 days';
 return true;
end $$;
