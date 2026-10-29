// Public reviewed knowledge only. No conversations, contacts or generated answers are cached.
// The same router is used in the browser and Edge Function.
import {replyStyle} from './conversation.mjs';
import {directoryPath,productIsCurrent} from './product-directory.mjs';
import {costLabels} from './product-details.mjs';

export const brainVersion='reviewed-brain-1';
export const normalizeBrainText=text=>String(text||'').toLowerCase().replace(/[०-९]/g,c=>String('०१२३४५६७८९'.indexOf(c))).replace(/एंजेल\s*वन/g,'angel one').replace(/कोटक/g,'kotak').replace(/(?:ज़ेरोधा|जेरोधा)/g,'zerodha').replace(/फ्लैट्रेड/g,'flattrade').replace(/\b(?:angle|angelone)\b/g,'angel one').replace(/kotak\s*811/g,'kotak811').replace(/\b(?:brokrage|brokage)\b/g,'brokerage').replace(/[^\p{L}\p{M}\p{N}&]+/gu,' ').trim();
const categoryMap={savings:'savings_account',card:'credit_card',demat:'demat',loan:'loan',insurance:'insurance',credit_line:'credit_line',shopping:'shopping',other:'other'};
const contains=(text,alias)=>(' '+text+' ').includes(' '+normalizeBrainText(alias)+' ');
const productAliases=p=>[p.name,...(p.aliases||[]),p.id.replaceAll('_',' '),...(p.id==='amazon'?['amazon pay icici','amazon icici']:p.id==='angel_one'?['angel one']:p.id==='kotak'?['kotak811','kotak 811']:p.id==='sbi'?['sbi cashback','cashback sbi']:p.id==='hdfc'?['hdfc moneyback']:[])];
export function namedBrainProducts(question,products,now=new Date()){
 const t=normalizeBrainText(question);
 const found=products.filter(p=>productIsCurrent(p,now)&&productAliases(p).some(a=>normalizeBrainText(a).length>=4&&contains(t,a)));
 // “Amazon Pay ICICI annual fee” is a card question, not the Amazon shop guide.
 const cardSpecific=/credit card|क्रेडिट कार्ड|icici|moneyback|cashback sbi|sbi cashback/.test(t);
 return cardSpecific?found.filter(p=>p.category!=='shopping'):found;
}
const meaning=/\b(?:what is|what does|meaning|matlab|kya hota|kya hai|explain|difference|farq|fark)\b|क्या है|क्या होता|मतलब|समझा|अंतर|फर्क|फ़र्क/;
export const problemQuestion=q=>/\b(?:fail|failed|error|pending|deducted|deduct|declined|rejected|reject|complaint|stolen|scam|fraud|stuck|problem|refund)\b|कट गए|कटे|कटा|अटक|नहीं हो|नही हो|दिक्कत|शिकायत|धोखा/.test(normalizeBrainText(q));

