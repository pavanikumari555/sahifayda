'use client';

import { useState } from 'react';
import { Home, TrendingUp, DollarSign, Calendar, AlertCircle, CheckCircle2, XCircle, ArrowRight, Building } from 'lucide-react';
import SocialProofCounter from './SocialProofCounter';
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
      subtitle: 'Calculate EMI, compare with rent, and find your break-even point for smart decision making',
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
        hiddenCosts: 'Hidden Costs',
        registry: 'Registry Fees',
        stampDuty: 'Stamp Duty',
        gst: 'GST on Interest',
        maintenance: 'Maintenance (20 yrs)',
        totalInvestment: 'Total Investment',
        homeValue: 'Estimated Home Value',
        netGain: 'Net Gain/Loss',
        rentScenario: 'Rent Scenario',
        totalRent: 'Total Rent Paid',
        investmentGains: 'Investment Gains',
        breakEven: 'Break-Even Point',
        verdict: 'Verdict',
        buyBetter: 'Buying is Better',
        rentBetter: 'Renting is Better'
      },
      tips: {
        buyTitle: 'Buy is better if:',
        buyPoints: [
          'Staying in same city for 10+ years',
          'Want own home security',
          'Property prices rising',
          'Rent-to-EMI ratio is high'
        ],
        rentTitle: 'Rent is better if:',
        rentPoints: [
          'Might relocate within 5-7 years',
          'Want investment flexibility',
          'Property prices stagnant/falling',
          'Can get better returns elsewhere'
        ]
      }
    },
    hi: {
      badge: 'होम लोन vs किराया कैलकुलेटर',
      title: 'घर खरीदें या किराये पर रहें?',
      subtitle: 'EMI जानें, किराये से तुलना करें, और ब्रेक-ईवन पॉइंट देखें स्मार्ट निर्णय के लिए',
      inputs: {
        homePrice: 'घर की कीमत',
        downPayment: 'डाउन पेमेंट',
        interestRate: 'ब्याज दर (वार्षिक)',
        tenure: 'लोन अवधि',
        currentRent: 'वर्तमान मासिक किराया',
        age: 'आपकी उम्र',
        city: 'शहर'
      },
      cities: {
        mumbai: 'मुंबई',
        delhi: 'दिल्ली NCR',
        bangalore: 'बैंगलोर',
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
        hiddenCosts: 'छिपी हुई लागत',
        registry: 'रजिस्ट्री शुल्क',
        stampDuty: 'स्टाम्प ड्यूटी',
        gst: 'ब्याज पर GST',
        maintenance: 'रखरखाव (20 साल)',
        totalInvestment: 'कुल निवेश',
        homeValue: 'अनुमानित घर मूल्य',
        netGain: 'शुद्ध लाभ/हानि',
        rentScenario: 'किराया परिदृश्य',
        totalRent: 'कुल किराया भुगतान',
        investmentGains: 'निवेश लाभ',
        breakEven: 'ब्रेक-ईवन पॉइंट',
        verdict: 'फैसला',
        buyBetter: 'खरीदना बेहतर है',
        rentBetter: 'किराये पर रहना बेहतर है'
      },
      tips: {
        buyTitle: 'खरीदें अगर:',
        buyPoints: [
          '10+ साल एक ही शहर में रहेंगे',
          'अपना घर की सुरक्षा चाहते हैं',
          'प्रॉपर्टी की कीमतें बढ़ रही हैं',
          'किराया-EMI अनुपात ज्यादा है'
        ],
        rentTitle: 'किराये पर रहें अगर:',
        rentPoints: [
          '5-7 साल में शहर बदल सकते हैं',
          'निवेश में लचीलापन चाहिए',
          'प्रॉपर्टी कीमतें स्थिर/गिर रही हैं',
          'बेहतर रिटर्न कहीं और मिल सकता है'
        ]
      }
    }
  };

  const t = copy[language] || copy.en;

  // Quick Fill Examples
  const examples = [
    {
      icon: '👨‍💼',
      label: isHi ? 'IT प्रोफेशनल' : 'IT Professional',
      description: isHi ? '₹60L घर, ₹20k किराया' : '₹60L home, ₹20k rent',
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
      description: isHi ? '₹1Cr घर, ₹35k किराया' : '₹1Cr home, ₹35k rent',
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
      label: isHi ? 'बिजनेसमैन' : 'Businessman',
      description: isHi ? '₹80L घर, ₹25k किराया' : '₹80L home, ₹25k rent',
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

  const formatCurrency = (amount) => {
    const absAmount = Math.abs(amount);
    if (absAmount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)}Cr`;
    } else if (absAmount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)}L`;
    } else {
      return `₹${amount.toLocaleString('en-IN')}`;
    }
  };

  return (
    <div className="home-loan-calculator not-prose" id="calculator-results" style={{
      maxWidth: '900px',
      margin: '0 auto',
      background: 'var(--surface, #ffffff)',
      border: '1px solid var(--line, #e2e8f0)',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
    }}>
      
      {/* Social Proof Counter */}
      <SocialProofCounter calculatorType="home_loan" trackUsage={true} />
      
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '11px',
          fontWeight: '700',
          color: '#7c3aed',
          background: '#f3e8ff',
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
      <div style={{ display: 'grid', gap: '16px', marginBottom: '24px', background: '#f8fafc', padding: '16px', borderRadius: '10px' }}>
        
        {/* Row 1: Home Price & Down Payment */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--ink, #334155)', display: 'block', marginBottom: '6px' }}>
              {t.inputs.homePrice}
            </label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 12px', background: '#fff' }}>
              <span style={{ color: '#94a3b8', marginRight: '6px' }}>₹</span>
              <input
                type="number"
                value={homePrice}
                onChange={(e) => setHomePrice(Number(e.target.value))}
                style={{ width: '100%', border: 'none', outline: 'none', fontSize: '14px', fontWeight: '600' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--ink, #334155)', display: 'block', marginBottom: '6px' }}>
              {t.inputs.downPayment} ({((downPayment / homePrice) * 100).toFixed(0)}%)
            </label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 12px', background: '#fff' }}>
              <span style={{ color: '#94a3b8', marginRight: '6px' }}>₹</span>
              <input
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                style={{ width: '100%', border: 'none', outline: 'none', fontSize: '14px', fontWeight: '600' }}
              />
            </div>
          </div>
        </div>

        {/* Row 2: Interest Rate & Tenure */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--ink, #334155)', display: 'block', marginBottom: '6px' }}>
              {t.inputs.interestRate}
            </label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 12px', background: '#fff' }}>
              <input
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                style={{ width: '100%', border: 'none', outline: 'none', fontSize: '14px', fontWeight: '600' }}
              />
              <span style={{ color: '#94a3b8', marginLeft: '6px' }}>%</span>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--ink, #334155)', display: 'block', marginBottom: '6px' }}>
              {t.inputs.tenure}
            </label>
            <select
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                background: '#fff',
                cursor: 'pointer'
              }}
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
            <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--ink, #334155)', display: 'block', marginBottom: '6px' }}>
              {t.inputs.currentRent}
            </label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 12px', background: '#fff' }}>
              <span style={{ color: '#94a3b8', marginRight: '6px' }}>₹</span>
              <input
                type="number"
                value={currentRent}
                onChange={(e) => setCurrentRent(Number(e.target.value))}
                style={{ width: '100%', border: 'none', outline: 'none', fontSize: '14px', fontWeight: '600' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--ink, #334155)', display: 'block', marginBottom: '6px' }}>
              {t.inputs.age}
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--ink, #334155)', display: 'block', marginBottom: '6px' }}>
              {t.inputs.city}
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                background: '#fff',
                cursor: 'pointer'
              }}
            >
              {Object.entries(t.cities).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div style={{ display: 'grid', gap: '20px' }}>
        
        {/* BUY SCENARIO */}
        <div style={{
          background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
          border: '2px solid #3b82f6',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Home size={20} color="#1e40af" />
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e40af', margin: 0 }}>
              {isHi ? 'घर खरीदने का परिदृश्य' : 'BUY SCENARIO'}
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: '#fff', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>{t.results.loanAmount}</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>{formatCurrency(loanAmount)}</div>
            </div>
            
            <div style={{ background: '#fff', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>{t.results.monthlyEmi}</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#dc2626' }}>{formatCurrency(emi)}/mo</div>
            </div>

            <div style={{ background: '#fff', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>{t.results.totalInterest}</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>{formatCurrency(totalInterest)}</div>
            </div>

            <div style={{ background: '#fff', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>{t.results.totalPayment}</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>{formatCurrency(totalPayment)}</div>
            </div>
          </div>

          {/* Hidden Costs */}
          <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>{t.results.hiddenCosts}:</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px' }}>
              <div>• {t.results.registry}: {formatCurrency(registryFees)}</div>
              <div>• {t.results.stampDuty}: {formatCurrency(stampDuty)}</div>
              <div>• {t.results.gst}: {formatCurrency(gstOnInterest)}</div>
              <div>• {t.results.maintenance}: {formatCurrency(totalMaintenance)}</div>
            </div>
          </div>

          <div style={{ borderTop: '2px dashed #3b82f6', paddingTop: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: '600' }}>{t.results.totalInvestment}:</span>
              <span style={{ fontSize: '15px', fontWeight: '700', color: '#dc2626' }}>{formatCurrency(totalInvestment)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: '600' }}>{t.results.homeValue} ({tenure} {isHi ? 'साल बाद' : 'years'}):</span>
              <span style={{ fontSize: '15px', fontWeight: '700', color: '#16a34a' }}>{formatCurrency(futureHomeValue)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: netGainBuy > 0 ? '#dcfce7' : '#fee2e2', borderRadius: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: '700' }}>{t.results.netGain}:</span>
              <span style={{ fontSize: '16px', fontWeight: '800', color: netGainBuy > 0 ? '#16a34a' : '#dc2626' }}>
                {netGainBuy > 0 ? '+' : ''}{formatCurrency(netGainBuy)}
              </span>
            </div>
          </div>
        </div>

        {/* RENT SCENARIO */}
        <div style={{
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
          border: '2px solid #f59e0b',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Building size={20} color="#b45309" />
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#b45309', margin: 0 }}>
              {isHi ? 'किराये पर रहने का परिदृश्य' : 'RENT SCENARIO'}
            </h3>
          </div>

          <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
            <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>{t.results.totalRent} ({tenure} {isHi ? 'साल' : 'years'})</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#dc2626' }}>{formatCurrency(totalRentPaid)} ❌</div>
            <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>({isHi ? 'खोया हुआ पैसा' : 'Money lost'})</div>
          </div>

          {monthlySavings > 0 && (
            <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>
                {isHi ? 'अगर बचत निवेश करें' : 'If you invest savings'} (₹{monthlySavings.toLocaleString('en-IN')}/mo @ 12%)
              </div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#16a34a' }}>{formatCurrency(investmentValue)} ✅</div>
            </div>
          )}

          <div style={{ borderTop: '2px dashed #f59e0b', paddingTop: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: rentScore > buyScore ? '#dcfce7' : '#fee2e2', borderRadius: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: '700' }}>{isHi ? 'शुद्ध लाभ/हानि' : 'Net Gain/Loss'}:</span>
              <span style={{ fontSize: '16px', fontWeight: '800', color: rentScore > 0 ? '#16a34a' : '#dc2626' }}>
                {rentScore > 0 ? '+' : ''}{formatCurrency(rentScore)}
              </span>
            </div>
          </div>
        </div>

        {/* VERDICT */}
        <div style={{
          background: isBuyBetter ? 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)' : 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
          border: `3px solid ${isBuyBetter ? '#16a34a' : '#f59e0b'}`,
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
            {t.results.verdict}
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: isBuyBetter ? '#15803d' : '#b45309', marginBottom: '8px' }}>
            {isBuyBetter ? (isHi ? '🏠 घर खरीदें' : '🏠 BUY HOME') : (isHi ? '🏢 किराये पर रहें' : '🏢 STAY ON RENT')}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>
            {t.results.breakEven}: <strong>{breakEvenDisplay}</strong>
          </div>

          {/* Tips */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px', textAlign: 'left' }}>
            <div style={{ background: '#fff', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#16a34a', marginBottom: '6px' }}>
                ✅ {t.tips.buyTitle}
              </div>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11px', color: '#475569' }}>
                {t.tips.buyPoints.map((point, i) => (
                  <li key={i} style={{ marginBottom: '4px' }}>{point}</li>
                ))}
              </ul>
            </div>

            <div style={{ background: '#fff', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#f59e0b', marginBottom: '6px' }}>
                ✅ {t.tips.rentTitle}
              </div>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11px', color: '#475569' }}>
                {t.tips.rentPoints.map((point, i) => (
                  <li key={i} style={{ marginBottom: '4px' }}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
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
