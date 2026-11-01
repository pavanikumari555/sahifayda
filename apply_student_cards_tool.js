const fs = require("fs");
const path = require("path");

console.log("=== Installing Student & Zero-Income Credit Card Finder ===");

// 1. Ensure components directory exists
if (!fs.existsSync("components")) {
  fs.mkdirSync("components", { recursive: true });
}

const compCode = `'use client';
import { useState, useMemo } from 'react';
import { GraduationCap, Sparkles, ShieldCheck, CheckCircle2, ArrowRight, TrendingUp, Award, Clock } from 'lucide-react';

export default function StudentCardFinder({ language = 'en' }) {
  const isHi = language === 'hi';
  const [fdAmount, setFdAmount] = useState(5000);
  const [profileType, setProfileType] = useState('student');

  const profiles = [
    { id: 'student', label: isHi ? '🎓 कॉलेज स्टूडेंट (18+)' : '🎓 College Student (18+)' },
    { id: 'freelancer', label: isHi ? '💼 फ्रीलांसर / गिग वर्कर' : '💼 Freelancer / Self-Employed' },
    { id: 'beginner', label: isHi ? '🏠 0 CIBIL / फर्स्ट-टाइम यूजर' : '🏠 0 CIBIL / First-Time User' },
  ];

  const presets = [
    { label: '₹2,000 (शुरुआती)', val: 2000 },
    { label: '₹5,000 (मोस्ट पॉपुलर)', val: 5000 },
    { label: '₹10,000 (स्टैंडर्ड)', val: 10000 },
    { label: '₹25,000 (हाई लिमिट)', val: 25000 },
  ];

  const cardMatches = useMemo(() => {
    const fd = Number(fdAmount) || 2000;
    const annualInterestRate = 0.075;
    const annualFdInterest = Math.round(fd * annualInterestRate);

    const cards = [
      {
        id: 'idfc_wow',
        name: 'IDFC FIRST WOW Credit Card',
        badge: isHi ? 'सिर्फ ₹2,000 FD • 0% फॉरेक्स' : 'Min ₹2,000 FD • 0% Forex',
        minFd: 2000,
        limitPercent: 100,
        fee: isHi ? 'लाइफटाइम फ़्री (₹0 फीस)' : 'Lifetime Free (₹0 Fee)',
        fdRate: 'Up to 7.5% p.a.',
        features: [
          isHi ? '100% क्रेडिट लिमिट (₹' + fd.toLocaleString('en-IN') + ' लिमिट)' : '100% Credit Limit (₹' + fd.toLocaleString('en-IN') + ' limit)',
          isHi ? '0% फॉरेक्स मार्कअप (इंटरनेशनल पेमेंट्स और विदेशी पढ़ाई के लिए बेस्ट)' : '0% Forex Markup (Best for foreign exams & subscriptions)',
          isHi ? 'बिना इनकम प्रूफ या सिबिल स्कोर के 100% अप्रूवल' : '100% Approval with Zero Income Proof or CIBIL check',
        ],
        applyUrl: 'https://sahifayda.pages.dev/guides/credit-cards/',
        bestFor: isHi ? 'छात्रों और कम बजट के लिए भारत का नंबर 1 सिक्योर्ड कार्ड' : 'Best overall secured card for students and beginners in India',
        rating: '4.9 ★',
        isBest: fd < 5000 || profileType === 'student'
      },
      {
        id: 'onecard_metal',
        name: 'OneCard Metal (FD-Backed)',
        badge: isHi ? 'प्रीमियम मेटल कार्ड • 5X रिवॉर्ड्स' : 'Premium Metal Card • 5X Rewards',
        minFd: 5000,
        limitPercent: 100,
        fee: isHi ? 'लाइफटाइम फ़्री (₹0 फीस)' : 'Lifetime Free (₹0 Fee)',
        fdRate: 'Up to 7.1% p.a.',
        features: [
          isHi ? 'शानदार मेटल क्रेडिट कार्ड (बिना किसी जॉइनिंग फीस के)' : 'Sleek Metal Credit Card with Zero Annual Maintenance Fee',
          isHi ? 'शीर्ष 2 खर्चों पर 5X रिवॉर्ड पॉइंट्स और इंस्टेंट स्टोर डिस्काउंट' : '5X Reward Points on top 2 categories + retail offers',
          isHi ? 'सिर्फ 5 मिनट में आधार OTP और वीडियो KYC से एक्टिवेट' : 'Instant activation via Aadhaar OTP in 5 minutes',
        ],
        applyUrl: 'https://sahifayda.pages.dev/guides/credit-cards/',
        bestFor: isHi ? 'मेटल कार्ड स्टाइल, कैशबैक और 6 महीने में 750 सिबिल स्कोर के लिए' : 'Best for premium metal feel, rewards and building 750+ CIBIL score',
        rating: '4.8 ★',
        isBest: fd >= 5000 && profileType !== 'student'
      },
      {
        id: 'kotak_dream',
        name: 'Kotak 811 #DreamDifferent Card',
        badge: isHi ? '₹10,000 FD • 45 दिन फ़्री क्रेडिट' : 'Min ₹10,000 FD • 45 Days Free Credit',
        minFd: 10000,
        limitPercent: 90,
        fee: isHi ? 'लाइफटाइम फ़्री' : 'Lifetime Free',
        fdRate: 'Up to 7.0% p.a.',
        features: [
          isHi ? '90% क्रेडिट लिमिट (₹' + Math.round(fd * 0.9).toLocaleString('en-IN') + ' लिमिट)' : '90% Credit Limit (₹' + Math.round(fd * 0.9).toLocaleString('en-IN') + ' limit)',
          isHi ? '500 एक्टिवेशन वेलकम रिवॉर्ड पॉइंट्स' : '500 Activation Welcome Reward Points',
          isHi ? 'ATM से 90% कैश निकालने पर 48 दिन तक 0% ब्याज' : 'Interest-free cash withdrawals up to 48 days',
        ],
        applyUrl: 'https://sahifayda.pages.dev/guides/zero-balance/',
        bestFor: isHi ? 'Kotak 811 खाताधारकों के लिए आसान अप्रूवल' : 'Seamless integration for Kotak 811 digital account users',
        rating: '4.7 ★',
        isBest: false
      }
    ];

    return {
      cards: cards.filter(c => fd >= c.minFd).length ? cards.filter(c => fd >= c.minFd) : [cards[0]],
      annualFdInterest,
      fd
    };
  }, [fdAmount, profileType, isHi]);

  return (
    <div className="student-card-finder not-prose" style={{
      background: 'var(--surface, #ffffff)',
      border: '1px solid var(--line, #e2e8f0)',
      borderRadius: '24px',
      padding: '24px',
      boxShadow: '0 10px 30px -5px rgba(0,0,0,0.06)',
      margin: '24px 0'
    }}>
      <div style={{ marginBottom: '20px' }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(22, 102, 75, 0.1)',
          color: '#16664b',
          padding: '4px 10px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '700',
          marginBottom: '6px'
        }}>
          <GraduationCap size={14} /> {isHi ? 'स्टूडेंट व 0-इनकम क्रेडिट कार्ड फ़ाइंडर' : 'Student & Zero-Income Card Finder'}
        </span>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--ink, #0f172a)', margin: '4px 0' }}>
          {isHi ? 'बिना सैलरी स्लिप और 0 CIBIL पर 100% गारंटीड क्रेडिट कार्ड' : 'Get a Guaranteed Credit Card with No Income Proof & 0 CIBIL'}
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--muted, #64748b)', margin: 0 }}>
          {isHi ? 'FD पर 7.5% ब्याज भी कमाएँ + 100% क्रेडिट लिमिट पाएँ + 6 महीने में 750+ CIBIL स्कोर बनाएँ:' : 'Earn 7.5% interest on your FD + Get 100% card credit limit + Build a 750+ CIBIL score in 6 months:'}
        </p>
      </div>

      <div style={{ background: 'var(--bg, #f8fafc)', padding: '16px', borderRadius: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--ink, #1e293b)', marginBottom: '6px' }}>
              {isHi ? 'आप कितनी सुरक्षित FD रख सकते हैं (₹):' : 'Fixed Deposit (FD) Amount You Can Keep (₹):'}
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '10px', fontWeight: '600', color: '#64748b' }}>₹</span>
              <input
                type="number"
                inputMode="decimal"
                value={fdAmount}
                min={2000}
                step={1000}
                onChange={(e) => setFdAmount(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 28px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '18px',
                  fontWeight: '700',
                  background: '#ffffff',
                  color: '#0f172a',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--ink, #1e293b)', marginBottom: '6px' }}>
              {isHi ? 'आपकी प्रोफ़ाइल चुनें:' : 'Select Your Profile:'}
            </label>
            <select
              value={profileType}
              onChange={(e) => setProfileType(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                fontWeight: '600',
                background: '#ffffff',
                color: '#0f172a',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>
            {isHi ? 'पॉपुलर FD राशि:' : 'Quick Presets:'}
          </span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setFdAmount(p.val)}
              style={{
                padding: '4px 10px',
                borderRadius: '16px',
                border: fdAmount === p.val ? '1px solid #16664b' : '1px solid #e2e8f0',
                background: fdAmount === p.val ? '#16664b' : '#ffffff',
                color: fdAmount === p.val ? '#ffffff' : '#475569',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{
        background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
        border: '1px solid #a7f3d0',
        borderRadius: '16px',
        padding: '16px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <TrendingUp size={18} color="#16664b" />
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#065f46', margin: 0 }}>
            {isHi ? '6 महीने में 0 से 750+ CIBIL स्कोर बनाने का फ़ॉर्मूला:' : '6-Month Roadmap to a 750+ CIBIL Score:'}
          </h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '12px', color: '#047857' }}>
          <div style={{ background: '#ffffff', padding: '10px', borderRadius: '10px', border: '1px solid #d1fae5' }}>
            <strong>1. {isHi ? 'महीना 1' : 'Month 1'}:</strong> {isHi ? '₹' + cardMatches.fd.toLocaleString('en-IN') + ' की सुरक्षित FD रखें, पूरा कार्ड लिमिट चालू हो जाएगा।' : 'Deposit ₹' + cardMatches.fd.toLocaleString('en-IN') + ' FD & get instant card limit.'}
          </div>
          <div style={{ background: '#ffffff', padding: '10px', borderRadius: '10px', border: '1px solid #d1fae5' }}>
            <strong>2. {isHi ? 'महीना 3' : 'Month 3'}:</strong> {isHi ? 'लिमिट का सिर्फ़ 30% खर्चें और समय पर बिल भरें। सिबिल रिपोर्ट बन जाएगी।' : 'Spend under 30% of limit and pay on time. CIBIL score gets generated.'}
          </div>
          <div style={{ background: '#ffffff', padding: '10px', borderRadius: '10px', border: '1px solid #d1fae5' }}>
            <strong>3. {isHi ? 'महीना 6' : 'Month 6'}:</strong> {isHi ? 'स्कोर 750+ पहुँचते ही बड़े बैंक (HDFC, SBI) बिना FD के कार्ड ऑफर करेंगे!' : 'Score crosses 750+, unlocking pre-approved unsecured cards!'}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
          {isHi ? '₹' + cardMatches.fd.toLocaleString('en-IN') + ' की FD पर 100% अप्रूवल वाले कार्ड्स:' : 'Guaranteed Cards Available for ₹' + cardMatches.fd.toLocaleString('en-IN') + ' FD:'}
        </h3>

        {cardMatches.cards.map((card) => (
          <div
            key={card.id}
            style={{
              borderRadius: '16px',
              border: card.isBest ? '2px solid #16664b' : '1px solid #e2e8f0',
              background: card.isBest ? 'rgba(22, 102, 75, 0.02)' : '#ffffff',
              padding: '18px',
              boxShadow: card.isBest ? '0 4px 16px rgba(22, 102, 75, 0.08)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {card.isBest && (
                    <span style={{ background: '#16664b', color: '#ffffff', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '6px' }}>
                      #1 RECOMMENDED
                    </span>
                  )}
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#16664b' }}>{card.badge}</span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>• {card.fee}</span>
                </div>
                <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: '4px 0 2px 0' }}>
                  {card.name}
                </h4>
                <p style={{ fontSize: '12px', color: '#475569', margin: 0 }}>
                  {card.bestFor}
                </p>
              </div>

              <div style={{ textAlign: 'right', background: 'rgba(22, 102, 75, 0.06)', padding: '8px 14px', borderRadius: '12px', minWidth: '150px' }}>
                <div style={{ fontSize: '11px', color: '#64748b' }}>{isHi ? 'कार्ड लिमिट मिलेगी:' : 'Card Limit Granted:'}</div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#16664b' }}>
                  ₹{Math.round(cardMatches.fd * (card.limitPercent / 100)).toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '11px', color: '#047857', fontWeight: '600' }}>
                  + ₹{cardMatches.annualFdInterest}/yr {isHi ? 'FD ब्याज भी' : 'FD Interest'}
                </div>
              </div>
            </div>

            <ul style={{ margin: '12px 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {card.features.map((feat, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#334155' }}>
                  <CheckCircle2 size={14} color="#16664b" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
              <span style={{ fontSize: '11px', color: '#64748b' }}>
                ✓ {isHi ? '100% ऑनलाइन • 0 पेपरवर्क • 5 मिनट एक्टिवेशन' : '100% Online • Zero Paperwork • Instant Approval'}
              </span>
              <a
                href={card.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#16664b',
                  color: '#ffffff',
                  padding: '9px 18px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '700',
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px rgba(22, 102, 75, 0.25)'
                }}
              >
                <span>{isHi ? '💳 यह कार्ड अभी अप्लाई करें' : '💳 Apply Now (100% Approval)'}</span>
                <ArrowRight size={15} />
              </a>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid #f1f5f9', fontSize: '11px', color: '#94a3b8' }}>
        {isHi
          ? 'नोट: FD आधारित क्रेडिट कार्ड में आपका मूलधन बैंक में RBI नियमों के तहत 100% सुरक्षित रहता है और उस पर ब्याज भी मिलता रहता है।'
          : 'Note: In secured FD-backed credit cards, your fixed deposit remains 100% safe under RBI guidelines and continues earning interest.'}
      </div>
    </div>
  );
}`;

