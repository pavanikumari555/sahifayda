'use client';

import { useState } from 'react';
import { Home, Building, Info } from 'lucide-react';
import PDFDownloadButton from './PDFDownloadButton';
import QuickFillExamples from './QuickFillExamples';

export default function HomeLoanCalculator({ language = 'en' }) {
  const isHi = language === 'hi';
  
  const [homePrice, setHomePrice] = useState(6000000); // ₹60 lakhs
  const [downPayment, setDownPayment] = useState(1200000); // 20%
  const [interestRate, setInterestRate] = useState(8.5); // %
  const [tenure, setTenure] = useState(20); // years
  const [currentRent, setCurrentRent] = useState(20000); // ₹20k/month
  const [age, setAge] = useState(30);
  const [city, setCity] = useState('mumbai');

  const copy = {
    en: {
      badge: 'Home Loan vs Rent Calculator',
      title: 'Should You Buy a Home or Stay on Rent?',
      subtitle: 'How to use: enter the home price, down payment, loan interest rate, tenure and your current rent. The result compares the estimated cost of buying with renting and investing the EMI–rent difference.',
      exampleNote: 'Example figures — check current rates with the bank and your state registry office before buying. You can change the home price, down payment, interest rate, tenure and rent. Fixed example assumptions: registry 6%, stamp duty 7%, 18% GST on interest, ₹3,000/month maintenance, 6% yearly home price rise, 5% yearly rent rise and 12% yearly investment return (not guaranteed). Home-loan interest is generally not charged GST, so that line may overstate the cost. Age and city do not change this estimate.',
      disclaimer: 'This is an estimate for learning, not financial advice. Check actual charges and rates with the provider.',
      inputs: {
        homePrice: 'Home Price',
        downPayment: 'Down Payment',
        interestRate: 'Interest Rate (annual)',
        tenure: 'Loan Tenure',
        currentRent: 'Current Monthly Rent',
        age: 'Your Age',
        city: 'City'
      },
      cities: {
        mumbai: 'Mumbai',
        delhi: 'Delhi NCR',
        bangalore: 'Bangalore',
        pune: 'Pune',
        chennai: 'Chennai',
        hyderabad: 'Hyderabad',
        other: 'Other Cities'
      },
      results: {
        loanAmount: 'Loan Amount',
        monthlyEmi: 'Monthly EMI',
        totalInterest: 'Total Interest',
        totalPayment: 'Total Payment',
        hiddenCosts: 'Other costs (example rates)',
        registry: 'Registry fees (example 6%)',
        stampDuty: 'Stamp duty (example 7%)',
        gst: 'GST on interest (assumed 18%)',
        maintenance: 'Maintenance (₹3,000/month example)',
        totalInvestment: 'Estimated total cost',
        homeValue: 'Estimated home value at 6% yearly rise',
        netGain: 'Estimated net gain/loss',
        rentScenario: 'Rent scenario',
        totalRent: 'Total rent paid (5% yearly rise)',
        rentNote: 'Rent does not build ownership',
        investLabel: 'If you invest the EMI–rent difference',
        investRate: '12% example return',
        investmentGains: 'Investment gains',
        breakEven: 'Break-even point',
        verdict: 'Estimated outcome',
        buyBetter: 'Buying looks better in this estimate',
        rentBetter: 'Renting looks better in this estimate'
      },
      tips: {
        buyTitle: 'Buying may suit you if:',
        buyPoints: [
          'Staying in same city for 10+ years',
          'Want own home security',
          'Property prices rising',
          'Rent-to-EMI ratio is high'
        ],
        rentTitle: 'Renting may suit you if:',
        rentPoints: [
          'Might relocate within 5-7 years',
          'Want investment flexibility',
          'Property prices stagnant/falling',
          'Can get better returns elsewhere'
        ]
      }
    },
    hi: {
      badge: 'होम लोन बनाम किराया कैलकुलेटर',
      title: 'घर खरीदें या किराये पर रहें?',
      subtitle: 'कैसे इस्तेमाल करें: घर की कीमत, डाउन पेमेंट, लोन की ब्याज दर, अवधि और मौजूदा किराया भरें। नतीजा घर खरीदने और किराये पर रहकर EMI व किराये का अंतर निवेश करने की अनुमानित लागत की तुलना करता है।',
      exampleNote: 'उदाहरण के आँकड़े — खरीद से पहले बैंक और अपने राज्य के रजिस्ट्री कार्यालय से मौजूदा दरें जाँचें। घर की कीमत, डाउन पेमेंट, ब्याज दर, अवधि और किराया आप बदल सकते हैं। ये तय उदाहरण मान्यताएँ हैं: रजिस्ट्री 6%, स्टाम्प ड्यूटी 7%, ब्याज पर 18% GST, ₹3,000/माह रखरखाव, घर की कीमत में 6% सालाना बढ़त, किराये में 5% सालाना बढ़त और निवेश पर 12% सालाना रिटर्न (पक्का नहीं)। होम लोन के ब्याज पर आम तौर पर GST नहीं लगता, इसलिए वह पंक्ति खर्च बढ़ाकर दिखा सकती है। उम्र और शहर से यह अनुमान नहीं बदलता।',
      disclaimer: 'यह केवल अनुमान है, वित्तीय सलाह नहीं। असली शुल्क और दरें प्रदाता से जाँचें।',
      inputs: {
        homePrice: 'घर की कीमत',
        downPayment: 'डाउन पेमेंट',
        interestRate: 'ब्याज दर (सालाना)',
        tenure: 'लोन की अवधि',
        currentRent: 'मौजूदा मासिक किराया',
        age: 'आपकी उम्र',
        city: 'शहर'
      },
      cities: {
        mumbai: 'मुंबई',
        delhi: 'दिल्ली NCR',
        bangalore: 'बेंगलुरु',
        pune: 'पुणे',
        chennai: 'चेन्नई',
        hyderabad: 'हैदराबाद',
        other: 'अन्य शहर'
      },
      results: {
        loanAmount: 'लोन राशि',
        monthlyEmi: 'मासिक EMI',
        totalInterest: 'कुल ब्याज',
        totalPayment: 'कुल भुगतान',
        hiddenCosts: 'अन्य खर्च (उदाहरण दरें)',
        registry: 'रजिस्ट्री शुल्क (उदाहरण 6%)',
        stampDuty: 'स्टाम्प ड्यूटी (उदाहरण 7%)',
        gst: 'ब्याज पर GST (18% माना गया)',
        maintenance: 'रखरखाव (₹3,000/माह उदाहरण)',
        totalInvestment: 'अनुमानित कुल खर्च',
        homeValue: '6% सालाना बढ़त पर घर का अनुमानित मूल्य',
        netGain: 'अनुमानित शुद्ध लाभ/हानि',
        rentScenario: 'किराये पर रहने का अनुमान',
        totalRent: 'कुल किराया (5% सालाना बढ़त)',
        rentNote: 'किराये से घर का मालिकाना हक़ नहीं बनता',
        investLabel: 'अगर EMI और किराये का अंतर निवेश करें',
        investRate: '12% उदाहरण रिटर्न',
        investmentGains: 'निवेश से अनुमानित लाभ',
        breakEven: 'ब्रेक-ईवन (बराबरी) का समय',
        verdict: 'अनुमानित नतीजा',
        buyBetter: 'इस अनुमान में घर खरीदना बेहतर दिखता है',
        rentBetter: 'इस अनुमान में किराये पर रहना बेहतर दिखता है'
      },
      tips: {
        buyTitle: 'खरीदना बेहतर हो सकता है अगर:',
        buyPoints: [
          '10 साल से ज़्यादा एक ही शहर में रहेंगे',
          'अपने घर की सुरक्षा चाहते हैं',
          'संपत्ति की कीमतें बढ़ रही हैं',
          'किराया EMI के मुक़ाबले ज़्यादा है'
        ],
        rentTitle: 'किराया बेहतर हो सकता है अगर:',
        rentPoints: [
          '5-7 साल में शहर बदल सकते हैं',
          'निवेश में लचीलापन चाहिए',
          'संपत्ति की कीमतें स्थिर हैं या गिर रही हैं',
          'कहीं और बेहतर रिटर्न मिल सकता है'
        ]
      }
    }
  };

  const t = copy[language] || copy.en;

  // Quick Fill Examples
  const examples = [
    {
      icon: '👨‍💼',
      label: isHi ? 'IT पेशेवर' : 'IT Professional',
      description: isHi ? '₹60 लाख का घर, ₹20 हज़ार किराया' : '₹60L home, ₹20k rent',
      values: {
        homePrice: 6000000,
        downPayment: 1200000,
        interestRate: 8.5,
        tenure: 20,
        currentRent: 20000,
        age: 30,
        city: 'bangalore'
      }
    },
    {
      icon: '👨‍⚕️',
      label: isHi ? 'डॉक्टर' : 'Doctor',
      description: isHi ? '₹1 करोड़ का घर, ₹35 हज़ार किराया' : '₹1Cr home, ₹35k rent',
      values: {
        homePrice: 10000000,
        downPayment: 2500000,
        interestRate: 8.5,
        tenure: 15,
        currentRent: 35000,
        age: 35,
        city: 'mumbai'
      }
    },
    {
      icon: '💼',
      label: isHi ? 'व्यापारी' : 'Businessman',
      description: isHi ? '₹80 लाख का घर, ₹25 हज़ार किराया' : '₹80L home, ₹25k rent',
      values: {
        homePrice: 8000000,
        downPayment: 2000000,
        interestRate: 9.0,
        tenure: 18,
        currentRent: 25000,
        age: 38,
        city: 'pune'
      }
    }
  ];

  const handleQuickFill = (values) => {
    setHomePrice(values.homePrice);
    setDownPayment(values.downPayment);
    setInterestRate(values.interestRate);
    setTenure(values.tenure);
    setCurrentRent(values.currentRent);
    setAge(values.age);
    setCity(values.city);
  };

  // Calculations
  const loanAmount = homePrice - downPayment;
  const monthlyInterest = interestRate / 12 / 100;
  const numberOfPayments = tenure * 12;
  
  // EMI Calculation
  const emi = loanAmount * monthlyInterest * Math.pow(1 + monthlyInterest, numberOfPayments) / 
                (Math.pow(1 + monthlyInterest, numberOfPayments) - 1);
  
  const totalPayment = emi * numberOfPayments;
  const totalInterest = totalPayment - loanAmount;

  // Hidden Costs
  const registryFees = homePrice * 0.06; // 6% average
  const stampDuty = homePrice * 0.07; // 7% average (varies by state)
  const gstOnInterest = totalInterest * 0.18; // 18% GST
  const maintenancePerMonth = 3000;
  const totalMaintenance = maintenancePerMonth * 12 * tenure;
  
  const hiddenCosts = registryFees + stampDuty + gstOnInterest + totalMaintenance;
  const totalInvestment = downPayment + totalPayment + hiddenCosts;

  // Property Appreciation (assume 6% per year)
  const appreciationRate = 0.06;
  const futureHomeValue = homePrice * Math.pow(1 + appreciationRate, tenure);
  const netGainBuy = futureHomeValue - totalInvestment;

  // Rent Scenario
  const rentIncrease = 0.05; // 5% per year
  let totalRentPaid = 0;
  let currentRentValue = currentRent;
  
  for (let year = 0; year < tenure; year++) {
    totalRentPaid += currentRentValue * 12;
    currentRentValue = currentRentValue * (1 + rentIncrease);
  }

  // Investment if renting (EMI - Rent saved)
  const monthlySavings = emi - currentRent;
  const investmentReturn = 0.12; // 12% annual return (mutual funds)
  const monthlyInvestmentReturn = investmentReturn / 12;
  
  // Future value of investment (SIP formula)
  let investmentValue = 0;
  if (monthlySavings > 0) {
    investmentValue = monthlySavings * 
      ((Math.pow(1 + monthlyInvestmentReturn, numberOfPayments) - 1) / monthlyInvestmentReturn) * 
      (1 + monthlyInvestmentReturn);
  }

  // Break-even calculation (simplified)
  const breakEvenYears = Math.log(totalRentPaid / (emi * 12)) / Math.log(1 + rentIncrease);
  const breakEvenDisplay = breakEvenYears > 0 && breakEvenYears < 30 ? 
    `${Math.floor(breakEvenYears)} ${isHi ? 'साल' : 'years'} ${Math.floor((breakEvenYears % 1) * 12)} ${isHi ? 'महीने' : 'months'}` :
    isHi ? '30+ साल' : '30+ years';

  // Verdict
  const buyScore = netGainBuy;
  const rentScore = investmentValue - totalRentPaid;
  const isBuyBetter = buyScore > rentScore;

  // Display formatting only; Hindi uses लाख/करोड़ instead of L/Cr.
  const formatCurrency = (amount) => {
    const absAmount = Math.abs(amount);
    if (absAmount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)}${isHi ? ' करोड़' : 'Cr'}`;
    } else if (absAmount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)}${isHi ? ' लाख' : 'L'}`;
    } else {
      return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    }
  };

  const perMonth = isHi ? '/माह' : '/mo';
  const labelStyle = { fontSize: '12px', fontWeight: '600', color: 'var(--ink, #334155)', display: 'block', marginBottom: '6px' };
  const fieldWrapStyle = { display: 'flex', alignItems: 'center', border: '1px solid var(--line, #cbd5e1)', borderRadius: '8px', padding: '10px 12px', background: 'var(--field, #ffffff)' };
  const bareInputStyle = { width: '100%', border: 'none', outline: 'none', fontSize: '14px', fontWeight: '600', background: 'transparent', color: 'var(--ink, #0f172a)' };
  const boxedFieldStyle = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid var(--line, #cbd5e1)',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    background: 'var(--field, #ffffff)',
    color: 'var(--ink, #0f172a)'
  };
  const statCardStyle = { background: 'var(--surface, #ffffff)', padding: '12px', borderRadius: '8px' };
  const statLabelStyle = { fontSize: '11px', color: 'var(--muted, #64748b)', marginBottom: '4px' };

  return (
    <div className="home-loan-calculator not-prose" id="calculator-results" style={{
      maxWidth: '900px',
      margin: '0 auto',
      background: 'var(--surface, #ffffff)',
      border: '1px solid var(--line, #e2e8f0)',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      color: 'var(--ink, #0f172a)'
    }}>
      
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '11px',
          fontWeight: '700',
          color: '#8b5cf6',
          background: 'rgba(124, 58, 237, 0.12)',
          padding: '4px 10px',
          borderRadius: '12px',
          marginBottom: '6px'
        }}>
          <Home size={14} /> {t.badge}
        </span>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--ink, #0f172a)', margin: '4px 0' }}>
          {t.title}
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--muted, #64748b)', margin: '8px 0 0', lineHeight: '1.6' }}>
          {t.subtitle}
        </p>
      </div>

      {/* Quick Fill Examples */}
      <QuickFillExamples 
        examples={examples}
        onSelectExample={handleQuickFill}
        language={language}
      />

      {/* Input Form */}
      <div style={{ display: 'grid', gap: '16px', marginBottom: '24px', background: 'var(--soft, #f8fafc)', padding: '16px', borderRadius: '10px' }}>
        
        {/* Row 1: Home Price & Down Payment */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label htmlFor="home-loan-price" style={labelStyle}>
              {t.inputs.homePrice}
            </label>
            <div style={fieldWrapStyle}>
              <span style={{ color: 'var(--subtle, #94a3b8)', marginRight: '6px' }}>₹</span>
              <input
                id="home-loan-price"
                type="number"
                value={homePrice}
                onChange={(e) => setHomePrice(Number(e.target.value))}
                style={bareInputStyle}
              />
            </div>
          </div>

          <div>
            <label htmlFor="home-loan-down" style={labelStyle}>
              {t.inputs.downPayment} ({((downPayment / homePrice) * 100).toFixed(0)}%)
            </label>
            <div style={fieldWrapStyle}>
              <span style={{ color: 'var(--subtle, #94a3b8)', marginRight: '6px' }}>₹</span>
              <input
                id="home-loan-down"
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                style={bareInputStyle}
              />
            </div>
          </div>
        </div>

        {/* Row 2: Interest Rate & Tenure */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label htmlFor="home-loan-rate" style={labelStyle}>
              {t.inputs.interestRate}
            </label>
            <div style={fieldWrapStyle}>
              <input
                id="home-loan-rate"
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                style={bareInputStyle}
              />
              <span style={{ color: 'var(--subtle, #94a3b8)', marginLeft: '6px' }}>%</span>
            </div>
          </div>

          <div>
            <label htmlFor="home-loan-tenure" style={labelStyle}>
              {t.inputs.tenure}
            </label>
            <select
              id="home-loan-tenure"
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              style={{ ...boxedFieldStyle, cursor: 'pointer' }}
            >
              {[10, 15, 20, 25, 30].map(y => (
                <option key={y} value={y}>{y} {isHi ? 'साल' : 'years'}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 3: Rent, Age, City */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
          <div>
            <label htmlFor="home-loan-rent" style={labelStyle}>
              {t.inputs.currentRent}
            </label>
            <div style={fieldWrapStyle}>
              <span style={{ color: 'var(--subtle, #94a3b8)', marginRight: '6px' }}>₹</span>
              <input
                id="home-loan-rent"
                type="number"
                value={currentRent}
                onChange={(e) => setCurrentRent(Number(e.target.value))}
                style={bareInputStyle}
              />
            </div>
          </div>

          <div>
            <label htmlFor="home-loan-age" style={labelStyle}>
              {t.inputs.age}
            </label>
            <input
              id="home-loan-age"
              type="number"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              style={boxedFieldStyle}
            />
          </div>

          <div>
            <label htmlFor="home-loan-city" style={labelStyle}>
              {t.inputs.city}
            </label>
            <select
              id="home-loan-city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={{ ...boxedFieldStyle, cursor: 'pointer' }}
            >
              {Object.entries(t.cities).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Example figures notice */}
      <div role="note" style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px',
        background: 'rgba(234, 179, 8, 0.12)',
        border: '1px solid rgba(202, 138, 4, 0.45)',
        borderRadius: '12px',
        padding: '10px 12px',
        marginBottom: '20px',
        fontSize: '12px',
        lineHeight: '1.5',
        color: 'var(--ink, #0f172a)'
      }}>
        <Info size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
        <span>{t.exampleNote}</span>
      </div>

      {/* Results Section */}
      <div style={{ display: 'grid', gap: '20px' }}>
        
        {/* BUY SCENARIO */}
        <div style={{
          background: 'rgba(59, 130, 246, 0.08)',
          border: '2px solid #3b82f6',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Home size={20} color="#3b82f6" />
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--ink, #1e40af)', margin: 0 }}>
              {isHi ? 'घर खरीदने का अनुमान' : 'BUY SCENARIO'}
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div style={statCardStyle}>
              <div style={statLabelStyle}>{t.results.loanAmount}</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--ink, #0f172a)' }}>{formatCurrency(loanAmount)}</div>
            </div>
            
            <div style={statCardStyle}>
              <div style={statLabelStyle}>{t.results.monthlyEmi}</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#dc2626' }}>{formatCurrency(emi)}{perMonth}</div>
            </div>

            <div style={statCardStyle}>
              <div style={statLabelStyle}>{t.results.totalInterest}</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--ink, #0f172a)' }}>{formatCurrency(totalInterest)}</div>
            </div>

            <div style={statCardStyle}>
              <div style={statLabelStyle}>{t.results.totalPayment}</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--ink, #0f172a)' }}>{formatCurrency(totalPayment)}</div>
            </div>
          </div>

          {/* Other costs */}
          <div style={{ ...statCardStyle, marginBottom: '12px' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--ink, #0f172a)', marginBottom: '8px' }}>{t.results.hiddenCosts}:</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px', color: 'var(--ink, #0f172a)' }}>
              <div>• {t.results.registry}: {formatCurrency(registryFees)}</div>
              <div>• {t.results.stampDuty}: {formatCurrency(stampDuty)}</div>
              <div>• {t.results.gst}: {formatCurrency(gstOnInterest)}</div>
              <div>• {t.results.maintenance}, {tenure} {isHi ? 'साल' : 'yrs'}: {formatCurrency(totalMaintenance)}</div>
            </div>
          </div>

          <div style={{ borderTop: '2px dashed #3b82f6', paddingTop: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: '600' }}>{t.results.totalInvestment}:</span>
              <span style={{ fontSize: '15px', fontWeight: '700', color: '#dc2626' }}>{formatCurrency(totalInvestment)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: '600' }}>{t.results.homeValue} ({tenure} {isHi ? 'साल बाद' : 'years'}):</span>
              <span style={{ fontSize: '15px', fontWeight: '700', color: '#16a34a' }}>{formatCurrency(futureHomeValue)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', padding: '10px', background: netGainBuy > 0 ? 'rgba(22, 163, 74, 0.12)' : 'rgba(220, 38, 38, 0.12)', borderRadius: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: '700' }}>{t.results.netGain}:</span>
              <span style={{ fontSize: '16px', fontWeight: '800', color: netGainBuy > 0 ? '#16a34a' : '#dc2626' }}>
                {netGainBuy > 0 ? '+' : ''}{formatCurrency(netGainBuy)}
              </span>
            </div>
          </div>
        </div>

        {/* RENT SCENARIO */}
        <div style={{
          background: 'rgba(245, 158, 11, 0.10)',
          border: '2px solid #f59e0b',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Building size={20} color="#d97706" />
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--ink, #b45309)', margin: 0 }}>
              {isHi ? 'किराये पर रहने का अनुमान' : 'RENT SCENARIO'}
            </h3>
          </div>

          <div style={{ ...statCardStyle, marginBottom: '12px' }}>
            <div style={statLabelStyle}>{t.results.totalRent} ({tenure} {isHi ? 'साल' : 'years'})</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#dc2626' }}>{formatCurrency(totalRentPaid)}</div>
            <div style={{ fontSize: '10px', color: 'var(--muted, #64748b)', marginTop: '4px' }}>({t.results.rentNote})</div>
          </div>

          {monthlySavings > 0 && (
            <div style={{ ...statCardStyle, marginBottom: '12px' }}>
              <div style={statLabelStyle}>
                {t.results.investLabel} (₹{Math.round(monthlySavings).toLocaleString('en-IN')}{perMonth}, {t.results.investRate})
              </div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#16a34a' }}>{formatCurrency(investmentValue)}</div>
            </div>
          )}

          <div style={{ borderTop: '2px dashed #f59e0b', paddingTop: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', padding: '10px', background: rentScore > buyScore ? 'rgba(22, 163, 74, 0.12)' : 'rgba(220, 38, 38, 0.12)', borderRadius: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: '700' }}>{t.results.netGain}:</span>
              <span style={{ fontSize: '16px', fontWeight: '800', color: rentScore > 0 ? '#16a34a' : '#dc2626' }}>
                {rentScore > 0 ? '+' : ''}{formatCurrency(rentScore)}
              </span>
            </div>
          </div>
        </div>

        {/* VERDICT */}
        <div style={{
          background: isBuyBetter ? 'rgba(22, 163, 74, 0.10)' : 'rgba(245, 158, 11, 0.10)',
          border: `3px solid ${isBuyBetter ? '#16a34a' : '#f59e0b'}`,
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--muted, #64748b)', marginBottom: '8px' }}>
            {t.results.verdict}
          </div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--ink, #0f172a)', marginBottom: '8px' }}>
            {isBuyBetter ? `🏠 ${t.results.buyBetter}` : `🏢 ${t.results.rentBetter}`}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--muted, #64748b)', marginBottom: '12px' }}>
            {t.results.breakEven}: <strong>{breakEvenDisplay}</strong>
          </div>

          {/* Tips */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px', textAlign: 'left' }}>
            <div style={statCardStyle}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--ink, #16a34a)', marginBottom: '6px' }}>
                ✅ {t.tips.buyTitle}
              </div>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11px', color: 'var(--muted, #475569)' }}>
                {t.tips.buyPoints.map((point, i) => (
                  <li key={i} style={{ marginBottom: '4px' }}>{point}</li>
                ))}
              </ul>
            </div>

            <div style={statCardStyle}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--ink, #b45309)', marginBottom: '6px' }}>
                ✅ {t.tips.rentTitle}
              </div>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11px', color: 'var(--muted, #475569)' }}>
                {t.tips.rentPoints.map((point, i) => (
                  <li key={i} style={{ marginBottom: '4px' }}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <p style={{ fontSize: '11px', color: 'var(--muted, #64748b)', margin: 0 }}>
          {t.disclaimer}
        </p>
      </div>

      {/* PDF Download */}
      <PDFDownloadButton 
        calculatorName="Home-Loan-vs-Rent"
        resultElementId="calculator-results"
        language={language}
      />
    </div>
  );
}
