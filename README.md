# SahiFayda

Hindi/English static Next.js site for everyday money decisions in India. Six tools: rent vs buy, minimum due vs EMI, emergency fund, car vs cab, first FD credit card finder, cashback vs instant discount. Every tool has a dedicated English and Hindi page with methodology, examples, limitations and related guides.

## Local commands

Use Node 24, then npm ci. Set the public Supabase URL and publishable key in .env (never service-role or secret keys).

- npm test: financial regression, rendered calculator pages, source review, conversation, auth and privacy checks.
- npm run build: Next static export, security headers and full export verification.
- npm run dev -- --port 3100: local development.
- npm start: secure static preview on http://127.0.0.1:3102.

## Search launch

The owner approved public search launch on 10 November 2026 at https://sahifayda.pages.dev. Default public builds are indexable on that canonical origin. SAHIFAYDA_PUBLIC_SITE_URL can specify a future confirmed HTTPS origin. SAHIFAYDA_INDEXABLE=false explicitly pauses indexing; set true for the production launch. Non-main CF_PAGES_BRANCH builds always stay noindex, including when an environment variable says true. Local previews should use false. Admin/recovery and marketing preview remain noindex and outside the sitemap.

The build generates sitemap.xml, robots.txt, per-page CSP headers, security-build.json and a public release.json marker. Indexing is permission to be indexed, not a guarantee that Google will index or rank a page. Search Console ownership, sitemap submission and real field-performance data need the owner's service access. No fabricated traffic or reviewer credentials.

## Data and limits

Calculators run in browser memory. Editable examples are not bank quotes or guaranteed returns. The FD finder contains a limited source-reviewed snapshot with an expiry gate; it is not approval or whole-market coverage. The shopping tool uses entered offer terms and separates upfront price from later cashback. Commercial applications still require approved exact-product links, independent of ranking.

Existing SIA, backend catalogue, owner-only admin and consented support workflow are preserved. This frontend release does not claim a new Supabase deployment or an automatically refreshed bank feed. Provider terms, coverage, review dates and privacy limits remain visible. See PRODUCT-REQUIREMENTS.md and CONTINUE-HERE.md.

## Publishing

Git operations must use mukeshs555 on the existing origin repository. scripts/publish-fixes.ps1 verifies identity, fetches and checks concurrent changes, runs tests/build/security checks, stages only reviewed files, commits and performs a normal push. It uploads the verified export to the existing Cloudflare Pages project using Wrangler, then checks the stable Cloudflare site for this release, public indexing and the new bilingual shopping routes. It never force-pushes or equates push success to deployment success.

Restricted agent sessions may deny .git writes, DNS and child-process directory creation even when the owner's normal PowerShell works. In that case the script can be run from the owner's PowerShell; it aborts on failed tests/build or unexpected tracked edits. No Windows security changes are required. Unrelated work/ files are not published.

If Git push already succeeded and the current export passed verification, run the publish script with -DeployOnly to upload that export without another build or Git push. The script verifies the existing project/domain first and reports actual live HTTP errors.
