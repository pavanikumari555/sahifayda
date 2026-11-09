import './globals.css';
import './redesign.css';
import { siteConfig } from '../lib/site-config.mjs';

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6f8fb' },
    { media: '(prefers-color-scheme: dark)', color: '#071224' },
  ],
};

const description = 'Compare savings accounts, credit cards, loans, demat and insurance in simple Hindi and English. Free calculators and SIA, a money helper that answers in your language.';

export const metadata = {
  metadataBase: new URL(siteConfig().origin || 'https://sahifayda.pages.dev'),
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, title: 'SahiFayda', statusBarStyle: 'default' },
  icons: {
    icon: [{ url: '/brand/favicon-48.png', sizes: '48x48', type: 'image/png' }, { url: '/icons/app-192.png', sizes: '192x192', type: 'image/png' }],
    apple: '/icons/apple-touch-icon.png',
  },
  title: 'SahiFayda — Money decisions, made simple',
  description,
  robots: { index: siteConfig().indexable, follow: true },
  openGraph: {
    title: 'SahiFayda — Money decisions, made simple',
    description,
    siteName: 'SahiFayda',
    locale: 'en_IN',
    type: 'website',
    images: [{ url: '/brand/sahifayda-og.png', width: 1200, height: 630, alt: 'SahiFayda' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SahiFayda — Money decisions, made simple',
    description,
    images: ['/brand/sahifayda-og.png'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': '#organization',
      name: 'SahiFayda',
      logo: '/icons/app-512.png',
      description: 'Plain-language information and free calculators for everyday personal finance decisions in India, in Hindi and English.',
    },
    {
      '@type': 'WebSite',
      '@id': '#website',
      name: 'SahiFayda',
      publisher: { '@id': '#organization' },
      inLanguage: ['en-IN', 'hi-IN'],
    },
  ],
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
