'use client';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight, ArrowUpRight, BadgeCheck, BookOpen, Car, CreditCard, GraduationCap, Home as HomeIcon, Landmark,
  LifeBuoy, LockKeyhole, Menu, MessageCircle, Moon, Scale, ShieldCheck, ShoppingBag, Megaphone,
  Smartphone, Sparkles, Sun, TrendingUp, Wallet, Banknote, X, AlertTriangle, Share2, CheckCircle2
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
import BrandLogo from './brand';
import { guides, guideSlugs, guidePath } from '../lib/guides.mjs';
import { directoryCategories } from '../lib/product-directory.mjs';
import { educationCopy } from '../lib/education-copy.mjs';
import { readSiteSettings, siteSettingsDefaults } from '../lib/site-settings.mjs';
import './products.css';
import './home.css';

// Homepage calculators. Each has a one-line purpose and three plain steps shown above it.
// Owners can hide any of them from the homepage in Admin → Homepage & design.
const tools = [
  { id: 'home_loan', icon: HomeIcon, color: '#5b5bd6', path: '/home-loan-calculator/', Component: HomeLoanCalculator,
    en: ['Home loan or rent?', 'EMI, total interest and buy vs rent', ['Enter the home price and your down payment.', 'Add the interest rate and loan years.', 'See your EMI, total cost and when buying beats renting.']],
    hi: ['घर खरीदें या किराया?', 'EMI, कुल ब्याज और खरीद बनाम किराया', ['घर की कीमत और डाउन पेमेंट भरें।', 'ब्याज दर और लोन के साल भरें।', 'EMI, कुल खर्च और कब खरीदना किराये से बेहतर है, देखें।']] },
  { id: 'emergency_fund', icon: LifeBuoy, color: '#d6455d', path: '/emergency-fund/', Component: EmergencyFundCalculator,
    en: ['Emergency fund', 'How much to keep aside for bad days', ['Enter your essential monthly expenses.', 'Add what you have saved and can save each month.', 'See your target and how many months it will take.']],
    hi: ['आपातकालीन फ़ंड', 'मुश्किल वक़्त के लिए कितना पैसा रखें', ['महीने के ज़रूरी खर्च भरें।', 'अभी की बचत और हर महीने की बचत भरें।', 'लक्ष्य और उसे जोड़ने में लगने वाले महीने देखें।']] },
  { id: 'debt_trap', icon: AlertTriangle, color: '#c2410c', path: '/debt-trap-calculator/', Component: CreditCardDebtTrapCalculator, props: { initialBill: 50000 },
    en: ['Credit card bill', 'Minimum due vs EMI: what it really costs', ['Enter your credit card bill.', 'Enter how much you can pay each month.', 'Compare minimum due with EMI: interest, GST and months.']],
    hi: ['क्रेडिट कार्ड बिल', 'मिनिमम ड्यू बनाम EMI: असली खर्च', ['कार्ड का बकाया बिल भरें।', 'हर महीने कितना भर सकते हैं, वह भरें।', 'मिनिमम ड्यू और EMI का ब्याज, GST और महीने मिलाएँ।']] },
  { id: 'card_offers', icon: ShoppingBag, color: '#058c6f', path: null, Component: SmartCardOfferCalculator, props: { initialPrice: 30000, initialCategory: 'mobile' },
    en: ['Card offers on shopping', 'Cashback and bank discount on a purchase', ['Enter the product price.', 'Choose what you are buying.', 'See the estimated discount and cashback, then check the store’s terms.']],
    hi: ['खरीदारी पर कार्ड ऑफ़र', 'खरीद पर कैशबैक और बैंक छूट', ['सामान की कीमत भरें।', 'चुनें कि क्या खरीद रहे हैं।', 'अनुमानित छूट और कैशबैक देखें, फिर स्टोर की शर्तें जाँचें।']] },
  { id: 'student_cards', icon: GraduationCap, color: '#1d5fbf', path: '/student-credit-cards/', Component: StudentCardFinder,
    en: ['First credit card', 'No salary slip? Cards against an FD', ['Choose your situation, such as student.', 'Enter how much you can keep in an FD.', 'Compare deposit, fees and conditions of each option.']],
    hi: ['पहला क्रेडिट कार्ड', 'सैलरी स्लिप नहीं? FD पर कार्ड', ['अपनी स्थिति चुनें, जैसे स्टूडेंट।', 'FD में कितना पैसा रख सकते हैं, भरें।', 'हर विकल्प की FD, फ़ीस और शर्तें मिलाएँ।']] },
  { id: 'car_vs_uber', icon: Car, color: '#0e7490', path: '/car-vs-uber/', Component: CarVsUberCalculator,
    en: ['Car or cab?', '5-year cost of a car vs Uber/Ola', ['Enter the car price and down payment.', 'Add monthly distance, fuel and parking.', 'Compare the five-year cost with cabs and Metro.']],
    hi: ['कार या कैब?', 'कार बनाम Uber/Ola का 5 साल का खर्च', ['कार की कीमत और डाउन पेमेंट भरें।', 'महीने की दूरी, पेट्रोल और पार्किंग भरें।', 'कैब और मेट्रो से 5 साल का खर्च मिलाएँ।']] },
];

