// Reviewed information, not eligibility decisions or affiliate offers.
// The profile stays in component memory. Nothing here uses a network or storage.
import {validateQuestion,replyStyle} from './conversation.mjs';
import {catalog,reviewedOn,reviewUntil,mentionedProductIds} from './reviewed-products.mjs';
import {compareAprQuotes} from './quote-comparison.mjs';
import {serviceGuideFor} from './service-guides.mjs';
import {loanComparisons} from './finance-sources.mjs';
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
 const spoken={एक:1,दो:2,तीन:3,चार:4,पांच:5,पाँच:5,छह:6,सात:7,आठ:8,नौ:9,दस:10,ग्यारह:11,बारह:12,पंद्रह:15,पन्द्रह:15,बीस:20,पचास:50,डेढ़:1.5,ढाई:2.5,ek:1,do:2,teen:3,char:4,paanch:5,panch:5,das:10,bees:20,one:1,two:2,three:3,four:4,five:5,ten:10,twenty:20};
 const words=t.match(new RegExp('('+Object.keys(spoken).join('|')+')\\s+(lakh|lac|लाख|crore|करोड़|thousand|hazar|hazaar|हजार|हज़ार)(?=\\s|$|[.,।])','i'));
 if(words)t=t.replace(words[0],String(spoken[words[1].toLowerCase()])+' '+words[2]);
 const m=t.match(/(?:₹|rs\.?\s*|rupees?\s*)?(\d[\d,]*(?:\.\d+)?)\s*(k\b|thousand|hazar|hazaar|हजार|हज़ार|lakh|lac|लाख|crore|करोड़)?/i);
 if(!m)return undefined;const amount=Number(m[1].replaceAll(',',''))*(/crore|करोड़/.test(m[2]||'')?10000000:/lakh|lac|लाख/.test(m[2]||'')?100000:/k|thousand|hazar|hazaar|हजार|हज़ार/.test(m[2]||'')?1000:1);
 return Number.isFinite(amount)&&amount>=0&&amount<=100000000?amount:undefined;
}
function languageFor(q,previous,language){return replyStyle(q,previous||language);}
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
  if(/\bit\s*services?\b|software|web\s*develop|आईटी|सॉफ्टवेयर/.test(t))v.businessSector='it_services';
  else if(/kirana|retail|shop|dukaan|dukan|किराना|दुकान/.test(t))v.businessSector='retail';
  else if(/manufactur|factory|फैक्ट्री|निर्माण/.test(t))v.businessSector='manufacturing';
  else if(/services?\s*(?:deta|deti|business)|सेवाएं|सेवाएँ/.test(t))v.businessSector='services';
  if(v.businessSector)v.purpose='business';
  if(/business|biznes|bijnes|बिजनेस|बिज़नेस|बिज़नेस|व्यापार|कारोबार/.test(t))v.purpose='business';else if(/home|house|घर/.test(t))v.purpose='home';else if(/education|study|पढ़ाई|शिक्षा/.test(t))v.purpose='education';else if(/personal|medical|wedding|पर्सनल|इलाज/.test(t))v.purpose='personal';else if(/car|bike|vehicle|गाड़ी|बाइक/.test(t))v.purpose='vehicle';
  if(/new business|startup|naya|nayi|नया|नई|अभी शुरू|शुरू करना|shuru\s*kar|start(?:ing)?\s+(?:a\s+)?(?:new\s+)?business/.test(t))v.businessYears=0;
  if(/(?:turnover|sales|टर्नओवर|बिक्री).{0,20}(?:nahi|nhi|नहीं|zero|\b0\b)|no\s+(?:existing\s+)?turnover/.test(t))v.hasTurnover=false;
  if(/(?:assets?|collateral|security|संपत्ति|जमानत).{0,20}(?:nahi|nhi|नहीं)|no\s+(?:assets?|collateral)/.test(t))v.hasCollateral=false;
  const age=t.match(/(\d+)\s*(?:years?|saal|साल|वर्ष)/i);if(age&&(pending==='businessAge'||/business|बिजनेस|कारोबार/.test(t)))v.businessYears=Number(age[1]);
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
export function rememberAdvisorProfile(question,previous=null,language='hi'){
 validateQuestion(question);
 if(/^(?:start over|new chat|reset|नई शुरुआत|फिर से शुरू)[.! ]*$/i.test(question.trim()))return null;
 const category=intentOf(question),p=category&&category!==previous?.category?{category,values:{},pending:null}:previous?{...previous,values:{...previous.values}}:category?{category,values:{},pending:null}:null;
 if(!p)return null;p.style=languageFor(question,p.style,language);p.values=fieldsFrom(question,p);return p;
}
export function profileFromConversation(history=[],language='hi',now=new Date()){
 let profile=null;
 for(const message of history){
  if(message.role!=='user')continue;
  // This summary is unverified user data, never an authorization or bank decision.
  if(message.content.startsWith('Earlier preferences in this chat (user-provided, not verified eligibility): ')){
   try{const item=JSON.parse(message.content.slice(message.content.indexOf('{'))),category=item.category;if(!['loan','card','savings','demat','insurance'].includes(category))continue;
    const values={};for(const [key,value]of Object.entries(item)){
     if(['amount','income','budget','maxFee'].includes(key)&&Number.isFinite(value)&&value>=0&&value<=100000000)values[key]=value;
     if(key==='businessYears'&&Number.isFinite(value)&&value>=0&&value<150)values[key]=value;
     if(key==='purpose'&&['business','personal','home','vehicle','education'].includes(value))values[key]=value;
     if(key==='businessSector'&&['it_services','retail','manufacturing','services'].includes(value))values[key]=value;
     if(['hasTurnover','hasCollateral'].includes(key)&&typeof value==='boolean')values[key]=value;
     if(['use','fee','repay','balance','channel','type','cover','opening','issue','accountUse'].includes(key)&&typeof value==='string'&&/^[a-z_]{1,30}$/.test(value))values[key]=value;
    }profile={category,values,pending:null,style:language};continue;
   }catch{continue;}
  }
  try{const guided=advisorReply(message.content,profile,language,now);profile=guided?.profile??rememberAdvisorProfile(message.content,profile,language);}catch{}
 }
 return profile;
}
function everydayHelp(question,previous,language,now){
 const t=normal(question),account=/\ba?ccount\b|bank\s*(?:a?ccount|ac)|saving|सेविंग|बचत|बैंक\s*(?:का\s*)?खाता/.test(t),loan=/loan|लोन|ऋण/.test(t),demat=/demat|डीमैट|डीमेट/.test(t),card=/credit\s*card|क्रेडिट\s*कार्ड/.test(t);
 const category=demat?'demat':card?'card':loan?'loan':account?'savings':previous?.category;
 const style=languageFor(question,previous?.style,language),S=(en,hi,roman)=>style==='hi'?hi:style==='roman'?roman:en;
 const p=category?{...(category===previous?.category?previous:{}),category,style,values:{...(category===previous?.category?previous?.values:{})},pending:null}:null;
 if(p)p.values=fieldsFrom(question,p);
 const reply=(answer,issue)=>({answer,profile:{...p,values:{...p.values,issue}},options:[],links:[{title:language==='hi'?'आसान भाषा में पूरी जानकारी':'Read the simple guide',url:(language==='hi'?'/hi':'')+'/guides/'+serviceGuideFor(p)+'/'}],reviewedOn,reviewUntil});
 if(p&&/kyc|केवाईसी|वीडियो\s*(?:कॉल|वेरि)|video\s*(?:call|verif)/.test(t)&&/fail|error|reject|problem|nahi|nhi|नहीं|दिक्कत|रुक|अटक/.test(t))return reply(S('Use the provider’s official app, website or branch help for this verification issue. Where does it stop: mobile verification, the video call or after submission? Share only the error wording, not documents or personal details.','इस जाँच की दिक्कत में प्रदाता के आधिकारिक ऐप, वेबसाइट या शाखा की मदद लें। किस चरण पर रुकता है—मोबाइल सत्यापन, वीडियो कॉल या सबमिट करने के बाद? केवल error का संदेश बताएँ, निजी जानकारी या दस्तावेज़ नहीं।','Is verification problem mein provider ke official app, website ya branch ki help lein. Kis step par rukta hai—mobile verification, video call ya submit karne ke baad? Sirf error ka message batayein, personal details ya documents nahi.'),'verification');
 if(p?.category==='savings'&&/open|opening|deposit|funding|जमा|खोल/.test(t)&&/zero|minimum|balance|जीरो|मिनिमम|बैलेंस/.test(t)&&/paise|money|deposit|fund|रकम|पैसे|जमा/.test(t))return reply(S('Money required at opening and the balance you must maintain are different conditions. Zero minimum balance does not mean every service is free. Which bank and account variant asked for the money?','खोलते समय जमा रकम और बाद में बनाए रखने वाला न्यूनतम बैलेंस अलग शर्तें हैं। जीरो बैलेंस का मतलब हर सेवा मुफ्त नहीं। किस बैंक और खाते के वेरिएंट में रकम माँगी गई?','Opening par jama rakam aur baad mein maintain karne wala minimum balance alag conditions hain. Zero balance ka matlab har service free nahi. Kis bank aur account variant mein paise maange gaye?'),'opening_funding');
 if(p?.category==='savings'&&/charge|penalty|deduct|कटा|कटे|चार्ज|शुल्क/.test(t)&&/balance|minimum|बैलेंस|मिनिमम/.test(t))return reply(S('Check the account variant and the charge description in the statement, then ask official bank support which published rule caused it. Which bank and account type is this? Do not send account numbers or statements.','स्टेटमेंट में शुल्क का नाम और खाते का वेरिएंट देखें, फिर बैंक से उसका प्रकाशित नियम पूछें। कौन-सा बैंक और किस प्रकार का खाता है? खाता नंबर या स्टेटमेंट न भेजें।','Statement mein charge ka naam aur account variant dekhein, phir bank se uska published rule poochhein. Kaunsa bank aur kis type ka account hai? Account number ya statement mat bhejein.'),'balance_charge');
 if(p?.category==='loan'&&/reject|declin|refus|मना|रिजेक्ट|नामंज़ूर/.test(t))return reply(S('Start with the lender’s stated reason so we can separate a mismatch in the scheme from missing information or a credit-profile issue. What reason did the bank give? Do not share identity or account details.','पहले बैंक का बताया कारण समझें—योजना की शर्त, अधूरी जानकारी या क्रेडिट-प्रोफाइल की दिक्कत अलग रास्ते माँगती हैं। बैंक ने क्या कारण बताया? पहचान या खाते की निजी जानकारी न भेजें।','Pehle bank ka bataya reason samjhein—scheme ki condition, missing information ya credit-profile ki problem ke raste alag hain. Bank ne kya reason bataya? Identity ya account ki personal details mat bhejein.'),'loan_refusal');
 if(p?.category==='loan'&&/itr|salary\s*slip|income\s*proof|आय\s*प्रमाण|सैलरी\s*स्लिप/.test(t)&&/nahi|nhi|no\b|without|नहीं|बिना/.test(t))return reply(S('The lender decides which genuine records it accepts for your work and loan type. Do not select an inaccurate job category or use false documents. Ask its official branch about acceptable alternatives for your actual situation; requirements vary by scheme.','आपके वास्तविक काम और लोन की योजना के लिए कौन-से सही रिकॉर्ड स्वीकार होंगे, बैंक तय करता है। गलत नौकरी की श्रेणी या झूठे दस्तावेज़ न चुनें। आधिकारिक शाखा से अपनी स्थिति के स्वीकार्य विकल्प पूछें; हर योजना की शर्त अलग हो सकती है।','Aapke actual kaam aur loan scheme ke liye kaunse genuine records accepted hain, bank tay karta hai. Galat job category ya false documents mat chunein. Official branch se apni situation ke accepted alternatives poochhein; scheme ki conditions alag ho sakti hain.'),'income_records');
 if(account&&/open|khol|खोल/.test(t)&&!/sav|saving|सेविंग|बचत|zero|जीरो/.test(t))return reply(S('What will you mainly use the account for: personal payments, receiving salary or business transactions? That helps compare the right account and its balance/charge conditions.','खाता मुख्यतः किस काम के लिए चाहिए—निजी भुगतान, सैलरी लेने या कारोबार के लेन-देन के लिए? उसी हिसाब से सही खाते और बैलेंस/शुल्क की तुलना करेंगे।','Account mainly kis kaam ke liye chahiye—personal payments, salary lene ya business transactions? Usi hisaab se account aur balance/charges compare karenge.'),'account_use');
 if(previous?.values?.issue==='account_use'){
  if(previous.values.accountUse==='business'&&/cash|branch|digital|upi|नकद|ब्रांच|डिजिटल/.test(t)){p.values.channel=/cash|branch|नकद|ब्रांच/.test(t)?'branch':'digital';return reply(S('For these business payments, compare the current-account balance rule and the relevant cash or digital-payment charges. We need the exact bank/variant terms for a cost comparison. Which bank or account are you considering?','इन कारोबारी भुगतानों में करंट खाते का बैलेंस नियम और संबंधित नकद/डिजिटल भुगतान शुल्क देखें। लागत की तुलना के लिए बैंक और वेरिएंट के सही नियम चाहिए। कौन-सा बैंक या खाता देख रहे हैं?','In business payments ke liye current-account balance rule aur relevant cash/digital-payment charges dekhein. Cost comparison ke liye exact bank/variant terms chahiye. Kaunsa bank ya account dekh rahe hain?'),'current_account_terms');}
  if(/business|बिजनेस|कारोबार/.test(t)){p.values.accountUse='business';return reply(S('For business transactions, compare the bank’s business/current-account terms, balance rule and cash/branch charges. We do not have reviewed current-account prices to name a cheapest bank. Will you mainly receive digital payments or handle cash?','कारोबार के लेन-देन के लिए बैंक के बिजनेस/करंट खाते के नियम, बैलेंस और नकद/शाखा शुल्क साथ देखें। सबसे सस्ता बैंक बताने के लिए हमारे पास अभी पुष्ट करंट-खाता कीमतें नहीं हैं। काम मुख्यतः डिजिटल भुगतान का है या नकद का?','Business transactions ke liye bank ke business/current account ki conditions, balance aur cash/branch charges saath dekhein. Cheapest bank batane ke liye abhi reviewed current-account prices nahi hain. Kaam mainly digital payments ka hai ya cash ka?'),'account_use');}
  if(/salary|सैलरी/.test(t)){p.values.accountUse='salary';return reply(S('First ask your employer which salary-account arrangements are available. Compare the balance rule and what changes if salary credits stop. Is your employer offering a particular bank?','पहले नियोक्ता से उपलब्ध सैलरी-खाता व्यवस्था पूछें। बैलेंस का नियम और सैलरी आना बंद होने पर बदलने वाली शर्तें देखें। क्या नियोक्ता किसी बैंक का विकल्प दे रहा है?','Pehle employer se available salary-account arrangement poochhein. Balance rule aur salary aana band hone par badalne wali conditions dekhein. Kya employer kisi bank ka option de raha hai?'),'account_use');}
  if(/personal|निजी|apne|खुद/.test(t)){p.values.accountUse='personal';return reply(S('For personal payments, let’s compare savings-account conditions. Do you need zero minimum balance or can you comfortably maintain a balance?','निजी भुगतान के लिए सेविंग खाते की शर्तें देखेंगे। जीरो मिनिमम बैलेंस चाहिए या आराम से कुछ बैलेंस रख सकते हैं?','Personal payments ke liye savings-account conditions dekhenge. Zero minimum balance chahiye ya aaram se balance maintain kar sakte hain?'),'personal_balance');}
 }
 return null;
}
const questions={
 card:{use:['Where will you use it most: online shopping, groceries, fuel or travel?','कार्ड का सबसे ज़्यादा इस्तेमाल कहाँ होगा—ऑनलाइन खरीदारी, किराना, पेट्रोल या यात्रा?','Card sabse zyada kahan use karenge—online shopping, kirana, petrol ya travel?'],fee:['Do you want no joining/annual fee, or is a paid card okay if its benefits cover the cost?','जॉइनिंग/सालाना फीस शून्य चाहिए, या फ़ायदे लागत से ज़्यादा हों तो फीस वाला कार्ड भी चलेगा?','Joining/annual fee zero chahiye, ya fayde cost se zyada hon to paid card bhi chalega?'],repay:['Can you pay the full statement bill on time every month, without another loan?','क्या हर महीने पूरा कार्ड बिल समय पर, दूसरा उधार लिए बिना भर पाएँगे?','Kya har mahine poora card bill time par, doosra udhaar liye bina bhar paayenge?']},
 savings:{balance:['Do you need zero minimum balance, or can you comfortably maintain a balance?','ज़ीरो न्यूनतम बैलेंस चाहिए, या बिना परेशानी बैलेंस रख सकते हैं?','Zero minimum balance chahiye, ya aaram se balance maintain kar sakte hain?'],channel:['Will you mainly use an app/UPI, or do you need frequent branch/cash services?','ज़्यादातर ऐप/UPI इस्तेमाल करेंगे, या शाखा और नकद सेवाएँ अक्सर चाहिए?','Zyada app/UPI use karenge, ya branch aur cash services aksar chahiye?']},
 demat:{use:['Which segment do you mean: delivery investing, intraday, or futures & options?','कौन-सा सेगमेंट चाहिए—डिलीवरी निवेश, इंट्राडे, या फ्यूचर्स और ऑप्शंस?','Kaunsa segment chahiye—delivery investing, intraday, ya futures aur options?'],fee:['Is your priority zero brokerage per order, low brokerage, or zero annual maintenance?','प्राथमिकता क्या है—हर ऑर्डर पर शून्य ब्रोकरेज, कम ब्रोकरेज, या शून्य सालाना मेंटेनेंस?','Priority kya hai—har order par zero brokerage, low brokerage, ya zero annual maintenance?']},
 loan:{purpose:['What is the loan for: business, home, education, a vehicle or a personal need?','लोन किस काम के लिए चाहिए—बिजनेस, घर, पढ़ाई, वाहन या कोई निजी ज़रूरत?','Loan kis kaam ke liye chahiye—business, ghar, padhai, vehicle ya personal need?'],amount:['Approximately how much do you need to borrow?','लगभग कितनी रकम उधार चाहिए?','Lagbhag kitni rakam ka loan chahiye?'],budget:['After essentials and existing EMIs, what monthly repayment could you comfortably manage?','ज़रूरी खर्च और मौजूदा EMI के बाद कितनी मासिक किस्त आराम से भर सकते हैं?','Zaroori kharch aur existing EMI ke baad kitni monthly kist aaram se bhar sakte hain?']},
 insurance:{type:['Are you looking for health, term life or motor insurance?','स्वास्थ्य, टर्म जीवन या वाहन बीमा चाहिए?','Health, term life ya motor insurance chahiye?'],cover:['Is the cover for yourself or family members? Do not share names or medical records.','कवर खुद के लिए चाहिए या परिवार के लिए? नाम या मेडिकल रिपोर्ट न भेजें।','Cover khud ke liye chahiye ya family ke liye? Naam ya medical reports mat bhejiye.'],priority:['What matters most: premium budget, coverage or a particular service?','आपकी पहली प्राथमिकता क्या है—प्रीमियम का बजट, कवर या कोई खास सुविधा?','Sabse zaroori kya hai—premium budget, coverage ya koi khaas service?']}
};
export function advisorReply(question,previous=null,language='hi',now=new Date(),financeRecords=[]){
 validateQuestion(question);
 language=languageFor(question,previous?.style,language)==='en'?'en':'hi';
 const category=intentOf(question),t=normal(question);
 const help=everydayHelp(question,previous,language,now);if(help)return help;
 const named=mentionedProductIds(question,now);
 if(named.length>=2&&/\b(?:compare|comparison|vs|versus|difference|farq)\b|तुलना|फ़र्क|फर्क/.test(t)&&new Set(named.map(id=>catalog[id].category)).size===1){
  const style=languageFor(question,previous?.style,language),hi=style==='hi',roman=style==='roman';
  return {answer:hi?'आपके बताए उत्पाद नीचे हैं। पूरी जानकारी वाले पेज पर चालू फीस और शुरुआती ऑफ़र अलग देखकर तुलना करें।':roman?'Aapke bataye products neeche hain. Poori jankari wale page par ongoing fees aur introductory offer alag dekhkar compare karein.':'Open the details pages below to compare the products you named. Check ongoing charges separately from introductory offers.',options:named.map(id=>({...catalog[id],reason:hi?'आपके चुने उत्पाद की जानकारी; क्रम आपके सवाल के अनुसार है, कमीशन के अनुसार नहीं।':roman?'Aapke chune product ki information; order aapke sawal ka hai, commission ka nahi.':'Information for the product you named; order follows your question, not commission.'})),profile:{category:{credit_card:'card',savings_account:'savings',demat:'demat'}[catalog[named[0]].category],values:previous?.category===({credit_card:'card',savings_account:'savings',demat:'demat'}[catalog[named[0]].category])?previous.values:{},completed:true,style},expanded:true,reviewedOn,reviewUntil};
 }
 if(named.length===1&&/puri|poori|full|detail|fees?|charges?|जानकारी|विस्तार/i.test(t)&&!/\b(?:best|better|which|compare|comparison|vs|kaunsa)\b|तुलना|बेहतर/.test(t)){
  const product=catalog[named[0]],style=languageFor(question,previous?.style,language),S=(en,hi,roman)=>style==='hi'?hi:style==='roman'?roman:en;
  const same=previous&&({card:'credit_card',savings:'savings_account',demat:'demat'}[previous.category]===product.category);
  return {answer:S('Here is the main information. Use Full details for the complete reviewed fees, restrictions and opening steps.','मुख्य जानकारी नीचे है। पूरी फीस, शर्तें और खोलने का तरीका “पूरी जानकारी” वाले पेज पर पढ़ें।','Mukhya jankari neeche hai. Poori fees, shartein aur opening steps “Poori jankari” wale page par padhein.'),options:[{...product,reason:S('Product information you requested; this does not assess approval or suitability.','आपके पूछे उत्पाद की जानकारी; मंज़ूरी या उपयुक्तता की जाँच नहीं।','Aapke poochhe product ki information; approval ya suitability assessment nahi.')}],profile:same?{...previous,style}:{category:{credit_card:'card',savings_account:'savings',demat:'demat'}[product.category],values:{},completed:true,style},expanded:true,reviewedOn,reviewUntil};
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
 const sector={it_services:['IT services','आईटी सेवाओं','IT services'],retail:['retail','दुकान/रिटेल','retail'],manufacturing:['manufacturing','निर्माण','manufacturing'],services:['services','सेवाओं','services']}[v.businessSector];
 const acknowledge=sector?S(`I understand your ${sector[0]} business. `,`आपका ${sector[1]} का काम समझ आया। `,`${sector[2]} ka kaam samajh aaya. `):'';
 const ask=key=>{p.pending=key;const q=questions[p.category][key];return result(acknowledge+(v.income!==undefined&&category==='card'?S(`You mentioned monthly income of ₹${v.income.toLocaleString('en-IN')}. Income alone does not establish approval. `,`आपने मासिक आय ₹${v.income.toLocaleString('en-IN')} बताई है। सिर्फ़ आय से मंज़ूरी तय नहीं होती। `,`Aapne monthly income ₹${v.income.toLocaleString('en-IN')} batayi hai. Sirf income se approval tay nahi hota. `):'')+S(...q));};
 if(p.category==='card'&&(v.income===0||v.repay==='no')){
  if(previous?.pending==='budgetHelp')return null;
  p.pending='budgetHelp';return result(S('Before comparing reward cards, first check how you would repay the full bill. Interest and fees can outweigh rewards. Would you like help reviewing your monthly budget?','रिवॉर्ड कार्ड की तुलना से पहले पूरे बिल की अदायगी समझना ज़रूरी है। ब्याज और फीस फ़ायदों से ज़्यादा पड़ सकते हैं। क्या महीने का बजट समझने में मदद चाहिए?','Reward cards compare karne se pehle poore bill ki repayment samajhna zaroori hai. Interest aur fees faydon se zyada ho sakti hain. Kya monthly budget samajhne mein madad chahiye?'));
 }
 const changed=Object.keys(v).some(k=>v[k]!==previous?.values?.[k]);
 if(!category&&!changed&&!/^(?:yes|haan|han|ha|okay|ok|हाँ|हां|ठीक)[.! ]*$/.test(t)&&!/detail|info|puri|poori|fees|charges|brokerage|jaankari|jankari|जानकारी|विस्तार|rate|interest|option|ब्याज|विकल्प|दर/.test(t)&&!(p.category==='loan'&&sector&&/services?|software|retail|manufactur|आईटी|कारोबार/.test(t)))return null;
 if(['card','savings','demat'].includes(p.category)&&now.toISOString().slice(0,10)>reviewUntil)return result(S('A fresh review is due; check current official terms on the guide.','नया रिव्यू ज़रूरी है; गाइड में वर्तमान आधिकारिक नियम जाँचें।','Fresh review zaroori hai; guide mein current official terms check karein.'));
 // Direct service answers precede optional interviews. Retain known facts across turns.
 if(p.category==='loan'||p.category==='insurance'){
  p.completed=true;p.pending=null;
  if(p.category==='loan'){
   if(v.income===0)return result(S('First check how repayments would be made without current income. A low advertised rate does not make a loan affordable. I can help review a monthly budget.','अभी आय नहीं है तो पहले किस्त भरने का रास्ता समझें। कम विज्ञापित ब्याज से लोन अपने-आप किफ़ायती नहीं बनता। महीने का बजट समझने में मदद कर सकती हूँ।','Abhi income nahi hai to pehle kist bharne ka rasta samjhein. Kam advertised rate se loan apne-aap affordable nahi hota. Monthly budget samajhne mein madad kar sakti hoon.'));
   if(!v.amount){p.completed=false;return ask('amount');}
   if(!v.purpose&&previous?.pending!=='purpose'){p.completed=false;return ask('purpose');}
   if(v.purpose==='business'&&v.businessYears===undefined&&previous?.pending!=='businessAge'){p.completed=false;p.pending='businessAge';return result(S('Is this a new business, or how many years has it been running?','यह नया कारोबार है या कितने साल से चल रहा है?','Yeh naya business hai ya kitne saal se chal raha hai?'));}
   const loans=loanComparisons(financeRecords,p,now);
   if(loans.length){const lead=loans[0],answer=S(`For ₹${v.amount.toLocaleString('en-IN')}, ${lead.title} has the lowest published starting rate among the confirmed matching pages below: ${lead.facts.rate_min}% p.a. This is not your approved rate. Compare fees and the bank's written APR/KFS too.`,`₹${v.amount.toLocaleString('en-IN')} के लिए नीचे की पुष्ट जानकारी में ${lead.title} की प्रकाशित शुरुआती दर सबसे कम है: ${lead.facts.rate_min}% सालाना। आपकी मंज़ूर दर अलग हो सकती है। फीस और बैंक का लिखित APR/KFS भी देखें।`,`₹${v.amount.toLocaleString('en-IN')} ke liye neeche ki confirmed information mein ${lead.title} ki published starting rate sabse kam hai: ${lead.facts.rate_min}% saalana. Aapki approved rate alag ho sakti hai. Fees aur bank ka written APR/KFS bhi dekhein.`);return {...result(answer),loanOptions:loans.slice(0,3)};}
   const amount=acknowledge+(v.amount?S('For your ₹'+v.amount.toLocaleString('en-IN')+' requirement, ','आपकी ₹'+v.amount.toLocaleString('en-IN')+' की ज़रूरत के लिए ','Aapki ₹'+v.amount.toLocaleString('en-IN')+' ki zaroorat ke liye '):'');
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
  const matchingIds=ids.filter(id=>v.maxFee===undefined||({amazon:0,hdfc:500,sbi:999}[id]??Infinity)<=v.maxFee);
  if(ids.length&&!matchingIds.length)return result(S('None of these reviewed cards matches your annual-fee limit. The guide explains fees and alternatives; you can change the limit or ask for a no-annual-fee option.','इन रिव्यू किए कार्डों में आपकी सालाना फीस सीमा का कोई विकल्प नहीं मिला। गाइड में फीस और दूसरे रास्ते देखें; सीमा बदल सकते हैं या बिना सालाना फीस वाला विकल्प पूछ सकते हैं।','In reviewed cards mein aapki annual-fee limit ka koi option nahi mila. Guide mein fees aur doosre raste dekhein; limit badal sakte hain ya bina annual fee wala option poochh sakte hain.'));
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
