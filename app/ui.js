'use client';
import SmartCardOfferCalculator from './SmartCardOfferCalculator';
import CreditCardDebtTrapCalculator from './CreditCardDebtTrapCalculator';
import StudentCardFinder from './StudentCardFinder';
import EmergencyFundCalculator from './EmergencyFundCalculator';
import CarVsUberCalculator from './CarVsUberCalculator';
import HomeLoanCalculator from './HomeLoanCalculator';
import ModernHomepage from './ModernHomepage';

import InstallApp from './install-app';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowRight, Check, ShieldCheck, LockKeyhole, Wallet, Scale, MessageCircle, Sparkles, X, Sun, Moon, Menu, BookOpen, ReceiptText, TrendingUp, CheckCheck } from 'lucide-react';
import { monthlyReview, quoteTotal } from '../lib/calculations.mjs';
import { serviceStatus, serviceStatuses } from '../lib/status.mjs';
import {guidePath} from '../lib/guides.mjs';
import PartnerLinks from './partner-links';
import ProductLibraryLinks from './product-library-links';
import ServiceShortcuts from './service-shortcuts';
import './products.css';
import SiaLive from './sia-live';
import { educationCopy } from '../lib/education-copy.mjs';

const copy = {
 en: {
  tools:'Money tools', guides:'Simple guides', about:'Our approach', language:'हिन्दी', start:'Find your starting point', tag:'3 FREE TOOLS + YOUR SIA GUIDE',
  hero:<>Everyday money.<br/><em>Made clearer.</em></>, intro:'Explore accounts, cards, loans, insurance and more. Compare the main costs, or ask SIA where to start.', primary:'Check my monthly budget', secondary:'Explore the tools', free:'Free to use', private:'No account needed', both:'English & हिन्दी',
  illustration:'A little clarity, every month', month:'YOUR MONTH, AT A GLANCE', income:'Money coming in', spent:'Monthly commitments', left:'Room to breathe', sample:'Illustrative monthly budget', insight:'Your income covers your spending.', insight2:'See what’s left before your next big decision.',
  strip:['Your numbers stay in your browser','Clear calculations, visible assumptions','Useful with cash, UPI or cards'],
  kicker:'START WITH WHAT’S ON YOUR MIND', title:'All 3 tools, right here.', sub:'You don’t need to be a finance expert. Just bring your question.',
  cards:[['01','Where does my money go?','Add your approximate monthly income and spending. Get a clear picture of what’s left.','Review my month'],['02','What is the full purchase cost?','Compare two purchase or loan quotes. See the full cost behind that attractive EMI.','Compare two quotes'],['03','A payment went wrong. Now what?','Find the next steps for a pending UPI payment, an unfamiliar charge or a confusing card bill.','Find my next step']],
  methodKicker:'BUILT AROUND YOUR REAL LIFE', method:'A helpful answer starts with the whole picture.', methodText:'A smaller EMI can mean a bigger total bill. A reward can come with a fee. We put the numbers and conditions together, so you can see the trade-offs.', methodItems:['Start with what you already have','Keep cash costs and possible rewards separate','Explain the assumptions behind every result'],
  guideTitle:'A little reading. A lot more clarity.', guideSub:'Simple explainers for the questions that keep coming up.', guideCards:[['BORROWING','Small EMI. Bigger total cost?','Compare repayment, tenure and fees before you choose.'],['MONTHLY MONEY','An approximate budget is a good start.','You don’t need to track every chai to understand your month.'],['PAYMENTS','When a UPI payment gets stuck.','Start with the transaction status and your app’s help section.']],
  footer:'Make everyday money make sense.', footerNote:'Preview · Commercial links are labelled separately.', disclosure:'Educational calculations and guidance. Results use your inputs and stated assumptions; provider terms determine actual charges and eligibility.',
  privacyTitle:'Your inputs, your control', privacyText:'Income, expenses and quote amounts are calculated in this browser tab. They are not saved or sent to Supabase or an AI provider. Supabase handles tool status, SIA requests and outbound-link events. Sending a SIA message shares your typed question and recent chat with AI providers; SahiFayda does not store or cache those personal conversations. Click events use random IDs, not customer application data; they may be passed to a partner only where its tracking terms permit. If you separately submit the optional application-help form, the name/mobile, progress status and issue you choose to provide are stored privately for owner support under a 90-day retention policy with hourly expiry cleanup. They are not sent to SIA/AI or added to click logs. Applying never requires this form. Voice may be processed by your browser speech service; audio and transcripts are not saved by SahiFayda. Refreshing the page clears your entered numbers. Your theme preference stays on this device; a random chat ID lasts for this browser tab.',
  modalTitles:['Your monthly money review','Compare the full cost','Find your payment next step'], close:'Close tool', calculate:'Show my result', loading:'Checking availability…', reset:'Use example numbers', result:'YOUR RESULT', approx:'Use approximate monthly amounts. Count purchases once; don’t add the card bill again.',
  expenseLabels:['Home & rent','Groceries & essentials','EMIs & debt payments','Bills & travel','Other spending'], total:'Total monthly spending', balance:'Left after spending', deficit:'Monthly shortfall', budgetPositive:'This is the balance after the expenses you entered, before any costs you left out. Decide what part you need for irregular bills, savings and emergencies.', budgetNegative:'Your entered spending is higher than your income. Start with essential commitments and avoid adding new debt just to earn rewards.', incomeLabel:'Monthly take-home income',
  compareNote:'Compare the same purchase and equivalent inclusions. Enter the down payment, all scheduled EMIs, and separately payable mandatory fees. Exclude fees already included in the EMI.', quote:'Quote', down:'Down payment', emi:'Monthly EMI', months:'Number of months', fees:'Separate fees, including taxes', quoteNote:'Total = down payment + EMI × months + separate fees. Balloon payments, insurance, maintenance and other omitted costs are not included. This is not an APR or loan-approval calculation.', difference:'Difference in total payment', equal:'Both entered quotes have the same total.', lower:'has the lower entered total. Check monthly affordability and all omitted conditions before choosing.', guidePick:'Choose what happened', topics:['UPI pending or failed','An unfamiliar bank charge','Credit-card minimum due'], error:'Check all amounts. Use non-negative numbers; income must be above zero and tenure must be a whole number from 1 to 600.', unavailable:'Tool availability could not be verified. Please try again.', privacy:'Privacy', admin:'Setup status', aboutTitle:'Practical help, without the pressure', aboutText:'SahiFayda begins with three small tools for everyday decisions. No new card or loan is needed to use them. Commercial links are optional and separately disclosed; live prices and reward calculations are not provided.', setupTitle:'Project setup', setupText:'Supabase is connected for public tool availability. The separate /admin console manages authorised users, tool states, commercial links, reports, SIA provider controls, source reviews and marketing drafts. Live AI availability depends on the saved provider checks and admin state. No bank or payment action is performed.',
 },
 hi:{
  tools:'पैसों के टूल', guides:'आसान जानकारी', about:'हमारा तरीका', language:'English', start:'कहाँ से शुरू करें', tag:'3 मुफ़्त टूल + आपकी SIA गाइड',
  hero:<>रोज़ के पैसे।<br/><em>अब आसान हिसाब।</em></>, intro:'खाते, कार्ड, लोन, बीमा और रोज़ की सेवाएँ एक जगह। मुख्य खर्च समझें, या शुरुआत के लिए SIA से पूछें।', primary:'महीने का हिसाब देखें', secondary:'सभी टूल देखें', free:'इस्तेमाल मुफ़्त है', private:'खाता बनाना ज़रूरी नहीं', both:'हिन्दी और English',
  illustration:'हर महीने, थोड़ी और समझ', month:'एक नज़र में आपका महीना', income:'महीने की आय', spent:'महीने का खर्च', left:'खर्च के बाद बची रकम', sample:'समझाने के लिए काल्पनिक हिसाब', insight:'इस हिसाब में आय खर्च से ज़्यादा है।', insight2:'अगले बड़े फ़ैसले से पहले बची रकम समझें।',
  strip:['आपके आँकड़े इसी ब्राउज़र में रहते हैं','साफ़ गणना और स्पष्ट मान्यताएँ','नकद, UPI या कार्ड—सबके लिए उपयोगी'],
  kicker:'शुरुआत अपनी ज़रूरत से करें', title:'तीनों टूल, यहीं मिलेंगे।', sub:'वित्त का विशेषज्ञ होना ज़रूरी नहीं। बस अपनी ज़रूरत बताइए।',
  cards:[['01','मेरे पैसे कहाँ खर्च होते हैं?','महीने की लगभग आय और खर्च भरें। समझें कि आपके पास कितना बचता है।','महीने का हिसाब देखें'],['02','इस खरीद का कुल भुगतान कितना है?','खरीद या लोन के दो कोटेशन की तुलना करें। छोटी EMI के पीछे का कुल खर्च देखें।','दो कोटेशन की तुलना करें'],['03','भुगतान में दिक्कत है। अब क्या करें?','अटके UPI, अनजान बैंक शुल्क या कार्ड बिल के लिए अगला कदम समझें।','अगला कदम देखें']],
  methodKicker:'आपकी असली ज़रूरतों के लिए', method:'उपयोगी जवाब के लिए पूरी तस्वीर ज़रूरी है।', methodText:'छोटी EMI का कुल भुगतान बड़ा हो सकता है। किसी लाभ के साथ शुल्क भी हो सकता है। हम आँकड़े और शर्तें साथ दिखाते हैं, ताकि फ़ैसला समझकर लें।', methodItems:['पहले अपने मौजूदा विकल्प देखें','नकद खर्च और संभावित लाभ अलग रखें','हर नतीजे की मान्यताएँ समझें'],
  guideTitle:'थोड़ा पढ़ें। बेहतर समझें।', guideSub:'बार-बार आने वाले सवालों की आसान जानकारी।', guideCards:[['उधार','छोटी EMI, बड़ा कुल खर्च?','चुनने से पहले कुल भुगतान, अवधि और शुल्क की तुलना करें।'],['महीने का हिसाब','लगभग बजट भी अच्छी शुरुआत है।','महीना समझने के लिए हर छोटी खरीद दर्ज करना ज़रूरी नहीं।'],['भुगतान','UPI भुगतान अटक जाए तो?','लेन-देन की स्थिति और अपने ऐप के सहायता विकल्प से शुरू करें।']],
  footer:'रोज़मर्रा के पैसों की बेहतर समझ।', footerNote:'प्रीव्यू · व्यावसायिक लिंक अलग से चिन्हित हैं।', disclosure:'शैक्षिक गणना और जानकारी। नतीजे आपके दिए आँकड़ों और बताई मान्यताओं पर आधारित हैं। वास्तविक शुल्क और पात्रता प्रदाता की शर्तों पर निर्भर हैं।',
  privacyTitle:'आपके आँकड़े, आपका नियंत्रण', privacyText:'आय, खर्च और कोटेशन की गणना इसी ब्राउज़र टैब में होती है। ये आँकड़े Supabase या किसी AI को भेजे या सहेजे नहीं जाते। Supabase टूल की स्थिति, SIA के अनुरोध और बाहर जाने वाले लिंक के इवेंट सँभालता है। SIA में Send दबाने पर आपकी लिखी बात और हाल की बातचीत AI को जाती है; सहीफ़ायदा इन निजी बातचीतों को डेटाबेस में सेव या साझा कैश नहीं करता। क्लिक के लिए random ID बनती है, ग्राहक के आवेदन का डेटा नहीं। अनुमति वाली पार्टनर ट्रैकिंग में यह ID लिंक में जा सकती है। अलग वैकल्पिक आवेदन-सहायता फॉर्म भेजने पर आपके दिए नाम/मोबाइल, स्थिति और समस्या को मालिक की मदद के लिए निजी तौर पर 90-दिन की retention policy में रखा जाता है; अवधि पूरी होने के बाद हर घंटे सफाई होती है। यह जानकारी SIA/AI या क्लिक लॉग में नहीं जाती। आवेदन के लिए यह फॉर्म ज़रूरी नहीं है। वॉइस आपके ब्राउज़र की speech service पर प्रोसेस हो सकती है; सहीफ़ायदा ऑडियो या ट्रांसक्रिप्ट नहीं सहेजता। पेज रीफ़्रेश करने पर भरे आँकड़े हट जाते हैं। आपकी थीम की पसंद इस डिवाइस पर सहेजी जाती है; एक random चैट ID इस ब्राउज़र टैब तक रहती है।',
  modalTitles:['महीने के पैसों का हिसाब','पूरे खर्च की तुलना','भुगतान में अगला कदम'], close:'टूल बंद करें', calculate:'नतीजा देखें', loading:'उपलब्धता जाँच रहे हैं…', reset:'उदाहरण के आँकड़े भरें', result:'आपका नतीजा', approx:'महीने के लगभग आँकड़े भरें। खरीद को एक बार गिनें; कार्ड का बिल फिर से खर्च में न जोड़ें।',
  expenseLabels:['घर और किराया','राशन और ज़रूरी सामान','EMI और कर्ज़ भुगतान','बिल और यात्रा','अन्य खर्च'], total:'महीने का कुल खर्च', balance:'खर्च के बाद बाकी', deficit:'महीने की कमी', budgetPositive:'यह आपके भरे खर्चों के बाद बची रकम है। छूटे हुए खर्च अलग हो सकते हैं। अनियमित बिल, बचत और आपातकाल के लिए ज़रूरी रकम अलग सोचें।', budgetNegative:'आपके भरे खर्च आय से ज़्यादा हैं। पहले ज़रूरी भुगतान देखें। सिर्फ़ लाभ पाने के लिए नया कर्ज़ न जोड़ें।', incomeLabel:'महीने की हाथ में आने वाली आय',
  compareNote:'एक ही खरीद और समान सुविधाओं की तुलना करें। शुरुआती भुगतान, सभी EMI और अलग देय अनिवार्य शुल्क भरें। EMI में शामिल शुल्क दोबारा न जोड़ें।', quote:'कोटेशन', down:'शुरुआती भुगतान', emi:'महीने की EMI', months:'कुल महीनों की संख्या', fees:'अलग देय शुल्क, कर सहित', quoteNote:'कुल = शुरुआती भुगतान + EMI × महीने + अलग शुल्क। अंतिम बड़ी किस्त, बीमा, रखरखाव और छूटे खर्च शामिल नहीं हैं। यह APR या लोन मंज़ूरी की गणना नहीं है।', difference:'कुल भुगतान का अंतर', equal:'दोनों कोटेशन का भरा कुल भुगतान बराबर है।', lower:'का भरा कुल भुगतान कम है। चुनने से पहले महीने की भुगतान क्षमता और छूटी शर्तें भी देखें।', guidePick:'क्या दिक्कत हुई है?', topics:['UPI अटका या विफल हुआ','अनजान बैंक शुल्क लगा','क्रेडिट कार्ड का न्यूनतम देय'], error:'सभी रकम जाँचें। ऋणात्मक संख्या न भरें। आय शून्य से ज़्यादा और अवधि 1 से 600 के बीच पूरे महीने होनी चाहिए।', unavailable:'टूल की उपलब्धता जाँची नहीं जा सकी। दोबारा कोशिश करें।', privacy:'गोपनीयता', admin:'सेटअप की स्थिति', aboutTitle:'व्यावहारिक मदद, बिना दबाव', aboutText:'सहीफ़ायदा की शुरुआत रोज़मर्रा के फ़ैसलों के तीन छोटे टूल से है। इनके लिए नया कार्ड या लोन ज़रूरी नहीं। व्यावसायिक लिंक वैकल्पिक हैं और अलग बताए जाते हैं। लाइव कीमतें या रिवॉर्ड की गणना उपलब्ध नहीं है।', setupTitle:'प्रोजेक्ट सेटअप', setupText:'टूल की उपलब्धता के लिए Supabase जुड़ा है। अलग /admin पैनल में अधिकृत यूज़र, टूल, व्यावसायिक लिंक, रिपोर्ट, SIA नियंत्रण, स्रोत समीक्षा और पोस्ट ड्राफ्ट सँभाले जाते हैं। लाइव AI उपलब्धता provider test और admin state पर निर्भर है। बैंक या भुगतान की कोई कार्रवाई नहीं होती।',
 }
};

