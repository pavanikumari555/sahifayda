'use client';

import { Sparkles } from 'lucide-react';

/**
 * QuickFillExamples - One-click example scenarios for calculators
 * Helps users understand how to use calculators with realistic data
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
      subtitle: 'Click to auto-fill calculator with sample data'
    },
    hi: {
      title: 'उदाहरण देखें',
      subtitle: 'क्लिक करें और फॉर्म अपने आप भर जाएगा'
    }
  };

  const t = copy[language] || copy.en;

  if (!examples || examples.length === 0) return null;

  return (
    <div className="quick-fill-examples" style={{
      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
      border: '1px solid #bbf7d0',
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
        <Sparkles size={18} color="#16664b" />
        <div>
          <h3 style={{
            fontSize: '14px',
            fontWeight: '700',
            color: '#16664b',
            margin: 0
          }}>
            {t.title}
          </h3>
          <p style={{
            fontSize: '12px',
            color: '#15803d',
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
            onClick={() => onSelectExample(example.values)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: '12px',
              background: '#ffffff',
              border: '2px solid #bbf7d0',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textAlign: 'left'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#16664b';
              e.currentTarget.style.background = '#f0fdf4';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(22, 102, 75, 0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#bbf7d0';
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span style={{
              fontSize: '16px',
              marginBottom: '4px'
            }}>
              {example.icon}
            </span>
            <span style={{
              fontSize: '13px',
              fontWeight: '700',
              color: '#0f172a',
              marginBottom: '2px'
            }}>
              {example.label}
            </span>
            <span style={{
              fontSize: '11px',
              color: '#64748b'
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
