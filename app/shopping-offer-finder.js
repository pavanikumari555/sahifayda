'use client';
import {useState} from 'react';
import {useProductPartners,ProductReferral} from './product-card';
import {rankShoppingOffers} from '../supabase/functions/_shared/shopping-offers.mjs';
import {money} from './calculator-fields';
export default function ShoppingOfferFinder({price,language='en'}){
 const hi=language==='hi',feed=useProductPartners();
 const [merchant,setMerchant]=useState('amazon'),[item,setItem]=useState('mobile'),[model,setModel]=useState(''),[prime,setPrime]=useState(false),[payment,setPayment]=useState('full'),[card,setCard]=useState('none'),[remaining,setRemaining]=useState(''),[eligible,setEligible]=useState(false);
 const context={price,merchant,item,model,prime,payment,existingCards:card==='none'?[]:[card],existingOnly:card!=='none',remainingCaps:remaining!==''?{[card]:Number(remaining)}:{}};
 const result=rankShoppingOffers(feed.products,context),ranked=eligible?result.ranked:[];
 return <section className="calc-panel"><h3>{hi?'आपके budget पर card की बचत':'Compare card savings for your budget'}</h3>
  <p>{hi?'ऊपर की purchase price पर तुलना होगी। सबसे ऊपर अधिक शुद्ध बचत वाला reviewed विकल्प आएगा; केवल सबसे बड़ा प्रतिशत नहीं।':'Uses the purchase price above. Reviewed options are ordered by net saving after known costs.'}</p>
  <div className="calc-grid">
   <label className="calc-field"><span>{hi?'Store':'Store'}</span><select value={merchant} onChange={e=>{setMerchant(e.target.value);setEligible(false);}}>{['amazon','flipkart','myntra'].map(v=><option key={v}>{v}</option>)}</select></label>
   <label className="calc-field"><span>{hi?'खरीद':'Purchase'}</span><select value={item} onChange={e=>{setItem(e.target.value);setEligible(false);}}><option value="mobile">Mobile</option><option value="laptop">Laptop</option><option value="any">Other eligible purchase</option></select></label>
   <label className="calc-field"><span>{hi?'Exact model (यदि offer model पर निर्भर है)':'Exact model (for model-specific offers)'}</span><input value={model} maxLength={100} onChange={e=>{setModel(e.target.value);setEligible(false);}}/></label>
   <label className="calc-field"><span>{hi?'भुगतान':'Payment'}</span><select value={payment} onChange={e=>{setPayment(e.target.value);setEligible(false);}}><option value="full">Full payment</option><option value="emi">EMI</option></select></label>
   <label className="calc-field"><span>{hi?'पहले से मौजूद exact card':'Exact card you already hold'}</span><select value={card} onChange={e=>{setCard(e.target.value);setRemaining('');setEligible(false);}}><option value="none">No card — compare possible new cards</option>{feed.products.filter(p=>p.category==='credit_card').map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
   {card!=='none'&&<label className="calc-field"><span>{hi?'बचा हुआ cashback cap (online और कुल में जो कम हो) ₹':'Remaining cashback cap (lower of online and total) ₹'}</span><input type="number" min={0} max={1e9} value={remaining} onChange={e=>setRemaining(e.target.value)}/></label>}
  </div>
  {merchant==='amazon'&&<label><input type="checkbox" checked={prime} onChange={e=>setPrime(e.target.checked)}/>{hi?' मैं पहले से Prime member हूँ':' I am already a Prime member'}</label>}
  <p><label><input type="checkbox" checked={eligible} onChange={e=>setEligible(e.target.checked)}/>{hi?' Model/category, payment और checkout की पात्रता तथा बची सीमा की शर्तें जाँच ली हैं':' I checked model/category, payment, checkout eligibility and remaining-allowance conditions'}</label></p>
  <p role="status">{feed.productState==='loading'?(hi?'वर्तमान reviewed विकल्प लोड हो रहे हैं…':'Loading current reviewed options…'):feed.productState==='error'?(hi?'वर्तमान विकल्प नहीं लोड हुए। नीचे अपनी checkout दर भरकर तुलना करें।':'Current options unavailable. Compare your own checkout rates below.'):
   !eligible?(hi?'पहले checkout की पात्रता की पुष्टि करें; कोई बचत पक्की नहीं मानी गई है।':'Confirm checkout eligibility first; no saving is assumed guaranteed.'):
   !ranked.length?(hi?'इन शर्तों पर पूरी लागत वाला current match नहीं मिला। Unknown को zero नहीं माना गया है।':'No fully priced current match for these conditions. Unknown costs are not treated as zero.'):
   ranked.length===1?(hi?'एक reviewed match मिला; इसे पूरे बाजार का best नहीं कहा जा सकता।':'One reviewed match; this does not establish the market-wide best.'):(hi?'दिखाए गए reviewed विकल्पों की शुद्ध बचत के अनुसार तुलना':'Shown reviewed options ordered by net saving')}</p>
  {ranked.map((r,i)=><article className="calc-panel" key={r.id}><h4>{i+1}. {r.name}</h4>
   <p>{hi?'आज भुगतान':'Pay today'}: <strong>{money(r.payToday)}</strong> · {hi?'तत्काल छूट':'Instant discount'}: {money(r.discount)}</p>
   <p>{hi?'बाद का reward':'Later reward'}: {money(r.cashback)} · {hi?'शामिल शुल्क':'Included costs'}: {money(r.fee)}</p>
   <p>{hi?'शुद्ध बचत':'Net saving'}: <strong>{money(r.netSaving)}</strong> · {hi?'Reward के बाद लागत':'Cost after reward'}: {money(r.effectiveCost)}</p>
   <p>{r.conditions[hi?'hi':'en']}</p>{!r.owned&&<p>{hi?'यह संभावित नया card है। Approval और तत्काल उपलब्धता की गारंटी नहीं है।':'Potential new card; approval and immediate availability are not guaranteed.'}</p>}
   <a href={r.sourceUrl} target="_blank" rel="noopener noreferrer">{hi?'पूरी official शर्तें':'Full official terms'}</a>
   <ProductReferral productId={r.productId} product={feed.products.find(p=>p.id===r.productId)} language={language} feed={feed} compact/>
  </article>)}
  {eligible&&result.unpriced.map((r,i)=><p key={r.productId+i}>{r.name}: {r.reason==='remaining_cap_needed'?(hi?'बची हुई cashback सीमा भरें; उसे पूरी तरह उपलब्ध नहीं माना है।':'Enter the remaining cashback allowance; it is not assumed unused.'):(hi?'नया card लेने की कुल लागत पुष्ट नहीं; इसे ranking में नहीं रखा।':'New-card total cost is unconfirmed; excluded from ranking.')}</p>)}
  <p className="calc-note">{hi?'स्थायी rewards और sale campaigns अलग हैं। Expired, review-due, गलत model/merchant और EMI से बाहर offers शामिल नहीं होंगे। बदलाव स्वीकार होने पर data refresh होगा; आपकी भरी रकम अपने-आप नहीं बदलेगी।':'Base rewards and sale campaigns are separate. Expired, review-due, wrong-model/merchant and inapplicable EMI offers are excluded. Accepted updates refresh the data; your entered figures are preserved.'}</p>
 </section>;
}
