// Reviewed information, not eligibility decisions or affiliate offers.
// The profile stays in component memory. Nothing here uses a network or storage.
import {validateQuestion} from '../supabase/functions/_shared/conversation.mjs';
import {catalog,reviewedOn,reviewUntil,mentionedProductIds} from '../supabase/functions/_shared/reviewed-products.mjs';
import {compareAprQuotes} from '../supabase/functions/_shared/quote-comparison.mjs';
import {serviceGuideFor} from '../supabase/functions/_shared/service-guides.mjs';
export {catalog,reviewedOn,reviewUntil};
const normal=text=>text.replace(/[०-९]/g,c=>String('०१२३४५६७८९'.indexOf(c))).toLowerCase().replace(/\b(?:brokrage|brokage|borkerage)\b/g,'brokerage');
export function intentOf(value){
 const t=normal(value);
 // Problems with existing products should go to free-form help, not a sales interview.
 if(/(?:fraud|scam|stolen|lost|pending|deduct|declined|reject|complaint|minimum due|धोखा|चोरी|शिकायत|अटक)/i.test(t))return null;
 if(/credit\s*card|cred[ti]*t?\s*card|क्रेडिट\s*कार्ड/.test(t))return 'card';
 if(/sav(?:ing|ings)\s*(?:bank\s*)?(?:a?ccount|ac|account)|saving|बचत\s*खाता|सेविंग/.test(t))return 'savings';
 if(/demat|डीमैट|डीमेट|f\s*&\s*o|\bfno\b|futures?\s*(?:and|aur|&|or)?\s*options?|options?\s*(?:trading|trade)|फ्यूचर|ऑप्शन.{0,15}ट्रेड/.test(t))return 'demat';
 if(/insurance|policy|बीमा|पॉलिसी/.test(t))return 'insurance';
 if(/\bloan\b|लोन|ऋण|business|biznes|bijnes|बिजनेस|बिज़नेस|बिज़नेस|व्यापार|कारोबार/.test(t))return 'loan';
 return null;
}
function money(t){
 const m=t.match(/(?:₹|rs\.?\s*|rupees?\s*)?(\d[\d,]*(?:\.\d+)?)\s*(k\b|thousand|hazar|hazaar|हजार|हज़ार|lakh|lac|लाख)?/i);
 if(!m)return undefined;const amount=Number(m[1].replaceAll(',',''))*(/lakh|lac|लाख/.test(m[2]||'')?100000:/k|thousand|hazar|hazaar|हजार|हज़ार/.test(m[2]||'')?1000:1);
 return Number.isFinite(amount)&&amount>=0&&amount<=100000000?amount:undefined;
}
function languageFor(q,previous,language){return /[\u0900-\u097f]/.test(q)?'hi':/\b(mujhe|mujko|meri|mera|mere|hai|hu|hain|haan|han|nhi|nahi|chahiye|lena|karna|krna|kr|karta|karti|btao|batao|hoga)\b/.test(normal(q))?'roman':previous||language;}
function fieldsFrom(q,p){
 const t=normal(q),v={...p.values},pending=p.pending;
 const income=t.match(/(?:income|salary|आय|सैलरी|आमदनी)[^\d]{0,28}([\d,.]+\s*(?:k\b|thousand|hazaar|hazar|हजार|हज़ार|lakh|लाख)?)/i);
 const before=t.match(/([\d,.]+\s*(?:k\b|हजार|हज़ार)?)\s*(?:rs|रु|रुपये|rupees)?\s*(?:per\s*month|monthly|महीन|प्रतिमाह)/i);
 if(income||before)v.income=money((income||before)[1]);
 if(/(?:no|zero)\s+(?:current\s+)?income|(?:income|salary|आय|आमदनी)\s*(?:(?:abhi|koi|bilkul|is|बिल्कुल|अभी|कोई)\s*)?(?:nahi|nhi|नहीं)/.test(t))v.income=0;
 const correctedIncome=t.match(/(?:income|salary|आय|आमदनी)[^\d]{0,15}\d[\d,]*\s*(?:k\b)?\s*(?:nahi|nhi|not|नहीं)[^\d]{0,12}(\d[\d,]*\s*(?:k\b|हजार|हज़ार)?)/i);
 if(correctedIncome)v.income=money(correctedIncome[1]);
 if(p.category==='card'){
  if(/amazon|अमेज[़ॉो]*न/.test(t))v.use='amazon';
  else if(/fuel|petrol|diesel|पेट्रोल|डीजल|ईंधन/.test(t))v.use='fuel';
  else if(/travel|flight|airport|यात्रा|फ्लाइट/.test(t))v.use='travel';
  else if(/online|flipkart|shopping|swiggy|ऑनलाइन|शॉपिंग/.test(t))v.use='online';
  else if(/grocery|grocer|kirana|daily|everyday|general|राशन|किराना|रोज़|रोजमर्रा/.test(t))v.use='everyday';
  if(/(?:no|zero|without|free|nahi|nhi|नहीं|शून्य).{0,18}(?:annual|joining|fee|fees|charge|फीस|शुल्क)|(?:fee|fees|charge|फीस|शुल्क).{0,20}(?:nahi|nhi|नहीं|zero|free|0\b)|lifetime free|l[a-z]*time free/.test(t))v.fee='free';
  else if(/(?:fee|fees|फीस|शुल्क).{0,25}(?:okay|ok|fine|de sak|de dung|bhar|pay|theek|ठीक|दे सक|दे दू)|paid card|paid okay/.test(t))v.fee='paid';
  if((pending==='fee'||/annual|fee|फीस|शुल्क/.test(t)&&/tak|limit|max|तक/.test(t))&&money(t)>0){v.fee='paid';v.maxFee=money(t);}
  const negative=/nahi|nhi|nahin|नहीं|\bno\b|cannot|can't|minimum|मिनिमम/.test(t);
  if(/full|poora|pura|पूरा|पूरी|entire/.test(t)&&/bill|बिल|repay|payment|pay|chuka|bhar|चुका|भर/.test(t))v.repay=negative?'no':'yes';
  else if(pending==='repay'&&/^(?:yes|haan|han|ha|हाँ|हां|bilkul|बिल्कुल)\b|^हाँ|^हां/.test(t))v.repay='yes';
  else if(pending==='repay'&&negative)v.repay='no';
 }
 if(p.category==='savings'){
  if(/zero|no minimum|without minimum|0\s*balance|शून्य|जीरो|बैलेंस.{0,10}नहीं/.test(t)||/^0$/.test(t))v.balance='zero';
  else if(/(?:maintain|balance|बैलेंस).{0,20}(?:okay|ok|rakh|रख|ठीक)/.test(t)||pending==='balance'&&money(t)>0)v.balance='maintain';
  if(/\bboth\b|\ball services?\b|dono|sabhi|sab tarah|दोनों|सभी|सब प्रकार|सब तरह/.test(t))v.channel='both';
  else if(/branch|cash|शाखा|नकद|ब्रांच/.test(t))v.channel='branch';
  else if(/online|digital|app|upi|ऑनलाइन|ऐप|यूपीआई|डिजिटल/.test(t))v.channel='digital';
 }
 if(p.category==='demat'){
  if(/f\s*&\s*o|\bfno\b|\bfutures\b|future\s*(?:and|aur|&|or)?\s*options?|future\s*(?:trading|trade)|options?\s*(?:trading|trade)|फ्यूचर्स|फ्यूचर.{0,15}ऑप्शन|ऑप्शन.{0,15}ट्रेड/.test(t))v.use='fno';
  else if(/intra|इंट्राडे/.test(t))v.use='intraday';
  else if(/long.?term|hold|invest|delivery|लंब|निवेश/.test(t))v.use='holding';
  else if(/trade|trading|ट्रेड/.test(t)&&!v.use)v.use='trading';
  if(/(?:zero|0|free|शून्य|जीरो).{0,22}(?:brokerage|charge|ब्रोकरेज|चार्ज)|(?:brokerage|charge|ब्रोकरेज|चार्ज).{0,25}(?:zero|0|nahi|nhi|शून्य|नहीं|जीरो)/.test(t)){v.zeroBrokerage=true;v.fee='zero_brokerage';}
  else if(/(?:low|kam|कम).{0,18}(?:brokerage|ब्रोकरेज)|(?:brokerage|ब्रोकरेज).{0,18}(?:okay|paid|low|kam|ठीक)/.test(t)){v.zeroBrokerage=false;v.fee='brokerage';}
  if(/(?:no|zero|free|nahi|नहीं).{0,20}(?:amc|maintenance|मेंटेन)|(?:amc|maintenance).{0,20}(?:zero|nahi|नहीं|free)/.test(t)){v.zeroAmc=true;if(!v.zeroBrokerage)v.fee='free';}
  else if(v.fee===undefined&&/brokerage|delivery|ब्रोकरेज/.test(t))v.fee='brokerage';
  if(/(?:opening|account.{0,6}open|खाता.{0,8}खोल).{0,25}(?:free|zero|0|nahi|नहीं)|(?:zero|free|0).{0,12}opening/.test(t))v.opening='free';
 }
 if(p.category==='loan'){
  if(/business|biznes|bijnes|बिजनेस|बिज़नेस|बिज़नेस|व्यापार|कारोबार/.test(t))v.purpose='business';else if(/home|house|घर/.test(t))v.purpose='home';else if(/education|study|पढ़ाई|शिक्षा/.test(t))v.purpose='education';else if(/personal|medical|wedding|पर्सनल|इलाज/.test(t))v.purpose='personal';else if(/car|bike|vehicle|गाड़ी|बाइक/.test(t))v.purpose='vehicle';
  if(pending==='amount'||/amount|रकम|राशि|lakh|lac|लाख|\bloan\b|लोन|ऋण/.test(t)&&!/emi|किस्त|income|salary|आय|सैलरी/.test(t)){const n=money(t);if(n>0)v.amount=n;}
  if(pending==='budget'||/emi.{0,15}(?:budget|afford)|किस्त.{0,15}बजट/.test(t)){const n=money(t);if(n>0)v.budget=n;}
 }
 if(p.category==='insurance'){
  if(/health|medical|स्वास्थ्य|हेल्थ/.test(t))v.type='health';else if(/term|life|टर्म|जीवन/.test(t))v.type='term';else if(/car|bike|motor|vehicle|गाड़ी|मोटर/.test(t))v.type='motor';
  if(/family|parents|परिवार|माता|पिता/.test(t))v.cover='family';else if(/myself|self|sirf me|sirf mere|khud|खुद|सिर्फ़ मेरे/.test(t))v.cover='self';
  if((pending==='priority'||/premium|प्रीमियम|coverage|कवर|priority/.test(t))&&t.length>5)v.priority=q.trim();
 }
 return v;
}
const questions={
 card:{use:['Where will you use it most: online shopping, groceries, fuel or travel?','कार्ड का सबसे ज़्यादा इस्तेमाल कहाँ होगा—ऑनलाइन खरीदारी, किराना, पेट्रोल या यात्रा?','Card sabse zyada kahan use karenge—online shopping, kirana, petrol ya travel?'],fee:['Do you want no joining/annual fee, or is a paid card okay if its benefits cover the cost?','जॉइनिंग/सालाना फीस शून्य चाहिए, या फ़ायदे लागत से ज़्यादा हों तो फीस वाला कार्ड भी चलेगा?','Joining/annual fee zero chahiye, ya fayde cost se zyada hon to paid card bhi chalega?'],repay:['Can you pay the full statement bill on time every month, without another loan?','क्या हर महीने पूरा कार्ड बिल समय पर, दूसरा उधार लिए बिना भर पाएँगे?','Kya har mahine poora card bill time par, doosra udhaar liye bina bhar paayenge?']},
 savings:{balance:['Do you need zero minimum balance, or can you comfortably maintain a balance?','ज़ीरो न्यूनतम बैलेंस चाहिए, या बिना परेशानी बैलेंस रख सकते हैं?','Zero minimum balance chahiye, ya aaram se balance maintain kar sakte hain?'],channel:['Will you mainly use an app/UPI, or do you need frequent branch/cash services?','ज़्यादातर ऐप/UPI इस्तेमाल करेंगे, या शाखा और नकद सेवाएँ अक्सर चाहिए?','Zyada app/UPI use karenge, ya branch aur cash services aksar chahiye?']},
 demat:{use:['Which segment do you mean: delivery investing, intraday, or futures & options?','कौन-सा सेगमेंट चाहिए—डिलीवरी निवेश, इंट्राडे, या फ्यूचर्स और ऑप्शंस?','Kaunsa segment chahiye—delivery investing, intraday, ya futures aur options?'],fee:['Is your priority zero brokerage per order, low brokerage, or zero annual maintenance?','प्राथमिकता क्या है—हर ऑर्डर पर शून्य ब्रोकरेज, कम ब्रोकरेज, या शून्य सालाना मेंटेनेंस?','Priority kya hai—har order par zero brokerage, low brokerage, ya zero annual maintenance?']},
 loan:{purpose:['What is the loan for: home, education, vehicle or another personal need?','लोन किस काम के लिए चाहिए—घर, पढ़ाई, वाहन या कोई निजी ज़रूरत?','Loan kis kaam ke liye chahiye—ghar, padhai, vehicle ya personal need?'],amount:['Approximately how much do you need to borrow?','लगभग कितनी रकम उधार चाहिए?','Lagbhag kitni rakam ka loan chahiye?'],budget:['After essentials and existing EMIs, what monthly repayment could you comfortably manage?','ज़रूरी खर्च और मौजूदा EMI के बाद कितनी मासिक किस्त आराम से भर सकते हैं?','Zaroori kharch aur existing EMI ke baad kitni monthly kist aaram se bhar sakte hain?']},
 insurance:{type:['Are you looking for health, term life or motor insurance?','स्वास्थ्य, टर्म जीवन या वाहन बीमा चाहिए?','Health, term life ya motor insurance chahiye?'],cover:['Is the cover for yourself or family members? Do not share names or medical records.','कवर खुद के लिए चाहिए या परिवार के लिए? नाम या मेडिकल रिपोर्ट न भेजें।','Cover khud ke liye chahiye ya family ke liye? Naam ya medical reports mat bhejiye.'],priority:['What matters most: premium budget, coverage or a particular service?','आपकी पहली प्राथमिकता क्या है—प्रीमियम का बजट, कवर या कोई खास सुविधा?','Sabse zaroori kya hai—premium budget, coverage ya koi khaas service?']}
};
export function advisorReply(question,previous=null,language='hi',now=new Date()){
 validateQuestion(question);
 const category=intentOf(question),t=normal(question);
 const named=mentionedProductIds(question,now);
 if(named.length>=2&&/\b(?:compare|comparison|vs|versus|difference|farq)\b|तुलना|फ़र्क|फर्क/.test(t)&&new Set(named.map(id=>catalog[id].category)).size===1){
  const style=languageFor(question,previous?.style,language),hi=style==='hi',roman=style==='roman';
  return {answer:hi?'आपके बताए उत्पाद नीचे हैं। पूरी जानकारी वाले पेज पर चालू फीस और शुरुआती ऑफ़र अलग देखकर तुलना करें।':roman?'Aapke bataye products neeche hain. Poori jankari wale page par ongoing fees aur introductory offer alag dekhkar compare karein.':'Open the details pages below to compare the products you named. Check ongoing charges separately from introductory offers.',options:named.map(id=>({...catalog[id],reason:hi?'आपके चुने उत्पाद की जानकारी; क्रम आपके सवाल के अनुसार है, कमीशन के अनुसार नहीं।':roman?'Aapke chune product ki information; order aapke sawal ka hai, commission ka nahi.':'Information for the product you named; order follows your question, not commission.'})),profile:{category:{credit_card:'card',savings_account:'savings',demat:'demat'}[catalog[named[0]].category],values:previous?.category===({credit_card:'card',savings_account:'savings',demat:'demat'}[catalog[named[0]].category])?previous.values:{},completed:true,style},expanded:true,reviewedOn,reviewUntil};
 }
 if(named.length===1&&/puri|poori|full|detail|fees?|charges?|जानकारी|विस्तार/i.test(t)&&!/\b(?:best|better|which|compare|comparison|vs|kaunsa)\b|तुलना|बेहतर/.test(t)){
  const product=catalog[named[0]],style=languageFor(question,previous?.style,language),S=(en,hi,roman)=>style==='hi'?hi:style==='roman'?roman:en;
  const same=previous&&({card:'credit_card',savings:'savings_account',demat:'demat'}[previous.category]===product.category);
  return {answer:S('Here is the main information. Use Full details for the complete reviewed fees, restrictions and opening steps.','मुख्य जानकारी नीचे है। पूरी फीस, शर्तें और खोलने का तरीका “पूरी जानकारी” वाले पेज पर पढ़ें।','Mukhya jankari neeche hai. Poori fees, shartein aur opening steps “Poori jankari” wale page par padhein.'),options:[{...product,reason:S('Product information you requested; this does not assess approval or suitability.','आपके पूछे उत्पाद की जानकारी; मंज़ूरी या उपयुक्तता की जाँच नहीं।','Aapke poochhe product ki information; approval ya suitability assessment nahi.')}],profile:same?previous:{category:{credit_card:'card',savings_account:'savings',demat:'demat'}[product.category],values:{},completed:true,style},expanded:true,reviewedOn,reviewUntil};
 }
 const quotes=compareAprQuotes(question,language);
 if(quotes)return {...quotes,options:[],profile:{category:'loan',values:previous?.category==='loan'?previous.values:{},completed:true,pending:null},reviewedOn,reviewUntil};
 // A meaning/explanation question is not an application request.
 if(/what (?:is|does)|meaning|matlab|kya hota|क्या होता|क्या है|कैसे काम|explain|समझा/.test(t))return null;
 // Let the grounded AI compare actual quotes rather than repeating a completed interview.
 if(/\b(?:compare|comparison|vs|versus|difference|farq)\b|तुलना|फ़र्क|फर्क/.test(t)&&/apr|quote|premium|rate|policy|amazon|sbi|hdfc|kotak|zerodha|groww|प्रीमियम|दर|पॉलिसी/.test(t))return null;
 if(/start over|new chat|reset|नई शुरुआत|फिर से शुरू/.test(t))return {profile:null,answer:language==='hi'?'ठीक है, नई शुरुआत करते हैं। किस बात में मदद चाहिए?':'Okay, let’s start again. What do you need help with?',options:[]};
 if(/fraud|scam|stolen|lost|pending|deduct|declined|reject|complaint|minimum due|धोखा|चोरी|शिकायत|अटक/.test(t))return null;
 if(!category&&!previous?.category)return null;
 const p=category&&category!==previous?.category?{category,values:{},pending:null}:previous?{...previous,values:{...previous.values}}:{category,values:{},pending:null};
 p.style=languageFor(question,p.style,language);
 const S=(en,hi,roman)=>p.style==='hi'?hi:p.style==='roman'?roman:en;
 p.values=fieldsFrom(question,p);const v=p.values;
 const result=(answer,options=[])=>({answer,options,links:[{title:language==='hi'?'आसान भाषा में पूरी जानकारी':'Read the simple guide',url:(language==='hi'?'/hi':'')+'/guides/'+serviceGuideFor(p)+'/'}],profile:p,reviewedOn,reviewUntil,expanded:/puri|poori|full|detail|विस्तार|पूरी जानकारी/i.test(question)});
 const ask=key=>{p.pending=key;const q=questions[p.category][key];return result((v.income!==undefined&&category==='card'?S(`You mentioned monthly income of ₹${v.income.toLocaleString('en-IN')}. Income alone does not establish approval. `,`आपने मासिक आय ₹${v.income.toLocaleString('en-IN')} बताई है। सिर्फ़ आय से मंज़ूरी तय नहीं होती। `,`Aapne monthly income ₹${v.income.toLocaleString('en-IN')} batayi hai. Sirf income se approval tay nahi hota. `):'')+S(...q));};
 if(p.category==='card'&&(v.income===0||v.repay==='no')){
  if(previous?.pending==='budgetHelp')return null;
  p.pending='budgetHelp';return result(S('Before comparing reward cards, first check how you would repay the full bill. Interest and fees can outweigh rewards. Would you like help reviewing your monthly budget?','रिवॉर्ड कार्ड की तुलना से पहले पूरे बिल की अदायगी समझना ज़रूरी है। ब्याज और फीस फ़ायदों से ज़्यादा पड़ सकते हैं। क्या महीने का बजट समझने में मदद चाहिए?','Reward cards compare karne se pehle poore bill ki repayment samajhna zaroori hai. Interest aur fees faydon se zyada ho sakti hain. Kya monthly budget samajhne mein madad chahiye?'));
 }
 const changed=Object.keys(v).some(k=>v[k]!==previous?.values?.[k]);
 if(!category&&!changed&&!/^(?:yes|haan|han|ha|okay|ok|हाँ|हां|ठीक)[.! ]*$/.test(t)&&!/detail|info|puri|poori|fees|charges|brokerage|jaankari|jankari|जानकारी|विस्तार/.test(t))return null;
 if(['card','savings','demat'].includes(p.category)&&now.toISOString().slice(0,10)>reviewUntil)return result(S('A fresh review is due; check current official terms on the guide.','नया रिव्यू ज़रूरी है; गाइड में वर्तमान आधिकारिक नियम जाँचें।','Fresh review zaroori hai; guide mein current official terms check karein.'));
 // Direct service answers precede optional interviews. Retain known facts across turns.
 if(p.category==='loan'||p.category==='insurance'){
  p.completed=true;p.pending=null;
  if(p.category==='loan'){
   const amount=v.amount?S('For your ₹'+v.amount.toLocaleString('en-IN')+' requirement, ','आपकी ₹'+v.amount.toLocaleString('en-IN')+' की ज़रूरत के लिए ','Aapki ₹'+v.amount.toLocaleString('en-IN')+' ki zaroorat ke liye '):'';
   p.pending=v.purpose?null:'purpose';
   return result(v.purpose==='business'?amount+S('ask your bank or a regulated lender about a business loan. For an eligible small business, ask about MUDRA too; approval depends on the lender. See the steps below.','बैंक या विनियमित ऋणदाता से बिजनेस लोन पूछें। योग्य छोटे कारोबार के लिए मुद्रा का रास्ता भी पूछ सकते हैं; मंज़ूरी ऋणदाता तय करेगा। नीचे आसान तरीके से पढ़ें।','bank ya regulated lender se business loan poochhein. Eligible chhote business ke liye MUDRA ka rasta bhi poochh sakte hain; approval lender tay karega. Neeche aasaan steps padhein.'):
    amount+S('start with the lender’s official branch or website and compare the written cost and EMI. Is it for business, home, education, a vehicle or a personal need?','बैंक की आधिकारिक शाखा या वेबसाइट से शुरुआत करें और लिखित लागत व EMI देखें। यह बिजनेस, घर, पढ़ाई, गाड़ी या निजी ज़रूरत के लिए है?','bank ki official branch ya website se shuru karein aur written cost aur EMI dekhein. Yeh business, ghar, padhai, gaadi ya personal need ke liye hai?').replace(v.purpose||previous?.pending==='purpose'?/Is it for[^?]*[?]|यह बिजनेस[^?]*[?]|Yeh business[^?]*[?]/g:/$^/g,''));
  }
  if(v.type)return result(S(({health:'For health insurance, compare covered treatment, hospital network, waiting periods and your share of claim costs.',term:'For term life insurance, compare the death benefit, cover period, exclusions and renewal/payment terms.',motor:'For motor insurance, compare the cover type, exclusions, deductibles and claim process.'}[v.type])+' Read the simple guide below.',({health:'हेल्थ बीमा में इलाज का कवर, अस्पताल नेटवर्क, वेटिंग पीरियड और दावे में अपना हिस्सा देखें।',term:'टर्म जीवन बीमा में मृत्यु लाभ, कवर की अवधि, अपवाद और भुगतान के नियम देखें।',motor:'वाहन बीमा में कवर का प्रकार, अपवाद, अपने हिस्से का खर्च और दावा करने का तरीका देखें।'}[v.type])+' नीचे आसान गाइड पढ़ें।',({health:'Health insurance mein treatment cover, hospital network, waiting period aur claim mein apna hissa dekhein.',term:'Term life mein death benefit, cover period, exclusions aur payment terms dekhein.',motor:'Motor insurance mein cover type, exclusions, apna payable hissa aur claim process dekhein.'}[v.type])+' Neeche aasaan guide padhein.'));
  return result(S('Health cover is for covered medical costs, term life for dependants after death, and motor for vehicle risks. '+(v.type?'Read the cover, exclusions and claim conditions for the type you chose.':'Choose the type you need; the guide below explains the next step.'),'हेल्थ बीमा इलाज के कवर खर्च, टर्म जीवन बीमा मृत्यु के बाद आश्रितों की मदद और मोटर बीमा वाहन के जोखिम के लिए है। '+(v.type?'आपके चुने बीमा में कवर, अपवाद और दावा करने के नियम देखें।':'अपने काम का प्रकार चुनें; नीचे आसान गाइड है।'),'Health cover ilaaj ke covered kharch, term life death ke baad dependants ki madad aur motor vehicle risks ke liye hai. '+(v.type?'Aapke chune cover ki exclusions aur claim rules dekhein.':'Apni zaroorat ka type chunein; neeche aasaan guide hai.')));
 }
 if(p.category==='card'){
  p.completed=true;p.pending=null;
  const ids=v.use==='fuel'||v.use==='travel'?[]:v.fee==='free'||v.use==='amazon'?['amazon']:v.use==='online'?(v.fee==='paid'?['sbi','hdfc']:['sbi','amazon']):['amazon','hdfc'];
  return result(ids.length?S('You can compare these reviewed cards. Check the fee and eligible rewards, and pay the full bill on time; the bank decides approval.','इन रिव्यू किए कार्डों की तुलना कर सकते हैं। फीस और योग्य खरीद पर रिवॉर्ड देखें, पूरा बिल समय पर भरें; मंज़ूरी बैंक तय करता है।','In reviewed cards ko compare kar sakte hain. Fees aur eligible shopping ke rewards dekhein, poora bill time par bharein; approval bank tay karta hai.'):S('For fuel or travel, compare cards built for that use. Our reviewed list does not yet cover that comparison; the guide explains what to check.','पेट्रोल या यात्रा के लिए उसी काम के कार्ड की तुलना करें। अभी हमारी रिव्यू सूची में उसकी पर्याप्त तुलना नहीं है; गाइड में देखने की बातें हैं।','Petrol ya travel ke liye usi kaam ke cards compare karein. Abhi reviewed list mein uski poori comparison nahi hai; guide mein check karne ki baatein hain.'),ids.filter(id=>v.maxFee===undefined||({amazon:0,hdfc:500,sbi:999}[id]??Infinity)<=v.maxFee).map(id=>({...catalog[id]})));
 }
 if(p.category==='savings'){
  p.completed=true;p.pending=null;
  return result(S('For zero minimum balance, compare Kotak811 and SBI BSBD. Kotak811 basic online opening needs ₹2,000 initial funding; SBI BSBD has service limits.','ज़ीरो मिनिमम बैलेंस के लिए Kotak811 और SBI BSBD देख सकते हैं। बेसिक Kotak811 ऑनलाइन खोलने में ₹2,000 शुरुआती रकम चाहिए; SBI BSBD में सेवाओं की सीमाएँ हैं।','Zero minimum balance ke liye Kotak811 aur SBI BSBD dekh sakte hain. Basic Kotak811 online opening mein ₹2,000 initial funding chahiye; SBI BSBD mein service limits hain.'),(v.channel==='branch'?['basic','kotak']:['kotak','basic']).map(id=>({...catalog[id]})));
 }
 if(p.category==='demat'&&!v.use&&!v.zeroBrokerage&&!v.zeroAmc){
  p.completed=true;p.pending=null;
  return result(S('You can read about Angel One and Zerodha below. Compare opening, maintenance and trading charges before applying; low fees do not guarantee returns.','नीचे Angel One और Zerodha देख सकते हैं। खोलने, रखरखाव और ट्रेडिंग का खर्च पढ़कर आगे बढ़ें; कम फीस से मुनाफ़ा पक्का नहीं होता।','Neeche Angel One aur Zerodha dekh sakte hain. Opening, maintenance aur trading charges padhkar aage badhein; kam fees se profit pakka nahi hota.'),['angelone','zerodha'].map(id=>({...catalog[id]})));
 }
 // Keep free-form explanations and other money problems available during an interview.
 const productDetail=p.completed&&/amazon|icici|hdfc|moneyback|sbi|kotak|811|zerodha|groww|flattrade|m[.\s]?stock|shoonya|fee|cost|charge|brokerage|detail|puri|poori|jaankari|जानकारी|विस्तार|फीस|लागत|why|kyu|क्यों/.test(t);
 if(!category&&!changed&&!productDetail&&(/\b(why|explain|meaning|matlab|kyu|kyun|kaise|upi|budget)\b|क्यों|मतलब|समझा|बजट|यूपीआई/.test(t)||p.completed))return null;
 if(p.category==='demat'&&v.use==='trading')return ask('use');
 for(const key of Object.keys(questions[p.category])){
  // A clear zero-balance request already has enough information for the reviewed examples.
  if(p.category==='savings'&&key==='channel'&&v.balance==='zero')continue;
  if(v[key]===undefined){if(p.category==='demat'&&key==='fee')continue;return ask(key);}
 }
 p.pending=null;p.completed=true;
 if(now.toISOString().slice(0,10)>reviewUntil)return result(S('These product details need a fresh review. I can explain comparison criteria, but cannot present old terms as current. Check the official sources before deciding.','इन उत्पादों की जानकारी का नया रिव्यू ज़रूरी है। पुराने नियमों को आज का बताकर तुलना नहीं करूँगी। निर्णय से पहले आधिकारिक नियम देखें।','In products ki details ka fresh review zaroori hai. Purane terms ko aaj ka batakar compare nahi karungi. Decision se pehle official terms dekhiye.'));
 const option=(id,reason,cost,caution)=>({...catalog[id],id,reason,cost,caution});
 let options=[];
 if(p.category==='demat'){
  if(v.use==='fno'||v.use==='intraday'){
   const ids=v.fee==='zero_brokerage'?(v.opening==='free'?['mstock','shoonya']:['flattrade','mstock','shoonya']):['shoonya','flattrade','mstock'];
   options=ids.map(id=>option(id,
    id==='flattrade'?S('Closest reviewed ongoing match for your zero-brokerage segment preference; the one-time opening fee and non-brokerage charges still apply.','शून्य ब्रोकरेज की आपकी सेगमेंट पसंद का सबसे निकट रिव्यू किया चालू विकल्प; एक बार की opening फीस और दूसरे शुल्क फिर भी लगते हैं।','Zero-brokerage segment preference ka closest reviewed ongoing match; one-time opening fee aur doosre charges phir bhi hain.'):
    id==='mstock'?S('Temporary alternative: the advertised first 30 days have zero brokerage subject to offer terms; afterwards brokerage is payable. This does not meet an ongoing-zero requirement.','अस्थायी विकल्प: ऑफ़र शर्तों के अनुसार विज्ञापित पहले 30 दिन शून्य ब्रोकरेज; बाद में ब्रोकरेज देनी है। हमेशा शून्य की शर्त पूरी नहीं होती।','Temporary alternative: offer terms par pehle advertised 30 din zero brokerage; baad mein brokerage deni hai. Ongoing-zero requirement poori nahi hoti.'):
    S('Lower-cost alternative with no listed opening/AMC fee, but F&O brokerage is not zero. Futures and options have different formulas.','खोलने/AMC की सूचीबद्ध फीस बिना कम-लागत विकल्प, लेकिन F&O ब्रोकरेज शून्य नहीं। फ्यूचर्स और ऑप्शंस के नियम अलग हैं।','Opening/AMC fee zero wala low-cost alternative, lekin F&O brokerage zero nahi. Futures aur options ke formulas alag hain.'),catalog[id].details.costs[v.use==='fno'?'options':'intraday'][p.style==='hi'?'hi':'en'],catalog[id].details.costs.other[p.style==='hi'?'hi':'en']));
   return result(S('These examples have different ongoing and introductory charges. Read the segment-specific fees below; zero brokerage does not remove other charges or trading risk.','इन उदाहरणों के चालू और शुरुआती शुल्क अलग हैं। नीचे उसी ट्रेडिंग सेगमेंट की फीस पढ़ें; शून्य ब्रोकरेज से दूसरे शुल्क या जोखिम खत्म नहीं होते।','In examples ke ongoing aur introductory charges alag hain. Neeche usi trading segment ki fees padhein; zero brokerage se doosre charges ya risk khatam nahi hote.'),options);
  }
  const ids=v.zeroBrokerage?['shoonya','zerodha','flattrade']:v.fee==='free'?['shoonya','groww','zerodha']:['zerodha','shoonya','groww'];
  const reasons={
   shoonya:S('Delivery brokerage and listed AMC are both zero, matching the fee preference. DP/depository and statutory charges remain separate.','डिलीवरी ब्रोकरेज और सूचीबद्ध AMC दोनों शून्य हैं, जो फीस की पसंद से मेल खाते हैं। DP/डिपॉज़िटरी और वैधानिक शुल्क अलग हैं।','Delivery brokerage aur listed AMC dono zero hain, jo fee preference se match hai. DP/depository aur statutory charges alag hain.'),
   zerodha:S('A zero delivery-brokerage alternative; check the applicable first-year/BSDA or non-BSDA maintenance charge.','शून्य डिलीवरी ब्रोकरेज का विकल्प; पहले साल/BSDA या गैर-BSDA की लागू मेंटेनेंस फीस देखें।','Zero delivery brokerage ka alternative; applicable first-year/BSDA ya non-BSDA maintenance charge dekhiye.'),
   groww:S('A zero-AMC alternative, but delivery brokerage is payable. It does not meet a zero-delivery-brokerage requirement.','शून्य AMC का विकल्प, लेकिन डिलीवरी ब्रोकरेज देनी है। शून्य डिलीवरी ब्रोकरेज की शर्त पूरी नहीं होती।','Zero-AMC alternative, lekin delivery brokerage deni hai. Zero-delivery-brokerage requirement poori nahi hoti.'),
   flattrade:S('Zero delivery brokerage and AMC, with a one-time opening fee; compare that cost and the other charges.','शून्य डिलीवरी ब्रोकरेज और AMC, लेकिन एक बार opening फीस; उस लागत और दूसरे शुल्क की तुलना करें।','Zero delivery brokerage aur AMC, lekin one-time opening fee; us cost aur doosre charges ko compare karein.')
  };
  options=ids.filter(id=>v.opening!=='free'||catalog[id].details.brokerage.opening===0).map(id=>option(id,reasons[id],catalog[id].details.costs.delivery[p.style==='hi'?'hi':'en'],catalog[id].details.costs.other[p.style==='hi'?'hi':'en']));
  return result(S('These options compare delivery investing costs for your stated preference. Delivery brokerage is separate from F&O pricing; check all charge rows before choosing.','इन विकल्पों में आपकी पसंद के अनुसार डिलीवरी निवेश की लागत की तुलना है। डिलीवरी ब्रोकरेज F&O pricing से अलग है; चुनने से पहले सभी शुल्क देखें।','Ye options aapki preference ke liye delivery investing costs compare karte hain. Delivery brokerage F&O pricing se alag hai; choose karne se pehle sab charge rows dekhiye.'),options);
 }

 return result(S('These reviewed options are worth comparing for your stated preferences. The reasons and drawbacks are below. This is a limited list, not an approval or a whole-market best claim. You can correct any preference or ask about an option.','आपकी बताई पसंद के लिए ये रिव्यू किए विकल्प तुलना लायक हैं। वजह और सीमाएँ नीचे हैं। यह सीमित सूची है, मंज़ूरी या पूरे बाज़ार में सबसे अच्छे होने का दावा नहीं। अपनी पसंद बदल सकते हैं या किसी विकल्प पर सवाल पूछ सकते हैं।','Aapki batayi preferences ke liye ye reviewed options compare karne layak hain. Wajah aur limitations neeche hain. List limited hai; approval ya poore market mein best hone ka claim nahi. Aap preference badal sakte hain ya kisi option par sawal pooch sakte hain.'),options);
}
export function advisorContext(profile){
 if(!profile?.category)return '';
 return 'Earlier preferences in this chat (user-provided, not verified eligibility): '+JSON.stringify({category:profile.category,...profile.values}).slice(0,450);
}
