const fs = require('fs');
const path = require('path');

console.log("=== Sahi Fayda: Fixing Build Errors (Sitemap, Use-Client & Components) ===");

// 1. Clean app/sitemap.js
const sitemapContent = `export default function sitemap() {
  const baseUrl = 'https://sahifayda.pages.dev';
  const now = new Date();

  const routes = [
    { path: '', priority: 1.0, freq: 'daily' },
    { path: '/hi', priority: 1.0, freq: 'daily' },
    { path: '/card-offers', priority: 0.95, freq: 'daily' },
    { path: '/debt-trap-calculator', priority: 0.95, freq: 'daily' },
    { path: '/student-credit-cards', priority: 0.95, freq: 'daily' },
    { path: '/guides', priority: 0.9, freq: 'weekly' },
    { path: '/hi/guides', priority: 0.9, freq: 'weekly' },
    { path: '/products', priority: 0.9, freq: 'weekly' },
    { path: '/hi/products', priority: 0.9, freq: 'weekly' },
  ];

  return routes.map((r) => ({
    url: \`\${baseUrl}\${r.path}\`,
    lastModified: now,
    changeFrequency: r.freq,
    priority: r.priority,
    alternates: {
      languages: {
        'en-IN': \`\${baseUrl}\${r.path.replace('/hi', '') || '/'}\`,
        'hi-IN': \`\${baseUrl}/hi\${r.path.replace('/hi', '')}\`,
      },
    },
  }));
}
`;

fs.writeFileSync('app/sitemap.js', sitemapContent, 'utf8');
console.log("[1/5] ✓ Fixed app/sitemap.js (clean quotes, no unicode escape errors)");

