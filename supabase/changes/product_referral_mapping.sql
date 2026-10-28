-- Exact product/plan association; existing RLS, approval and owner-only writes remain.
alter table public.partner_links add column product_key text;
alter table public.partner_links add constraint partner_product_key_shape check
 (product_key is null or product_key ~ '^[a-z][a-z0-9_]{0,63}$');
grant select (product_key) on public.partner_links to anon, authenticated;

-- Atomically resolve a current, approved product mapping and record its click.
create function public.resolve_partner_product_link(p_link uuid, p_event uuid, p_product_key text)
returns jsonb language plpgsql set search_path = '' as $$
declare item public.partner_links%rowtype;
begin
 select * into item from public.partner_links
 where id=p_link and product_key=p_product_key and state='active' and promotion_approved
 and reviewed_on between current_date-90 and current_date
 and (expires_at is null or expires_at>now()) for share;
 if not found then return null; end if;
 if not public.record_partner_click(p_link,p_event) then return null; end if;
 return jsonb_build_object('id',item.id,'product_key',item.product_key,
   'destination_url',item.destination_url,'tracking_param',item.tracking_param);
end $$;
revoke all on function public.resolve_partner_product_link(uuid,uuid,text) from public,anon,authenticated;
grant execute on function public.resolve_partner_product_link(uuid,uuid,text) to service_role;