// These explanations reuse the source-reviewed public guides; no live offers or rates here.
const faq=[
 {id:'upi-pending',match:t=>/upi|यूपीआई/.test(t)&&/pending|fail|debit|deduct|refund|अटक|कटा|कटे|कट गए|वापस/.test(t),guide:'upi-payment-pending',category:'other',answer:[
  'Check the status and reference inside your payment app, then use its Help/Dispute option or official bank support. A debit with “pending” status does not prove the recipient was paid. Avoid paying again until the status is clear. Never share an OTP or UPI PIN; a refund does not need your PIN.',
  'भुगतान ऐप में स्थिति और रेफ़रेंस देखें, फिर Help/Dispute या बैंक की आधिकारिक सहायता लें। पैसे कटने और “pending” दिखने से सामने वाले को भुगतान मिलना साबित नहीं होता। स्थिति साफ़ होने तक दोबारा भुगतान से बचें। OTP/UPI PIN न बताएँ; रिफंड पाने के लिए PIN नहीं चाहिए।',
  'Payment app mein status aur reference dekhein, phir Help/Dispute ya official bank support use karein. Paise katne aur pending dikhne se receiver ko payment milna confirm nahi hota. Status clear hone tak dobara payment se bachein. OTP/UPI PIN na batayein; refund receive karne ke liye PIN nahi chahiye.']},
 {id:'minimum-due',match:t=>/minimum\s*(?:amount\s*)?due|मिनिमम ड्यू|न्यूनतम देय/.test(t),guide:'credit-card',category:'card',answer:[
  'Minimum due is only part of the card bill, not full repayment. Paying it can leave a balance that attracts interest and other charges under your issuer’s terms. Check the total due, due date and interest rules on your statement. Can you repay the full bill without taking another loan?',
  'Minimum due पूरे कार्ड बिल की अदायगी नहीं है। इसे भरने के बाद बची रकम पर बैंक की शर्तों के अनुसार ब्याज और दूसरे शुल्क लग सकते हैं। स्टेटमेंट में कुल देय, आख़िरी तारीख और ब्याज के नियम देखें। क्या दूसरा उधार लिए बिना पूरा बिल चुका सकते हैं?',
  'Minimum due poora card bill nahi hota. Sirf ise bharne ke baad bachi rakam par issuer ki terms ke hisaab se interest aur doosre charges lag sakte hain. Statement mein total due, due date aur interest rules dekhein. Kya doosra udhaar liye bina poora bill chuka sakte hain?']},
 {id:'apr',match:t=>/\bapr\b/.test(t)&&meaning.test(t)&&!/\d/.test(t),guide:'loan-options',category:'loan',answer:[
  'APR describes the annual borrowing cost including interest and associated charges. A starting interest rate alone is not the total cost. Compare the written APR/KFS for the same amount and tenure. If processing fees are already included in APR, do not count them twice.',
  'APR ब्याज और संबंधित शुल्क समेत उधार की सालाना लागत बताता है। सिर्फ़ शुरुआती ब्याज दर पूरी लागत नहीं है। समान रकम और अवधि के लिखित APR/KFS की तुलना करें। APR में शामिल प्रोसेसिंग फीस दोबारा न जोड़ें।',
  'APR interest aur related charges sahit loan ki annual cost batata hai. Sirf starting interest rate poori cost nahi hai. Same amount aur tenure ka written APR/KFS compare karein. APR mein processing fee included ho to use dobara na jodein.']},
 {id:'zero-balance',match:t=>/zero balance|zero minimum|जीरो बैलेंस|शून्य बैलेंस/.test(t)&&meaning.test(t),guide:'savings-account',category:'savings',answer:[
  'Zero minimum balance means there is no required minimum balance for that exact account variant. It does not mean every service is free or no initial funding is needed. Debit-card, cash-service and other charges may differ. Which bank/account variant do you want to check?',
  'जीरो मिनिमम बैलेंस वाले उस खाते में न्यूनतम बैलेंस बनाए रखने की शर्त नहीं होती। इसका मतलब हर सेवा मुफ्त या शुरुआती जमा शून्य होना नहीं है। डेबिट कार्ड, नकद और दूसरे शुल्क अलग हो सकते हैं। किस बैंक/खाते के नियम जानना चाहते हैं?',
  'Zero minimum balance ka matlab us exact account variant mein minimum balance maintain karna zaroori nahi. Iska matlab har service free ya opening funding zero nahi. Debit-card, cash aur doosre charges alag ho sakte hain. Kis bank/account ke rules check karna chahte hain?']},
 {id:'secured-card',match:t=>/secured|fd card|fd backed|fd par|fd pe|एफडी|सिक्योर्ड/.test(t)&&meaning.test(t),guide:'credit-card',category:'card',answer:[
  'An FD-backed card is linked to a fixed deposit that can have a lien or lock-in. It still has a credit bill: fees, interest and repayment terms must be checked. An FD does not guarantee approval. Do not lock money needed for essentials or assume rewards cover borrowing costs.',
  'FD वाले कार्ड में फिक्स्ड डिपॉज़िट पर लियन या रोक हो सकती है। इसका बिल फिर भी चुकाना होता है; फीस, ब्याज और अदायगी के नियम देखें। FD से मंज़ूरी पक्की नहीं होती। ज़रूरी खर्च का पैसा लॉक न करें या रिवॉर्ड से उधार की लागत निकलने की उम्मीद न रखें।',
  'FD-backed card fixed deposit se linked hota hai; deposit par lien ya lock-in ho sakta hai. Card ka bill phir bhi chukana hota hai—fees, interest aur repayment terms dekhein. FD se approval pakka nahi. Zaroori kharch ka paisa lock na karein ya rewards se borrowing cost cover hone ki umeed na rakhein.']},
 {id:'demat-costs',match:t=>/brokerage|amc|dp charge|ब्रोकरेज|डीपी/.test(t)&&meaning.test(t)&&!/\b(?:vs|compare)\b/.test(t),guide:'demat-account',category:'demat',answer:[
  'Brokerage is the trading charge for the applicable segment; delivery, intraday and F&O can have different prices. AMC is account maintenance. DP charges relate to applicable demat debits, separately from brokerage. Zero brokerage does not make all charges zero. Which segment or broker are you checking?',
  'ब्रोकरेज ट्रेड का शुल्क है; डिलीवरी, इंट्राडे और F&O की दरें अलग हो सकती हैं। AMC खाते का मेंटेनेंस है। लागू डीमैट डेबिट पर DP शुल्क ब्रोकरेज से अलग होता है। शून्य ब्रोकरेज का मतलब सभी शुल्क शून्य नहीं। कौन-सा सेगमेंट या ब्रोकर देख रहे हैं?',
  'Brokerage trading ka charge hai; delivery, intraday aur F&O ki pricing alag ho sakti hai. AMC account maintenance hai. Applicable demat debit par DP charge brokerage se alag hota hai. Zero brokerage ka matlab sab charges zero nahi. Kaunsa segment ya broker check karna hai?']},
 {id:'insurance-types',match:t=>/health|term|हेल्थ|टर्म/.test(t)&&/insurance|बीमा/.test(t)&&/difference|farq|fark|अंतर|फर्क|फ़र्क/.test(t),guide:'insurance-basics',category:'insurance',answer:[
  'Health insurance covers eligible medical costs under the policy. Term life provides the stated death benefit to eligible beneficiaries under its terms. They serve different needs. Compare the exact cover, exclusions, waiting periods and claim conditions; a lower premium alone does not make one better.',
  'हेल्थ बीमा पॉलिसी की शर्तों के अनुसार योग्य इलाज का खर्च कवर करता है। टर्म जीवन बीमा शर्तों के अनुसार मृत्यु लाभ देता है। दोनों की ज़रूरत अलग है। सही कवर, अपवाद, वेटिंग पीरियड और दावा शर्तें देखें; केवल कम प्रीमियम से बेहतर विकल्प तय नहीं होता।',
  'Health insurance policy ki terms ke hisaab se eligible medical costs cover karta hai. Term life terms ke hisaab se death benefit deta hai. Dono ki zaroorat alag hai. Exact cover, exclusions, waiting periods aur claim conditions dekhein; sirf kam premium se better option decide nahi hota.']}
];

