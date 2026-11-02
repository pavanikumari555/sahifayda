'use client';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight, ArrowUpRight, BadgeCheck, BookOpen, Car, CreditCard, GraduationCap, Home as HomeIcon, Landmark,
  LifeBuoy, LockKeyhole, Menu, MessageCircle, Mic, Moon, Scale, Search, Send, ShieldCheck, ShoppingBag,
  Smartphone, Sparkles, Sun, TrendingUp, Wallet, Banknote, X, AlertTriangle
} from 'lucide-react';
import SmartCardOfferCalculator from './SmartCardOfferCalculator';
import CreditCardDebtTrapCalculator from './CreditCardDebtTrapCalculator';
import StudentCardFinder from './StudentCardFinder';
import EmergencyFundCalculator from './EmergencyFundCalculator';
import CarVsUberCalculator from './CarVsUberCalculator';
import HomeLoanCalculator from './HomeLoanCalculator';
import InstallApp from './install-app';
import PartnerLinks from './partner-links';
import SiaLive from './sia-live';
import { guides, guideSlugs, guidePath } from '../lib/guides.mjs';
import { directoryCategories } from '../lib/product-directory.mjs';
import { educationCopy } from '../lib/education-copy.mjs';
import './products.css';
import './home.css';

// Calculators shown on the homepage. `path` is the dedicated page (English); Hindi adds /hi.
const tools = [
  { id: 'home_loan', icon: HomeIcon, color: '#7c3aed', path: '/home-loan-calculator/', Component: HomeLoanCalculator,
    en: ['Home loan or rent?', 'See EMI, total interest, extra costs and how buying compares with renting.'],
    hi: ['घर खरीदें या किराया?', 'EMI, कुल ब्याज, अतिरिक्त खर्च और खरीदने बनाम किराये की तुलना देखें।'] },
  { id: 'emergency_fund', icon: LifeBuoy, color: '#e11d48', path: '/emergency-fund/', Component: EmergencyFundCalculator,
    en: ['Emergency fund', 'How much money to keep aside for a job loss or medical need, and how fast you can build it.'],
    hi: ['आपातकालीन फ़ंड', 'नौकरी छूटने या बीमारी के लिए कितना पैसा अलग रखें और कितने समय में जमा होगा।'] },
  { id: 'debt_trap', icon: AlertTriangle, color: '#dc2626', path: '/debt-trap-calculator/', Component: CreditCardDebtTrapCalculator, props: { initialBill: 50000 },
    en: ['Credit card bill', 'Compare paying only the minimum due with converting the bill to an EMI.'],
    hi: ['क्रेडिट कार्ड बिल', 'सिर्फ़ न्यूनतम देय भरने और बिल को EMI में बदलने के खर्च की तुलना करें।'] },
  { id: 'card_offers', icon: ShoppingBag, color: '#059669', path: null, Component: SmartCardOfferCalculator, props: { initialPrice: 30000, initialCategory: 'mobile' },
    en: ['Card offers on shopping', 'Estimate cashback and bank discounts on a phone, laptop or appliance purchase.'],
    hi: ['खरीदारी पर कार्ड ऑफ़र', 'फ़ोन, लैपटॉप या घरेलू सामान की खरीद पर कैशबैक और बैंक छूट का अनुमान।'] },
  { id: 'student_cards', icon: GraduationCap, color: '#2563eb', path: '/student-credit-cards/', Component: StudentCardFinder,
    en: ['First credit card', 'No salary slip or credit history? Understand FD-backed cards, limits and fees.'],
    hi: ['पहला क्रेडिट कार्ड', 'सैलरी स्लिप या क्रेडिट इतिहास नहीं? FD वाले कार्ड, लिमिट और शुल्क समझें।'] },
  { id: 'car_vs_uber', icon: Car, color: '#0891b2', path: '/car-vs-uber/', Component: CarVsUberCalculator,
    en: ['Car or cab?', 'Compare 5-year cost of owning a car with using Uber/Ola and the metro.'],
    hi: ['कार या कैब?', 'कार रखने और Uber/Ola व मेट्रो से चलने के 5 साल के खर्च की तुलना।'] },
];

const services = [
  ['savings_account', Wallet, 'Savings accounts', 'बचत खाते'],
  ['demat', TrendingUp, 'Demat & trading', 'डीमैट और ट्रेडिंग'],
  ['credit_card', CreditCard, 'Credit cards', 'क्रेडिट कार्ड'],
  ['loan', Landmark, 'Loans', 'लोन'],
  ['insurance', ShieldCheck, 'Insurance', 'बीमा'],
  ['credit_line', Banknote, 'Credit line', 'क्रेडिट लाइन'],
  ['other', Smartphone, 'Apps & services', 'ऐप और सेवाएँ'],
  ['shopping', ShoppingBag, 'Shopping offers', 'खरीदारी ऑफ़र'],
];

