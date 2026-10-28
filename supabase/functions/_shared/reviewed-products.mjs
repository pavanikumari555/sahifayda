import {productDetails,costLabels} from './product-details.mjs';
export const reviewedOn='2026-10-28';
export const reviewUntil='2026-11-27';
// Informational catalog, separate from the commercial partner table.
const records={
 angelone:{name:'Angel One',url:'https://www.angelone.in/exchange-transaction-charges'},
 amazon:{name:'Amazon Pay ICICI Bank Credit Card',url:'https://www.icici.bank.in/personal-banking/cards/credit-card/amazon-pay-credit-card',fee:0,facts:'Joining and annual fee ₹0. Invite-only. Amazon rewards depend on Prime status and eligible purchases; rewards are not bank cash. Approval remains with issuer.'},
 hdfc:{name:'HDFC Bank MoneyBack+',url:'https://www.hdfc.bank.in/credit-cards/moneyback-plus-credit-card',fee:500,facts:'Joining/renewal membership fee ₹500 plus applicable taxes. CashPoints with redemption conditions and selected merchant restrictions. Eligibility is not assessed here.'},
 sbi:{name:'CASHBACK SBI Card',url:'https://www.sbicard.com/en/most-important-terms-and-conditions.page',fee:999,facts:'Joining/renewal fee ₹999 plus applicable taxes. Online cashback has caps and excluded transactions. No published reward percentage or approval estimate is included in this reviewed catalog.'},
 kotak:{name:'Kotak811 Zero Balance Savings Account',url:'https://www.kotak811.bank.in/savings-account/811-zero-balance-digital-savings-account',facts:'Minimum balance ₹0. Basic online opening requires ₹2,000 initial funding, which is the account holder’s money, not a fee. Physical debit card/some services have charges. Full KYC applies; Super is a separate variant.'},
 basic:{name:'SBI Basic Savings Bank Deposit Account',url:'https://sbi.bank.in/web/personal-banking/accounts/saving-account/basic-savings-bank-deposit-account',facts:'Minimum balance ₹0. Basic account cash withdrawal/service restrictions apply. A BSBDA holder cannot hold another savings account at the same bank. Check local branch and official rules.'},
 zerodha:{name:'Zerodha',url:'https://zerodha.com/charges',facts:'Equity delivery brokerage ₹0. Non-BSDA AMC ₹300/year plus GST; first-year and BSDA conditions differ. DP, statutory and other transaction charges still apply. Trading tariffs differ.'},
 groww:{name:'Groww',url:'https://groww.in/pricing'},
 flattrade:{name:'Flattrade',url:'https://flattrade.in/charges/'},
 mstock:{name:'m.Stock',url:'https://www.mstock.com/pricing'},
 shoonya:{name:'Shoonya',url:'https://shoonya.com/pricing'}
};
export const catalog=Object.fromEntries(Object.entries(records).map(([id,item])=>{
 const details=productDetails[id];
 const facts=details.variant.en+'. '+Object.entries(details.costs).map(([key,value])=>costLabels[key].en+': '+value.en).join('. ')+' '+details.limits.map(v=>v.en).join(' ');
 return [id,{...item,id,category:details.category,details,facts,reviewedOn,reviewUntil}];
}));
export const productCategories={credit_card:{en:'Credit cards',hi:'क्रेडिट कार्ड',slug:'credit-cards'},savings_account:{en:'Savings accounts',hi:'बचत खाते',slug:'savings-accounts'},demat:{en:'Demat & trading',hi:'डीमैट और ट्रेडिंग',slug:'demat-accounts'}};
export function productPath(id,language='en'){const item=catalog[id];return (language==='hi'?'/hi':'')+'/products/'+productCategories[item.category].slug+'/#'+id;}
export function currentProduct(id,now=new Date()){return Object.hasOwn(catalog,id)&&now.toISOString().slice(0,10)<=catalog[id].reviewUntil?catalog[id]:null;}
export function mentionedProductIds(text,now=new Date()){
 const aliases={angelone:/\b(?:angel\s*(?:one|1)|angle\s*one|angel\s*broking)\b|एंजेल\s*(?:वन|वन)/i,amazon:/amazon\s+pay\s+icici/i,hdfc:/moneyback\s*\+/i,sbi:/cashback\s+sbi/i,kotak:/kotak\s*811/i,basic:/sbi\s+(?:basic|bsbd)/i,zerodha:/\bzerodha\b/i,groww:/\bgroww\b/i,flattrade:/\bflattrade\b/i,mstock:/\bm[.\s]?stock\b/i,shoonya:/\bshoonya\b/i};
 return Object.keys(aliases).map(id=>({id,index:String(text).search(aliases[id])})).filter(v=>v.index>=0&&currentProduct(v.id,now)).sort((a,b)=>a.index-b.index).slice(0,3).map(v=>v.id);
}
export function reviewedFacts(now=new Date()){
 return now.toISOString().slice(0,10)<=reviewUntil?Object.values(catalog).map(p=>p.name+': '+p.facts).join('\n'):'';
}
