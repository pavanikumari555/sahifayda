'use client';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight, ArrowUpRight, BadgeCheck, BookOpen, Car, CreditCard, GraduationCap, Home as HomeIcon, Landmark,
  LifeBuoy, LockKeyhole, Menu, MessageCircle, Moon, Scale, ShieldCheck, ShoppingBag, Megaphone,
  Smartphone, Sparkles, Sun, TrendingUp, Wallet, Banknote, X, AlertTriangle, RefreshCw, Mic
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
import SiaUpdates from './sia-updates';
import BrandLogo from './brand';
import { useFinanceKnowledge } from './finance-updates';
import { guides, guideSlugs, guidePath } from '../lib/guides.mjs';
import { directoryCategories } from '../lib/product-directory.mjs';
import { educationCopy } from '../lib/education-copy.mjs';
import { readSiteSettings, siteSettingsDefaults } from '../lib/site-settings.mjs';
import { financeSources } from '../supabase/functions/_shared/finance-sources.mjs';
import './products.css';
import './home.css';

// Calculators shown on the homepage. `path` is the dedicated page (English); Hindi adds /hi.
// Owners can hide any of them from the homepage in Admin → Homepage & design.
const tools = [
  { id: 'home_loan', icon: HomeIcon, color: '#5b5bd6', path: '/home-loan-calculator/', Component: HomeLoanCalculator,
    en: ['Home loan or rent?', 'See EMI, total interest, extra costs and how buying compares with renting.'],
    hi: ['घर खरीदें या किराया?', 'EMI, कुल ब्याज, अतिरिक्त खर्च और खरीदने बनाम किराये की तुलना देखें।'] },
  { id: 'emergency_fund', icon: LifeBuoy, color: '#d6455d', path: '/emergency-fund/', Component: EmergencyFundCalculator,
    en: ['Emergency fund', 'How much money to keep aside for a job loss or medical need, and how fast you can build it.'],
    hi: ['आपातकालीन फ़ंड', 'नौकरी छूटने या बीमारी के लिए कितना पैसा अलग रखें और कितने समय में जमा होगा।'] },
  { id: 'debt_trap', icon: AlertTriangle, color: '#c2410c', path: '/debt-trap-calculator/', Component: CreditCardDebtTrapCalculator, props: { initialBill: 50000 },
    en: ['Credit card bill', 'Compare paying only the minimum due with converting the bill to an EMI.'],
    hi: ['क्रेडिट कार्ड बिल', 'सिर्फ़ न्यूनतम देय भरने और बिल को EMI में बदलने के खर्च की तुलना करें।'] },
  { id: 'card_offers', icon: ShoppingBag, color: '#058c6f', path: null, Component: SmartCardOfferCalculator, props: { initialPrice: 30000, initialCategory: 'mobile' },
    en: ['Card offers on shopping', 'Estimate cashback and bank discounts on a phone, laptop or appliance purchase.'],
    hi: ['खरीदारी पर कार्ड ऑफ़र', 'फ़ोन, लैपटॉप या घरेलू सामान की खरीद पर कैशबैक और बैंक छूट का अनुमान।'] },
  { id: 'student_cards', icon: GraduationCap, color: '#1d5fbf', path: '/student-credit-cards/', Component: StudentCardFinder,
    en: ['First credit card', 'No salary slip or credit history? Understand FD-backed cards, limits and fees.'],
    hi: ['पहला क्रेडिट कार्ड', 'सैलरी स्लिप या क्रेडिट इतिहास नहीं? FD वाले कार्ड, लिमिट और शुल्क समझें।'] },
  { id: 'car_vs_uber', icon: Car, color: '#0e7490', path: '/car-vs-uber/', Component: CarVsUberCalculator,
    en: ['Car or cab?', 'Compare 5-year cost of owning a car with using Uber/Ola and the metro.'],
    hi: ['कार या कैब?', 'कार रखने और Uber/Ola व मेट्रो से चलने के 5 साल के खर्च की तुलना।'] },
];