const copy = {
  en: {
    nav: { tools: 'Calculators', services: 'Services', guides: 'Guides', sia: 'Ask SIA' },
    langSwitch: 'हिन्दी', themeDark: 'Switch to dark theme', themeLight: 'Switch to light theme', menu: 'Menu',
    eyebrow: 'Free · No sign-up · English & हिन्दी',
    title: <>Money decisions,<br/><em>made simple.</em></>,
    subtitle: 'Compare accounts, cards, loans and insurance in plain language. Use free calculators, or just ask SIA your question.',
    askLabel: 'Ask SIA a money question',
    askPlaceholder: 'e.g. I need a zero-balance savings account',
    askButton: 'Ask',
    askHint: 'Type in Hindi, English or Hinglish. Please don’t share OTP, PIN or account numbers.',
    examples: [
      ['Zero-balance account', 'मुझे ज़ीरो बैलेंस सेविंग अकाउंट चाहिए'],
      ['Card with ₹30,000 income', 'credit card lena hai, income 30000 per month'],
      ['Demat F&O brokerage', 'demat account with low F&O brokerage'],
      ['₹10 lakh business loan', 'मुझे 10 लाख का बिज़नेस लोन चाहिए'],
    ],
    servicesTitle: 'Explore services',
    servicesSub: 'Fees, conditions and how to apply',
    allServices: 'All services and comparisons',
    trust: ['100% free to use', 'No sign-up needed', 'Your numbers stay in your browser', 'Commission never changes our ranking'],
    toolsKicker: 'FREE CALCULATORS',
    toolsTitle: 'Pick a calculator. Get your answer in a minute.',
    toolsSub: 'Every calculator opens with example numbers. Change them to your own and the result updates instantly.',
    useTool: 'Use calculator',
    selected: 'Open below',
    fullPage: 'Open full page',
    share: 'Share on WhatsApp',
    shareText: (name, url) => `Try this free ${name} calculator on SahiFayda: ${url}`,
    stepsKicker: 'HOW IT WORKS',
    stepsTitle: 'Three simple steps',
    steps: [
      ['Choose your question', 'Pick a calculator or a service above, or describe your problem to SIA in your own words.'],
      ['Enter your numbers', 'Examples are already filled in. Replace them with your own amounts. Nothing is saved.'],
      ['Understand, then decide', 'See the result with its assumptions, read the simple guide, and compare fees before you apply anywhere.'],
    ],
    siaKicker: 'MEET SIA',
    siaTitle: 'Your money helper that speaks your language',
    siaText: 'Describe your need the way you would tell a friend. SIA asks one useful question at a time and answers from reviewed product information.',
    siaPoints: [
      'Understands Hindi, English and Hinglish',
      'Voice typing: speak, check the text, then send',
      'Shows fees and conditions, with a link to full details',
      'No sign-up, and your chat is not stored',
    ],
    siaCta: 'Chat with SIA',
    siaDemoUser: 'credit card lena hai, income 30000 per month',
    siaDemoReply: 'Got it, ₹30,000 a month. Will you pay the full bill every month, and do you prefer no annual fee or more rewards?',
    guidesKicker: 'SIMPLE GUIDES',
    guidesTitle: 'Read a little. Understand a lot.',
    guidesSub: 'Short explainers in plain language, with official sources.',
    allGuides: 'All guides',
    readGuide: 'Read guide',
    promiseKicker: 'OUR PROMISE',
    promiseTitle: 'Honest information you can check',
    promise: [
      [Scale, 'Ranking stays independent', 'Options are ordered by what you asked for. A partner paying us commission does not move it up.'],
      [BadgeCheck, 'Sources and dates shown', 'Product facts link to the official page and show when we last reviewed them.'],
      [LockKeyhole, 'Your data stays with you', 'Calculator numbers never leave your browser. SIA chats are not saved.'],
    ],
    faqTitle: 'Common questions',
    faq: [
      ['Is SahiFayda free?', 'Yes. All calculators, guides and SIA are free. You do not need an account.'],
      ['How does SahiFayda earn money?', 'Some “Click here to apply” links are partner links. If you open an account or buy through them, the partner may pay us a commission. You pay nothing extra, and it does not change how options are ranked.'],
      ['Is this financial advice?', 'No. SahiFayda gives educational calculations and general information. The bank, lender or insurer decides actual charges, rates and approval.'],
      ['Do you save my numbers or chats?', 'Calculator inputs stay in your browser tab and clear when you refresh. SIA conversations are kept only in memory while the chat is open.'],
      ['Can I use it in Hindi?', 'Yes. Every page is available in Hindi and English, and SIA replies in the language you write in.'],
    ],
    footerTag: 'Make everyday money make sense.',
    footerTools: 'Calculators', footerServices: 'Services', footerLearn: 'Learn', footerAbout: 'About',
    privacy: 'Privacy', about: 'About us', limits: 'Scope & limitations', allGuidesLink: 'All guides', allServicesLink: 'All services',
    footerNote: 'Commercial links are labelled and disclosed.',
    close: 'Close',
    siaModal: 'SIA: tell me what you need',
    privacyTitle: 'Your data, your control',
    privacyText: 'Calculator inputs are processed in this browser tab. They are not sent to SahiFayda, Supabase or any AI service, and they clear when you refresh. When you send a message to SIA, your typed question and a few recent messages are sent to answer it; SahiFayda does not store these conversations. Common questions are answered from reviewed information without an AI request. Partner link clicks are counted with a random ID, not your personal details. If you choose to submit the optional application-help form, the name or mobile number you give is kept privately for the owner to help you, for up to 90 days, and is never sent to SIA or analytics. Voice typing may be processed by your browser’s speech service; SahiFayda does not save audio. Your theme choice is saved on this device.',
    aboutTitle: 'About SahiFayda',
    aboutText: 'SahiFayda helps people in India understand everyday money decisions: savings accounts, credit cards, loans, demat accounts, insurance and shopping offers. We explain fees and conditions in simple Hindi and English, link to official sources, and offer free calculators. Some application links are partner links that may earn us a commission; they are always labelled, and they never decide how options are ranked.',
  },
  hi: {
    nav: { tools: 'कैलकुलेटर', services: 'सेवाएँ', guides: 'गाइड', sia: 'SIA से पूछें' },
    langSwitch: 'English', themeDark: 'डार्क थीम चालू करें', themeLight: 'लाइट थीम चालू करें', menu: 'मेन्यू',
    eyebrow: 'मुफ़्त · साइन-अप नहीं · हिन्दी और English',
    title: <>पैसों के फ़ैसले,<br/><em>अब आसान।</em></>,
    subtitle: 'खाते, कार्ड, लोन और बीमा की शर्तें आसान भाषा में समझें और तुलना करें। मुफ़्त कैलकुलेटर इस्तेमाल करें या सीधे SIA से अपना सवाल पूछें।',
    askLabel: 'SIA से पैसों से जुड़ा सवाल पूछें',
    askPlaceholder: 'जैसे: मुझे ज़ीरो बैलेंस सेविंग खाता चाहिए',
    askButton: 'पूछें',
    askHint: 'हिन्दी, English या Hinglish में लिखें। OTP, PIN या खाता नंबर साझा न करें।',
    examples: [
      ['ज़ीरो बैलेंस खाता', 'मुझे ज़ीरो बैलेंस सेविंग अकाउंट चाहिए'],
      ['₹30,000 आय पर कार्ड', 'मुझे क्रेडिट कार्ड चाहिए, मेरी आय 30000 महीना है'],
      ['डीमैट F&O ब्रोकरेज', 'कम F&O ब्रोकरेज वाला डीमैट खाता बताइए'],
      ['₹10 लाख बिज़नेस लोन', 'मुझे 10 लाख का बिज़नेस लोन चाहिए'],
    ],
    servicesTitle: 'सेवाएँ देखें',
    servicesSub: 'शुल्क, शर्तें और आवेदन का तरीका',
    allServices: 'सभी सेवाएँ और तुलना',
    trust: ['पूरी तरह मुफ़्त', 'साइन-अप ज़रूरी नहीं', 'आपके आँकड़े आपके ब्राउज़र में ही रहते हैं', 'कमीशन से हमारी रैंकिंग नहीं बदलती'],
    toolsKicker: 'मुफ़्त कैलकुलेटर',
    toolsTitle: 'कैलकुलेटर चुनें, एक मिनट में जवाब पाएँ।',
    toolsSub: 'हर कैलकुलेटर में उदाहरण के आँकड़े पहले से भरे हैं। अपने आँकड़े डालें, नतीजा तुरंत बदल जाएगा।',
    useTool: 'कैलकुलेटर खोलें',
    selected: 'नीचे खुला है',
    fullPage: 'पूरा पेज खोलें',
    share: 'WhatsApp पर शेयर करें',
    shareText: (name, url) => `सहीफ़ायदा का यह मुफ़्त "${name}" कैलकुलेटर देखें: ${url}`,
    stepsKicker: 'कैसे काम करता है',
    stepsTitle: 'तीन आसान कदम',
    steps: [
      ['अपना सवाल चुनें', 'ऊपर से कोई कैलकुलेटर या सेवा चुनें, या SIA को अपनी बात अपने शब्दों में बताएँ।'],
      ['अपने आँकड़े भरें', 'उदाहरण के आँकड़े पहले से भरे हैं। उनकी जगह अपनी रकम डालें। कुछ भी सेव नहीं होता।'],
      ['समझें, फिर फ़ैसला लें', 'नतीजा और उसकी मान्यताएँ देखें, आसान गाइड पढ़ें, और कहीं भी आवेदन से पहले शुल्क की तुलना करें।'],
    ],
    siaKicker: 'मिलिए SIA से',
    siaTitle: 'आपकी भाषा में बात करने वाली पैसों की मददगार',
    siaText: 'अपनी ज़रूरत वैसे ही बताइए जैसे किसी दोस्त को बताते हैं। SIA एक बार में एक ज़रूरी सवाल पूछती है और जाँची गई जानकारी से जवाब देती है।',
    siaPoints: [
      'हिन्दी, English और Hinglish समझती है',
      'बोलकर लिखें: बोलें, लिखा हुआ जाँचें, फिर भेजें',
      'शुल्क और शर्तें दिखाती है, पूरी जानकारी के लिंक के साथ',
      'साइन-अप नहीं, और आपकी बातचीत सेव नहीं होती',
    ],
    siaCta: 'SIA से बात करें',
    siaDemoUser: 'मुझे क्रेडिट कार्ड चाहिए, आय 30000 महीना है',
    siaDemoReply: 'ठीक है, महीने की आय ₹30,000। क्या आप हर महीने पूरा बिल भरेंगे, और आपको बिना सालाना शुल्क वाला कार्ड चाहिए या ज़्यादा रिवॉर्ड वाला?',
    guidesKicker: 'आसान गाइड',
    guidesTitle: 'थोड़ा पढ़ें, ज़्यादा समझें।',
    guidesSub: 'आसान भाषा में छोटी जानकारी, आधिकारिक स्रोतों के साथ।',
    allGuides: 'सभी गाइड',
    readGuide: 'गाइड पढ़ें',
    promiseKicker: 'हमारा वादा',
    promiseTitle: 'ईमानदार जानकारी, जिसे आप खुद जाँच सकें',
    promise: [
      [Scale, 'रैंकिंग निष्पक्ष रहती है', 'विकल्प आपकी ज़रूरत के हिसाब से क्रम में आते हैं। किसी पार्टनर के कमीशन देने से वह ऊपर नहीं आता।'],
      [BadgeCheck, 'स्रोत और तारीख़ दिखती है', 'हर जानकारी आधिकारिक पेज से जुड़ी है और बताती है कि हमने उसे आखिरी बार कब जाँचा।'],
      [LockKeyhole, 'आपका डेटा आपके पास', 'कैलकुलेटर के आँकड़े आपके ब्राउज़र से बाहर नहीं जाते। SIA की बातचीत सेव नहीं होती।'],
    ],
    faqTitle: 'आम सवाल',
    faq: [
      ['क्या सहीफ़ायदा मुफ़्त है?', 'हाँ। सभी कैलकुलेटर, गाइड और SIA मुफ़्त हैं। खाता बनाना ज़रूरी नहीं।'],
      ['सहीफ़ायदा पैसे कैसे कमाता है?', 'कुछ “आवेदन के लिए यहाँ क्लिक करें” लिंक पार्टनर लिंक होते हैं। उनसे खाता खोलने या खरीदने पर पार्टनर हमें कमीशन दे सकता है। आपको कुछ ज़्यादा नहीं देना पड़ता, और इससे विकल्पों का क्रम नहीं बदलता।'],
      ['क्या यह वित्तीय सलाह है?', 'नहीं। सहीफ़ायदा शैक्षिक गणना और सामान्य जानकारी देता है। असली शुल्क, दर और मंज़ूरी बैंक, ऋणदाता या बीमा कंपनी तय करती है।'],
      ['क्या आप मेरे आँकड़े या बातचीत सेव करते हैं?', 'कैलकुलेटर के आँकड़े आपके ब्राउज़र टैब में रहते हैं और रीफ़्रेश करने पर मिट जाते हैं। SIA की बातचीत सिर्फ़ चैट खुली रहने तक मेमोरी में रहती है।'],
      ['क्या मैं इसे हिन्दी में इस्तेमाल कर सकता हूँ?', 'हाँ। हर पेज हिन्दी और English में है, और SIA उसी भाषा में जवाब देती है जिसमें आप लिखते हैं।'],
    ],
    footerTag: 'रोज़ के पैसों की बेहतर समझ।',
    footerTools: 'कैलकुलेटर', footerServices: 'सेवाएँ', footerLearn: 'सीखें', footerAbout: 'जानकारी',
    privacy: 'गोपनीयता', about: 'हमारे बारे में', limits: 'दायरा और सीमाएँ', allGuidesLink: 'सभी गाइड', allServicesLink: 'सभी सेवाएँ',
    footerNote: 'व्यावसायिक लिंक अलग से चिन्हित और बताए जाते हैं।',
    close: 'बंद करें',
    siaModal: 'SIA: अपनी ज़रूरत बताइए',
    privacyTitle: 'आपका डेटा, आपका नियंत्रण',
    privacyText: 'कैलकुलेटर के आँकड़े इसी ब्राउज़र टैब में गिने जाते हैं। ये सहीफ़ायदा, Supabase या किसी AI सेवा को नहीं भेजे जाते, और रीफ़्रेश करने पर मिट जाते हैं। SIA को संदेश भेजने पर आपका लिखा सवाल और हाल के कुछ संदेश जवाब देने के लिए भेजे जाते हैं; सहीफ़ायदा इन बातचीतों को सेव नहीं करता। आम सवालों के जवाब जाँची गई जानकारी से बिना AI अनुरोध के मिलते हैं। पार्टनर लिंक के क्लिक एक random ID से गिने जाते हैं, आपकी निजी जानकारी से नहीं। अगर आप अपनी मर्ज़ी से आवेदन-सहायता फ़ॉर्म भरते हैं, तो दिया गया नाम या मोबाइल नंबर मदद के लिए 90 दिन तक निजी रूप से रखा जाता है और SIA या analytics को कभी नहीं भेजा जाता। बोलकर लिखने की सुविधा आपके ब्राउज़र की speech service से चल सकती है; सहीफ़ायदा ऑडियो सेव नहीं करता। आपकी थीम की पसंद इसी डिवाइस पर सेव रहती है।',
    aboutTitle: 'सहीफ़ायदा के बारे में',
    aboutText: 'सहीफ़ायदा भारत के लोगों को रोज़ के पैसों के फ़ैसले समझने में मदद करता है: बचत खाते, क्रेडिट कार्ड, लोन, डीमैट खाते, बीमा और खरीदारी ऑफ़र। हम शुल्क और शर्तें आसान हिन्दी और English में समझाते हैं, आधिकारिक स्रोतों के लिंक देते हैं और मुफ़्त कैलकुलेटर उपलब्ध कराते हैं। कुछ आवेदन लिंक पार्टनर लिंक होते हैं जिनसे हमें कमीशन मिल सकता है; वे हमेशा चिन्हित रहते हैं और विकल्पों का क्रम कभी तय नहीं करते।',
  },
};