const guideContent = {
 en:[['Check the transaction status in the same UPI app. Keep the reference number, time and amount for your own complaint record.','Use the transaction’s Help / Raise issue option, then contact the participating bank through its official channel if unresolved.','Do not pay again just because a transaction says pending. Confirm the final status and check with the recipient before deciding.'],['Check the statement description and the bank’s applicable schedule of charges. Was it a fee, tax, renewal or transaction you do not recognise?','Ask your bank for the charge basis or raise a dispute using the official app or contact details on its website.','If you suspect an unauthorised transaction, contact the bank immediately to report it and protect the affected payment method.'],['Minimum due is not the full bill. Paying only the minimum can leave a balance on which interest and other charges may apply.','Check the total amount due, due date and issuer’s current terms. A new transaction’s interest-free period can also be affected.','If the full bill is unaffordable, contact the issuer before the due date to discuss available repayment options and the full cost.']],
 hi:[['उसी UPI ऐप में लेन-देन की स्थिति जाँचें। शिकायत के लिए संदर्भ नंबर, समय और रकम अपने पास रखें।','लेन-देन का सहायता / शिकायत विकल्प चुनें। समाधान न हो तो संबंधित बैंक के आधिकारिक माध्यम से संपर्क करें।','केवल लंबित स्थिति देखकर दोबारा भुगतान न करें। अंतिम स्थिति और प्राप्तकर्ता से जाँचकर अगला फ़ैसला लें।'],['स्टेटमेंट का विवरण और बैंक की लागू शुल्क सूची देखें। क्या यह शुल्क, कर, नवीनीकरण या अनजान लेन-देन है?','बैंक से शुल्क का आधार पूछें या आधिकारिक ऐप अथवा वेबसाइट के संपर्क माध्यम से शिकायत करें।','लेन-देन अनधिकृत लग रहा हो तो तुरंत बैंक को सूचित करें और संबंधित भुगतान माध्यम सुरक्षित कराएँ।'],['न्यूनतम देय पूरा बिल नहीं है। केवल यह रकम भरने पर बचे भुगतान पर ब्याज और अन्य शुल्क लग सकते हैं।','कुल देय, भुगतान की तारीख और जारीकर्ता की वर्तमान शर्तें देखें। नई खरीद की ब्याज-मुक्त अवधि भी प्रभावित हो सकती है।','पूरा बिल भरना मुश्किल हो तो देय तारीख से पहले बैंक से भुगतान विकल्प और उनकी पूरी लागत पूछें।']]
};
const money = value => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:2}).format(value);
const initialBudget = ['50000','12000','8000','6000','3000','9000'];
const initialQuotes = [{down:'30000',emi:'3400',months:'24',fees:'2000'},{down:'30000',emi:'2500',months:'36',fees:'1000'}];

