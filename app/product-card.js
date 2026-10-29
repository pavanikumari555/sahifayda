'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import {catalog,currentProduct,productPath} from '../supabase/functions/_shared/reviewed-products.mjs';
import {costLabels} from '../supabase/functions/_shared/product-details.mjs';
import {publicPartners,matchesProductPartner,partnerDestination} from '../lib/partners.mjs';
import {useProductDirectory} from './product-directory';
import {directoryPath,productIsCurrent} from '../lib/product-directory.mjs';
import PartnerHelp from './partner-help';
export function useProductPartners(){
 const directory=useProductDirectory();
 const [rows,setRows]=useState([]),[state,setState]=useState('loading');const mounted=useRef(true),inflight=useRef(null);
 const refresh=useCallback(()=>{if(inflight.current)return inflight.current;inflight.current=publicPartners().then(data=>{if(mounted.current){setRows(data);setState('ready');}}).catch(()=>{if(mounted.current){setRows([]);setState('error');}}).finally(()=>{inflight.current=null;});return inflight.current;},[]);
 useEffect(()=>{mounted.current=true;refresh();window.addEventListener('focus',refresh);return()=>{mounted.current=false;window.removeEventListener('focus',refresh);};},[refresh]);
 return {rows,state,refresh,products:directory.rows,productState:directory.state,refreshProducts:directory.refresh};
}
export function ProductReferral({productId,product=null,language,feed,compact=false}){
 const hi=language==='hi',[opening,setOpening]=useState(''),[error,setError]=useState('');
 const managed=product||feed?.products?.find(p=>p.id===productId);
 const rows=(feed?.rows||[]).filter(row=>matchesProductPartner(row,productId,new Date(),managed));
 if(compact&&!rows.length)return null;
 async function follow(item){if(opening)return;setOpening(item.id);setError('');try{window.location.assign(await partnerDestination(item,productId,managed));}catch{setError(hi?'लिंक बदल गया, रोक दिया गया या उपलब्ध नहीं है। नए लिंक जाँच रहे हैं।':'This link changed, was paused or is unavailable. Refreshing available links.');feed?.refresh();}finally{setOpening('');}}
 return <div className="product-referrals">{rows.map(item=><div className="product-referral" key={item.id}>{!compact&&<><strong>{item['title_'+language]}</strong><p>{item['description_'+language]}</p></>}<p className="product-disclosure">{item.category==='shopping'&&/amazon/i.test(item.partner+' '+item.destination_url)?'As an Amazon Associate I earn from qualifying purchases.':hi?'इन लिंक से हमें कमीशन मिल सकता है।':'We may earn commission through these links.'}</p><button type="button" disabled={Boolean(opening)} onClick={()=>follow(item)}>{opening===item.id?(hi?'लिंक जाँच रहे हैं…':'Checking link…'):(item.category==='shopping'?(hi?'यहाँ देखें और खरीदें ↗':'View & shop here ↗'):(hi?'आवेदन के लिए यहाँ क्लिक करें ↗':'Click here to apply ↗'))}</button><a href={item.terms_url} target="_blank" rel="noopener noreferrer nofollow">{hi?'प्रदाता की शर्तें':'Provider terms'} ↗</a><small>{hi?'मंज़ूरी और कमीशन पार्टनर की शर्तों पर निर्भर हैं।':'Approval and commission depend on partner terms.'}</small>{item.category!=='shopping'&&<PartnerHelp item={item} language={language}/>}</div>)}{!rows.length&&<p className="product-disclosure">{feed?.state==='loading'?(hi?'आवेदन के लिंक जाँच रहे हैं…':'Checking application links…'):feed?.state==='error'?(hi?'आवेदन के लिंक अभी उपलब्ध नहीं हैं; ऊपर की जानकारी पढ़ सकते हैं।':'Application links are unavailable; product information remains available.'):(hi?'इस उत्पाद का आवेदन लिंक अभी नहीं जुड़ा है। नीचे आधिकारिक स्रोत उपलब्ध हैं।':'An application link for this product has not been added yet. Official sources are below.')}</p>}{error&&<p className="error" role="alert">{error}</p>}</div>;
}
export default function ProductCard({productId,product:managedProduct=null,language='en',reason='',feed,expanded=false,selected,onSelect,compact=false}){
 const product=managedProduct||catalog[productId];if(!product)return null;
 const hi=language==='hi',d=product.details,current=managedProduct?productIsCurrent(product):Boolean(currentProduct(productId));
 return <article className={'product-card'+(compact?' product-card-chat':'')} id={compact?undefined:productId}>
  <div className="product-card-heading"><h3>{product.name}</h3>{onSelect&&<label className="product-select"><input type="checkbox" checked={Boolean(selected)} onChange={()=>onSelect(productId)}/>{hi?'तुलना करें':'Compare'}</label>}</div>
  <p className="product-variant">{d.variant[language]}</p>{reason&&<p className="product-reason">{reason}</p>}
  {!current&&<p className="product-stale" role="status">{hi?'इन विवरणों का नया रिव्यू बाकी है। इन्हें वर्तमान ऑफ़र न मानें; आवेदन से पहले बैंक/ब्रोकर से पुष्टि करें।':'A fresh review is due. Do not treat these details as a current offer; confirm with the provider before applying.'}</p>}
  <dl className="product-costs">{Object.entries(d.costs).map(([key,value])=><div key={key}><dt>{costLabels[key][language]}</dt><dd>{value[language]}</dd></div>)}</dl>
  <details className="product-full-details" open={expanded||undefined}><summary>{hi?'सीमाएँ, खाता खोलने का तरीका और पूरी जानकारी':'Restrictions, application steps and full details'}</summary><h4>{hi?'चुनने से पहले':'Before choosing'}</h4><ul>{d.limits.map((line,i)=><li key={i}>{line[language]}</li>)}</ul><h4>{hi?'आवेदन / खाता कैसे खुलेगा':'How to apply / open'}</h4><ol>{d.howTo.map((line,i)=><li key={i}>{line[language]}</li>)}</ol><p>{hi?'SahiFayda आवेदन या ट्रेड नहीं करता; प्रक्रिया संबंधित बैंक/ब्रोकर पर होती है।':'SahiFayda does not submit applications or trades; the provider handles the process.'}</p></details>
  {current&&<ProductReferral productId={productId} product={managedProduct} language={language} feed={feed}/>}
  <div className="product-sources"><strong>{hi?'आधिकारिक स्रोत':'Official sources'}</strong>{d.sources.map(source=><a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer">{source.title} ↗</a>)}</div>
  <p className="product-review">{hi?'जाँच की तारीख':'Reviewed'}: {product.reviewedOn} · {hi?'दोबारा जाँच':'Recheck due'}: {product.reviewUntil}. {hi?'ये सभी शुल्कों का कानूनी टैरिफ नहीं; ज्ञात मुख्य शर्तों का सार है। अंतिम नियम प्रदाता के हैं।':'This is a summary of reviewed main terms, not the complete legal tariff. Provider terms govern.'}</p>
  {compact&&<a className="product-library-link" href={managedProduct?directoryPath(productId,product.category,language):productPath(productId,language)}>{hi?'पूरे comparison पेज पर पढ़ें':'Read on the full comparison page'} →</a>}
 </article>;
}
