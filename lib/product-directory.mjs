export * from '../supabase/functions/_shared/product-directory.mjs';
import {directoryProduct,productFields} from '../supabase/functions/_shared/product-directory.mjs';
let inflight=null;
export function readProductDirectory(){
 if(inflight)return inflight;
 inflight=fetchProductDirectory().finally(()=>{inflight=null;});return inflight;
}
async function fetchProductDirectory(){
 const r=await fetch(process.env.NEXT_PUBLIC_SUPABASE_URL+'/rest/v1/product_catalog?select='+productFields.join(',')+'&state=eq.active&order=name&limit=1000',{headers:{apikey:process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY},cache:'no-store',signal:AbortSignal.timeout(8000)});
 if(!r.ok)throw Error('Product information unavailable');const rows=await r.json();if(!Array.isArray(rows)||rows.length>1000)throw Error('Invalid product information');return rows.map(directoryProduct);
}
