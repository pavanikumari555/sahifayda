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
      share: 'Share Result'
    },
    hi: {
      download: 'PDF डाउनलोड करें',
      downloading: 'PDF बन रहा है...',
      share: 'रिजल्ट शेयर करें'
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

      // Add branding header
      pdf.setFontSize(16);
      pdf.setTextColor(22, 102, 75); // Brand color
      pdf.text('SahiFayda.com', 105, 8, { align: 'center' });
      
      pdf.setFontSize(10);
      pdf.setTextColor(100, 116, 139);
      pdf.text(isHi ? 'आपकी वित्तीय मार्गदर्शिका' : 'Your Financial Guide', 105, 13, { align: 'center' });

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

      // Add footer with timestamp
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
        pdf.text(`Generated on ${timestamp} | Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
      }

      // Save PDF
      const fileName = `${calculatorName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('PDF generation error:', error);
      alert(isHi ? 'PDF बनाने में समस्या आई। कृपया पुनः प्रयास करें।' : 'Failed to generate PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = () => {
    const text = isHi 
      ? `मैंने SahiFayda पर ${calculatorName} का उपयोग किया! अपनी वित्तीय योजना बनाएं: https://sahifayda.com`
      : `I used ${calculatorName} on SahiFayda! Plan your finances: https://sahifayda.com`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
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
        onClick={handleDownload}
        disabled={downloading}
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
        onClick={handleShare}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '12px 20px',
          background: '#ffffff',
          color: '#16664b',
          border: '2px solid #16664b',
          borderRadius: '10px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = '#f0fdf4';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = '#ffffff';
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
