import {catalog} from '../supabase/functions/_shared/reviewed-products.mjs';
export const disclosures={en:'SahiFayda may earn a commission or referral benefit through this link. Partner terms apply.',hi:'इस लिंक से सहीफ़ायदा को कमीशन या रेफ़रल लाभ मिल सकता है। पार्टनर की शर्तें लागू हैं।'};
export function permissionReference(form){
 if(!form.partner||!form.terms_url)return '';
 return `Reference: ${form.partner} official terms — ${form.terms_url}. Referral link supplied by the owner. Website-promotion permission is confirmed separately by the owner using the checkbox below.`.slice(0,1200);
}
export function fillPermissionReference(form){return {...form,approval_note:form.approval_note?.trim()?form.approval_note:permissionReference(form)};}
export function freshPartner(now=new Date()){
 return {partner:'',product_key:'',kind:'referral',category:'demat',title_en:'',title_hi:'',description_en:'',description_hi:'',destination_url:'',terms_url:'',tracking_param:'',eligibility_tag:'not_assessed',disclosure_en:disclosures.en,disclosure_hi:disclosures.hi,state:'draft',promotion_approved:false,approval_note:'',reviewed_on:now.toISOString().slice(0,10),expires_at:'',sort_order:100};
}
export const partnerPresets=Object.fromEntries(Object.values(catalog).map(product=>[product.id,{
 id:product.id,name:product.name,category:product.category,product_key:product.id,partner:product.name,title_en:product.name,title_hi:product.name,
 description_en:product.details.variant.en+'. Check current fees and eligibility with the provider before applying.',
 description_hi:product.details.variant.hi+'। आवेदन से पहले प्रदाता की वर्तमान फीस और पात्रता जाँचें।',terms_url:product.url,reviewed_on:product.reviewedOn
}]));
// Angel One now comes from the same reviewed catalog as all other exact products.
// A different product must never inherit a destination, permission or offer expiry.
export function applyPartnerPreset(previous,id,now=new Date()){
 const preset=partnerPresets[id];if(!preset)throw new Error('Choose a known product template.');
 const {id:templateId,name,...fields}=preset;
 return fillPermissionReference({...freshPartner(now),...(previous?.id?{id:previous.id,revision:previous.revision}:{}),...fields});
}
export function savedPartnerPreset(previous,saved,now=new Date()){
 const next=freshPartner(now);
 for(const key of ['partner','product_key','kind','category','title_en','title_hi','description_en','description_hi','terms_url','eligibility_tag','disclosure_en','disclosure_hi','reviewed_on','sort_order'])if(saved[key]!==undefined&&saved[key]!==null)next[key]=saved[key];
 return fillPermissionReference({...next,...(previous?.id?{id:previous.id,revision:previous.revision}:{})});
}
export function findPartnerPreset(name){
 const normal=value=>String(value).toLowerCase().replace(/[^a-z0-9]/g,'');const query=normal(name);
 if(['angelone','angleone','angelbroking'].includes(query))return 'angelone';
 return Object.values(partnerPresets).find(p=>normal(p.name)===query)?.id||'';
}
export function customPartnerDefaults(form){
 const name=form.partner.trim().slice(0,100);
 return {...form,title_en:form.title_en||name,title_hi:form.title_hi||name,description_en:form.description_en||'Check the provider’s current product fees, eligibility and programme terms before applying.',description_hi:form.description_hi||'आवेदन से पहले प्रदाता की वर्तमान फीस, पात्रता और प्रोग्राम की शर्तें जाँचें।'};
}
