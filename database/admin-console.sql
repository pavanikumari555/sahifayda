create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated, service_role;

create table public.admin_accounts (
 id uuid primary key default gen_random_uuid(),
 user_id uuid unique references auth.users(id),
 username text not null unique check (username ~ '^[a-z0-9][a-z0-9_.-]{2,39}$'),
 recovery_email text not null,
 role text not null check (role in ('owner','manager')),
 enabled boolean not null default true,
 must_change_password boolean not null default false,
 created_at timestamptz not null default now()
);
alter table public.admin_accounts enable row level security;
revoke all on public.admin_accounts from anon, authenticated;
grant select (id,user_id,username,role,enabled,must_change_password,created_at) on public.admin_accounts to authenticated;
grant all on public.admin_accounts to service_role;
create policy own_admin_profile on public.admin_accounts for select to authenticated using (user_id=(select auth.uid()));

create function private.admin_role() returns text language sql stable security definer set search_path='' as $$
 select a.role from public.admin_accounts a
 where auth.uid() is not null and a.user_id=auth.uid() and a.enabled and (extract(epoch from now())-(auth.jwt()->>'iat')::bigint)<1800
 and exists(select 1 from auth.sessions s where s.id=(auth.jwt()->>'session_id')::uuid and s.user_id=auth.uid())
 limit 1
$$;
revoke all on function private.admin_role() from public,anon;
grant execute on function private.admin_role() to authenticated,service_role;

create function private.can_manage() returns boolean language sql stable security definer set search_path='' as $$
 select auth.uid() is not null and private.admin_role() is not null
 and exists(select 1 from public.admin_accounts a where a.user_id=auth.uid() and not a.must_change_password)
$$;
revoke all on function private.can_manage() from public,anon;
grant execute on function private.can_manage() to authenticated,service_role;

create function public.admin_context() returns table(id uuid,user_id uuid,username text,role text,must_change_password boolean)
language sql stable security invoker set search_path='' as $$
 select a.id,a.user_id,a.username,a.role,a.must_change_password from public.admin_accounts a
 where a.user_id=auth.uid() and private.admin_role() is not null
$$;
revoke all on function public.admin_context() from public,anon;
grant execute on function public.admin_context() to authenticated;

grant update (state,message_en,message_hi) on public.service_status to authenticated;
create policy admin_service_update on public.service_status for update to authenticated
 using ((select private.can_manage()))
 with check ((select private.can_manage()) and (id<>'sia' or state<>'active'));

create table public.admin_activity (
 id bigint generated always as identity primary key,
 actor_id uuid,
 actor_username text not null,
 action text not null,
 target text not null,
 details jsonb not null default '{}'::jsonb,
 occurred_at timestamptz not null default now()
);
alter table public.admin_activity enable row level security;
revoke all on public.admin_activity from anon,authenticated;
grant select on public.admin_activity to authenticated;
grant all on public.admin_activity to service_role;
grant usage,select on sequence public.admin_activity_id_seq to service_role;
create policy admin_read_activity on public.admin_activity for select to authenticated using ((select private.can_manage()));

create function private.audit_service_change() returns trigger language plpgsql security definer set search_path='' as $$
declare actor text;
begin
 if auth.uid() is not null and private.can_manage() then
  select username into actor from public.admin_accounts where user_id=auth.uid();
 elsif (auth.uid() is null and current_setting('request.jwt.claims',true)::jsonb->>'role'='service_role') or session_user='postgres' then
  actor:='system';
 else
  raise exception 'Not authorized';
 end if;
 new.updated_at:=now();
 insert into public.admin_activity(actor_id,actor_username,action,target,details)
 values(auth.uid(),coalesce(actor,'system'),'service.updated',new.id,jsonb_build_object('from',old.state,'to',new.state));
 return new;
end $$;
revoke all on function private.audit_service_change() from public,anon,authenticated;
create trigger audit_service_change before update on public.service_status for each row execute function private.audit_service_change();

create table private.admin_login_limits (
 key text primary key, started_at timestamptz not null, attempts integer not null
);
alter table private.admin_login_limits enable row level security;
revoke all on private.admin_login_limits from public,anon,authenticated;
grant all on private.admin_login_limits to service_role;
create function public.take_admin_login_slot(p_key text) returns boolean language plpgsql security invoker set search_path='' as $$
declare count_now integer;
begin
 insert into private.admin_login_limits(key,started_at,attempts) values(p_key,now(),1)
 on conflict(key) do update set
 attempts=case when private.admin_login_limits.started_at < now()-interval '5 minutes' then 1 else private.admin_login_limits.attempts+1 end,
 started_at=case when private.admin_login_limits.started_at < now()-interval '5 minutes' then now() else private.admin_login_limits.started_at end
 returning attempts into count_now;
 return count_now<=10;
end $$;
revoke all on function public.take_admin_login_slot(text) from public,anon,authenticated;
grant execute on function public.take_admin_login_slot(text) to service_role;

create function public.set_admin_enabled(p_id uuid,p_enabled boolean) returns void language plpgsql security invoker set search_path='' as $$
declare target_role text;
begin
 perform pg_advisory_xact_lock(734192);
 select role into target_role from public.admin_accounts where id=p_id for update;
 if target_role is null then raise exception 'Account not found'; end if;
 if not p_enabled and target_role='owner' and (select count(*) from public.admin_accounts where role='owner' and enabled and id<>p_id)=0 then
  raise exception 'The last owner cannot be disabled';
 end if;
 update public.admin_accounts set enabled=p_enabled where id=p_id;
end $$;
revoke all on function public.set_admin_enabled(uuid,boolean) from public,anon,authenticated;
grant execute on function public.set_admin_enabled(uuid,boolean) to service_role;

insert into public.admin_accounts(username,recovery_email,role) values ('singhal','homemoneycalc.site@gmail.com','owner');

create policy service_only_login_limits on private.admin_login_limits for all to service_role using (true) with check (true);
