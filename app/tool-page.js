import './tool-page.css';
import BrandLogo from './brand';
import { toolContent } from '../lib/tool-content.mjs';
import { toolRoutes } from '../lib/tool-routes.mjs';

// Shared server-rendered shell for the dedicated calculator routes.
// `path` is the English route (e.g. '/car-vs-uber/'); the Hindi route is '/hi' + path.
export function toolPaths(path) {
  return { en: path, hi: '/hi' + path };
}

export function toolMetadata({ path, language, title, description }) {
  const paths = toolPaths(path);
  return {
    title,
    description,
    alternates: {
      canonical: language === 'hi' ? paths.hi : paths.en,
      languages: { 'en-IN': paths.en, 'hi-IN': paths.hi, 'x-default': paths.en },
    },
    openGraph: {
      title,
      description,
      url: language === 'hi' ? paths.hi : paths.en,
      type: 'website',
      locale: language === 'hi' ? 'hi_IN' : 'en_IN',
    },
  };
}

// Plain WebApplication description; no URLs, ratings or user counts.
export function ToolStructuredData({ name, description, language }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    description,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'All',
    inLanguage: language === 'hi' ? 'hi-IN' : 'en-IN',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replaceAll('<', '\\u003c') }} />;
}

export default function ToolPage({ language, path, title, intro, steps = [], children }) {
  const hi = language === 'hi';
  const home = hi ? '/hi/' : '/';
  const paths = path ? toolPaths(path) : null;
  const otherHref = paths ? (hi ? paths.en : paths.hi) : hi ? '/' : '/hi/';
  const content = toolContent[path]?.[hi ? 'hi' : 'en'];
  return (
    <div className="toolpage" lang={hi ? 'hi' : 'en'}>
      <header className="toolpage-header">
        <BrandLogo href={home} className="toolpage-logo brand-logo" size={34}/>
        <nav className="toolpage-nav" aria-label={hi ? 'पेज के लिंक' : 'Page links'}>
          <a href={home + '#tools'}>← {hi ? 'सभी टूल' : 'All tools'}</a>
          <a href={otherHref} hrefLang={hi ? 'en' : 'hi'} lang={hi ? 'en' : 'hi'}>{hi ? 'English' : 'हिन्दी'}</a>
        </nav>
      </header>
      <main className="toolpage-main">
        <h1 className="toolpage-title">{title}</h1>
        {intro && <p className="toolpage-intro">{intro}</p>}
        {steps.length > 0 && (
          <section className="toolpage-steps" aria-labelledby="toolpage-steps-title">
            <h2 id="toolpage-steps-title">{hi ? 'इस्तेमाल कैसे करें' : 'How to use'}</h2>
            <ol>
              {steps.map((step) => <li key={step}>{step}</li>)}
            </ol>
          </section>
        )}
        <div className="toolpage-tool">{children}</div>
        {content && <article className="toolpage-method">
          <p>{hi ? 'गणना की समीक्षा: सहीफ़ायदा · ' : 'Calculation review: SahiFayda · '}<time dateTime="2026-11-10">2026-11-10</time></p>
          <h2>{hi ? 'गणना कैसे होती है?' : 'How the calculation works'}</h2><p>{content.method}</p>
          <h2>{hi ? 'समझाया हुआ उदाहरण' : 'Worked example'}</h2><p>{content.example}</p>
          <h2>{hi ? 'सीमाएँ और जरूरी शर्तें' : 'Limitations and conditions'}</h2><p>{content.limits}</p>
          <h2>{hi ? 'आम सवाल' : 'Common questions'}</h2>
          {content.faq.map(([question, answer]) => <section key={question}><h3>{question}</h3><p>{answer}</p></section>)}
          <p><a href={(hi ? '/hi' : '') + '/guides/' + content.guide + '/'}>{hi ? 'संबंधित पूरी गाइड' : 'Read the related guide'}</a></p>
          <p><a href={(hi ? '/hi' : '') + '/editorial-policy/'}>{hi ? 'स्रोत, समीक्षा और सुधार की नीति' : 'Sources, reviews and corrections policy'}</a></p>
        </article>}
        {content && <nav className="toolpage-related" aria-label={hi ? 'दूसरे कैलकुलेटर' : 'Related calculators'}>
          {toolRoutes.filter(route => route !== path).map(route => <a key={route} href={(hi ? '/hi' : '') + route}>{(hi?['घर बनाम किराया','इमरजेंसी फंड','Minimum due बनाम EMI','पहला FD कार्ड','कार बनाम कैब','कैशबैक बनाम छूट']:['Buy vs rent','Emergency fund','Minimum due vs EMI','First FD card','Car vs cab','Cashback vs discount'])[toolRoutes.indexOf(route)]}</a>)}
        </nav>}
      </main>
      <footer className="toolpage-footer">
        <p>
          {hi
            ? 'यह केवल अनुमान और जानकारी के लिए है, वित्तीय सलाह नहीं। असली शुल्क, दरें और पात्रता प्रदाता तय करता है।'
            : 'For estimates and learning only, not financial advice. Providers decide actual charges, rates and eligibility.'}
        </p>
        <nav className="toolpage-nav">{[['about',hi?'हमारे बारे में':'About'],['privacy',hi?'गोपनीयता':'Privacy'],['contact',hi?'संपर्क व सुधार':'Contact & corrections']].map(([slug,label])=><a key={slug} href={(hi?'/hi':'')+'/'+slug+'/'}>{label}</a>)}</nav>
      </footer>
    </div>
  );
}
