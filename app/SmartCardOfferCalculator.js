'use client';
import { useState, useMemo } from 'react';
import { ArrowRight, Tag, ShieldCheck, ExternalLink, Percent, Sparkles, ShoppingBag, Info } from 'lucide-react';

export default function SmartCardOfferCalculator({ initialPrice = 30000, initialCategory = 'mobile', language = 'en' }) {
  const isHi = language === 'hi';
  const [price, setPrice] = useState(initialPrice);
  const [category, setCategory] = useState(initialCategory);
  const [merchant, setMerchant] = useState('amazon');

  const categories = [
    { id: 'mobile', label: isHi ? '📱 स्मार्टफ़ोन' : '📱 Smartphone' },
    { id: 'laptop', label: isHi ? '💻 लैपटॉप / कंप्यूटर' : '💻 Laptop / PC' },
    { id: 'appliance', label: isHi ? '🧺 टीवी / एसी / फ्रिज' : '🧺 Home Appliances' },
    { id: 'general', label: isHi ? '🛒 सामान्य खरीदारी' : '🛒 General Shopping' },
  ];

  const presets = [
    { label: isHi ? '₹15,000 (किफ़ायती फ़ोन)' : '₹15,000 (Budget phone)', val: 15000 },
    { label: isHi ? '₹30,000 (मध्यम दाम)' : '₹30,000 (Mid-range)', val: 30000 },
    { label: isHi ? '₹50,000 (लैपटॉप / टीवी)' : '₹50,000 (Laptop / TV)', val: 50000 },
    { label: isHi ? '₹80,000 (महँगा फ़ोन / लैपटॉप)' : '₹80,000 (High-end tech)', val: 80000 },
  ];

  const cardOffers = useMemo(() => {
    const val = Number(price) || 0;
    if (val <= 0) return [];

    const offers = [
      {
        id: 'amazon_icici',
        name: 'Amazon Pay ICICI Bank Credit Card',
        badge: isHi ? 'उदाहरण: कोई सालाना शुल्क नहीं' : 'Example: no annual fee',
        bank: 'ICICI Bank',
        cardType: isHi ? 'सालाना शुल्क ₹0 (उदाहरण)' : '₹0 annual fee (example)',
        rate: merchant === 'amazon' ? (isHi ? 'Amazon पर 5% कैशबैक' : '5% cashback on Amazon') : (isHi ? '1% कैशबैक' : '1% cashback'),
        cashback: merchant === 'amazon' ? Math.round(val * 0.05) : Math.round(val * 0.01),
        instantDiscount: 0,
        noCostEmiSavings: val >= 10000 ? Math.round(val * 0.04) : 0,
        applyUrl: (isHi ? '/hi' : '') + '/guides/credit-card/',
        bestFor: isHi ? 'उदाहरण: Amazon की खरीद पर 5% कैशबैक। शर्तें और बाहर रखी गई श्रेणियाँ बैंक से जाँचें।' : 'Example: 5% cashback on Amazon purchases. Check conditions and exclusions with the bank.',
        rating: '4.9 ★',
      },
      {
        id: 'sbi_cashback',
        name: 'SBI Cashback Credit Card',
        badge: isHi ? 'उदाहरण: ऑनलाइन खरीद पर 5%' : 'Example: 5% on online spends',
        bank: 'SBI Card',
        cardType: isHi ? '₹999/वर्ष (₹2 लाख खर्च पर माफ़)' : '₹999/yr (waived at ₹2L spend)',
        rate: isHi ? 'ऑनलाइन खरीद पर 5% कैशबैक' : '5% cashback on online spends',
        cashback: Math.min(Math.round(val * 0.05), 5000),
        instantDiscount: 0,
        noCostEmiSavings: val >= 10000 ? Math.round(val * 0.04) : 0,
        applyUrl: (isHi ? '/hi' : '') + '/guides/credit-card/',
        bestFor: isHi ? 'उदाहरण: ज़्यादातर ऑनलाइन स्टोर पर 5% (₹5,000/माह की सीमा तक)। कुछ श्रेणियाँ बाहर हो सकती हैं।' : 'Example: 5% on most online stores (capped at ₹5,000 a month). Some categories may be excluded.',
        rating: '4.8 ★',
      },
      {
        id: 'hdfc_millennia',
        name: 'HDFC Millennia Credit Card',
        badge: isHi ? 'उदाहरण: त्योहार सेल में बैंक छूट' : 'Example: festive-sale bank discount',
        bank: 'HDFC Bank',
        cardType: isHi ? '₹1,000/वर्ष (₹1 लाख खर्च पर माफ़)' : '₹1,000/yr (waived at ₹1L spend)',
        rate: isHi ? '5% कैशबैक (₹1,000 तक)' : '5% cashback (up to ₹1,000)',
        cashback: Math.min(Math.round(val * 0.05), 1000),
        instantDiscount: val >= 15000 ? Math.min(Math.round(val * 0.10), 2000) : 0,
        noCostEmiSavings: val >= 15000 ? Math.round(val * 0.045) : 0,
        applyUrl: (isHi ? '/hi' : '') + '/guides/credit-card/',
        bestFor: isHi ? 'उदाहरण: Amazon/Flipkart की बैंक सेल में तुरंत छूट मिल सकती है। हर सेल में ऑफ़र बदलते हैं।' : 'Example: instant discounts may apply during Amazon/Flipkart bank sales. Offers change with each sale.',
        rating: '4.8 ★',
      },
      {
        id: 'flipkart_axis',
        name: 'Flipkart Axis Bank Credit Card',
        badge: merchant === 'flipkart' ? (isHi ? 'उदाहरण: Flipkart पर 5%' : 'Example: 5% on Flipkart') : (isHi ? 'उदाहरण: Swiggy/Uber पर 4%' : 'Example: 4% on Swiggy/Uber'),
        bank: 'Axis Bank',
        cardType: isHi ? '₹500/वर्ष (₹3.5 लाख खर्च पर माफ़)' : '₹500/yr (waived at ₹3.5L spend)',
        rate: merchant === 'flipkart' ? (isHi ? 'Flipkart पर 5% कैशबैक' : '5% cashback on Flipkart') : (isHi ? '1.5% कैशबैक' : '1.5% cashback'),
        cashback: merchant === 'flipkart' ? Math.round(val * 0.05) : Math.round(val * 0.015),
        instantDiscount: merchant === 'flipkart' && val >= 10000 ? Math.min(Math.round(val * 0.10), 1750) : 0,
        noCostEmiSavings: val >= 10000 ? Math.round(val * 0.04) : 0,
        applyUrl: (isHi ? '/hi' : '') + '/guides/credit-card/',
        bestFor: isHi ? 'उदाहरण: Flipkart और Myntra की खरीद पर कैशबैक। सीमा और शर्तें बैंक से जाँचें।' : 'Example: cashback on Flipkart and Myntra purchases. Check caps and conditions with the bank.',
        rating: '4.7 ★',
      },
      {
        id: 'onecard_fd',
        name: 'OneCard (Metal / FD-Backed Card)',
        badge: isHi ? 'FD पर आधारित विकल्प • मंज़ूरी बैंक तय करता है' : 'FD-backed option • the bank decides approval',
        bank: 'Federal / SBM / BOB',
        cardType: isHi ? 'सालाना शुल्क ₹0 (उदाहरण)' : '₹0 annual fee (example)',
        rate: isHi ? '1% कैशबैक' : '1% cashback',
        cashback: Math.round(val * 0.01),
        instantDiscount: val >= 10000 ? Math.min(Math.round(val * 0.08), 1500) : 0,
        noCostEmiSavings: 0,
        applyUrl: (isHi ? '/hi' : '') + '/guides/credit-card/',
        bestFor: isHi ? 'FD पर आधारित कार्ड में मंज़ूरी की संभावना आम तौर पर ज़्यादा होती है, पर अंतिम फ़ैसला बैंक का है। समय पर पूरा बिल भरने से स्कोर धीरे-धीरे सुधर सकता है।' : 'FD-backed cards are often easier to get, but the bank decides. Paying the full bill on time can slowly improve your credit score.',
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
    // No affiliate tag: commercial store links must come from owner-approved partner links with a disclosure.
    return `https://www.amazon.in/s?k=${encodeURIComponent(q)}`;
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
            color: 'var(--accent, #16664b)',
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '600',
            marginBottom: '6px'
          }}>
            <Sparkles size={14} /> {isHi ? 'कार्ड ऑफ़र बचत अनुमान' : 'Card offer savings estimate'}
          </span>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--ink, #0f172a)', margin: '4px 0' }}>
            {isHi ? 'इस खरीद पर किस कार्ड ऑफ़र से कितनी बचत हो सकती है?' : 'How much could an example card offer save on this purchase?'}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--muted, #64748b)', margin: 0 }}>
            {isHi
              ? 'कैसे इस्तेमाल करें: सामान की कीमत, श्रेणी और स्टोर चुनें। नतीजा उदाहरण दरों पर संभावित कैशबैक और छूट दिखाता है, पक्की छूट नहीं।'
              : 'How to use: enter the item price, then pick the category and store. The result shows possible cashback and discounts at example rates, not a confirmed discount.'}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', background: 'var(--soft, #f8fafc)', padding: '16px', borderRadius: '16px', marginBottom: '20px' }}>
        <div>
          <label htmlFor="smart-offer-price" style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--ink, #1e293b)', marginBottom: '6px' }}>
            {isHi ? 'सामान की अनुमानित कीमत (₹):' : 'Item Price / Budget (₹):'}
          </label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '10px', fontWeight: '600', color: 'var(--muted, #64748b)' }}>₹</span>
            <input
              id="smart-offer-price"
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
                border: '1px solid var(--line, #cbd5e1)',
                fontSize: '16px',
                fontWeight: '600',
                background: 'var(--field, #ffffff)',
                color: 'var(--ink, #0f172a)',
                outline: 'none'
              }}
            />
          </div>
        </div>

        <div>
          <label htmlFor="smart-offer-category" style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--ink, #1e293b)', marginBottom: '6px' }}>
            {isHi ? 'क्या खरीदना चाहते हैं?' : 'What are you buying?'}
          </label>
          <select
            id="smart-offer-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '10px',
              border: '1px solid var(--line, #cbd5e1)',
              fontSize: '14px',
              fontWeight: '500',
              background: 'var(--field, #ffffff)',
              color: 'var(--ink, #0f172a)',
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
          <span style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--ink, #1e293b)', marginBottom: '6px' }}>
            {isHi ? 'कहाँ से खरीद रहे हैं?' : 'Shopping Store:'}
          </span>
          <div role="group" aria-label={isHi ? 'स्टोर चुनें' : 'Choose a store'} style={{ display: 'flex', gap: '8px' }}>
            {[
              { id: 'amazon', label: 'Amazon India' },
              { id: 'flipkart', label: 'Flipkart' },
              { id: 'any', label: isHi ? 'कोई भी स्टोर' : 'All Stores' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                aria-pressed={merchant === m.id}
                onClick={() => setMerchant(m.id)}
                style={{
                  flex: 1,
                  padding: '9px 8px',
                  borderRadius: '10px',
                  border: merchant === m.id ? '2px solid var(--accent, #16664b)' : '1px solid var(--line, #cbd5e1)',
                  background: merchant === m.id ? 'rgba(22, 102, 75, 0.08)' : 'var(--surface, #ffffff)',
                  color: merchant === m.id ? 'var(--accent, #16664b)' : 'var(--muted, #334155)',
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
        <span style={{ fontSize: '12px', color: 'var(--muted, #64748b)', fontWeight: '500' }}>
          {isHi ? 'उदाहरण बजट:' : 'Quick Presets:'}
        </span>
        {presets.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setPrice(p.val)}
            style={{
              padding: '4px 10px',
              borderRadius: '20px',
              border: price === p.val ? '1px solid #16664b' : '1px solid var(--border, #e2e8f0)',
              background: price === p.val ? '#16664b' : 'var(--surface, #ffffff)',
              color: price === p.val ? '#ffffff' : 'var(--muted, #475569)',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div role="note" style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px',
        background: 'rgba(234, 179, 8, 0.12)',
        border: '1px solid rgba(202, 138, 4, 0.45)',
        borderRadius: '12px',
        padding: '10px 12px',
        marginBottom: '16px',
        fontSize: '12px',
        lineHeight: '1.5',
        color: 'var(--ink, #0f172a)'
      }}>
        <Info size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
        <span>
          {isHi
            ? 'उदाहरण के आँकड़े — खरीद से पहले बैंक/स्टोर पर मौजूदा ऑफ़र जाँचें। कीमत आप बदल सकते हैं; कार्ड के नाम, कैशबैक दरें, शुल्क और छूट तय उदाहरण हैं, ज़रूरी नहीं कि आज लागू हों। कार्ड सिर्फ़ अनुमानित बचत के क्रम में हैं, और कार्ड मिलना बैंक की मंज़ूरी पर निर्भर है।'
            : 'Example figures — check the current offer with the bank/store before buying. You can change the price; card names, cashback rates, fees and discounts are fixed examples and may not be live today. Cards are sorted only by estimated saving, and getting a card depends on bank approval.'}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--ink, #0f172a)', margin: 0 }}>
            {isHi ? `₹${price.toLocaleString('en-IN')} की खरीद पर उदाहरण कार्ड ऑफ़र:` : `Example card offers on a ₹${price.toLocaleString('en-IN')} purchase:`}
          </h3>
          <span style={{ fontSize: '12px', color: 'var(--accent, #16664b)', fontWeight: '600' }}>
            {cardOffers[0] ? (isHi ? `सबसे ज़्यादा अनुमानित बचत: ₹${cardOffers[0].totalSavings.toLocaleString('en-IN')}` : `Highest estimated saving: ₹${cardOffers[0].totalSavings.toLocaleString('en-IN')}`) : ''}
          </span>
        </div>

        {cardOffers.map((card, idx) => (
          <div
            key={card.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '16px',
              border: idx === 0 ? '2px solid var(--accent, #16664b)' : '1px solid var(--border, #e2e8f0)',
              background: idx === 0 ? 'rgba(22, 102, 75, 0.04)' : 'var(--surface, #ffffff)',
              padding: '18px',
              gap: '12px',
              boxShadow: idx === 0 ? '0 4px 16px rgba(22, 102, 75, 0.08)' : 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  {idx === 0 && (
                    <span style={{ background: '#16664b', color: '#ffffff', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '6px' }}>
                      {isHi ? 'सबसे ज़्यादा अनुमानित बचत' : 'Highest estimated saving'}
                    </span>
                  )}
                  <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--muted, #64748b)' }}>
                    {card.bank}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--subtle, #94a3b8)' }}>• {card.cardType}</span>
                </div>
                <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--ink, #0f172a)', margin: '4px 0 2px 0' }}>
                  {card.name}
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--muted, #475569)', margin: 0 }}>
                  {card.bestFor}
                </p>
              </div>

              <div style={{ textAlign: 'right', background: 'rgba(22, 102, 75, 0.08)', padding: '8px 14px', borderRadius: '12px', minWidth: '140px' }}>
                <div style={{ fontSize: '11px', color: 'var(--muted, #64748b)' }}>{isHi ? 'अनुमानित असली कीमत:' : 'Estimated effective price:'}</div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--accent, #16664b)' }}>
                  ₹{card.effectivePrice.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#dc2626' }}>
                  {isHi ? `लगभग ₹${card.totalSavings.toLocaleString('en-IN')} की अनुमानित बचत` : `Est. saving ₹${card.totalSavings.toLocaleString('en-IN')}`}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '12px', background: 'var(--soft, #f8fafc)', padding: '8px 12px', borderRadius: '10px' }}>
              {card.cashback > 0 && (
                <span style={{ color: 'var(--ink, #0f172a)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag size={13} color="#16664b" /> <strong>{card.rate}:</strong> ₹{card.cashback.toLocaleString('en-IN')}
                </span>
              )}
              {card.instantDiscount > 0 && (
                <span style={{ color: 'var(--ink, #0f172a)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Percent size={13} color="#2563eb" /> <strong>{isHi ? 'बैंक सेल छूट (उदाहरण):' : 'Instant sale discount (example):'}</strong> ₹{card.instantDiscount.toLocaleString('en-IN')}
                </span>
              )}
              {card.noCostEmiSavings > 0 && (
                <span style={{ color: 'var(--accent, #047857)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={13} color="#047857" /> <strong>{isHi ? 'नो-कॉस्ट EMI:' : 'No-Cost EMI:'}</strong> {isHi ? `लगभग ₹${card.noCostEmiSavings.toLocaleString('en-IN')} ब्याज माफ़ हो सकता है; प्रोसेसिंग शुल्क लग सकता है` : `about ₹${card.noCostEmiSavings.toLocaleString('en-IN')} interest may be waived; a processing fee may apply`}
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
                <span>{isHi ? '💳 कार्ड की पूरी जानकारी और शुल्क पढ़ें' : '💳 Read card details & fees'}</span>
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
                  background: 'var(--surface, #ffffff)',
                  color: 'var(--ink, #0f172a)',
                  border: '1px solid var(--line, #cbd5e1)',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '600',
                  textDecoration: 'none',
                }}
              >
                <ShoppingBag size={15} color="#ea580c" />
                <span>{isHi ? '🛒 Amazon पर मौजूदा कीमत देखें' : '🛒 Check current price on Amazon'}</span>
                <ExternalLink size={13} color="currentColor" />
              </a>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border, #f1f5f9)' }}>
        <p style={{ fontSize: '11px', color: 'var(--muted, #94a3b8)', margin: 0 }}>
          {isHi
            ? 'यह केवल अनुमान है, वित्तीय सलाह नहीं। असली शुल्क और दरें प्रदाता से जाँचें।'
            : 'This is an estimate for learning, not financial advice. Check actual charges and rates with the provider.'}
        </p>
      </div>
    </div>
  );
}
