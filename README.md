# SahiFayda

Current release: SIA automatically infers reply language from user messages, including switching languages in one conversation; there is no speaking-language selector. Dictation previews directly in the composer. 99 tests pass. Frontend 37b30a5c and sia-guide v25 are published; see CONTINUE-HERE.md for verification, browser recognition limits and remaining device checks.

Bilingual Next.js static-export website with monthly budgeting, purchase/EMI comparison, payment guidance, nine bilingual guide topics and an eleven-product reviewed library. Calculator inputs remain in browser memory. Reviewed SIA replies run locally; other questions and bounded recent conversation go to the AI provider. Personal conversations are not stored in the application database or shared answer cache.

## Local use

Use Node 24 and npm ci. Copy .env.example to .env.local and configure the Supabase URL and publishable key. Never put a secret or service-role key in a NEXT_PUBLIC variable.

- npm run dev -- --port 3100: development.
- npm test: calculation, authorization, recovery, routing, privacy and source-monitor tests.
- npm run build: static export, security headers and export verification.
- npm start: serve out/ on loopback port 3102 with generated headers; set PORT=3100 to use the other approved local origin.

The secure preview reloads header rules after rebuilds. Local admin and SIA origins allow 127.0.0.1/localhost ports 3100 and 3102; arbitrary QA ports do not get API access.

## Implemented and verified

- English/Hindi responsive home, three tools, eighteen article pages, two guide directories and bilingual product browsing/comparison.
- Owner/manager admin, in-memory sessions, service controls, recovery flow, audit history, reviewed commercial catalogue and aggregate partner reports. Current owner login and email-delivery acceptance still require the user.
- Groq-first SIA, Gemini fallback, bounded requests, general-topic cache and preset guide fallback. Fresh provider health passed for both on 28 October 2026; fresh/cached Hindi Groq answers were verified through the actual frontend. This is not unrestricted personal chat or autonomous financial action.
- SIA bottom text composer with an adjacent microphone and Send button. Speech becomes editable text and is not auto-sent. Synthetic dictation, editing, manual send and denial fallback were checked; physical microphone acceptance still requires the user’s browser/device.
- Online app-install manifest, icons, install prompt and platform instructions. No offline caching. Actual OS installation remains a device check.
- Private source-review queue, daily bounded source monitor and daily marketing drafts. On 29 October, the two bank sources successfully established baselines after a bounded-read fix. NPCI remains robots-blocked; alerts do not alter product rules. No automatic public financial publishing.
- Marketing preview/download with explicit font loading. 720 renderer combinations ran without rendering errors; Hindi/English samples visually inspected and a real component PNG download checked with synthetic data.
- 85 tests pass as of 29 October 2026. The latest published frontend passed a secured 36-page build and live HTTP/CSP checks; the subsequent monitor-only change needs no frontend rebuild. See CONTINUE-HERE.md and RELEASE-CHECKLIST.md for current status.

## Release

Cloudflare Pages direct upload was authorized. No custom domain has been purchased. The site is deployed at https://sahifayda.pages.dev/ (latest frontend deployment 371ed210, 29 October 2026). The public preview remains noindex pending owner/device acceptance.

Preview builds default to noindex. After the exact owned HTTPS origin is confirmed, configure SAHIFAYDA_PUBLIC_SITE_URL, explicitly choose whether indexing is ready, rebuild, verify, and deploy out/. Configure the exact backend allowed origin and Auth return URLs before claiming public SIA/admin ready. No wildcard Pages-origin access is intended.

Real partner offers require actual partner permission, current official terms and genuine URLs. Two genuine approved referral links are present: Angel One and Kotak811, each mapped to its exact reviewed product. Other products are informational unless a matching approved link exists. No social publishing connection, conversion webhook, saved personal spending reports or custom domain is claimed.

On this Windows machine, Application Control blocks native SWC. A verified temporary build fallback uses official @next/swc-wasm-nodejs@16.4.3, NEXT_TEST_WASM_DIR pointing to its absolute directory, NEXT_TEST_WASM=1, and next build --webpack, followed by scripts/secure-export.mjs and scripts/verify-export.mjs. No Windows security protection was changed. Use normal native builds on a compatible unrestricted machine.

Guest chat quotas use an anonymous tab-session ID to avoid sharing one connection bucket across users/tests. This is a fairness measure, not authentication. The transactional global budget guard is unchanged. Refresh existing open pages after the client-ID rollout.

## Current official-data refresh
The finance-refresh worker checks ten fixed official sources daily at 10:10 IST using the existing private job token. Supported published rates/fees/amount conditions for two personal-loan schemes and one business-loan scheme update finance_knowledge automatically; unsupported fields are not invented. Source failures set review_due and fresh ranking excludes failed or older-than-48-hour observations. Other categories currently show official-source snapshots alongside dated guides; this does not silently rewrite every historical catalog fee. Public readers and SIA use the same records. See CONTINUE-HERE.md for exact coverage and remaining owner/device acceptance.