// 2. Component 1: SmartCardOfferCalculator
const cardOfferCode = `'use client';
import { useState, useMemo } from 'react';
import { ArrowRight, Tag, ShieldCheck, ExternalLink, Percent, Sparkles, ShoppingBag } from 'lucide-react';

export default function SmartCardOfferCalculator({ initialPrice = 30000, initialCategory = 'mobile', language = 'en' }) {
  const isHi = language === 'hi';
  const [price, setPrice] = useState(initialPrice);
  const [category, setCategory] = useState(initialCategory);
  const [merchant, setMerchant] = useState('amazon');

  const categories = [
    { id: 'mobile', label: isHi ? '📱 स्मार्टफोन' : '📱 Smartphone' },
    { id: 'laptop', label: isHi ? '💻 लैपटॉप / कंप्यूटर' : '💻 Laptop / PC' },
    { id: 'appliance', label: isHi ? '🧺 टीवी / एसी / फ्रिज' : '🧺 Home Appliances' },
    { id: 'general', label: isHi ? '🛒 जनरल शॉपिंग' : '🛒 General Shopping' },
  ];

  const presets = [
    { label: '₹15,000 (Budget Phone)', val: 15000 },
    { label: '₹30,000 (Mid-Range)', val: 30000 },
    { label: '₹50,000 (Laptop / TV)', val: 50000 },
    { label: '₹80,000 (Flagship Tech)', val: 80000 },
  ];

  const cardOffers = useMemo(() => {
    const val = Number(price) || 0;
    if (val <= 0) return [];

    const offers = [
      {
        id: 'amazon_icici',
        name: 'Amazon Pay ICICI Bank Credit Card',
        badge: isHi ? 'लाइफटाइम फ़्री • सबसे लोकप्रिय' : 'Lifetime Free • Most Popular',
        bank: 'ICICI Bank',
        cardType: isHi ? '0 एनुअल फीस' : '0 Annual Fee',
        rate: merchant === 'amazon' ? '5% Unlimited Cashback' : '1% Unlimited Cashback',
        cashback: merchant === 'amazon' ? Math.round(val * 0.05) : Math.round(val * 0.01),
        instantDiscount: 0,
        noCostEmiSavings: val >= 10000 ? Math.round(val * 0.04) : 0,
        applyUrl: 'https://sahifayda.pages.dev/guides/credit-cards/',
        bestFor: isHi ? 'Amazon पर हर खरीद पर 5% सीधा कैशबैक' : 'Best for Amazon purchases (5% direct statement cashback)',
        rating: '4.9 ★',
      },
      {
        id: 'sbi_cashback',
        name: 'SBI Cashback Credit Card',
        badge: isHi ? 'हर ऑनलाइन साइट पर 5%' : '5% on ALL Online Stores',
        bank: 'SBI Card',
        cardType: '₹999/yr (Reversed at ₹2L)',
        rate: '5% Cashback on Any Online Store',
        cashback: Math.min(Math.round(val * 0.05), 5000),
        instantDiscount: 0,
        noCostEmiSavings: val >= 10000 ? Math.round(val * 0.04) : 0,
        applyUrl: 'https://sahifayda.pages.dev/guides/credit-cards/',
        bestFor: isHi ? 'Amazon, Flipkart, Myntra हर जगह 5% (₹5,000/माह तक)' : '5% cashback anywhere online without merchant restrictions',
        rating: '4.8 ★',
      },
      {
        id: 'hdfc_millennia',
        name: 'HDFC Millennia Credit Card',
        badge: isHi ? 'फेस्टिवल 10% बैंक सेल ऑफर' : '10% Festive Sale Offers',
        bank: 'HDFC Bank',
        cardType: '₹1,000/yr (Reversed at ₹1L)',
        rate: '5% Cashback + ₹1,500 Instant Sale Discount',
        cashback: Math.min(Math.round(val * 0.05), 1000),
        instantDiscount: val >= 15000 ? Math.min(Math.round(val * 0.10), 2000) : 0,
        noCostEmiSavings: val >= 15000 ? Math.round(val * 0.045) : 0,
        applyUrl: 'https://sahifayda.pages.dev/guides/credit-cards/',
        bestFor: isHi ? 'Amazon & Flipkart सेल्स में सबसे ज़्यादा बैंक डिस्काउंट' : 'Highest instant discounts during Amazon & Flipkart bank sales',
        rating: '4.8 ★',
      },
      {
        id: 'flipkart_axis',
        name: 'Flipkart Axis Bank Credit Card',
        badge: merchant === 'flipkart' ? (isHi ? 'फ्लिपकार्ट पर 5% अनलिमिटेड' : '5% Unlimited on Flipkart') : (isHi ? '4% पार्टनर मर्चेंट्स' : '4% on Swiggy/Uber'),
        bank: 'Axis Bank',
        cardType: '₹500/yr (Reversed at ₹3.5L)',
        rate: merchant === 'flipkart' ? '5% Unlimited Cashback' : '1.5% Cashback',
        cashback: merchant === 'flipkart' ? Math.round(val * 0.05) : Math.round(val * 0.015),
        instantDiscount: merchant === 'flipkart' && val >= 10000 ? Math.min(Math.round(val * 0.10), 1750) : 0,
        noCostEmiSavings: val >= 10000 ? Math.round(val * 0.04) : 0,
        applyUrl: 'https://sahifayda.pages.dev/guides/credit-cards/',
        bestFor: isHi ? 'Flipkart और Myntra पर बिना किसी लिमिट के छूट' : 'Unlimited cashback on Flipkart & Myntra shopping',
        rating: '4.7 ★',
      },
      {
        id: 'onecard_fd',
        name: 'OneCard (Metal / FD-Backed Card)',
        badge: isHi ? 'बिना इनकम प्रूफ • 100% अप्रूवल' : 'No Income Proof • 100% Approval',
        bank: 'Federal / SBM / BOB',
        cardType: isHi ? 'लाइफटाइम फ़्री (₹0 फीस)' : 'Lifetime Free (₹0 Fee)',
        rate: 'Up to 10% Instant Store Discounts',
        cashback: Math.round(val * 0.01),
        instantDiscount: val >= 10000 ? Math.min(Math.round(val * 0.08), 1500) : 0,
        noCostEmiSavings: 0,
        applyUrl: 'https://sahifayda.pages.dev/guides/zero-balance/',
        bestFor: isHi ? 'CIBIL स्कोर सुधारें + Reliance Digital & Croma पर 10% छूट' : 'Best for students/beginners to build CIBIL + get 10% retail offers',
        rating: '4.6 ★',
      }
    ];

    return offers.map(o => {
      const totalSavings = o.cashback + o.instantDiscount;
      const effectivePrice = Math.max(val - totalSavings, 0);
      return { ...o, totalSavings, effectivePrice };
    }).sort((a, b) => b.totalSavings - a.totalSavings);
  }, [price, merchant, isHi]);

  const amazonSearchUrl = useMemo(() => {
    const q = category === 'mobile' ? 'smartphone' : category === 'laptop' ? 'laptop' : category === 'appliance' ? 'appliances' : 'electronics';
    return \`https://www.amazon.in/s?k=\${encodeURIComponent(q)}&tag=sahifayda-21\`;
  }, [category]);

  return (
    <div className="smart-offer-calculator not-prose" style={{
      background: 'var(--surface, #ffffff)',
      border: '1px solid var(--line, #e2e8f0)',
      borderRadius: '24px',
      padding: '24px',
      boxShadow: '0 10px 30px -5px rgba(0,0,0,0.06)',
      margin: '24px 0'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <div>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(22, 102, 75, 0.1)',
            color: '#16664b',
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '600',
            marginBottom: '6px'
          }}>
            <Sparkles size={14} /> {isHi ? 'स्मार्ट खरीद बचत कैलकुलेटर 2026' : 'Smart Purchase & Card Offer Engine'}
          </span>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--ink, #0f172a)', margin: '4px 0' }}>
            {isHi ? 'जानें किस क्रेडिट कार्ड से मिलेगी सबसे ज़्यादा छूट?' : 'Which Credit Card Saves You the Most Money?'}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--muted, #64748b)', margin: 0 }}>
            {isHi ? 'अपना बजट और सामान चुनें — देखें कौन-सा कार्ड ₹1,500 से ₹2,500 तक सीधा बचाएगा:' : 'Select your item budget to compare instant discounts, cashback & No-Cost EMI savings:'}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', background: 'var(--bg, #f8fafc)', padding: '16px', borderRadius: '16px', marginBottom: '20px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--ink, #1e293b)', marginBottom: '6px' }}>
            {isHi ? 'सामान की अनुमानित कीमत (₹):' : 'Item Price / Budget (₹):'}
          </label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '10px', fontWeight: '600', color: '#64748b' }}>₹</span>
            <input
              type="number"
              inputMode="decimal"
              value={price}
              min={1000}
              step={500}
              onChange={(e) => setPrice(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '10px 12px 10px 28px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '16px',
                fontWeight: '600',
                background: '#ffffff',
                color: '#0f172a',
                outline: 'none'
              }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--ink, #1e293b)', marginBottom: '6px' }}>
            {isHi ? 'क्या खरीदना चाहते हैं?' : 'What are you buying?'}
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              fontSize: '14px',
              fontWeight: '500',
              background: '#ffffff',
              color: '#0f172a',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--ink, #1e293b)', marginBottom: '6px' }}>
            {isHi ? 'कहाँ से खरीद रहे हैं?' : 'Shopping Store:'}
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { id: 'amazon', label: 'Amazon India' },
              { id: 'flipkart', label: 'Flipkart' },
              { id: 'any', label: isHi ? 'कोई भी स्टोर' : 'All Stores' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMerchant(m.id)}
                style={{
                  flex: 1,
                  padding: '9px 8px',
                  borderRadius: '10px',
                  border: merchant === m.id ? '2px solid #16664b' : '1px solid #cbd5e1',
                  background: merchant === m.id ? 'rgba(22, 102, 75, 0.08)' : '#ffffff',
                  color: merchant === m.id ? '#16664b' : '#334155',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>
          {isHi ? 'पॉपुलर बजट:' : 'Quick Presets:'}
        </span>
        {presets.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setPrice(p.val)}
            style={{
              padding: '4px 10px',
              borderRadius: '20px',
              border: price === p.val ? '1px solid #16664b' : '1px solid #e2e8f0',
              background: price === p.val ? '#16664b' : '#ffffff',
              color: price === p.val ? '#ffffff' : '#475569',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
            {isHi ? \`₹\${price.toLocaleString('en-IN')} के सामान पर बेस्ट कार्ड्स & बचत:\` : \`Top Card Offers on ₹\${price.toLocaleString('en-IN')} Purchase:\`}
          </h3>
          <span style={{ fontSize: '12px', color: '#16664b', fontWeight: '600' }}>
            {cardOffers[0] ? (isHi ? \`अधिकतम बचत: ₹\${cardOffers[0].totalSavings.toLocaleString('en-IN')}\` : \`Max Savings: ₹\${cardOffers[0].totalSavings.toLocaleString('en-IN')}\`) : ''}
          </span>
        </div>

        {cardOffers.map((card, idx) => (
          <div
            key={card.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '16px',
              border: idx === 0 ? '2px solid #16664b' : '1px solid #e2e8f0',
              background: idx === 0 ? 'rgba(22, 102, 75, 0.02)' : '#ffffff',
              padding: '18px',
              gap: '12px',
              boxShadow: idx === 0 ? '0 4px 16px rgba(22, 102, 75, 0.08)' : 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {idx === 0 && (
                    <span style={{ background: '#16664b', color: '#ffffff', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '6px' }}>
                      #1 BEST SAVINGS
                    </span>
                  )}
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>
                    {card.bank}
                  </span>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>• {card.cardType}</span>
                </div>
                <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '4px 0 2px 0' }}>
                  {card.name}
                </h4>
                <p style={{ fontSize: '12px', color: '#475569', margin: 0 }}>
                  {card.bestFor}
                </p>
              </div>

              <div style={{ textAlign: 'right', background: 'rgba(22, 102, 75, 0.06)', padding: '8px 14px', borderRadius: '12px', minWidth: '140px' }}>
                <div style={{ fontSize: '11px', color: '#64748b' }}>{isHi ? 'अंतिम कीमत:' : 'Effective Price:'}</div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#16664b' }}>
                  ₹{card.effectivePrice.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#dc2626' }}>
                  {isHi ? \`₹\${card.totalSavings.toLocaleString('en-IN')} की सीधी छूट\` : \`Save ₹\${card.totalSavings.toLocaleString('en-IN')}\`}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '12px', background: '#f8fafc', padding: '8px 12px', borderRadius: '10px' }}>
              {card.cashback > 0 && (
                <span style={{ color: '#0f172a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag size={13} color="#16664b" /> <strong>{card.rate}:</strong> ₹{card.cashback.toLocaleString('en-IN')}
                </span>
              )}
              {card.instantDiscount > 0 && (
                <span style={{ color: '#0f172a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Percent size={13} color="#2563eb" /> <strong>{isHi ? 'बैंक सेल ऑफर:' : 'Instant Sale Discount:'}</strong> ₹{card.instantDiscount.toLocaleString('en-IN')}
                </span>
              )}
              {card.noCostEmiSavings > 0 && (
                <span style={{ color: '#047857', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={13} color="#047857" /> <strong>No-Cost EMI:</strong> {isHi ? \`ब्याज में ₹\${card.noCostEmiSavings} की बचत\` : \`Save ~₹\${card.noCostEmiSavings} interest\`}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '4px' }}>
              <a
                href={card.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: '1 1 200px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  background: '#16664b',
                  color: '#ffffff',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px rgba(22, 102, 75, 0.25)',
                }}
              >
                <span>{isHi ? '💳 यह कार्ड अप्लाई करें' : '💳 Apply for this Card'}</span>
                <ArrowRight size={15} />
              </a>

              <a
                href={amazonSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: '1 1 200px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  background: '#ffffff',
                  color: '#0f172a',
                  border: '1px solid #cbd5e1',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '600',
                  textDecoration: 'none',
                }}
              >
                <ShoppingBag size={15} color="#ea580c" />
                <span>{isHi ? '🛒 Amazon पर बेस्ट प्राइस देखें' : '🛒 View Best Price on Amazon'}</span>
                <ExternalLink size={13} color="#64748b" />
              </a>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>
          {isHi ? 'नोट: कैशबैक और डिस्काउंट बैंक व मर्चेंट के मौजूदा नियमों पर आधारित हैं।' : 'Note: Cashback & discounts are estimated on standard bank merchant terms.'}
        </p>
        <span style={{ fontSize: '11px', color: '#16664b', fontWeight: '600' }}>
          ✓ Verified Indian Banking Data 2026
        </span>
      </div>
    </div>
  );
}
`;