const costFields=[
 ['annual',/annual|yearly|saalana|salana|सालाना|वार्षिक/],['amc',/\bamc\b|maintenance|मेंटेनेंस/],
 ['physical',/physical|debit card|डेबिट कार्ड|फिजिकल/],['virtual',/virtual|वर्चुअल/],
 ['balance',/minimum balance|min balance|मिनिमम बैलेंस|न्यूनतम बैलेंस/],['funding',/funding|initial deposit|opening deposit|shuru.*jama|शुरुआती जमा/],
 ['opening',/opening fee|joining|खोलने.*फीस|जॉइनिंग/],['interest',/interest|ब्याज/],['apr',/\bapr\b/],
 ['upi',/\bupi\b|rupay|यूपीआई|रुपे/],['intraday',/intraday|इंट्राडे/],['delivery',/delivery|डिलीवरी/],
 ['futures',/futures?|फ्यूचर/],['options',/options?|\bfno\b|f\s*&\s*o|ऑप्शन/],['dp',/\bdp\b|डीपी/],
 ['cash',/\bcash\b|branch|नकद|शाखा/],['rewards',/reward|cashback|कैशबैक|रिवॉर्ड/],['premium',/premium|प्रीमियम/],['coverage',/cover|कवर/]
];
export function requestedCostFields(question){const t=normalizeBrainText(question);return costFields.filter(([,re])=>re.test(t)).map(([key])=>key);}
export function brainReply(question,profile,previous,language,now,products=[]){
 const t=normalizeBrainText(question),style=replyStyle(question,previous?.style||language),lang=style==='hi'?'hi':'en',S=(en,hi,roman)=>style==='hi'?hi:style==='roman'?roman:en;
 if(/^(?:reset|start over|new chat|नई शुरुआत|फिर से शुरू)$/.test(t))return null;
 const named=namedBrainProducts(question,products,now),fields=requestedCostFields(question);
 // Never turn an application obstacle into a product pitch.
 const issue=problemQuestion(question);
 const make=(answer,options=[],links=[],id='product-facts',p=profile)=>({answer,options,links,profile:p?{...p,style}:null,brain:id,reviewedOn:options[0]?.reviewedOn,reviewUntil:options[0]?.reviewUntil});
 if(profile?.category==='card'&&(profile.values?.income===0||profile.values?.repay==='no')&&!fields.length&&!meaning.test(t)){
  return make(S('First check how you would repay the full card bill without another loan. Card interest and fees can outweigh rewards, and an FD does not remove repayment obligations. Would you like help reviewing your monthly budget?',
   'पहले देखें कि दूसरा उधार लिए बिना पूरा कार्ड बिल कैसे चुकाएँगे। ब्याज और फीस रिवॉर्ड से ज़्यादा हो सकते हैं; FD से बिल की ज़िम्मेदारी खत्म नहीं होती। क्या महीने का बजट समझने में मदद चाहिए?',
   'Pehle dekhein ki doosra udhaar liye bina poora card bill kaise chukaayenge. Interest aur fees rewards se zyada ho sakte hain; FD se repayment ki zimmedari khatam nahi hoti. Kya monthly budget samajhne mein madad chahiye?'),[],[],'repayment-risk',{...profile,pending:'budgetHelp'});
 }
 // Recognise a coverage gap instead of asking a model to invent underwriting rules.
 if(products.length&&/farm|agricultur|crop|kisan|खेती|कृषि|किसान/.test(t)&&(/bank|loan|lender|repayment|बैंक|लोन|ऋण/.test(t)||profile?.category==='loan')&&!products.some(p=>productIsCurrent(p,now)&&p.category==='loan'&&p.facets?.purpose==='agriculture')){
  const p={category:'loan',style,values:profile?.category==='loan'?{...profile.values}:{},pending:null};
  return make(S('We do not have reviewed bank-specific agricultural-loan or seasonal-income rules here. Ask the lender for its actual scheme criteria, written APR/KFS and repayment calendar. I cannot confirm a required income-record period, insurance condition or approval. Which bank or scheme are you considering?',
   'यहाँ खेती के लोन या मौसमी आय के बैंक-विशेष नियम रिव्यू किए हुए नहीं हैं। बैंक से वास्तविक योजना की पात्रता, लिखित APR/KFS और किस्त का कैलेंडर पूछें। आय के रिकॉर्ड की अवधि, बीमा की शर्त या मंज़ूरी पुष्ट नहीं है। कौन-सा बैंक या योजना देख रहे हैं?',
   'Yahan agricultural loan ya seasonal income ke bank-specific rules reviewed nahi hain. Lender se actual scheme criteria, written APR/KFS aur repayment calendar poochhein. Income records ki required duration, insurance condition ya approval confirm nahi. Kaunsa bank ya scheme dekh rahe hain?'),[],[{title:S('Loan cost guide','लोन की लागत की गाइड','Loan cost guide'),url:(lang==='hi'?'/hi':'')+'/guides/loan-options/'}],'coverage-gap',p);
 }
 if(!issue){
  const contextual=!named.length&&(/\b(?:it|its|this|that|isme|iska|iski|uska|uski|inme|inki)\b|इसमें|इसका|इसकी|उसकी/.test(t)||previous?.pending==='use'&&fields.length)?(previous?.productIds||[]).map(id=>products.find(p=>p.id===id&&productIsCurrent(p,now))).filter(Boolean):[];
  const targets=(named.length?named:contextual).slice(0,3);
  if(targets.length&&targets.every(p=>p.category==='demat')&&!fields.length&&/brokerage|ब्रोकरेज/.test(t)){
   const p={category:'demat',style,values:{...(profile?.category==='demat'?profile.values:{})},productIds:targets.map(p=>p.id),pending:'use',completed:false};
   return make(S('Which segment’s brokerage should I check: delivery, intraday, or futures & options? These can have different prices.','किस सेगमेंट की ब्रोकरेज देखें—डिलीवरी, इंट्राडे या फ्यूचर्स और ऑप्शंस? इनकी दरें अलग हो सकती हैं।','Kis segment ki brokerage check karni hai—delivery, intraday ya futures aur options? Inki pricing alag ho sakti hai.'),[],[],'brokerage-segment',p);
  }
  if(targets.length&&(fields.length||/fees?|charges?|detail|फीस|शुल्क|जानकारी/.test(t))){
   const lines=targets.map(p=>{
    const defaults=p.category==='demat'?['opening','amc','delivery']:p.category==='credit_card'?['opening','annual','other']:p.category==='savings_account'?['balance','funding','physical']:Object.keys(p.details.costs);
    const found=(fields.length?fields:defaults).filter(k=>p.details.costs[k]);
    return p.name+': '+(found.length?found.slice(0,3).map(k=>costLabels[k][lang]+': '+p.details.costs[k][lang]).join('\n'):S('This specific condition is not confirmed in our reviewed record. Check the exact variant with its official source.','यह खास शर्त हमारे रिव्यू किए रिकॉर्ड में पुष्ट नहीं है। आधिकारिक स्रोत पर सही वेरिएंट की पुष्टि करें।','Yeh specific condition hamare reviewed record mein confirm nahi. Official source par exact variant check karein.'));
   });
   const category=Object.keys(categoryMap).find(k=>categoryMap[k]===targets[0].category),prior=profile?.category===category?profile:previous?.category===category?previous:null;
   const p={category,style,values:{...prior?.values},productIds:targets.map(p=>p.id),pending:null,completed:true};
   return make(lines.join('\n\n')+'\n'+S('These are reviewed terms, not an approval or a complete tariff. Full conditions and dated sources are below.','ये रिव्यू की शर्तें हैं, मंज़ूरी या पूरा टैरिफ नहीं। पूरी शर्तें और जाँच की तारीख नीचे हैं।','Yeh reviewed terms hain, approval ya complete tariff nahi. Full conditions aur dated sources neeche hain.'),targets,targets.map(p=>({title:p.name,url:directoryPath(p.id,p.category,lang)})),'product-facts',p);
  }
  if(named.length===1&&named[0].facets?.informational&&meaning.test(t)&&!/\b(?:compare|difference|farq|fark|vs)\b|तुलना|अंतर|फर्क|फ़र्क/.test(t)){
   const product=named[0],category=Object.keys(categoryMap).find(k=>categoryMap[k]===product.category);
   const p={category,style,values:profile?.category===category?{...profile.values}:{},pending:null,productIds:[product.id],completed:true};
   return make(product.name+': '+product.details.variant[lang],[product],[{title:product.name,url:directoryPath(product.id,product.category,lang)}],'product-meaning',p);
  }
  if(named.length===1&&/\b(?:open|opening|khol|kholna|kholvana|apply)\b|खोल|आवेदन/.test(t)){
   const product=named[0],category=Object.keys(categoryMap).find(k=>categoryMap[k]===product.category);
   const p={category,style,values:profile?.category===category?{...profile.values}:{},productIds:[product.id],pending:null,completed:true};
   return make(product.name+': '+product.details.variant[lang]+'\n'+S('Read the fees and opening steps below, then use an available approved application link. The provider handles verification and decides approval.','नीचे फीस और खोलने का तरीका पढ़ें, फिर उपलब्ध आवेदन लिंक इस्तेमाल करें। जाँच और मंज़ूरी प्रदाता तय करता है।','Neeche fees aur opening steps padhein, phir available application link use karein. Verification aur approval provider tay karta hai.'),[product],[{title:product.name,url:directoryPath(product.id,product.category,lang)}],'product-opening',p);
  }
 }
 const item=faq.find(entry=>entry.match(t));
 if(item){const prior=profile?.category===item.category?profile:previous?.category===item.category?previous:null;const p={...prior,category:item.category,values:{...prior?.values},style};return make(item.answer[style==='hi'?1:style==='roman'?2:0],[],[{title:S('Read the full guide','पूरी गाइड पढ़ें','Poori guide padhein'),url:(lang==='hi'?'/hi':'')+'/guides/'+item.guide+'/'}],item.id,p);}
 if(meaning.test(t)&&!issue){
  const definitions=[
   {match:/saving|बचत|सेविंग/,category:'savings',guide:'savings-account',answer:[
    'A savings account holds money for personal saving and payments. Compare the exact account’s minimum balance, opening funding, debit-card/cash charges and interest terms. These are separate conditions. Do you want zero minimum balance or an account where you can maintain a balance?',
    'सेविंग खाता निजी बचत और भुगतान के लिए होता है। सही खाते का न्यूनतम बैलेंस, शुरुआती जमा, डेबिट कार्ड/नकद शुल्क और ब्याज की शर्तें अलग-अलग देखें। जीरो मिनिमम बैलेंस चाहिए या कुछ बैलेंस रख सकते हैं?',
    'Savings account personal saving aur payments ke liye hota hai. Exact account ka minimum balance, opening funding, debit-card/cash charges aur interest terms alag dekhein. Zero minimum balance chahiye ya kuch balance maintain kar sakte hain?']},
   {match:/credit card|क्रेडिट कार्ड/,category:'card',guide:'credit-card',answer:[
    'A credit card lets you spend against the issuer’s approved borrowing limit and repay a bill. Compare joining/annual fees, eligible rewards and interest/late charges. Rewards do not remove repayment obligations. Can you pay the full statement bill on time without another loan?',
    'क्रेडिट कार्ड बैंक की मंज़ूर उधार सीमा से खर्च और बाद में बिल चुकाने की सुविधा है। जॉइनिंग/सालाना फीस, योग्य रिवॉर्ड और ब्याज/देर के शुल्क देखें। रिवॉर्ड से बिल की ज़िम्मेदारी खत्म नहीं होती। क्या दूसरा उधार लिए बिना पूरा बिल समय पर भर पाएँगे?',
    'Credit card issuer ki approved borrowing limit se kharch aur baad mein bill repay karne ki facility hai. Joining/annual fees, eligible rewards aur interest/late charges dekhein. Rewards se repayment ki zimmedari khatam nahi hoti. Kya doosra udhaar liye bina poora bill time par bhar paayenge?']},
   {match:/demat|डीमैट|डीमेट/,category:'demat',guide:'demat-account',answer:[
    'A demat account holds securities electronically; a trading account is used to place trades. Compare opening/AMC, your trading segment’s brokerage, DP and statutory charges. Delivery, intraday and F&O costs can differ. Which segment do you intend to use?',
    'डीमैट खाते में प्रतिभूतियाँ इलेक्ट्रॉनिक रूप में रखी जाती हैं; ट्रेडिंग खाते से ट्रेड किए जाते हैं। खोलने/AMC, आपके सेगमेंट की ब्रोकरेज, DP और वैधानिक शुल्क साथ देखें। डिलीवरी, इंट्राडे और F&O की लागत अलग हो सकती है। कौन-सा सेगमेंट इस्तेमाल करेंगे?',
    'Demat account securities electronic form mein hold karta hai; trading account se trades place hote hain. Opening/AMC, apne segment ki brokerage, DP aur statutory charges compare karein. Delivery, intraday aur F&O ke costs alag ho sakte hain. Kaunsa segment use karenge?']},
   {match:/insurance|बीमा/,category:'insurance',guide:'insurance-basics',answer:[
    'Insurance covers specified risks under an exact policy, in return for its premium. Health, term life, motor and other types serve different needs. Compare cover, exclusions, waiting periods, your share of costs and claim conditions. Which type of protection do you want to understand?',
    'बीमा प्रीमियम के बदले पॉलिसी में तय जोखिमों का कवर देता है। हेल्थ, टर्म जीवन, वाहन और दूसरे प्रकार अलग ज़रूरतों के लिए हैं। कवर, अपवाद, वेटिंग पीरियड, अपने खर्च और दावा शर्तें देखें। किस तरह की सुरक्षा समझना चाहते हैं?',
    'Insurance premium ke badle exact policy mein specified risks ka cover deta hai. Health, term life, motor aur doosre types alag needs ke liye hain. Cover, exclusions, waiting periods, apna payable hissa aur claim conditions dekhein. Kis type ki protection samajhna chahte hain?']}
  ];
  const definition=definitions.find(d=>d.match.test(t));
  if(definition&&!named.length){const p={...(profile||previous||{}),category:definition.category,values:profile?.category===definition.category?{...profile.values}:{},style,pending:null};return make(S(...definition.answer),[],[{title:S('Read the full guide','पूरी गाइड पढ़ें','Poori guide padhein'),url:(lang==='hi'?'/hi':'')+'/guides/'+definition.guide+'/'}],definition.category+'-meaning',p);}
 }
 return null;
}

