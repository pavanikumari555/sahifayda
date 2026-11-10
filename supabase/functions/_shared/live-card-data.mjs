import {currentFinanceRecords,financeSourceById} from './finance-sources.mjs';
import {costLabels} from './product-details.mjs';
export function liveCardRecord(rows,id,now=new Date()) {
 return currentFinanceRecords(rows,now).find(r=>r.id===id && /^[a-f0-9]{64}$/.test(r.facts?.approved_hash||''));
}
export function liveFdCards(rows,amount,now=new Date()) {
 const row=liveCardRecord(rows,'idfc-fd-source',now);
 if(!row||row.facts.kind!=='fd_card_terms'||!Number.isFinite(amount)||amount<0||amount>1e9)return [];
 return row.facts.cards.filter(c=>['idfc-first-wow','idfc-first-earn'].includes(c.id)&&Number.isFinite(c.minFd)&&c.minFd>=1000&&amount>=c.minFd);
}
// Use the same observations on the server, directory and local SIA. A source
// check never extends an owner's product review or changes affiliate permissions.
export function applySourceObservations(products,rows,now=new Date()) {
 const current=new Set(currentFinanceRecords(rows,now).map(r=>r.id));
 return products.map(product=>{
  const sources=Object.values(financeSourceById).filter(s=>s.productIds?.includes(product.id));
  const blocked=sources.some(s=>{const r=rows.find(r=>r.id===s.id);return !r||!current.has(s.id);});
  if(blocked)return {...product,sourceReviewDue:true};
  const fd=liveCardRecord(rows,'idfc-fd-source',now),amazon=liveCardRecord(rows,'amazon-card-source',now);
  let costs;
  if(product.id==='idfc_first_wow'&&fd?.facts.kind==='fd_card_terms'){
   const card=fd.facts.cards.find(c=>c.id==='idfc-first-wow');
   if(card)costs={...product.details.costs,funding:{en:`Minimum FD ₹${card.minFd.toLocaleString('en-IN')}; individual-FD, lien, renewal and issuer approval conditions apply.`,hi:`न्यूनतम FD ₹${card.minFd.toLocaleString('en-IN')}; व्यक्तिगत FD, lien, नवीनीकरण और बैंक की मंज़ूरी की शर्तें लागू हैं।`}};
  }
  if(product.id==='amazon'&&amazon?.facts.kind==='amazon_card_terms'){
   const f=amazon.facts;
   costs={...product.details.costs,rewards:{en:`Eligible ordinary Amazon purchases: Prime ${f.prime}%, non-Prime ${f.nonPrime}% as Amazon Pay balance. Exclusions apply; no EMI reward or instant-discount stacking assumed.`,hi:`योग्य सामान्य Amazon खरीद: Prime ${f.prime}%, non-Prime ${f.nonPrime}% Amazon Pay balance में। अपवाद लागू; EMI reward या तत्काल छूट साथ मिलने की पुष्टि नहीं है।`}};
  }
  const sbi=liveCardRecord(rows,'sbi-cashback-source',now);
  let offers;
  const offer=(row,values)=>({id:'reviewed-base-reward',merchant:'any',item:'any',payment:'full',membership:'any',startsAt:row.checked_at,endsAt:new Date(Date.parse(row.checked_at)+48*3600000).toISOString(),minSpend:0,cashbackRate:0,cashbackCap:1e9,discountRate:0,discountCap:0,stackable:false,transactionCost:0,newCardCost:null,models:[],sourceUrl:row.source_url,conditions:{en:row.facts.conditions,hi:'केवल योग्य खरीद पर अनुमान। बैंक के सभी अपवाद, बची हुई सीमा और checkout की शर्तें जाँचें। EMI या दूसरी छूट साथ मिलने की पुष्टि नहीं है।'},...values});
  if(product.id==='amazon'&&amazon?.facts.kind==='amazon_card_terms')offers=[
   offer(amazon,{id:'amazon-prime',merchant:'amazon',membership:'prime',cashbackRate:amazon.facts.prime,newCardCost:0}),
   offer(amazon,{id:'amazon-non-prime',merchant:'amazon',membership:'non-prime',cashbackRate:amazon.facts.nonPrime,newCardCost:0})];
  if(product.id==='sbi'&&sbi?.facts.kind==='sbi_card_terms')offers=[offer(sbi,{cashbackRate:sbi.facts.onlineRate,cashbackCap:Math.min(sbi.facts.onlineCap,sbi.facts.totalCap)})];
  if(offers){costs||={...product.details.costs};product={...product,details:{...product.details,shoppingOffers:[...(product.details.shoppingOffers||[]).filter(o=>!o.id.startsWith('amazon-')&&o.id!=='reviewed-base-reward'),...offers]}};}
  if(costs)return {...product,details:{...product.details,costs},facts:product.name+'. '+Object.entries(costs).map(([k,v])=>(costLabels[k]?.en||k)+': '+v.en).join('. ')+' '+product.details.limits.map(v=>v.en).join(' ')};
  return product;
 });
}