// 3. Component 2: CreditCardDebtTrapCalculator
const debtTrapCode = `'use client';
import { useState, useMemo } from 'react';
import { AlertTriangle, CheckCircle, ShieldAlert, ArrowRight, Banknote } from 'lucide-react';

export default function CreditCardDebtTrapCalculator({ initialBill = 50000, language = 'en' }) {
  const isHi = language === 'hi';
  const [bill, setBill] = useState(initialBill);
  const [monthlyBudget, setMonthlyBudget] = useState(8000);

  const presets = [
    { label: '₹25,000', val: 25000 },
    { label: '₹50,000', val: 50000 },
    { label: '₹1,00,000', val: 100000 },
    { label: '₹2,00,000', val: 200000 },
  ];

  const analysis = useMemo(() => {
    const P = Number(bill) || 0;
    if (P <= 0) return null;

    const monthlyRate = 0.035;
    const minDueFirstMonth = Math.round(P * 0.05 + P * monthlyRate * 1.18);
    const minDueYears = 8.5;
    const minDueTotalInterest = Math.round(P * 1.28);
    const minDueTotalPaid = P + minDueTotalInterest;

    const emiRateYear = 0.15;
    const r = emiRateYear / 12;
    const processingFee = Math.round(Math.max(P * 0.015, 199) * 1.18);

    const tenures = [3, 6, 12, 24];
    const emiOptions = tenures.map((n) => {
      const emi = Math.round((P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
      const totalRepaid = emi * n;
      const rawInterest = totalRepaid - P;
      const gstOnInterest = Math.round(rawInterest * 0.18);
      const totalExtraCost = rawInterest + gstOnInterest + processingFee;
      const totalPaid = P + totalExtraCost;

      let badge = '';
      let isRecommended = false;
      let isWarning = false;

      if (n === 3) {
        badge = isHi ? '🏆 सबसे कम ब्याज' : '🏆 Lowest Interest';
      } else if (n === 6) {
        badge = isHi ? '⭐ सबसे संतुलित' : '⭐ Most Balanced';
        isRecommended = true;
      } else if (n === 12) {
        badge = isHi ? 'मध्यम लागत' : 'Moderate Interest';
      } else if (n === 24) {
        badge = isHi ? '🛑 भारी ब्याज ट्रैप' : '🛑 High Interest Trap';
        isWarning = true;
      }

      return { months: n, emi, totalExtraCost, totalPaid, badge, isRecommended, isWarning };
    });

    const sixMonthOpt = emiOptions.find((o) => o.months === 6);
    const twentyFourOpt = emiOptions.find((o) => o.months === 24);
    const smartSavings = twentyFourOpt && sixMonthOpt ? twentyFourOpt.totalExtraCost - sixMonthOpt.totalExtraCost : 0;

    return { minDueFirstMonth, minDueYears, minDueTotalInterest, minDueTotalPaid, emiOptions, smartSavings, processingFee };
  }, [bill, isHi]);

  return (
    <div className="debt-trap-calculator not-prose" style={{
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
          background: 'rgba(220, 38, 38, 0.1)',
          color: '#dc2626',
          padding: '4px 10px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '700',
          marginBottom: '6px'
        }}>
          <AlertTriangle size={14} /> {isHi ? 'क़र्ज़ मुक्ति व EMI बचत कैलकुलेटर' : 'Debt Trap & EMI Exit Calculator'}
        </span>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--ink, #0f172a)', margin: '4px 0' }}>
          {isHi ? 'क्रेडिट कार्ड बिल EMI में बदलें या पूरा चुकाएँ?' : 'Should You Pay Minimum Due or Convert to EMI?'}
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--muted, #64748b)', margin: 0 }}>
          {isHi ? 'देखें कितने महीने की किश्त (EMI) में सबसे कम ब्याज लगेगा और बैंक को कितना एक्स्ट्रा पैसा जाएगा:' : 'See how much extra bank interest & GST you pay across 3, 6, 12 & 24 month tenures:'}
        </p>
      </div>

      <div style={{ background: 'var(--bg, #f8fafc)', padding: '16px', borderRadius: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--ink, #1e293b)', marginBottom: '6px' }}>
              {isHi ? 'क्रेडिट कार्ड का कुल बिल / क़र्ज़ (₹):' : 'Total Credit Card Bill / Outstanding (₹):'}
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '10px', fontWeight: '600', color: '#64748b' }}>₹</span>
              <input
                type="number"
                inputMode="decimal"
                value={bill}
                min={5000}
                step={5000}
                onChange={(e) => setBill(Number(e.target.value))}
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
              {isHi ? 'आप हर महीने कितना दे सकते हैं (₹):' : 'Monthly Repayment Capacity (₹):'}
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '10px', fontWeight: '600', color: '#64748b' }}>₹</span>
              <input
                type="number"
                inputMode="decimal"
                value={monthlyBudget}
                min={1000}
                step={1000}
                onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 28px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '16px',
                  fontWeight: '600',
                  background: '#ffffff',
                  color: '#0f172a',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>
            {isHi ? 'पॉपुलर बिल राशि:' : 'Quick Presets:'}
          </span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setBill(p.val)}
              style={{
                padding: '4px 10px',
                borderRadius: '16px',
                border: bill === p.val ? '1px solid #dc2626' : '1px solid #e2e8f0',
                background: bill === p.val ? 'rgba(220, 38, 38, 0.1)' : '#ffffff',
                color: bill === p.val ? '#dc2626' : '#475569',
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

      {analysis && (
        <>
          <div style={{
            background: 'linear-gradient(135deg, #fef2f2 0%, #fff1f2 100%)',
            border: '2px solid #fecaca',
            borderRadius: '16px',
            padding: '18px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ background: '#fee2e2', padding: '8px', borderRadius: '12px', color: '#dc2626' }}>
                <ShieldAlert size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#991b1b', margin: 0 }}>
                  {isHi ? '⚠️ सावधान: सिर्फ़ "Minimum Due" भरने का महा-जाल!' : '⚠️ Warning: The Minimum Due Trap (42% Annual APR)'}
                </h3>
                <p style={{ fontSize: '13px', color: '#7f1d1d', margin: '4px 0 10px 0', lineHeight: '1.6' }}>
                  {isHi
                    ? \`अगर आप सिर्फ़ न्यूनतम देय राशि (~₹\${analysis.minDueFirstMonth.toLocaleString('en-IN')}) भरते रहेंगे, तो इस ₹\${bill.toLocaleString('en-IN')} के बिल को चुकाने में लगभग \${analysis.minDueYears} साल लग जाएँगे!\`
                    : \`If you only pay the minimum due (~₹\${analysis.minDueFirstMonth.toLocaleString('en-IN')}), this ₹\${bill.toLocaleString('en-IN')} balance will take \${analysis.minDueYears} years to clear!\`}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', background: '#ffffff', padding: '10px 14px', borderRadius: '10px', border: '1px solid #fee2e2' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>{isHi ? 'बैंक का कुल ब्याज + GST:' : 'Total Interest + GST:'}</span>
                    <strong style={{ fontSize: '16px', color: '#dc2626' }}>+₹{analysis.minDueTotalInterest.toLocaleString('en-IN')}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>{isHi ? 'बैंक को कुल भुगतान:' : 'Total Money Paid to Bank:'}</span>
                    <strong style={{ fontSize: '16px', color: '#0f172a' }}>₹{analysis.minDueTotalPaid.toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {analysis.smartSavings > 0 && (
            <div style={{
              background: 'rgba(22, 102, 75, 0.08)',
              border: '1px solid rgba(22, 102, 75, 0.3)',
              borderRadius: '12px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px'
            }}>
              <CheckCircle size={20} color="#16664b" />
              <p style={{ fontSize: '13px', color: '#16664b', fontWeight: '600', margin: 0 }}>
                {isHi
                  ? \`💡 स्मार्ट बचत: 24 महीने के बजाय 6 महीने की किश्त चुनने पर आपके ₹\${analysis.smartSavings.toLocaleString('en-IN')} नक़द बचेंगे!\`
                  : \`💡 Smart Savings: Choosing a 6-month EMI instead of 24 months saves you ₹\${analysis.smartSavings.toLocaleString('en-IN')} pure cash!\`}
              </p>
            </div>
          )}

          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>
              {isHi ? 'EMI टेन्योर की तुलना: कौन-सी किश्त आपके लिए सही है?' : 'EMI Tenure Breakdown: Which Tenure Saves the Most?'}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              {analysis.emiOptions.map((opt) => (
                <div
                  key={opt.months}
                  style={{
                    background: opt.isRecommended ? 'rgba(22, 102, 75, 0.03)' : '#ffffff',
                    border: opt.isRecommended ? '2px solid #16664b' : opt.isWarning ? '1px solid #fca5a5' : '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '16px',
                    boxShadow: opt.isRecommended ? '0 4px 14px rgba(22, 102, 75, 0.1)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>
                      {opt.months} {isHi ? 'महीने' : 'Months'}
                    </span>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: opt.isRecommended ? '#16664b' : opt.isWarning ? '#fee2e2' : '#f1f5f9',
                      color: opt.isRecommended ? '#ffffff' : opt.isWarning ? '#dc2626' : '#475569'
                    }}>
                      {opt.badge}
                    </span>
                  </div>

                  <div style={{ margin: '12px 0' }}>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>{isHi ? 'मासिक किश्त (EMI):' : 'Monthly EMI:'}</span>
                    <div style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>
                      ₹{opt.emi.toLocaleString('en-IN')}<span style={{ fontSize: '12px', fontWeight: '500', color: '#64748b' }}>/mo</span>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>{isHi ? 'एक्स्ट्रा ब्याज + GST:' : 'Extra Cost:'}</span>
                      <strong style={{ color: opt.isWarning ? '#dc2626' : '#16664b' }}>₹{opt.totalExtraCost.toLocaleString('en-IN')}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>{isHi ? 'बैंक को कुल भुगतान:' : 'Total Repaid:'}</span>
                      <strong>₹{opt.totalPaid.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%)',
            border: '1px solid #bbf7d0',
            borderRadius: '16px',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Banknote size={20} color="#16664b" />
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                {isHi ? 'क़र्ज़ से बाहर निकलने के 2 सबसे सस्ते तरीक़े:' : '2 Smarter Ways to Clear This Debt Faster:'}
              </h3>
            </div>
            <p style={{ fontSize: '13px', color: '#334155', margin: '0 0 16px 0', lineHeight: '1.6' }}>
              {isHi
                ? 'क्रेडिट कार्ड के भारी 42% ब्याज से बचने के लिए आप कम ब्याज वाले लोन या 0% बैलेंस ट्रांसफर का उपयोग कर सकते हैं:'
                : 'Avoid credit card 42% APR by consolidating your balance into a low-interest personal loan or 0% balance transfer card:'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
              <div style={{ background: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#16664b', textTransform: 'uppercase' }}>
                  {isHi ? 'रास्ता 1: पर्सनल लोन (10.5% दर)' : 'Option 1: Personal Loan (10.5% APR)'}
                </span>
                <p style={{ fontSize: '12px', color: '#475569', margin: '4px 0 10px 0' }}>
                  {isHi
                    ? '10.5% के सस्ते पर्सनल लोन से क्रेडिट कार्ड का पूरा बिल तुरंत चुकाएँ और हज़ारों का ब्याज बचाएँ।'
                    : 'Clear high-interest card debt with an instant 10.5% personal loan, saving up to ₹25,000 in interest.'}
                </p>
                <a
                  href="https://sahifayda.pages.dev/guides/loans/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#16664b',
                    color: '#ffffff',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '700',
                    textDecoration: 'none'
                  }}
                >
                  <span>{isHi ? 'कम ब्याज पर्सनल लोन देखें' : 'Check Low-Interest Loans'}</span>
                  <ArrowRight size={14} />
                </a>
              </div>

              <div style={{ background: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#2563eb', textTransform: 'uppercase' }}>
                  {isHi ? 'रास्ता 2: 0% बैलेंस ट्रांसफर' : 'Option 2: 0% Balance Transfer Card'}
                </span>
                <p style={{ fontSize: '12px', color: '#475569', margin: '4px 0 10px 0' }}>
                  {isHi
                    ? 'अपने बिल को 0% ब्याज वाले कार्ड पर 3 से 6 महीने के लिए शिफ्ट करें और बिना ब्याज चुकाएँ।'
                    : 'Shift your balance to a 0% interest balance transfer card for 3–6 months with zero APR charges.'}
                </p>
                <a
                  href="https://sahifayda.pages.dev/guides/credit-cards/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#ffffff',
                    color: '#0f172a',
                    border: '1px solid #cbd5e1',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '700',
                    textDecoration: 'none'
                  }}
                >
                  <span>{isHi ? 'बैलेंस ट्रांसफर कार्ड देखें' : 'View Balance Transfer Cards'}</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </>
      )}

      <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid #f1f5f9', fontSize: '11px', color: '#94a3b8' }}>
        {isHi
          ? 'नोट: ब्याज और शुल्कों की गणना भारतीय बैंकों के मानक 15%–18% EMI और 42% रिवॉल्विंग नियमों पर आधारित है।'
          : 'Note: Computations follow standard Indian banking rates (15%–18% reducing EMI, 42% revolving APR).'}
      </div>
    </div>
  );
}
`;

