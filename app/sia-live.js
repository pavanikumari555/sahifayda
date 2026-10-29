'use client';
import {useEffect,useRef,useState} from 'react';
import {ArrowUp} from 'lucide-react';
import {chatSessionId} from '../supabase/functions/_shared/client-identity.mjs';
import SiaVoice from './sia-voice';
import {dictationDraft} from '../lib/speech-input.mjs';
import {questionLimit,validateQuestion,conversationStyle} from '../supabase/functions/_shared/conversation.mjs';
import {readingGuideFor} from '../lib/sia-reading-guide.mjs';
import {advisorReply,advisorContext,rememberAdvisorProfile} from '../lib/sia-advisor.mjs';
import {brainReply} from '../supabase/functions/_shared/sia-brain.mjs';
import {serviceStatus} from '../lib/status.mjs';
import {useProductPartners} from './product-card';
import SiaProductSummary from './sia-product-summary';
import {useFinanceKnowledge,LoanRateCards} from './finance-updates';
import './products.css';
import {catalog} from '../supabase/functions/_shared/reviewed-products.mjs';
export default function SiaLive({language}){
 const hi=language==='hi',partnerFeed=useProductPartners(),financeFeed=useFinanceKnowledge();
 const [question,setQuestion]=useState(''),[messages,setMessages]=useState([]),[busy,setBusy]=useState(false),[listening,setListening]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
 const [ready,setReady]=useState(false),[checked,setChecked]=useState(false),[slow,setSlow]=useState(false);
 const input=useRef(null),tail=useRef(null),latestReply=useRef(null),request=useRef(null),client=useRef(null),mounted=useRef(true),profile=useRef(null);
 const draft=useRef(''),dictationBase=useRef('');draft.current=question;
 const responseStyle=conversationStyle(question,messages,language),responseLanguage=responseStyle==='en'?'en':'hi';
 useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;request.current?.abort();};},[]);
 useEffect(()=>{let live=true;serviceStatus('sia').then(status=>{if(!live)return;setChecked(true);if(status.state==='active')setReady(true);else setError(hi?status.message_hi:status.message_en);}).catch(()=>{if(live){setChecked(true);setError(hi?'AI की स्थिति नहीं मिल पाई। सीधे रिव्यू किए विकल्प पूछ सकते हैं।':'Could not check AI availability. You can still ask for reviewed options.');}});return()=>{live=false;};},[hi]);
 useEffect(()=>{if(busy)tail.current?.scrollIntoView({block:'nearest'});else latestReply.current?.scrollIntoView({block:'start',inline:'nearest'});},[messages,busy]);
 useEffect(()=>{if(listening&&input.current)input.current.scrollTop=input.current.scrollHeight;},[question,listening]);
 function messageFor(code){
  const roman=profile.current?.style==='roman';
  if(code==='busy')return roman?'AI service abhi busy hai. Aapki baat box mein hai; thodi der baad phir bhejein.':hi?'AI सेवा अभी व्यस्त है। आपकी बात बॉक्स में है; थोड़ी देर बाद फिर भेजें।':'The AI service is busy. Your draft is in the box; try again shortly.';
  if(code==='timeout')return roman?'Jawab mein zyada samay laga. Aapki baat box mein hai; phir bhej sakte hain.':hi?'जवाब में ज़्यादा समय लगा। आपकी बात बॉक्स में है; फिर भेज सकते हैं।':'The reply took too long. Your draft is in the box; you can retry.';
  if(code==='answer_check')return roman?'Jawab ki jankari confirm nahi ho paayi. Aapki baat box mein hai; website ki simple guide bhi padh sakte hain.':hi?'जवाब की जानकारी की पुष्टि नहीं हो पाई। आपकी बात बॉक्स में है; वेबसाइट की गाइड भी पढ़ सकते हैं।':'The answer could not be verified. Your draft is in the box; the simple guides are also available.';
  return code==='private'?(hi?'नाम, ईमेल, फोन, बैंक/कार्ड नंबर या PIN/OTP हटाकर अपनी समस्या बताइए।':'Remove personal details, phone/account/card numbers and PINs/OTPs before sending.'):code==='length'?(hi?'अपनी बात 3 से 600 अक्षरों में लिखिए।':'Write your question in 3 to 600 characters.'):roman?'Abhi jawab nahi mil paaya. Aapki baat box mein hai; thodi der baad phir bhejein.':hi?'अभी जवाब नहीं मिल पाया। आपकी बात बॉक्स में है; थोड़ी देर बाद फिर भेजें।':'An answer is unavailable right now. Your message is still in the box; try again shortly.';
 }
 async function send(event){
  event.preventDefault();if(request.current||listening)return;
  let text;try{text=validateQuestion(question);}catch(error){setError(messageFor(error.message));input.current?.focus();return;}
  // An immediate question must not mistake a still-loading catalogue for “no offers”.
  let products=partnerFeed.products,available=partnerFeed.productState==='ready',guided;
  try{guided=brainReply(text,rememberAdvisorProfile(text,profile.current,responseLanguage),profile.current,responseLanguage,new Date(),available?products:[]);}catch{guided=null;}
  if(!guided&&!available){
   const loading=new AbortController();request.current=loading;setBusy(true);setError('');
   try{products=await partnerFeed.refreshProducts();available=Array.isArray(products);}finally{request.current=null;if(mounted.current)setBusy(false);}
   if(!mounted.current||loading.signal.aborted)return;
  }
  if(!guided&&available)try{guided=advisorReply(text,profile.current,responseLanguage,new Date(),financeFeed.rows,products);}catch{guided=null;}
  if(guided){profile.current=guided.profile;setMessages(previous=>[...previous,{role:'user',content:text},{role:'assistant',content:guided.answer,language:guided.profile?.style==='en'?'en':'hi',options:guided.options,loanOptions:guided.loanOptions,links:guided.links,reviewedOn:guided.reviewedOn,reviewUntil:guided.reviewUntil,local:true,expanded:guided.expanded}].slice(-40));setQuestion('');setError('');setNotice('');input.current?.focus();return;}
  profile.current=rememberAdvisorProfile(text,profile.current,responseLanguage);
  if(!ready){setError(hi?'AI अभी उपलब्ध नहीं है। आपकी बात बॉक्स में है; चैट दोबारा खोलकर कोशिश करें।':'AI is not available yet. Your draft is still in the box; reopen the chat to retry.');return;}
  const controller=new AbortController();request.current=controller;const timeout=setTimeout(()=>controller.abort(),30000),slowTimer=setTimeout(()=>{if(mounted.current)setSlow(true);},6000);
  setBusy(true);setSlow(false);setError('');setNotice('');
  try{
   if(!client.current){let storage;try{storage=window.sessionStorage;}catch{}client.current=chatSessionId(storage,()=>window.crypto.randomUUID());}
   const context=advisorContext(profile.current);
   const history=[...(context?[{role:'user',content:context}]:[]),...messages.slice(context?-3:-4).map(message=>({role:message.role,content:message.content.slice(0,message.role==='user'?questionLimit:1800)}))];
   const response=await fetch(process.env.NEXT_PUBLIC_SUPABASE_URL+'/functions/v1/sia-guide',{method:'POST',headers:{apikey:process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,'Content-Type':'application/json'},body:JSON.stringify({question:text,history,language:responseLanguage,client_id:client.current}),cache:'no-store',signal:controller.signal});
   const data=await response.json();
   if(!response.ok)throw Error(data.code||'unavailable');
   if(!['ai','reviewed'].includes(data.mode)||typeof data.answer!=='string'||data.answer.trim().length<15||data.answer.length>5000||data.mode==='ai'&&!['groq','gemini'].includes(data.provider))throw Error(data.reason||'unavailable');
   if(!mounted.current)return;
   const productIds=Array.isArray(data.product_ids)?data.product_ids.slice(0,3).filter(id=>typeof id==='string'&&products.some(p=>p.id===id)):[];
   const topic=readingGuideFor(text,profile.current);
   const suppliedLinks=Array.isArray(data.links)?data.links.filter(link=>typeof link?.title==='string'&&link.title.length<180&&typeof link.url==='string'&&/^\/(?:hi\/)?(?:products|guides)\/[a-z0-9/#_-]*$/.test(link.url)).slice(0,3):[];
   const links=suppliedLinks.length?suppliedLinks:[{title:hi?'आसान भाषा में पूरी जानकारी':'Read the simple guide',url:(responseLanguage==='hi'?'/hi':'')+'/guides/'+(topic?topic+'/':'')}];
   if(productIds.length&&profile.current)profile.current={...profile.current,productIds};
   setMessages(previous=>[...previous,{role:'user',content:text},{role:'assistant',content:data.answer.trim(),language:responseLanguage,links,loanOptions:data.mode==="reviewed"?data.loan_options:[],local:data.mode==="reviewed",options:productIds.map(id=>({id,reason:hi?'ऊपर बताए उत्पाद की जानकारी; सही वेरिएंट और वर्तमान फीस देखें।':'Information on the product mentioned above; check the exact variant and current charges.'})),expanded:/puri|poori|full|detail|पूरी जानकारी/i.test(text)}].slice(-40));setQuestion('');
  }catch(error){if(mounted.current)setError(error.message==='limit'?(hi?'AI की आज की उपयोग सीमा पूरी हो गई है। आपकी बात बॉक्स में है। रिव्यू किए खाते और फीस के सीधे जवाब अभी भी मिल सकते हैं।':'Today’s AI usage limit has been reached. Your draft is preserved. Reviewed account and fee guidance can still work.'):error.message==='paused'?(hi?'AI अभी रुकी हुई है। आपकी बात बॉक्स में सुरक्षित है।':'AI is paused. Your draft is preserved.'):messageFor(error.message));}
  finally{clearTimeout(timeout);clearTimeout(slowTimer);request.current=null;if(mounted.current){setBusy(false);setSlow(false);input.current?.focus();}}
 }
 function micState(value){if(value){dictationBase.current=draft.current;setNotice('');}setListening(value);}
 function preview(text){if(text){setQuestion(dictationDraft(dictationBase.current,text,questionLimit));setError('');}}
 function transcribe(text){setQuestion(dictationDraft(dictationBase.current,text,questionLimit));setNotice(hi?'बात बॉक्स में है। जाँचकर भेजें।':'Your words are in the box. Check or edit them before sending.');setError('');input.current?.focus();}
 return <section className="sia-chat" aria-label={hi?'SIA से बातचीत':'Chat with SIA'}>
  <div className="sia-chat-log" role="log" aria-live="polite" aria-relevant="additions" aria-label={hi?'बातचीत':'Conversation'}>
   <div className="sia-chat-bubble assistant"><strong>SIA</strong><p>{hi?'नमस्ते! बताइए, पैसों से जुड़ी क्या परेशानी है? अपनी बात जैसे समझ आती है, वैसे लिखिए या माइक से बोलिए।':'Hi! What money problem can I help you understand? Tell me in your own words, by typing or using the mic.'}</p></div>
   {messages.map((message,index)=><div className={'sia-chat-bubble '+message.role} key={index} ref={message.role==='assistant'&&index===messages.length-1?latestReply:null}><strong>{message.role==='assistant'?'SIA':hi?'आप':'You'}</strong><p>{message.content}</p>{message.options?.length>0&&<div className="sia-options">{message.options.map(option=><SiaProductSummary key={option.id} option={option} language={message.language||language} feed={partnerFeed}/>)}</div>}{message.loanOptions?.length>0&&<LoanRateCards records={message.loanOptions} language={message.language||language} compact/>}{message.links?.map(link=><a key={link.url} className="product-library-link" href={link.url}>{link.title} →</a>)}{message.local&&<small className="sia-response-kind">{hi?'समीक्षित गाइड · AI कॉल नहीं':'Reviewed guide · no AI call'}</small>}</div>)}
   {busy&&<><div className="sia-chat-bubble user"><strong>{hi?'आप':'You'}</strong><p>{question.trim()}</p></div><p className="sia-chat-status" role="status">{slow?(hi?'जवाब में समय लग रहा है… आपकी बात बॉक्स में सुरक्षित है।':'The reply is taking longer… your draft is safe.'):(hi?'SIA आपकी बात पढ़ रही है…':'SIA is reading your message…')}</p><button type="button" className="sia-retry" onClick={()=>request.current?.abort()}>{hi?'रोकें':'Cancel'}</button></>}
   <div ref={tail}/>
  </div>
  <div className="sia-chat-bottom"><a className="product-library-link" href={hi?'/hi/guides/':'/guides/'}>{hi?'सभी सेवाओं की आसान जानकारी':'Simple guides for every service'} →</a>
   {error&&<div className="sia-chat-failure"><p className="sia-chat-error" role="alert">{error}</p>{question.trim()&&<button type="button" className="sia-retry" disabled={busy||listening} onClick={()=>input.current?.form?.requestSubmit()}>{hi?'फिर भेजें':'Try again'}</button>}</div>}
   {(listening||notice)&&<p className="sia-chat-status" role="status">{listening?(notice||(hi?'बोलिए… आपकी बात नीचे बॉक्स में आ रही है। पूरा होने पर माइक रोकें, फिर बदलें या भेजें।':'Your words appear in the box. Stop the mic to edit or send.')):notice}</p>}
   <form className="sia-composer" onSubmit={send}>
    <textarea ref={input} aria-label={hi?'अपनी समस्या लिखें':'Describe your problem'} aria-describedby="sia-chat-privacy" placeholder={hi?'अपनी समस्या यहाँ लिखें…':'Describe your problem here…'} value={question} maxLength={questionLimit} rows={2} disabled={busy} readOnly={listening} onChange={event=>{setQuestion(event.target.value);setError('');}} onKeyDown={event=>{if(event.key==='Enter'&&!event.shiftKey&&!event.nativeEvent.isComposing){event.preventDefault();event.currentTarget.form.requestSubmit();}}}/>
    <div className="sia-composer-actions"><SiaVoice language={language} speechStyle={question.trim()||messages.length?responseStyle:undefined} onTranscript={transcribe} onDraft={preview} onListeningChange={micState} onNotice={setNotice} disabled={busy}/><button type="submit" className="sia-send" aria-label={hi?'संदेश भेजें':'Send message'} title={hi?'भेजें':'Send'} disabled={busy||listening||!question.trim()}><ArrowUp size={21}/></button></div>
   </form>
   {!ready&&!checked&&!error&&<p className="sia-chat-status" role="status">{hi?'सेवा की स्थिति जाँची जा रही है…':'Checking availability…'}</p>}
   <p id="sia-chat-privacy" className="sia-chat-privacy">{hi?'समीक्षित गाइड का जवाब इसी डिवाइस पर बनता है। अन्य सवालों के लिए आपकी बात और हाल की चैट AI को जाती है। नाम, बैंक नंबर, PIN या OTP न लिखें।':'Reviewed guide replies run on this device. Other questions send your message and recent chat to AI. Do not include names, account numbers, PINs or OTPs.'}</p>
   <details className="sia-chat-details"><summary>{hi?'निजता और माइक की जानकारी':'Privacy and microphone details'}</summary><p>{hi?'सहीफ़ायदा यह बातचीत डेटाबेस में सेव या दूसरे लोगों के जवाबों में कैश नहीं करता। इस टैब में एक random चैट ID केवल उपयोग सीमा गिनने के लिए रहती है। चैट बंद या पेज रीफ्रेश करने पर यह बातचीत हटती है। माइक आपकी अनुमति पर चलता है; ब्राउज़र की वॉइस सेवा ऑडियो अपने सर्वर पर प्रोसेस कर सकती है। SIA सामान्य जानकारी देती है; बैंक की कार्रवाई या मंज़ूरी नहीं कर सकती।':'SahiFayda does not save this chat to its database or cache it for other people. A random chat ID in this tab is used to count usage limits. Closing the chat or refreshing clears it. The microphone needs your permission; your browser’s speech service may process audio on its servers. SIA provides general guidance and cannot perform bank actions or grant approvals.'}</p></details>
  </div>
 </section>;
}
