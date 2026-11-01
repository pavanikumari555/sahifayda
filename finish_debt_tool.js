const fs = require('fs');
const path = require('path');

console.log("=== Completing Credit Card Debt Trap Calculator Setup ===");

// 1. Ensure app/debt-trap-calculator directory exists
if (!fs.existsSync('app/debt-trap-calculator')) {
  fs.mkdirSync('app/debt-trap-calculator', { recursive: true });
}

// 2. Create app/debt-trap-calculator/page.js
const pageContent = `import CreditCardDebtTrapCalculator from '@/components/CreditCardDebtTrapCalculator';

export const metadata = {
  title: 'Credit Card Debt Trap & EMI Exit Calculator India 2026 | SahiFayda',
  description: 'Trapped in credit card debt or minimum due? Calculate exact interest and GST savings across 3, 6, 12, and 24-month EMI conversions versus minimum amount due.',
  alternates: {
    canonical: 'https://sahifayda.pages.dev/debt-trap-calculator',
  },
  openGraph: {
    title: 'Credit Card Bill EMI vs Minimum Due Calculator India | SahiFayda',
    description: 'Find out how much extra interest your bank charges on credit card bills and calculate the fastest way to become debt-free.',
    url: 'https://sahifayda.pages.dev/debt-trap-calculator',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'SahiFayda Credit Card Debt Trap & EMI Exit Calculator',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'INR',
  },
  description: 'Interactive Indian credit card interest calculator comparing minimum amount due with 3, 6, 12, and 24 month EMI conversions and debt consolidation loans.',
};

export default function DebtTrapCalculatorPage() {
  return (
    <main className="container-page" style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 16px' }}>
      <header style={{ marginBottom: '24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--ink, #0f172a)', marginBottom: '8px' }}>
          Credit Card Debt Trap & EMI Exit Calculator 🇮🇳
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--muted, #64748b)', maxWidth: '640px', margin: '0 auto' }}>
          Understand the real cost of Minimum Due (42% APR) and find the most cost-effective EMI tenure to clear your credit card balance with minimum interest.
        </p>
      </header>

      <CreditCardDebtTrapCalculator initialBill={50000} language="en" />

      <section style={{ marginTop: '40px', lineHeight: '1.7', color: 'var(--ink, #334155)', fontSize: '14px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>
          Why Paying Only Minimum Amount Due (MAD) is Dangerous in India
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginTop: '16px' }}>
          <div style={{ padding: '16px', background: '#fef2f2', borderRadius: '12px', border: '1px solid #fee2e2' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#dc2626', marginTop: 0 }}>
              1. The 42% Interest Bomb
            </h3>
            <p style={{ margin: 0, fontSize: '13px' }}>
              Unlike home or personal loans (10%–14%), credit card unpaid balances attract 3.5% monthly finance charges (42% annual APR). Plus, an 18% GST is added on top of all interest.
            </p>
          </div>
          <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#16664b', marginTop: 0 }}>
              2. Why 6-Month EMI is the Sweet Spot
            </h3>
            <p style={{ margin: 0, fontSize: '13px' }}>
              Converting to a 6-month EMI cuts your interest rate down from 42% to ~15% reducing rate, keeping monthly payments manageable while avoiding the massive interest penalty of 24-month tenures.
            </p>
          </div>
          <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1e40af', marginTop: 0 }}>
              3. The Personal Loan Debt Escape
            </h3>
            <p style={{ margin: 0, fontSize: '13px' }}>
              If your card bill exceeds ₹1,00,000, taking an instant low-interest personal loan at 10.5%–12% to wipe out the credit card debt saves you thousands of rupees in compounding interest and protects your CIBIL score.
            </p>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
`;

fs.writeFileSync('app/debt-trap-calculator/page.js', pageContent, 'utf8');
console.log("[1/2] ✓ Created app/debt-trap-calculator/page.js (Landing Page)");

// 3. Update app/sitemap.js to add /debt-trap-calculator
try {
  let sitemapCode = fs.readFileSync('app/sitemap.js', 'utf8');
  if (!sitemapCode.includes('/debt-trap-calculator')) {
    sitemapCode = sitemapCode.replace("routes = [", "routes = [\n    { path: '/debt-trap-calculator', priority: 0.95, freq: 'daily' },");
    fs.writeFileSync('app/sitemap.js', sitemapCode, 'utf8');
    console.log("[2/2] ✓ Added /debt-trap-calculator to app/sitemap.js");
  } else {
    console.log("[2/2] - /debt-trap-calculator already present in sitemap.js");
  }
} catch (e) {
  console.log("[2/2] Note on sitemap.js:", e.message);
}

console.log("\n=== Complete! Ready to git add, commit, and push. ===");