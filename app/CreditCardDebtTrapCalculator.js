'use client';
import { useState, useMemo } from 'react';
import { debtComparison, numericInput } from '../lib/calculator-math.mjs';
import { AlertTriangle, CheckCircle, ShieldAlert, ArrowRight, Banknote, Info } from 'lucide-react';

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
    const result = debtComparison(numericInput(bill), numericInput(monthlyBudget));
    if (!result) return null;
    const emiOptions = result.options.map(option => ({ ...option,
      isRecommended: option.months === result.recommended,
      isWarning: !option.affordable,
      badge: option.months === result.recommended ? (isHi ? 'बजट में सबसे कम लागत' : 'Lowest cost within budget')
        : !option.affordable ? (isHi ? 'पहला भुगतान बजट से अधिक' : 'First payment exceeds budget')
        : (isHi ? 'बजट में' : 'Within budget') }));
    return { minDueFirstMonth: Math.round(result.firstMinimum), minDueYears: (result.minimumMonths / 12).toFixed(1),
      minDueTotalInterest: Math.round(result.minimumInterestAndTax), minDueTotalPaid: Math.round(result.minimumTotal),
      emiOptions, smartSavings: emiOptions[3].totalExtraCost - emiOptions[1].totalExtraCost };
  }, [bill, monthlyBudget, isHi]);

  const inputStyle = {
    width: '100%',
    padding: '10px 12px 10px 28px',
    borderRadius: '10px',
    border: '1px solid var(--line, #cbd5e1)',
    background: 'var(--field, #ffffff)',
    color: 'var(--ink, #0f172a)',
    outline: 'none'
  };

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
          <AlertTriangle size={14} /> {isHi ? 'क्रेडिट कार्ड क़र्ज़ और EMI कैलकुलेटर' : 'Debt Trap & EMI Exit Calculator'}
        </span>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--ink, #0f172a)', margin: '4px 0' }}>
          {isHi ? 'सिर्फ़ न्यूनतम देय भरें या बिल को EMI में बदलें?' : 'Should You Pay Minimum Due or Convert to EMI?'}
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--muted, #64748b)', margin: 0, lineHeight: '1.6' }}>
          {isHi
            ? 'कैसे इस्तेमाल करें: कार्ड का कुल बकाया और हर महीने चुका सकने वाली रकम भरें। नतीजा उदाहरण दरों पर बताता है कि सिर्फ़ न्यूनतम देय भरने और 3, 6, 12 या 24 महीने की EMI में लगभग कितना अतिरिक्त पैसा जा सकता है।'
            : 'How to use: enter your total card outstanding and what you can repay each month. The result estimates, at example rates, how much extra you may pay with only the minimum due versus a 3, 6, 12 or 24-month EMI.'}
        </p>
      </div>

      <div style={{ background: 'var(--soft, #f8fafc)', padding: '16px', borderRadius: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          <div>
            <label htmlFor="debt-trap-bill" style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--ink, #1e293b)', marginBottom: '6px' }}>
              {isHi ? 'क्रेडिट कार्ड का कुल बिल / बकाया (₹):' : 'Total Credit Card Bill / Outstanding (₹):'}
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '10px', fontWeight: '600', color: 'var(--muted, #64748b)' }}>₹</span>
              <input
                id="debt-trap-bill"
                type="number"
                inputMode="decimal"
                value={bill}
                min={5000}
                step={5000}
                onChange={(e) => setBill(e.target.value)}
                style={{ ...inputStyle, fontSize: '18px', fontWeight: '700' }}
              />
            </div>
          </div>

          <div>
            <label htmlFor="debt-trap-budget" style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--ink, #1e293b)', marginBottom: '6px' }}>
              {isHi ? 'आप हर महीने कितना दे सकते हैं (₹):' : 'Monthly Repayment Capacity (₹):'}
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '10px', fontWeight: '600', color: 'var(--muted, #64748b)' }}>₹</span>
              <input
                id="debt-trap-budget"
                type="number"
                inputMode="decimal"
                value={monthlyBudget}
                min={1000}
                step={1000}
                onChange={(e) => setMonthlyBudget(e.target.value)}
                style={{ ...inputStyle, fontSize: '16px', fontWeight: '600' }}
              />
            </div>
            <span style={{ display: 'block', fontSize: '11px', color: 'var(--muted, #64748b)', marginTop: '4px' }}>
              {isHi ? 'नीचे दी गई EMI से इस रकम की तुलना करें।' : 'Compare this amount with the EMIs below.'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
          <span style={{ fontSize: '12px', color: 'var(--muted, #64748b)', fontWeight: '500' }}>
            {isHi ? 'उदाहरण बिल राशि:' : 'Quick Presets:'}
          </span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setBill(p.val)}
              style={{
                padding: '4px 10px',
                borderRadius: '16px',
                border: bill === p.val ? '1px solid #dc2626' : '1px solid var(--border, #e2e8f0)',
                background: bill === p.val ? 'rgba(220, 38, 38, 0.1)' : 'var(--surface, #ffffff)',
                color: bill === p.val ? '#dc2626' : 'var(--muted, #475569)',
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

      {!analysis && <p role="alert">{isHi ? 'सही बकाया और मासिक बजट भरें।' : 'Enter a valid outstanding balance and monthly budget.'}</p>}
      {analysis && (
        <>
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
                ? 'उदाहरण दरें: कार्ड ब्याज 3.5% प्रति माह, EMI ब्याज 15% सालाना, प्रोसेसिंग शुल्क 1.5% (कम से कम ₹199) और 18% GST। न्यूनतम भुगतान मूलधन का 5% व ब्याज/GST, कम से कम ₹500, अधिकतम कुल बकाया है। नई खरीद या देरी शुल्क शामिल नहीं हैं। असली दरें बैंक से जाँचें।'
                : 'Example figures — these rates are fixed examples: 3.5% monthly card interest (about 42% a year), 15% yearly EMI interest, a 1.5% processing fee and 18% GST. Minimum due assumes 5% of principal plus interest/GST, at least ₹500 and capped at the balance. No new spending, late fees or missed payments. You can change the bill and monthly budget. Check your card\'s actual rates on your statement or with the bank.'}
            </span>
          </div>

          <div style={{
            background: 'rgba(220, 38, 38, 0.06)',
            border: '2px solid rgba(220, 38, 38, 0.35)',
            borderRadius: '16px',
            padding: '18px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ background: 'rgba(220, 38, 38, 0.12)', padding: '8px', borderRadius: '12px', color: '#dc2626' }}>
                <ShieldAlert size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--ink, #991b1b)', margin: 0 }}>
                  {isHi ? '⚠️ सावधान: सिर्फ़ न्यूनतम देय भरने का जाल (उदाहरण: लगभग 42% सालाना ब्याज)' : '⚠️ Warning: paying only the minimum due (example: about 42% yearly interest)'}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--ink, #7f1d1d)', margin: '4px 0 10px 0', lineHeight: '1.6' }}>
                  {isHi
                    ? `अगर आप सिर्फ़ न्यूनतम देय राशि (~₹${analysis.minDueFirstMonth.toLocaleString('en-IN')}) भरते रहेंगे, तो इस ₹${Number(bill).toLocaleString('en-IN')} के बिल को चुकाने में लगभग ${analysis.minDueYears} साल लग सकते हैं (मोटा अनुमान)।`
                    : `If you only pay the minimum due (~₹${analysis.minDueFirstMonth.toLocaleString('en-IN')}), this ₹${Number(bill).toLocaleString('en-IN')} balance could take roughly ${analysis.minDueYears} years to clear (rough estimate).`}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', background: 'var(--surface, #ffffff)', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(220, 38, 38, 0.25)' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--muted, #64748b)', display: 'block' }}>{isHi ? 'अनुमानित कुल ब्याज + GST:' : 'Estimated interest + GST:'}</span>
                    <strong style={{ fontSize: '16px', color: '#dc2626' }}>+₹{analysis.minDueTotalInterest.toLocaleString('en-IN')}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--muted, #64748b)', display: 'block' }}>{isHi ? 'बैंक को अनुमानित कुल भुगतान:' : 'Estimated total paid to bank:'}</span>
                    <strong style={{ fontSize: '16px', color: 'var(--ink, #0f172a)' }}>₹{analysis.minDueTotalPaid.toLocaleString('en-IN')}</strong>
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
              <CheckCircle size={20} color="#16664b" style={{ flexShrink: 0 }} />
              <p style={{ fontSize: '13px', color: 'var(--accent, #16664b)', fontWeight: '600', margin: 0 }}>
                {isHi
                  ? `💡 24 महीने की जगह 6 महीने की EMI चुनने पर ब्याज और शुल्क में लगभग ₹${Math.round(analysis.smartSavings).toLocaleString('en-IN')} कम लग सकते हैं, अगर वह EMI आपके बजट में आती है।`
                  : `💡 Choosing a 6-month EMI instead of 24 months could cost about ₹${Math.round(analysis.smartSavings).toLocaleString('en-IN')} less in interest and fees, if that EMI fits your budget.`}
              </p>
            </div>
          )}

          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--ink, #0f172a)', marginBottom: '12px' }}>
              {isHi ? 'EMI अवधि की तुलना: किस अवधि में कितना खर्च?' : 'EMI tenure comparison: estimated cost at each tenure'}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              {analysis.emiOptions.map((opt) => (
                <div
                  key={opt.months}
                  style={{
                    background: opt.isRecommended ? 'rgba(22, 102, 75, 0.05)' : 'var(--surface, #ffffff)',
                    border: opt.isRecommended ? '2px solid var(--accent, #16664b)' : opt.isWarning ? '1px solid #fca5a5' : '1px solid var(--border, #e2e8f0)',
                    borderRadius: '16px',
                    padding: '16px',
                    boxShadow: opt.isRecommended ? '0 4px 14px rgba(22, 102, 75, 0.1)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--ink, #0f172a)' }}>
                      {opt.months} {isHi ? 'महीने' : 'Months'}
                    </span>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: opt.isRecommended ? '#16664b' : opt.isWarning ? '#fee2e2' : 'var(--soft, #f1f5f9)',
                      color: opt.isRecommended ? '#ffffff' : opt.isWarning ? '#dc2626' : 'var(--muted, #475569)'
                    }}>
                      {opt.badge}
                    </span>
                  </div>

                  <div style={{ margin: '12px 0' }}>
                    <span style={{ fontSize: '11px', color: 'var(--muted, #64748b)' }}>{isHi ? 'मासिक किश्त (EMI):' : 'Monthly EMI:'}</span>
                    <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--ink, #0f172a)' }}>
                      ₹{Math.round(opt.emi).toLocaleString('en-IN')}<span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--muted, #64748b)' }}>{isHi ? '/माह' : '/mo'}</span>
                    </div>
                  </div>

                  <p style={{ fontSize: '12px' }}>{isHi ? 'पहला भुगतान (शुल्क और GST सहित): ₹' : 'First payment (fees and GST included): ₹'}{Math.round(opt.firstMonthPayment).toLocaleString('en-IN')}</p>
                  <div style={{ borderTop: '1px solid var(--border, #f1f5f9)', paddingTop: '10px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '4px', color: 'var(--ink, #0f172a)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                      <span style={{ color: 'var(--muted, #64748b)' }}>{isHi ? 'अतिरिक्त खर्च (ब्याज + GST + शुल्क):' : 'Extra cost (interest + GST + fee):'}</span>
                      <strong style={{ color: opt.isWarning ? '#dc2626' : 'var(--accent, #16664b)' }}>₹{Math.round(opt.totalExtraCost).toLocaleString('en-IN')}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                      <span style={{ color: 'var(--muted, #64748b)' }}>{isHi ? 'बैंक को कुल भुगतान:' : 'Total Repaid:'}</span>
                      <strong>₹{Math.round(opt.totalPaid).toLocaleString('en-IN')}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            background: 'var(--soft, #f0fdf4)',
            border: '1px solid var(--border, #bbf7d0)',
            borderRadius: '16px',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Banknote size={20} color="#16664b" />
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--ink, #0f172a)', margin: 0 }}>
                {isHi ? 'तुलना के लिए दो और रास्ते:' : 'Two other options to compare:'}
              </h3>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--muted, #334155)', margin: '0 0 16px 0', lineHeight: '1.6' }}>
              {isHi
                ? 'कार्ड का ब्याज (उदाहरण: लगभग 42% सालाना) ज़्यादा हो तो कम ब्याज वाला लोन या बैलेंस ट्रांसफ़र ऑफ़र सस्ता पड़ सकता है। पहले सालाना ब्याज (APR) और सभी शुल्क की तुलना करें।'
                : 'When card interest is high (example: about 42% a year), a lower-interest loan or a balance-transfer offer may cost less. Compare the APR and all fees first.'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
              <div style={{ background: 'var(--surface, #ffffff)', padding: '14px', borderRadius: '12px', border: '1px solid var(--line, #cbd5e1)' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--accent, #16664b)', textTransform: 'uppercase' }}>
                  {isHi ? 'रास्ता 1: पर्सनल लोन (उदाहरण दर 10.5%)' : 'Option 1: Personal loan (example 10.5% APR)'}
                </span>
                <p style={{ fontSize: '12px', color: 'var(--muted, #475569)', margin: '4px 0 10px 0' }}>
                  {isHi
                    ? 'अगर कार्ड से कम ब्याज पर पर्सनल लोन मिले, तो उससे कार्ड का पूरा भुगतान करने पर ब्याज घट सकता है। आपकी दर आपकी प्रोफ़ाइल पर निर्भर है और लोन मिलना तय नहीं; KFS में APR और शुल्क जाँचें।'
                    : 'If you can get a personal loan at a lower rate than your card, paying the card in full with it can reduce interest. Your rate depends on your profile and approval is not certain; check the APR and fees in the KFS.'}
                </p>
                <a
                  href={(isHi ? '/hi' : '') + '/guides/loan-options/'}
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
                  <span>{isHi ? 'लोन गाइड पढ़ें' : 'Read the loan guide'}</span>
                  <ArrowRight size={14} />
                </a>
              </div>

              <div style={{ background: 'var(--surface, #ffffff)', padding: '14px', borderRadius: '12px', border: '1px solid var(--line, #cbd5e1)' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#2563eb', textTransform: 'uppercase' }}>
                  {isHi ? 'रास्ता 2: बैलेंस ट्रांसफ़र ऑफ़र' : 'Option 2: Balance transfer offer'}
                </span>
                <p style={{ fontSize: '12px', color: 'var(--muted, #475569)', margin: '4px 0 10px 0' }}>
                  {isHi
                    ? 'कुछ कार्ड थोड़े समय (उदाहरण: 3–6 महीने) के लिए कम या 0% ब्याज पर बकाया ट्रांसफ़र करने देते हैं। ट्रांसफ़र शुल्क और ऑफ़र ख़त्म होने के बाद की दर पहले जाँचें।'
                    : 'Some cards let you move a balance at low or 0% interest for a short period (example: 3–6 months). Check the transfer fee and the rate after the offer ends.'}
                </p>
                <a
                  href={(isHi ? '/hi' : '') + '/guides/credit-card/'}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'var(--surface, #ffffff)',
                    color: 'var(--ink, #0f172a)',
                    border: '1px solid var(--line, #cbd5e1)',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '700',
                    textDecoration: 'none'
                  }}
                >
                  <span>{isHi ? 'क्रेडिट कार्ड गाइड पढ़ें' : 'Read the credit card guide'}</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </>
      )}

      <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid var(--border, #f1f5f9)', fontSize: '11px', color: 'var(--muted, #94a3b8)' }}>
        {isHi
          ? 'यह केवल अनुमान है, वित्तीय सलाह नहीं। असली शुल्क और दरें प्रदाता से जाँचें।'
          : 'This is an estimate for learning, not financial advice. Check actual charges and rates with the provider.'}
      </div>
    </div>
  );
}
