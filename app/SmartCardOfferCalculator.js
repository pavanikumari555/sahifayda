'use client';
import { useState } from 'react';
import { CalculatorField, CalculatorStat, money } from './calculator-fields';
import { numericInput, shoppingSavings } from '../lib/calculator-math.mjs';
const source='https://www.icici.bank.in/personal-banking/cards/credit-card/amazon-pay-credit-card';
export default function SmartCardOfferCalculator({initialPrice=30000,language='en'}) {
 const hi=language==='hi';
 const [price,setPrice]=useState(initialPrice),[discountRate,setDiscountRate]=useState(10),[discountCap,setDiscountCap]=useState(1500);
 const [cashbackRate,setCashbackRate]=useState(5),[cashbackCap,setCashbackCap]=useState(1000),[fee,setFee]=useState(0);
 const [stackable,setStackable]=useState(false),[prime,setPrime]=useState(false);
 const [confirmed,setConfirmed]=useState(false);
 const r=shoppingSavings(Object.fromEntries(Object.entries({price,discountRate,discountCap,cashbackRate,cashbackCap,fee}).map(([k,v])=>[k,numericInput(v)]).concat([['stackable',stackable]])));
 function amazonExample(){setDiscountRate(0);setDiscountCap(0);setCashbackRate(prime?5:3);setCashbackCap(1e9);setFee(0);setStackable(false);setConfirmed(true);}
 return <section className="calc-shell">
  <h2>{hi?'कैशबैक बनाम तुरंत छूट: असली बचत कितनी?':'Cashback vs instant discount: what do you save?'}</h2>
  <p>{hi?'स्टोर या बैंक के ऑफर से दर और बची हुई cap भरें। शुरुआती आँकड़े सिर्फ उदाहरण हैं; यह live offer finder नहीं है।':'Enter rates and your remaining cap from the store or bank offer. Starting figures are examples; this is not a live offer finder.'}</p>
  <div className="calc-grid">
   <CalculatorField label={hi?'योग्य खरीद की कीमत (₹)':'Eligible purchase price (₹)'} value={price} onChange={setPrice} min={1} max={1e9}/>
   <CalculatorField label={hi?'तुरंत छूट (%)':'Instant discount (%)'} value={discountRate} onChange={setDiscountRate} max={100}/>
   <CalculatorField label={hi?'छूट की अधिकतम राशि (₹)':'Discount cap (₹)'} value={discountCap} onChange={setDiscountCap} max={1e9}/>
   <CalculatorField label={hi?'कैशबैक दर (%)':'Cashback rate (%)'} value={cashbackRate} onChange={setCashbackRate} max={100}/>
   <CalculatorField label={hi?'बची हुई कैशबैक सीमा (₹)':'Remaining cashback cap (₹)'} value={cashbackCap} onChange={setCashbackCap} max={1e9}/>
   <CalculatorField label={hi?'अलग शुल्क व कर (₹)':'Separate fees and taxes (₹)'} value={fee} onChange={setFee} max={1e9}/>
  </div>
  <label><input type="checkbox" checked={stackable} onChange={e=>setStackable(e.target.checked)}/>{hi?' ऑफर की शर्तों में दोनों लाभ साथ मिलने की पुष्टि है':' Offer terms confirm both benefits can be combined'}</label>
  {!r?<p role="alert" className="calc-error">{hi?'सभी राशि और 0–100% की दर सही भरें।':'Enter valid amounts and rates from 0 to 100%.'}</p>:<div className="calc-grid" aria-live="polite">
   <div className="calc-panel"><h3>{hi?'तुरंत छूट का विकल्प':'Instant-discount option'}</h3><CalculatorStat label={hi?'आज देना होगा (शुल्क सहित)':'Pay today (including fees)'}>{money(r.upfrontPrice+numericInput(fee))}</CalculatorStat><CalculatorStat label={hi?'तुरंत छूट':'Instant discount'}>{money(r.discount)}</CalculatorStat></div>
   <div className="calc-panel"><h3>{stackable?(hi?'साथ में कैशबैक':'Combined cashback'):(hi?'कैशबैक का अलग विकल्प':'Separate cashback option')}</h3><CalculatorStat label={hi?'आज देना होगा (शुल्क सहित)':'Pay today (including fees)'}>{money((stackable?r.upfrontPrice:numericInput(price))+numericInput(fee))}</CalculatorStat><CalculatorStat label={hi?'बाद में अनुमानित लाभ':'Estimated later reward'}>{money(r.cashback)}</CalculatorStat></div>
   <div className="calc-panel"><CalculatorStat label={stackable?(hi?'दोनों के बाद प्रभावी लागत':'Effective cost after both'):(hi?'बेहतर अलग विकल्प की प्रभावी लागत':'Effective cost of better separate option')}>{money(r.effectiveCost)}</CalculatorStat><CalculatorStat label={hi?'शुल्क के बाद शुद्ध बचत':'Net saving after fees'}>{money(r.netSaving)}</CalculatorStat></div>
  </div>}
  <p className="calc-note">{hi?'बिना पुष्टि दोनों लाभ नहीं जोड़े जाते। साथ मिलने पर कैशबैक, छूट के बाद कीमत पर निकाला जाता है। कैशबैक आज की cash payment कम नहीं करता। न्यूनतम खरीद, merchant/category exclusions, EMI, rounding, reward redemption और card approval अलग जाँचें।':'Benefits are not added without confirmation. When combined, cashback is calculated on the discounted price. Later rewards do not reduce cash paid today. Check minimum spend, merchant/category exclusions, EMI, rounding, redemption and card approval separately.'}</p>
  <details><summary>{hi?'स्रोत वाला Amazon Pay ICICI उदाहरण':'Sourced Amazon Pay ICICI example'}</summary>
   <p>{hi?'सामान्य योग्य Amazon खरीद के लिए Prime 5%, non-Prime 3%। कुछ खरीद पर अलग नियम हैं। यह उदाहरण तुरंत छूट या EMI reward की पुष्टि नहीं करता।':'For ordinary eligible Amazon purchases: Prime 5%, non-Prime 3%. Some transactions have different rules. This example does not confirm an instant discount or EMI rewards.'}</p>
   <label><input type="checkbox" checked={prime} onChange={e=>{setPrime(e.target.checked);setConfirmed(false);}}/>{hi?' मैं Prime सदस्य हूँ':' I am a Prime member'}</label><p><button type="button" onClick={amazonExample}>{hi?'चुनी हुई सदस्यता का उदाहरण भरें':'Load example for selected membership'}</button></p>
   {confirmed&&<p role="status">{hi?'उदाहरण भरा गया; आपके बदले inputs और checkout की शर्तें लागू होंगी।':'Example loaded; your edited inputs and checkout terms still apply.'}</p>}
   <p><a href={source} target="_blank" rel="noopener noreferrer">{hi?'आधिकारिक स्रोत':'Official source'}</a> · 2026-11-10</p>
  </details>
  <p><a href={(hi?'/hi':'')+'/guides/credit-card/'}>{hi?'क्रेडिट कार्ड शुल्क और शर्तों की गाइड':'Credit card fees and conditions guide'}</a></p>
 </section>;
}
