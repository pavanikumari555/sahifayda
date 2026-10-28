'use client';
import {useEffect,useRef,useState} from 'react';
import {ArrowUp} from 'lucide-react';
import {chatSessionId} from '../supabase/functions/_shared/client-identity.mjs';
import SiaVoice from './sia-voice';
import {questionLimit,validateQuestion} from '../supabase/functions/_shared/conversation.mjs';
import {advisorReply,advisorContext} from '../lib/sia-advisor.mjs';
import {serviceStatus} from '../lib/status.mjs';
export default function SiaLive({language}){
 const hi=language==='hi';
 const [question,setQuestion]=useState(''),[messages,setMessages]=useState([]),[busy,setBusy]=useState(false),[listening,setListening]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
 const [ready,setReady]=useState(false);
 const input=useRef(null),tail=useRef(null),request=useRef(null),client=useRef(null),mounted=useRef(true),profile=useRef(null);
 useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;request.current?.abort();};},[]);
 useEffect(()=>{let live=true;serviceStatus('sia').then(status=>{if(!live)return;if(status.state==='active')setReady(true);else setError(hi?status.message_hi:status.message_en);}).catch(()=>{if(live)setError(hi?'सेवा की स्थिति नहीं मिल पाई। चैट बंद करके दोबारा खोलें।':'Could not check availability. Close and reopen the chat to retry.');});return()=>{live=false;};},[hi]);
 useEffect(()=>{tail.current?.scrollIntoView({block:'nearest'});},[messages,busy]);
 function messageFor(code){return code==='private'?(hi?'नाम, ईमेल, फोन, बैंक/कार्ड नंबर या PIN/OTP हटाकर अपनी समस्या बताइए।':'Remove personal details, phone/account/card numbers and PINs/OTPs before sending.'):code==='length'?(hi?'अपनी बात 3 से 600 अक्षरों में लिखिए।':'Write your question in 3 to 600 characters.'):hi?'अभी जवाब नहीं मिल पाया। आपकी बात बॉक्स में है; थोड़ी देर बाद फिर भेजें।':'An answer is unavailable right now. Your message is still in the box; try again shortly.';}
 async function send(event){
  event.preventDefault();if(request.current||listening||!ready)return;
  let text;try{text=validateQuestion(question);}catch(error){setError(messageFor(error.message));input.current?.focus();return;}
  const guided=advisorReply(text,profile.current,language);
  if(guided){profile.current=guided.profile;setMessages(previous=>[...previous,{role:'user',content:text},{role:'assistant',content:guided.answer,options:guided.options,links:guided.links,reviewedOn:guided.reviewedOn,reviewUntil:guided.reviewUntil,local:true}].slice(-20));setQuestion('');setError('');setNotice('');input.current?.focus();return;}
  const controller=new AbortController();request.current=controller;const timeout=setTimeout(()=>controller.abort(),45000);
  setBusy(true);setError('');setNotice('');
  try{
   if(!client.current){let storage;try{storage=window.sessionStorage;}catch{}client.current=chatSessionId(storage,()=>window.crypto.randomUUID());}
   const context=advisorContext(profile.current);
   const history=[...(context?[{role:'user',content:context}]:[]),...messages.slice(context?-3:-4).map(message=>({role:message.role,content:message.content.slice(0,message.role==='user'?questionLimit:1800)}))];
   const response=await fetch(process.env.NEXT_PUBLIC_SUPABASE_URL+'/functions/v1/sia-guide',{method:'POST',headers:{apikey:process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,'Content-Type':'application/json'},body:JSON.stringify({question:text,history,language,client_id:client.current}),cache:'no-store',signal:controller.signal});
   const data=await response.json();
   if(!response.ok)throw Error(data.code||'unavailable');
   if(!['ai','reviewed'].includes(data.mode)||typeof data.answer!=='string'||data.answer.trim().length<15||data.answer.length>5000||data.mode==='ai'&&!['groq','gemini'].includes(data.provider))throw Error(data.reason||'unavailable');
   if(!mounted.current)return;
   setMessages(previous=>[...previous,{role:'user',content:text},{role:'assistant',content:data.answer.trim()}].slice(-20));setQuestion('');
  }catch(error){if(mounted.current)setError(error.message==='limit'?(hi?'आज की उपयोग सीमा पूरी हो गई है। बाद में फिर कोशिश करें।':'Today’s usage limit has been reached. Please try again later.'):messageFor(error.message));}
  finally{clearTimeout(timeout);request.current=null;if(mounted.current){setBusy(false);input.current?.focus();}}
 }
 function transcribe(text){setQuestion(current=>(current.trim()?current.trim()+' '+text:text).slice(0,questionLimit));setNotice(hi?'बोली हुई बात बॉक्स में आ गई है। जाँचकर भेजें।':'Your words are in the box. Check or edit them before sending.');setError('');input.current?.focus();}
 return <section className="sia-chat" aria-label={hi?'SIA से बातचीत':'Chat with SIA'}>
  <div className="sia-chat-log" role="log" aria-live="polite" aria-relevant="additions" aria-label={hi?'बातचीत':'Conversation'}>
   <div className="sia-chat-bubble assistant"><strong>SIA</strong><p>{hi?'नमस्ते! बताइए, पैसों से जुड़ी क्या परेशानी है? अपनी बात जैसे समझ आती है, वैसे लिखिए या माइक से बोलिए।':'Hi! What money problem can I help you understand? Tell me in your own words, by typing or using the mic.'}</p></div>
   {messages.map((message,index)=><div className={'sia-chat-bubble '+message.role} key={index}><strong>{message.role==='assistant'?'SIA':hi?'आप':'You'}</strong><p>{message.content}</p>{message.options?.length>0&&<div className="sia-options">{message.options.map(option=><article className="sia-option" key={option.id}><h3>{option.name}</h3><p>{option.reason}</p><p><b>{hi?'लागत: ':'Cost: '}</b>{option.cost}</p><p><b>{hi?'ध्यान दें: ':'Check: '}</b>{option.caution}</p><a href={option.url} target="_blank" rel="noopener noreferrer">{hi?'आधिकारिक नियम देखें ↗':'View official terms ↗'}</a></article>)}<p className="sia-review-date">{hi?'जाँच: ':'Reviewed: '}{message.reviewedOn} · {hi?'दोबारा जाँच की तारीख: ':'Recheck due: '}{message.reviewUntil}<br/>{hi?'ये जानकारी के लिंक हैं; एफ़िलिएट ऑफ़र नहीं।':'Informational issuer links; not affiliate offers.'}</p></div>}{message.local&&<small className="sia-response-kind">{hi?'समीक्षित गाइड · AI कॉल नहीं':'Reviewed guide · no AI call'}</small>}</div>)}
   {messages.at(-1)?.links?.map(link=><a key={link.url} className="sia-review-date" href={link.url} target="_blank" rel="noopener noreferrer">{link.title} ↗</a>)}
   {busy&&<><div className="sia-chat-bubble user"><strong>{hi?'आप':'You'}</strong><p>{question.trim()}</p></div><p className="sia-chat-status" role="status">{hi?'SIA आपकी बात पढ़ रही है…':'SIA is reading your message…'}</p></>}
   <div ref={tail}/>
  </div>
  <div className="sia-chat-bottom">
   {error&&<p className="sia-chat-error" role="alert">{error}</p>}
   {(listening||notice)&&<p className="sia-chat-status" role="status">{listening?(hi?'बोलिए… आपकी बात यहीं लिखकर आएगी।':'Speak now… your words will appear here.'):notice}</p>}
   <form className="sia-composer" onSubmit={send}>
    <textarea ref={input} aria-label={hi?'अपनी समस्या लिखें':'Describe your problem'} aria-describedby="sia-chat-privacy" placeholder={hi?'अपनी समस्या यहाँ लिखें…':'Describe your problem here…'} value={question} maxLength={questionLimit} rows={2} disabled={busy} onChange={event=>{setQuestion(event.target.value);setError('');}} onKeyDown={event=>{if(event.key==='Enter'&&!event.shiftKey&&!event.nativeEvent.isComposing){event.preventDefault();event.currentTarget.form.requestSubmit();}}}/>
    <div className="sia-composer-actions"><SiaVoice language={language} onTranscript={transcribe} onListeningChange={setListening} onNotice={setNotice} disabled={busy}/><button type="submit" className="sia-send" aria-label={hi?'संदेश भेजें':'Send message'} title={hi?'भेजें':'Send'} disabled={busy||listening||!ready||!question.trim()}><ArrowUp size={21}/></button></div>
   </form>
   {!ready&&!error&&<p className="sia-chat-status" role="status">{hi?'सेवा की स्थिति जाँची जा रही है…':'Checking availability…'}</p>}
   <p id="sia-chat-privacy" className="sia-chat-privacy">{hi?'समीक्षित गाइड का जवाब इसी डिवाइस पर बनता है। अन्य सवालों के लिए आपकी बात और हाल की चैट AI को जाती है। नाम, बैंक नंबर, PIN या OTP न लिखें।':'Reviewed guide replies run on this device. Other questions send your message and recent chat to AI. Do not include names, account numbers, PINs or OTPs.'}</p>
   <details className="sia-chat-details"><summary>{hi?'निजता और माइक की जानकारी':'Privacy and microphone details'}</summary><p>{hi?'सहीफ़ायदा यह बातचीत डेटाबेस में सेव या दूसरे लोगों के जवाबों में कैश नहीं करता। इस टैब में एक random चैट ID केवल उपयोग सीमा गिनने के लिए रहती है। चैट बंद या पेज रीफ्रेश करने पर यह बातचीत हटती है। माइक आपकी अनुमति पर चलता है; ब्राउज़र की वॉइस सेवा ऑडियो अपने सर्वर पर प्रोसेस कर सकती है। SIA सामान्य जानकारी देती है; बैंक की कार्रवाई या मंज़ूरी नहीं कर सकती।':'SahiFayda does not save this chat to its database or cache it for other people. A random chat ID in this tab is used to count usage limits. Closing the chat or refreshing clears it. The microphone needs your permission; your browser’s speech service may process audio on its servers. SIA provides general guidance and cannot perform bank actions or grant approvals.'}</p></details>
  </div>
 </section>;
}
