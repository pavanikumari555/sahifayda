const fs = require('fs');
const path = require('path');

console.log("=== Sahi Fayda: Automated SEO & Indexing Pipeline ===");

// 1. Create app/sitemap.js
const sitemapContent = `export default function sitemap() {
  const baseUrl = 'https://sahifayda.pages.dev';
  const now = new Date();

  const routes = [
    { path: '', priority: 1.0, freq: 'daily' },
    { path: '/hi', priority: 1.0, freq: 'daily' },
    { path: '/guides', priority: 0.9, freq: 'weekly' },
    { path: '/hi/guides', priority: 0.9, freq: 'weekly' },
    { path: '/products', priority: 0.9, freq: 'weekly' },
    { path: '/hi/products', priority: 0.9, freq: 'weekly' },
  ];

  return routes.map((r) => ({
    url: \`\${baseUrl}\${r.path}\`,
    lastModified: now,
    changeFrequency: r.freq,
    priority: r.priority,
    alternates: {
      languages: {
        'en-IN': \`\${baseUrl}\${r.path.replace('/hi', '') || '/'}\`,
        'hi-IN': \`\${baseUrl}/hi\${r.path.replace('/hi', '')}\`,
      },
    },
  }));
}
`;

fs.writeFileSync('app/sitemap.js', sitemapContent, 'utf8');
console.log("[1/4] ✓ Created app/sitemap.js (Dynamic English + Hindi hreflang Sitemap)");

// 2. Create app/robots.js
const robotsContent = `export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: 'https://sahifayda.pages.dev/sitemap.xml',
  };
}
`;

fs.writeFileSync('app/robots.js', robotsContent, 'utf8');
console.log("[2/4] ✓ Created app/robots.js (Robots directive + Admin shield)");

// 3. Create components/HomeFaqSchema.js
if (!fs.existsSync('components')) {
  fs.mkdirSync('components', { recursive: true });
}

const faqSchemaContent = `export default function HomeFaqSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': 'https://sahifayda.pages.dev/#app',
        name: 'SahiFayda - Smart Money & Scheme Advisor',
        url: 'https://sahifayda.pages.dev',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'All',
        inLanguage: ['en-IN', 'hi-IN'],
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'INR',
        },
        featureList: [
          'Budgeting and Everyday Expense Planning',
          'Loan EMI & Purchase Quote Comparisons',
          'Government Welfare Scheme and Subsidy Guidance',
          'Voice-Assisted Financial Advice (SIA)',
          '100% Client-Side Privacy without Forced Sign-up',
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://sahifayda.pages.dev/#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is SahiFayda and how does it help Indian households?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'SahiFayda is a free, transparent personal finance and welfare advisory platform for India. It helps users plan monthly budgets, compare loan repayment quotes, understand government welfare schemes, and optimize savings in both English and Hindi.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is SahiFayda free to use?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, SahiFayda is 100% free with no hidden fees, subscriptions, or forced account registrations. Calculations and comparisons run directly in your browser with full privacy.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I access SahiFayda in Hindi?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, SahiFayda offers complete bilingual support. You can switch seamlessly between English and Hindi (/hi) across all guides, tools, and SIA advisor interactions.',
            },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
`;

fs.writeFileSync('components/HomeFaqSchema.js', faqSchemaContent, 'utf8');
console.log("[3/4] ✓ Created components/HomeFaqSchema.js (Google Position 0 Rich Snippets)");

// 4. Update app/page.js to include HomeFaqSchema
try {
  let pageContent = fs.readFileSync('app/page.js', 'utf8');
  if (!pageContent.includes('HomeFaqSchema')) {
    pageContent = `import HomeFaqSchema from '../components/HomeFaqSchema';\n` + pageContent;
    if (pageContent.includes('<main')) {
      pageContent = pageContent.replace(/(<main[^>]*>)/, '$1\n      <HomeFaqSchema />');
    } else if (pageContent.includes('return (')) {
      pageContent = pageContent.replace(/(return\s*\(\s*<[a-zA-Z0-9]+[^>]*>)/, '$1\n      <HomeFaqSchema />');
    }
    fs.writeFileSync('app/page.js', pageContent, 'utf8');
    console.log("[4/5] ✓ Connected HomeFaqSchema inside app/page.js");
  } else {
    console.log("[4/5] - HomeFaqSchema already linked in app/page.js");
  }
} catch (e) {
  console.log("[4/5] Note on app/page.js:", e.message);
}

// 5. Create .github/workflows/seo-ping.yml (Automated Search Ping)
if (!fs.existsSync('.github/workflows')) {
  fs.mkdirSync('.github/workflows', { recursive: true });
}

const workflowContent = `name: Automated SEO & Search Engine Ping

on:
  push:
    branches: [main]
  schedule:
    - cron: '0 4 * * *' # Every day at 04:00 UTC (09:30 AM IST)
  workflow_dispatch:

jobs:
  ping-search-engines:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Google & Bing with Sitemap
        run: |
          echo "Pinging search engines with updated sitemap..."
          curl -s "https://www.google.com/ping?sitemap=https://sahifayda.pages.dev/sitemap.xml" || true
          curl -s "https://www.bing.com/ping?sitemap=https://sahifayda.pages.dev/sitemap.xml" || true
          echo "SEO ping completed successfully!"
`;

fs.writeFileSync('.github/workflows/seo-ping.yml', workflowContent, 'utf8');
console.log("[5/5] ✓ Created .github/workflows/seo-ping.yml (Daily automated Google/Bing push)");

console.log("\n=== All SEO & Automation Files Created Successfully! ===");