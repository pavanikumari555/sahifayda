'use client';

import { useState } from 'react';
import { Home, Building, Info } from 'lucide-react';
import PDFDownloadButton from './PDFDownloadButton';
import QuickFillExamples from './QuickFillExamples';
import { CalculatorField } from './calculator-fields';
import { homeComparison, numericInput } from '../lib/calculator-math.mjs';

export default function HomeLoanCalculator({ language = 'en' }) {
  const isHi = language === 'hi';
  
  const [homePrice, setHomePrice] = useState(6000000); // ₹60 lakhs
  const [downPayment, setDownPayment] = useState(1200000); // 20%
  const [interestRate, setInterestRate] = useState(8.5); // %
  const [tenure, setTenure] = useState(20); // years
  const [currentRent, setCurrentRent] = useState(20000); // ₹20k/month
  const [assumptions,setAssumptions] = useState({registryRate:6,stampRate:7,maintenance:3000,appreciation:6,rentGrowth:5,investmentRate:8});

  const copy = {
    en: {
      badge: 'Home Loan vs Rent Calculator',
      title: 'Should You Buy a Home or Stay on Rent?',
      subtitle: 'How to use: enter the home price, down payment, loan interest rate, tenure and your current rent. The result compares the estimated cost of buying with renting and investing the EMI–rent difference.',
      exampleNote: 'Starting figures are editable illustrations, not bank quotes or guaranteed returns. Set registration and stamp duty for your state and adjust maintenance, rent growth, home appreciation and investment return. Both choices use the same initial funds and monthly budget. Home-loan interest is GST-exempt; processing fees and their taxes, insurance, tax benefits and selling costs are excluded.',
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
        registry: 'Registration fees',
        stampDuty: 'Stamp duty',
        maintenance: 'Monthly maintenance',
        totalInvestment: 'Estimated total cost',
        homeValue: 'Estimated home value',
        netGain: 'Estimated wealth at end of period',
        rentScenario: 'Rent scenario',
        totalRent: 'Total rent paid',
        rentNote: 'Rent does not build ownership',
        investLabel: 'Renter investments (initial funds and monthly savings)',
        investRate: 'selected annual return',
        investmentGains: 'Investment gains',
        breakEven: 'First month buyer wealth reaches renter wealth (may reverse)',
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
      exampleNote: 'शुरुआती आँकड़े बदल सकने वाले उदाहरण हैं, बैंक की दर या सुनिश्चित return नहीं। अपने राज्य की रजिस्ट्री और स्टाम्प शुल्क भरें; रखरखाव, किराया वृद्धि, घर की कीमत और निवेश return बदलें। दोनों विकल्प समान शुरुआती रकम और मासिक बजट लेते हैं। होम लोन ब्याज पर GST नहीं है। प्रोसेसिंग शुल्क व उनके कर, बीमा, कर लाभ और बिक्री खर्च शामिल नहीं हैं।',
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
        registry: 'रजिस्ट्री शुल्क',
        stampDuty: 'स्टाम्प शुल्क',
        maintenance: 'मासिक रखरखाव',
        totalInvestment: 'अनुमानित कुल खर्च',
        homeValue: 'घर का अनुमानित मूल्य',
        netGain: 'अवधि के अंत में अनुमानित संपत्ति',
        rentScenario: 'किराये पर रहने का अनुमान',
        totalRent: 'कुल दिया गया किराया',
        rentNote: 'किराये से घर का मालिकाना हक़ नहीं बनता',
        investLabel: 'किराएदार का शुरुआती धन और मासिक बचत का निवेश',
        investRate: 'चुना गया सालाना return',
        investmentGains: 'निवेश से अनुमानित लाभ',
        breakEven: 'खरीदार की संपत्ति पहली बार बराबर होने का महीना (बाद में बदल सकता है)',
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

  };

  const comparison = homeComparison({ homePrice: numericInput(homePrice), downPayment: numericInput(downPayment),
    interestRate: numericInput(interestRate), tenure: numericInput(tenure), currentRent: numericInput(currentRent),
    ...Object.fromEntries(Object.entries(assumptions).map(([key,value])=>[key,numericInput(value)])) });
  const { loanAmount, emi, totalPayment, totalInterest, registryFees, stampDuty,
    totalMaintenance, totalInvestment, totalRentPaid, futureHomeValue,
    buyerWealth: buyScore, renterWealth: rentScore } = comparison || {};
  const netGainBuy = buyScore;
  const investmentValue = rentScore;
  const firstLead = comparison?.firstBuyLeadMonth;
  const breakEvenDisplay = firstLead == null ? (isHi ? 'चुनी गई अवधि में नहीं' : 'Not within the selected period')
    : firstLead + (isHi ? ' महीने' : ' months');
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
                onChange={(e) => setHomePrice(e.target.value)}
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
                onChange={(e) => setDownPayment(e.target.value)}
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
                onChange={(e) => setInterestRate(e.target.value)}
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

        <CalculatorField label={t.inputs.currentRent+' (₹)'} value={currentRent} onChange={setCurrentRent} max={1e8}/>
        <details><summary>{isHi?'रजिस्ट्री, वृद्धि और निवेश की धारणाएँ बदलें':'Edit registration, growth and investment assumptions'}</summary>
          <div className="calc-grid">{Object.keys(assumptions).map((key,index)=><CalculatorField key={key}
           label={(isHi?['रजिस्ट्री (%)','स्टाम्प शुल्क (%)','मासिक रखरखाव (₹)','घर की सालाना वृद्धि (%)','किराए की सालाना वृद्धि (%)','निवेश का सालाना return (%)']:['Registration (%)','Stamp duty (%)','Monthly maintenance (₹)','Annual home growth (%)','Annual rent growth (%)','Annual investment return (%)'])[index]}
           value={assumptions[key]} min={['appreciation','rentGrowth','investmentRate'].includes(key)?-50:0} max={key==='maintenance'?1e8:['registryRate','stampRate'].includes(key)?30:50}
           onChange={value=>setAssumptions(old=>({...old,[key]:value}))}/>)}</div>
        </details>
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
        <span>{t.exampleNote} <a href="https://cbic-gst.gov.in/sectoral-faq.html" target="_blank" rel="noopener noreferrer">{isHi ? 'GST स्रोत: CBIC (10 नवम्बर 2026)' : 'GST source: CBIC (checked 10 Nov 2026)'}</a></span>
      </div>

      {!comparison && <p role="alert">{isHi ? 'सही धनराशि और ब्याज दर भरें। डाउन पेमेंट घर की कीमत से अधिक नहीं हो सकता।' : 'Enter valid amounts and rates. Down payment cannot exceed the home price.'}</p>}
      {comparison && <>
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

          {comparison && (
            <div style={{ ...statCardStyle, marginBottom: '12px' }}>
              <div style={statLabelStyle}>
                {t.results.investLabel} ({assumptions.investmentRate}% {t.results.investRate})
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
      </>}
    </div>
  );
}
