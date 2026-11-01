import './globals.css';
import './redesign.css';
import { siteConfig } from '../lib/site-config.mjs';

export const viewport = { themeColor: '#16664b' };

export const metadata = {
  metadataBase: new URL('https://sahifayda.pages.dev'),
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, title: 'SahiFayda', statusBarStyle: 'default' },
  icons: { apple: '/icons/apple-touch-icon.png' },
  title: 'SahiFayda — Make your everyday money make sense | Smart Indian Financial & Scheme Guide',
  description: 'Understand your monthly budget, compare purchase quotes, and find practical guidance on Indian government welfare schemes, loans, and savings. In English and Hindi.',
  robots: { index: siteConfig().indexable, follow: true },
  openGraph: {
    title: 'SahiFayda — Make your everyday money make sense',
    description: 'Practical financial guidance, government welfare schemes, and budgeting tools for Indian consumers in English and Hindi.',
    url: 'https://sahifayda.pages.dev',
    siteName: 'SahiFayda',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SahiFayda — Smart Money & Welfare Guidance for India',
    description: 'Everyday budgeting, loan EMI comparisons, and verified Indian scheme insights in English and Hindi.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://sahifayda.pages.dev/#organization',
      name: 'SahiFayda',
      url: 'https://sahifayda.pages.dev',
      logo: 'https://sahifayda.pages.dev/icons/apple-touch-icon.png',
      description: 'Independent, transparent Indian personal finance guidance, everyday welfare scheme information, and consumer budgeting tools.',
      sameAs: ['https://sahifayda.pages.dev']
    },
    {
      '@type': 'WebSite',
      '@id': 'https://sahifayda.pages.dev/#website',
      url: 'https://sahifayda.pages.dev',
      name: 'SahiFayda',
      publisher: {
        '@id': 'https://sahifayda.pages.dev/#organization'
      },
      inLanguage: ['en-IN', 'hi-IN']
    },
    {
      '@type': 'Person',
      '@id': 'https://sahifayda.pages.dev/#author',
      name: 'Pavani Kumari',
      jobTitle: 'Founder & Lead Financial Welfare Researcher',
      description: 'Founder and researcher at SahiFayda. Specializes in Indian government welfare schemes, consumer financial protection, budgeting tools, and subsidy calculations.',
      url: 'https://sahifayda.pages.dev',
      knowsAbout: [
        'Indian Government Welfare Schemes & Subsidies',
        'Personal Budgeting & Household Finance (INR / ₹)',
        'Loan EMI & Purchase Quote Comparisons',
        'Consumer Financial Rights & Education'
      ],
      worksFor: {
        '@id': 'https://sahifayda.pages.dev/#organization'
      }
    }
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('sahifayda-theme');document.documentElement.dataset.theme=t==='dark'?'dark':'light';document.documentElement.style.colorScheme=t==='dark'?'dark':'light'}catch(e){}"
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}