export default function Home({language}) {
 const t = copy[language], hi = language === 'hi', education = educationCopy[language];
 const [active,setActive] = useState(null), [menu,setMenu] = useState(false), [budget,setBudget]=useState(initialBudget), [quotes,setQuotes]=useState(initialQuotes), [result,setResult]=useState(null), [error,setError]=useState(''), [busy,setBusy]=useState(false), [topic,setTopic]=useState(0);
 const [guidanceReady,setGuidanceReady]=useState(false);
 const [availability,setAvailability]=useState(null);
 useEffect(()=>{let cancelled=false;const refresh=()=>serviceStatuses().then(data=>{if(!cancelled)setAvailability(data);}).catch(()=>{});refresh();window.addEventListener('focus',refresh);return()=>{cancelled=true;window.removeEventListener('focus',refresh);};},[]);
 const [theme,setTheme]=useState('light');
 useEffect(()=>{setTheme(document.documentElement.dataset.theme==='dark'?'dark':'light');},[]);
 function toggleTheme(){const next=theme==='light'?'dark':'light';setTheme(next);document.documentElement.dataset.theme=next;document.documentElement.style.colorScheme=next;try{localStorage.setItem('sahifayda-theme',next);}catch{}}
 const panel = useRef(null), closeButton = useRef(null), lastFocus = useRef(null);
 useEffect(()=>{
  if(active!=='guidance')return;
  let cancelled=false;setGuidanceReady(false);setError('');
  serviceStatus('guidance').then(status=>{if(cancelled)return;if(status.state==='active')setGuidanceReady(true);else setError(hi?status.message_hi:status.message_en);}).catch(()=>{if(!cancelled)setError(t.unavailable);});
  return()=>{cancelled=true;};
 },[active,hi,t.unavailable]);
 useEffect(()=>{document.documentElement.lang=language;},[language]);
 useEffect(()=>{
  if(active===null) return;
  lastFocus.current=document.activeElement;
  const old=document.body.style.overflow; document.body.style.overflow='hidden'; closeButton.current?.focus();
  function key(e){ if(e.key==='Escape') setActive(null); if(e.key==='Tab'){const items=panel.current?.querySelectorAll('button,a,input,select,[tabindex="0"]'); if(!items?.length)return; const first=items[0],last=items[items.length-1]; if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}} }
  document.addEventListener('keydown',key); return()=>{document.body.style.overflow=old;document.removeEventListener('keydown',key);lastFocus.current?.focus();};
 },[active]);
 function open(id){setResult(null);setError('');setActive(id);setMenu(false);}
 async function calculate(e){
  e.preventDefault(); setError('');setBusy(true);setResult(null);
  try{
   const status=await serviceStatus(active);
   if(status.state!=='active'){setError(hi?status.message_hi:status.message_en);return;}
   try{setResult(active==='monthly'?monthlyReview(budget[0],budget.slice(1)):quotes.map(quoteTotal));}catch{setError(t.error);}
  }catch{setError(t.unavailable);}finally{setBusy(false);}
 }
 const toolIds=['monthly','compare','guidance'], icons=[Wallet,Scale,MessageCircle];
 const toolIndex=toolIds.indexOf(active);
 const visibleIndexes=toolIds.map((id,index)=>index).filter(index=>availability?.[toolIds[index]]!=='hidden');
 const toolCount=visibleIndexes.length;
 return <>
  <div className="preview-bar">{hi?'प्रीव्यू · आपके फ़ीडबैक के लिए तैयार हो रहा है':'PREVIEW · A first look at a little more clarity'}<span>{hi?'पार्टनर लिंक अलग चिन्हित हैं':'Partner links labelled separately'}</span></div>
  
  {/* Modern Attractive Homepage */}
  <ModernHomepage language={language} onOpenCalculator={(id) => setTopic(id)} />
  
  <header className="header wrap">
   <a className="logo" href={hi?'/hi/':'/'} aria-label="SahiFayda home"><span className="logo-mark"><TrendingUp size={24} strokeWidth={2.4}/></span>Sahi<span>Fayda</span></a>
   <nav className={menu?'nav show':'nav'} aria-label={hi?'मुख्य नेविगेशन':'Main navigation'}><button onClick={()=>open('directory')}>{t.tools} · {toolCount}</button><a href={hi?'/hi/products/':'/products/'} onClick={()=>setMenu(false)}>{hi?'खाते, कार्ड और सभी सेवाएँ':'Accounts, cards & all services'}</a><a href={hi?'/hi/guides/':'/guides/'} onClick={()=>setMenu(false)}>{t.guides}</a><a href="#partners" onClick={()=>setMenu(false)}>{hi?'पार्टनर लिंक':'Partner links'}</a><a href="#approach" onClick={()=>setMenu(false)}>{t.about}</a></nav>
   <div className="header-actions"><button className="theme-toggle" onClick={toggleTheme} aria-label={hi?(theme==="light"?"डार्क थीम चालू करें":"लाइट थीम चालू करें"):(theme==="light"?"Switch to dark theme":"Switch to light theme")} aria-pressed={theme==="dark"}>{theme==="light"?<Moon size={18}/>:<Sun size={18}/>}</button><a className="language" href={hi?'/':'/hi/'}>{t.language}</a><button className="menu-toggle" aria-label={hi?'मेन्यू':'Menu'} aria-expanded={menu} onClick={()=>setMenu(!menu)}><Menu/></button></div>
  </header>
  <main>
   <div className="hero-shell"><section className="hero home-service-hero wrap">
    <div className="hero-copy">
      <div className="eyebrow"><span/>{hi?'मुफ़्त पैसे बचत टूल्स':'FREE MONEY-SAVING TOOLS'}</div>
      <h1>{t.hero}</h1>
      <p>{hi ? 'फोन खरीद पर ₹2,500+ छूट, क्रेडिट कार्ड क़र्ज़ से मुक्ति, या स्टूडेंट कार्ड — 3 मुफ़्त कैलकुलेटर चुनें।' : 'Save ₹2,500+ on tech purchases, escape credit card debt traps, or get student cards — 3 free calculators to choose from.'}</p>
      <div className="hero-actions">
        <a className="primary hero-cta" href="#tools">
          {hi ? 'अपना टूल चुनें' : 'Choose Your Calculator'}
          <ArrowRight size={20}/>
        </a>
        <button className="text-link" onClick={()=>open('sia')}>
          {hi ? 'या SIA से पूछें' : 'Or ask SIA'}
          <MessageCircle size={17}/>
        </button>
      </div>
      <div className="hero-meta">
        <span><Check size={14}/>{t.free}</span>
        <span><Check size={14}/>{t.private}</span>
        <span><Check size={14}/>{t.both}</span>
      </div>
    </div>
    <div className="hero-visual-simplified">
      <div className="hero-tool-preview">
        <div className="preview-card">
          <div className="preview-header">
            <span className="preview-icon">📱</span>
            <div>
              <strong>{hi ? 'शॉपिंग डिस्काउंट' : 'Shopping Discounts'}</strong>
              <small>{hi ? '₹30,000 का फोन' : '₹30,000 phone'}</small>
            </div>
          </div>
          <div className="preview-result">
            <span>{hi ? 'सबसे अच्छा ऑफ़र:' : 'Best offer:'}</span>
            <strong>{hi ? 'Amazon ICICI: ₹2,500 छूट' : 'Amazon ICICI: ₹2,500 off'}</strong>
          </div>
        </div>
        <div className="preview-card">
          <div className="preview-header">
            <span className="preview-icon">🛑</span>
            <div>
              <strong>{hi ? 'क़र्ज़ मुक्ति' : 'Debt Exit'}</strong>
              <small>{hi ? '₹50,000 बिल' : '₹50,000 bill'}</small>
            </div>
          </div>
          <div className="preview-result">
            <span>{hi ? '6 महीने EMI से बचत:' : '6-month EMI savings:'}</span>
            <strong>{hi ? '₹8,400 बचाएँ' : 'Save ₹8,400'}</strong>
          </div>
        </div>
        <div className="preview-card">
          <div className="preview-header">
            <span className="preview-icon">🎓</span>
            <div>
              <strong>{hi ? 'स्टूडेंट कार्ड' : 'Student Cards'}</strong>
              <small>{hi ? '0 इनकम' : 'Zero income'}</small>
            </div>
          </div>
          <div className="preview-result">
            <span>{hi ? 'गारंटीड कार्ड:' : 'Guaranteed:'}</span>
            <strong>{hi ? 'FD-Based कार्ड' : 'FD-secured cards'}</strong>
          </div>
        </div>
      </div>
    </div>
   </section></div>
   <div className="trust-strip"><div className="wrap">{t.strip.map((s,i)=>{const Icon=[LockKeyhole,ReceiptText,Wallet][i];return <span key={s}><Icon size={18}/>{s}</span>;})}</div></div>
   <section className="tools-section wrap" id="tools">
        <div className="featured-tool-container">
          <div className="featured-tool-header">
            <div className="featured-tool-heading">
              <span className="featured-badge">{hi ? '💰 मुफ़्त टूल' : '💰 FREE TOOL'}</span>
              <h2>{hi ? 'अपनी ज़रूरत चुनें और तुरंत बचत देखें' : 'Choose Your Need. See Instant Savings.'}</h2>
              <p>{hi ? 'कैलकुलेटर चुनें — 100% मुफ़्त, प्राइवेट, और तुरंत इस्तेमाल करें' : 'Select a calculator — 100% free, private, and instant results'}</p>
            </div>
            
            <div className="tool-selector">
              <label htmlFor="tool-select" style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '6px', display: 'block', fontWeight: '600' }}>
                {hi ? 'टूल चुनें:' : 'Choose tool:'}
              </label>
              <select 
                id="tool-select"
                value={topic || 'card_offers'} 
                onChange={(e) => setTopic(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  fontSize: '14px',
                  fontWeight: '600',
                  border: '2px solid var(--border)',
                  borderRadius: '10px',
                  background: 'var(--surface)',
                  color: 'var(--ink)',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="card_offers">
                  📱 {hi ? 'शॉपिंग डिस्काउंट — ₹2,500+ बचाएँ' : 'Shopping Discounts — Save ₹2,500+'}
                </option>
                <option value="debt_trap">
                  🛑 {hi ? 'क़र्ज़ मुक्ति — 42% ब्याज से बचें' : 'Debt Trap Exit — Escape 42% Interest'}
                </option>
                <option value="student_cards">
                  🎓 {hi ? 'स्टूडेंट कार्ड — 0 सैलरी ज़रूरी नहीं' : 'Student Cards — Zero Income Needed'}
                </option>
                <option value="emergency_fund">
                  💰 {hi ? 'आपातकालीन फ़ंड — 6-12 महीने का खर्च' : 'Emergency Fund — 6-12 Months Protection'}
                </option>
                <option value="car_vs_uber">
                  🚗 {hi ? 'कार vs Uber — 5 साल की तुलना' : 'Car vs Uber — 5-Year Comparison'}
                </option>
                <option value="home_loan">
                  🏠 {hi ? 'होम लोन vs किराया — घर लें या किराये में रहें?' : 'Home Loan vs Rent — Buy or Rent?'}
                </option>
              </select>
            </div>
          </div>

          <div className="featured-tool-body">
            {(topic === 'card_offers' || topic === 'budget' || !topic) && (
              <div className="tool-wrapper">
                <div className="tool-benefit-strip">
                  <span className="benefit-icon">💳</span>
                  <div>
                    <strong>{hi ? 'फोन, लैपटॉप, TV खरीदने पर सबसे ज़्यादा छूट वाला कार्ड खोजें' : 'Find the best credit card discount for phones, laptops & electronics'}</strong>
                    <small>{hi ? 'Amazon, Flipkart, और ब्रांड ऑफ़र्स की तुलना' : 'Compare Amazon, Flipkart & brand offers instantly'}</small>
                  </div>
                </div>
                <SmartCardOfferCalculator language={language} initialPrice={30000} initialCategory="mobile" />
                <div style={{ textAlign: 'center', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                  <a
                    href={"https://api.whatsapp.com/send?text=" + encodeURIComponent(hi ? "देख भाई! अगर नया फोन या लैपटॉप लेना है तो इस टूल से चेक कर किस कार्ड से ₹2,500+ की छूट मिलेगी: https://sahifayda.pages.dev/" : "Find the best credit card discount for your next tech purchase (save ₹2,500+): https://sahifayda.pages.dev/")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whatsapp-share-btn"
                  >
                    <span>📲</span> {hi ? 'WhatsApp पर शेयर करें' : 'Share on WhatsApp'}
                  </a>
                </div>
              </div>
            )}

            {topic === 'debt_trap' && (
              <div className="tool-wrapper">
                <div className="tool-benefit-strip debt">
                  <span className="benefit-icon">⚠️</span>
                  <div>
                    <strong>{hi ? 'केवल मिनिमम ड्यू भरने पर कितना ब्याज लगेगा और कैसे बचें' : 'See the real cost of paying only minimum due & escape the 42% trap'}</strong>
                    <small>{hi ? 'पर्सनल लोन से EMI में बदलकर हज़ारों बचाएँ' : 'Convert to low-EMI personal loan and save thousands'}</small>
                  </div>
                </div>
                <CreditCardDebtTrapCalculator language={language} initialBill={50000} />
                <div style={{ textAlign: 'center', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                  <a
                    href={"https://api.whatsapp.com/send?text=" + encodeURIComponent(hi ? "क्रेडिट कार्ड का 42% ब्याज जाल समझें और 6 महीने की EMI में हज़ारों रुपये बचाएँ: https://sahifayda.pages.dev/" : "Escape the 42% credit card minimum due trap - calculator: https://sahifayda.pages.dev/")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whatsapp-share-btn"
                  >
                    <span>📲</span> {hi ? 'WhatsApp पर शेयर करें' : 'Share on WhatsApp'}
                  </a>
                </div>
              </div>
            )}

            {topic === 'student_cards' && (
              <div className="tool-wrapper">
                <div className="tool-benefit-strip student">
                  <span className="benefit-icon">🎓</span>
                  <div>
                    <strong>{hi ? 'बिना सैलरी स्लिप के 100% गारंटीड स्टूडेंट क्रेडिट कार्ड' : '100% guaranteed student credit cards with zero income proof'}</strong>
                    <small>{hi ? 'FD-based कार्ड + CIBIL बिल्ड करने का रोडमैप' : 'FD-secured cards + roadmap to build 750 CIBIL score'}</small>
                  </div>
                </div>
                <StudentCardFinder language={language} />
                <div style={{ textAlign: 'center', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                  <a
                    href={"https://api.whatsapp.com/send?text=" + encodeURIComponent(hi ? "कॉलेज छात्रों और बिना सैलरी वालों के लिए 100% गारंटीड क्रेडिट कार्ड: https://sahifayda.pages.dev/" : "Guaranteed student credit cards with zero income proof: https://sahifayda.pages.dev/")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whatsapp-share-btn"
                  >
                    <span>📲</span> {hi ? 'WhatsApp पर शेयर करें' : 'Share on WhatsApp'}
                  </a>
                </div>
              </div>
            )}

            {topic === 'emergency_fund' && (
              <div className="tool-wrapper">
                <div className="tool-benefit-strip" style={{ background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)', borderColor: '#fecaca', borderLeftColor: '#dc2626' }}>
                  <span className="benefit-icon">💰</span>
                  <div>
                    <strong>{hi ? 'नौकरी जाने या मेडिकल इमरजेंसी के लिए कितने पैसे चाहिए?' : 'How much emergency money do you need for job loss or medical crisis?'}</strong>
                    <small>{hi ? '6-12 महीने के खर्च का फ़ंड + स्मार्ट निवेश रणनीति' : 'Calculate 6-12 months expenses fund + smart allocation strategy'}</small>
                  </div>
                </div>
                <EmergencyFundCalculator language={language} />
                <div style={{ textAlign: 'center', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                  <a
                    href={"https://api.whatsapp.com/send?text=" + encodeURIComponent(hi ? "आपातकालीन फ़ंड कैलकुलेटर - पता करें कि आपको कितनी इमरजेंसी राशि चाहिए: https://sahifayda.pages.dev/emergency-fund/" : "Emergency Fund Calculator - Find out how much you need: https://sahifayda.pages.dev/emergency-fund/")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whatsapp-share-btn"
                  >
                    <span>📲</span> {hi ? 'WhatsApp पर शेयर करें' : 'Share on WhatsApp'}
                  </a>
                </div>
              </div>
            )}

            {topic === 'car_vs_uber' && (
              <div className="tool-wrapper">
                <div className="tool-benefit-strip" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', borderColor: '#bfdbfe', borderLeftColor: '#3b82f6' }}>
                  <span className="benefit-icon">🚗</span>
                  <div>
                    <strong>{hi ? 'कार खरीदें या Uber/Ola इस्तेमाल करें? 5 साल की असली लागत' : 'Buy a car or use Uber/Ola? See the TRUE 5-year cost comparison'}</strong>
                    <small>{hi ? 'EMI + पेट्रोल + पार्किंग vs मेट्रो + राइड-शेयरिंग की पूरी तुलना' : 'EMI + fuel + parking vs Metro + ride-sharing full breakdown'}</small>
                  </div>
                </div>
                <CarVsUberCalculator language={language} />
                <div style={{ textAlign: 'center', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                  <a
                    href={"https://api.whatsapp.com/send?text=" + encodeURIComponent(hi ? "कार vs Uber कैलकुलेटर - 5 साल में कितनी बचत होगी देखें: https://sahifayda.pages.dev/car-vs-uber/" : "Car vs Uber Calculator - See how much you can save: https://sahifayda.pages.dev/car-vs-uber/")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whatsapp-share-btn"
                  >
                    <span>📲</span> {hi ? 'WhatsApp पर शेयर करें' : 'Share on WhatsApp'}
                  </a>
                </div>
              </div>
            )}

            {topic === 'home_loan' && (
              <div className="tool-wrapper">
                <div className="tool-benefit-strip" style={{ background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)', borderColor: '#d8b4fe', borderLeftColor: '#a855f7' }}>
                  <span className="benefit-icon">🏠</span>
                  <div>
                    <strong>{hi ? 'घर खरीदें या किराये में रहें? EMI vs किराया की पूरी तुलना' : 'Buy home or stay on rent? Complete EMI vs Rent comparison'}</strong>
                    <small>{hi ? 'ब्रेक-ईवन पॉइंट, छिपी लागत, निवेश विकल्प — सबकुछ शामिल' : 'Break-even point, hidden costs, investment alternatives — all included'}</small>
                  </div>
                </div>
                <HomeLoanCalculator language={language} />
                <div style={{ textAlign: 'center', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                  <a
                    href={"https://api.whatsapp.com/send?text=" + encodeURIComponent(hi ? "घर लें या किराये में रहें? इस कैलकुलेटर से जानें: https://sahifayda.pages.dev/home-loan-calculator/" : "Buy or Rent? Find out with this calculator: https://sahifayda.pages.dev/home-loan-calculator/")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whatsapp-share-btn"
                  >
                    <span>📲</span> {hi ? 'WhatsApp पर शेयर करें' : 'Share on WhatsApp'}
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="other-tools-quick-links">
            <span>{hi ? 'अन्य टूल्स:' : 'Other tools:'}</span>
            {topic !== 'card_offers' && (
              <button onClick={() => setTopic('card_offers')} className="quick-tool-link">
                📱 {hi ? 'शॉपिंग' : 'Shopping'}
              </button>
            )}
            {topic !== 'debt_trap' && (
              <button onClick={() => setTopic('debt_trap')} className="quick-tool-link">
                🛑 {hi ? 'क़र्ज़' : 'Debt'}
              </button>
            )}
            {topic !== 'student_cards' && (
              <button onClick={() => setTopic('student_cards')} className="quick-tool-link">
                🎓 {hi ? 'स्टूडेंट' : 'Student'}
              </button>
            )}
            {topic !== 'emergency_fund' && (
              <button onClick={() => setTopic('emergency_fund')} className="quick-tool-link">
                💰 {hi ? 'फ़ंड' : 'Fund'}
              </button>
            )}
            {topic !== 'car_vs_uber' && (
              <button onClick={() => setTopic('car_vs_uber')} className="quick-tool-link">
                🚗 {hi ? 'कार' : 'Car'}
              </button>
            )}
            {topic !== 'home_loan' && (
              <button onClick={() => setTopic('home_loan')} className="quick-tool-link">
                🏠 {hi ? 'होम लोन' : 'Home Loan'}
              </button>
            )}
          </div>
        </div>
      </section>
   <section className="approach wrap" id="approach"><div className="approach-visual"><span className="small-label">{hi?'पूरी तस्वीर देखें':'LOOK AT THE WHOLE PICTURE'}</span><div className="quote-visual"><div><small>{hi?'कोटेशन A':'Quote A'}</small><strong>₹55,000</strong><hr/><span><em>{hi?'डाउन':'Down'}</em><b>₹10,000</b></span><span><em>EMI × 12</em><b>₹3,500</b></span><span><em>{hi?'शुल्क':'Fees'}</em><b>₹3,000</b></span></div><span className="vs">{hi?'बनाम':'vs'}</span><div><small>{hi?'कोटेशन B':'Quote B'}</small><strong>₹53,000</strong><hr/><span><em>{hi?'डाउन':'Down'}</em><b>₹15,000</b></span><span><em>EMI × 12</em><b>₹2,900</b></span><span><em>{hi?'शुल्क':'Fees'}</em><b>₹3,200</b></span></div></div><p className="illustration-label">{hi?'छोटी EMI का कुल भुगतान अधिक हो सकता है। सारे आँकड़े भरें, फिर तुलना करें।':'A smaller EMI can mean a higher total. Enter all the numbers, then compare.'}</p></div><div className="approach-copy"><span className="eyebrow muted">{t.methodKicker}</span><h2>{t.method}</h2><p>{t.methodText}</p><ul>{t.methodItems.map(item=><li key={item}><Check size={19}/>{item}</li>)}</ul></div></section>
   
   <section className="services-directory wrap" id="services">
    <div className="section-heading" style={{textAlign:'center',marginBottom:'32px'}}>
      <div>
        <span className="eyebrow muted">{hi?'सभी सेवाएँ खोजें':'BROWSE ALL SERVICES'}</span>
        <h2 style={{marginTop:'12px'}}>{hi?'आपको क्या चाहिए?':'What are you looking for?'}</h2>
        <p style={{marginTop:'10px'}}>{hi?'खाते, कार्ड, लोन, बीमा और रोज़मर्रा की सेवाएँ — सभी एक जगह।':'Accounts, cards, loans, insurance & everyday services — all in one place.'}</p>
      </div>
    </div>
    <ServiceShortcuts language={language} onSia={()=>open('sia')} onTool={open} availability={availability}/>
   </section>

   <section className="approach wrap" id="approach">
    <div className="approach-visual">
      <span className="small-label">{hi?'पूरी तस्वीर देखें':'LOOK AT THE WHOLE PICTURE'}</span>
      <div className="quote-visual">
        <div>
          <small>{hi?'कोटेशन A':'QUOTE A'}</small>
          <strong>₹3,400<em> / {hi?'माह':'mo'}</em></strong>
          <p>24 {hi?'महीने':'months'}</p>
          <hr/>
          <span>{hi?'कुल':'Total'} <b>₹1,13,600</b></span>
        </div>
        <span className="vs">vs</span>
        <div>
          <small>{hi?'कोटेशन B':'QUOTE B'}</small>
          <strong>₹2,500<em> / {hi?'माह':'mo'}</em></strong>
          <p>36 {hi?'महीने':'months'}</p>
          <hr/>
          <span>{hi?'कुल':'Total'} <b>₹1,21,000</b></span>
        </div>
      </div>
      <p className="illustration-label">{hi?'काल्पनिक उदाहरण · ₹30,000 शुरुआती भुगतान; A में ₹2,000 और B में ₹1,000 अलग शुल्क शामिल।':'Hypothetical · Includes ₹30,000 down payment; separate fees of ₹2,000 for A and ₹1,000 for B.'}</p>
    </div>
    <div className="approach-copy">
      <span className="eyebrow muted">{t.methodKicker}</span>
      <h2>{t.method}</h2>
      <p>{t.methodText}</p>
      <ul>{t.methodItems.map(item=><li key={item}><Check size={19}/>{item}</li>)}</ul>
    </div>
   </section>
   
   <section className="guides wrap" id="guides"><div className="section-heading"><div><span className="eyebrow muted">{hi?'समझें, फिर फ़ैसला लें':'GOOD TO KNOW'}</span><h2>{t.guideTitle}</h2><p>{t.guideSub}</p></div><BookOpen size={31} strokeWidth={1.2}/></div><p><a className="product-library-link" href={hi?'/hi/guides/':'/guides/'}>{hi?'खाते, कार्ड, लोन, डीमैट और बीमा की सभी गाइड':'All guides: accounts, cards, loans, demat & insurance'} →</a></p><div className="guide-grid">{t.guideCards.map((g,i)=><a className="guide-card" href={guidePath(['emi-total-cost','monthly-budget','upi-payment-pending'][i],language)} key={g[0]}><div className={`guide-cover guide-cover-${i}`}>{i===0?<><Scale size={64} strokeWidth={1}/><span>24 <i>↔</i> 36</span></>:i===1?<><Wallet size={60} strokeWidth={1}/><span>₹ <i>+</i> ₹</span></>:<><ReceiptText size={60} strokeWidth={1}/><span>••• <Check size={23}/></span></>}</div><span className="small-label">{g[0]}</span><h3>{g[1]}<ArrowUpRight size={19}/></h3><p>{g[2]}</p></a>)}</div></section>
   <section className="closing wrap"><Sparkles size={27}/><div><h2>{hi?'अगला फ़ैसला, थोड़ी और समझ के साथ।':'Your next decision, with a little more clarity.'}</h2><p>{hi?'शुरुआत अपने महीने के सरल हिसाब से करें।':'Start with a simple picture of your month.'}</p></div><button className="primary" onClick={()=>open('monthly')}>{t.primary}<ArrowUpRight size={19}/></button></section>
   <ProductLibraryLinks language={language}/>
   <PartnerLinks language={language}/>
  </main>
  <footer className="footer"><div className="wrap"><InstallApp hi={hi}/></div><div className="wrap"><div className="footer-top"><div><a href={hi?'/hi/':'/'} className="logo"><span className="logo-mark"><TrendingUp size={22}/></span>Sahi<span>Fayda</span></a><p>{t.footer}</p></div><div className="footer-links"><button onClick={()=>open('privacy')}>{t.privacy}</button><button onClick={()=>open('about')}>{t.about}</button><button onClick={()=>open('setup')}>{t.admin}</button></div></div><p className="disclosure">{education.footer}</p><button className="education-footer-link" onClick={()=>open('limitations')}>{education.more}</button><div className="footer-bottom"><span>© 2026 SahiFayda</span><span>{t.footerNote}</span></div></div></footer>
  <button className="sia-launcher" onClick={()=>open('sia')} aria-haspopup="dialog" aria-label={hi?'SIA गाइड खोलें':'Open SIA guide'}><span className="sia-avatar"><Sparkles size={21}/></span><span><strong>{hi?'SIA से मदद लें':'Ask SIA'}</strong><small>{hi?'टूल गाइड':'Tool guide'}</small></span><MessageCircle size={18}/></button>
  {active!==null&&<div className="modal-backdrop" onClick={e=>{if(e.target===e.currentTarget&&!busy)setActive(null);}}><section className={`modal ${active==='compare'?'wide':''} ${active==='sia'?'sia-chat-modal':''}`} role="dialog" aria-modal="true" aria-labelledby="modal-title" ref={panel}><div className="modal-header"><span className="tiny-logo"><TrendingUp size={19}/></span><span>SahiFayda</span><button ref={closeButton} onClick={()=>setActive(null)} aria-label={t.close}><X size={22}/></button></div><h2 id="modal-title">{toolIndex>=0?t.modalTitles[toolIndex]:active==='limitations'?education.title:active==='directory'?(hi?`सभी ${toolCount} उपलब्ध टूल`:`All ${toolCount} available tools`):active==='sia'?(hi?'SIA — अपनी बात कहें':'SIA — tell me what’s wrong'):active==='privacy'?t.privacyTitle:active==='setup'?t.setupTitle:active==='about'?t.aboutTitle:active==='borrowing'?t.guideCards[0][1]:t.guideCards[1][1]}</h2>
   {(active==='monthly'||active==='compare'||(active==='guidance'&&topic===2))&&<aside className="calculation-notice" aria-label={education.heading}><strong>{education.heading}</strong><p>{education.notice}</p><details className="notice-details"><summary>{education.more}</summary><ul>{education.points.map(point=><li key={point}>{point}</li>)}</ul></details></aside>}
   {active==='limitations'&&<div className="education-details"><p className="modal-intro">{education.notice}</p><ol>{education.points.map(point=><li key={point}>{point}</li>)}</ol></div>}
   {active==='monthly'&&<><p className="modal-intro">{t.approx}</p><form onSubmit={calculate}><div className="input-grid">{[t.incomeLabel,...t.expenseLabels].map((label,i)=><label key={label}>{label}<div className="input-wrap"><span>₹</span><input type="number" min="0" max="10000000000" step="0.01" required value={budget[i]} onChange={e=>{setBudget(budget.map((v,j)=>j===i?e.target.value:v));setResult(null);}}/></div></label>)}</div><div className="form-actions"><button type="submit" className="primary" disabled={busy}>{busy?t.loading:t.calculate}<ArrowRight size={18}/></button><button type="button" className="plain" onClick={()=>{setBudget(initialBudget);setResult(null);setError('');}}>{t.reset}</button></div></form>{result&&<div className={`result ${result.balance<0?'negative':''}`} aria-live="polite"><p className="result-education">{education.result}</p><span className="small-label">{t.result}</span><div className="result-line"><span>{t.total}</span><strong>{money(result.total)}</strong></div><div className="result-main"><span>{result.balance>=0?t.balance:t.deficit}</span><strong>{money(Math.abs(result.balance))}</strong></div><div className="spending-bar"><span style={{width:`${Math.min(100,result.share*100)}%`}}/></div><p>{result.balance>=0?t.budgetPositive:t.budgetNegative}</p></div>}</>}
   {active==='compare'&&<><p className="modal-intro">{t.compareNote}</p><form onSubmit={calculate}><div className="quote-inputs">{quotes.map((q,i)=><fieldset key={i}><legend>{t.quote} {i===0?'A':'B'}</legend>{[['down',t.down],['emi',t.emi],['months',t.months],['fees',t.fees]].map(([key,label])=><label key={key}>{label}<div className="input-wrap"><span>{key==='months'?'#':'₹'}</span><input type="number" required min={key==='months'?1:0} max={key==='months'?600:10000000000} step={key==='months'?1:0.01} value={q[key]} onChange={e=>{setQuotes(quotes.map((v,j)=>j===i?{...v,[key]:e.target.value}:v));setResult(null);}}/></div></label>)}</fieldset>)}</div><button className="primary" disabled={busy}>{busy?t.loading:t.calculate}<ArrowRight size={18}/></button></form>{result&&<div className="result" aria-live="polite"><p className="result-education">{education.result}</p><div className="result-line"><span>{t.quote} A</span><strong>{money(result[0].total)}</strong></div><div className="result-line"><span>{t.quote} B</span><strong>{money(result[1].total)}</strong></div><div className="result-main"><span>{t.difference}</span><strong>{money(Math.abs(result[0].total-result[1].total))}</strong></div><p>{result[0].total===result[1].total?t.equal:`${t.quote} ${result[0].total<result[1].total?'A':'B'} ${t.lower}`}</p></div>}<p className="note">{t.quoteNote}</p></>}
   {active==='guidance'&&(guidanceReady?<><label className="topic-label">{t.guidePick}<select value={topic} onChange={e=>setTopic(Number(e.target.value))}>{t.topics.map((s,i)=><option value={i} key={s}>{s}</option>)}</select></label><ol className="steps">{guideContent[language][topic].map((s,i)=><li key={s}><span>{i+1}</span><p>{s}</p></li>)}</ol><p className="note">{hi?'संदर्भ:':'Reference:'} <a href="https://www.npci.org.in/what-we-do/upi/faqs" target="_blank" rel="noreferrer">NPCI UPI FAQ ↗</a> · <a href="https://www.rbi.org.in/" target="_blank" rel="noreferrer">RBI ↗</a><br/>{hi?'सही प्रक्रिया लेन-देन और बैंक पर निर्भर है। धनवापसी की गारंटी नहीं। PIN, OTP या कार्ड विवरण साझा न करें।':'The process depends on your transaction and bank. No refund guarantee. Never share PINs, OTPs or full card details.'}</p></>:!error&&<p className="modal-intro" role="status">{t.loading}</p>)}
   {active==='directory'&&<><p className="modal-intro">{hi?'हर टूल के नीचे उसका काम लिखा है। किसी भी टूल को सीधे खोलें।':'See what each tool does and open it directly.'}</p><div className="directory-list">{visibleIndexes.map(i=>{const card=t.cards[i],Icon=icons[i];return <button key={toolIds[i]} onClick={()=>open(toolIds[i])}><Icon size={25}/><span><strong>{card[1]}</strong><p>{card[2]}</p></span><ArrowUpRight size={19}/></button>;})}</div><button className="plain" style={{marginTop:20}} onClick={()=>open('sia')}>{hi?'अभी भी तय नहीं? SIA गाइड खोलें।':'Not sure which one? Open the SIA guide.'}</button></>}
   {active==='sia'&&<SiaLive language={language}/>}
   {active==='privacy'&&<p className="modal-intro">{t.privacyText}</p>}
   {active==='about'&&<p className="modal-intro">{t.aboutText}</p>}
   {active==='setup'&&<><span className="setup-badge"><ShieldCheck size={17}/>{hi?'Supabase जुड़ा है':'Supabase connected'}</span><p className="modal-intro">{t.setupText}</p><p className="note">{hi?'यह एडमिन पैनल नहीं है।':'This is a setup summary, not an admin console.'}</p></>}
   {active==='borrowing'&&<><p className="modal-intro">{t.methodText}</p><p>{t.compareNote}</p><p className="note">{t.quoteNote}</p><button className="primary" onClick={()=>open('compare')}>{t.cards[1][3]}<ArrowRight size={18}/></button></>}
   {active==='budget-guide'&&<><p className="modal-intro">{t.approx}</p><p>{t.budgetPositive}</p><button className="primary" onClick={()=>open('monthly')}>{t.cards[0][3]}<ArrowRight size={18}/></button></>}
   {error&&<p className="error" role="alert">{error}</p>}
   {(active==='monthly'||active==='compare')&&<p className="private-note"><LockKeyhole size={14}/>{t.strip[0]}</p>}
  </section></div>}
 </>;
}
