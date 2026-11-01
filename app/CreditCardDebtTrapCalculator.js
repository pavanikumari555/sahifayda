'use client';

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

    const monthlyRate = 0.035; // 3.5% per month (42% p.a. APR)
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
                    ? `अगर आप सिर्फ़ न्यूनतम देय राशि (~₹${analysis.minDueFirstMonth.toLocaleString('en-IN')}) भरते रहेंगे, तो इस ₹${bill.toLocaleString('en-IN')} के बिल को चुकाने में लगभग ${analysis.minDueYears} साल लग जाएँगे!`
                    : `If you only pay the minimum due (~₹${analysis.minDueFirstMonth.toLocaleString('en-IN')}), this ₹${bill.toLocaleString('en-IN')} balance will take ${analysis.minDueYears} years to clear!`}
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
                  ? `💡 स्मार्ट बचत: 24 महीने के बजाय 6 महीने की किश्त चुनने पर आपके ₹${analysis.smartSavings.toLocaleString('en-IN')} नक़द बचेंगे!`
                  : `💡 Smart Savings: Choosing a 6-month EMI instead of 24 months saves you ₹${analysis.smartSavings.toLocaleString('en-IN')} pure cash!`}
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
                  rel="nofollow sponsored"
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
                  rel="nofollow sponsored"
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
