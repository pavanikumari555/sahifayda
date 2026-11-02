'use client';

import { Sparkles } from 'lucide-react';

/**
 * QuickFillExamples - One-click example scenarios for calculators
 * Helps users understand how to use calculators with sample data
 * 
 * @param {array} examples - Array of example scenarios
 * @param {function} onSelectExample - Callback when example is selected
 * @param {string} language - 'en' or 'hi'
 */
export default function QuickFillExamples({ examples = [], onSelectExample, language = 'en' }) {
  const isHi = language === 'hi';

  const copy = {
    en: {
      title: 'Try Quick Examples',
      subtitle: 'Click an example to fill the form with sample figures. You can change the values afterwards.',
      fillLabel: 'Fill the form with this example'
    },
    hi: {
      title: 'उदाहरण आज़माएँ',
      subtitle: 'किसी उदाहरण पर क्लिक करें, फ़ॉर्म नमूना आँकड़ों से अपने-आप भर जाएगा। बाद में आप आँकड़े बदल सकते हैं।',
      fillLabel: 'यह उदाहरण फ़ॉर्म में भरें'
    }
  };

  const t = copy[language] || copy.en;

  if (!examples || examples.length === 0) return null;

  return (
    <div className="quick-fill-examples" style={{
      background: 'var(--soft, #f0fdf4)',
      border: '1px solid var(--border, #bbf7d0)',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '20px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '12px'
      }}>
        <Sparkles size={18} color="#16664b" style={{ flexShrink: 0 }} />
        <div>
          <h3 style={{
            fontSize: '14px',
            fontWeight: '700',
            color: 'var(--accent, #16664b)',
            margin: 0
          }}>
            {t.title}
          </h3>
          <p style={{
            fontSize: '12px',
            color: 'var(--muted, #15803d)',
            margin: '2px 0 0'
          }}>
            {t.subtitle}
          </p>
        </div>
      </div>

      {/* Example Buttons */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '10px'
      }}>
        {examples.map((example, index) => (
          <button
            key={index}
            type="button"
            aria-label={`${t.fillLabel}: ${example.label}${example.description ? ` (${example.description})` : ''}`}
            onClick={() => onSelectExample(example.values)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: '12px',
              background: 'var(--surface, #ffffff)',
              border: '2px solid var(--border, #bbf7d0)',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textAlign: 'left'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent, #16664b)';
              e.currentTarget.style.background = 'var(--soft, #f0fdf4)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(22, 102, 75, 0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'var(--border, #bbf7d0)';
              e.currentTarget.style.background = 'var(--surface, #ffffff)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span aria-hidden="true" style={{
              fontSize: '16px',
              marginBottom: '4px'
            }}>
              {example.icon}
            </span>
            <span style={{
              fontSize: '13px',
              fontWeight: '700',
              color: 'var(--ink, #0f172a)',
              marginBottom: '2px'
            }}>
              {example.label}
            </span>
            <span style={{
              fontSize: '11px',
              color: 'var(--muted, #64748b)'
            }}>
              {example.description}
            </span>
          </button>
        ))}
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          .quick-fill-examples {
            padding: 14px;
          }
        }
      `}</style>
    </div>
  );
}
