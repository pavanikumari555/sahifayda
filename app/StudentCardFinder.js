'use client';
import { useState } from 'react';
import { CalculatorField, money } from './calculator-fields';
import { numericInput } from '../lib/calculator-math.mjs';
import { reviewedFdCards, calculatorReview, calculatorRecheck, fdSource } from '../lib/calculator-products.mjs';

export default function StudentCardFinder({language='en'}) {
 const hi=language==='hi';
 const [amount,setAmount]=useState(5000);
 const fd=numericInput(amount), valid=Number.isFinite(fd)&&fd>=0&&fd<=1e9;
 const cards=valid?reviewedFdCards(fd):[];
 const stale=new Date().toISOString().slice(0,10)>calculatorRecheck;
 return <section className="calc-shell">
  <h2>{hi?'बिना सैलरी स्लिप पहला क्रेडिट कार्ड: FD विकल्प':'First credit card without a salary slip: FD options'}</h2>
  <p>{hi?'आपकी FD राशि से प्रकाशित न्यूनतम जमा शर्त मिलाएँ। यह eligibility या मंजूरी का निर्णय नहीं है।':'Match your FD budget to published minimum deposits. This is not an eligibility or approval decision.'}</p>
  <div className="calc-grid"><CalculatorField label={hi?'FD में रख सकने वाली राशि (₹)':'Your FD budget (₹)'} value={amount} onChange={setAmount} max={1e9}/></div>
  {!valid&&<p role="alert" className="calc-error">{hi?'सही, शून्य या अधिक राशि भरें।':'Enter a valid non-negative amount.'}</p>}
  <p className="calc-note">{hi?'कवरेज: एक बैंक के दो समीक्षित उदाहरण; पूरे बाजार की तुलना नहीं। सिर्फ न्यूनतम FD राशि पर filter होता है, आपकी उम्र, KYC या बैंक की मंजूरी पर नहीं।':'Coverage: two reviewed examples from one bank, not the whole market. Filtering checks only the minimum FD amount, not your age, KYC or bank approval.'}</p>
  <p>{hi?'स्रोत जाँचा: ':'Source checked: '}<time dateTime={calculatorReview}>{calculatorReview}</time>{hi?' · दोबारा समीक्षा: ':' · Recheck by: '}{calculatorRecheck}</p>
  {stale&&<p role="status">{hi?'इन शर्तों की दोबारा समीक्षा बाकी है। अभी matching रोक दी गई है।':'These terms need another review. Matching is paused until they are checked.'}</p>}
  {valid&&!stale&&cards.length===0&&<p role="status">{hi?'इस रकम पर हमारे समीक्षित उदाहरणों में कोई match नहीं है। कम FD वाला कोई दूसरा उत्पाद उपलब्ध है, यह इससे तय नहीं होता।':'No match in this reviewed subset for your budget. This does not establish whether another provider has a lower-deposit option.'}</p>}
  <div className="calc-grid">{cards.map(card=><article className="calc-panel" key={card.id}>
   <h3>{card.name}</h3><p>{hi?'प्रकाशित न्यूनतम FD: ':'Published minimum FD: '}{money(card.minFd)}</p><p>{hi?card.hi:card.en}</p>
   <a href={fdSource} target="_blank" rel="noopener noreferrer">{hi?'आधिकारिक शुल्क और शर्तें पढ़ें':'Read official fees and conditions'}</a>
  </article>)}</div>
  <h3>{hi?'आवेदन से पहले':'Before applying'}</h3>
  <p>{hi?'FD पर lien लग सकता है; बकाया न चुकाने पर बैंक इससे वसूली कर सकता है। ब्याज दर, FD तोड़ने की शर्त, सभी शुल्क और अंतिम credit limit बैंक से जाँचें। किसी score या मंजूरी की गारंटी नहीं है।':'The FD may be held under lien and used to recover unpaid dues. Check the FD rate, closure conditions, full fees and final credit limit with the bank. No score or approval is guaranteed.'}</p>
  <a href={(hi?'/hi':'')+'/guides/credit-card/'}>{hi?'क्रेडिट कार्ड की पूरी गाइड':'Read the credit card guide'}</a>
 </section>;
}
