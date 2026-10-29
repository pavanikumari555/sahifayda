-- Owner/manager inspection via the authenticated admin endpoint only.
-- No customer identity, IP address or device fingerprint is returned.
create index if not exists partner_click_events_time_id on private.partner_click_events(occurred_at desc,event_id desc);
create function public.partner_recent_clicks(
 p_link uuid default null,p_from timestamptz default null,p_to timestamptz default null,
 p_before timestamptz default null,p_before_event uuid default null
) returns table(event_id uuid,link_id uuid,occurred_at timestamptz)
language sql stable security invoker set search_path='' as $$
 select e.event_id,e.link_id,e.occurred_at
 from private.partner_click_events e
 where e.occurred_at>=greatest(coalesce(p_from,now()-interval '90 days'),now()-interval '90 days')
 and e.occurred_at<=least(coalesce(p_to,now()),now())
 and (p_link is null or e.link_id=p_link)
 and (p_before is null or (e.occurred_at,e.event_id)<(p_before,p_before_event))
 order by e.occurred_at desc,e.event_id desc limit 201
$$;
revoke all on function public.partner_recent_clicks(uuid,timestamptz,timestamptz,timestamptz,uuid) from public,anon,authenticated;
grant execute on function public.partner_recent_clicks(uuid,timestamptz,timestamptz,timestamptz,uuid) to service_role;
