import './tool-page.css';

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
  return (
    <div className="toolpage" lang={hi ? 'hi' : 'en'}>
      <header className="toolpage-header">
        <a className="toolpage-logo" href={home}>SahiFayda</a>
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
      </main>
      <footer className="toolpage-footer">
        <p>
          {hi
            ? 'यह केवल अनुमान और जानकारी के लिए है, वित्तीय सलाह नहीं। असली शुल्क, दरें और पात्रता प्रदाता तय करता है।'
            : 'For estimates and learning only, not financial advice. Providers decide actual charges, rates and eligibility.'}
        </p>
      </footer>
    </div>
  );
}
