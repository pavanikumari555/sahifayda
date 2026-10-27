export const topics={
 card_route:{en:'Can I get a credit card without a salary if I file ITR?',hi:'नौकरी नहीं है, ITR है—क्रेडिट कार्ड का रास्ता क्या है?',facts:'An ITR is not an approval guarantee and does not prove current repayment capacity by itself. Distinguish no current income from self-employed/variable income. Issuer criteria vary. Some FD-backed cards are a route to review, but an FD may have a lien, fees and repayment obligations; do not lock emergency money or imply automatic approval. Use the local card-route checklist. Never promise easy approval, invent eligibility rules or recommend misrepresenting income. The IDFC FIRST WOW official page describes an FD-backed product; current issuer terms and KYC govern. Referral commission must not decide suitability.'},
 budget:{en:'How do I understand an approximate monthly budget?',hi:'महीने का लगभग बजट कैसे समझें?',facts:'Monthly review subtracts user-entered expenses from income in browser code. Include essentials and irregular bills; avoid counting purchases and the card bill twice. Remaining cash is not automatically spendable. Negative balance needs spending/commitment review. Tool: monthly.'},
 comparison:{en:'Why can a smaller EMI cost more overall?',hi:'छोटी EMI का कुल भुगतान ज़्यादा क्यों हो सकता है?',facts:'Quote comparison computes down payment + EMI times months + separately payable fees. Compare equivalent purchases/inclusions. Do not double-count financed fees. Omitted insurance, maintenance and balloon payments can change the result. Affordability, APR and loan eligibility are not assessed. Tool: compare.'},
 minimum:{en:'What does paying only a card minimum due mean?',hi:'कार्ड का सिर्फ़ न्यूनतम देय भरने का क्या मतलब है?',facts:'Minimum due is not full repayment. Interest, fees and payment allocation depend on issuer terms. Do not invent a universal minimum percentage, rate, deadline or payoff date. Check current statement and official issuer terms; contact issuer via official channel if unaffordable. Tool: guidance.'},
 upi:{en:'What should I check for a pending UPI payment?',hi:'अटके UPI भुगतान में क्या देखें?',facts:'Check transaction status and reference inside the payment app, then use its help/dispute flow and official bank support. Do not promise a refund time. Never give an OTP or UPI PIN to support or enter a PIN to receive a refund. Tool: guidance.'},
 partners:{en:'How should I assess affiliate or referral links?',hi:'एफ़िलिएट या रेफ़रल लिंक कैसे परखें?',facts:'Partner links are optional commercial links. SahiFayda may earn commission or referral benefit. Benefits, eligibility and fees depend on official partner terms. Neither approval nor reward is guaranteed. A paid relationship is not evidence of suitability. Never recommend borrowing just for rewards. No cashback, payment or application is performed by this site.'}
};
export const providers=['groq','gemini'];
export function configured(provider,env){return Boolean(env[provider==='groq'?'GROQ_API_KEY':'GEMINI_API_KEY']);}
export async function providerReply(provider,config,env,topic,language,fetcher=fetch){
 if(!Object.hasOwn(topics,topic)||!providers.includes(provider)||!['en','hi'].includes(language)||!configured(provider,env))throw Error('Unavailable');
 const system='You are SIA, SahiFayda educational guide. Explain ONLY the approved facts below. Write 3 short practical points, at most 120 words, in '+(language==='hi'?'Hindi Devanagari':'English')+'. No product recommendations, live rates, promises, invented facts, links, personal advice or external actions. Never request personal financial data. Do not claim to access accounts. Finish with the relevant tool name if present. Approved facts: '+topics[topic].facts;
 // Only a server-owned topic and language leave this server. No arbitrary user text.
 let endpoint,headers,body;
 if(provider==='groq'){
  endpoint='https://api.groq.com/openai/v1/chat/completions';headers={Authorization:'Bearer '+env.GROQ_API_KEY,'Content-Type':'application/json'};
  body={model:config.groq_model,messages:[{role:'system',content:system},{role:'user',content:topics[topic][language]}],max_completion_tokens:1200,temperature:0.2,...(config.groq_model.startsWith('openai/gpt-oss-')?{reasoning_effort:'low'}:{})};
 }else{
  endpoint='https://generativelanguage.googleapis.com/v1beta/models/'+config.gemini_model+':generateContent';headers={'x-goog-api-key':env.GEMINI_API_KEY,'Content-Type':'application/json'};
  body={systemInstruction:{parts:[{text:system}]},contents:[{role:'user',parts:[{text:topics[topic][language]}]}],generationConfig:{maxOutputTokens:600,temperature:0.2}};
 }
 const response=await fetcher(endpoint,{method:'POST',headers,body:JSON.stringify(body),signal:AbortSignal.timeout(14000)});
 if(!response.ok)throw Error('provider_http_'+response.status);
 const data=await response.json();
 const answer=provider==='groq'?data.choices?.[0]?.message?.content:data.candidates?.[0]?.content?.parts?.filter(p=>!p.thought).map(p=>p.text||'').join('');
 if(typeof answer!=='string'||answer.trim().length<15||answer.length>5000)throw Error('Invalid provider response');
 if(/https?:\/\/|₹|\d+(?:[.,]\d+)?\s*(?:%|percent|रुपए|रुपये)/i.test(answer))throw Error('Unreviewed numeric claim or link');
 return answer.trim();
}
export async function routedReply(config,env,topic,language,fetcher=fetch){
 const order=[config.primary_provider,...(config.fallback_enabled?providers.filter(p=>p!==config.primary_provider):[])];
 for(const provider of order){if(!configured(provider,env))continue;try{return {answer:await providerReply(provider,config,env,topic,language,fetcher),provider};}catch{}}
 return null;
}
