'use client';
import { useState } from 'react';
import { AlertCircle, Shield, TrendingUp, CheckCircle2, Clock, Wallet, ArrowRight } from 'lucide-react';
import SocialProofCounter from './SocialProofCounter';

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
      subtitle: 'Calculate the exact amount you need to handle job loss, medical crisis, or family emergencies',
      inputLabels: {
        monthlyExpense: 'Total monthly expenses',
        familySize: 'Family members (including you)',
        jobType: 'Your job type',
        currentFund: 'Current emergency fund',
        savingCapacity: 'Monthly saving capacity'
      },
      jobTypes: {
        salaried: 'Salaried (stable income)',
        self_employed: 'Self-employed / Business',
        freelance: 'Freelance / Gig work'
      },
      result: {
        target: 'Recommended Emergency Fund',
        current: 'Current Fund',
        gap: 'Shortage',
        surplus: 'Surplus',
        riskLevel: 'Risk Level',
        timeline: 'Time to Build Fund',
        months: 'months',
        plan: 'Quick Start Saving Plan',
        where: 'Where to Keep Your Emergency Fund',
        allocation: 'Smart Allocation Strategy'
      },
      risks: {
        critical: 'CRITICAL RISK',
        high: 'HIGH RISK',
        medium: 'MODERATE RISK',
        low: 'LOW RISK',
        safe: 'SAFE'
      },
      tips: {
        savings: 'Savings Account (instant access)',
        liquid: 'Liquid Mutual Fund (1-day)',
        fd: 'Sweep FD (auto-break on need)'
      },
      warning: 'Without emergency fund, one crisis can push you into debt trap',
      recommendation: 'Start building emergency fund BEFORE investing in stocks/mutual funds',
      cta: 'Find Best High-Interest Savings Account',
      note: 'Emergency fund = 6-12 months expenses depending on job stability. Keep it separate from investments.'
    },
    hi: {
      badge: 'आपातकालीन फ़ंड कैलकुलेटर',
      title: 'क्या आपके पास पर्याप्त आपातकालीन पैसे हैं?',
      subtitle: 'नौकरी जाने, मेडिकल इमरजेंसी या पारिवारिक ज़रूरत के लिए कितने पैसे चाहिए, जानें',
      inputLabels: {
        monthlyExpense: 'महीने का कुल खर्च',
        familySize: 'परिवार के सदस्य (आपको शामिल)',
        jobType: 'आपकी नौकरी का प्रकार',
        currentFund: 'मौजूदा आपातकालीन फ़ंड',
        savingCapacity: 'महीने की बचत क्षमता'
      },
      jobTypes: {
        salaried: 'नौकरी (स्थिर आय)',
        self_employed: 'व्यवसाय / खुद का काम',
        freelance: 'फ्रीलांस / गिग वर्क'
      },
      result: {
        target: 'सुझाई गई आपातकालीन राशि',
        current: 'मौजूदा फ़ंड',
        gap: 'कमी',
        surplus: 'अधिक',
        riskLevel: 'जोखिम स्तर',
        timeline: 'फ़ंड बनने में समय',
        months: 'महीने',
        plan: 'बचत शुरू करने की योजना',
        where: 'आपातकालीन फ़ंड कहाँ रखें',
        allocation: 'स्मार्ट एलोकेशन रणनीति'
      },
      risks: {
        critical: 'गंभीर जोखिम',
        high: 'उच्च जोखिम',
        medium: 'मध्यम जोखिम',
        low: 'कम जोखिम',
        safe: 'सुरक्षित'
      },
      tips: {
        savings: 'सेविंग अकाउंट (तुरंत निकासी)',
        liquid: 'लिक्विड म्यूचुअल फंड (1 दिन)',
        fd: 'स्वीप FD (ज़रूरत पर ऑटो-ब्रेक)'
      },
      warning: 'आपातकालीन फ़ंड के बिना, एक संकट आपको क़र्ज़ के जाल में धकेल सकता है',
      recommendation: 'शेयर/म्यूचुअल फंड में निवेश से पहले आपातकालीन फ़ंड बनाएँ',
      cta: 'सबसे अच्छा हाई-इंटरेस्ट सेविंग खाता खोजें',
      note: 'आपातकालीन फ़ंड = नौकरी की स्थिरता के अनुसार 6-12 महीने का खर्च। इसे निवेश से अलग रखें।'
    }
  };

  const t = copy[language];

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

  return (
    <div className="emergency-fund-calculator not-prose" style={{
      maxWidth: '720px',
      margin: '0 auto',
      background: 'var(--surface, #ffffff)',
      border: '1px solid var(--line, #e2e8f0)',
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
          <Shield size={14} /> {t.badge}
        </span>
        
        {/* Social Proof Counter */}
        <SocialProofCounter calculatorType="emergency_fund" trackUsage={true} />
        
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--ink, #0f172a)', margin: '4px 0' }}>
          {t.title}
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--muted, #64748b)', margin: '8px 0 0', lineHeight: '1.6' }}>
          {t.subtitle}
        </p>
      </div>

      {/* Input Form */}
      <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
        {/* Monthly Expense */}
        <div>
          <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--ink, #334155)', display: 'block', marginBottom: '6px' }}>
            {t.inputLabels.monthlyExpense}
          </label>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 12px', background: '#fff' }}>
            <span style={{ color: '#94a3b8', marginRight: '6px' }}>₹</span>
            <input
              type="number"
              value={monthlyExpense}
              onChange={(e) => setMonthlyExpense(Number(e.target.value))}
              min="5000"
              max="500000"
              step="1000"
              style={{ border: 'none', outline: 'none', width: '100%', fontSize: '15px', fontWeight: '600', color: 'var(--ink, #0f172a)' }}
            />
          </div>
        </div>

        {/* Family Size & Job Type */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--ink, #334155)', display: 'block', marginBottom: '6px' }}>
              {t.inputLabels.familySize}
            </label>
            <input
              type="number"
              value={familySize}
              onChange={(e) => setFamilySize(Number(e.target.value))}
              min="1"
              max="15"
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '15px', fontWeight: '600' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--ink, #334155)', display: 'block', marginBottom: '6px' }}>
              {t.inputLabels.jobType}
            </label>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
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
            <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--ink, #334155)', display: 'block', marginBottom: '6px' }}>
              {t.inputLabels.currentFund}
            </label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 12px', background: '#fff' }}>
              <span style={{ color: '#94a3b8', marginRight: '6px' }}>₹</span>
              <input
                type="number"
                value={currentFund}
                onChange={(e) => setCurrentFund(Number(e.target.value))}
                min="0"
                max="10000000"
                step="1000"
                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '15px', fontWeight: '600' }}
              />
            </div>
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--ink, #334155)', display: 'block', marginBottom: '6px' }}>
              {t.inputLabels.savingCapacity}
            </label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 12px', background: '#fff' }}>
              <span style={{ color: '#94a3b8', marginRight: '6px' }}>₹</span>
              <input
                type="number"
                value={savingCapacity}
                onChange={(e) => setSavingCapacity(Number(e.target.value))}
                min="0"
                max="200000"
                step="1000"
                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '15px', fontWeight: '600' }}
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
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>{t.result.target}</span>
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
          <AlertCircle size={20} style={{ color: risk.color }} />
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', display: 'block' }}>{t.result.riskLevel}</span>
            <span style={{ fontSize: '15px', fontWeight: '800', color: risk.color }}>{risk.level}</span>
          </div>
        </div>

        {/* Timeline */}
        {hasShortage && savingCapacity > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: 'rgba(255,255,255,0.6)', borderRadius: '8px' }}>
            <Clock size={20} style={{ color: '#3b82f6' }} />
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
            <TrendingUp size={18} /> {t.result.plan}
          </h3>
          <div style={{ display: 'grid', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} style={{ color: '#16a34a' }} />
              <span style={{ fontSize: '13px', color: '#334155' }}>
                {isHi ? `महीने ${formatMoney(savingCapacity)} बचाएँ = ${monthsToTarget} महीने में तैयार` : `Save ${formatMoney(savingCapacity)}/month = Ready in ${monthsToTarget} months`}
              </span>
            </div>
            {savingCapacity < gap / 6 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} style={{ color: '#16a34a' }} />
                <span style={{ fontSize: '13px', color: '#334155' }}>
                  {isHi ? `या ${formatMoney(Math.ceil(gap / 6))} बचाएँ = 6 महीने में तैयार` : `Or save ${formatMoney(Math.ceil(gap / 6))}/month = Ready in 6 months`}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Allocation Strategy */}
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#334155', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Wallet size={18} /> {t.result.allocation}
        </h3>
        <div style={{ display: 'grid', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', background: '#fff', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '12px', color: '#475569' }}>{t.tips.savings}</span>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#16a34a' }}>{formatMoney(allocation.instant)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', background: '#fff', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '12px', color: '#475569' }}>{t.tips.liquid}</span>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#3b82f6' }}>{formatMoney(allocation.liquid)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', background: '#fff', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '12px', color: '#475569' }}>{t.tips.fd}</span>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#8b5cf6' }}>{formatMoney(allocation.fd)}</span>
          </div>
        </div>
      </div>

      {/* Warning */}
      {hasShortage && (
        <div style={{ background: '#fef3c7', border: '1px solid #fde047', borderRadius: '8px', padding: '12px 14px', marginBottom: '16px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <AlertCircle size={18} style={{ color: '#ca8a04', flexShrink: 0, marginTop: '2px' }} />
          <p style={{ fontSize: '12px', lineHeight: '1.6', color: '#713f12', margin: 0 }}>
            <strong>{t.warning}</strong>
          </p>
        </div>
      )}

      {/* Note */}
      <p style={{ fontSize: '11px', lineHeight: '1.6', color: '#64748b', margin: '0', padding: '12px', background: '#f8fafc', borderRadius: '6px' }}>
        💡 {t.note}
      </p>
    </div>
  );
}
