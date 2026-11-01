export default function HomeFaqSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': 'https://sahifayda.pages.dev/#app',
        name: 'SahiFayda - Smart Money & Scheme Advisor',
        url: 'https://sahifayda.pages.dev',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'All',
        inLanguage: ['en-IN', 'hi-IN'],
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'INR',
        },
        featureList: [
          'Budgeting and Everyday Expense Planning',
          'Loan EMI & Purchase Quote Comparisons',
          'Government Welfare Scheme and Subsidy Guidance',
          'Voice-Assisted Financial Advice (SIA)',
          '100% Client-Side Privacy without Forced Sign-up',
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://sahifayda.pages.dev/#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is SahiFayda and how does it help Indian households?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'SahiFayda is a free, transparent personal finance and welfare advisory platform for India. It helps users plan monthly budgets, compare loan repayment quotes, understand government welfare schemes, and optimize savings in both English and Hindi.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is SahiFayda free to use?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, SahiFayda is 100% free with no hidden fees, subscriptions, or forced account registrations. Calculations and comparisons run directly in your browser with full privacy.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I access SahiFayda in Hindi?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, SahiFayda offers complete bilingual support. You can switch seamlessly between English and Hindi (/hi) across all guides, tools, and SIA advisor interactions.',
            },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
