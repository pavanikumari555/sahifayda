'use client';
const blank=()=>({id:'',merchant:'amazon',item:'mobile',payment:'full',membership:'any',startsAt:'',endsAt:'',minSpend:0,cashbackRate:0,cashbackCap:0,discountRate:0,discountCap:0,stackable:false,transactionCost:0,newCardCost:null,models:[],sourceUrl:'',conditions:{en:'',hi:''}});
export default function ShoppingOffersEditor({offers=[],sources=[],onChange}){
 const update=(i,k,v)=>onChange(offers.map((o,j)=>i===j?{...o,[k]:v}:o));
 return <section><h3>Reviewed shopping rewards & campaigns</h3><p className="admin-help">Only enter complete official terms for this exact card. Campaigns require their real start/end times (UTC ISO). Keep statement-cycle caps separate; never assume unused allowance. Full-payment and EMI offers are separate records. Source changes must be reviewed before these terms are renewed. A source check does not automatically revise manually entered campaigns.</p>
  {offers.map((o,i)=><fieldset key={i}><legend>Offer {i+1}</legend><div className="admin-form-grid">
   <label>Stable offer key<input required pattern="[a-z0-9-]{1,60}" value={o.id} onChange={e=>update(i,'id',e.target.value)}/></label>
   {[['merchant',['amazon','flipkart','myntra','any']],['item',['mobile','laptop','any']],['payment',['full','emi']],['membership',['any','prime','non-prime']]].map(([key,choices])=><label key={key}>{key}<select value={o[key]} onChange={e=>update(i,key,e.target.value)}>{choices.map(v=><option key={v}>{v}</option>)}</select></label>)}
   {['startsAt','endsAt'].map(k=><label key={k}>{k} (UTC ISO, e.g. 2026-11-10T00:00:00Z)<input required value={o[k]} onChange={e=>update(i,k,e.target.value)}/></label>)}
   {['minSpend','cashbackRate','cashbackCap','discountRate','discountCap','transactionCost'].map(k=><label key={k}>{k}{k.endsWith('Rate')?' (%)':' (₹)'}<input required type="number" min={0} max={k.endsWith('Rate')?100:1e9} step="any" value={o[k]} onChange={e=>update(i,k,e.target.value===''?'':Number(e.target.value))}/></label>)}
   <label>Total incremental new-card cost including tax (blank if unknown)<input type="number" min={0} max={1e9} step="any" value={o.newCardCost??''} onChange={e=>update(i,'newCardCost',e.target.value===''?null:Number(e.target.value))}/></label>
   <label>Exact eligible models, comma separated (blank only for all eligible models)<input maxLength={3000} value={o.models.join(', ')} onChange={e=>update(i,'models',e.target.value.split(',').map(s=>s.trim()).filter(Boolean))}/></label>
   <label>Reviewed official terms source<select required value={o.sourceUrl} onChange={e=>update(i,'sourceUrl',e.target.value)}><option value="">Choose an official product source</option>{sources.map(s=><option key={s.url} value={s.url}>{s.title}</option>)}</select></label>
   {['en','hi'].map(lang=><label key={lang}>Exclusions, caps, cost assumptions and other conditions ({lang})<textarea required minLength={10} maxLength={1600} value={o.conditions[lang]} onChange={e=>update(i,'conditions',{...o.conditions,[lang]:e.target.value})}/></label>)}
  </div><label><input type="checkbox" checked={o.stackable} onChange={e=>update(i,'stackable',e.target.checked)}/>Official terms explicitly allow this discount and cashback together</label><p><button type="button" className="admin-secondary" onClick={()=>onChange(offers.filter((_,j)=>j!==i))}>Remove offer</button></p></fieldset>)}
  <button type="button" className="admin-secondary" disabled={offers.length>=20} onClick={()=>onChange([...offers,blank()])}>+ Add reviewed shopping offer</button>
 </section>;
}
