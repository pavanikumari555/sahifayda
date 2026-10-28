# Release checklist — 28 October 2026

## Cloudflare public preview — completed
- User approved publishing and authorized narrow Pages OAuth in their own browser.
- Created owned project sahifayda. Stable URL: https://sahifayda.pages.dev/ . Deployment URL: https://818eb7b0.sahifayda.pages.dev/ . Branch main.
- Uploaded only out/ assets and _headers with official Wrangler direct upload. No source repository, internal notes, environment files or credentials uploaded.
- Final 14-page production build/export checks passed; 30 local tests passed.
- Backend exact-origin configuration deployed: sia-guide v7, admin-console v8, partner-click v2. Trusted-origin OPTIONS returned 204; an attacker-suffixed origin returned 403 for all three. Unauthenticated dashboard stayed 401.
- Public HTTPS checks returned 200 for English/Hindi homes, both sampled guides, manifest, icons and private-route shells. Unknown route returned 404. Manifest MIME/no-cache and admin/recovery no-store verified on real Cloudflare responses.
- Corrected permissions header concatenation: public home microphone=(self), admin/guide microphone=(), camera/geolocation/payment/usb denied without conflicting directives. Verified real hosted response headers.
- Public Hindi SIA returned a cached Groq answer through the browser with no console error. English budget sample acceptance is recorded in CONTINUE-HERE.md.

## Still requires owner/device/provider acceptance
- Sign in to the real owner admin on the live origin and verify persistence/download. User credentials must stay private.
- Configure/check Supabase Auth site/allowed return URLs for https://sahifayda.pages.dev/admin/recover/ and /admin/ before claiming recovery/email-change delivery works. These management settings were not modified through the available connector.
- Physically install/launch on phone and test real microphone/playback. Synthetic component tests do not prove OS/device behavior.
- Keep noindex until the owner is ready for discovery. Current Pages preview uses the correct canonical origin but deliberately has no search indexing.
- Add only genuine partner URLs with actual approval and review evidence. Catalogue remains empty until supplied.
- Review bank monitoring errors/NPCI robots block manually. Do not bypass source restrictions or infer product-policy changes from a text-change alert.

## Rebuild and upload
Set SAHIFAYDA_PUBLIC_SITE_URL=https://sahifayda.pages.dev and SAHIFAYDA_INDEXABLE=false for the current preview, then build and run secure-export/verify-export. Upload out/ using Wrangler pages deploy --project-name sahifayda --branch main. Native compiler is blocked on this Windows device; the verified matching WASM/webpack fallback is in README.md and CONTINUE-HERE.md. Later custom domains require exact backend-origin and Auth return-URL updates before use. No wildcard pages.dev origin access was added.

## SIA composer update — 28 October 2026
SIA now has a bottom typing box, adjacent microphone, explicit Send, and conversation bubbles. Speech is editable before sending and is not auto-submitted. User-written questions plus bounded recent chat go to the AI provider; conversations are not saved in the application DB or shared cache. Known identifying/credential patterns are rejected, but users must still avoid personal details. 36 tests and production export checks passed; actual public typed UPI response and mobile layout checked. Recognition, editing, no-auto-send and denied-permission behavior were verified with a synthetic component fixture; real-device microphone acceptance remains pending. Preview deployment: ab5577ce.sahifayda.pages.dev, stable sahifayda.pages.dev. The rest of the homepage was retained for separate discussion.

## Chat-limit correction
On 28 October, a saturated shared connection bucket blocked the owner's first message even though global usage was only 15/100. The updated composer sends a random per-tab ID; known malformed IDs are rejected and only salted hashes are stored for quota counting. Questions are not stored with the ID. The global 100/day and per-bucket 15/day guards remain unchanged; anonymous IDs are not authentication. 38 tests plus final build/export passed. Public deployment f05c1edc.sahifayda.pages.dev, same main alias. Refresh old open pages to load the fix.
# 28 October 2026 — SIA comparison release

