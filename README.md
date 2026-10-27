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
- Remote initial `service_status` table with RLS, explicit public read grant and no client write privileges. Bootstrap SQL is retained in `database/bootstrap.sql`; the migration was applied through Supabase MCP.

## Not implemented yet

Secure owner/admin login, editable service settings, audit history, guide CMS, SIA job runner, reward/card-product rules, referral tracking, marketing API integration, saving user reports and live deployment. A setup summary is not an admin console. SIA is paused in database status and no AI provider has been called.

Public keys identify the project; RLS and grants enforce permissions. Never use a secret/service-role key in frontend code. No website deployment should occur until the user reviews the local version and requests release.

## Marketing routing

Instagram + Facebook Page through Buffer; Telegram direct. Buffer's current official help excludes WhatsApp and Telegram. WhatsApp Channel is manual until an authorized supported publishing method is verified. No channels, bot, schedule, campaigns or outbound posts are active. See the current chat's saved marketing plan for templates and editorial rules.
