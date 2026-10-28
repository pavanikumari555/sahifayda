'use client';
import {catalog,currentProduct,productPath} from '../supabase/functions/_shared/reviewed-products.mjs';
import {ProductReferral} from './product-card';
export default function SiaProductSummary({option,language,feed}){
 const p=catalog[option.id];if(!p)return null;
 const hi=language==='hi',costs=p.details.costs;
 const keys=p.category==='savings_account'?['balance',p.id==='kotak'?'funding':'cash']:p.category==='credit_card'?['opening','annual']:['options','intro'];
 const conditions=option.cost?[option.cost,...(p.category==='demat'&&costs.intro?[costs.intro[language]]:[])]:keys.filter(key=>costs[key]).map(key=>costs[key][language]);
 const reason=p.category!=='savings_account'&&option.reason&&!/Product information|आपके पूछे|Aapke poochhe|Information for the product|आपके चुने|Aapke chune|ऊपर बताए|Information on the product/.test(option.reason)?option.reason:'';
 return <article className="sia-product-summary">
  <h3>{p.name}</h3>{reason&&<p>{reason}</p>}
  {conditions.map((text,i)=><p key={i}>{text}</p>)}
  {p.category==='savings_account'&&option.shortCaution&&<p>{option.shortCaution}</p>}
  <a className="product-library-link" href={productPath(p.id,language)}>{hi?'पूरी जानकारी, फीस और खोलने का तरीका':'Full details, fees & opening steps'} →</a>
  <small className="product-review">{currentProduct(p.id)?(hi?'जाँच: ':'Reviewed: ')+p.reviewedOn:(hi?'नया रिव्यू बाकी है; वर्तमान नियम पेज पर जाँचें।':'A fresh review is due; check current terms on the details page.')}</small>
  {currentProduct(p.id)&&<ProductReferral productId={p.id} language={language} feed={feed} compact/>}
 </article>;
}