const services = [
  ['savings_account', Wallet, 'Savings accounts', 'बचत खाते', '#058c6f'],
  ['demat', TrendingUp, 'Demat & trading', 'डीमैट और ट्रेडिंग', '#1d5fbf'],
  ['credit_card', CreditCard, 'Credit cards', 'क्रेडिट कार्ड', '#5b5bd6'],
  ['loan', Landmark, 'Loans', 'लोन', '#03224a'],
  ['insurance', ShieldCheck, 'Insurance', 'बीमा', '#0e7490'],
  ['credit_line', Banknote, 'Credit line', 'क्रेडिट लाइन', '#b7791f'],
  ['other', Smartphone, 'Apps & services', 'ऐप और सेवाएँ', '#d6455d'],
  ['shopping', ShoppingBag, 'Shopping offers', 'खरीदारी ऑफ़र', '#c2410c'],
];

const copy = {
  en: {
    nav: { tools: 'Calculators', services: 'Services', guides: 'Guides', sia: 'Ask SIA' },
    langSwitch: 'हिन्दी', themeDark: 'Switch to dark theme', themeLight: 'Switch to light theme', menu: 'Menu',
    runBy: 'Run by AI: SIA checks official sources daily and answers your money questions. Product facts are reviewed by the owner.',
    runByLink: 'How it works',
    online: 'SIA, our AI money helper, is online · type or speak',
    title: 'Tell SIA what you need. SIA does the rest.',
    subtitle: 'Savings accounts, credit cards, loans, demat and insurance, explained in plain Hindi or English, with fees, conditions and the official source.',
    chatNote: 'SIA can make mistakes. Fees and rates come from official pages; check them before you apply. Never share OTP, PIN or account numbers.',
    servicesTitle: 'What do you need today?',
    servicesSub: 'Fees, conditions and how to apply',
    allServices: 'All services and comparisons',
    trust: ['100% free to use', 'No sign-up needed', 'Your numbers stay in your browser', 'Commission never changes our ranking'],
    updatesKicker: 'CHECKED BY SIA',
    updatesTitle: 'Official sources SIA watches',
    updatesSub: n => `Every day SIA re-checks ${n} official bank and provider pages. Supported loan rates update automatically; anything unclear is held for owner review instead of being published.`,
    toolsKicker: 'FREE CALCULATORS',
    toolsTitle: 'Pick a calculator. Get your answer in a minute.',
    toolsSub: 'Every calculator opens with example numbers. Change them to your own and the result updates instantly.',
    useTool: 'Use calculator', selected: 'Open below', fullPage: 'Open full page', share: 'Share on WhatsApp',
    shareText: (name, url) => `Try this free ${name} calculator on SahiFayda: ${url}`,
    stepsKicker: 'HOW IT WORKS',
    stepsTitle: 'What SIA does for you',
    steps: [
      ['You ask in your words', 'Type or speak in Hindi, English or Hinglish. SIA understands the need and remembers what you already said.'],
      ['SIA finds and compares', 'SIA matches reviewed products, shows fees and conditions side by side and asks only the one question it still needs.'],
      ['You decide and apply', 'Read the simple guide, check the official source and apply on the provider’s own website when you are ready.'],
    ],
    automation: [
      [RefreshCw, 'Daily source check', 'Official bank and provider pages are re-checked every day.'],
      [Sparkles, 'Instant answers', 'Common questions are answered from reviewed facts without waiting for AI.'],
      [Mic, 'Voice typing', 'Speak, check the text, then send. Nothing is sent automatically.'],
    ],
    guidesKicker: 'SIMPLE GUIDES', guidesTitle: 'Read a little. Understand a lot.', guidesSub: 'Short explainers in plain language, with official sources.',
    allGuides: 'All guides', readGuide: 'Read guide',
    promiseKicker: 'OUR PROMISE', promiseTitle: 'Honest information you can check',
    promise: [
      [Scale, 'Ranking stays independent', 'Options are ordered by what you asked for. A partner paying us commission does not move it up.'],
      [BadgeCheck, 'Sources and dates shown', 'Product facts link to the official page and show when they were last reviewed.'],
      [LockKeyhole, 'Your data stays with you', 'Calculator numbers never leave your browser. SIA chats are not saved.'],
    ],
    faqTitle: 'Common questions',
    faq: [
      ['Is SahiFayda free?', 'Yes. All calculators, guides and SIA are free. You do not need an account.'],
      ['What does SIA do automatically?', 'SIA re-checks a fixed list of official pages every day, answers common questions instantly from reviewed facts, and uses AI for other questions. It does not open accounts, submit applications or decide approval; the provider does that.'],
      ['How does SahiFayda earn money?', 'Some “Click here to apply” links are partner links. If you open an account or buy through them, the partner may pay us a commission. You pay nothing extra, and it does not change how options are ranked.'],
      ['Is this financial advice?', 'No. SahiFayda gives educational calculations and general information. The bank, lender or insurer decides actual charges, rates and approval.'],
      ['Do you save my numbers or chats?', 'Calculator inputs stay in your browser tab and clear when you refresh. SIA conversations are kept only in memory while the page is open.'],
      ['Can I use it in Hindi?', 'Yes. Every page is available in Hindi and English, and SIA replies in the language you write in.'],
    ],
    footerTag: 'Make everyday money make sense.',
    footerTools: 'Calculators', footerServices: 'Services', footerAbout: 'About',
    privacy: 'Privacy', about: 'About us', limits: 'Scope & limitations', allGuidesLink: 'All guides', allServicesLink: 'All services',
    footerNote: 'Commercial links are labelled and disclosed.',
    close: 'Close', launcher: 'Ask SIA', launcherSub: 'Hindi · English',
    privacyTitle: 'Your data, your control',
    privacyText: 'Calculator inputs are processed in this browser tab. They are not sent to SahiFayda, Supabase or any AI service, and they clear when you refresh. When you send a message to SIA, your typed question and a few recent messages are sent to answer it; SahiFayda does not store these conversations. Common questions are answered from reviewed information without an AI request. Partner link clicks are counted with a random ID, not your personal details. If you choose to submit the optional application-help form, the name or mobile number you give is kept privately for the owner to help you, for up to 90 days, and is never sent to SIA or analytics. Voice typing may be processed by your browser’s speech service; SahiFayda does not save audio. Your theme choice is saved on this device.',
    aboutTitle: 'About SahiFayda',
    aboutText: 'SahiFayda helps people in India understand everyday money decisions: savings accounts, credit cards, loans, demat accounts, insurance and shopping offers. We explain fees and conditions in simple Hindi and English, link to official sources, and offer free calculators. Some application links are partner links that may earn us a commission; they are always labelled, and they never decide how options are ranked.',
  },
  hi: {
    nav: { tools: 'कैलकुलेटर', services: 'सेवाएँ', guides: 'गाइड', sia: 'SIA से पूछें' },
    langSwitch: 'English', themeDark: 'डार्क थीम चालू करें', themeLight: 'लाइट थीम चालू करें', menu: 'मेन्यू',
    runBy: 'AI से चलता है: SIA रोज़ आधिकारिक स्रोत जाँचती है और आपके पैसों से जुड़े सवालों के जवाब देती है। उत्पाद की जानकारी की समीक्षा मालिक करते हैं।',
    runByLink: 'कैसे काम करता है',
    online: 'SIA, आपकी AI पैसों की मददगार, ऑनलाइन है · लिखें या बोलें',
    title: 'SIA को अपनी ज़रूरत बताइए। बाकी SIA करेगी।',
    subtitle: 'बचत खाता, क्रेडिट कार्ड, लोन, डीमैट और बीमा, आसान हिन्दी या English में, शुल्क, शर्तों और आधिकारिक स्रोत के साथ।',
    chatNote: 'SIA से गलती हो सकती है। शुल्क और दरें आधिकारिक पेज से ली जाती हैं; आवेदन से पहले जाँच लें। OTP, PIN या खाता नंबर कभी साझा न करें।',
    servicesTitle: 'आज आपको क्या चाहिए?',
    servicesSub: 'शुल्क, शर्तें और आवेदन का तरीका',
    allServices: 'सभी सेवाएँ और तुलना',
    trust: ['पूरी तरह मुफ़्त', 'साइन-अप ज़रूरी नहीं', 'आपके आँकड़े आपके ब्राउज़र में ही रहते हैं', 'कमीशन से हमारी रैंकिंग नहीं बदलती'],
    updatesKicker: 'SIA ने जाँचा',
    updatesTitle: 'SIA जिन आधिकारिक स्रोतों पर नज़र रखती है',
    updatesSub: n => `SIA हर दिन ${n} आधिकारिक बैंक और प्रदाता पेज दोबारा जाँचती है। समर्थित लोन दरें अपने-आप अपडेट होती हैं; जो साफ़ न हो, वह छपने के बजाय मालिक की समीक्षा के लिए रुकता है।`,
    toolsKicker: 'मुफ़्त कैलकुलेटर',
    toolsTitle: 'कैलकुलेटर चुनें, एक मिनट में जवाब पाएँ।',
    toolsSub: 'हर कैलकुलेटर में उदाहरण के आँकड़े पहले से भरे हैं। अपने आँकड़े डालें, नतीजा तुरंत बदल जाएगा।',
    useTool: 'कैलकुलेटर खोलें', selected: 'नीचे खुला है', fullPage: 'पूरा पेज खोलें', share: 'WhatsApp पर शेयर करें',
    shareText: (name, url) => `सहीफ़ायदा का यह मुफ़्त "${name}" कैलकुलेटर देखें: ${url}`,
    stepsKicker: 'कैसे काम करता है',
    stepsTitle: 'SIA आपके लिए क्या करती है',
    steps: [
      ['आप अपने शब्दों में पूछें', 'हिन्दी, English या Hinglish में लिखें या बोलें। SIA ज़रूरत समझती है और आपकी बताई बात याद रखती है।'],
      ['SIA ढूँढती और तुलना करती है', 'SIA जाँचे गए उत्पाद मिलाती है, शुल्क और शर्तें साथ-साथ दिखाती है और सिर्फ़ वही एक सवाल पूछती है जो बाकी है।'],
      ['आप फ़ैसला लें और आवेदन करें', 'आसान गाइड पढ़ें, आधिकारिक स्रोत जाँचें और तैयार होने पर प्रदाता की अपनी वेबसाइट पर आवेदन करें।'],
    ],
    automation: [
      [RefreshCw, 'रोज़ स्रोत की जाँच', 'आधिकारिक बैंक और प्रदाता पेज हर दिन दोबारा जाँचे जाते हैं।'],
      [Sparkles, 'तुरंत जवाब', 'आम सवालों के जवाब जाँची गई जानकारी से, AI का इंतज़ार किए बिना।'],
      [Mic, 'बोलकर लिखें', 'बोलें, लिखा हुआ जाँचें, फिर भेजें। कुछ भी अपने-आप नहीं भेजा जाता।'],
    ],
    guidesKicker: 'आसान गाइड', guidesTitle: 'थोड़ा पढ़ें, ज़्यादा समझें।', guidesSub: 'आसान भाषा में छोटी जानकारी, आधिकारिक स्रोतों के साथ।',
    allGuides: 'सभी गाइड', readGuide: 'गाइड पढ़ें',
    promiseKicker: 'हमारा वादा', promiseTitle: 'ईमानदार जानकारी, जिसे आप खुद जाँच सकें',
    promise: [
      [Scale, 'रैंकिंग निष्पक्ष रहती है', 'विकल्प आपकी ज़रूरत के हिसाब से क्रम में आते हैं। किसी पार्टनर के कमीशन देने से वह ऊपर नहीं आता।'],
      [BadgeCheck, 'स्रोत और तारीख़ दिखती है', 'हर जानकारी आधिकारिक पेज से जुड़ी है और बताती है कि उसे आखिरी बार कब जाँचा गया।'],
      [LockKeyhole, 'आपका डेटा आपके पास', 'कैलकुलेटर के आँकड़े आपके ब्राउज़र से बाहर नहीं जाते। SIA की बातचीत सेव नहीं होती।'],
    ],
    faqTitle: 'आम सवाल',
    faq: [
      ['क्या सहीफ़ायदा मुफ़्त है?', 'हाँ। सभी कैलकुलेटर, गाइड और SIA मुफ़्त हैं। खाता बनाना ज़रूरी नहीं।'],
      ['SIA अपने-आप क्या करती है?', 'SIA तय आधिकारिक पेजों को हर दिन दोबारा जाँचती है, आम सवालों के जवाब जाँची गई जानकारी से तुरंत देती है और बाकी सवालों के लिए AI का उपयोग करती है। SIA खाता नहीं खोलती, आवेदन जमा नहीं करती और मंज़ूरी तय नहीं करती; यह प्रदाता करता है।'],
      ['सहीफ़ायदा पैसे कैसे कमाता है?', 'कुछ “आवेदन के लिए यहाँ क्लिक करें” लिंक पार्टनर लिंक होते हैं। उनसे खाता खोलने या खरीदने पर पार्टनर हमें कमीशन दे सकता है। आपको कुछ ज़्यादा नहीं देना पड़ता, और इससे विकल्पों का क्रम नहीं बदलता।'],
      ['क्या यह वित्तीय सलाह है?', 'नहीं। सहीफ़ायदा शैक्षिक गणना और सामान्य जानकारी देता है। असली शुल्क, दर और मंज़ूरी बैंक, ऋणदाता या बीमा कंपनी तय करती है।'],
      ['क्या आप मेरे आँकड़े या बातचीत सेव करते हैं?', 'कैलकुलेटर के आँकड़े आपके ब्राउज़र टैब में रहते हैं और रीफ़्रेश करने पर मिट जाते हैं। SIA की बातचीत सिर्फ़ पेज खुला रहने तक मेमोरी में रहती है।'],
      ['क्या मैं इसे हिन्दी में इस्तेमाल कर सकता हूँ?', 'हाँ। हर पेज हिन्दी और English में है, और SIA उसी भाषा में जवाब देती है जिसमें आप लिखते हैं।'],
    ],
    footerTag: 'रोज़ के पैसों की बेहतर समझ।',
    footerTools: 'कैलकुलेटर', footerServices: 'सेवाएँ', footerAbout: 'जानकारी',
    privacy: 'गोपनीयता', about: 'हमारे बारे में', limits: 'दायरा और सीमाएँ', allGuidesLink: 'सभी गाइड', allServicesLink: 'सभी सेवाएँ',
    footerNote: 'व्यावसायिक लिंक अलग से चिन्हित और बताए जाते हैं।',
    close: 'बंद करें', launcher: 'SIA से पूछें', launcherSub: 'हिन्दी · English',
    privacyTitle: 'आपका डेटा, आपका नियंत्रण',
    privacyText: 'कैलकुलेटर के आँकड़े इसी ब्राउज़र टैब में गिने जाते हैं। ये सहीफ़ायदा, Supabase या किसी AI सेवा को नहीं भेजे जाते, और रीफ़्रेश करने पर मिट जाते हैं। SIA को संदेश भेजने पर आपका लिखा सवाल और हाल के कुछ संदेश जवाब देने के लिए भेजे जाते हैं; सहीफ़ायदा इन बातचीतों को सेव नहीं करता। आम सवालों के जवाब जाँची गई जानकारी से बिना AI अनुरोध के मिलते हैं। पार्टनर लिंक के क्लिक एक random ID से गिने जाते हैं, आपकी निजी जानकारी से नहीं। अगर आप अपनी मर्ज़ी से आवेदन-सहायता फ़ॉर्म भरते हैं, तो दिया गया नाम या मोबाइल नंबर मदद के लिए 90 दिन तक निजी रूप से रखा जाता है और SIA या analytics को कभी नहीं भेजा जाता। बोलकर लिखने की सुविधा आपके ब्राउज़र की speech service से चल सकती है; सहीफ़ायदा ऑडियो सेव नहीं करता। आपकी थीम की पसंद इसी डिवाइस पर सेव रहती है।',
    aboutTitle: 'सहीफ़ायदा के बारे में',
    aboutText: 'सहीफ़ायदा भारत के लोगों को रोज़ के पैसों के फ़ैसले समझने में मदद करता है: बचत खाते, क्रेडिट कार्ड, लोन, डीमैट खाते, बीमा और खरीदारी ऑफ़र। हम शुल्क और शर्तें आसान हिन्दी और English में समझाते हैं, आधिकारिक स्रोतों के लिंक देते हैं और मुफ़्त कैलकुलेटर उपलब्ध कराते हैं। कुछ आवेदन लिंक पार्टनर लिंक होते हैं जिनसे हमें कमीशन मिल सकता है; वे हमेशा चिन्हित रहते हैं और विकल्पों का क्रम कभी तय नहीं करते।',
  },
};