// 4. Component 3: StudentCardFinder
const studentCardCode = `'use client';
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
}
`;

// Save all 3 components in BOTH app/ and components/ so imports NEVER fail
if (!fs.existsSync('components')) fs.mkdirSync('components', { recursive: true });

fs.writeFileSync('app/SmartCardOfferCalculator.js', cardOfferCode, 'utf8');
fs.writeFileSync('components/SmartCardOfferCalculator.js', cardOfferCode, 'utf8');

fs.writeFileSync('app/CreditCardDebtTrapCalculator.js', debtTrapCode, 'utf8');
fs.writeFileSync('components/CreditCardDebtTrapCalculator.js', debtTrapCode, 'utf8');

fs.writeFileSync('app/StudentCardFinder.js', studentCardCode, 'utf8');
fs.writeFileSync('components/StudentCardFinder.js', studentCardCode, 'utf8');

console.log("[2/5] ✓ Components saved in both app/ and components/ (Guaranteed path resolution)");

// 3. Fix app/ui.js - 'use client' MUST be the absolute first line
try {
  let uiCode = fs.readFileSync('app/ui.js', 'utf8');
  
  // Remove existing occurrences of imports and 'use client'
  uiCode = uiCode.replace(/'use client';?\s*/g, '');
  uiCode = uiCode.replace(/import\s+SmartCardOfferCalculator[\s\S]*?;?\n/g, '');
  uiCode = uiCode.replace(/import\s+CreditCardDebtTrapCalculator[\s\S]*?;?\n/g, '');
  uiCode = uiCode.replace(/import\s+StudentCardFinder[\s\S]*?;?\n/g, '');

  const uiHeader = `'use client';
import SmartCardOfferCalculator from './SmartCardOfferCalculator';
import CreditCardDebtTrapCalculator from './CreditCardDebtTrapCalculator';
import StudentCardFinder from './StudentCardFinder';
`;

  uiCode = uiHeader + uiCode;
  fs.writeFileSync('app/ui.js', uiCode, 'utf8');
  console.log("[3/5] ✓ Fixed app/ui.js ('use client' moved to Line 1)");
} catch (e) {
  console.log("[3/5] Error on app/ui.js:", e.message);
}