const services = [
  ['savings_account', Wallet, 'Savings accounts', 'बचत खाते', '#058c6f'],
  ['credit_card', CreditCard, 'Credit cards', 'क्रेडिट कार्ड', '#5b5bd6'],
  ['loan', Landmark, 'Loans', 'लोन', '#03224a'],
  ['demat', TrendingUp, 'Demat & trading', 'डीमैट', '#1d5fbf'],
  ['insurance', ShieldCheck, 'Insurance', 'बीमा', '#0e7490'],
  ['credit_line', Banknote, 'Credit line', 'क्रेडिट लाइन', '#b7791f'],
  ['other', Smartphone, 'Apps & services', 'ऐप और सेवाएँ', '#d6455d'],
  ['shopping', ShoppingBag, 'Shopping offers', 'खरीदारी ऑफ़र', '#c2410c'],
];

const copy = {
  en: {
    nav: { tools: 'Calculators', services: 'Services', guides: 'Guides', sia: 'Ask SIA' },
    langSwitch: 'हिन्दी', themeDark: 'Switch to dark theme', themeLight: 'Switch to light theme', menu: 'Menu',
    badge: 'Free · No sign-up · English & हिन्दी',
    title: <>The <em>right</em> money decision,<br/>in one minute.</>,
    subtitle: 'Pick a calculator below. Example numbers are filled in, so you see an answer straight away.',
    pick: 'Choose a calculator',
    servicesTitle: 'Compare services',
    servicesSub: 'Fees and conditions in plain language',
    allServices: 'All services',
    trust: ['Free to use', 'No sign-up', 'Numbers stay on your phone', 'Commission never changes ranking'],
    howTo: 'How to use', fullPage: 'Full page', share: 'Share',
    shareText: (name, url) => `Try this free ${name} calculator on SahiFayda: ${url}`,
    siaTitle: 'Have a question? Ask SIA.',
    siaText: 'Our AI helper explains accounts, cards and loans in Hindi or English.',
    guidesKicker: 'SIMPLE GUIDES', guidesTitle: 'Read a little. Understand a lot.',
    allGuides: 'All guides', readGuide: 'Read',
    promiseKicker: 'OUR PROMISE', promiseTitle: 'Honest information you can check',
    promise: [
      [Scale, 'Ranking stays independent', 'Options are ordered by what you need. Commission does not move a partner up.'],
      [BadgeCheck, 'Sources and dates shown', 'Product facts link to the official page with the last review date.'],
      [LockKeyhole, 'Your data stays with you', 'Calculator numbers never leave your browser. Chats are not saved.'],
    ],
    faqTitle: 'Common questions',
    faq: [
      ['Is SahiFayda free?', 'Yes. All calculators, guides and SIA are free. You do not need an account.'],
      ['How does SahiFayda earn money?', 'Some “Click here to apply” links are partner links. If you open an account or buy through them, the partner may pay us a commission. You pay nothing extra, and it does not change how options are ranked.'],
      ['Is this financial advice?', 'No. SahiFayda gives educational calculations and general information. The bank, lender or insurer decides actual charges, rates and approval.'],
      ['Do you save my numbers or chats?', 'Calculator inputs stay in your browser tab and clear when you refresh. SIA conversations are kept only in memory while the chat is open.'],
    ],
    footerTag: 'Make everyday money make sense.',
    footerTools: 'Calculators', footerServices: 'Services', footerAbout: 'About',
    privacy: 'Privacy', about: 'About us', limits: 'Scope & limitations', allGuidesLink: 'All guides', allServicesLink: 'All services',
    footerNote: 'Commercial links are labelled and disclosed.',
    close: 'Close', launcher: 'Ask SIA', siaModal: 'SIA: tell me what you need',
    privacyTitle: 'Your data, your control',
    privacyText: 'Calculator inputs are processed in this browser tab. They are not sent to SahiFayda, Supabase or any AI service, and they clear when you refresh. When you send a message to SIA, your typed question and a few recent messages are sent to answer it; SahiFayda does not store these conversations. Common questions are answered from reviewed information without an AI request. Partner link clicks are counted with a random ID, not your personal details. If you choose to submit the optional application-help form, the name or mobile number you give is kept privately for the owner to help you, for up to 90 days, and is never sent to SIA or analytics. Voice typing may be processed by your browser’s speech service; SahiFayda does not save audio. Your theme choice is saved on this device.',
    aboutTitle: 'About SahiFayda',
    aboutText: 'SahiFayda helps people in India understand everyday money decisions: savings accounts, credit cards, loans, demat accounts, insurance and shopping offers. We explain fees and conditions in simple Hindi and English, link to official sources, and offer free calculators. Some application links are partner links that may earn us a commission; they are always labelled, and they never decide how options are ranked.',
  },
  hi: {
    nav: { tools: 'कैलकुलेटर', services: 'सेवाएँ', guides: 'गाइड', sia: 'SIA से पूछें' },
    langSwitch: 'English', themeDark: 'डार्क थीम चालू करें', themeLight: 'लाइट थीम चालू करें', menu: 'मेन्यू',
    badge: 'मुफ़्त · साइन-अप नहीं · हिन्दी और English',
    title: <>पैसों का <em>सही</em> फ़ैसला,<br/>बस एक मिनट में।</>,
    subtitle: 'नीचे से कैलकुलेटर चुनें। उदाहरण के आँकड़े पहले से भरे हैं, इसलिए जवाब तुरंत दिखता है।',
    pick: 'कैलकुलेटर चुनें',
    servicesTitle: 'सेवाओं की तुलना',
    servicesSub: 'शुल्क और शर्तें आसान भाषा में',
    allServices: 'सभी सेवाएँ',
    trust: ['पूरी तरह मुफ़्त', 'साइन-अप नहीं', 'आँकड़े आपके फ़ोन में ही', 'कमीशन से रैंकिंग नहीं बदलती'],
    howTo: 'कैसे इस्तेमाल करें', fullPage: 'पूरा पेज', share: 'शेयर करें',
    shareText: (name, url) => `सहीफ़ायदा का यह मुफ़्त "${name}" कैलकुलेटर देखें: ${url}`,
    siaTitle: 'कोई सवाल है? SIA से पूछें।',
    siaText: 'हमारी AI मददगार खाते, कार्ड और लोन हिन्दी या English में समझाती है।',
    guidesKicker: 'आसान गाइड', guidesTitle: 'थोड़ा पढ़ें, ज़्यादा समझें।',
    allGuides: 'सभी गाइड', readGuide: 'पढ़ें',
    promiseKicker: 'हमारा वादा', promiseTitle: 'ईमानदार जानकारी, जिसे आप खुद जाँच सकें',
    promise: [
      [Scale, 'रैंकिंग निष्पक्ष रहती है', 'विकल्प आपकी ज़रूरत के हिसाब से आते हैं। कमीशन से कोई पार्टनर ऊपर नहीं आता।'],
      [BadgeCheck, 'स्रोत और तारीख़ दिखती है', 'हर जानकारी आधिकारिक पेज और आखिरी जाँच की तारीख़ के साथ।'],
      [LockKeyhole, 'आपका डेटा आपके पास', 'कैलकुलेटर के आँकड़े ब्राउज़र से बाहर नहीं जाते। बातचीत सेव नहीं होती।'],
    ],
    faqTitle: 'आम सवाल',
    faq: [
      ['क्या सहीफ़ायदा मुफ़्त है?', 'हाँ। सभी कैलकुलेटर, गाइड और SIA मुफ़्त हैं। खाता बनाना ज़रूरी नहीं।'],
      ['सहीफ़ायदा पैसे कैसे कमाता है?', 'कुछ “आवेदन के लिए यहाँ क्लिक करें” लिंक पार्टनर लिंक होते हैं। उनसे खाता खोलने या खरीदने पर पार्टनर हमें कमीशन दे सकता है। आपको कुछ ज़्यादा नहीं देना पड़ता, और इससे विकल्पों का क्रम नहीं बदलता।'],
      ['क्या यह वित्तीय सलाह है?', 'नहीं। सहीफ़ायदा शैक्षिक गणना और सामान्य जानकारी देता है। असली शुल्क, दर और मंज़ूरी बैंक, ऋणदाता या बीमा कंपनी तय करती है।'],
      ['क्या आप मेरे आँकड़े या बातचीत सेव करते हैं?', 'कैलकुलेटर के आँकड़े आपके ब्राउज़र टैब में रहते हैं और रीफ़्रेश करने पर मिट जाते हैं। SIA की बातचीत सिर्फ़ चैट खुली रहने तक मेमोरी में रहती है।'],
    ],
    footerTag: 'रोज़ के पैसों की बेहतर समझ।',
    footerTools: 'कैलकुलेटर', footerServices: 'सेवाएँ', footerAbout: 'जानकारी',
    privacy: 'गोपनीयता', about: 'हमारे बारे में', limits: 'दायरा और सीमाएँ', allGuidesLink: 'सभी गाइड', allServicesLink: 'सभी सेवाएँ',
    footerNote: 'व्यावसायिक लिंक अलग से चिन्हित और बताए जाते हैं।',
    close: 'बंद करें', launcher: 'SIA से पूछें', siaModal: 'SIA: अपनी ज़रूरत बताइए',
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
  const [settings, setSettings] = useState(siteSettingsDefaults);
  const [active, setActive] = useState(null);
  const [menu, setMenu] = useState(false);
  const [toolId, setToolId] = useState(tools[0].id);
  const [theme, setTheme] = useState('light');
  const panel = useRef(null), closeButton = useRef(null), lastFocus = useRef(null), toolPanel = useRef(null);

  useEffect(() => { let live = true; readSiteSettings().then(value => { if (live) setSettings(value); }); return () => { live = false; }; }, []);
  useEffect(() => { setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'); }, []);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  // Allow deep links such as /#tool-emergency_fund from other pages.
  useEffect(() => {
    const match = window.location.hash.match(/^#tool-([a-z_]+)$/);
    if (match && tools.some(tool => tool.id === match[1])) {
      setToolId(match[1]);
      requestAnimationFrame(() => toolPanel.current?.scrollIntoView({ block: 'start' }));
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
  function openModal(id) { setMenu(false); setActive(id); }
  function chooseTool(id) {
    setToolId(id);
    requestAnimationFrame(() => toolPanel.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }
  function shareTool(tool) {
    const url = window.location.origin + (tool.path ? prefix + tool.path : prefix + '/#tool-' + tool.id);
    window.open('https://wa.me/?text=' + encodeURIComponent(t.shareText(tool[lang][0], url)), '_blank', 'noopener,noreferrer');
  }

  const modalTitle = active === 'sia' ? t.siaModal : active === 'privacy' ? t.privacyTitle : active === 'about' ? t.aboutTitle : education.title;
  const CurrentTool = current?.Component;

  return <div className="hp">
    <a className="hp-skip" href="#main">{hi ? 'मुख्य सामग्री पर जाएँ' : 'Skip to main content'}</a>
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
          <button type="button" className="hp-nav-sia" onClick={() => openModal('sia')}><Sparkles size={16} aria-hidden="true"/>{t.nav.sia}</button>
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
      {/* First screen: headline and every calculator, one tap away. */}
      <section className="hp-hero" aria-labelledby="hero-title">
        <div className="hp-hero-bg" aria-hidden="true"><span className="hp-orb a"/><span className="hp-orb b"/><span className="hp-check"/></div>
        <div className="hp-wrap">
          <span className="hp-badge"><CheckCircle2 size={15} aria-hidden="true"/>{t.badge}</span>
          <h1 id="hero-title">{heroTitle}</h1>
          <p className="hp-hero-sub">{heroSub}</p>
          {shown.tools && visibleTools.length > 0 && <>
            <h2 className="hp-pick" id="tools">{t.pick}</h2>
            <div className="hp-tool-grid">
              {visibleTools.map(tool => {
                const Icon = tool.icon, [title, text] = tool[lang], isActive = tool.id === current.id;
                return <button type="button" key={tool.id} className={isActive ? 'hp-tool-card active' : 'hp-tool-card'} style={{ '--c': tool.color }} aria-pressed={isActive} aria-controls="hp-tool-panel" onClick={() => chooseTool(tool.id)}>
                  <span className="hp-tool-icon"><Icon size={24} aria-hidden="true"/></span>
                  <span className="hp-tool-copy"><strong>{title}</strong><span className="hp-tool-text">{text}</span></span>
                  <ArrowRight className="hp-tool-arrow" size={18} aria-hidden="true"/>
                </button>;
              })}
            </div>
          </>}
        </div>
      </section>

      <div className="hp-trust">
        <ul className="hp-wrap">
          {t.trust.map((item, index) => { const Icon = [Sparkles, BadgeCheck, LockKeyhole, Scale][index]; return <li key={item}><Icon size={17} aria-hidden="true"/>{item}</li>; })}
        </ul>
      </div>

      {shown.tools && current && <section className="hp-section hp-wrap hp-tool-section" aria-labelledby="tool-title">
        <div className="hp-tool-panel" id="hp-tool-panel" ref={toolPanel} style={{ '--c': current.color }} aria-live="polite">
          <div className="hp-tool-panel-head">
            <div className="hp-tool-panel-title">
              <span className="hp-tool-icon small"><current.icon size={20} aria-hidden="true"/></span>
              <h2 id="tool-title">{current[lang][0]}</h2>
            </div>
            <div className="hp-tool-actions">
              {current.path && <a href={prefix + current.path}>{t.fullPage}<ArrowUpRight size={15} aria-hidden="true"/></a>}
              <button type="button" onClick={() => shareTool(current)}><Share2 size={15} aria-hidden="true"/>{t.share}</button>
            </div>
          </div>
          <div className="hp-howto" aria-label={t.howTo}>
            <strong>{t.howTo}</strong>
            <ol>{current[lang][2].map((step, index) => <li key={step}><span>{index + 1}</span>{step}</li>)}</ol>
          </div>
          <CurrentTool key={current.id + language} language={lang} {...(current.props || {})}/>
        </div>
      </section>}

      {shown.services && <section className="hp-section hp-wrap" aria-labelledby="services-title">
        <div className="hp-heading row">
          <div>
            <h2 id="services-title">{t.servicesTitle}</h2>
            <p>{t.servicesSub}</p>
          </div>
          <a className="hp-link" href={prefix + '/products/'}>{t.allServices}<ArrowRight size={16} aria-hidden="true"/></a>
        </div>
        <nav className="hp-services-grid" aria-label={t.servicesTitle}>
          {services.map(([id, Icon, en, hiLabel, color]) => <a key={id} href={prefix + '/products/' + directoryCategories[id].slug + '/'} style={{ '--c': color }}>
            <span className="hp-service-icon"><Icon size={22} aria-hidden="true"/></span>
            <span>{hi ? hiLabel : en}</span>
          </a>)}
        </nav>
      </section>}

      <section className="hp-wrap" aria-labelledby="sia-band-title">
        <div className="hp-sia-band">
          <img src="/brand/sahifayda-mark.png" width="56" height="56" alt=""/>
          <div><h2 id="sia-band-title">{t.siaTitle}</h2><p>{t.siaText}</p></div>
          <button type="button" className="hp-primary" onClick={() => openModal('sia')}><MessageCircle size={18} aria-hidden="true"/>{t.nav.sia}</button>
        </div>
      </section>

      {shown.guides && <section className="hp-section hp-wrap" id="guides" aria-labelledby="guides-title">
        <div className="hp-heading row">
          <div>
            <span className="hp-kicker">{t.guidesKicker}</span>
            <h2 id="guides-title">{t.guidesTitle}</h2>
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

    <button type="button" className="sia-launcher" onClick={() => openModal('sia')} aria-haspopup="dialog" aria-label={t.launcher}>
      <span className="sia-avatar"><img src="/brand/sahifayda-mark.png" width="26" height="26" alt=""/></span>
      <span><strong>{t.launcher}</strong><small>{hi ? 'हिन्दी · English' : 'Hindi · English'}</small></span>
    </button>

    {active !== null && <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) setActive(null); }}>
      <section className={'modal' + (active === 'sia' ? ' sia-chat-modal' : '')} role="dialog" aria-modal="true" aria-labelledby="modal-title" ref={panel}>
        <div className="modal-header">
          <img src="/brand/sahifayda-mark.png" width="28" height="28" alt=""/><span translate="no">SahiFayda</span>
          <button ref={closeButton} type="button" onClick={() => setActive(null)} aria-label={t.close}><X size={22} aria-hidden="true"/></button>
        </div>
        <h2 id="modal-title">{modalTitle}</h2>
        {active === 'sia' && <SiaLive language={lang} starters={starters}/>}
        {active === 'privacy' && <p className="modal-intro">{t.privacyText}</p>}
        {active === 'about' && <p className="modal-intro">{t.aboutText}</p>}
        {active === 'limitations' && <div className="education-details"><p className="modal-intro">{education.notice}</p><ol>{education.points.map(point => <li key={point}>{point}</li>)}</ol></div>}
      </section>
    </div>}
  </div>;
}
