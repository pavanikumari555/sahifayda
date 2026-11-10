export * from '../supabase/functions/_shared/product-directory.mjs';
import {directoryProduct,productFields} from '../supabase/functions/_shared/product-directory.mjs';
import {readFinanceKnowledge} from './finance-knowledge.mjs';
import {applySourceObservations} from '../supabase/functions/_shared/live-card-data.mjs';
let inflight=null;
export function readProductDirectory(){
 if(inflight)return inflight;
 inflight=fetchProductDirectory().finally(()=>{inflight=null;});return inflight;
}
async function fetchProductDirectory(){
 const observationsPromise=readFinanceKnowledge();
 // Attach rejection handling immediately while the independent catalogue request runs.
 const observed=observationsPromise.then(rows=>({rows}),()=>({error:true}));
 const r=await fetch(process.env.NEXT_PUBLIC_SUPABASE_URL+'/rest/v1/product_catalog?select='+productFields.join(',')+'&state=eq.active&order=name&limit=1000',{headers:{apikey:process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY},cache:'no-store',signal:AbortSignal.timeout(8000)});
 if(!r.ok)throw Error('Product information unavailable');const rows=await r.json();if(!Array.isArray(rows)||rows.length>1000)throw Error('Invalid product information');
 const result=await observed;if(result.error)throw Error('Current source status unavailable');
 const observations=result.rows;
 return applySourceObservations(rows.map(directoryProduct),observations);
}
