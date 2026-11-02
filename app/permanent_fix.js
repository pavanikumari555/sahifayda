const fs = require('fs');
const path = require('path');

console.log("=== Applying Permanent Static Sitemap & Robots Fix ===");

// 1. Remove problematic dynamic JS routes from app/
if (fs.existsSync('app/sitemap.js')) {
  fs.unlinkSync('app/sitemap.js');
  console.log("[1/3] ✓ Removed dynamic app/sitemap.js");
}
if (fs.existsSync('app/robots.js')) {
  fs.unlinkSync('app/robots.js');
  console.log("[1/3] ✓ Removed dynamic app/robots.js");
}

// 2. Ensure public folder exists
if (!fs.existsSync('public')) {
  fs.mkdirSync('public', { recursive: true });
}

// 3. Create static public/sitemap.xml
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://sahifayda.pages.dev/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="en-IN" href="https://sahifayda.pages.dev/" />
    <xhtml:link rel="alternate" hreflang="hi-IN" href="https://sahifayda.pages.dev/hi" />
  </url>
  <url>
    <loc>https://sahifayda.pages.dev/hi</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="en-IN" href="https://sahifayda.pages.dev/" />
    <xhtml:link rel="alternate" hreflang="hi-IN" href="https://sahifayda.pages.dev/hi" />
  </url>
  <url>
    <loc>https://sahifayda.pages.dev/card-offers</loc>
    <changefreq>daily</changefreq>
    <priority>0.95</priority>
  </url>
  <url>
    <loc>https://sahifayda.pages.dev/debt-trap-calculator</loc>
    <changefreq>daily</changefreq>
    <priority>0.95</priority>
  </url>
  <url>
    <loc>https://sahifayda.pages.dev/student-credit-cards</loc>
    <changefreq>daily</changefreq>
    <priority>0.95</priority>
  </url>
  <url>
    <loc>https://sahifayda.pages.dev/guides</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://sahifayda.pages.dev/hi/guides</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://sahifayda.pages.dev/products</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://sahifayda.pages.dev/hi/products</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>
`;

fs.writeFileSync('public/sitemap.xml', sitemapXml, 'utf8');
console.log("[2/3] ✓ Created static public/sitemap.xml (All 3 tools + English/Hindi)");

// 4. Create static public/robots.txt
const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://sahifayda.pages.dev/sitemap.xml
`;

fs.writeFileSync('public/robots.txt', robotsTxt, 'utf8');
console.log("[3/3] ✓ Created static public/robots.txt");

console.log("\n=== Permanent Fix Applied! Zero dynamic routes to fail on. ===");