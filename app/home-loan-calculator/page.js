import HomeLoanCalculator from '../HomeLoanCalculator';

export const metadata = {
  title: 'Home Loan vs Rent Calculator | Should You Buy or Rent? | SahiFayda',
  description: 'Calculate home loan EMI, compare buying vs renting, find break-even point. Smart calculator for Indian home buyers. Compare 10-30 year scenarios with hidden costs.',
  keywords: 'home loan calculator, rent vs buy, EMI calculator, property investment, real estate calculator India, home loan EMI, should I buy home or rent',
  openGraph: {
    title: 'Home Loan vs Rent Calculator - Make Smart Property Decision',
    description: 'Calculate EMI, compare rent vs buy, find break-even point with our comprehensive home loan calculator',
    type: 'website',
  }
};

export default function HomeLoanCalculatorPage() {
  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <HomeLoanCalculator language="en" />
      
      {/* SEO Content */}
      <div style={{ marginTop: '40px', maxWidth: '900px', margin: '40px auto 0', padding: '20px', background: '#f8fafc', borderRadius: '12px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>About This Calculator</h2>
        <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6', marginBottom: '12px' }}>
          Our Home Loan vs Rent Calculator helps you make one of the biggest financial decisions of your life. 
          Calculate your monthly EMI, compare total costs of buying vs renting, and discover your break-even point.
        </p>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', marginTop: '16px' }}>Features:</h3>
        <ul style={{ fontSize: '14px', color: '#475569', lineHeight: '1.8', paddingLeft: '20px' }}>
          <li>Accurate EMI calculation for home loans from ₹10L to ₹5Cr</li>
          <li>Hidden costs included: Registry fees, stamp duty, GST, maintenance</li>
          <li>Property appreciation projections based on city</li>
          <li>Rent vs Buy comparison with investment alternatives</li>
          <li>Break-even point analysis for smart decision making</li>
          <li>Age-based recommendations for home buying</li>
        </ul>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', marginTop: '16px' }}>How to Use:</h3>
        <ol style={{ fontSize: '14px', color: '#475569', lineHeight: '1.8', paddingLeft: '20px' }}>
          <li>Enter your desired home price and down payment amount</li>
          <li>Select interest rate (typically 8-10% for home loans in India)</li>
          <li>Choose loan tenure (10, 15, 20, 25, or 30 years)</li>
          <li>Add your current monthly rent for comparison</li>
          <li>Select your city for accurate property appreciation estimates</li>
          <li>Review detailed comparison and make informed decision</li>
        </ol>
      </div>
    </div>
  );
}

export const dynamic = 'force-static';
