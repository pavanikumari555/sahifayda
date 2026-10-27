create table private.sia_answer_cache(key text primary key,answer text not null check(length(answer)<=5000),provider text not null check(provider in ('groq','gemini')),created_at timestamptz not null default now());
alter table private.sia_answer_cache enable row level security;
revoke all on private.sia_answer_cache from public,anon,authenticated;
grant all on private.sia_answer_cache to service_role;
create policy sia_cache_service_only on private.sia_answer_cache for all to service_role using(true) with check(true);
create function public.read_sia_cache(p_key text) returns jsonb language sql stable security invoker set search_path='' as $$
 select jsonb_build_object('answer',answer,'provider',provider,'generated_at',created_at) from private.sia_answer_cache where key=p_key and created_at>now()-interval '24 hours'
$$;
create function public.write_sia_cache(p_key text,p_answer text,p_provider text) returns void language plpgsql security invoker set search_path='' as $$
begin
 if p_key !~ '^[a-f0-9]{64}$' then raise exception 'Invalid cache key';end if;
 insert into private.sia_answer_cache(key,answer,provider) values(p_key,p_answer,p_provider) on conflict(key) do update set answer=excluded.answer,provider=excluded.provider,created_at=now();
 delete from private.sia_answer_cache where created_at<now()-interval '24 hours';
end $$;
revoke all on function public.read_sia_cache(text),public.write_sia_cache(text,text,text) from public,anon,authenticated;
grant execute on function public.read_sia_cache(text),public.write_sia_cache(text,text,text) to service_role;