// Retrieval builds a small, current context for unfamiliar questions instead of sending every product.
// Ranking uses public intent/name/fee fields, never commission. User text is not stored.
export function retrieveBrainProducts(question,profile,products,now=new Date(),limit=6){
 const t=normalizeBrainText(question),matches=namedBrainProducts(question,products,now),named=new Set(matches.map(p=>p.id)),fields=requestedCostFields(question),category=categoryMap[profile?.category],categories=new Set(matches.map(p=>p.category));
 const tokens=t.split(' ').filter(s=>s.length>=4&&!/^(?:what|which|please|mujhe|chahiye|batao|account|card|charges|charge|fees|costs|compare)$/.test(s));
 return products.filter(p=>productIsCurrent(p,now)&&(!categories.size||categories.has(p.category))).map(p=>{
  const text=normalizeBrainText([p.name,...(p.aliases||[]),p.facts,JSON.stringify(p.facets)].join(' '));
  const score=(named.has(p.id)?100:0)+(p.category===category?10:0)+tokens.reduce((n,w)=>n+(contains(text,w)?2:0),0)+fields.filter(k=>p.details.costs[k]&&p.category===category).length;
  return {p,score};
 }).filter(row=>row.score>0).sort((a,b)=>b.score-a.score||a.p.id.localeCompare(b.p.id)).slice(0,limit).map(row=>row.p);
}
export function brainPromptFacts(question,profile,products,now=new Date()){
 return retrieveBrainProducts(question,profile,products,now).map(p=>p.facts+' Variant: '+p.details.variant.en+' Reviewed: '+p.reviewedOn+'; recheck: '+p.reviewUntil).join('\n').slice(0,12000);
}