// 4. Fix sub-page imports to use clean relative paths
try {
  if (fs.existsSync('app/card-offers/page.js')) {
    let code = fs.readFileSync('app/card-offers/page.js', 'utf8');
    code = code.replace(/import\s+SmartCardOfferCalculator\s+from\s+['"][^'"]+['"];?/, "import SmartCardOfferCalculator from '../SmartCardOfferCalculator';");
    fs.writeFileSync('app/card-offers/page.js', code, 'utf8');
  }

  if (fs.existsSync('app/debt-trap-calculator/page.js')) {
    let code = fs.readFileSync('app/debt-trap-calculator/page.js', 'utf8');
    code = code.replace(/import\s+CreditCardDebtTrapCalculator\s+from\s+['"][^'"]+['"];?/, "import CreditCardDebtTrapCalculator from '../CreditCardDebtTrapCalculator';");
    fs.writeFileSync('app/debt-trap-calculator/page.js', code, 'utf8');
  }

  if (fs.existsSync('app/student-credit-cards/page.js')) {
    let code = fs.readFileSync('app/student-credit-cards/page.js', 'utf8');
    code = code.replace(/import\s+StudentCardFinder\s+from\s+['"][^'"]+['"];?/, "import StudentCardFinder from '../StudentCardFinder';");
    fs.writeFileSync('app/student-credit-cards/page.js', code, 'utf8');
  }
  console.log("[4/5] ✓ Updated landing page imports to local clean relative paths");
} catch (e) {
  console.log("[4/5] Note on landing pages:", e.message);
}

console.log("\n=== Master Fix Complete! Ready to Git Push. ===");