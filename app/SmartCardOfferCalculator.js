'use client';

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
    return `https://www.amazon.in/s?k=${encodeURIComponent(q)}&tag=sahifayda-21`;
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
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: merchant === m.id ? '2px solid #16664b' : '1px solid #cbd5e1',
                  background: merchant === m.id ? 'rgba(22, 102, 75, 0.1)' : '#ffffff',
                  color: merchant === m.id ? '#16664b' : '#64748b',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {presets.map((p) => (
          <button
            key={p.val}
            type="button"
            onClick={() => setPrice(p.val)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: price === p.val ? '#16664b' : '#ffffff',
              color: price === p.val ? '#ffffff' : '#64748b',
              fontSize: '11px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {cardOffers.map((card, idx) => (
          <div key={card.id} style={{
            background: idx === 0 ? 'linear-gradient(135deg, rgba(22, 102, 75, 0.08) 0%, rgba(22, 102, 75, 0.02) 100%)' : '#ffffff',
            border: idx === 0 ? '2px solid #16664b' : '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '16px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {idx === 0 && (
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: '#16664b',
                color: '#ffffff',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Tag size={12} /> {isHi ? 'सबसे बेस्ट डील' : 'BEST DEAL'}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px 0' }}>
                  {card.name}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#16664b',
                    background: 'rgba(22, 102, 75, 0.1)',
                    padding: '2px 8px',
                    borderRadius: '6px'
                  }}>
                    {card.badge}
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>{card.bank}</span>
                  <span style={{ fontSize: '11px', color: '#f59e0b', fontWeight: '600' }}>{card.rating}</span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#16664b' }}>
                  ₹{card.totalSavings.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
                  {isHi ? 'कुल बचत' : 'Total Savings'}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginBottom: '12px', padding: '12px', background: 'rgba(0,0,0,0.02)', borderRadius: '10px' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '2px' }}>
                  {isHi ? '💵 कैशबैक' : '💵 Cashback'}
                </div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
                  ₹{card.cashback.toLocaleString('en-IN')}
                </div>
              </div>
              {card.instantDiscount > 0 && (
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '2px' }}>
                    {isHi ? '⚡ बैंक सेल छूट' : '⚡ Sale Discount'}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
                    ₹{card.instantDiscount.toLocaleString('en-IN')}
                  </div>
                </div>
              )}
              {card.noCostEmiSavings > 0 && (
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '2px' }}>
                    {isHi ? '📅 नो-कॉस्ट EMI बचत' : '📅 EMI Benefit'}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
                    ₹{card.noCostEmiSavings.toLocaleString('en-IN')}
                  </div>
                </div>
              )}
            </div>

            <p style={{ fontSize: '12px', color: '#475569', margin: '0 0 12px 0', lineHeight: '1.5' }}>
              <ShieldCheck size={13} style={{ display: 'inline', marginRight: '4px', color: '#16664b' }} />
              {card.bestFor}
            </p>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <a
                href={card.applyUrl}
                target="_blank"
                rel="nofollow sponsored"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 16px',
                  background: '#16664b',
                  color: '#ffffff',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  transition: 'all 0.2s'
                }}
              >
                {isHi ? 'कार्ड अप्लाई करें' : 'Apply for Card'} <ArrowRight size={14} />
              </a>
              <span style={{ fontSize: '11px', color: '#64748b', alignSelf: 'center', fontStyle: 'italic' }}>
                {isHi ? 'फीस: ' : 'Fee: '}{card.cardType}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '20px',
        padding: '16px',
        background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(251, 146, 60, 0.05) 100%)',
        border: '1px solid rgba(251, 191, 36, 0.3)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShoppingBag size={20} style={{ color: '#f59e0b' }} />
          <div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '2px' }}>
              {isHi ? '🎯 Amazon पर सबसे सस्ते डील्स यहाँ देखें' : '🎯 Find Best Deals on Amazon India'}
            </div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>
              {isHi ? 'इसी बजट में ऑफिशियल स्टोर पर मिलने वाली कीमत और ऑफर चेक करें' : 'Check current prices & exclusive offers directly on Amazon'}
            </div>
          </div>
        </div>
        <a
          href={amazonSearchUrl}
          target="_blank"
          rel="nofollow sponsored"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 16px',
            background: '#f59e0b',
            color: '#ffffff',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: '600',
            textDecoration: 'none',
            whiteSpace: 'nowrap'
          }}
        >
          {isHi ? 'Amazon पर देखें' : 'View on Amazon'} <ExternalLink size={14} />
        </a>
      </div>

      <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(0,0,0,0.02)', borderRadius: '10px', fontSize: '11px', color: '#64748b', lineHeight: '1.6' }}>
        <strong style={{ color: '#0f172a' }}>{isHi ? '⚠️ सुरक्षा सूचना:' : '⚠️ Important Disclosure:'}</strong> {isHi ? 'यहाँ दी गई बचत राशि अनुमानित है. असली कैशबैक / छूट बैंक के नियम और ऑफर पर निर्भर करती है. कार्ड अप्लाई करने से पहले बैंक की ऑफिशियल वेबसाइट पर सभी शुल्क, ब्याज दर और योग्यता शर्तें ज़रूर चेक करें. SahiFayda.in को प्रत्येक कार्ड आवेदन पर बैंक से कमीशन मिल सकता है (Affiliate Partnership).' : 'Estimated savings shown are approximate. Actual cashback and discounts depend on bank terms and active offers. Always verify exact fee structures, interest rates, and eligibility on the official bank website before applying. SahiFayda.in may earn affiliate commissions from partner banks.'}
      </div>
    </div>
  );
}