const featuredGuides = ['savings-account', 'credit-card', 'loan-options', 'demat-account', 'insurance-basics', 'emi-total-cost'];

export default function Home({ language }) {
  const hi = language === 'hi';
  const lang = hi ? 'hi' : 'en';
  const t = copy[lang];
  const education = educationCopy[lang];
  const prefix = hi ? '/hi' : '';
  const finance = useFinanceKnowledge();
  const [settings, setSettings] = useState(siteSettingsDefaults);
  const [active, setActive] = useState(null);
  const [ask, setAsk] = useState(null);
  const [menu, setMenu] = useState(false);
  const [toolId, setToolId] = useState(tools[0].id);
  const [theme, setTheme] = useState('light');
  const panel = useRef(null), closeButton = useRef(null), lastFocus = useRef(null), toolPanel = useRef(null), chat = useRef(null);

  useEffect(() => { let live = true; readSiteSettings().then(value => { if (live) setSettings(value); }); return () => { live = false; }; }, []);
  useEffect(() => { setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'); }, []);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
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

  const shown = settings.sections;
  const visibleTools = tools.filter(tool => settings.tools[tool.id] !== false);
  const current = visibleTools.find(tool => tool.id === toolId) || visibleTools[0];
  const starters = settings.examples[lang]?.length ? settings.examples[lang].map(item => ({ label: item.label, q: item.question })) : null;
  const heroTitle = (hi ? settings.hero.title_hi : settings.hero.title_en) || t.title;
  const heroSub = (hi ? settings.hero.subtitle_hi : settings.hero.subtitle_en) || t.subtitle;
  const announcement = settings.announcement.enabled ? settings.announcement : null;

  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    try { localStorage.setItem('sahifayda-theme', next); } catch {}
  }
  // One SIA conversation lives at the top of the page; every "Ask SIA" action brings the visitor there.
  function openChat(question = '') {
    setMenu(false);
    chat.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (question) setAsk({ id: Date.now(), text: question });
    else requestAnimationFrame(() => document.getElementById('hp-sia-input')?.focus({ preventScroll: true }));
  }
  function chooseTool(id) {
    setToolId(id);
    requestAnimationFrame(() => toolPanel.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }
  function shareTool(tool) {
    const url = window.location.origin + (tool.path ? prefix + tool.path : prefix + '/#tool-' + tool.id);
    window.open('https://wa.me/?text=' + encodeURIComponent(t.shareText(tool[lang][0], url)), '_blank', 'noopener,noreferrer');
  }

  const modalTitle = active === 'privacy' ? t.privacyTitle : active === 'about' ? t.aboutTitle : education.title;
  const CurrentTool = current?.Component;

  return <div className="hp">
    <a className="hp-skip" href="#main">{hi ? 'मुख्य सामग्री पर जाएँ' : 'Skip to main content'}</a>
    <div className="hp-runby">
      <div className="hp-wrap"><Sparkles size={14} aria-hidden="true"/><span>{t.runBy}</span><a href="#how">{t.runByLink} →</a></div>
    </div>
    {announcement && <div className="hp-announce" role="note">
      <div className="hp-wrap"><Megaphone size={16} aria-hidden="true"/>{announcement.url ? <a href={announcement.url.startsWith('/#') ? announcement.url.slice(1) : prefix + announcement.url}>{hi ? announcement.hi : announcement.en} →</a> : <span>{hi ? announcement.hi : announcement.en}</span>}</div>
    </div>}
    <header className="hp-header">
      <div className="hp-wrap hp-header-row">
        <BrandLogo href={prefix + '/'} className="hp-logo" label={hi ? 'सहीफ़ायदा होम' : 'SahiFayda home'}/>
        <nav className={menu ? 'hp-nav open' : 'hp-nav'} aria-label={hi ? 'मुख्य नेविगेशन' : 'Main navigation'}>
          {shown.tools && visibleTools.length > 0 && <a href="#tools" onClick={() => setMenu(false)}>{t.nav.tools}</a>}
          <a href={prefix + '/products/'}>{t.nav.services}</a>
          <a href={prefix + '/guides/'}>{t.nav.guides}</a>
          <button type="button" className="hp-nav-sia" onClick={() => openChat()}><Sparkles size={16} aria-hidden="true"/>{t.nav.sia}</button>
        </nav>
        <div className="hp-header-actions">
          <button type="button" className="hp-icon-btn" onClick={toggleTheme} aria-label={theme === 'light' ? t.themeDark : t.themeLight} aria-pressed={theme === 'dark'}>
            {theme === 'light' ? <Moon size={18} aria-hidden="true"/> : <Sun size={18} aria-hidden="true"/>}
          </button>
          <a className="hp-lang" href={hi ? '/' : '/hi/'} hrefLang={hi ? 'en' : 'hi'} lang={hi ? 'en' : 'hi'}>{t.langSwitch}</a>
          <button type="button" className="hp-icon-btn hp-menu-btn" aria-label={t.menu} aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X size={20} aria-hidden="true"/> : <Menu size={20} aria-hidden="true"/>}</button>
        </div>
      </div>
    </header>

    <main id="main">
      <section className="hp-hero" aria-labelledby="hero-title">
        <div className="hp-wrap hp-hero-grid">
          <div className="hp-hero-main" id="sia" ref={chat}>
            <span className="hp-online"><span className="hp-dot" aria-hidden="true"/>{t.online}</span>
            <h1 id="hero-title">{heroTitle}</h1>
            <p className="hp-hero-sub">{heroSub}</p>
            <div className="hp-chat">
              <div className="hp-chat-head">
                <img src="/brand/sahifayda-mark.png" width="34" height="34" alt=""/>
                <div><strong>SIA</strong><small>{hi ? 'सहीफ़ायदा की AI मददगार' : 'SahiFayda’s AI helper'}</small></div>
                <span className="hp-chat-live">{hi ? 'ऑनलाइन' : 'Online'}</span>
              </div>
              <SiaLive key={lang} language={lang} starters={starters} inputId="hp-sia-input" ask={ask}/>
            </div>
            <p className="hp-chat-note">{t.chatNote}</p>
          </div>
          {shown.services && <aside className="hp-services-card" aria-labelledby="services-title">
            <div className="hp-services-head">
              <h2 id="services-title">{t.servicesTitle}</h2>
              <p>{t.servicesSub}</p>
            </div>
            <nav className="hp-services-grid" aria-label={t.servicesTitle}>
              {services.map(([id, Icon, en, hiLabel, color]) => <a key={id} href={prefix + '/products/' + directoryCategories[id].slug + '/'} style={{ '--c': color }}>
                <span className="hp-service-icon"><Icon size={22} aria-hidden="true"/></span>
                <span>{hi ? hiLabel : en}</span>
              </a>)}
            </nav>
            <a className="hp-services-all" href={prefix + '/products/'}>{t.allServices}<ArrowRight size={16} aria-hidden="true"/></a>
            <ul className="hp-auto">
              {t.automation.map(([Icon, title, text]) => <li key={title}><span><Icon size={16} aria-hidden="true"/></span><div><strong>{title}</strong><small>{text}</small></div></li>)}
            </ul>
          </aside>}
        </div>
      </section>

      <div className="hp-trust">
        <ul className="hp-wrap">
          {t.trust.map((item, index) => { const Icon = [Sparkles, BadgeCheck, LockKeyhole, Scale][index]; return <li key={item}><Icon size={17} aria-hidden="true"/>{item}</li>; })}
        </ul>
      </div>

      {shown.updates && <section className="hp-section hp-wrap" id="updates" aria-labelledby="updates-title">
        <div className="hp-heading">
          <span className="hp-kicker">{t.updatesKicker}</span>
          <h2 id="updates-title">{t.updatesTitle}</h2>
          <p>{t.updatesSub(financeSources.length)}</p>
        </div>
        <SiaUpdates language={lang} feed={finance}/>
      </section>}

      {shown.tools && current && <section className="hp-section hp-wrap" id="tools" aria-labelledby="tools-title">
        <div className="hp-heading">
          <span className="hp-kicker">{t.toolsKicker}</span>
          <h2 id="tools-title">{t.toolsTitle}</h2>
          <p>{t.toolsSub}</p>
        </div>
        <div className="hp-tool-grid">
          {visibleTools.map(tool => {
            const Icon = tool.icon, [title, text] = tool[lang], isActive = tool.id === current.id;
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
              <h3>{current[lang][0]}</h3>
            </div>
            <div className="hp-tool-actions">
              {current.path && <a href={prefix + current.path}>{t.fullPage}<ArrowUpRight size={15} aria-hidden="true"/></a>}
              <button type="button" onClick={() => shareTool(current)}>{t.share}</button>
            </div>
          </div>
          <CurrentTool key={current.id + language} language={lang} {...(current.props || {})}/>
        </div>
      </section>}

      {shown.steps && <section className="hp-section hp-steps-band" id="how" aria-labelledby="steps-title">
        <div className="hp-wrap">
          <div className="hp-heading center">
            <span className="hp-kicker">{t.stepsKicker}</span>
            <h2 id="steps-title">{t.stepsTitle}</h2>
          </div>
          <ol className="hp-steps">
            {t.steps.map(([title, text], index) => <li key={title}><span className="hp-step-no">{index + 1}</span><h3>{title}</h3><p>{text}</p></li>)}
          </ol>
          <div className="hp-center"><button type="button" className="hp-primary" onClick={() => openChat()}><MessageCircle size={18} aria-hidden="true"/>{t.nav.sia}</button></div>
        </div>
      </section>}

      {shown.guides && <section className="hp-section hp-wrap" id="guides" aria-labelledby="guides-title">
        <div className="hp-heading row">
          <div>
            <span className="hp-kicker">{t.guidesKicker}</span>
            <h2 id="guides-title">{t.guidesTitle}</h2>
            <p>{t.guidesSub}</p>
          </div>
          <a className="hp-link" href={prefix + '/guides/'}>{t.allGuides}<ArrowRight size={16} aria-hidden="true"/></a>
        </div>
        <div className="hp-guide-grid">
          {featuredGuides.filter(slug => guideSlugs.includes(slug) && guides[slug]?.[lang]).map(slug => {
            const guide = guides[slug][lang];
            return <a key={slug} className="hp-guide" href={guidePath(slug, lang)}>
              <span className="hp-guide-icon"><BookOpen size={20} aria-hidden="true"/></span>
              <h3>{guide.title}</h3>
              <p>{guide.description}</p>
              <span className="hp-guide-cta">{t.readGuide}<ArrowRight size={15} aria-hidden="true"/></span>
            </a>;
          })}
        </div>
      </section>}

      {shown.partners && <PartnerLinks language={lang}/>}

      {shown.promise && <section className="hp-section hp-wrap" aria-labelledby="promise-title">
        <div className="hp-heading center">
          <span className="hp-kicker">{t.promiseKicker}</span>
          <h2 id="promise-title">{t.promiseTitle}</h2>
        </div>
        <div className="hp-promise">
          {t.promise.map(([Icon, title, text]) => <article key={title}><span><Icon size={22} aria-hidden="true"/></span><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>}

      {shown.faq && <section className="hp-section hp-wrap hp-faq" aria-labelledby="faq-title">
        <h2 id="faq-title">{t.faqTitle}</h2>
        <div>{t.faq.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>
      </section>}
    </main>

    <footer className="hp-footer">
      <div className="hp-wrap">
        <div className="hp-footer-grid">
          <div className="hp-footer-brand">
            <BrandLogo href={prefix + '/'} className="hp-logo" label={hi ? 'सहीफ़ायदा होम' : 'SahiFayda home'}/>
            <p>{t.footerTag}</p>
            <InstallApp hi={hi}/>
          </div>
          <div>
            <h3>{t.footerTools}</h3>
            <ul>{tools.map(tool => <li key={tool.id}><a href={tool.path ? prefix + tool.path : prefix + '/#tool-' + tool.id} onClick={event => { if (!tool.path && shown.tools && visibleTools.includes(tool)) { event.preventDefault(); chooseTool(tool.id); } }}>{tool[lang][0]}</a></li>)}</ul>
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
              <li><button type="button" onClick={() => setActive('about')}>{t.about}</button></li>
              <li><button type="button" onClick={() => setActive('privacy')}>{t.privacy}</button></li>
              <li><button type="button" onClick={() => setActive('limitations')}>{t.limits}</button></li>
            </ul>
          </div>
        </div>
        <p className="hp-footer-disclosure">{education.footer}</p>
        <div className="hp-footer-bottom"><span>© {new Date().getFullYear()} SahiFayda</span><span>{t.footerNote}</span></div>
      </div>
    </footer>

    <button type="button" className="sia-launcher" onClick={() => openChat()} aria-label={t.launcher}>
      <span className="sia-avatar"><img src="/brand/sahifayda-mark.png" width="26" height="26" alt=""/></span>
      <span><strong>{t.launcher}</strong><small>{t.launcherSub}</small></span>
      <MessageCircle size={18} aria-hidden="true"/>
    </button>

    {active !== null && <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) setActive(null); }}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" ref={panel}>
        <div className="modal-header">
          <img src="/brand/sahifayda-mark.png" width="28" height="28" alt=""/><span translate="no">SahiFayda</span>
          <button ref={closeButton} type="button" onClick={() => setActive(null)} aria-label={t.close}><X size={22} aria-hidden="true"/></button>
        </div>
        <h2 id="modal-title">{modalTitle}</h2>
        {active === 'privacy' && <p className="modal-intro">{t.privacyText}</p>}
        {active === 'about' && <p className="modal-intro">{t.aboutText}</p>}
        {active === 'limitations' && <div className="education-details"><p className="modal-intro">{education.notice}</p><ol>{education.points.map(point => <li key={point}>{point}</li>)}</ol></div>}
      </section>
    </div>}
  </div>;
}
