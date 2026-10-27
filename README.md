# SahiFayda local preview

Next.js static-export website with English (`/`) and Hindi (`/hi/`) interfaces.

## Run

Use Node 24 and `npm ci`, copy `.env.example` to `.env.local`, configure the Supabase URL and **publishable** key, then run `npm run dev -- --port 3100`. Open http://127.0.0.1:3100/.

- `npm test`: financial calculation checks, including decimal handling, invalid input and the lower-EMI/higher-total example.
- `npm run build`: static export into `out/`.
- `/marketing-preview.html`: six bilingual social design concepts. Drafts only, not publishing-ready image/video exports.

## Implemented

- Responsive homepage, separate English/Hindi URLs and matching navigation.
- Monthly approximate budget review and two-quote total-payment comparison.
- General payment next-step guide, privacy and transparent setup summaries.
- Public Supabase service-availability reads; calculators check status before calculation, guidance before display. Failure does not silently assume the service is active.
- Input numbers remain in browser memory; no personal financial records are stored or sent to AI.
- Dialog keyboard focus, Escape close, visible focus styles and basic validation.
- Remote `service_status` table with RLS and public reads. Writes require an active authorised admin session; anonymous and ordinary authenticated users cannot change settings. Bootstrap and admin migration sources are retained in `database/`.
- `/admin` username/password login, owner/manager permissions, tool availability controls, account settings and audit history. See ADMIN-SETUP.md for operating notes and remaining email-recovery verification.

## Not implemented yet

Guide CMS, SIA job runner, reward/card-product rules, referral tracking, marketing API integration, saving user reports and live deployment. Owner login acceptance awaits the user's sign-in; recovery email delivery and a dedicated forgotten-password flow still need setup/testing. SIA is paused in database status and no AI provider has been called.

Public keys identify the project; RLS and grants enforce permissions. Never use a secret/service-role key in frontend code. No website deployment should occur until the user reviews the local version and requests release.

## Marketing routing

Instagram + Facebook Page through Buffer; Telegram direct. Buffer's current official help excludes WhatsApp and Telegram. WhatsApp Channel is manual until an authorized supported publishing method is verified. No channels, bot, schedule, campaigns or outbound posts are active. See the current chat's saved marketing plan for templates and editorial rules.

## Secure build and launch configuration

`npm run build` exports into `out/`, generates hash-based CSP and Cloudflare Pages `_headers`, and verifies the exported artifact. `npm run preview:secure` (or `npm start`) serves that artifact on loopback port 3102 with the generated headers. Dev mode on port 3100 is for editing and does not enforce the production CSP.

Previews default to noindex. For a user-approved release only, set `SAHIFAYDA_INDEXABLE=true` and `SAHIFAYDA_PUBLIC_SITE_URL` to the real chosen HTTPS origin, then rebuild and verify the actual release metadata/headers before deployment. Never enable indexing for staging or the marketing design board. Cloudflare Functions/Workers, if later added, need their own response-header handling.

Home now exposes all three working tools immediately. SIA is a visible preset tool guide, explicitly not connected to live AI. See SECURITY-REVIEW.md for verified scope and launch work still pending.
