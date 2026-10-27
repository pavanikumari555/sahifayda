alter table public.partner_links add column tracking_param text not null default '' check(tracking_param='' or tracking_param ~ '^[a-zA-Z][a-zA-Z0-9_]{0,39}$');
create table private.partner_click_events(
 event_id uuid primary key,link_id uuid not null references public.partner_links(id),occurred_at timestamptz not null default now()
);
create table private.partner_daily_stats(
 link_id uuid not null references public.partner_links(id),day date not null,clicks bigint not null default 0,primary key(link_id,day)
);
alter table private.partner_click_events enable row level security;
alter table private.partner_daily_stats enable row level security;
revoke all on private.partner_click_events,private.partner_daily_stats from public,anon,authenticated;
grant all on private.partner_click_events,private.partner_daily_stats to service_role;
create policy partner_clicks_service_only on private.partner_click_events for all to service_role using(true) with check(true);
create policy partner_stats_service_only on private.partner_daily_stats for all to service_role using(true) with check(true);
create index partner_click_events_time on private.partner_click_events(occurred_at);
create function public.record_partner_click(p_link uuid,p_event uuid) returns boolean language plpgsql security invoker set search_path='' as $$
declare created integer;
begin
 if not exists(select 1 from public.partner_links where id=p_link and state='active' and promotion_approved and reviewed_on between current_date-90 and current_date and (expires_at is null or expires_at>now())) then return false; end if;
 insert into private.partner_click_events(event_id,link_id) values(p_event,p_link) on conflict(event_id) do nothing;
 get diagnostics created=row_count;
 if created=1 then
  insert into private.partner_daily_stats(link_id,day,clicks) values(p_link,current_date,1)
  on conflict(link_id,day) do update set clicks=private.partner_daily_stats.clicks+1;
 end if;
 delete from private.partner_click_events where occurred_at<now()-interval '90 days';
 return true;
end $$;

create table public.partner_reports(
 id uuid primary key default gen_random_uuid(),link_id uuid not null references public.partner_links(id),
 report_ref text not null check(length(report_ref) between 3 and 120),
 event_type text not null check(event_type in ('account_opened','card_issued','loan_disbursed','policy_issued','other')),
 status text not null check(status in ('pending','approved','rejected')),
 conversion_count integer not null check(conversion_count between 0 and 1000000),
 commission_inr numeric(14,2) not null default 0 check(commission_inr>=0 and commission_inr<=100000000),
 period_start date not null,period_end date not null,reported_on date not null default current_date,
 source_note text not null check(length(source_note) between 10 and 1200),
 updated_by uuid references auth.users(id),updated_at timestamptz not null default now(),revision integer not null default 1,
 unique(link_id,report_ref),check(period_end>=period_start)
);
alter table public.partner_reports enable row level security;
revoke all on public.partner_reports from public,anon,authenticated;
grant all on public.partner_reports to service_role;
create policy partner_reports_service_only on public.partner_reports for all to service_role using(true) with check(true);
create function private.audit_partner_report() returns trigger language plpgsql security definer set search_path='' as $$
declare actor text;
begin
 select username into actor from public.admin_accounts where user_id=new.updated_by and enabled and role='owner';
 if actor is null then raise exception 'An enabled owner is required'; end if;
 new.updated_at:=now();if tg_op='UPDATE' then new.revision:=old.revision+1; end if;
 insert into public.admin_activity(actor_id,actor_username,action,target,details) values(new.updated_by,actor,'partner.report_saved',new.id::text,jsonb_build_object('link_id',new.link_id,'status',new.status,'count',new.conversion_count,'reference',new.report_ref));
 return new;
end $$;
revoke all on function private.audit_partner_report() from public,anon,authenticated;
create trigger audit_partner_report before insert or update on public.partner_reports for each row execute function private.audit_partner_report();
create function public.partner_performance() returns table(link_id uuid,clicks bigint,clicks_today bigint,pending bigint,approved bigint,rejected bigint,reported_commission_inr numeric)
language sql stable security invoker set search_path='' as $$
 select l.id,coalesce(c.total,0),coalesce(c.today,0),coalesce(r.pending,0),coalesce(r.approved,0),coalesce(r.rejected,0),coalesce(r.commission,0)
 from public.partner_links l
 left join (select link_id,sum(clicks)::bigint as total,sum(case when day=current_date then clicks else 0 end)::bigint as today from private.partner_daily_stats group by link_id)c on c.link_id=l.id
 left join (select link_id,sum(case when status='pending' then conversion_count else 0 end)::bigint as pending,sum(case when status='approved' then conversion_count else 0 end)::bigint as approved,sum(case when status='rejected' then conversion_count else 0 end)::bigint as rejected,sum(case when status='approved' then commission_inr else 0 end) as commission from public.partner_reports group by link_id)r on r.link_id=l.id
$$;
revoke all on function public.record_partner_click(uuid,uuid),public.partner_performance() from public,anon,authenticated;
grant execute on function public.record_partner_click(uuid,uuid),public.partner_performance() to service_role;
