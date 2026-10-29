'use client';
import {directoryPath,productIsCurrent} from '../lib/product-directory.mjs';
import {ProductReferral,useProductPartners} from './product-card';
export default function GuideProducts({ids,language}){
 const feed=useProductPartners(),hi=language==='hi';
 const products=feed.products.filter(p=>ids.includes(p.id)&&productIsCurrent(p));
 return <section><h2>{hi?'उत्पाद की जानकारी और आवेदन के विकल्प':'Product details & application options'}</h2>{products.map(p=><article className="guide-product" key={p.id}><h3>{p.name}</h3><a href={directoryPath(p.id,p.category,language)}>{hi?'पूरी फीस, शर्तें और खोलने का तरीका':'Full fees, conditions & opening steps'} →</a><ProductReferral productId={p.id} product={p} language={language} feed={feed} compact/></article>)}</section>;
}