const featuredGuides = ['savings-account', 'credit-card', 'loan-options', 'demat-account', 'insurance-basics', 'emi-total-cost'];

export default function Home({ language }) {
  const hi = language === 'hi';
  const t = copy[hi ? 'hi' : 'en'];
  const education = educationCopy[hi ? 'hi' : 'en'];
  const prefix = hi ? '/hi' : '';
  const [active, setActive] = useState(null);
  const [siaQuestion, setSiaQuestion] = useState('');
  const [ask, setAsk] = useState('');
  const [menu, setMenu] = useState(false);
  const [toolId, setToolId] = useState(tools[0].id);
  const [theme, setTheme] = useState('light');
  const panel = useRef(null), closeButton = useRef(null), lastFocus = useRef(null), toolPanel = useRef(null);

  useEffect(() => { setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'); }, []);
  useEffect(() => { document.documentElement.lang = hi ? 'hi' : 'en'; }, [hi]);
  // Allow deep links such as /#tool-emergency_fund from other pages.
  useEffect(() => {
    const match = window.location.hash.match(/^#tool-([a-z_]+)$/);
    if (match && tools.some(tool => tool.id === match[1])) {
      setToolId(match[1]);
      requestAnimationFrame(() => document.getElementById('tools')?.scrollIntoView({ block: 'start' }));
    }
  }, []);
  useEffect(() => {
    if (active === null) return;
    lastFocus.current = document.activeElement;
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButton.current?.focus();
    function key(e) {
      if (e.key === 'Escape') setActive(null);
      if (e.key === 'Tab') {
        const items = panel.current?.querySelectorAll('button:not([disabled]),a[href],input,select,textarea,[tabindex="0"]');
        if (!items?.length) return;
        const first = items[0], last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener('keydown', key);
    return () => { document.body.style.overflow = old; document.removeEventListener('keydown', key); lastFocus.current?.focus?.(); };
  }, [active]);

  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    try { localStorage.setItem('sahifayda-theme', next); } catch {}
  }
  function openModal(id, question = '') { setMenu(false); setSiaQuestion(question); setActive(id); }
  function submitAsk(event) {
    event.preventDefault();
    const text = ask.trim();
    openModal('sia', text.length >= 3 ? text : '');
    setAsk('');
  }
  function chooseTool(id) {
    setToolId(id);
    requestAnimationFrame(() => toolPanel.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }
  function shareTool(tool) {
    const url = window.location.origin + (tool.path ? prefix + tool.path : prefix + '/#tool-' + tool.id);
    window.open('https://wa.me/?text=' + encodeURIComponent(t.shareText(tool[hi ? 'hi' : 'en'][0], url)), '_blank', 'noopener,noreferrer');
  }

  const current = tools.find(tool => tool.id === toolId) || tools[0];
  const CurrentTool = current.Component;
  const modalTitle = active === 'sia' ? t.siaModal : active === 'privacy' ? t.privacyTitle : active === 'about' ? t.aboutTitle : education.title;

  return <div className="hp">
    <a className="hp-skip" href="#main">{hi ? 'मुख्य सामग्री पर जाएँ' : 'Skip to main content'}</a>
    <header className="hp-header">
      <div className="hp-wrap hp-header-row">
        <a className="hp-logo" href={prefix + '/'} aria-label="SahiFayda home">
          <span className="hp-logo-mark"><TrendingUp size={20} strokeWidth={2.5} aria-hidden="true"/></span>
          <span>Sahi<b>Fayda</b></span>
        </a>
        <nav className={menu ? 'hp-nav open' : 'hp-nav'} aria-label={hi ? 'मुख्य नेविगेशन' : 'Main navigation'}>
          <a href="#tools" onClick={() => setMenu(false)}>{t.nav.tools}</a>
          <a href={prefix + '/products/'}>{t.nav.services}</a>
          <a href={prefix + '/guides/'}>{t.nav.guides}</a>
          <button type="button" className="hp-nav-sia" onClick={() => openModal('sia')}><Sparkles size={16} aria-hidden="true"/>{t.nav.sia}</button>
        </nav>
        <div className="hp-header-actions">
          <button type="button" className="hp-icon-btn" onClick={toggleTheme} aria-label={theme === 'light' ? t.themeDark : t.themeLight} aria-pressed={theme === 'dark'}>
            {theme === 'light' ? <Moon size={18}/> : <Sun size={18}/>}
          </button>
          <a className="hp-lang" href={hi ? '/' : '/hi/'} hrefLang={hi ? 'en' : 'hi'} lang={hi ? 'en' : 'hi'}>{t.langSwitch}</a>
          <button type="button" className="hp-icon-btn hp-menu-btn" aria-label={t.menu} aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X size={20}/> : <Menu size={20}/>}</button>
        </div>
      </div>
    </header>

    <main id="main">
      <section className="hp-hero">
        <div className="hp-wrap hp-hero-grid">
          <div className="hp-hero-copy">
            <span className="hp-eyebrow"><span className="hp-dot" aria-hidden="true"/>{t.eyebrow}</span>
            <h1>{t.title}</h1>
            <p className="hp-hero-sub">{t.subtitle}</p>
            <form className="hp-ask" onSubmit={submitAsk} role="search">
              <label htmlFor="hp-ask-input" className="hp-sr">{t.askLabel}</label>
              <Search size={20} className="hp-ask-icon" aria-hidden="true"/>
              <input id="hp-ask-input" value={ask} maxLength={600} onChange={e => setAsk(e.target.value)} placeholder={t.askPlaceholder} autoComplete="off"/>
              <button type="submit"><span>{t.askButton}</span><Send size={16} aria-hidden="true"/></button>
            </form>
            <p className="hp-ask-hint"><Mic size={13} aria-hidden="true"/>{t.askHint}</p>
            <div className="hp-chips" aria-label={hi ? 'उदाहरण सवाल' : 'Example questions'}>
              {t.examples.map(([label, question]) => <button type="button" key={label} onClick={() => openModal('sia', question)}>{label}</button>)}
            </div>
          </div>
          <div className="hp-services-card">
            <div className="hp-services-head">
              <h2>{t.servicesTitle}</h2>
              <p>{t.servicesSub}</p>
            </div>
            <nav className="hp-services-grid" aria-label={t.servicesTitle}>
              {services.map(([id, Icon, en, hiLabel]) => <a key={id} href={prefix + '/products/' + directoryCategories[id].slug + '/'}>
                <span className="hp-service-icon"><Icon size={22} aria-hidden="true"/></span>
                <span>{hi ? hiLabel : en}</span>
              </a>)}
            </nav>
            <a className="hp-services-all" href={prefix + '/products/'}>{t.allServices}<ArrowRight size={16} aria-hidden="true"/></a>
          </div>
        </div>
      </section>

      <div className="hp-trust">
        <ul className="hp-wrap">
          {t.trust.map((item, index) => { const Icon = [Sparkles, BadgeCheck, LockKeyhole, Scale][index]; return <li key={item}><Icon size={17} aria-hidden="true"/>{item}</li>; })}
        </ul>
      </div>

      <section className="hp-section hp-wrap" id="tools" aria-labelledby="tools-title">
        <div className="hp-heading">
          <span className="hp-kicker">{t.toolsKicker}</span>
          <h2 id="tools-title">{t.toolsTitle}</h2>
          <p>{t.toolsSub}</p>
        </div>
        <div className="hp-tool-grid">
          {tools.map(tool => {
            const Icon = tool.icon, [title, text] = tool[hi ? 'hi' : 'en'], isActive = tool.id === toolId;
            return <button type="button" key={tool.id} className={isActive ? 'hp-tool-card active' : 'hp-tool-card'} style={{ '--c': tool.color }} aria-pressed={isActive} aria-controls="hp-tool-panel" onClick={() => chooseTool(tool.id)}>
              <span className="hp-tool-icon"><Icon size={24} aria-hidden="true"/></span>
              <strong>{title}</strong>
              <span className="hp-tool-text">{text}</span>
              <span className="hp-tool-cta">{isActive ? t.selected : t.useTool}<ArrowRight size={15} aria-hidden="true"/></span>
            </button>;
          })}
        </div>
        <div className="hp-tool-panel" id="hp-tool-panel" ref={toolPanel} style={{ '--c': current.color }} aria-live="polite">
          <div className="hp-tool-panel-head">
            <div>
              <span className="hp-tool-icon small"><current.icon size={20} aria-hidden="true"/></span>
              <h3>{current[hi ? 'hi' : 'en'][0]}</h3>
            </div>
            <div className="hp-tool-actions">
              {current.path && <a href={prefix + current.path}>{t.fullPage}<ArrowUpRight size={15} aria-hidden="true"/></a>}
              <button type="button" onClick={() => shareTool(current)}>{t.share}</button>
            </div>
          </div>
          <CurrentTool key={current.id + language} language={hi ? 'hi' : 'en'} {...(current.props || {})}/>
        </div>
      </section>

      <section className="hp-section hp-steps-band" aria-labelledby="steps-title">
        <div className="hp-wrap">
          <div className="hp-heading center">
            <span className="hp-kicker">{t.stepsKicker}</span>
            <h2 id="steps-title">{t.stepsTitle}</h2>
          </div>
          <ol className="hp-steps">
            {t.steps.map(([title, text], index) => <li key={title}><span className="hp-step-no">{index + 1}</span><h3>{title}</h3><p>{text}</p></li>)}
          </ol>
        </div>
      </section>

      <section className="hp-section hp-wrap hp-sia" aria-labelledby="sia-title">
        <div className="hp-sia-copy">
          <span className="hp-kicker">{t.siaKicker}</span>
          <h2 id="sia-title">{t.siaTitle}</h2>
          <p>{t.siaText}</p>
          <ul>{t.siaPoints.map(point => <li key={point}><BadgeCheck size={18} aria-hidden="true"/>{point}</li>)}</ul>
          <button type="button" className="hp-primary" onClick={() => openModal('sia')}><MessageCircle size={18} aria-hidden="true"/>{t.siaCta}</button>
        </div>
        <div className="hp-sia-demo" aria-hidden="true">
          <div className="hp-demo-top"><span className="hp-demo-avatar"><Sparkles size={16}/></span><strong>SIA</strong><span className="hp-demo-online"/></div>
          <p className="hp-bubble user">{t.siaDemoUser}</p>
          <p className="hp-bubble bot">{t.siaDemoReply}</p>
          <div className="hp-demo-input"><span>{t.askPlaceholder}</span><Mic size={16}/><Send size={16}/></div>
        </div>
      </section>

      <section className="hp-section hp-wrap" id="guides" aria-labelledby="guides-title">
        <div className="hp-heading row">
          <div>
            <span className="hp-kicker">{t.guidesKicker}</span>
            <h2 id="guides-title">{t.guidesTitle}</h2>
            <p>{t.guidesSub}</p>
          </div>
          <a className="hp-link" href={prefix + '/guides/'}>{t.allGuides}<ArrowRight size={16} aria-hidden="true"/></a>
        </div>
        <div className="hp-guide-grid">
          {featuredGuides.filter(slug => guideSlugs.includes(slug) && guides[slug]?.[hi ? 'hi' : 'en']).map(slug => {
            const guide = guides[slug][hi ? 'hi' : 'en'];
            return <a key={slug} className="hp-guide" href={guidePath(slug, hi ? 'hi' : 'en')}>
              <BookOpen size={20} aria-hidden="true"/>
              <h3>{guide.title}</h3>
              <p>{guide.description}</p>
              <span>{t.readGuide}<ArrowRight size={15} aria-hidden="true"/></span>
            </a>;
          })}
        </div>
      </section>

      <PartnerLinks language={hi ? 'hi' : 'en'}/>

      <section className="hp-section hp-wrap" aria-labelledby="promise-title">
        <div className="hp-heading center">
          <span className="hp-kicker">{t.promiseKicker}</span>
          <h2 id="promise-title">{t.promiseTitle}</h2>
        </div>
        <div className="hp-promise">
          {t.promise.map(([Icon, title, text]) => <article key={title}><span><Icon size={22} aria-hidden="true"/></span><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>

      <section className="hp-section hp-wrap hp-faq" aria-labelledby="faq-title">
        <h2 id="faq-title">{t.faqTitle}</h2>
        <div>{t.faq.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>
      </section>
    </main>

    <footer className="hp-footer">
      <div className="hp-wrap">
        <div className="hp-footer-grid">
          <div className="hp-footer-brand">
            <a className="hp-logo" href={prefix + '/'}><span className="hp-logo-mark"><TrendingUp size={18} aria-hidden="true"/></span><span>Sahi<b>Fayda</b></span></a>
            <p>{t.footerTag}</p>
            <InstallApp hi={hi}/>
          </div>
          <div>
            <h3>{t.footerTools}</h3>
            <ul>{tools.map(tool => <li key={tool.id}><a href={tool.path ? prefix + tool.path : prefix + '/#tool-' + tool.id} onClick={event => { if (!tool.path) { event.preventDefault(); chooseTool(tool.id); } }}>{tool[hi ? 'hi' : 'en'][0]}</a></li>)}</ul>
          </div>
          <div>
            <h3>{t.footerServices}</h3>
            <ul>
              {services.slice(0, 5).map(([id, , en, hiLabel]) => <li key={id}><a href={prefix + '/products/' + directoryCategories[id].slug + '/'}>{hi ? hiLabel : en}</a></li>)}
              <li><a href={prefix + '/products/'}>{t.allServicesLink}</a></li>
            </ul>
          </div>
          <div>
            <h3>{t.footerAbout}</h3>
            <ul>
              <li><a href={prefix + '/guides/'}>{t.allGuidesLink}</a></li>
              <li><button type="button" onClick={() => openModal('about')}>{t.about}</button></li>
              <li><button type="button" onClick={() => openModal('privacy')}>{t.privacy}</button></li>
              <li><button type="button" onClick={() => openModal('limitations')}>{t.limits}</button></li>
            </ul>
          </div>
        </div>
        <p className="hp-footer-disclosure">{education.footer}</p>
        <div className="hp-footer-bottom"><span>© {new Date().getFullYear()} SahiFayda</span><span>{t.footerNote}</span></div>
      </div>
    </footer>

    <button type="button" className="sia-launcher" onClick={() => openModal('sia')} aria-haspopup="dialog" aria-label={t.nav.sia}>
      <span className="sia-avatar"><Sparkles size={21} aria-hidden="true"/></span>
      <span><strong>{t.nav.sia}</strong><small>{hi ? 'हिन्दी · English' : 'Hindi · English'}</small></span>
      <MessageCircle size={18} aria-hidden="true"/>
    </button>

    {active !== null && <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) setActive(null); }}>
      <section className={'modal' + (active === 'sia' ? ' sia-chat-modal' : '')} role="dialog" aria-modal="true" aria-labelledby="modal-title" ref={panel}>
        <div className="modal-header">
          <span className="tiny-logo"><TrendingUp size={19} aria-hidden="true"/></span><span>SahiFayda</span>
          <button ref={closeButton} type="button" onClick={() => setActive(null)} aria-label={t.close}><X size={22}/></button>
        </div>
        <h2 id="modal-title">{modalTitle}</h2>
        {active === 'sia' && <SiaLive language={hi ? 'hi' : 'en'} initialQuestion={siaQuestion}/>}
        {active === 'privacy' && <p className="modal-intro">{t.privacyText}</p>}
        {active === 'about' && <p className="modal-intro">{t.aboutText}</p>}
        {active === 'limitations' && <div className="education-details"><p className="modal-intro">{education.notice}</p><ol>{education.points.map(point => <li key={point}>{point}</li>)}</ol></div>}
      </section>
    </div>}
  </div>;
}
