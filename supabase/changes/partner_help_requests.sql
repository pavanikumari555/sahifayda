-- Voluntary support requests are private. They never become chat/AI facts.
create table private.partner_help_requests(
 id uuid primary key,link_id uuid not null references public.partner_links(id),
 name text not null default '' check(length(name)<=80),
 mobile text not null default '' check(mobile='' or mobile ~ '^[6-9][0-9]{9}$'),
 visitor_status text not null check(visitor_status in ('not_started','in_progress','opened','problem')),
 issue text not null default '' check(length(issue)<=240),
 contact_consent boolean not null check(contact_consent=true),
 state text not null default 'new' check(state in ('new','in_progress','confirmed_opened','resolved','closed')),
 created_at timestamptz not null default now(),updated_at timestamptz not null default now(),
 check(length(name)>0 or length(mobile)>0)
);
alter table private.partner_help_requests enable row level security;
create policy service_only_help_requests on private.partner_help_requests to service_role using(true) with check(true);
revoke all on private.partner_help_requests from public,anon,authenticated;
grant select,insert,update,delete on private.partner_help_requests to service_role;
create index partner_help_recent on private.partner_help_requests(created_at desc,id desc);
create function public.create_partner_help_request(p_id uuid,p_link uuid,p_name text,p_mobile text,p_status text,p_issue text,p_consent boolean)
returns uuid language plpgsql security invoker set search_path='' as $$
declare item public.partner_links%rowtype;
begin
 select * into item from public.partner_links where id=p_link and state='active' and promotion_approved
 and reviewed_on between current_date-90 and current_date and (expires_at is null or expires_at>now()) for share;
 if not found then return null; end if;
 if item.product_key is not null then
  perform 1 from public.product_catalog where id=item.product_key and category=item.category and state='active' and reviewed_on<=current_date and review_until>=current_date for share;
  if not found then return null; end if;
 end if;
 delete from private.partner_help_requests where created_at<now()-interval '90 days';
 insert into private.partner_help_requests(id,link_id,name,mobile,visitor_status,issue,contact_consent)
 values(p_id,p_link,p_name,p_mobile,p_status,p_issue,p_consent) on conflict(id) do nothing;
 if exists(select 1 from private.partner_help_requests where id=p_id and link_id=p_link) then return p_id; end if;
 return null;
end $$;
create function public.partner_help_list()
returns table(id uuid,link_id uuid,name text,mobile text,visitor_status text,issue text,state text,created_at timestamptz,updated_at timestamptz)
language sql stable security invoker set search_path='' as $$
 select id,link_id,name,mobile,visitor_status,issue,state,created_at,updated_at
 from private.partner_help_requests where created_at>=now()-interval '90 days'
 order by created_at desc,id desc limit 100
$$;
create function public.set_partner_help_state(p_id uuid,p_state text,p_updated_at timestamptz)
returns boolean language plpgsql security invoker set search_path='' as $$
begin
 update private.partner_help_requests set state=p_state,updated_at=clock_timestamp() where id=p_id and updated_at=p_updated_at;
 return found;
end $$;
revoke all on function public.create_partner_help_request(uuid,uuid,text,text,text,text,boolean) from public,anon,authenticated;
revoke all on function public.partner_help_list() from public,anon,authenticated;
revoke all on function public.set_partner_help_state(uuid,text,timestamptz) from public,anon,authenticated;
grant execute on function public.create_partner_help_request(uuid,uuid,text,text,text,text,boolean) to service_role;
grant execute on function public.partner_help_list() to service_role;
grant execute on function public.set_partner_help_state(uuid,text,timestamptz) to service_role;
select cron.schedule('sahifayda_support_retention','0 * * * *',
 $$delete from private.partner_help_requests where created_at<now()-interval '90 days'$$);
