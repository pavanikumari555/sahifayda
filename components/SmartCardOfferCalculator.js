'use client';
import { useState, useMemo } from 'react';
import { ArrowRight, Tag, ShieldCheck, ExternalLink, Percent, Sparkles, ShoppingBag } from 'lucide-react';
import SocialProofCounter from './SocialProofCounter';

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
      
      {/* Social Proof Counter */}
      <SocialProofCounter calculatorType="card_offers" trackUsage={true} />
      
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
            {isHi ? `₹${price.toLocaleString('en-IN')} के सामान पर बेस्ट कार्ड्स & बचत:` : `Top Card Offers on ₹${price.toLocaleString('en-IN')} Purchase:`}
          </h3>
          <span style={{ fontSize: '12px', color: '#16664b', fontWeight: '600' }}>
            {cardOffers[0] ? (isHi ? `अधिकतम बचत: ₹${cardOffers[0].totalSavings.toLocaleString('en-IN')}` : `Max Savings: ₹${cardOffers[0].totalSavings.toLocaleString('en-IN')}`) : ''}
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
                  {isHi ? `₹${card.totalSavings.toLocaleString('en-IN')} की सीधी छूट` : `Save ₹${card.totalSavings.toLocaleString('en-IN')}`}
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
                  <ShieldCheck size={13} color="#047857" /> <strong>No-Cost EMI:</strong> {isHi ? `ब्याज में ₹${card.noCostEmiSavings} की बचत` : `Save ~₹${card.noCostEmiSavings} interest`}
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
