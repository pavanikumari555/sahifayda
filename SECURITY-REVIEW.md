> Historical baseline review. Current implementation and verification are in CONTINUE-HERE.md and RELEASE-CHECKLIST.md. Live SIA/admin have since been implemented, and Cloudflare publication was authorized on 28 October 2026. Earlier claims below describe the original review, not current deployment status.

# SahiFayda — security, SEO and task-first home

Review date: 27 October 2026. This is a review of the current small static application, not a penetration-testing certification or guarantee against compromise/ranking changes.

## What changed

- A task-first homepage now presents the three working tools and SIA guide directly. The tool directory opens in one click. Tool labels explain their purpose. Compact screens prioritise the choices over descriptive copy and decorative budget artwork.
- A visible SIA button appears in the header and floating corner. It opens preset guide choices leading to real tools. This is explicitly **guide mode**; live AI, automation, bank access and external actions remain disconnected. No private user inputs are sent to an AI provider.
- Exported pages now receive a generated Content Security Policy with SHA-256 hashes for the exact trusted inline build scripts. Arbitrary inline event handlers and eval are not enabled. External connections are limited to the application's own origin and the exact Supabase project; Google Fonts is allowed only for fonts/styles.
- Clickjacking protection, MIME sniffing protection, strict-origin referrer policy, restricted browser permissions and same-origin opener policy are included. HTTPS hosts receive HSTS without a blanket includeSubDomains/preload commitment.
- Inline styles remain allowed because React, charts, fonts and the theme need them in this static version. This is an explicit compatibility trade-off, not a claim of a completely strict style policy.
- Browser production source maps are disabled. Build checks reject obvious secret-like tokens, environment files, source maps and inline event handlers in the export. The frontend uses only the publishable Supabase key.
- Tool IDs, configured API origin and remote status payloads are validated. A malformed/unavailable status cannot silently activate a tool. React renders provider messages as text rather than HTML.
- Build verification ensures the latest actual exported directory is secured; old output cannot be mistaken for the current build. The current Next.js export configuration writes the final site into `out/`.

## Database checks (existing protections verified)

- Supabase project: xkkmjuqziqrpggtgxlxc.
- Security advisor: no reported lints at this review.
- Public `service_status` table has RLS enabled.
- `anon` and `authenticated` roles have SELECT only; no client UPDATE privilege.
- Anonymous INSERT, UPDATE and DELETE privileges were explicitly checked and are false.
- A PATCH against a deliberately nonexistent probe ID was denied with HTTP 401; no real service row was changed.
- No personal spending/history table, public uploads, writable CMS, admin mutations or open AI endpoint exists in this version. Those features require their own authorization, rate-limit, abuse and storage review when added.

## SEO protections without blocking ordinary visitors

- Previews remain noindex. Crawling stays allowed so a crawler can read the noindex directive; robots.txt is not used as a substitute for access control.
- Only an explicit `SAHIFAYDA_INDEXABLE=true` plus a validated, owner-selected HTTPS public origin can generate an indexable release.
- The release configuration provides separate English/Hindi canonical URLs, reciprocal language alternatives and a two-page sitemap. The real domain is not selected/purchased yet; no release indexing has been activated.
- The marketing design board always has noindex metadata and response headers, including during a later indexable build.
- Nonexistent routes return 404 in the static preview rather than showing the homepage as a soft 404.
- Hashed static assets get long immutable caching. Public pages are static HTML; no CAPTCHA, login gate, blanket country/IP block or crawler block was added to ordinary tools.
- Canonical links, sitemap and good security reduce avoidable technical problems; they cannot stop competitors, scraping or all third-party SEO attacks, and cannot guarantee rankings.

## Evidence

- npm audit: 0 reported vulnerabilities across the checked dependency tree. npm outdated returned no newer versions at this review. This is point-in-time, not permanent protection.
- Six calculation/configuration/security tests passed.
- Latest static build, CSP hash check, secret-like token/export scan and default noindex checks passed.
- Local secured English and Hindi pages returned HTTP 200 with CSP, DENY frame policy, nosniff and preview noindex response headers.
- A nonexistent page and a dotfile request returned HTTP 404.
- Browser verification: SIA guide opens, preset actions lead to tools, theme and calculators tested with CSP active. No browser console errors were reported in the checked flows. All four home choices fit within a 390×844 phone viewport, with no horizontal overflow. Theme persisted across refresh and exported Hindi document language is hi.

## Where enforcement happens

- Development UI preview: http://127.0.0.1:3100/ . Production CSP is deliberately not forced onto the Next.js debugger.
- Secured built preview: http://127.0.0.1:3102/ . The loopback-only preview server applies the generated `out/_headers` rules for QA; it is not an Internet production server.
- Future Cloudflare Pages static hosting will enforce `out/_headers` after deployment. Headers in a file are not active edge protections before deployment. Future Worker/Function responses must implement equivalent headers in their own code.

## Pending until an approved launch/account action

1. Actual Cloudflare project/zone, custom domain and HTTPS configuration. WAF/DDoS/bot options and route-specific limits must be verified on the real selected plan; no paid upgrade or account-wide rules were enabled.
2. Owner-controlled MFA/recovery for GitHub, Cloudflare, Supabase and the registrar; no account security settings were silently changed.
3. Secure owner/admin authentication, audited service controls and live SIA require implementation and fresh security verification. The guide is not an authenticated admin or autonomous AI agent.
4. Real-domain canonical/indexability build verification, redirect choice and Search Console ownership/sitemap submission. No live website or domain has been deployed or registered.
5. GitHub vulnerability alerts and Dependabot security-update pull requests are enabled for this repository; the API returned enabled=true, paused=false. No automatic merging or paid scanner was enabled. Separate uptime/SEO/abuse monitoring is not configured.

Sources reviewed: [Cloudflare Pages headers](https://developers.cloudflare.com/pages/configuration/headers/), [Google noindex documentation](https://developers.google.com/search/docs/crawling-indexing/block-indexing), [Google canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), bundled current Next.js CSP/static-export/metadata docs and the connected Supabase advisors/permissions tools.

