import {currentProduct} from '../supabase/functions/_shared/reviewed-products.mjs';
export const categories={credit_card:['Credit cards','क्रेडिट कार्ड'],savings_account:['Savings accounts','बचत खाते'],loan:['Loans','लोन'],demat:['Demat accounts','डीमैट खाते'],insurance:['Insurance','बीमा'],credit_line:['Credit line','क्रेडिट लाइन'],other:['Apps & other services','ऐप और अन्य सेवाएँ'],shopping:['Shopping & offers','खरीद और ऑफ़र']};
export function safePartnerUrl(value){try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password&&!u.port&&u.hostname.includes('.')&&!/^[\d.]+$/.test(u.hostname)&&!/[\[\]:]/.test(u.hostname)&&!/[\s\\]/.test(value)&&!['localhost','bit.ly','t.co','tinyurl.com','rb.gy'].includes(u.hostname)&&!/(\.(localhost|local|internal|invalid|test|example))$/.test(u.hostname);}catch{return false;}}
export async function publicPartners(id){
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
 if(id&&!/^[0-9a-f-]{36}$/i.test(id))throw Error('Invalid link');
 const fields='id,partner,kind,category,product_key,eligibility_tag,title_en,title_hi,description_en,description_hi,destination_url,terms_url,disclosure_en,disclosure_hi,reviewed_on,expires_at,sort_order';
 const response=await fetch(url+'/rest/v1/partner_links?select='+fields+'&order=sort_order,title_en&limit=1000'+(id?'&id=eq.'+id:''),{headers:{apikey:key},cache:'no-store',signal:AbortSignal.timeout(8000)});
 if(!response.ok)throw Error('Partner availability could not be checked');
 const rows=await response.json();
 if(!Array.isArray(rows)||rows.length>1000||rows.some(row=>!safePartnerUrl(row.destination_url)||!safePartnerUrl(row.terms_url)||!Object.hasOwn(categories,row.category)||!['affiliate','referral'].includes(row.kind)||['title_en','title_hi','disclosure_en','disclosure_hi'].some(k=>typeof row[k]!=='string'||!row[k])))throw Error('Invalid partner response');
 return rows;
}
export function matchesProductPartner(item,productKey,now=new Date(),managedProduct=null){
 const product=managedProduct?managedProduct.state==='active'&&managedProduct.reviewedOn<=now.toISOString().slice(0,10)&&managedProduct.reviewUntil>=now.toISOString().slice(0,10)?managedProduct:null:currentProduct(productKey,now);if(!product||product.id!==productKey||!item||item.product_key!==productKey||item.category!==product.category||!['affiliate','referral'].includes(item.kind)||!safePartnerUrl(item.destination_url)||!safePartnerUrl(item.terms_url))return false;
 if(item.state!==undefined&&item.state!=='active'||item.promotion_approved!==undefined&&!item.promotion_approved)return false;
 const day=Date.parse(now.toISOString().slice(0,10)),review=Date.parse(item.reviewed_on);
 return Number.isFinite(review)&&review<=day&&review>=day-90*86400000&&(!item.expires_at||Number.isFinite(Date.parse(item.expires_at))&&Date.parse(item.expires_at)>now.getTime());
}
export async function partnerDestination(item,productKey,product=null){
 if(productKey&&!matchesProductPartner(item,productKey,new Date(),product))throw Error('This product link is unavailable.');
 const response=await fetch(process.env.NEXT_PUBLIC_SUPABASE_URL+'/functions/v1/partner-click',{method:'POST',headers:{apikey:process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,'Content-Type':'application/json'},body:JSON.stringify({id:item.id,event_id:crypto.randomUUID(),...(productKey?{product_key:productKey}:{})}),cache:'no-store',signal:AbortSignal.timeout(15000)});
 const data=await response.json();if(!response.ok)throw Error('This partner link is unavailable.');
 if(data.original!==item.destination_url||!safePartnerUrl(data.destination))throw Error('The partner link changed. Reload the list.');
 const original=new URL(item.destination_url),next=new URL(data.destination);if(next.origin!==original.origin||next.pathname!==original.pathname)throw Error('The destination changed. Reload the list.');
 return data.destination;
}
