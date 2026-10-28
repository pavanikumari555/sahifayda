'use client';
import {useEffect,useRef,useState} from 'react';
import {ArrowUp} from 'lucide-react';
import SiaVoice from './sia-voice';
import {questionLimit,validateQuestion} from '../supabase/functions/_shared/conversation.mjs';
export default function SiaLive({language}){
 const hi=language==='hi';
 const [question,setQuestion]=useState(''),[messages,setMessages]=useState([]),[busy,setBusy]=useState(false),[listening,setListening]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
 const input=useRef(null),tail=useRef(null),request=useRef(null),mounted=useRef(true);
 useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;request.current?.abort();};},[]);
 useEffect(()=>{tail.current?.scrollIntoView({block:'nearest'});},[messages,busy]);
 function messageFor(code){return code==='private'?(hi?'नाम, ईमेल, फोन, बैंक/कार्ड नंबर या PIN/OTP हटाकर अपनी समस्या बताइए।':'Remove personal details, phone/account/card numbers and PINs/OTPs before sending.'):code==='length'?(hi?'अपनी बात 3 से 600 अक्षरों में लिखिए।':'Write your question in 3 to 600 characters.'):hi?'अभी जवाब नहीं मिल पाया। आपकी बात बॉक्स में है; थोड़ी देर बाद फिर भेजें।':'An answer is unavailable right now. Your message is still in the box; try again shortly.';}
 async function send(event){
  event.preventDefault();if(request.current||listening)return;
  let text;try{text=validateQuestion(question);}catch(error){setError(messageFor(error.message));input.current?.focus();return;}
  const controller=new AbortController();request.current=controller;const timeout=setTimeout(()=>controller.abort(),45000);
  setBusy(true);setError('');setNotice('');
  try{
   const history=messages.slice(-4).map(message=>({role:message.role,content:message.content.slice(0,message.role==='user'?questionLimit:1800)}));
   const response=await fetch(process.env.NEXT_PUBLIC_SUPABASE_URL+'/functions/v1/sia-guide',{method:'POST',headers:{apikey:process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,'Content-Type':'application/json'},body:JSON.stringify({question:text,history,language}),cache:'no-store',signal:controller.signal});
   const data=await response.json();
   if(!response.ok)throw Error(data.code||'unavailable');
   if(data.mode!=='ai'||typeof data.answer!=='string'||data.answer.trim().length<15||data.answer.length>5000||!['groq','gemini'].includes(data.provider))throw Error(data.reason||'unavailable');
   if(!mounted.current)return;
   setMessages(previous=>[...previous,{role:'user',content:text},{role:'assistant',content:data.answer.trim()}].slice(-20));setQuestion('');
  }catch(error){if(mounted.current)setError(error.message==='limit'?(hi?'आज की उपयोग सीमा पूरी हो गई है। बाद में फिर कोशिश करें।':'Today’s usage limit has been reached. Please try again later.'):messageFor(error.message));}
  finally{clearTimeout(timeout);request.current=null;if(mounted.current){setBusy(false);input.current?.focus();}}
 }
 function transcribe(text){setQuestion(current=>(current.trim()?current.trim()+' '+text:text).slice(0,questionLimit));setNotice(hi?'बोली हुई बात बॉक्स में आ गई है। जाँचकर भेजें।':'Your words are in the box. Check or edit them before sending.');setError('');input.current?.focus();}
 return <section className="sia-chat" aria-label={hi?'SIA से बातचीत':'Chat with SIA'}>
  <div className="sia-chat-log" role="log" aria-live="polite" aria-relevant="additions" aria-label={hi?'बातचीत':'Conversation'}>
   <div className="sia-chat-bubble assistant"><strong>SIA</strong><p>{hi?'नमस्ते! बताइए, पैसों से जुड़ी क्या परेशानी है? अपनी बात जैसे समझ आती है, वैसे लिखिए या माइक से बोलिए।':'Hi! What money problem can I help you understand? Tell me in your own words, by typing or using the mic.'}</p></div>
   {messages.map((message,index)=><div className={'sia-chat-bubble '+message.role} key={index}><strong>{message.role==='assistant'?'SIA':hi?'आप':'You'}</strong><p>{message.content}</p></div>)}
   {busy&&<><div className="sia-chat-bubble user"><strong>{hi?'आप':'You'}</strong><p>{question.trim()}</p></div><p className="sia-chat-status" role="status">{hi?'SIA आपकी बात पढ़ रही है…':'SIA is reading your message…'}</p></>}
   <div ref={tail}/>
  </div>
  <div className="sia-chat-bottom">
   {error&&<p className="sia-chat-error" role="alert">{error}</p>}
   {(listening||notice)&&<p className="sia-chat-status" role="status">{listening?(hi?'बोलिए… आपकी बात यहीं लिखकर आएगी।':'Speak now… your words will appear here.'):notice}</p>}
   <form className="sia-composer" onSubmit={send}>
    <textarea ref={input} aria-label={hi?'अपनी समस्या लिखें':'Describe your problem'} aria-describedby="sia-chat-privacy" placeholder={hi?'अपनी समस्या यहाँ लिखें…':'Describe your problem here…'} value={question} maxLength={questionLimit} rows={2} disabled={busy} onChange={event=>{setQuestion(event.target.value);setError('');}} onKeyDown={event=>{if(event.key==='Enter'&&!event.shiftKey&&!event.nativeEvent.isComposing){event.preventDefault();event.currentTarget.form.requestSubmit();}}}/>
    <div className="sia-composer-actions"><SiaVoice language={language} onTranscript={transcribe} onListeningChange={setListening} onNotice={setNotice} disabled={busy}/><button type="submit" className="sia-send" aria-label={hi?'संदेश भेजें':'Send message'} title={hi?'भेजें':'Send'} disabled={busy||listening||question.trim().length<3}><ArrowUp size={21}/></button></div>
   </form>
   <p id="sia-chat-privacy" className="sia-chat-privacy">{hi?'भेजने पर आपकी लिखी बात और हाल की बातचीत AI को जाएगी। नाम, बैंक नंबर, PIN या OTP न लिखें।':'Sending shares your message and recent chat with AI. Do not include names, account numbers, PINs or OTPs.'}</p>
   <details className="sia-chat-details"><summary>{hi?'निजता और माइक की जानकारी':'Privacy and microphone details'}</summary><p>{hi?'सहीफ़ायदा यह बातचीत डेटाबेस में सेव या दूसरे लोगों के जवाबों में कैश नहीं करता। चैट बंद या पेज रीफ्रेश करने पर यह बातचीत हटती है। माइक आपकी अनुमति पर चलता है; ब्राउज़र की वॉइस सेवा ऑडियो अपने सर्वर पर प्रोसेस कर सकती है। SIA सामान्य जानकारी देती है; बैंक की कार्रवाई या मंज़ूरी नहीं कर सकती।':'SahiFayda does not save this chat to its database or cache it for other people. Closing the chat or refreshing clears it. The microphone needs your permission; your browser’s speech service may process audio on its servers. SIA provides general guidance and cannot perform bank actions or grant approvals.'}</p></details>
  </div>
 </section>;
}
