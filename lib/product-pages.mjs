import {directoryCategories as productCategories} from './product-directory.mjs';
import {siteConfig} from './site-config.mjs';
export function productRoutes(language){const base=(language==='hi'?'/hi':'')+'/products/';return [base,...Object.values(productCategories).map(p=>base+p.slug+'/')];}
export function productMetadata(language,key=null){
 const {origin,indexable}=siteConfig(),prefix=language==='hi'?'/hi':'',tail='/products/'+(key?productCategories[key].slug+'/':'');
 return {title:(key?productCategories[key][language]:language==='hi'?'खाते, कार्ड और फीस की तुलना':'Accounts, cards and fee comparisons')+' | SahiFayda',description:language==='hi'?'मुख्य शुल्क, शर्तें, स्रोत और खाता खोलने का तरीका पढ़ें; समान श्रेणी के विकल्पों की तुलना करें।':'Read reviewed charges, restrictions, sources and application steps; compare options in the same category.',robots:{index:indexable,follow:true},...(origin?{alternates:{canonical:origin+prefix+tail,languages:{en:origin+tail,hi:origin+'/hi'+tail}}}:{})};
}