- Published: https://17003ce4.sahifayda.pages.dev / https://sahifayda.pages.dev/hi/ ; `sia-guide` v16.
- 49 tests pass; 14 exported pages pass security and noindex checks.
- Public acceptance: ₹30,000 income → relevant follow-up → named comparisons with reasons, costs, restrictions and official sources. Savings topic switch also passed.
- Explicit APR quote comparison uses reviewed shared logic; no processing fee double counting; no provider quota. Final public send round trip 472 ms, not an all-response SLA.
- Informational catalog: 3 cards, 2 savings accounts, 2 demat brokers; recheck due 2026-11-27. No fake affiliate approvals. Loan/policy quotes remain user supplied and unverified.
- Free-form AI can take longer and still needs checking. No claim of universal product coverage, guaranteed approval or perfect financial accuracy. Real microphone/physical phone testing remains unverified.
- Requirements retained in PRODUCT-REQUIREMENTS.md and referenced by AGENTS.md.


# SahiFayda product-library release — 28 October 2026

The user resumed the paused work. The pending frontend release is now PUBLISHED and verified. This supersedes the paused/unpublished status in the historical checkpoint below.

- Stable site: https://sahifayda.pages.dev/hi/
- Product library: https://sahifayda.pages.dev/hi/products/
- Immutable deployment: https://95d76f64.sahifayda.pages.dev
- Existing repository: C:\Users\Admin\Documents\Codex\2026-10-27\cha\work\sahifayda
- Preserved requirements: PRODUCT-REQUIREMENTS.md; historical detailed handoff is retained in CONTINUE-HERE.md. Do not restart or replace the conversational composer.

## Completed in this continuation

- Inspected saved F&O screenshot. Existing build and 59 passing tests were retained without repeating unchanged tests/build/research.
- Desktop Hindi savings page: expanded limitations/opening instructions, distinct initial funding/minimum balance, fees, official sources, review dates and absent-referral state checked.
- Mobile 390x844: named Kotak811 detail request returned the shared detailed product card locally, with fees, limitations and opening steps expanded. Composer remained visible; page width did not exceed viewport. Mobile savings library was also visually inspected without horizontal overflow. Checked browser console had no warnings/errors. Temporary viewport override was reset.
- Published existing out/ only through official cached Wrangler to existing sahifayda main branch. 113 assets uploaded, 35 reused; _headers uploaded. No source, env, QA fixtures or credentials were uploaded.
- All eight new English/Hindi product/category routes returned HTTP 200, noindex and CSP on stable alias.
- Live Hindi demat library: F&O ongoing-price order Flattrade, Shoonya, m.Stock, Zerodha, Groww. Selected Flattrade + m.Stock; table correctly distinguished ongoing online zero brokerage, opening fee, trial duration and later per-order cost.
- Live SIA synthetic input: “mujhe future option ke liye zero brokrage wala account chahiye”. Returned Flattrade first, m.Stock temporary alternative, Shoonya paid alternative, sourced details and absent-referral state. No checked browser console warnings/errors. This is a reviewed local guidance path, not evidence of a new AI provider health test.
- Saved live screenshot: SahiFayda-live-FNO.png in current outputs. Opened live product library for user.
- No backend change/redeployment, DB mutation, fake referral offer, provider billing change or domain purchase in this continuation.
- Account-wide weekly usage: 16% at start, 17% near final save (rounded readings, not exact per-chat accounting). Earlier manual threshold was explicitly overridden in prior user instructions; preserve economy. These readings are not an enforced usage cap.

## Owner referral setup

Admin → Partners & commercial links → Add link → choose category → choose exact product/plan → enter actual approved HTTPS referral URL, terms, disclosures, permission evidence and review/expiry → Active → save using owner password. Only eligible approved mapped links appear on that product in SIA/library. Clicks are not conversions or commission; use provider reports/terms. Current real referral data remains empty.

## Remaining external acceptance

Real phone installation, physical microphone/transcription/playback and real owner login/recovery delivery need device/owner acceptance. No genuine partner links were supplied. Preview remains noindex; no ranking or search-indexing success is claimed. Catalog is ten reviewed products, not the whole market; recheck by 27 November 2026. Previously documented Gemini fallback/source-watch limitations remain unresolved; this release does not claim to fix them.

No further implementation is needed for this product-library release. Continue only with a concrete next request or the remaining owner/device/provider acceptance.


## Admin autofill release — 28 October 2026
Published https://69b28a60.sahifayda.pages.dev to stable alias. 62 tests and 22-page secure export pass. Known product shortcuts plus Angel One, editable metadata and saved custom presets. Promotion evidence/password checks retained. Live admin no-store/CSP/noindex and all nine script matches verified. See CONTINUE-HERE.md for acceptance details.
