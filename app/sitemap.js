export default function sitemap() {
  const baseUrl = 'https://sahifayda.pages.dev';
  const now = new Date();

  const routes = [\n    { path: \x27/student-credit-cards\x27, priority: 0.95, freq: \x27daily\x27 },
    { path: '/debt-trap-calculator', priority: 0.95, freq: 'daily' },
    { path: '', priority: 1.0, freq: 'daily' },
    { path: '/hi', priority: 1.0, freq: 'daily' },
    { path: '/guides', priority: 0.9, freq: 'weekly' },
    { path: '/hi/guides', priority: 0.9, freq: 'weekly' },
    { path: '/products', priority: 0.9, freq: 'weekly' },
    { path: '/hi/products', priority: 0.9, freq: 'weekly' },
  ];

  return routes.map((r) => ({
    url: `${baseUrl}${r.path}`,
    lastModified: now,
    changeFrequency: r.freq,
    priority: r.priority,
    alternates: {
      languages: {
        'en-IN': `${baseUrl}${r.path.replace('/hi', '') || '/'}`,
        'hi-IN': `${baseUrl}/hi${r.path.replace('/hi', '')}`,
      },
    },
  }));
}
