import {catalog,productCategories} from './reviewed-products.mjs';
import {costLabels} from './product-details.mjs';
export const directoryCategories={...productCategories,loan:{en:'Loans',hi:'लोन',slug:'loans'},insurance:{en:'Insurance',hi:'बीमा',slug:'insurance'},credit_line:{en:'Credit line',hi:'क्रेडिट लाइन',slug:'credit-line'},other:{en:'Apps & other services',hi:'ऐप और अन्य सेवाएँ',slug:'other-services'},shopping:{en:'Shopping & offers',hi:'खरीद और ऑफ़र',slug:'shopping'}};
export const productFields=['id','name','category','state','reviewed_on','review_until','content','revision'];
export function directoryPath(id,category,language='en'){return (language==='hi'?'/hi':'')+'/products/'+directoryCategories[category].slug+'/#'+id;}
export function directoryProduct(row){
 return {...row.content,id:row.id,name:row.name,category:row.category,state:row.state,reviewedOn:row.reviewed_on,reviewUntil:row.review_until,revision:row.revision,url:row.content.details.sources[0].url,details:row.content.details,facts:row.name+'. '+Object.entries(row.content.details.costs).map(([key,v])=>(costLabels[key]?.en||key)+': '+v.en).join('. ')+' '+row.content.details.limits.map(v=>v.en).join(' ')};
}
export function productIsCurrent(p,now=new Date()){const day=now.toISOString().slice(0,10);return p&&p.state==='active'&&p.reviewedOn<=day&&p.reviewUntil>=day;}
export function legacySeed(){return Object.values(catalog).map(p=>({id:p.id,name:p.name,category:p.category,state:'active',reviewed_on:p.reviewedOn,review_until:p.reviewUntil,content:{details:p.details,aliases:[p.name],facets:p.category==='savings_account'?{balance:'zero'}:p.category==='credit_card'?{annual_fee:p.fee,card_type:'unsecured',use:p.id==='amazon'?'amazon':'online'}:{}}}));}
export function validateDirectoryProduct(body,urlCheck,now=new Date()){
 const text=(s,max)=>typeof s==='string'&&s.trim().length>0&&s.length<=max;
 const pair=v=>v&&text(v.en,1600)&&text(v.hi,1600);
 const list=v=>Array.isArray(v)&&v.length>0&&v.length<=12&&v.every(pair);
 if(typeof body.id!=='string'||!/^[a-z][a-z0-9_]{0,63}$/.test(body.id)||!text(body.name,120)||typeof body.category!=='string'||!Object.hasOwn(directoryCategories,body.category)||!['draft','active','paused','archived'].includes(body.state))throw Error('Check product key, name, category and state.');
 const c=body.content,d=c?.details;
 if(!d||!pair(d.variant)||!list(d.limits)||!list(d.howTo)||!d.costs||!Object.keys(d.costs).length||Object.keys(d.costs).length>25||Object.entries(d.costs).some(([key,v])=>!Object.hasOwn(costLabels,key)||!pair(v)))throw Error('Add bilingual product description, costs, limitations and application steps.');
 if(!Array.isArray(d.sources)||!d.sources.length||d.sources.length>8||d.sources.some(s=>!text(s.title,160)||!urlCheck(s.url)))throw Error('Add valid official HTTPS sources.');
 if(!Array.isArray(c.aliases)||c.aliases.length>15||c.aliases.some(s=>!text(s,100)))throw Error('Use at most 15 short search names.');
 if(!c.facets||Array.isArray(c.facets)||typeof c.facets!=='object'||Object.keys(c.facets).length>15||Object.entries(c.facets).some(([k,v])=>!['balance','card_type','annual_fee','upi','purpose','insurance_type','merchant','use','min_budget','max_budget','informational'].includes(k)||!['string','number','boolean'].includes(typeof v)||typeof v==='string'&&v.length>80||typeof v==='number'&&(!Number.isFinite(v)||v<0)))throw Error('Check product matching fields.');
 for(const key of ['reviewed_on','review_until'])if(!/^\d{4}-\d{2}-\d{2}$/.test(body[key]||'')||!Number.isFinite(Date.parse(body[key]))||new Date(body[key]).toISOString().slice(0,10)!==body[key])throw Error('Enter valid review dates.');
 if(body.review_until<body.reviewed_on||body.reviewed_on>now.toISOString().slice(0,10)||Date.parse(body.review_until)-Date.parse(body.reviewed_on)>90*86400000||body.state==='active'&&body.review_until<now.toISOString().slice(0,10))throw Error('Publishing needs a current source review, valid for at most 90 days.');
 if(JSON.stringify(c).length>25000)throw Error('Keep product information under 25 KB.');
 return {id:body.id,name:body.name.trim(),category:body.category,state:body.state,reviewed_on:body.reviewed_on,review_until:body.review_until,content:{details:{...d,category:body.category},aliases:c.aliases,facets:c.facets}};
}
