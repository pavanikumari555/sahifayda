'use client';
import {catalog,currentProduct,productPath} from '../supabase/functions/_shared/reviewed-products.mjs';
import {ProductReferral} from './product-card';
import {directoryPath,productIsCurrent} from '../lib/product-directory.mjs';
export default function SiaProductSummary({option,language,feed}){
 const p=feed?.products?.find(p=>p.id===option.id);if(!p||!productIsCurrent(p))return null;
 const hi=language==='hi';
 return <article className="sia-product-summary">
  <h3>{p.name}</h3>
  {['credit_card','savings_account','insurance','credit_line'].includes(p.category)&&<p>{p.details.variant[language]}</p>}
  {p.category==='credit_card'&&<p>{p.details.costs.annual?.[language]|| (hi?'सालाना फीस की पुष्टि प्रदाता से करें।':'Confirm annual fees with the issuer.')}{p.details.costs.upi?.[language]?' · '+p.details.costs.upi[language]:''}</p>}
  {p.category==='demat'&&option.cost&&<p>{option.cost}</p>}
  <a className="product-library-link" href={directoryPath(p.id,p.category,language)}>{hi?'पूरी जानकारी, फीस और खोलने का तरीका':'Full details, fees & opening steps'} →</a>
  <ProductReferral productId={p.id} product={p} language={language} feed={feed} compact/>
 </article>;
}