fs.writeFileSync("components/StudentCardFinder.js", compCode, "utf8");
console.log("[1/3] ✓ Created components/StudentCardFinder.js");

// 2. Ensure app/student-credit-cards directory exists
if (!fs.existsSync("app/student-credit-cards")) {
  fs.mkdirSync("app/student-credit-cards", { recursive: true });
}

const pageCode = `import StudentCardFinder from '@/components/StudentCardFinder';

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
}`;

fs.writeFileSync("app/student-credit-cards/page.js", pageCode, "utf8");
console.log("[2/3] ✓ Created app/student-credit-cards/page.js (Dedicated Landing Page)");

// 3. Update app/sitemap.js to include /student-credit-cards
try {
  let sitemapCode = fs.readFileSync("app/sitemap.js", "utf8");
  if (!sitemapCode.includes("/student-credit-cards")) {
    sitemapCode = sitemapCode.replace("routes = [", "routes = [\\n    { path: \\x27/student-credit-cards\\x27, priority: 0.95, freq: \\x27daily\\x27 },");
    fs.writeFileSync("app/sitemap.js", sitemapCode, "utf8");
    console.log("[3/3] ✓ Added /student-credit-cards to app/sitemap.js");
  } else {
    console.log("[3/3] - /student-credit-cards already in sitemap.js");
  }
} catch (e) {
  console.log("[3/3] Note on sitemap.js:", e.message);
}

console.log("\\n=== Student Credit Card Tool Successfully Installed! Ready to Git Push. ===");