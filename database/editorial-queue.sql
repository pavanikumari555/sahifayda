create table public.editorial_queue(
 id uuid primary key default gen_random_uuid(),
 kind text not null check(kind in ('keyword','market_gap','correction','feature')),
 title text not null check(length(title) between 3 and 160),
 intent text not null check(length(intent) between 10 and 1200),
 evidence_url text not null default '',
 evidence_note text not null default '' check(length(evidence_note)<=2000),
 state text not null default 'idea' check(state in ('idea','researching','approved','implemented','rejected')),
 result_path text not null default '',
 updated_by uuid references auth.users(id),updated_at timestamptz not null default now(),revision integer not null default 1
);
alter table public.editorial_queue enable row level security;
revoke all on public.editorial_queue from public,anon,authenticated;
grant all on public.editorial_queue to service_role;
create policy editorial_service_only on public.editorial_queue for all to service_role using(true) with check(true);
create function private.audit_editorial_change() returns trigger language plpgsql security definer set search_path='' as $$
declare actor text;
begin
 select username into actor from public.admin_accounts where user_id=new.updated_by and enabled and role='owner';
 if actor is null then raise exception 'An enabled owner is required'; end if;
 new.updated_at:=now();if tg_op='UPDATE' then new.revision:=old.revision+1; end if;
 insert into public.admin_activity(actor_id,actor_username,action,target,details) values(new.updated_by,actor,'editorial.saved',new.id::text,jsonb_build_object('kind',new.kind,'state',new.state,'title',new.title));
 return new;
end $$;
revoke all on function private.audit_editorial_change() from public,anon,authenticated;
create trigger audit_editorial_change before insert or update on public.editorial_queue for each row execute function private.audit_editorial_change();
