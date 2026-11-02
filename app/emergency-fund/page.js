import EmergencyFundCalculator from '../EmergencyFundCalculator';

export const metadata = {
  title: 'Emergency Fund Calculator India 2026 - How Much Do You Need? | SahiFayda',
  description: 'Calculate the exact emergency fund you need based on monthly expenses, family size, and job type. 6-12 months expenses calculator with investment recommendations.',
  alternates: {
    canonical: 'https://sahifayda.pages.dev/emergency-fund',
  },
  openGraph: {
    title: 'Emergency Fund Calculator - Job Loss, Medical Crisis Protection | SahiFayda',
    description: 'Find out if you have enough emergency money. Calculate 6-12 months expenses fund needed for financial security.',
    url: 'https://sahifayda.pages.dev/emergency-fund',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'SahiFayda Emergency Fund Calculator',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'INR',
  },
  description: 'Free Indian emergency fund calculator showing exactly how much money you need for 6-12 months expenses based on job stability, family size, and monthly spending.',
};

export default function EmergencyFundPage() {
  return (
    <main className="container-page" style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 16px' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <header style={{ marginBottom: '24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--ink, #0f172a)', marginBottom: '8px' }}>
          Emergency Fund Calculator India 🇮🇳
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--muted, #64748b)', maxWidth: '640px', margin: '0 auto' }}>
          Calculate how much emergency money you need to survive job loss, medical emergencies, or family crises
        </p>
      </header>

      <EmergencyFundCalculator language="en" />

      <section style={{ marginTop: '40px', lineHeight: '1.7', color: 'var(--ink, #334155)', fontSize: '14px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
          Why Emergency Fund Matters in India
        </h2>
        <p style={{ marginBottom: '12px' }}>
          Most Indians don't have emergency funds. When crisis hits — job loss, medical emergency, family obligation — they take high-interest loans or break FDs meant for goals.
        </p>
        <p style={{ marginBottom: '12px' }}>
          An emergency fund is 6-12 months of expenses kept separately in instant-access accounts. It's NOT an investment — it's insurance against debt.
        </p>
        
        <h3 style={{ fontSize: '18px', fontWeight: '700', marginTop: '24px', marginBottom: '10px' }}>
          How Much Emergency Fund Do You Need?
        </h3>
        <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
          <li><strong>Salaried job:</strong> 6 months expenses (₹1,80,000 if you spend ₹30,000/month)</li>
          <li><strong>Self-employed:</strong> 9 months expenses (income irregular)</li>
          <li><strong>Freelancer:</strong> 12 months expenses (highest risk)</li>
        </ul>

        <h3 style={{ fontSize: '18px', fontWeight: '700', marginTop: '24px', marginBottom: '10px' }}>
          Where to Keep Emergency Fund?
        </h3>
        <ol style={{ paddingLeft: '20px', marginBottom: '16px' }}>
          <li><strong>Savings Account (30%):</strong> Instant access for immediate needs</li>
          <li><strong>Liquid Mutual Fund (50%):</strong> Withdraw in 1 working day, earns 6-7%</li>
          <li><strong>Sweep FD (20%):</strong> Auto-breaks on need, higher interest than savings</li>
        </ol>

        <h3 style={{ fontSize: '18px', fontWeight: '700', marginTop: '24px', marginBottom: '10px' }}>
          Emergency Fund Before Investing
        </h3>
        <p style={{ marginBottom: '12px' }}>
          Don't invest in stocks, mutual funds, or crypto until you have emergency fund. Why? If crisis hits and you have to sell investments during market crash, you lose money twice.
        </p>
        <p style={{ marginBottom: '12px' }}>
          Build emergency fund first → Then start SIPs and investments.
        </p>

        <div style={{ background: '#fef3c7', border: '1px solid #fde047', borderRadius: '8px', padding: '16px', marginTop: '20px' }}>
          <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#854d0e' }}>
            ⚠️ Without emergency fund, one job loss or medical emergency can push you into 24-42% interest debt trap. Build it before buying car, house, or investing.
          </p>
        </div>
      </section>
    </main>
  );
}
