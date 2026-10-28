'use client';
import {catalog,productPath} from '../supabase/functions/_shared/reviewed-products.mjs';
import {ProductReferral,useProductPartners} from './product-card';
export default function GuideProducts({ids,language}){
 const feed=useProductPartners(),hi=language==='hi';
 return <section><h2>{hi?'उत्पाद की जानकारी और उपलब्ध रेफ़रल':'Product details & available referrals'}</h2>{ids.map(id=><article className="guide-product" key={id}><h3>{catalog[id].name}</h3><a href={productPath(id,language)}>{hi?'पूरी फीस, शर्तें और खोलने का तरीका':'Full fees, conditions & opening steps'} →</a><ProductReferral productId={id} language={language} feed={feed} compact/></article>)}</section>;
}
