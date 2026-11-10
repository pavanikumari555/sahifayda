'use client';
import { useState } from 'react';
import { CalculatorField, CalculatorStat, money } from './calculator-fields';
import { numericInput, emergencyPlan } from '../lib/calculator-math.mjs';
export default function EmergencyFundCalculator({language='en'}) {
 const hi=language==='hi';
 const [expenses,setExpenses]=useState(30000),[fund,setFund]=useState(50000),[saving,setSaving]=useState(5000),[job,setJob]=useState('salaried'),[months,setMonths]=useState(6);
 function changeJob(e){const value=e.target.value;setJob(value);setMonths({salaried:6,self_employed:9,freelance:12}[value]);}
 const r=emergencyPlan(numericInput(expenses),numericInput(fund),numericInput(saving),job,numericInput(months));
 return <section className="calc-shell"><h2>{hi?'इमरजेंसी फंड: कितनी बचत अलग रखें?':'Emergency fund: how much should you set aside?'}</h2>
 <p>{hi?'परिवार के सभी जरूरी खर्च जोड़ें: किराया, राशन, EMI, दवा और आश्रितों का खर्च। परिवार के सदस्यों से इस कुल खर्च को दोबारा गुणा नहीं किया जाता।':'Include the whole household’s essentials: rent, groceries, EMIs, medicines and dependants. The household total is not multiplied by family size again.'}</p>
 <div className="calc-grid">
  <CalculatorField label={hi?'परिवार का जरूरी मासिक खर्च (₹)':'Essential household expenses (₹/month)'} value={expenses} onChange={setExpenses} min={1} max={1e8}/>
  <label className="calc-field"><span>{hi?'आय का प्रकार':'Income type'}</span><select value={job} onChange={changeJob}><option value="salaried">{hi?'वेतन':'Salaried'}</option><option value="self_employed">{hi?'स्वरोजगार':'Self-employed'}</option><option value="freelance">{hi?'अनियमित / फ्रीलांस':'Irregular / freelance'}</option></select></label>
  <CalculatorField label={hi?'कितने महीने का buffer (1–36)':'Buffer months (1–36)'} value={months} onChange={setMonths} min={1} max={36} step={1}/>
  <CalculatorField label={hi?'पहले से उपलब्ध emergency savings (₹)':'Existing accessible emergency savings (₹)'} value={fund} onChange={setFund} max={1e10}/>
  <CalculatorField label={hi?'हर महीने नई बचत (₹)':'New savings each month (₹)'} value={saving} onChange={setSaving} max={1e8}/>
 </div>
 <p className="calc-note">{hi?'6/9/12 महीने हमारे शुरुआती planning examples हैं, नियम या व्यक्तिगत सलाह नहीं। एक कमाने वाला परिवार, आश्रित, अनियमित आय या दूसरे जोखिम हों तो अपनी buffer अवधि बदलें।':'6/9/12 months are starting planning examples, not a rule or personalised advice. Adjust the buffer for a single earner, dependants, irregular income and other risks.'}</p>
 {!r?<p role="alert" className="calc-error">{hi?'सही खर्च, बचत और पूरे महीनों की अवधि भरें।':'Enter valid expenses, savings and a whole number of months.'}</p>:<div className="calc-grid" aria-live="polite">
  <CalculatorStat label={hi?'लक्ष्य':'Target'}>{money(r.target)}</CalculatorStat><CalculatorStat label={r.gap>0?(hi?'और बचाना है':'Still to save'):(hi?'लक्ष्य से अतिरिक्त':'Above the target')}>{money(Math.abs(r.gap))}</CalculatorStat>
  <CalculatorStat label={hi?'लक्ष्य तक समय':'Time to target'}>{r.monthsToTarget===null?(hi?'मासिक बचत बढ़ाए बिना समय तय नहीं':'No completion date without positive monthly savings'):r.monthsToTarget===0?(hi?'लक्ष्य पूरा है':'Target already covered'):r.monthsToTarget+(hi?' महीने':' months')}</CalculatorStat>
 </div>}
 <p>{hi?'लक्ष्य = मासिक खर्च × चुने हुए महीने। समय = बची रकम ÷ नई मासिक बचत, अगले पूरे महीने तक। इसमें ब्याज या महँगाई नहीं जोड़ी जाती। Credit limit या locked FD को उपलब्ध cash न मानें।':'Target = monthly expenses × chosen months. Time = remaining gap ÷ new monthly savings, rounded up. No interest or inflation is assumed. Do not count a credit limit or locked FD as accessible cash.'}</p>
 <a href={(hi?'/hi':'')+'/guides/monthly-budget/'}>{hi?'खर्च और बजट समझें':'Understand expenses and budgeting'}</a>
 </section>;
}
