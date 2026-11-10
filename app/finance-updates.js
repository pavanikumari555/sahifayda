'use client';
import './finance-updates.css';
import {useEffect,useState} from 'react';
import {readFinanceKnowledge,currentFinanceRecords,financeSourceById} from '../lib/finance-knowledge.mjs';
import {ProductReferral,useProductPartners} from './product-card';
import {productIsCurrent} from '../lib/product-directory.mjs';
export function useFinanceKnowledge(){
 const [rows,setRows]=useState([]),[state,setState]=useState('loading');
 useEffect(()=>{let live=true;const refresh=()=>readFinanceKnowledge().then(data=>{if(live){setRows(data);setState('ready');}}).catch(()=>{if(live){setRows([]);setState('error');}});refresh();const timer=setInterval(refresh,60000);window.addEventListener('focus',refresh);return()=>{live=false;clearInterval(timer);window.removeEventListener('focus',refresh);};},[]);
 return {rows,state};
}
export function LoanRateCards({records=[],language='hi',compact=false}){
 const hi=language==='hi',feed=useProductPartners();
 return <div className="finance-rate-cards">{currentFinanceRecords(records).filter(row=>feed.products.some(p=>p.id===row.id.replaceAll('-','_')&&productIsCurrent(p))).map(row=>{
  const source=financeSourceById[row.id],f=row.facts;if(!source||f.kind!=='loan_rate')return null;
  const guide=(hi?'/hi':'')+'/guides/'+(source.purpose==='business'?'business-loan':'loan-options')+'/#'+row.id;
  const product=feed.products.find(p=>p.id===row.id.replaceAll('-','_'));
  return <article className="finance-rate-card" key={row.id} id={compact?undefined:row.id}>
   <h3>{source.name}</h3>
   <p><strong>{f.rate_min}%–{f.rate_max}% {hi?'सालाना ब्याज':'annual interest'}</strong></p>
   {!compact&&<>
    <p>{hi?'प्रोसेसिंग फीस अधिकतम ':'Processing fee up to '}{f.fee_unit==='inr'?'₹':''}{f.fee_max.toLocaleString('en-IN')}{f.fee_unit==='percent'?'%':''}{hi?' + लागू कर। कुछ पात्र मामलों में छूट हो सकती है; पूरी शर्तें बैंक से पढ़ें।':' + applicable taxes. Eligible fee waivers may apply; read the bank’s full terms.'}</p>
    {f.floor_min_amount>0&&<p>{hi?'शुरुआती दर का विज्ञापन ₹':'The advertised starting rate is for ₹'}{f.floor_min_amount.toLocaleString('en-IN')}{hi?' या अधिक के लोन के लिए है।':' or larger loans.'}</p>}
    {f.business_min_years>0&&<p>{hi?'इस योजना में चल रहे कारोबार की शर्तें हैं: ':'This scheme has existing-business conditions: '}{f.business_min_years}{hi?' साल का चालू कारोबार, ':' years in the current business, '}{f.business_experience_years}{hi?' साल का कारोबारी अनुभव और कम-से-कम ₹':' years of business experience and turnover of at least ₹'}{f.turnover_min.toLocaleString('en-IN')}{hi?' टर्नओवर। आय, मुनाफ़े और अन्य पात्रता की शर्तें बैंक के पेज पर पढ़ें।':' turnover. Read the bank’s income, profitability and other eligibility conditions.'}</p>}
    <p>{hi?'यह प्रकाशित दर है, आपकी मंज़ूर दर या APR नहीं। लिखित KFS, कुल खर्च और पात्रता बैंक से जाँचें।':'Published rate, not your approved rate or APR. Check the written KFS, total costs and eligibility with the bank.'}</p>
   </>}
   {compact&&<a className="product-library-link" href={guide}>{hi?'पूरी फीस और शर्तें पढ़ें':'Read full fees and conditions'} →</a>}
   {product&&<ProductReferral productId={product.id} product={product} language={language} feed={feed} compact/>}
   <a className="product-library-link" href={row.id==='icici-personal'?'https://www.icici.bank.in/personal-banking/loans/personal-loan':source.url} target="_blank" rel="noopener noreferrer">{hi?'बैंक का आधिकारिक आवेदन पेज':'Bank’s official application page'} ↗</a>
   {!compact&&<a href={source.url} target="_blank" rel="noopener noreferrer">{hi?'बैंक की दरें और शर्तें':'Bank rates and terms'} ↗</a>}
   <small>{hi?'आख़िरी सफल जाँच: ':'Last successful check: '}{new Date(row.checked_at).toLocaleString(hi?'hi-IN':'en-IN',{timeZone:'Asia/Kolkata'})}</small>
  </article>;
 })}</div>;
}
export default function FinanceUpdates({language='hi',category,purpose}){
 const hi=language==='hi',feed=useFinanceKnowledge(),[selected,setSelected]=useState('all');
 const chosen=category||selected,rows=feed.rows.filter(row=>chosen==='all'||row.category===chosen).filter(row=>!purpose||financeSourceById[row.id]?.purpose===purpose),fresh=new Set(currentFinanceRecords(feed.rows).map(r=>r.id));
 const labels={all:hi?'सभी':'All',loan:hi?'लोन':'Loans',savings_account:hi?'बचत खाते':'Savings',demat:hi?'डीमैट':'Demat',credit_card:hi?'कार्ड':'Cards',insurance:hi?'बीमा':'Insurance',other:hi?'भुगतान':'Payments'};
 if(purpose&&feed.state==='ready'&&!rows.length)return <section className="finance-updates"><h2>{hi?'वर्तमान दरों की जानकारी':'Current rate information'}</h2><p>{hi?'इस तरह के लोन की वर्तमान दरों का पुष्ट डेटा अभी जुड़ा नहीं है। नीचे आधिकारिक स्रोत और अगला कदम पढ़ें।':'Confirmed current rates for this loan type are not connected yet. Read the official sources and next steps below.'}</p></section>;
 return <section className="finance-updates" aria-label={hi?'वर्तमान आधिकारिक जानकारी':'Current official information'}><h2>{hi?'आज की जानकारी और स्रोत की जाँच':'Current information and source checks'}</h2><p>{hi?'इन चुने आधिकारिक पेजों की रोज़ जाँच होती है। साफ़ तौर पर पुष्ट दरें अपने-आप यहाँ और SIA में अपडेट होती हैं। सभी बैंकों या हर योजना की तुलना शामिल नहीं है।':'Selected official pages are checked daily. Confirmed supported rate fields update here and in SIA automatically. Coverage does not include every bank or plan.'}</p>{!category&&<div className="finance-filters" aria-label={hi?'जानकारी चुनें':'Choose information'}>{Object.entries(labels).map(([key,label])=><button key={key} type="button" aria-pressed={selected===key} onClick={()=>setSelected(key)}>{label}</button>)}</div>}{feed.state==='loading'?<p role="status">{hi?'नई जानकारी जाँच रहे हैं…':'Checking current information…'}</p>:feed.state==='error'?<p role="status">{hi?'अभी नई जानकारी नहीं मिल पाई। नीचे की तारीख वाली गाइड पढ़ सकते हैं; आवेदन से पहले आधिकारिक स्रोत जाँचें।':'Current information could not be loaded. You can read the dated guides; check official terms before applying.'}</p>:<><LoanRateCards records={rows.filter(r=>fresh.has(r.id)&&r.facts.kind==='loan_rate').sort((a,b)=>a.facts.rate_min-b.facts.rate_min)} language={language}/>{rows.filter(r=>!fresh.has(r.id)||r.facts.kind!=='loan_rate').map(row=><article className="finance-source-card" key={row.id}><h3>{row.title}</h3><p>{fresh.has(row.id)?(hi?'आधिकारिक पेज की सफल जाँच। नीचे नया स्रोत अंश है; पूरी शर्तें प्रदाता के पेज पर पढ़ें।':'Official page checked successfully. The latest source excerpt is below; read full terms with the provider.'):(hi?'नई जानकारी की पुष्टि नहीं हो पाई; इसे वर्तमान ऑफ़र न मानें।':'A current observation could not be confirmed; do not treat this as a current offer.')}</p>{fresh.has(row.id)&&<details><summary>{hi?'आधिकारिक पेज का नया अंश':'Latest official-source excerpt'}</summary><p lang="en">{row.excerpt}</p></details>}<a href={row.source_url} target="_blank" rel="noopener noreferrer">{hi?'पूरी आधिकारिक जानकारी':'Read the official information'} ↗</a><small>{hi?'अंतिम प्रयास: ':'Last attempt: '}{new Date(row.last_attempt_at).toLocaleString(hi?'hi-IN':'en-IN',{timeZone:'Asia/Kolkata'})}</small></article>)}</>}</section>;
}
