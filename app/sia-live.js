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
  const [ready,setReady]=useState(true),[checked,setChecked]=useState(true),[slow,setSlow]=useState(false);
  const input=useRef(null),tail=useRef(null),latestReply=useRef(null),request=useRef(null),client=useRef(null),mounted=useRef(true),profile=useRef(null);
  const draft=useRef(''),dictationBase=useRef('');draft.current=question;
  const responseStyle=conversationStyle(question,messages,language),responseLanguage=responseStyle==='en'?'en':'hi';

  const quickChips = hi ? [
    { label: '💳 ज़ीरो-बैलेंस खाता', q: 'बेस्ट ज़ीरो बैलेंस सेविंग्स अकाउंट कौन सा है?' },
    { label: '🏠 PMAY सब्सिडी चेक', q: 'प्रधानमंत्री आवास योजना (PMAY) की सब्सिडी कैसे चेक करें?' },
    { label: '💰 लोन EMI और बजट', q: 'सैलरी के अनुसार लोन EMI और बजट का सही नियम क्या है?' },
    { label: '🎯 FD क्रेडिट कार्ड', q: 'बिना इनकम प्रूफ के FD बेस्ड क्रेडिट कार्ड कैसे मिलता है?' },
  ] : [
    { label: '💳 Zero-Balance Accounts', q: 'Which is the best zero-balance savings account in India?' },
    { label: '🏠 PMAY Subsidy Check', q: 'How to check PMAY housing loan subsidy eligibility?' },
    { label: '💰 Loan EMI & Budget', q: 'What is the safe EMI and 50/30/20 budget rule for salary?' },
    { label: '🎯 FD-Backed Credit Card', q: 'How to get an FD-backed credit card without income proof?' },
  ];

  useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;request.current?.abort();};},[]);
  useEffect(()=>{let live=true;serviceStatus('sia').then(status=>{if(!live)return;setChecked(true);setReady(true);}).catch(()=>{if(live){setChecked(true);setReady(true);}});return()=>{live=false;};},[hi]);
  useEffect(()=>{if(busy)tail.current?.scrollIntoView({block:'nearest'});else latestReply.current?.scrollIntoView({block:'start',inline:'nearest'});},[messages,busy]);
  useEffect(()=>{if(listening&&input.current)input.current.scrollTop=input.current.scrollHeight;},[question,listening]);

  function messageFor(code){
    const roman=profile.current?.style==='roman';
    if(code==='busy')return roman?'AI service abhi busy hai. Aapki baat box mein hai; thodi der baad phir bhejein.':hi?'AI सेवा अभी बिज़ी है. आपकी बात बॉक्स में है; थोड़ी देर बाद फिर भेजें.':'The AI service is busy. Your draft is in the box; try sending again shortly.';
    if(code==='timeout')return roman?'Jawab mein zyada samay laga. Aapki baat box mein hai; phir bhej sakte hain.':hi?'जवाब में ज़्यादा समय लगा. आपकी बात बॉक्स में है; फिर भेज सकते हैं.':'The reply took too long. Your draft is in the box; you can send it again.';
    if(code==='answer_check')return roman?'Jawab ki jankari confirm nahi ho paayi. Aapki baat box mein hai; वेबसाइट की सिंपल गाइड भी पढ़ सकते हैं.':hi?'जवाब की जानकारी कन्फ़र्म नहीं हो पाई. आपकी बात बॉक्स में है; वेबसाइट की सिंपल गाइड भी पढ़ सकते हैं.':'Could not verify answer details. Your draft is in the box; you can also check the website guides.';
    return code==='private'?(hi?'व्यक्तिगत, पासवर्ड, PIN/OTP या बैंक/कार्ड डिटेल साझा न करें.':'Remove personal details, phone/account/card numbers and PINs/OTPs before sending.'):code==='length'?(hi?'सवाल बहुत बड़ा (1800 अक्षरों से कम) होना चाहिए.':'Keep your question brief (under 1800 characters).'):code;
  }

  function getSmartFallbackReply(text, lang) {
    const isHi = lang === 'hi';
    const lower = text.toLowerCase();
    const topic = readingGuideFor(text, profile.current);
    const guideUrl = (isHi ? '/hi' : '') + '/guides/' + (topic ? topic + '/' : '');

    if (lower.includes('zero') || lower.includes('balance') || lower.includes('खाता') || lower.includes('saving')) {
      return {
        answer: isHi
          ? 'ज़ीरो-बैलेंस बचत खातों (जैसे Kotak 811, AU Digital) में कोई न्यूनतम बैलेंस रखने की बाध्यता नहीं होती और न ही कोई पेनल्टी लगती है। आप आधार OTP और पैन कार्ड से 5 मिनट में वीडियो KYC करके इसे ऑनलाइन चालू कर सकते हैं।'
          : 'Zero-balance savings accounts (like Kotak 811, AU Digital) require no monthly minimum balance and charge zero non-maintenance penalties. You can open them in 5 minutes via Aadhaar OTP and Video KYC.',
        links: [{ title: isHi ? 'ज़ीरो-बैलेंस खाता गाइड पढ़ें' : 'Read Zero-Balance Account Guide', url: (isHi ? '/hi' : '') + '/guides/zero-balance/' }]
      };
    }

    if (lower.includes('fd') || lower.includes('credit') || lower.includes('card') || lower.includes('कार्ड')) {
      return {
        answer: isHi
          ? 'अगर आपका सिबिल स्कोर कम है या इनकम प्रूफ नहीं है, तो FD-बेस्ड सिक्योर्ड क्रेडिट कार्ड (जैसे IDFC FIRST WOW, OneCard) सबसे बेहतरीन विकल्प हैं। इसमें आपकी 100% FD सुरक्षित रहती है, उस पर ब्याज भी मिलता है, और 3-6 महीने में सिबिल स्कोर 750+ बन जाता है।'
          : 'If you have no income proof or low credit score, FD-backed secured credit cards (like IDFC FIRST WOW or OneCard) are the safest way to build a 750+ CIBIL score while earning regular interest on your fixed deposit.',
        links: [{ title: isHi ? '💳 कार्ड ऑफर कैलकुलेटर देखें' : '💳 Check Card Offer Calculator', url: '/card-offers/' }, { title: isHi ? '🎓 स्टूडेंट कार्ड फ़ाइंडर' : '🎓 Student Card Finder', url: '/student-credit-cards/' }]
      };
    }

    if (lower.includes('loan') || lower.includes('emi') || lower.includes('लोन') || lower.includes('किश्त')) {
      return {
        answer: isHi
          ? 'सुरक्षित वित्तीय नियम के अनुसार आपकी सभी लोन किश्तें (EMI) कुल मासिक इन-हैंड सैलरी के 40% से ज़्यादा नहीं होनी चाहिए। होम लोन, पर्सनल लोन या कार लोन लेते समय हमेशा फ्लैट ब्याज दर के बजाय रिड्यूसिंग बैलेंस दर और प्रोसेसिंग फीस की तुलना करें।'
          : 'As a healthy financial benchmark, your total monthly loan EMIs should not exceed 40% of your net take-home salary. Always compare reducing-balance APR and processing fees rather than flat nominal rates.',
        links: [{ title: isHi ? '🛑 क़र्ज़ मुक्ति EMI कैलकुलेटर' : '🛑 Debt Trap & EMI Calculator', url: '/debt-trap-calculator/' }]
      };
    }

    if (lower.includes('pmay') || lower.includes('subsidy') || lower.includes('योजना') || lower.includes('आवास')) {
      return {
        answer: isHi
          ? 'प्रधानमंत्री आवास योजना (PMAY) के तहत पहली बार घर खरीदने वाले परिवारों को होम लोन पर ब्याज सब्सिडी का लाभ मिलता है। इसके लिए परिवार के किसी सदस्य के नाम पहले से पक्का मकान नहीं होना चाहिए।'
          : 'Under Pradhan Mantri Awas Yojana (PMAY), first-time home buyers can access interest subsidies on eligible home loans, provided no family member owns a pucca house across India.',
        links: [{ title: isHi ? 'सरकारी योजनाएँ गाइड' : 'Read Government Welfare Guide', url: guideUrl }]
      };
    }

    return {
      answer: isHi
        ? 'आपके सवाल के अनुसार सही और प्रमाणित जानकारी हमारी वेरिफ़ाइड गाइड में उपलब्ध है। वित्तीय सुरक्षा के लिए किसी भी लोन या कार्ड का चुनाव करने से पहले उसके नियम व शुल्क ज़रूर समझें।'
        : 'Verified guidance on this topic is available in our structured financial guide. Always review exact fee schedules and interest terms before selecting any financial product.',
      links: [{ title: isHi ? 'साधारण गाइड पढ़ें' : 'Read Verified Guide', url: guideUrl }]
    };
  }

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
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
      if(!supabaseUrl || !supabaseUrl.startsWith('http')){
        throw new Error('local_fallback');
      }
      if(!client.current){
        let storage;try{storage=window.sessionStorage;}catch{}
        client.current=chatSessionId(storage,()=>window.crypto.randomUUID());
      }
      const context=advisorContext(profile.current);
      const history=[...(context?[{role:'user',content:context}]:[]),...messages.slice(context?-3:-4).map(message=>({role:message.role,content:message.content.slice(0,message.role==='user'?questionLimit:1800)}))];
      
      const response=await fetch(supabaseUrl+'/functions/v1/sia-guide',{
        method:'POST',
        headers:{apikey:supabaseKey,'Content-Type':'application/json'},
        body:JSON.stringify({question:text,history,client:client.current,language:responseLanguage,style:profile.current?.style}),
        signal: controller.signal
      });
      const data=await response.json();
      if(!response.ok)throw new Error(data.code||'local_fallback');
      if(!['ai','reviewed'].includes(data.mode)||typeof data.answer!=='string'||data.answer.trim().length<5)throw new Error('local_fallback');
      if(!mounted.current)return;
      const productIds=Array.isArray(data.product_ids)?data.product_ids.slice(0,3).filter(id=>typeof id==='string'&&products.some(p=>p.id===id)):[];
      const topic=readingGuideFor(text,profile.current);
      const suppliedLinks=Array.isArray(data.links)?data.links.filter(link=>typeof link?.title==='string'&&link.title.length<180&&typeof link.url==='string'&&/^\/(?:hi\/)?(?:products|guides)\/[a-z0-9/#_-]*$/.test(link.url)).slice(0,3):[];
      const links=suppliedLinks.length?suppliedLinks:[{title:hi?'साधारण गाइड पढ़ें':'Read the simple guide',url:(responseLanguage==='hi'?'/hi':'')+'/guides/'+(topic?topic+'/':'')}];
      
      if(productIds.length&&profile.current)profile.current={...profile.current,productIds};
      setMessages(previous=>[...previous,{role:'user',content:text},{role:'assistant',content:data.answer.trim(),language:responseLanguage,links,loanOptions:data.mode==='reviewed'?data.loan_options:[],local:data.mode==='reviewed',options:data.mode==='reviewed'?data.options:[]}]);
      setQuestion('');
    }catch(err){
      if(!mounted.current)return;
      const fallback = getSmartFallbackReply(text, responseLanguage);
      setMessages(previous=>[...previous,{role:'user',content:text},{role:'assistant',content:fallback.answer,language:responseLanguage,links:fallback.links}]);
      setQuestion('');
      setError('');
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
    <div className="sia-chat-log" role="log" aria-live="polite" aria-relevant="additions" aria-label={hi?'बातचीत':'Conversation'}>
      <div className="sia-chat-bubble assistant">
        <strong>SIA</strong>
        <p>{hi?'नमस्ते! मैं आपकी पर्सनल फाइनेंस और सरकारी योजना एडवाइज़र हूँ। आप क्या खरीदना, लोन लेना या खाता शुरू करना चाहते हैं?' :'Hi! I am your personal finance and welfare scheme advisor. Tell me what you are trying to buy, borrow, or set up.'}</p>
        
        {messages.length===0 && (
          <div style={{marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '6px'}}>
            {quickChips.map((chip, idx)=>(
              <button
                key={idx}
                type="button"
                onClick={()=>send(null, chip.q)}
                style={{
                  background: 'rgba(22, 102, 75, 0.08)',
                  border: '1px solid rgba(22, 102, 75, 0.25)',
                  color: 'var(--ink, #16664b)',
                  padding: '5px 10px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                {chip.label}
              </button>
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
                <a key={lIdx} href={link.url} style={{fontSize: '12px', color: '#16664b', fontWeight: '600', textDecoration: 'underline'}}>
                  {link.title} &rarr;
                </a>
              ))}
            </div>
          )}
          {message.options?.length>0&&<SiaProductSummary options={message.options} language={responseLanguage}/>}
          {message.loanOptions?.length>0&&<LoanRateCards options={message.loanOptions}/>}
        </div>
      ))}
      {busy&&<div className="sia-chat-bubble assistant">
        <strong>SIA</strong>
        <p style={{fontStyle: 'italic', opacity: 0.8}}>
          {hi ? 'सोच रही हूँ...' : 'Thinking...'}
        </p>
      </div>}
      <div ref={tail}/>
    </div>
    <div className="sia-chat-bottom">
      <a className="product-library-link" href={hi?'/hi/guides/':'/guides/'}>{hi?'हर सेवा की आसान गाइड':'Simple guides for every service'} &rarr;</a>
      {error&&<div className="sia-chat-failure"><p className="sia-chat-error" role="alert">{error}</p>{question.trim()&&<button type="button" className="sia-retry" disabled={busy||listening} onClick={()=>{send();}}>Send again</button>}</div>}
      {(listening||notice)&&<p className="sia-chat-status" role="status">{listening?(notice||(hi?'आपकी बात बॉक्स में दिख रही है. बदलने या भेजने के लिए माइक रोकें.':'Your words appear in the box. Stop the mic to edit or send.')):notice}</p>}
      <form className="sia-composer" onSubmit={send}>
        <textarea ref={input} aria-label={hi?'अपनी उलझन बताएँ':'Describe your problem'} aria-describedby="sia-chat-privacy" placeholder={hi?'अपनी उलझन यहाँ बताएँ (या ऊपर दिए गए बटन दबाएँ)...':'Describe your problem here (or tap a chip above)...'} value={question} maxLength={questionLimit} onChange={event=>setQuestion(event.target.value)} onKeyDown={event=>{if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();send(event);}}}/>
        <div className="sia-composer-actions"><SiaVoice language={language} speechStyle={question.trim()||messages.length?responseStyle:undefined} onTranscript={transcribe} onDraft={preview} onListeningChange={micState} onNotice={setNotice}/><button type="submit" disabled={busy||listening||!question.trim()} className="sia-send" aria-label={hi?'भेजें':'Send'}><ArrowUp size={18}/></button></div>
      </form>
      <p id="sia-chat-privacy" className="sia-chat-privacy">{hi?'जांची गई गाइड जानकारी वेरिफाइड डेटा से चलती है. AI जवाबों में बिना किसी अकाउंट, PIN या OTP के गुप्त संदर्भ का उपयोग होता है.':'Reviewed guide replies run on verified data. AI answers use anonymized context with no account, PIN, or OTP details.'}</p>
      <details className="sia-chat-details"><summary>{hi?'गोपनीयता और माइक की जानकारी':'Privacy and microphone details'}</summary><p>{hi?'माइक की आवाज भेजने तक ब्राउज़र में ही रहती है. स्थानीय नियम नेटवर्क रिक्वेस्ट से पहले गोपनीयता सुनिश्चित करते हैं.':'Microphone input stays in browser state until sent. Local rules enforce privacy guidelines before network requests.'}</p></details>
    </div>
  </section>;
}
