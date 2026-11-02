'use client';

import { useState } from 'react';
import { Download, Share2 } from 'lucide-react';

/**
 * PDFDownloadButton - Download calculator results as PDF
 * Works with jsPDF and html2canvas for beautiful PDFs
 * 
 * @param {string} calculatorName - Name for the PDF file
 * @param {string} resultElementId - ID of element to capture
 * @param {object} language - 'en' or 'hi'
 */
export default function PDFDownloadButton({ calculatorName = 'calculator', resultElementId = 'calculator-results', language = 'en' }) {
  const [downloading, setDownloading] = useState(false);
  const isHi = language === 'hi';

  const copy = {
    en: {
      download: 'Download PDF',
      downloading: 'Generating PDF...',
      share: 'Share Result',
      downloadLabel: 'Download these results as a PDF',
      shareLabel: 'Share this calculator on WhatsApp'
    },
    hi: {
      download: 'PDF डाउनलोड करें',
      downloading: 'PDF बन रहा है...',
      share: 'नतीजा शेयर करें',
      downloadLabel: 'ये नतीजे PDF के रूप में डाउनलोड करें',
      shareLabel: 'यह कैलकुलेटर WhatsApp पर शेयर करें'
    }
  };

  const t = copy[language] || copy.en;

  const handleDownload = async () => {
    setDownloading(true);
    
    try {
      // Dynamic imports to reduce bundle size
      const jsPDF = (await import('jspdf')).default;
      const html2canvas = (await import('html2canvas')).default;
      
      const element = document.getElementById(resultElementId);
      if (!element) {
        console.error('Result element not found');
        setDownloading(false);
        return;
      }

      // Capture element as canvas
      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      // Convert to PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 190; // A4 width minus margins
      const pageHeight = 277; // A4 height
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;

      // Text drawn by jsPDF stays in English: its built-in fonts cannot render
      // Devanagari. Hindi page content is included through the captured image.
      pdf.setFontSize(16);
      pdf.setTextColor(22, 102, 75); // Brand color
      pdf.text('SahiFayda', 105, 8, { align: 'center' });
      
      pdf.setFontSize(10);
      pdf.setTextColor(100, 116, 139);
      pdf.text('Estimate for learning, not financial advice', 105, 13, { align: 'center' });

      // Add main content
      pdf.addImage(imgData, 'PNG', 10, 20, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add multiple pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Add footer with timestamp and disclaimer
      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(148, 163, 184);
        const timestamp = new Date().toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
        pdf.text('This is an estimate, not financial advice. Check actual charges and rates with the provider.', 105, 286, { align: 'center' });
        pdf.text(`Generated on ${timestamp} | Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
      }

      // Save PDF
      const fileName = `${calculatorName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('PDF generation error:', error);
      alert(isHi ? 'PDF बनाने में समस्या आई। कृपया दोबारा कोशिश करें।' : 'Failed to generate PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = () => {
    const pageUrl = window.location.href;
    const text = isHi 
      ? `मैंने SahiFayda पर ${calculatorName} कैलकुलेटर इस्तेमाल किया। आप भी अपने आँकड़े डालकर देखें: ${pageUrl}`
      : `I used the ${calculatorName} calculator on SahiFayda. Try your own numbers: ${pageUrl}`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="pdf-download-actions" style={{
      display: 'flex',
      gap: '12px',
      marginTop: '20px',
      flexWrap: 'wrap'
    }}>
      {/* Download PDF Button */}
      <button
        type="button"
        onClick={handleDownload}
        disabled={downloading}
        aria-busy={downloading}
        title={t.downloadLabel}
        style={{
          flex: 1,
          minWidth: '160px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '12px 20px',
          background: downloading ? '#94a3b8' : 'linear-gradient(135deg, #16664b 0%, #0d4d38 100%)',
          color: '#ffffff',
          border: 'none',
          borderRadius: '10px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: downloading ? 'not-allowed' : 'pointer',
          boxShadow: '0 4px 12px rgba(22, 102, 75, 0.3)',
          transition: 'all 0.3s ease',
          opacity: downloading ? 0.7 : 1
        }}
        onMouseOver={(e) => {
          if (!downloading) {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(22, 102, 75, 0.4)';
          }
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(22, 102, 75, 0.3)';
        }}
      >
        <Download size={18} />
        <span>{downloading ? t.downloading : t.download}</span>
      </button>

      {/* Share Button */}
      <button
        type="button"
        onClick={handleShare}
        title={t.shareLabel}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '12px 20px',
          background: 'var(--surface, #ffffff)',
          color: 'var(--accent, #16664b)',
          border: '2px solid var(--accent, #16664b)',
          borderRadius: '10px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = 'var(--soft, #f0fdf4)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'var(--surface, #ffffff)';
        }}
      >
        <Share2 size={18} />
        <span>{t.share}</span>
      </button>

      <style jsx>{`
        @media (max-width: 640px) {
          .pdf-download-actions {
            flex-direction: column;
          }
          .pdf-download-actions button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
