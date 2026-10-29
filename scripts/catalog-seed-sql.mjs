// Emits reviewed seed data only. Apply after managed_product_catalog.sql.
// Existing owner edits are never overwritten. No credentials are read.
import {directorySeed} from '../supabase/functions/_shared/directory-seed.mjs';
const quote=value=>"'"+String(value).replaceAll("'","''")+"'";
for(const p of directorySeed)console.log('insert into public.product_catalog(id,name,category,state,reviewed_on,review_until,content) values('+[p.id,p.name,p.category,p.state,p.reviewed_on,p.review_until,JSON.stringify(p.content)].map(quote).join(',')+') on conflict(id) do nothing;');
