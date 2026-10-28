# SahiFayda

Bilingual Next.js static-export website with monthly budgeting, purchase/EMI comparison, payment guidance, and SIA explanations of six reviewed topics. Calculator inputs remain in browser memory. Sending a SIA message shares the written question and recent conversation with the AI provider; personal conversations are not stored in the application database or shared answer cache.

## Local use

Use Node 24 and npm ci. Copy .env.example to .env.local and configure the Supabase URL and publishable key. Never put a secret or service-role key in a NEXT_PUBLIC variable.

- npm run dev -- --port 3100: development.
- npm test: calculation, authorization, recovery, routing, privacy and source-monitor tests.
- npm run build: static export, security headers and export verification.
- npm start: serve out/ on loopback port 3102 with generated headers; set PORT=3100 to use the other approved local origin.

The secure preview reloads header rules after rebuilds. Local admin and SIA origins allow 127.0.0.1/localhost ports 3100 and 3102; arbitrary QA ports do not get API access.

## Implemented and verified

- English/Hindi responsive home, three tools and six educational guide pages.
- Owner/manager admin, in-memory sessions, service controls, recovery flow, audit history, reviewed commercial catalogue and aggregate partner reports. Current owner login and email-delivery acceptance still require the user.
- Groq-first SIA, Gemini fallback, bounded requests, general-topic cache and preset guide fallback. Fresh provider health passed for both on 28 October 2026; fresh/cached Hindi Groq answers were verified through the actual frontend. This is not unrestricted personal chat or autonomous financial action.
- SIA bottom text composer with an adjacent microphone and Send button. Speech becomes editable text and is not auto-sent. Synthetic dictation, editing, manual send and denial fallback were checked; physical microphone acceptance still requires the user’s browser/device.
- Online app-install manifest, icons, install prompt and platform instructions. No offline caching. Actual OS installation remains a device check.
- Private source-review queue, daily bounded source monitor and daily marketing drafts. Monitor errors/robots blocks are visible and do not alter product rules. No automatic public financial publishing.
- Marketing preview/download with explicit font loading. 720 renderer combinations ran without rendering errors; Hindi/English samples visually inspected and a real component PNG download checked with synthetic data.
- 36 tests and the secured 14-page production build passed at the last recorded verification. See CONTINUE-HERE.md and RELEASE-CHECKLIST.md for current status.

## Release

Cloudflare Pages direct upload was authorized on 28 October 2026. No custom domain has been purchased. Pages OAuth was authorized and the site is deployed at https://sahifayda.pages.dev/ (deployment 818eb7b0). The public preview remains noindex pending owner/device acceptance.

Preview builds default to noindex. After the exact owned HTTPS origin is confirmed, configure SAHIFAYDA_PUBLIC_SITE_URL, explicitly choose whether indexing is ready, rebuild, verify, and deploy out/. Configure the exact backend allowed origin and Auth return URLs before claiming public SIA/admin ready. No wildcard Pages-origin access is intended.

Real partner offers require actual partner permission, current official terms and genuine URLs. The catalogue currently contains no real offers. No social publishing connection, conversion webhook, saved personal spending reports or custom domain is claimed. Public Cloudflare preview deployment succeeded.

On this Windows machine, Application Control blocks native SWC. A verified temporary build fallback uses official @next/swc-wasm-nodejs@16.4.3, NEXT_TEST_WASM_DIR pointing to its absolute directory, NEXT_TEST_WASM=1, and next build --webpack, followed by scripts/secure-export.mjs and scripts/verify-export.mjs. No Windows security protection was changed. Use normal native builds on a compatible unrestricted machine.
