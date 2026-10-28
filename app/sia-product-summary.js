'use client';
import {catalog,currentProduct,productPath} from '../supabase/functions/_shared/reviewed-products.mjs';
import {ProductReferral} from './product-card';
export default function SiaProductSummary({option,language,feed}){
 const p=catalog[option.id];if(!p)return null;
 const hi=language==='hi';
 return <article className="sia-product-summary">
  <h3>{p.name}</h3>
  {p.category==='demat'&&option.cost&&<p>{option.cost}</p>}
  <a className="product-library-link" href={productPath(p.id,language)}>{hi?'पूरी जानकारी, फीस और खोलने का तरीका':'Full details, fees & opening steps'} →</a>
  {currentProduct(p.id)&&<ProductReferral productId={p.id} language={language} feed={feed} compact/>}
 </article>;
}
