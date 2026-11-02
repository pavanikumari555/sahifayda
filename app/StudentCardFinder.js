'use client';
import { useState, useMemo } from 'react';
import { GraduationCap, CheckCircle2, ArrowRight, TrendingUp, Info } from 'lucide-react';

export default function StudentCardFinder({ language = 'en' }) {
  const isHi = language === 'hi';
  const [fdAmount, setFdAmount] = useState(5000);
  const [profileType, setProfileType] = useState('student');

  const profiles = [
    { id: 'student', label: isHi ? '🎓 कॉलेज छात्र (18+)' : '🎓 College Student (18+)' },
    { id: 'freelancer', label: isHi ? '💼 फ्रीलांसर / स्वरोज़गार' : '💼 Freelancer / Self-Employed' },
    { id: 'beginner', label: isHi ? '🏠 कोई क्रेडिट इतिहास नहीं / पहला कार्ड' : '🏠 No credit history / First card' },
  ];

  const presets = [
    { label: isHi ? '₹2,000 (शुरुआत)' : '₹2,000 (Starter)', val: 2000 },
    { label: '₹5,000', val: 5000 },
    { label: '₹10,000', val: 10000 },
    { label: isHi ? '₹25,000 (ज़्यादा लिमिट)' : '₹25,000 (Higher limit)', val: 25000 },
  ];

  const cardMatches = useMemo(() => {
    const fd = Number(fdAmount) || 2000;
    const annualInterestRate = 0.075;
    const annualFdInterest = Math.round(fd * annualInterestRate);

    const cards = [
      {
        id: 'idfc_wow',
        name: 'IDFC FIRST WOW Credit Card',
        badge: isHi ? 'उदाहरण: ₹2,000 FD से • 0% फ़ॉरेक्स मार्कअप' : 'Example: from ₹2,000 FD • 0% forex markup',
        minFd: 2000,
        limitPercent: 100,
        fee: isHi ? 'सालाना शुल्क ₹0 (उदाहरण)' : '₹0 annual fee (example)',
        fdRate: 'Up to 7.5% p.a.',
        features: [
          isHi ? 'लिमिट FD के 100% तक (उदाहरण: ₹' + fd.toLocaleString('en-IN') + ')' : 'Limit up to 100% of the FD (example: ₹' + fd.toLocaleString('en-IN') + ')',
          isHi ? '0% फ़ॉरेक्स मार्कअप (उदाहरण; विदेशी मुद्रा में भुगतान के काम आ सकता है)' : '0% forex markup (example; can help with foreign-currency payments)',
          isHi ? 'FD पर आधारित कार्ड में मंज़ूरी की संभावना आम तौर पर ज़्यादा होती है, पर अंतिम फ़ैसला बैंक का है' : 'FD-backed cards are often easier to get, but the bank decides',
        ],
        applyUrl: (isHi ? '/hi' : '') + '/guides/credit-card/',
        bestFor: isHi ? 'उदाहरण: छोटी FD से शुरू होने वाला सिक्योर्ड कार्ड' : 'Example: a secured card that starts with a small FD',
        rating: '4.9 ★',
        isBest: fd < 5000 || profileType === 'student'
      },
      {
        id: 'onecard_metal',
        name: 'OneCard Metal (FD-Backed)',
        badge: isHi ? 'उदाहरण: मेटल कार्ड • 5X रिवॉर्ड' : 'Example: metal card • 5X rewards',
        minFd: 5000,
        limitPercent: 100,
        fee: isHi ? 'सालाना शुल्क ₹0 (उदाहरण)' : '₹0 annual fee (example)',
        fdRate: 'Up to 7.1% p.a.',
        features: [
          isHi ? 'मेटल क्रेडिट कार्ड, जॉइनिंग या सालाना शुल्क नहीं (उदाहरण)' : 'Metal credit card with no joining or annual fee (example)',
          isHi ? 'सबसे ज़्यादा ख़र्च वाली 2 श्रेणियों पर 5X रिवॉर्ड पॉइंट (उदाहरण)' : '5X reward points on your top 2 spend categories (example)',
          isHi ? 'ऑनलाइन आवेदन और KYC; मंज़ूरी और चालू होने का समय बैंक तय करता है' : 'Online application and KYC; the bank decides approval and activation time',
        ],
        applyUrl: (isHi ? '/hi' : '') + '/guides/credit-card/',
        bestFor: isHi ? 'उदाहरण: मेटल कार्ड और रिवॉर्ड चाहने वालों के लिए। समय पर पूरा बिल भरने से स्कोर धीरे-धीरे सुधर सकता है।' : 'Example: for people who want a metal card and rewards. Paying the full bill on time can slowly improve your score.',
        rating: '4.8 ★',
        isBest: fd >= 5000 && profileType !== 'student'
      },
      {
        id: 'kotak_dream',
        name: 'Kotak 811 #DreamDifferent Card',
        badge: isHi ? 'उदाहरण: ₹10,000 FD से • 45 दिन तक ब्याज-मुक्त अवधि' : 'Example: from ₹10,000 FD • up to 45 days interest-free',
        minFd: 10000,
        limitPercent: 90,
        fee: isHi ? 'सालाना शुल्क ₹0 (उदाहरण)' : '₹0 annual fee (example)',
        fdRate: 'Up to 7.0% p.a.',
        features: [
          isHi ? 'लिमिट FD के 90% तक (उदाहरण: ₹' + Math.round(fd * 0.9).toLocaleString('en-IN') + ')' : 'Limit up to 90% of the FD (example: ₹' + Math.round(fd * 0.9).toLocaleString('en-IN') + ')',
          isHi ? 'कार्ड चालू करने पर 500 रिवॉर्ड पॉइंट (उदाहरण)' : '500 reward points on activation (example)',
          isHi ? 'ATM से नक़द निकासी पर 48 दिन तक ब्याज नहीं (उदाहरण; शुल्क और मौजूदा शर्तें बैंक से जाँचें)' : 'Interest-free cash withdrawals for up to 48 days (example; check fees and current terms with the bank)',
        ],
        applyUrl: (isHi ? '/hi' : '') + '/guides/credit-card/',
        bestFor: isHi ? 'Kotak 811 खाताधारकों के लिए सुविधाजनक (मंज़ूरी बैंक तय करता है)' : 'Convenient for Kotak 811 account holders (the bank decides approval)',
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

  const stepBoxStyle = { background: 'var(--surface, #ffffff)', padding: '10px', borderRadius: '10px', border: '1px solid var(--border, #d1fae5)' };

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
          color: 'var(--accent, #16664b)',
          padding: '4px 10px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '700',
          marginBottom: '6px'
        }}>
          <GraduationCap size={14} /> {isHi ? 'छात्र और बिना आय वालों के लिए FD कार्ड गाइड' : 'Student & Zero-Income Card Finder'}
        </span>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--ink, #0f172a)', margin: '4px 0' }}>
          {isHi ? 'सैलरी स्लिप या क्रेडिट इतिहास नहीं? FD पर आधारित क्रेडिट कार्ड एक विकल्प है' : 'No income proof or credit history? An FD-backed credit card is one option'}
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--muted, #64748b)', margin: 0, lineHeight: '1.6' }}>
          {isHi
            ? 'कैसे इस्तेमाल करें: जितनी FD रख सकते हैं वह रकम भरें और अपनी प्रोफ़ाइल चुनें। नतीजा उदाहरण कार्ड, संभावित लिमिट और FD ब्याज का अनुमान दिखाता है। FD पर आधारित कार्ड में मंज़ूरी की संभावना आम तौर पर ज़्यादा होती है, पर अंतिम फ़ैसला बैंक का है।'
            : 'How to use: enter the FD amount you can keep and pick your profile. The result shows example cards, a possible limit and estimated FD interest. FD-backed cards are often easier to get, but the bank decides.'}
        </p>
      </div>

      <div style={{ background: 'var(--soft, #f8fafc)', padding: '16px', borderRadius: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          <div>
            <label htmlFor="student-card-fd" style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--ink, #1e293b)', marginBottom: '6px' }}>
              {isHi ? 'आप कितनी FD रख सकते हैं (₹):' : 'Fixed Deposit (FD) Amount You Can Keep (₹):'}
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '10px', fontWeight: '600', color: 'var(--muted, #64748b)' }}>₹</span>
              <input
                id="student-card-fd"
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
                  border: '1px solid var(--line, #cbd5e1)',
                  fontSize: '18px',
                  fontWeight: '700',
                  background: 'var(--field, #ffffff)',
                  color: 'var(--ink, #0f172a)',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div>
            <label htmlFor="student-card-profile" style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--ink, #1e293b)', marginBottom: '6px' }}>
              {isHi ? 'आपकी प्रोफ़ाइल चुनें:' : 'Select Your Profile:'}
            </label>
            <select
              id="student-card-profile"
              value={profileType}
              onChange={(e) => setProfileType(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1px solid var(--line, #cbd5e1)',
                fontSize: '14px',
                fontWeight: '600',
                background: 'var(--field, #ffffff)',
                color: 'var(--ink, #0f172a)',
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
          <span style={{ fontSize: '12px', color: 'var(--muted, #64748b)', fontWeight: '500' }}>
            {isHi ? 'उदाहरण FD राशि:' : 'Quick Presets:'}
          </span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setFdAmount(p.val)}
              style={{
                padding: '4px 10px',
                borderRadius: '16px',
                border: fdAmount === p.val ? '1px solid #16664b' : '1px solid var(--border, #e2e8f0)',
                background: fdAmount === p.val ? '#16664b' : 'var(--surface, #ffffff)',
                color: fdAmount === p.val ? '#ffffff' : 'var(--muted, #475569)',
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
        background: 'var(--soft, #f0fdf4)',
        border: '1px solid var(--border, #a7f3d0)',
        borderRadius: '16px',
        padding: '16px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <TrendingUp size={18} color="#16664b" />
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--ink, #065f46)', margin: 0 }}>
            {isHi ? 'FD कार्ड से क्रेडिट इतिहास कैसे बनता है:' : 'How an FD-backed card can help build credit history:'}
          </h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '12px', color: 'var(--ink, #047857)' }}>
          <div style={stepBoxStyle}>
            <strong>1. {isHi ? 'चरण 1' : 'Step 1'}:</strong> {isHi ? '₹' + cardMatches.fd.toLocaleString('en-IN') + ' की FD रखकर आवेदन करें। बैंक की मंज़ूरी के बाद लिमिट FD से जुड़ी होती है।' : 'Apply with a ₹' + cardMatches.fd.toLocaleString('en-IN') + ' FD. After bank approval, the limit is linked to the FD.'}
          </div>
          <div style={stepBoxStyle}>
            <strong>2. {isHi ? 'चरण 2' : 'Step 2'}:</strong> {isHi ? 'लिमिट का छोटा हिस्सा (जैसे 30% से कम) खर्च करें। समय पर पूरा बिल भरने से स्कोर धीरे-धीरे सुधर सकता है।' : 'Use a small part of the limit (for example under 30%). Paying the full bill on time can slowly improve your score.'}
          </div>
          <div style={stepBoxStyle}>
            <strong>3. {isHi ? 'चरण 3' : 'Step 3'}:</strong> {isHi ? 'अच्छा रिकॉर्ड बनने पर आगे चलकर बिना FD वाले कार्ड के ऑफ़र मिल सकते हैं। कोई तय समय या पक्का स्कोर नहीं है।' : 'With a good record, you may later get offers for cards without an FD. There is no fixed timeline or guaranteed score.'}
          </div>
        </div>
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
            ? 'उदाहरण के आँकड़े — आवेदन से पहले बैंक पर मौजूदा ऑफ़र जाँचें। FD की रकम आप बदल सकते हैं; कार्ड के नाम, शुल्क, लिमिट प्रतिशत, रिवॉर्ड और 7.5% FD ब्याज दर तय उदाहरण हैं, ज़रूरी नहीं कि आज लागू हों।'
            : 'Example figures — check the current offer with the bank before applying. You can change the FD amount; card names, fees, limit percentages, rewards and the 7.5% FD rate are fixed examples and may not be live today.'}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--ink, #0f172a)', margin: 0 }}>
          {isHi ? '₹' + cardMatches.fd.toLocaleString('en-IN') + ' की FD के लिए उदाहरण FD-आधारित कार्ड:' : 'Example FD-backed cards for a ₹' + cardMatches.fd.toLocaleString('en-IN') + ' FD:'}
        </h3>

        {cardMatches.cards.map((card) => (
          <div
            key={card.id}
            style={{
              borderRadius: '16px',
              border: card.isBest ? '2px solid var(--accent, #16664b)' : '1px solid var(--border, #e2e8f0)',
              background: card.isBest ? 'rgba(22, 102, 75, 0.04)' : 'var(--surface, #ffffff)',
              padding: '18px',
              boxShadow: card.isBest ? '0 4px 16px rgba(22, 102, 75, 0.08)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  {card.isBest && (
                    <span style={{ background: '#16664b', color: '#ffffff', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '6px' }}>
                      {isHi ? 'आपके चुनाव से मेल खाता' : 'Matches your inputs'}
                    </span>
                  )}
                  <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent, #16664b)' }}>{card.badge}</span>
                  <span style={{ fontSize: '11px', color: 'var(--muted, #64748b)' }}>• {card.fee}</span>
                </div>
                <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--ink, #0f172a)', margin: '4px 0 2px 0' }}>
                  {card.name}
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--muted, #475569)', margin: 0 }}>
                  {card.bestFor}
                </p>
              </div>

              <div style={{ textAlign: 'right', background: 'rgba(22, 102, 75, 0.08)', padding: '8px 14px', borderRadius: '12px', minWidth: '150px' }}>
                <div style={{ fontSize: '11px', color: 'var(--muted, #64748b)' }}>{isHi ? 'संभावित कार्ड लिमिट:' : 'Possible card limit:'}</div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--accent, #16664b)' }}>
                  ₹{Math.round(cardMatches.fd * (card.limitPercent / 100)).toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--accent, #047857)', fontWeight: '600' }}>
                  {isHi
                    ? '+ लगभग ₹' + cardMatches.annualFdInterest.toLocaleString('en-IN') + '/वर्ष FD ब्याज (7.5% उदाहरण दर)'
                    : '+ about ₹' + cardMatches.annualFdInterest.toLocaleString('en-IN') + '/yr FD interest (7.5% example rate)'}
                </div>
              </div>
            </div>

            <ul style={{ margin: '12px 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {card.features.map((feat, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--ink, #334155)' }}>
                  <CheckCircle2 size={14} color="#16664b" style={{ flexShrink: 0 }} />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
              <span style={{ fontSize: '11px', color: 'var(--muted, #64748b)' }}>
                {isHi ? 'ऑनलाइन आवेदन; मंज़ूरी और चालू होने का समय बैंक तय करता है' : 'Online application; the bank decides approval and activation time'}
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
                <span>{isHi ? '💳 कार्ड की पूरी जानकारी पढ़ें' : '💳 Read card details'}</span>
                <ArrowRight size={15} />
              </a>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid var(--border, #f1f5f9)', fontSize: '11px', color: 'var(--muted, #94a3b8)', lineHeight: '1.6' }}>
        <p style={{ margin: '0 0 4px 0' }}>
          {isHi
            ? 'नोट: FD पर आधारित कार्ड में FD आम तौर पर बैंक के पास गिरवी (लियन) रहती है। उस पर ब्याज मिलता रहता है, पर बिल न भरने पर बैंक बकाया वसूलने के लिए FD का इस्तेमाल कर सकता है।'
            : 'Note: with an FD-backed card, the FD is usually held under lien by the bank. It keeps earning interest, but if you do not pay the bill, the bank can use the FD to recover the dues.'}
        </p>
        <p style={{ margin: 0 }}>
          {isHi
            ? 'यह केवल अनुमान है, वित्तीय सलाह नहीं। असली शुल्क और दरें प्रदाता से जाँचें।'
            : 'This is an estimate for learning, not financial advice. Check actual charges and rates with the provider.'}
        </p>
      </div>
    </div>
  );
}
