const finite=(v,max=1e9)=>Number.isFinite(v)&&v>=0&&v<=max;
export function shoppingPreferences(question,previous={}) {
 const v={...previous},t=question.toLowerCase().replace(/[०-९]/g,c=>String('०१२३४५६७८९'.indexOf(c)));
 const amount=t.match(/(?:budget|bajat|bajet|price|कीमत|बजट)\D{0,10}(\d[\d,]*(?:\.\d+)?)\s*(k\b|hazar|hazaar|thousand|हजार|हज़ार)?/)||(!v.budget&&!/cap|limit|बची|सीमा/.test(t)?t.match(/(\d[\d,]*(?:\.\d+)?)\s*(k\b|hazar|hazaar|thousand|हजार|हज़ार)?/):null);
 if(amount)v.budget=Number(amount[1].replaceAll(',',''))*(amount[2]?1000:1);
 for(const merchant of ['amazon','flipkart','myntra'])if(t.includes(merchant)&&(merchant!=='amazon'||!/amazon\s*pay/.test(t)||/amazon\s*(?:par|pe|se|पर|पे|से)|(?:on|from)\s+amazon\b/.test(t)))v.merchant=merchant;
 if(/mobile|phone|मोबाइल|फोन/.test(t))v.item='mobile';else if(/laptop|लैपटॉप/.test(t))v.item='laptop';
 if(/no\s*card|card\s*(?:nahi|nhi|nahin|नहीं)|कार्ड\s*नहीं/.test(t)){v.existingCards=[];v.hasCard=true;}
 else if(/(?:mere paas|have|existing|already|मेरे पास)/.test(t)||previous.budget&&previous.merchant&&!previous.hasCard){
  if(/amazon\s*pay(?:\s*icici)?/.test(t)){v.existingCards=['amazon'];v.hasCard=true;}
  else if(/(?:cashback\s*sbi|sbi\s*cashback)/.test(t)){v.existingCards=['sbi'];v.hasCard=true;}
  else if(/icici|hdfc|sbi/.test(t)){v.hasCard=true;v.cardBank=t.match(/icici|hdfc|sbi/)[0];}
 }
 if(/non.?prime|not.*prime|prime.*(?:nahi|nhi|नहीं)/.test(t))v.prime=false;else if(/(?:i am|have|mein|main|mai|हूँ|हूं).{0,16}prime|prime\s*(?:member|hai|hoon|hu)/.test(t))v.prime=true;
 if(/no\s*emi|without\s*emi|full\s*payment|एकमुश्त|पूरा भुगतान/.test(t))v.payment='full';else if(/\bemi\b|ईएमआई/.test(t))v.payment='emi';
 const cap=t.match(/(?:cap|limit|remaining|bachi|bacha|बची|सीमा)\D{0,12}(\d[\d,]*)/);
 if(cap&&v.existingCards?.length===1)v.remainingCaps={...v.remainingCaps,[v.existingCards[0]]:Number(cap[1].replaceAll(',',''))};
 return v;
}
export function validShoppingOffer(o,sources=[]) {
 return o&&/^[a-z0-9-]{1,60}$/.test(o.id||'')&&['amazon','flipkart','myntra','any'].includes(o.merchant)&&['mobile','laptop','any'].includes(o.item)&&
  ['full','emi'].includes(o.payment)&&['any','prime','non-prime'].includes(o.membership)&&
  Number.isFinite(Date.parse(o.startsAt))&&Number.isFinite(Date.parse(o.endsAt))&&Date.parse(o.endsAt)>Date.parse(o.startsAt)&&
  ['minSpend','cashbackCap','discountCap','transactionCost'].every(k=>finite(o[k]))&&['cashbackRate','discountRate'].every(k=>finite(o[k],100))&&
  (o.newCardCost===null||finite(o.newCardCost))&&typeof o.stackable==='boolean'&&sources.some(s=>s.url===o.sourceUrl)&&
  typeof o.conditions?.en==='string'&&o.conditions.en.length>=10&&o.conditions.en.length<=1600&&typeof o.conditions?.hi==='string'&&o.conditions.hi.length>=10&&o.conditions.hi.length<=1600&&
  Array.isArray(o.models)&&o.models.length<=30&&o.models.every(m=>typeof m==='string'&&m.trim().length>0&&m.length<=100);
}
export function rankShoppingOffers(products,context,now=new Date()) {
 if(!finite(context?.price)||context.price<=0||!['amazon','flipkart','myntra'].includes(context.merchant)||!['mobile','laptop','any'].includes(context.item)||!['full','emi'].includes(context.payment))return {ranked:[],unpriced:[]};
 const day=now.toISOString().slice(0,10),ranked=[],unpriced=[];
 for(const product of products){
  if(product.category!=='credit_card'||product.state!=='active'||product.sourceReviewDue||product.reviewedOn>day||product.reviewUntil<day)continue;
  for(const o of Array.isArray(product.details?.shoppingOffers)?product.details.shoppingOffers:[]){
   if(!validShoppingOffer(o,product.details.sources)||now<Date.parse(o.startsAt)||now>=Date.parse(o.endsAt)||context.price<o.minSpend||
    o.merchant!=='any'&&o.merchant!==context.merchant||o.item!=='any'&&o.item!==context.item||o.payment!==context.payment||
    o.membership!=='any'&&o.membership!==(context.prime===true?'prime':context.prime===false?'non-prime':'unknown')||
    o.models.length&&!o.models.some(m=>m.toLowerCase()===(context.model||'').trim().toLowerCase()))continue;
   const owned=context.existingCards?.includes(product.id);
   if(context.existingOnly&&!owned)continue;
   const newCost=owned?0:o.newCardCost;
   if(newCost===null){unpriced.push({productId:product.id,name:product.name,reason:'new_card_cost_unknown'});continue;}
   // Cap remaining is deliberately requested for capped cards, not assumed unused.
   const remaining=context.remainingCaps?.[product.id];
   if(o.cashbackCap<1e9&&!finite(remaining)){unpriced.push({productId:product.id,name:product.name,reason:'remaining_cap_needed'});continue;}
   const discount=Math.min(context.price*o.discountRate/100,o.discountCap);
   const cashback=Math.min((o.stackable?context.price-discount:context.price)*o.cashbackRate/100,o.cashbackCap,remaining??1e9);
   const combined=o.stackable?discount+cashback:Math.max(discount,cashback),fee=o.transactionCost+newCost;
   const useDiscount=o.stackable||discount>=cashback;
   ranked.push({id:product.id+':'+o.id,productId:product.id,name:product.name,owned,discount:useDiscount?discount:0,cashback:o.stackable||!useDiscount?cashback:0,fee,netSaving:combined-fee,payToday:context.price-(useDiscount?discount:0)+fee,effectiveCost:context.price-combined+fee,sourceUrl:o.sourceUrl,conditions:o.conditions,endsAt:o.endsAt});
  }
 }
 ranked.sort((a,b)=>b.netSaving-a.netSaving||a.productId.localeCompare(b.productId)||a.id.localeCompare(b.id));
 // Keep the best eligible route per card, never sum mutually exclusive campaigns.
 return {ranked:ranked.filter((r,i)=>ranked.findIndex(x=>x.productId===r.productId)===i),unpriced};
}
