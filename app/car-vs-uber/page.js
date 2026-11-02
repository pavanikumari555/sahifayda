import CarVsUberCalculator from '../CarVsUberCalculator';

export const metadata = {
  title: 'Car vs Uber Calculator India 2026 - Real Cost Comparison | SahiFayda',
  description: 'Should you buy a car or use Uber/Ola? Calculate TRUE 5-year cost including EMI, fuel, insurance, parking vs ride-sharing + Metro. Surprising results!',
  alternates: {
    canonical: 'https://sahifayda.pages.dev/car-vs-uber',
  },
  openGraph: {
    title: 'Car Ownership vs Ride-Sharing Calculator - Save Lakhs | SahiFayda',
    description: 'Calculate if buying a car makes financial sense or if Uber/Ola + Metro is cheaper. Hidden costs revealed.',
    url: 'https://sahifayda.pages.dev/car-vs-uber',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'SahiFayda Car vs Uber/Ola Calculator',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'INR',
  },
  description: 'Free calculator comparing true cost of car ownership (EMI, fuel, insurance, parking) vs Uber/Ola ride-sharing over 5 years for Indian cities.',
};

export default function CarVsUberPage() {
  return (
    <main className="container-page" style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 16px' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <header style={{ marginBottom: '24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--ink, #0f172a)', marginBottom: '8px' }}>
          Car vs Uber/Ola Calculator 🚗
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--muted, #64748b)', maxWidth: '640px', margin: '0 auto' }}>
          Should you buy a car or use ride-sharing? Calculate the REAL 5-year cost difference and make the smarter choice
        </p>
      </header>

      <CarVsUberCalculator language="en" />

      <section style={{ marginTop: '40px', lineHeight: '1.7', color: 'var(--ink, #334155)', fontSize: '14px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
          The Hidden Truth About Car Ownership in India
        </h2>
        <p style={{ marginBottom: '12px' }}>
          Most people think: "EMI is ₹12,000, I can afford it." But car ownership costs 2-3X the EMI when you add fuel, insurance, maintenance, parking, depreciation.
        </p>
        <p style={{ marginBottom: '12px' }}>
          A ₹8 lakh car actually costs ₹13-14 lakhs over 5 years. Same money invested @ 12% becomes ₹20 lakhs.
        </p>
        
        <h3 style={{ fontSize: '18px', fontWeight: '700', marginTop: '24px', marginBottom: '10px' }}>
          Hidden Costs of Car Ownership
        </h3>
        <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
          <li><strong>Depreciation:</strong> ₹2-3 lakh per year (biggest hidden cost)</li>
          <li><strong>Post-warranty repairs:</strong> ₹15,000-40,000/year after 3 years</li>
          <li><strong>Traffic fines & tolls:</strong> ₹5,000-10,000/year</li>
          <li><strong>Parking tickets:</strong> Often forgotten, adds ₹3,000-5,000</li>
          <li><strong>Resale hassle:</strong> Time wasted + dealer margins</li>
        </ul>

        <h3 style={{ fontSize: '18px', fontWeight: '700', marginTop: '24px', marginBottom: '10px' }}>
          When You SHOULD Buy a Car
        </h3>
        <ol style={{ paddingLeft: '20px', marginBottom: '16px' }}>
          <li><strong>High monthly usage:</strong> 1,500+ km/month makes ownership cheaper per km</li>
          <li><strong>Business need:</strong> Client meetings, deliveries, field work</li>
          <li><strong>Family necessity:</strong> Kids' school, elderly parents' medical needs</li>
          <li><strong>No Metro:</strong> City with poor public transport</li>
          <li><strong>Secure parking:</strong> Society parking or office slot available</li>
        </ol>

        <h3 style={{ fontSize: '18px', fontWeight: '700', marginTop: '24px', marginBottom: '10px' }}>
          The Uber/Ola + Metro Strategy
        </h3>
        <p style={{ marginBottom: '12px' }}>
          <strong>Daily commute:</strong> Metro pass ₹1,200/month (unlimited travel in most cities)
        </p>
        <p style={{ marginBottom: '12px' }}>
          <strong>Office + meetings:</strong> Uber Pool/Auto ₹3,000-5,000/month
        </p>
        <p style={{ marginBottom: '12px' }}>
          <strong>Weekend outings:</strong> Premium rides ₹2,000-3,000/month
        </p>
        <p style={{ marginBottom: '12px' }}>
          <strong>Total:</strong> ₹6,000-10,000/month vs ₹20,000-25,000 car ownership
        </p>
        <p style={{ marginBottom: '12px' }}>
          <strong>Savings:</strong> ₹12,000/month invested = ₹10 lakh corpus in 5 years
        </p>

        <h3 style={{ fontSize: '18px', fontWeight: '700', marginTop: '24px', marginBottom: '10px' }}>
          Special Tip: Zoomcar/Revv for Weekend Trips
        </h3>
        <p style={{ marginBottom: '12px' }}>
          Need car for weekend outstation trip? Rent from Zoomcar/Revv at ₹2,000-3,000 for 2 days. Still cheaper than owning + no parking/maintenance headache rest of the month.
        </p>

        <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: '8px', padding: '16px', marginTop: '20px' }}>
          <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#166534' }}>
            ✅ Reality Check: If you drive less than 1,200 km/month in a Metro city, Uber + Metro is almost ALWAYS cheaper than car ownership over 5 years.
          </p>
        </div>
      </section>
    </main>
  );
}
