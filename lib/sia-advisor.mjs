// Reviewed information, not eligibility decisions or affiliate offers.
// The profile stays in component memory. Nothing here uses a network or storage.
import {validateQuestion} from '../supabase/functions/_shared/conversation.mjs';
import {catalog,reviewedOn,reviewUntil,mentionedProductIds} from '../supabase/functions/_shared/reviewed-products.mjs';
import {compareAprQuotes} from '../supabase/functions/_shared/quote-comparison.mjs';
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
 if(/\bloan\b|लोन|ऋण/.test(t))return 'loan';
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
  if(pending==='fee'&&money(t)>0){v.fee='paid';v.maxFee=money(t);}
  const negative=/nahi|nhi|nahin|नहीं|\bno\b|cannot|can't|minimum|मिनिमम/.test(t);
  if(/full|poora|pura|पूरा|पूरी|entire/.test(t)&&/bill|बिल|repay|payment|pay|chuka|bhar|चुका|भर/.test(t))v.repay=negative?'no':'yes';
  else if(pending==='repay'&&/^(?:yes|haan|han|ha|हाँ|हां|bilkul|बिल्कुल)\b|^हाँ|^हां/.test(t))v.repay='yes';
  else if(pending==='repay'&&negative)v.repay='no';
 }
 if(p.category==='savings'){
  if(/zero|no minimum|without minimum|0\s*balance|शून्य|जीरो|बैलेंस.{0,10}नहीं/.test(t)||pending==='balance'&&/^0\b/.test(t))v.balance='zero';
  else if(/(?:maintain|balance|बैलेंस).{0,20}(?:okay|ok|rakh|रख|ठीक)/.test(t)||pending==='balance'&&money(t)>0)v.balance='maintain';
  if(/branch|cash|शाखा|नकद|ब्रांच/.test(t))v.channel='branch';
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
  if(/home|house|घर/.test(t))v.purpose='home';else if(/education|study|पढ़ाई|शिक्षा/.test(t))v.purpose='education';else if(/personal|medical|wedding|पर्सनल|इलाज/.test(t))v.purpose='personal';else if(/car|bike|vehicle|गाड़ी|बाइक/.test(t))v.purpose='vehicle';
  if(pending==='amount'||/amount|रकम|राशि/.test(t)){const n=money(t);if(n>0)v.amount=n;}
  if(pending==='budget'||/emi.{0,15}(?:budget|afford)|किस्त.{0,15}बजट/.test(t)){const n=money(t);if(n>0)v.budget=n;}
 }
 if(p.category==='insurance'){
  if(/health|medical|स्वास्थ्य|हेल्थ/.test(t))v.type='health';else if(/term|life|टर्म|जीवन/.test(t))v.type='term';else if(/car|bike|motor|vehicle|गाड़ी|मोटर/.test(t))v.type='motor';
  if(/family|parents|परिवार|माता|पिता/.test(t))v.cover='family';else if(/myself|self|sirf me|sirf mere|khud|खुद|सिर्फ़ मेरे/.test(t))v.cover='self';
  if(pending==='priority'&&t.length>5)v.priority=q.trim();
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
 if(named.length===1&&/puri|poori|full|detail|fees?|charges?|जानकारी|विस्तार/i.test(t)&&!/\b(?:best|better|which|compare|comparison|vs|kaunsa)\b|तुलना|बेहतर/.test(t)){
  const product=catalog[named[0]],style=languageFor(question,previous?.style,language),S=(en,hi,roman)=>style==='hi'?hi:style==='roman'?roman:en;
  const same=previous&&({card:'credit_card',savings:'savings_account',demat:'demat'}[previous.category]===product.category);
  return {answer:S('Here are the reviewed details of the exact product you asked about, including charges, restrictions and application steps.','आपने जिस उत्पाद के बारे में पूछा है उसकी रिव्यू की हुई फीस, सीमाएँ और आवेदन का तरीका नीचे है।','Aapne jis exact product ke baare mein poochha, uski reviewed fees, limitations aur opening steps neeche hain.'),options:[{...product,reason:S('Product information you requested; this does not assess approval or suitability.','आपके पूछे उत्पाद की जानकारी; मंज़ूरी या उपयुक्तता की जाँच नहीं।','Aapke poochhe product ki information; approval ya suitability assessment nahi.')}],profile:same?previous:{category:{credit_card:'card',savings_account:'savings',demat:'demat'}[product.category],values:{},completed:true,style},expanded:true,reviewedOn,reviewUntil};
 }
 const quotes=compareAprQuotes(question,language);
 if(quotes)return {...quotes,options:[],profile:{category:'loan',values:previous?.category==='loan'?previous.values:{},completed:true,pending:null},reviewedOn,reviewUntil};
 // Let the grounded AI compare actual quotes rather than repeating a completed interview.
 if(/\b(?:compare|comparison|vs|versus|difference|farq)\b|तुलना|फ़र्क|फर्क/.test(t)&&/apr|quote|premium|rate|policy|amazon|sbi|hdfc|kotak|zerodha|groww|प्रीमियम|दर|पॉलिसी/.test(t))return null;
 if(/start over|new chat|reset|नई शुरुआत|फिर से शुरू/.test(t))return {profile:null,answer:language==='hi'?'ठीक है, नई शुरुआत करते हैं। किस बात में मदद चाहिए?':'Okay, let’s start again. What do you need help with?',options:[]};
 if(/fraud|scam|stolen|lost|pending|deduct|declined|reject|complaint|minimum due|धोखा|चोरी|शिकायत|अटक/.test(t))return null;
 if(!category&&!previous?.category)return null;
 const p=category&&category!==previous?.category?{category,values:{},pending:null}:previous?{...previous,values:{...previous.values}}:{category,values:{},pending:null};
 p.style=languageFor(question,p.style,language);
 const S=(en,hi,roman)=>p.style==='hi'?hi:p.style==='roman'?roman:en;
 p.values=fieldsFrom(question,p);const v=p.values;
 const result=(answer,options=[])=>({answer,options,profile:p,reviewedOn,reviewUntil,expanded:/puri|poori|full|detail|विस्तार|पूरी जानकारी/i.test(question)});
 const ask=key=>{p.pending=key;const q=questions[p.category][key];return result((v.income!==undefined&&category==='card'?S(`You mentioned monthly income of ₹${v.income.toLocaleString('en-IN')}. Income alone does not establish approval. `,`आपने मासिक आय ₹${v.income.toLocaleString('en-IN')} बताई है। सिर्फ़ आय से मंज़ूरी तय नहीं होती। `,`Aapne monthly income ₹${v.income.toLocaleString('en-IN')} batayi hai. Sirf income se approval tay nahi hota. `):'')+S(...q));};
 if(p.category==='card'&&(v.income===0||v.repay==='no')){
  if(previous?.pending==='budgetHelp')return null;
  p.pending='budgetHelp';return result(S('Before comparing reward cards, first check how you would repay the full bill. Interest and fees can outweigh rewards. Would you like help reviewing your monthly budget?','रिवॉर्ड कार्ड की तुलना से पहले पूरे बिल की अदायगी समझना ज़रूरी है। ब्याज और फीस फ़ायदों से ज़्यादा पड़ सकते हैं। क्या महीने का बजट समझने में मदद चाहिए?','Reward cards compare karne se pehle poore bill ki repayment samajhna zaroori hai. Interest aur fees faydon se zyada ho sakti hain. Kya monthly budget samajhne mein madad chahiye?'));
 }
 const changed=Object.keys(v).some(k=>v[k]!==previous?.values?.[k]);
 // Keep free-form explanations and other money problems available during an interview.
 const productDetail=p.completed&&/amazon|icici|hdfc|moneyback|sbi|kotak|811|zerodha|groww|flattrade|m[.\s]?stock|shoonya|fee|cost|charge|brokerage|detail|puri|poori|jaankari|जानकारी|विस्तार|फीस|लागत|why|kyu|क्यों/.test(t);
 if(!category&&!changed&&!productDetail&&(/\b(why|explain|meaning|matlab|kyu|kyun|kaise|upi|budget)\b|क्यों|मतलब|समझा|बजट|यूपीआई/.test(t)||p.completed))return null;
 if(p.category==='demat'&&v.use==='trading')return ask('use');
 for(const key of Object.keys(questions[p.category]))if(v[key]===undefined)return ask(key);
 p.pending=null;p.completed=true;
 if(now.toISOString().slice(0,10)>reviewUntil)return result(S('These product details need a fresh review. I can explain comparison criteria, but cannot present old terms as current. Check the official sources before deciding.','इन उत्पादों की जानकारी का नया रिव्यू ज़रूरी है। पुराने नियमों को आज का बताकर तुलना नहीं करूँगी। निर्णय से पहले आधिकारिक नियम देखें।','In products ki details ka fresh review zaroori hai. Purane terms ko aaj ka batakar compare nahi karungi. Decision se pehle official terms dekhiye.'));
 const option=(id,reason,cost,caution)=>({...catalog[id],id,reason,cost,caution});
 let options=[];
 if(p.category==='card'){
  if(v.use==='fuel'||v.use==='travel')return result(S('Your priority is clear. The reviewed card list does not yet contain a dedicated fuel/travel comparison, so I will not label a shopping card best for you. Share the names of two cards you are considering; their official fees and reward restrictions need checking.','आपकी प्राथमिकता समझ आई। अभी रिव्यू की हुई सूची में पेट्रोल/यात्रा कार्डों की पर्याप्त तुलना नहीं है, इसलिए शॉपिंग कार्ड को आपके लिए सबसे अच्छा नहीं बताऊँगी। जिन दो कार्डों को देख रहे हैं उनके नाम बताइए; आधिकारिक फीस और रिवॉर्ड की शर्तें जाँचना ज़रूरी है।','Aapki priority samajh aayi. Reviewed list mein abhi dedicated fuel/travel cards ki poori comparison nahi hai; shopping card ko aapke liye best nahi bolungi. Jin do cards ko dekh rahe hain unke naam batayein; official fees aur reward restrictions check karna zaroori hai.'));
  if(v.use==='amazon'||v.fee==='free')options.push(option('amazon',v.use==='amazon'?S('Your main use is Amazon shopping, so its Amazon rewards and zero membership fee are relevant.','आपका मुख्य इस्तेमाल Amazon खरीदारी है, इसलिए इसके Amazon रिवॉर्ड और शून्य मेंबरशिप फीस प्रासंगिक हैं।','Aapka main use Amazon shopping hai, isliye iske Amazon rewards aur zero membership fee relevant hain.'):S('Its zero membership fee matches your fee preference. Its main rewards focus is Amazon; compare the benefit on your actual purchases before choosing it.','शून्य मेंबरशिप फीस आपकी फीस की पसंद से मेल खाती है। मुख्य रिवॉर्ड Amazon पर हैं; चुनने से पहले अपनी वास्तविक खरीदारी का फ़ायदा देखें।','Zero membership fee aapki fee preference se match hai. Main rewards Amazon par hain; choose karne se pehle apni actual shopping ka fayda dekhiye.'),S('Joining ₹0; annual ₹0.','जॉइनिंग ₹0; सालाना ₹0।','Joining ₹0; annual ₹0.'),S('Invite-only. Amazon rewards depend on Prime status and eligible purchases; rewards are not cash in your bank. Issuer approval required.','यह आमंत्रण आधारित है। Amazon रिवॉर्ड Prime और योग्य खरीदारी पर निर्भर हैं; ये बैंक में नकद नहीं हैं। बैंक की मंज़ूरी ज़रूरी है।','Invite-only hai. Amazon rewards Prime status aur eligible purchases par depend hain; bank cash nahi hain. Issuer approval zaroori hai.')));
  if(v.fee==='paid'){
   if(v.use==='online')options.push(option('sbi',S('Online cashback is relevant to your main use; compare its net benefit after the annual fee.','आपके ऑनलाइन इस्तेमाल के लिए कैशबैक प्रासंगिक है; सालाना फीस घटाकर फ़ायदा देखें।','Aapke online use ke liye cashback relevant hai; annual fee ghata kar fayda dekhiye.'),'₹999 + '+S('taxes joining and renewal.','टैक्स जॉइनिंग और रिन्यूअल।','taxes joining aur renewal.'),S('Cashback caps and excluded transactions apply. Do not spend more just to waive a fee; eligibility is not assessed here.','कैशबैक की सीमा और बाहर रखे लेनदेन लागू हैं। फीस माफ़ करवाने के लिए अतिरिक्त खर्च न करें; यहाँ पात्रता नहीं जाँची गई है।','Cashback caps aur excluded transactions hain. Fee waiver ke liye extra kharch mat karein; yahan eligibility assess nahi hui.')));
   options.push(option('hdfc',S('An alternative for everyday/selected merchant spending with a lower listed membership fee than the SBI option.','रोज़मर्रा/चुनिंदा दुकानों के खर्च का विकल्प; सूची में SBI विकल्प से कम मेंबरशिप फीस।','Everyday/selected merchant spends ka alternative; listed SBI option se membership fee kam hai.'),'₹500 + '+S('taxes joining and renewal.','टैक्स जॉइनिंग और रिन्यूअल।','taxes joining aur renewal.'),S('Rewards are CashPoints, with redemption rules and merchant exclusions. Check eligible merchants, fees and issuer criteria.','रिवॉर्ड CashPoints हैं; रिडेम्पशन के नियम और मर्चेंट की शर्तें हैं। योग्य मर्चेंट, फीस और बैंक के नियम देखें।','Rewards CashPoints hain; redemption rules aur merchant restrictions hain. Eligible merchants, fees aur issuer criteria dekhiye.')));
  }
  if(v.maxFee!==undefined)options=options.filter(o=>o.fee<=v.maxFee);
  if(!options.length)return result(S('None of the reviewed cards matches that fee limit and use closely enough. I need more reviewed options before suggesting a match. You can share a card name to check its official terms.','आपकी फीस सीमा और इस्तेमाल से अभी रिव्यू किए कार्ड पर्याप्त मेल नहीं खाते। सही विकल्प बताने के लिए और रिव्यू चाहिए। किसी कार्ड का नाम बताएँ तो उसके आधिकारिक नियम देख सकते हैं।','Aapki fee limit aur use se reviewed cards abhi kaafi match nahi karte. Match suggest karne ke liye aur reviewed options chahiye. Aap kisi card ka naam batakar official terms check kar sakte hain.'));
 }
 if(p.category==='savings'){
  const digital=option('kotak',S('Worth comparing for app/UPI use without a minimum balance requirement.','ऐप/UPI इस्तेमाल और न्यूनतम बैलेंस न रखने की पसंद के लिए तुलना लायक।','App/UPI use aur minimum balance na rakhne ki preference ke liye compare karne layak.'),S('Minimum balance ₹0; basic online opening currently requires ₹2,000 initial funding, usable after opening.','न्यूनतम बैलेंस ₹0; बेसिक ऑनलाइन खोलने पर अभी ₹2,000 शुरुआती फंडिंग, जो खाते में आपकी रकम है।','Minimum balance ₹0; basic online opening par abhi ₹2,000 initial funding, jo account mein aapki rakam hai.'),S('Physical debit card and some services have charges. Full KYC and bank terms apply; Super is a different variant.','फिजिकल डेबिट कार्ड और कुछ सेवाओं पर शुल्क है। पूरी KYC और बैंक के नियम लागू हैं; Super अलग वेरिएंट है।','Physical debit card aur kuch services par charges hain. Full KYC aur bank terms apply; Super alag variant hai.'));
  const basic=option('basic',S('A basic zero-balance alternative to review if branch access matters to you.','शाखा की सुविधा ज़रूरी हो तो देखने योग्य बेसिक ज़ीरो बैलेंस विकल्प।','Branch access zaroori ho to review karne layak basic zero-balance alternative.'),S('Minimum balance ₹0; basic services under the account terms.','न्यूनतम बैलेंस ₹0; खाते के नियमों के अनुसार बुनियादी सेवाएँ।','Minimum balance ₹0; account terms ke mutabik basic services.'),S('Basic-account cash withdrawal/service restrictions apply. You cannot hold another savings account at the same bank alongside BSBDA; check the official rules and local branch.','बेसिक खाते में नकद निकासी/सेवाओं की सीमाएँ हैं। BSBDA के साथ उसी बैंक में दूसरा बचत खाता नहीं रख सकते; आधिकारिक नियम और स्थानीय शाखा देखें।','Basic account mein cash withdrawal/service restrictions hain. BSBDA ke saath usi bank mein doosra savings account nahi rakh sakte; official rules aur local branch check karein.'));
  options=v.channel==='digital'?[digital,basic]:[basic,digital];
 }
 if(p.category==='demat'){
  if(v.use==='fno'||v.use==='intraday'){
   const ids=v.fee==='zero_brokerage'?(v.opening==='free'?['mstock','shoonya']:['flattrade','mstock','shoonya']):['shoonya','flattrade','mstock'];
   options=ids.map(id=>option(id,
    id==='flattrade'?S('Closest reviewed ongoing match for your zero-brokerage segment preference; the one-time opening fee and non-brokerage charges still apply.','शून्य ब्रोकरेज की आपकी सेगमेंट पसंद का सबसे निकट रिव्यू किया चालू विकल्प; एक बार की opening फीस और दूसरे शुल्क फिर भी लगते हैं।','Zero-brokerage segment preference ka closest reviewed ongoing match; one-time opening fee aur doosre charges phir bhi hain.'):
    id==='mstock'?S('Temporary alternative: the advertised first 30 days have zero brokerage subject to offer terms; afterwards brokerage is payable. This does not meet an ongoing-zero requirement.','अस्थायी विकल्प: ऑफ़र शर्तों के अनुसार विज्ञापित पहले 30 दिन शून्य ब्रोकरेज; बाद में ब्रोकरेज देनी है। हमेशा शून्य की शर्त पूरी नहीं होती।','Temporary alternative: offer terms par pehle advertised 30 din zero brokerage; baad mein brokerage deni hai. Ongoing-zero requirement poori nahi hoti.'):
    S('Lower-cost alternative with no listed opening/AMC fee, but F&O brokerage is not zero. Futures and options have different formulas.','खोलने/AMC की सूचीबद्ध फीस बिना कम-लागत विकल्प, लेकिन F&O ब्रोकरेज शून्य नहीं। फ्यूचर्स और ऑप्शंस के नियम अलग हैं।','Opening/AMC fee zero wala low-cost alternative, lekin F&O brokerage zero nahi. Futures aur options ke formulas alag hain.'),catalog[id].details.costs[v.use==='fno'?'options':'intraday'][p.style==='hi'?'hi':'en'],catalog[id].details.costs.other[p.style==='hi'?'hi':'en']));
   return result(options[0].name+' — '+options[0].reason+'\n\n'+S((v.opening==='free'?'No reviewed ongoing option here meets both zero opening fee and zero F&O brokerage. ':'')+'I matched the trading segment you asked for, not delivery brokerage. The ongoing, temporary and paid alternatives are separated below. Zero brokerage does not remove taxes or other trading charges.',(v.opening==='free'?'यहाँ रिव्यू किए चालू विकल्पों में opening फीस और F&O ब्रोकरेज दोनों शून्य वाला मेल नहीं है। ':'')+'आपके पूछे ट्रेडिंग सेगमेंट का मिलान किया है, डिलीवरी ब्रोकरेज का नहीं। नीचे चालू, अस्थायी और भुगतान वाले विकल्प अलग हैं। शून्य ब्रोकरेज से टैक्स या दूसरे ट्रेडिंग शुल्क खत्म नहीं होते।',(v.opening==='free'?'Reviewed ongoing options mein opening fee aur F&O brokerage dono zero ka match nahi mila. ':'')+'Aapke poochhe trading segment ka match kiya hai, delivery brokerage ka nahi. Neeche ongoing, temporary aur paid alternatives alag hain. Zero brokerage se taxes ya doosre trading charges khatam nahi hote.'),options);
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
 if(p.category==='loan'||p.category==='insurance')return result(p.category==='loan'?S(`You need about ₹${v.amount.toLocaleString('en-IN')} and mentioned ₹${v.budget.toLocaleString('en-IN')} as a monthly repayment budget. Next compare actual lender quotes: APR, tenure, processing fee, total repayment and prepayment terms. I do not yet have reviewed live loan quotes, so cannot name a cheapest/best lender. Which two lenders or quotes are you considering? Share terms only, no documents or identifiers.`,`आपने लगभग ₹${v.amount.toLocaleString('en-IN')} लोन और ₹${v.budget.toLocaleString('en-IN')} मासिक किस्त का बजट बताया है। अब वास्तविक कोट में APR, अवधि, प्रोसेसिंग फीस, कुल अदायगी और प्रीपेमेंट नियम की तुलना चाहिए। मेरे पास अभी रिव्यू किए लाइव लोन कोट नहीं हैं, इसलिए सबसे सस्ता/बेहतर बैंक नहीं बता सकती। किन दो बैंकों या कोट को देख रहे हैं? सिर्फ़ नियम बताइए, दस्तावेज़ या पहचान की जानकारी नहीं।`,`Aapne lagbhag ₹${v.amount.toLocaleString('en-IN')} loan aur ₹${v.budget.toLocaleString('en-IN')} monthly kist ka budget bataya hai. Actual quotes mein APR, tenure, processing fee, total repayment aur prepayment terms compare honge. Abhi reviewed live quotes nahi hain, isliye cheapest/best lender nahi bol sakti. Kin do lenders ya quotes ko dekh rahe hain? Sirf terms batayein, documents ya identifiers nahi.`):S('Your cover and priority are noted. Compare actual policy wording: cover, exclusions, waiting periods, co-pay/deductible, renewal terms and premium. I do not yet have reviewed policy quotes, so cannot label a plan best. Which two policies are you considering? Share plan names and public terms, without medical records or identifiers.','कवर और प्राथमिकता समझ आई। वास्तविक पॉलिसी में कवर, अपवाद, वेटिंग पीरियड, को-पे/डिडक्टिबल, रिन्यूअल और प्रीमियम देखें। अभी मेरे पास रिव्यू किए पॉलिसी कोट नहीं हैं, इसलिए किसी प्लान को सबसे अच्छा नहीं बताऊँगी। किन दो पॉलिसी को देख रहे हैं? नाम और सार्वजनिक नियम बताइए, मेडिकल रिपोर्ट या पहचान नहीं।','Cover aur priority samajh aayi. Actual policy mein cover, exclusions, waiting period, co-pay/deductible, renewal aur premium compare honge. Abhi reviewed policy quotes nahi hain, isliye kisi plan ko best nahi bolungi. Kin do policies ko dekh rahe hain? Plan names aur public terms batayein, medical records ya identifiers nahi.'));
 return result(S('These reviewed options are worth comparing for your stated preferences. The reasons and drawbacks are below. This is a limited list, not an approval or a whole-market best claim. You can correct any preference or ask about an option.','आपकी बताई पसंद के लिए ये रिव्यू किए विकल्प तुलना लायक हैं। वजह और सीमाएँ नीचे हैं। यह सीमित सूची है, मंज़ूरी या पूरे बाज़ार में सबसे अच्छे होने का दावा नहीं। अपनी पसंद बदल सकते हैं या किसी विकल्प पर सवाल पूछ सकते हैं।','Aapki batayi preferences ke liye ye reviewed options compare karne layak hain. Wajah aur limitations neeche hain. List limited hai; approval ya poore market mein best hone ka claim nahi. Aap preference badal sakte hain ya kisi option par sawal pooch sakte hain.'),options);
}
export function advisorContext(profile){
 if(!profile?.category)return '';
 return 'Earlier preferences in this chat (user-provided, not verified eligibility): '+JSON.stringify({category:profile.category,...profile.values}).slice(0,450);
}
