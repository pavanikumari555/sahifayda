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

export default function SiaLive({language,initialQuestion='',starters=null,inputId,ask=null}){
  const hi=language==='hi',partnerFeed=useProductPartners(),financeFeed=useFinanceKnowledge();
  const [question,setQuestion]=useState(''),[messages,setMessages]=useState([]),[busy,setBusy]=useState(false),[listening,setListening]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
  const [ready,setReady]=useState(true),[checked,setChecked]=useState(true),[slow,setSlow]=useState(false);
  const input=useRef(null),tail=useRef(null),log=useRef(null),latestReply=useRef(null),request=useRef(null),client=useRef(null),mounted=useRef(true),profile=useRef(null);
  const draft=useRef(''),dictationBase=useRef('');draft.current=question;
  const responseStyle=conversationStyle(question,messages,language),responseLanguage=responseStyle==='en'?'en':'hi';

  // Starter questions limited to topics covered by the reviewed brain and catalogue.
  // The homepage may pass owner-managed starters; otherwise the reviewed defaults below are used.
  const quickChips = starters?.length ? starters : hi ? [
    { label: 'ज़ीरो बैलेंस खाता', q: 'मुझे ज़ीरो बैलेंस सेविंग अकाउंट चाहिए' },
    { label: 'पहला क्रेडिट कार्ड', q: 'मुझे क्रेडिट कार्ड चाहिए, मेरी आय 30000 महीना है' },
    { label: 'डीमैट और F&O ब्रोकरेज', q: 'कम F&O ब्रोकरेज वाला डीमैट खाता बताइए' },
    { label: 'लोन की तुलना', q: 'मुझे 5 लाख का पर्सनल लोन चाहिए' },
  ] : [
    { label: 'Zero-balance account', q: 'I need a zero balance savings account' },
    { label: 'First credit card', q: 'I want a credit card, my income is 30000 per month' },
    { label: 'Demat & F&O brokerage', q: 'Which demat account has low F&O brokerage?' },
    { label: 'Compare loans', q: 'I need a personal loan of 5 lakh' },
  ];

  useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;request.current?.abort();};},[]);
  useEffect(()=>{let live=true;serviceStatus('sia').then(status=>{if(!live)return;setChecked(true);setReady(true);}).catch(()=>{if(live){setChecked(true);setReady(true);}});return()=>{live=false;};},[hi]);
  // Scroll only inside the conversation log, so an embedded chat never jumps the whole page.
  useEffect(()=>{const box=log.current;if(!box)return;if(busy){box.scrollTop=box.scrollHeight;return;}const reply=latestReply.current;if(reply)box.scrollTop=Math.max(0,reply.offsetTop-6);},[messages,busy]);
  useEffect(()=>{if(listening&&input.current)input.current.scrollTop=input.current.scrollHeight;},[question,listening]);

  function messageFor(code){
    const roman=profile.current?.style==='roman';
    if(code==='busy')return roman?'AI service abhi busy hai. Aapki baat box mein hai; thodi der baad phir bhejein.':hi?'AI सेवा अभी बिज़ी है. आपकी बात बॉक्स में है; थोड़ी देर बाद फिर भेजें.':'The AI service is busy. Your draft is in the box; try sending again shortly.';
    if(code==='timeout')return roman?'Jawab mein zyada samay laga. Aapki baat box mein hai; phir bhej sakte hain.':hi?'जवाब में ज़्यादा समय लगा. आपकी बात बॉक्स में है; फिर भेज सकते हैं.':'The reply took too long. Your draft is in the box; you can send it again.';
    if(code==='answer_check')return roman?'Jawab ki jankari confirm nahi ho paayi. Aapki baat box mein hai; वेबसाइट की सिंपल गाइड भी पढ़ सकते हैं.':hi?'जवाब की जानकारी कन्फ़र्म नहीं हो पाई. आपकी बात बॉक्स में है; वेबसाइट की सिंपल गाइड भी पढ़ सकते हैं.':'Could not verify answer details. Your draft is in the box; you can also check the website guides.';
    if(code==='private')return hi?'मोबाइल, खाता/कार्ड नंबर, PIN, OTP या पासवर्ड हटाकर भेजें।':'Remove phone, account/card numbers, PINs, OTPs or passwords before sending.';
    if(code==='length')return hi?'सवाल 3 से 600 अक्षरों के बीच लिखें।':'Write your question in 3 to 600 characters.';
    if(code==='paused')return hi?'SIA की AI सेवा अभी कुछ देर के लिए बंद है। आपकी बात बॉक्स में है; तब तक गाइड पढ़ सकते हैं या बाद में भेजें।':'SIA’s AI service is paused for now. Your draft is in the box; read the guides meanwhile or send it later.';
    if(code==='limit')return hi?'आज की AI सीमा पूरी हो गई है। आपकी बात बॉक्स में है; कल फिर भेजें या गाइड पढ़ें।':'Today’s AI limit has been reached. Your draft is in the box; try again tomorrow or read the guides.';
    if(code==='setup')return hi?'SIA की AI सेवा अभी सेट हो रही है। आम सवालों के जवाब मिलते रहेंगे; यह सवाल बाद में भेजें।':'SIA’s AI service is still being set up. Common questions still work; please send this one later.';
    return hi?'अभी जवाब नहीं मिल सका। आपकी बात बॉक्स में है; थोड़ी देर बाद फिर भेजें।':'Could not get a reply right now. Your draft is in the box; please send it again shortly.';
  }

  // A question typed on the homepage opens the chat and is sent once, as the user asked.
  const sentInitial=useRef(false);
  useEffect(()=>{if(initialQuestion&&!sentInitial.current){sentInitial.current=true;send(null,initialQuestion);}},[]);// eslint-disable-line react-hooks/exhaustive-deps
  // An embedded chat can receive questions from elsewhere on the page (example chips, service buttons).
  useEffect(()=>{if(ask?.text)send(null,ask.text);},[ask?.id]);// eslint-disable-line react-hooks/exhaustive-deps

  async function send(event, directText = null){
    if(event?.preventDefault) event.preventDefault();
    if(request.current||listening)return;
    const rawText = directText || question;
    if(!rawText || !rawText.trim()) return;
    let text;
    try{
      text=validateQuestion(rawText);
    }catch(err){
      setError(messageFor(err.message));
      input.current?.focus();
      return;
    }
    let products=partnerFeed.products,available=partnerFeed.productState==='ready',guided;
    try{
      guided=brainReply(text,rememberAdvisorProfile(text,profile.current,responseLanguage),profile.current,responseLanguage,new Date(),available?products:[]);
    }catch{guided=null;}
    if(!guided&&!available){
      const loading=new AbortController();request.current=loading;setBusy(true);setError('');
      try{products=await partnerFeed.refreshProducts();available=Array.isArray(products);}finally{request.current=null;if(mounted.current)setBusy(false);}
      if(!mounted.current||loading.signal.aborted)return;
    }
    if(!guided&&available){
      try{guided=advisorReply(text,profile.current,responseLanguage,new Date(),financeFeed.rows,products);}catch{guided=null;}
    }
    if(guided){
      profile.current=guided.profile;
      setMessages(previous=>[...previous,{role:'user',content:text},{role:'assistant',content:guided.answer,language:guided.profile?.style==='en'?'en':'hi',options:guided.options,loanOptions:guided.loanOptions}]);
      setQuestion('');setError('');
      profile.current=rememberAdvisorProfile(text,profile.current,responseLanguage);
      return;
    }
    const controller=new AbortController();
    request.current=controller;
    const slowTimer=setTimeout(()=>{if(mounted.current)setSlow(true);},8000);
    setBusy(true);setSlow(false);setError('');setNotice('');
    try{
      const supabaseUrl=process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
      if(!supabaseUrl||!supabaseUrl.startsWith('https://'))throw new Error('unavailable');
      if(!client.current){
        let storage;try{storage=window.sessionStorage;}catch{}
        client.current=chatSessionId(storage,()=>window.crypto.randomUUID());
      }
      const context=advisorContext(profile.current);
      const history=[...(context?[{role:'user',content:context.slice(0,questionLimit)}]:[]),...messages.slice(context?-3:-4).map(message=>({role:message.role,content:message.content.slice(0,message.role==='user'?questionLimit:1800)}))];
      // The sia-guide endpoint accepts only these keys; anything else is rejected with HTTP 400.
      const response=await fetch(supabaseUrl+'/functions/v1/sia-guide',{
        method:'POST',
        headers:{apikey:supabaseKey,'Content-Type':'application/json'},
        body:JSON.stringify({question:text,history,language:responseLanguage,client_id:client.current}),
        cache:'no-store',
        signal:controller.signal
      });
      const data=await response.json().catch(()=>({}));
      if(!response.ok)throw new Error(data.code||'unavailable');
      if(data.mode==='guide')throw new Error(data.reason||'unavailable');
      if(!['ai','reviewed'].includes(data.mode)||typeof data.answer!=='string'||data.answer.trim().length<5)throw new Error('unavailable');
      if(!mounted.current)return;
      const productIds=Array.isArray(data.product_ids)?data.product_ids.slice(0,3).filter(id=>typeof id==='string'&&products.some(p=>p.id===id)):[];
      const topic=readingGuideFor(text,profile.current);
      const suppliedLinks=Array.isArray(data.links)?data.links.filter(link=>typeof link?.title==='string'&&link.title.length<180&&typeof link.url==='string'&&/^\/(?:hi\/)?(?:products|guides)\/[a-z0-9/#_-]*$/.test(link.url)).slice(0,3):[];
      const links=suppliedLinks.length?suppliedLinks:[{title:hi?'साधारण गाइड पढ़ें':'Read the simple guide',url:(responseLanguage==='hi'?'/hi':'')+'/guides/'+(topic?topic+'/':'')}];
      
      if(productIds.length&&profile.current)profile.current={...profile.current,productIds};
      setMessages(previous=>[...previous,{role:'user',content:text},{role:'assistant',content:data.answer.trim(),language:responseLanguage,links,loanOptions:data.mode==='reviewed'&&Array.isArray(data.loan_options)?data.loan_options:[],local:data.mode==='reviewed',options:productIds.map(id=>({id}))}]);
      setQuestion('');
      profile.current=rememberAdvisorProfile(text,profile.current,responseLanguage);
    }catch(err){
      if(!mounted.current||controller.signal.aborted)return;
      // Keep the draft in the composer and explain what happened; never substitute an unreviewed answer.
      setQuestion(text);
      setError(messageFor(err instanceof Error?err.message:'unavailable'));
      profile.current=rememberAdvisorProfile(text,profile.current,responseLanguage);
    }finally{
      clearTimeout(slowTimer);
      request.current=null;
      if(mounted.current){
        setBusy(false);
        setSlow(false);
        input.current?.focus();
      }
    }
  }

  function micState(value){if(value){dictationBase.current=draft.current;setNotice('');}setListening(value);}
  function preview(text){if(text){setQuestion(dictationDraft(dictationBase.current,text,questionLimit));setError('');}}
  function transcribe(text){setQuestion(dictationDraft(dictationBase.current,text,questionLimit));setNotice(hi?'आपकी बात बॉक्स में है. भेजने से पहले देख या बदल सकते हैं.':'Your words are in the box. Check or edit them before sending.');setError('');input.current?.focus();}

  return <section className="sia-chat" aria-label={hi?'सिया से बात':'Chat with SIA'}>
    <div className="sia-chat-log" ref={log} role="log" aria-live="polite" aria-relevant="additions" aria-label={hi?'बातचीत':'Conversation'}>
      <div className="sia-chat-bubble assistant">
        <strong>SIA</strong>
        <p>{hi?'नमस्ते! मैं SIA हूँ। खाता, क्रेडिट कार्ड, लोन, डीमैट, बीमा या खरीदारी, आपको किसमें मदद चाहिए? अपनी बात अपने शब्दों में लिखें या बोलें।':'Hi, I’m SIA. Savings account, credit card, loan, demat, insurance or shopping: what do you need help with? Type or speak in your own words.'}</p>
        
        {messages.length===0 && (
          <div className="sia-starters" aria-label={hi?'उदाहरण सवाल':'Example questions'}>
            {quickChips.map((chip, idx)=>(
              <button key={idx} type="button" disabled={busy} onClick={()=>send(null, chip.q)}>{chip.label}</button>
            ))}
          </div>
        )}
      </div>
      {messages.map((message,index)=>(
        <div className={'sia-chat-bubble '+message.role} key={index} ref={message.role==='assistant'&&index===messages.length-1?latestReply:null}>
          <strong>{message.role==='assistant'?'SIA':hi?'आप':'You'}</strong>
          <p>{message.content}</p>
          {message.links?.length>0 && (
            <div style={{marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
              {message.links.map((link, lIdx)=>(
                <a key={lIdx} href={link.url} className="sia-chat-link">
                  {link.title} &rarr;
                </a>
              ))}
            </div>
          )}
          {message.options?.length>0&&message.options.map(option=><SiaProductSummary key={option.id} option={option} language={message.language==='en'?'en':'hi'} feed={partnerFeed}/>)}
          {message.loanOptions?.length>0&&<LoanRateCards options={message.loanOptions}/>}
        </div>
      ))}
      {busy&&<div className="sia-chat-bubble assistant">
        <strong>SIA</strong>
        <p style={{fontStyle: 'italic', opacity: 0.8}}>
          {slow?(hi?'जवाब में थोड़ा ज़्यादा समय लग रहा है…':'This is taking a little longer…'):(hi?'सोच रही हूँ…':'Thinking…')}
        </p>
      </div>}
      <div ref={tail}/>
    </div>
    <div className="sia-chat-bottom">
      <a className="product-library-link" href={hi?'/hi/guides/':'/guides/'}>{hi?'हर सेवा की आसान गाइड':'Simple guides for every service'} &rarr;</a>
      {error&&<div className="sia-chat-failure"><p className="sia-chat-error" role="alert">{error}</p>{question.trim()&&<button type="button" className="sia-retry" disabled={busy||listening} onClick={()=>{send();}}>{hi?'फिर भेजें':'Send again'}</button>}</div>}
      {(listening||notice)&&<p className="sia-chat-status" role="status">{listening?(notice||(hi?'आपकी बात बॉक्स में दिख रही है. बदलने या भेजने के लिए माइक रोकें.':'Your words appear in the box. Stop the mic to edit or send.')):notice}</p>}
      <form className="sia-composer" onSubmit={send}>
        <textarea ref={input} id={inputId} name="sia-question" autoComplete="off" aria-label={hi?'अपनी उलझन बताएँ':'Describe your problem'} aria-describedby="sia-chat-privacy" placeholder={hi?'अपनी ज़रूरत यहाँ लिखें…':'Type what you need…'} value={question} maxLength={questionLimit} onChange={event=>setQuestion(event.target.value)} onKeyDown={event=>{if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();send(event);}}}/>
        <div className="sia-composer-actions"><SiaVoice language={language} speechStyle={question.trim()||messages.length?responseStyle:undefined} onTranscript={transcribe} onDraft={preview} onListeningChange={micState} onNotice={setNotice}/><button type="submit" disabled={busy||listening||!question.trim()} className="sia-send" aria-label={hi?'भेजें':'Send'}><ArrowUp size={18}/></button></div>
      </form>
      <p id="sia-chat-privacy" className="sia-chat-privacy">{hi?'जांची गई गाइड जानकारी वेरिफाइड डेटा से चलती है. AI जवाबों में बिना किसी अकाउंट, PIN या OTP के गुप्त संदर्भ का उपयोग होता है.':'Reviewed guide replies run on verified data. AI answers use anonymized context with no account, PIN, or OTP details.'}</p>
      <details className="sia-chat-details"><summary>{hi?'गोपनीयता और माइक की जानकारी':'Privacy and microphone details'}</summary><p>{hi?'माइक की आवाज भेजने तक ब्राउज़र में ही रहती है. स्थानीय नियम नेटवर्क रिक्वेस्ट से पहले गोपनीयता सुनिश्चित करते हैं.':'Microphone input stays in browser state until sent. Local rules enforce privacy guidelines before network requests.'}</p></details>
    </div>
  </section>;
}
