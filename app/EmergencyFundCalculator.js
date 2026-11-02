'use client';
import { useState } from 'react';
import { AlertCircle, Shield, TrendingUp, CheckCircle2, Clock, Wallet } from 'lucide-react';

export default function EmergencyFundCalculator({ language = 'en' }) {
  const isHi = language === 'hi';
  
  const [monthlyExpense, setMonthlyExpense] = useState(30000);
  const [familySize, setFamilySize] = useState(4);
  const [jobType, setJobType] = useState('salaried');
  const [currentFund, setCurrentFund] = useState(0);
  const [savingCapacity, setSavingCapacity] = useState(10000);

  const copy = {
    en: {
      badge: 'Emergency Fund Calculator',
      title: 'Do You Have Enough Emergency Money?',
      subtitle: 'Estimate how much money to keep aside for a job loss, a medical emergency or a family need.',
      howToLabel: 'How to use:',
      howTo: 'Enter your monthly household expenses, your job type, the emergency money you already have and how much you can save each month. The result shows a suggested target, any shortfall and roughly how long it may take to build.',
      inputLabels: {
        monthlyExpense: 'Total monthly household expenses',
        familySize: 'Family members (including you)',
        jobType: 'Your job type',
        currentFund: 'Emergency money you already have',
        savingCapacity: 'How much you can save each month'
      },
      jobTypes: {
        salaried: 'Salaried (steady income)',
        self_employed: 'Self-employed / Business',
        freelance: 'Freelance / Gig work'
      },
      result: {
        target: 'Suggested emergency fund',
        basis: (months) => `${months} months of expenses (a common rule of thumb)`,
        current: 'Money you already have',
        gap: 'Shortfall',
        surplus: 'Extra over the target',
        riskLevel: 'Risk level',
        timeline: 'Time to build the fund',
        months: 'months',
        plan: 'Simple saving plan',
        allocation: 'Example way to split the fund',
        allocationNote: 'This is only one possible split. Check current interest rates and withdrawal rules with your bank or mutual fund company.'
      },
      plan: {
        current: (amount, months) => `Save ${amount} per month: ready in about ${months} months`,
        faster: (amount) => `Or save ${amount} per month: ready in about 6 months`
      },
      risks: {
        critical: 'Very high risk',
        high: 'High risk',
        medium: 'Moderate risk',
        low: 'Low risk',
        safe: 'Target met'
      },
      tips: {
        savings: 'Savings account (instant access)',
        liquid: 'Liquid mutual fund (money usually arrives in 1 working day)',
        fd: 'Sweep-in FD (breaks automatically when needed)'
      },
      warning: 'Without an emergency fund, one crisis can push you into costly debt.',
      note: 'A common rule of thumb is to keep 6 to 12 months of expenses aside, depending on how steady your income is. This calculator uses 6 months for salaried, 9 for self-employed and 12 for freelance or gig work. Keep this money separate from your investments.',
      disclaimer: 'This is an estimate for learning, not financial advice. Check actual costs and rates with the provider.'
    },
    hi: {
      badge: 'आपातकालीन फ़ंड कैलकुलेटर',
      title: 'क्या आपके पास मुश्किल समय के लिए पर्याप्त पैसा है?',
      subtitle: 'नौकरी छूटने, बीमारी या परिवार की किसी ज़रूरत के लिए कितना पैसा अलग रखें, इसका अनुमान लगाएँ।',
      howToLabel: 'कैसे इस्तेमाल करें:',
      howTo: 'घर का महीने का खर्च, अपने काम का प्रकार, अभी जमा आपातकालीन पैसा और हर महीने कितनी बचत कर सकते हैं, यह भरें। नतीजे में सुझाई गई रकम, कितनी कमी है और उसे जमा करने में लगभग कितना समय लगेगा, यह दिखेगा।',
      inputLabels: {
        monthlyExpense: 'घर का महीने का कुल खर्च',
        familySize: 'परिवार के सदस्य (आप भी शामिल)',
        jobType: 'आपके काम का प्रकार',
        currentFund: 'अभी जमा आपातकालीन पैसा',
        savingCapacity: 'हर महीने कितनी बचत कर सकते हैं'
      },
      jobTypes: {
        salaried: 'नौकरी (हर महीने तय वेतन)',
        self_employed: 'अपना काम / व्यापार',
        freelance: 'फ्रीलांस / अस्थायी काम'
      },
      result: {
        target: 'सुझाई गई आपातकालीन रकम',
        basis: (months) => `${months} महीने का खर्च (आम तौर पर अपनाया जाने वाला नियम)`,
        current: 'अभी जमा रकम',
        gap: 'कमी',
        surplus: 'लक्ष्य से ज़्यादा',
        riskLevel: 'जोखिम का स्तर',
        timeline: 'फ़ंड जमा होने में लगने वाला समय',
        months: 'महीने',
        plan: 'बचत की आसान योजना',
        allocation: 'फ़ंड को बाँटकर रखने का एक उदाहरण',
        allocationNote: 'यह सिर्फ़ एक तरीका है। मौजूदा ब्याज दर और पैसा निकालने के नियम अपने बैंक या म्यूचुअल फंड कंपनी से जाँचें।'
      },
      plan: {
        current: (amount, months) => `हर महीने ${amount} बचाएँ: लगभग ${months} महीने में तैयार`,
        faster: (amount) => `या हर महीने ${amount} बचाएँ: लगभग 6 महीने में तैयार`
      },
      risks: {
        critical: 'बहुत ज़्यादा जोखिम',
        high: 'ज़्यादा जोखिम',
        medium: 'मध्यम जोखिम',
        low: 'कम जोखिम',
        safe: 'लक्ष्य पूरा'
      },
      tips: {
        savings: 'बचत खाता (तुरंत निकाल सकते हैं)',
        liquid: 'लिक्विड म्यूचुअल फंड (पैसा आमतौर पर 1 कामकाजी दिन में मिलता है)',
        fd: 'स्वीप FD (ज़रूरत पड़ने पर अपने-आप टूटकर खाते में आ जाती है)'
      },
      warning: 'आपातकालीन फ़ंड न हो, तो एक मुश्किल भी आपको महँगे क़र्ज़ में डाल सकती है।',
      note: 'आम तौर पर 6 से 12 महीने का खर्च अलग रखने की सलाह दी जाती है, यह इस पर निर्भर है कि आपकी आय कितनी स्थिर है। यह कैलकुलेटर नौकरी के लिए 6, अपने काम या व्यापार के लिए 9 और फ्रीलांस या अस्थायी काम के लिए 12 महीने मानता है। यह पैसा अपने निवेश से अलग रखें।',
      disclaimer: 'यह केवल अनुमान है, वित्तीय सलाह नहीं। असली खर्च और दरें प्रदाता से जाँचें।'
    }
  };

  const t = copy[isHi ? 'hi' : 'en'];

  // Calculate recommended fund based on job type
  const getRecommendedMonths = () => {
    switch(jobType) {
      case 'salaried': return 6;
      case 'self_employed': return 9;
      case 'freelance': return 12;
      default: return 6;
    }
  };

  const recommendedMonths = getRecommendedMonths();
  const targetFund = monthlyExpense * recommendedMonths;
  const gap = targetFund - currentFund;
  const hasShortage = gap > 0;
  const monthsToTarget = hasShortage && savingCapacity > 0 ? Math.ceil(gap / savingCapacity) : 0;

  // Risk level calculation
  const getRiskLevel = () => {
    const coverage = currentFund / targetFund;
    if (coverage >= 1) return { level: t.risks.safe, color: '#16a34a' };
    if (coverage >= 0.5) return { level: t.risks.low, color: '#84cc16' };
    if (coverage >= 0.25) return { level: t.risks.medium, color: '#eab308' };
    if (coverage > 0) return { level: t.risks.high, color: '#f97316' };
    return { level: t.risks.critical, color: '#dc2626' };
  };

  const risk = getRiskLevel();

  // Smart allocation
  const getAllocation = () => {
    const instant = Math.min(50000, targetFund * 0.3);
    const liquid = Math.min(100000, targetFund * 0.5);
    const fd = targetFund - instant - liquid;
    return { instant, liquid, fd };
  };

  const allocation = getAllocation();

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const labelStyle = { fontSize: '12px', fontWeight: '600', color: 'var(--ink, #334155)', display: 'block', marginBottom: '6px' };
  const fieldWrapStyle = { display: 'flex', alignItems: 'center', border: '1px solid var(--border, #cbd5e1)', borderRadius: '8px', padding: '10px 12px', background: 'var(--surface, #fff)' };
  const innerInputStyle = { border: 'none', outline: 'none', width: '100%', fontSize: '15px', fontWeight: '600', color: 'var(--ink, #0f172a)', background: 'transparent' };

  return (
    <div className="emergency-fund-calculator not-prose" style={{
      maxWidth: '720px',
      margin: '0 auto',
      background: 'var(--surface, #ffffff)',
      border: '1px solid var(--border, #e2e8f0)',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '11px',
          fontWeight: '700',
          color: '#dc2626',
          background: '#fee2e2',
          padding: '4px 10px',
          borderRadius: '12px',
          marginBottom: '6px'
        }}>
          <Shield size={14} aria-hidden="true" /> {t.badge}
        </span>
        
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--ink, #0f172a)', margin: '4px 0' }}>
          {t.title}
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--muted, #64748b)', margin: '8px 0 0', lineHeight: '1.6' }}>
          {t.subtitle}
        </p>
        <p style={{ fontSize: '12px', color: 'var(--muted, #64748b)', margin: '10px 0 0', lineHeight: '1.6', padding: '10px 12px', background: 'var(--soft, #f8fafc)', border: '1px solid var(--border, #e2e8f0)', borderRadius: '8px' }}>
          <strong style={{ color: 'var(--ink, #0f172a)' }}>{t.howToLabel}</strong> {t.howTo}
        </p>
      </div>

      {/* Input Form */}
      <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
        {/* Monthly Expense */}
        <div>
          <label style={labelStyle}>
            {t.inputLabels.monthlyExpense}
          </label>
          <div style={fieldWrapStyle}>
            <span style={{ color: 'var(--muted, #94a3b8)', marginRight: '6px' }}>₹</span>
            <input
              type="number"
              value={monthlyExpense}
              onChange={(e) => setMonthlyExpense(Number(e.target.value))}
              min="5000"
              max="500000"
              step="1000"
              aria-label={t.inputLabels.monthlyExpense}
              style={innerInputStyle}
            />
          </div>
        </div>

        {/* Family Size & Job Type */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={labelStyle}>
              {t.inputLabels.familySize}
            </label>
            <input
              type="number"
              value={familySize}
              onChange={(e) => setFamilySize(Number(e.target.value))}
              min="1"
              max="15"
              aria-label={t.inputLabels.familySize}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border, #cbd5e1)', borderRadius: '8px', fontSize: '15px', fontWeight: '600', color: 'var(--ink, #0f172a)', background: 'var(--surface, #fff)' }}
            />
          </div>
          <div>
            <label style={labelStyle}>
              {t.inputLabels.jobType}
            </label>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              aria-label={t.inputLabels.jobType}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border, #cbd5e1)', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', color: 'var(--ink, #0f172a)', background: 'var(--surface, #fff)' }}
            >
              <option value="salaried">{t.jobTypes.salaried}</option>
              <option value="self_employed">{t.jobTypes.self_employed}</option>
              <option value="freelance">{t.jobTypes.freelance}</option>
            </select>
          </div>
        </div>

        {/* Current Fund & Saving Capacity */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={labelStyle}>
              {t.inputLabels.currentFund}
            </label>
            <div style={fieldWrapStyle}>
              <span style={{ color: 'var(--muted, #94a3b8)', marginRight: '6px' }}>₹</span>
              <input
                type="number"
                value={currentFund}
                onChange={(e) => setCurrentFund(Number(e.target.value))}
                min="0"
                max="10000000"
                step="1000"
                aria-label={t.inputLabels.currentFund}
                style={innerInputStyle}
              />
            </div>
          </div>
          <div>
            <label style={labelStyle}>
              {t.inputLabels.savingCapacity}
            </label>
            <div style={fieldWrapStyle}>
              <span style={{ color: 'var(--muted, #94a3b8)', marginRight: '6px' }}>₹</span>
              <input
                type="number"
                value={savingCapacity}
                onChange={(e) => setSavingCapacity(Number(e.target.value))}
                min="0"
                max="200000"
                step="1000"
                aria-label={t.inputLabels.savingCapacity}
                style={innerInputStyle}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div style={{
        background: hasShortage ? 'linear-gradient(135deg, #fef2f2 0%, #fff5f5 100%)' : 'linear-gradient(135deg, #f0fdf4 0%, #f7fee7 100%)',
        border: hasShortage ? '2px solid #fecaca' : '2px solid #bbf7d0',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        {/* Target vs Current */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>
              {t.result.target}
              <span style={{ display: 'block', fontSize: '11px', fontWeight: '500', color: '#64748b' }}>{t.result.basis(recommendedMonths)}</span>
            </span>
            <span style={{ fontSize: '24px', fontWeight: '800', color: '#dc2626' }}>{formatMoney(targetFund)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px dashed #cbd5e1' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>{t.result.current}</span>
            <span style={{ fontSize: '20px', fontWeight: '700', color: '#16a34a' }}>{formatMoney(currentFund)}</span>
          </div>
        </div>

        {/* Gap/Surplus */}
        <div style={{
          background: hasShortage ? '#fee2e2' : '#dcfce7',
          border: `1px solid ${hasShortage ? '#fca5a5' : '#86efac'}`,
          borderRadius: '8px',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <span style={{ fontSize: '14px', fontWeight: '700', color: hasShortage ? '#991b1b' : '#166534' }}>
            {hasShortage ? t.result.gap : t.result.surplus}
          </span>
          <span style={{ fontSize: '22px', fontWeight: '800', color: hasShortage ? '#dc2626' : '#16a34a' }}>
            {formatMoney(Math.abs(gap))}
          </span>
        </div>

        {/* Risk Level */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: 'rgba(255,255,255,0.6)', borderRadius: '8px', marginBottom: '12px' }}>
          <AlertCircle size={20} style={{ color: risk.color }} aria-hidden="true" />
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', display: 'block' }}>{t.result.riskLevel}</span>
            <span style={{ fontSize: '15px', fontWeight: '800', color: risk.color }}>{risk.level}</span>
          </div>
        </div>

        {/* Timeline */}
        {hasShortage && savingCapacity > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: 'rgba(255,255,255,0.6)', borderRadius: '8px' }}>
            <Clock size={20} style={{ color: '#3b82f6' }} aria-hidden="true" />
            <div>
              <span style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', display: 'block' }}>{t.result.timeline}</span>
              <span style={{ fontSize: '15px', fontWeight: '800', color: '#3b82f6' }}>
                {monthsToTarget} {t.result.months}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Saving Plan */}
      {hasShortage && (
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#1e40af', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} aria-hidden="true" /> {t.result.plan}
          </h3>
          <div style={{ display: 'grid', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} style={{ color: '#16a34a' }} aria-hidden="true" />
              <span style={{ fontSize: '13px', color: '#334155' }}>
                {t.plan.current(formatMoney(savingCapacity), monthsToTarget)}
              </span>
            </div>
            {savingCapacity < gap / 6 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} style={{ color: '#16a34a' }} aria-hidden="true" />
                <span style={{ fontSize: '13px', color: '#334155' }}>
                  {t.plan.faster(formatMoney(Math.ceil(gap / 6)))}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Allocation Strategy */}
      <div style={{ background: 'var(--soft, #f8fafc)', border: '1px solid var(--border, #e2e8f0)', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--ink, #334155)', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Wallet size={18} aria-hidden="true" /> {t.result.allocation}
        </h3>
        <div style={{ display: 'grid', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', background: 'var(--surface, #fff)', borderRadius: '6px', border: '1px solid var(--border, #e2e8f0)' }}>
            <span style={{ fontSize: '12px', color: 'var(--muted, #475569)' }}>{t.tips.savings}</span>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#16a34a' }}>{formatMoney(allocation.instant)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', background: 'var(--surface, #fff)', borderRadius: '6px', border: '1px solid var(--border, #e2e8f0)' }}>
            <span style={{ fontSize: '12px', color: 'var(--muted, #475569)' }}>{t.tips.liquid}</span>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#3b82f6' }}>{formatMoney(allocation.liquid)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', background: 'var(--surface, #fff)', borderRadius: '6px', border: '1px solid var(--border, #e2e8f0)' }}>
            <span style={{ fontSize: '12px', color: 'var(--muted, #475569)' }}>{t.tips.fd}</span>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#8b5cf6' }}>{formatMoney(allocation.fd)}</span>
          </div>
        </div>
        <p style={{ fontSize: '11px', lineHeight: '1.6', color: 'var(--muted, #64748b)', margin: '10px 0 0' }}>
          {t.result.allocationNote}
        </p>
      </div>

      {/* Warning */}
      {hasShortage && (
        <div style={{ background: '#fef3c7', border: '1px solid #fde047', borderRadius: '8px', padding: '12px 14px', marginBottom: '16px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <AlertCircle size={18} style={{ color: '#ca8a04', flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
          <p style={{ fontSize: '12px', lineHeight: '1.6', color: '#713f12', margin: 0 }}>
            <strong>{t.warning}</strong>
          </p>
        </div>
      )}

      {/* Note */}
      <p style={{ fontSize: '11px', lineHeight: '1.6', color: 'var(--muted, #64748b)', margin: '0', padding: '12px', background: 'var(--soft, #f8fafc)', borderRadius: '6px' }}>
        💡 {t.note}
      </p>

      {/* Disclaimer */}
      <p style={{ fontSize: '11px', lineHeight: '1.6', color: 'var(--muted, #64748b)', margin: '10px 0 0' }}>
        {t.disclaimer}
      </p>
    </div>
  );
}
