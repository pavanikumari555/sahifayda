create or replace function private.audit_partner_change()
returns trigger language plpgsql security definer set search_path = '' as $$
declare actor text;
begin
 select username into actor from public.admin_accounts where user_id=new.updated_by and enabled and role='owner';
 if actor is null then raise exception 'An enabled owner is required'; end if;
 new.updated_at:=now();
 if tg_op='UPDATE' then new.revision:=old.revision+1; else new.revision:=1; end if;
 insert into public.admin_activity(actor_id,actor_username,action,target,details)
 values(new.updated_by,actor,'partner.'||lower(tg_op),new.id::text,
  jsonb_build_object('state',new.state,'partner',new.partner,'revision',new.revision,
   'product_key',new.product_key,'previous_product_key',case when tg_op='UPDATE' then old.product_key else null end));
 return new;
end $$;
