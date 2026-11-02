'use client';

import { useState } from 'react';
import { TrendingUp, Sparkles, Users, Calculator, Shield, Zap, ArrowRight, CheckCircle } from 'lucide-react';
import './modern-hero.css';

export default function ModernHomepage({ language = 'en', onOpenCalculator }) {
  const isHi = language === 'hi';

  const copy = {
    en: {
      badge: '🎉 6 FREE Financial Calculators',
      title: 'Make Smart Money Decisions',
      subtitle: 'Calculate EMI, compare loans, plan emergency funds & make informed financial choices — all in one place, completely free',
      stats: [
        { number: '6', label: 'Free Tools' },
        { number: '5k+', label: 'Users' },
        { number: '100%', label: 'Free' }
      ],
      calculators: [
        {
          id: 'card_offers',
          icon: '💳',
          color1: '#22c55e',
          color2: '#16a34a',
          title: 'Shopping Discounts Calculator',
          description: 'Find which credit card gives maximum cashback on Amazon, Flipkart & brand purchases',
          features: ['Save ₹2,500+', 'Compare offers', 'No Cost EMI'],
          users: '1.2k'
        },
        {
          id: 'debt_trap',
          icon: '🛑',
          color1: '#ef4444',
          color2: '#dc2626',
          title: 'Debt Trap Exit Calculator',
          description: 'See how much extra you pay with minimum due vs full payment. Escape 42% interest trap',
          features: ['EMI comparison', 'Interest breakdown', 'Smart payoff plan'],
          users: '892'
        },
        {
          id: 'student_cards',
          icon: '🎓',
          color1: '#3b82f6',
          color2: '#2563eb',
          title: 'Student Credit Cards',
          description: 'Get guaranteed credit card with ₹0 income. Build 750+ CIBIL score in 6 months',
          features: ['No salary needed', 'FD backed', 'Build credit'],
          users: '634'
        },
        {
          id: 'emergency_fund',
          icon: '💰',
          color1: '#ec4899',
          color2: '#db2777',
          title: 'Emergency Fund Calculator',
          description: 'Calculate exactly how much emergency money you need for 6-12 months protection',
          features: ['Job loss ready', 'Medical crisis', 'Smart allocation'],
          users: '1.5k'
        },
        {
          id: 'car_vs_uber',
          icon: '🚗',
          color1: '#06b6d4',
          color2: '#0891b2',
          title: 'Car vs Uber Calculator',
          description: 'Should you buy a car or use Uber? See TRUE 5-year cost comparison with all expenses',
          features: ['EMI + Fuel', 'Maintenance', 'Break-even point'],
          users: '1.1k'
        },
        {
          id: 'home_loan',
          icon: '🏠',
          color1: '#a855f7',
          color2: '#9333ea',
          title: 'Home Loan vs Rent',
          description: 'Buy home or stay on rent? Complete comparison with hidden costs & break-even analysis',
          features: ['EMI calculator', 'Rent comparison', 'Investment gains'],
          users: 'NEW'
        }
      ],
      features: [
        {
          icon: '🔒',
          title: 'Your Privacy First',
          text: 'All calculations happen in your browser. We never store your financial data'
        },
        {
          icon: '⚡',
          title: 'Instant Results',
          text: 'Get accurate calculations in seconds. No signup, no waiting'
        },
        {
          icon: '📱',
          title: 'Works Everywhere',
          text: 'Mobile, tablet, desktop — works perfectly on all devices'
        },
        {
          icon: '🇮🇳',
          title: 'Made for India',
          text: 'EMI calculations, Indian banks, rupee values — built for your needs'
        }
      ],
      cta: 'Open Calculator',
      sectionTitle: 'Choose Your Calculator',
      sectionSubtitle: 'Click any card to start calculating',
      featuresTitle: 'Why Use SahiFayda?',
      featuresSubtitle: 'Trusted by thousands of Indians for smart money decisions'
    },
    hi: {
      badge: '🎉 6 मुफ़्त वित्तीय कैलकुलेटर',
      title: 'स्मार्ट पैसों के फ़ैसले लें',
      subtitle: 'EMI कैलकुलेट करें, लोन की तुलना करें, आपातकालीन फ़ंड की योजना बनाएँ — सब कुछ एक जगह, बिल्कुल मुफ़्त',
      stats: [
        { number: '6', label: 'मुफ़्त टूल' },
        { number: '5k+', label: 'उपयोगकर्ता' },
        { number: '100%', label: 'मुफ़्त' }
      ],
      calculators: [
        {
          id: 'card_offers',
          icon: '💳',
          color1: '#22c55e',
          color2: '#16a34a',
          title: 'शॉपिंग डिस्काउंट कैलकुलेटर',
          description: 'Amazon, Flipkart और ब्रांड खरीद पर किस क्रेडिट कार्ड से सबसे ज़्यादा कैशबैक मिलेगा',
          features: ['₹2,500+ बचाएँ', 'ऑफ़र तुलना', 'No Cost EMI'],
          users: '1.2k'
        },
        {
          id: 'debt_trap',
          icon: '🛑',
          color1: '#ef4444',
          color2: '#dc2626',
          title: 'क़र्ज़ मुक्ति कैलकुलेटर',
          description: 'देखें minimum due vs full payment में कितना एक्स्ट्रा देना पड़ता है। 42% ब्याज से बचें',
          features: ['EMI तुलना', 'ब्याज विवरण', 'स्मार्ट प्लान'],
          users: '892'
        },
        {
          id: 'student_cards',
          icon: '🎓',
          color1: '#3b82f6',
          color2: '#2563eb',
          title: 'स्टूडेंट क्रेडिट कार्ड',
          description: '₹0 सैलरी पर गारंटीड क्रेडिट कार्ड। 6 महीने में 750+ CIBIL स्कोर बनाएँ',
          features: ['सैलरी ज़रूरी नहीं', 'FD backed', 'क्रेडिट बनाएँ'],
          users: '634'
        },
        {
          id: 'emergency_fund',
          icon: '💰',
          color1: '#ec4899',
          color2: '#db2777',
          title: 'आपातकालीन फ़ंड कैलकुलेटर',
          description: '6-12 महीने की सुरक्षा के लिए कितना आपातकालीन फ़ंड चाहिए यह कैलकुलेट करें',
          features: ['नौकरी जाने पर', 'मेडिकल क्राइसिस', 'स्मार्ट allocation'],
          users: '1.5k'
        },
        {
          id: 'car_vs_uber',
          icon: '🚗',
          color1: '#06b6d4',
          color2: '#0891b2',
          title: 'कार vs Uber कैलकुलेटर',
          description: 'कार लें या Uber? 5 साल की असली लागत सभी खर्चों के साथ देखें',
          features: ['EMI + पेट्रोल', 'मेंटेनेंस', 'ब्रेक-ईवन'],
          users: '1.1k'
        },
        {
          id: 'home_loan',
          icon: '🏠',
          color1: '#a855f7',
          color2: '#9333ea',
          title: 'होम लोन vs किराया',
          description: 'घर लें या किराये में रहें? छिपी लागत और ब्रेक-ईवन के साथ पूरी तुलना',
          features: ['EMI कैलकुलेटर', 'किराया तुलना', 'निवेश लाभ'],
          users: 'नया'
        }
      ],
      features: [
        {
          icon: '🔒',
          title: 'आपकी गोपनीयता पहले',
          text: 'सभी गणना आपके ब्राउज़र में होती है। हम आपका वित्तीय डेटा कभी नहीं रखते'
        },
        {
          icon: '⚡',
          title: 'तुरंत नतीजे',
          text: 'सेकंडों में सटीक गणना पाएँ। साइनअप नहीं, प्रतीक्षा नहीं'
        },
        {
          icon: '📱',
          title: 'हर जगह काम करे',
          text: 'मोबाइल, टैबलेट, डेस्कटॉप — सभी उपकरणों पर बिल्कुल ठीक काम करता है'
        },
        {
          icon: '🇮🇳',
          title: 'भारत के लिए बनाया',
          text: 'EMI गणना, भारतीय बैंक, रुपये — आपकी ज़रूरतों के लिए बनाया गया'
        }
      ],
      cta: 'कैलकुलेटर खोलें',
      sectionTitle: 'अपना कैलकुलेटर चुनें',
      sectionSubtitle: 'गणना शुरू करने के लिए किसी भी कार्ड पर क्लिक करें',
      featuresTitle: 'सहीफायदा क्यों इस्तेमाल करें?',
      featuresSubtitle: 'हजारों भारतीयों द्वारा स्मार्ट पैसों के फ़ैसलों के लिए विश्वसनीय'
    }
  };

  const t = copy[language] || copy.en;

  return (
    <>
      {/* Modern Hero Section */}
      <section className="modern-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>{t.badge}</span>
          </div>
          
          <h1 className="hero-title">
            {t.title}
          </h1>
          
          <p className="hero-subtitle">
            {t.subtitle}
          </p>

          <div className="hero-stats">
            {t.stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <span className="stat-number">{stat.number}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator Cards Section */}
      <section style={{ padding: '0 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', marginTop: '60px', marginBottom: '32px' }}>
          <h2 style={{ 
            fontSize: 'clamp(24px, 4vw, 36px)', 
            fontWeight: '800', 
            color: '#0f172a',
            marginBottom: '12px'
          }}>
            {t.sectionTitle}
          </h2>
          <p style={{ 
            fontSize: '16px', 
            color: '#64748b',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            {t.sectionSubtitle}
          </p>
        </div>

        <div className="calculator-grid">
          {t.calculators.map((calc, index) => (
            <div 
              key={calc.id}
              className="calc-card"
              style={{
                '--card-color-1': calc.color1,
                '--card-color-2': calc.color2,
                animationDelay: `${index * 0.1}s`
              }}
              onClick={() => onOpenCalculator && onOpenCalculator(calc.id)}
            >
              <div className="calc-icon" style={{
                background: `linear-gradient(135deg, ${calc.color1}, ${calc.color2})`
              }}>
                {calc.icon}
              </div>
              
              <h3 className="calc-title">{calc.title}</h3>
              <p className="calc-description">{calc.description}</p>
              
              <div className="calc-features">
                {calc.features.map((feature, i) => (
                  <span key={i} className="feature-tag">
                    <CheckCircle size={10} style={{ marginRight: '4px', display: 'inline' }} />
                    {feature}
                  </span>
                ))}
              </div>
              
              <div className="calc-cta">
                <div className="calc-users">
                  <Users size={14} />
                  <span>{calc.users} {isHi ? 'उपयोगकर्ता' : 'users'}</span>
                </div>
                <div className="calc-arrow" style={{
                  background: calc.color1
                }}>
                  <ArrowRight size={18} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ 
            fontSize: 'clamp(24px, 4vw, 36px)', 
            fontWeight: '800', 
            color: '#0f172a',
            marginBottom: '12px'
          }}>
            {t.featuresTitle}
          </h2>
          <p style={{ 
            fontSize: '16px', 
            color: '#64748b',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            {t.featuresSubtitle}
          </p>
        </div>

        <div className="features-grid">
          {t.features.map((feature, index) => (
            <div key={index} className="feature-item">
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-text">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
