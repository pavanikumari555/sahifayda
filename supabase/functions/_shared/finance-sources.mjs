// Fixed official sources: data and navigation destinations never come from a model.
export const financeSources=[
 {id:'icici-personal',category:'loan',purpose:'personal',name:'ICICI Bank Personal Loan',url:'https://www.icici.bank.in/personal-banking/loans/personal-loan/personal-loan-interest-rates',anchor:'Latest Personal Loan Interest Rates and Charges',parser:'icici-personal'},
 {id:'hdfc-personal',category:'loan',purpose:'personal',name:'HDFC Bank Personal Loan',url:'https://www.hdfc.bank.in/personal-loan',anchor:'Fees & Charges',parser:'hdfc-personal'},
 {id:'hdfc-business',category:'loan',purpose:'business',name:'HDFC Bank Business Loan',url:'https://www.hdfc.bank.in/business-loan',anchor:'Rack Interest Rate Range',parser:'hdfc-business'},
 {id:'kotak811-source',category:'savings_account',name:'Kotak811',url:'https://www.kotak811.bank.in/savings-account/811-zero-balance-digital-savings-account',anchor:'zero balance',parser:'source'},
 {id:'sbi-basic-source',category:'savings_account',name:'SBI Basic Savings Bank Deposit Account',url:'https://sbi.bank.in/web/personal-banking/accounts/saving-account/basic-savings-bank-deposit-account',anchor:'Minimum balance',parser:'source'},
 {id:'zerodha-source',category:'demat',name:'Zerodha charges',url:'https://zerodha.com/charges/',anchor:'Equity delivery',parser:'source'},
 {id:'angelone-source',category:'demat',name:'Angel One charges',url:'https://www.angelone.in/exchange-transaction-charges',anchor:'Brokerage',parser:'source'},
 {id:'amazon-card-source',category:'credit_card',name:'Amazon Pay ICICI Bank Credit Card',url:'https://www.icici.bank.in/personal-banking/cards/credit-card/amazon-pay-credit-card',anchor:'joining fee',parser:'source'},
 {id:'insurance-source',category:'insurance',name:'ICICI Lombard insurance FAQs',url:'https://www.icicilombard.com/info-center/faqs',anchor:'waiting',parser:'source'},
 {id:'upi-source',category:'other',name:'NPCI UPI FAQs',url:'https://www.npci.org.in/what-we-do/upi/faqs',anchor:'UPI',parser:'source'}
];
export const financeSourceById=Object.fromEntries(financeSources.map(s=>[s.id,s]));
const numeric=s=>Number(s.replaceAll(',',''));
export function extractFinanceRecord(source,text){
 text=String(text||'').replace(/&#(x[0-9a-f]+|\d+);/gi,(_,n)=>{const code=n[0].toLowerCase()==='x'?parseInt(n.slice(1),16):Number(n);return code>0&&code<=0x10ffff?String.fromCodePoint(code):' ';}).replace(/&mdash;|&ndash;/gi,'–').replace(/&quot;/gi,'"').replace(/&apos;/gi,"'");
 if(typeof text!=='string'||text.length<500)throw Error('Insufficient official source text');
 const anchor=text.toLowerCase().indexOf(source.anchor.toLowerCase());
 if(anchor<0)throw Error('Expected source section not found');
 const excerpt=text.slice(anchor,anchor+850).split(/\s+/).slice(0,24).join(' ');
 if(source.parser==='source')return {excerpt,facts:{kind:'source_snapshot'}};
 let rate,fee,condition;
 if(source.parser==='icici-personal'){
  rate=text.match(/Personal Loan interest rates\s*(?:Between\s*)?(\d{1,2}(?:\.\d+)?)%\s*(?:and|to|[-–])\s*(\d{1,2}(?:\.\d+)?)%\s*per annum/i);
  fee=text.match(/Processing Charges\s*Up to\s*(\d+(?:\.\d+)?)%\s*of the loan amount.{0,60}(?:taxes|GST)/i);
  if(!rate||!fee)throw Error('Loan rate/fee section needs review');
  condition={floor_min_amount:null,fee_max:numeric(fee[1]),fee_unit:'percent',fee_taxes_extra:true};
 }else if(source.parser==='hdfc-business'){
  rate=text.match(/Rack Interest Rate Range[-\s]*Minimum\s*(\d{1,2}(?:\.\d+)?)%\s*and maximum\s*(\d{1,2}(?:\.\d+)?)%/i);
  fee=text.match(/Loan Processing Charges[-\s]*(?:Tenure\s*)?Up to\s*(\d+(?:\.\d+)?)%\*?\s*of the loan amount/i);
  const years=text.match(/Employment:\s*(\d+) years in current business,\s*(\d+) years business experience/i),turnover=text.match(/Turnover:\s*≥?\s*₹\s*(\d+) lakh/i);
  if(!rate||!fee||!years||!turnover)throw Error('Business rate or material conditions need review');
  condition={floor_min_amount:null,fee_max:Number(fee[1]),fee_unit:'percent',fee_taxes_extra:true,business_min_years:Number(years[1]),business_experience_years:Number(years[2]),turnover_min:Number(turnover[1])*100000};
 }else{
  rate=text.match(/Rate of Interest:\s*(\d{1,2}(?:\.\d+)?)%\s*[-–]\s*(\d{1,2}(?:\.\d+)?)%\s*\(Fixed Rate\)/i);
  fee=text.match(/Loan Processing Charges:\s*Up to\s*(?:₹|Rs\.?|INR)\s*([\d,]+)\s*\/?-?\s*\+\s*GST/i);
  const threshold=text.match(/Note:\s*Get\s*(\d+(?:\.\d+)?)%\*?\s*p\.?a\.?\s*on\s*(?:₹|Rs\.?)\s*(\d+(?:\.\d+)?)\s*lakh\+/i);
  if(!rate||!fee||!threshold||Number(threshold[1])!==Number(rate[1]))throw Error('Loan rate/fee/amount condition needs review');
  condition={floor_min_amount:Number(threshold[2])*100000,fee_max:numeric(fee[1]),fee_unit:'inr',fee_taxes_extra:true};
 }
 const min=Number(rate[1]),max=Number(rate[2]);
 const amount=source.parser==='hdfc-business'?text.match(/Avail of a loan up to\s*(?:₹|Rs\.?)\s*(\d+(?:\.\d+)?)\s*(lakh|crore)/i):text.match(/(?:Personal Loan of up to|Loan Up to)\s*(?:₹|Rs\.?)\s*(\d+(?:\.\d+)?)\s*(lakh|crore)/i);
 if(!amount)throw Error('Published loan amount limit needs review');
 const maxAmount=Number(amount[1])*(amount[2].toLowerCase()==='crore'?10000000:100000);
 if(!Number.isFinite(min)||min<1||max<min||max>60||condition.fee_max<=0||condition.fee_unit==='percent'&&condition.fee_max>10)throw Error('Implausible loan terms');
 const evidence=[rate[0],fee[0],...(condition.floor_min_amount?[`Advertised floor applies from ₹${condition.floor_min_amount.toLocaleString('en-IN')}`]:[])];
 return {excerpt:evidence.join(' | '),facts:{kind:'loan_rate',rate_min:min,rate_max:max,rate_basis:'annual_nominal',max_amount:maxAmount,...condition}};
}
export function currentFinanceRecords(records,now=new Date()){
 return (Array.isArray(records)?records:[]).filter(r=>{
  const s=financeSourceById[r.id],age=now.getTime()-Date.parse(r.checked_at);
  return s&&r.status==='verified'&&r.source_url===s.url&&r.category===s.category&&Number.isFinite(age)&&age>=-300000&&age<48*3600000;
 });
}
export function loanComparisons(records,profile,now=new Date()){
 return currentFinanceRecords(records,now).filter(r=>r.category==='loan'&&financeSourceById[r.id].purpose===profile?.values?.purpose&&r.facts?.kind==='loan_rate'&&Number.isFinite(r.facts.rate_min)&&Number.isFinite(r.facts.rate_max)&&r.facts.rate_min>=1&&r.facts.rate_max>=r.facts.rate_min&&r.facts.rate_max<=60&&Number.isFinite(r.facts.max_amount)&&profile.values.amount<=r.facts.max_amount&&(!r.facts.floor_min_amount||profile.values.amount>=r.facts.floor_min_amount)&&(!r.facts.business_min_years||profile.values.businessYears>=r.facts.business_min_years)).sort((a,b)=>a.facts.rate_min-b.facts.rate_min||a.id.localeCompare(b.id));
}
export function financePromptFacts(records,now=new Date()){
 return currentFinanceRecords(records,now).filter(r=>r.facts?.kind==='loan_rate').map(r=>{
  const f=r.facts;if(!Number.isFinite(f.rate_min)||!Number.isFinite(f.rate_max)||f.rate_min<1||f.rate_max<f.rate_min||f.rate_max>60||!Number.isFinite(f.fee_max)||!['percent','inr'].includes(f.fee_unit)||f.floor_min_amount!==null&&!Number.isFinite(f.floor_min_amount))return '';
  return `${financeSourceById[r.id].name}: ${financeSourceById[r.id].purpose} loan published annual nominal rate ${f.rate_min}% to ${f.rate_max}%; processing fee up to ${f.fee_max}${f.fee_unit==='percent'?'%':' INR'} plus taxes; advertised floor amount condition ${f.floor_min_amount||'not specified'} INR; maximum amount ${f.max_amount} INR; ${f.business_min_years?'requires existing business '+f.business_min_years+' years, business experience '+f.business_experience_years+' years and minimum turnover '+f.turnover_min+' INR; ':''}checked ${r.checked_at}. Not an applicant quote, APR or approval. Compare amount conditions and total KFS costs. Borrower eligibility and the actual rate remain unknown.`;
 }).filter(Boolean).join('\n').slice(0,1800);
}
