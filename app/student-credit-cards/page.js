import StudentCardFinder from '@/components/StudentCardFinder';

export const metadata = {
  title: 'Best Credit Cards for Students & Zero Income in India 2026 (No Salary Slip) | SahiFayda',
  description: 'College student or freelancer with no income proof and 0 CIBIL score? Compare guaranteed FD-backed credit cards starting from ₹2,000 FD, earn 7.5% interest, and build a 750+ CIBIL score.',
  alternates: {
    canonical: 'https://sahifayda.pages.dev/student-credit-cards',
  },
  openGraph: {
    title: 'Guaranteed Credit Cards for Students Without Income Proof 2026 | SahiFayda',
    description: 'Get a lifetime-free credit card with 0 CIBIL score & zero salary slip. Earn 7.5% FD interest + 100% card limit.',
    url: 'https://sahifayda.pages.dev/student-credit-cards',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'SahiFayda Student & Zero-Income Credit Card Finder',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'INR',
  },
  description: 'Interactive Indian student credit card matching engine for zero-income and 0 CIBIL score users.',
};

export default function StudentCreditCardsPage() {
  return (
    <main className="container-page" style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 16px' }}>
      <header style={{ marginBottom: '24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--ink, #0f172a)', marginBottom: '8px' }}>
          Best Credit Cards for Students Without Income Proof (2026) 🎓🇮🇳
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--muted, #64748b)', maxWidth: '640px', margin: '0 auto' }}>
          No salary slip, no ITR, and zero CIBIL score? Compare guaranteed lifetime-free secured cards starting from just ₹2,000 FD and build a 750+ credit score in 6 months.
        </p>
      </header>

      <StudentCardFinder language="en" />

      <section style={{ marginTop: '40px', lineHeight: '1.7', color: 'var(--ink, #334155)', fontSize: '14px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>
          How College Students in India Can Build a 750+ CIBIL Score Before Graduating
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginTop: '16px' }}>
          <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#16664b', marginTop: 0 }}>
              1. Why FD-Backed Cards Never Get Rejected
            </h3>
            <p style={{ margin: 0, fontSize: '13px' }}>
              Traditional cards check salary slips because they take a credit risk. Secured cards (like IDFC WOW or OneCard) lock your small fixed deposit as collateral, guaranteeing 100% approval for anyone 18+ with an Aadhaar and PAN card.
            </p>
          </div>
          <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1e40af', marginTop: 0 }}>
              2. Double Benefit: Interest + Card Limit
            </h3>
            <p style={{ margin: 0, fontSize: '13px' }}>
              Your FD is not locked away for free. Banks pay up to 7.5% annual interest on your deposit, meaning your money grows while you enjoy online discounts, book train tickets, and build credit history.
            </p>
          </div>
          <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#047857', marginTop: 0 }}>
              3. The Golden 30% Utilization Rule
            </h3>
            <p style={{ margin: 0, fontSize: '13px' }}>
              To get a 750+ score fast, never spend more than 30% of your credit limit (e.g., spend under ₹1,500 on a ₹5,000 card) and pay the full bill on the same day it is generated.
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