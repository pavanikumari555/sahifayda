# Release checklist — current status 29 October 2026

- Latest frontend b91929c8 is published and verified. SIA concise services, explanation links, fee-limit empty matches and two exact-product approved referrals are live.
- Source-watch v5 is active. Both formerly failing bank pages now establish readable baselines; Groq/Gemini sources are unchanged in the checked run. NPCI is intentionally blocked by robots, not silently bypassed. 80 tests pass.
- Outstanding external acceptance: current production Auth return URLs/email delivery, owner-completed recovery/login and physical-phone installation/microphone. Supabase dashboard currently requires owner sign-in to inspect Auth configuration.
- Social publishing needs exact connected channel identities and authorization; it is not enabled. Search indexing remains intentionally off. No paid services, new domain, external conversion API or fabricated partner links were added.
- Older sections below are historical evidence. Read the newest CONTINUE-HERE.md entry before treating an old pending item as unfinished.

## Latest release — automatic reply language, 29 October 2026

Frontend https://37b30a5c.sahifayda.pages.dev ; stable https://sahifayda.pages.dev/hi/ . Supabase sia-guide v25 active; other functions unchanged.

- Owner correction: remove SIA's Hindi/English selector. Latest user words determine reply language: Hindi script → Hindi, Roman Hindi → Hinglish, English → English. Clear language changes override earlier turns and page language; neutral short amounts retain the prior user style. Assistant messages and generated preference summaries do not determine language.
- One shared detector feeds reviewed answers, API routing and both AI provider prompts. Loan amount and other supplied facts survive language changes. Mic locale is chosen automatically at recording start from chat words, otherwise browser preferences, and held stable throughout recording. The browser API accepts one recognition locale and has no universal automatic spoken-language detection; do not claim arbitrary first-utterance or mid-recording language switches are acoustically verified.
- 99 tests passed; secured production build/export passed (36 HTML pages, 53 script hashes, noindex retained). Local Windows type-directory permission failure was resolved by rebuilding with filesystem access. An unchanged prior export was briefly republished before the corrected build; 37b30a5c is the final new release.
- Live endpoint and published UI both verified in the same synthetic conversation: Hindi ₹3 lakh loan → English business purpose → Hinglish new IT-services business. Replies changed accordingly and retained ₹3 lakh. Reviewed flow used no model calls.
- Live UI confirmed selector absent. Proof screenshot: SahiFayda-automatic-language-live.png in current chat outputs. Physical phone speech remains an owner/device acceptance check.
- Requirement saved in PRODUCT-REQUIREMENTS.md. This supersedes the v24 selector instruction below. Earlier source coverage, privacy, quotas and pending Auth/device checks remain unchanged.

## Latest release — phone dictation and daily needs, 29 October 2026

Published frontend: https://d4f872b9.sahifayda.pages.dev ; stable https://sahifayda.pages.dev/hi/ . Supabase sia-guide v24 active; finance-refresh v4 and source-watch v5 unchanged.

- Interim speech appears directly in the composer. The final hypothesis replaces its preview while retaining text typed before recording. Empty late results and partial-network failure retain the last words. No automatic sending; Hindi/English recognition selector added.
- Shared reviewed advisor runs in both browser and endpoint before AI quota/provider calls. IT-services business follow-ups acknowledge sector and retain known amount, startup status and collateral facts. KYC failure, funding vs balance, salary/current-account needs, unexpected charges, loan rejection and missing income documents have distinct contextual guidance.
- Unhandled questions retain grounded AI routing. Drafts survive errors; safe provider failure codes aid diagnosis without recording conversation content. The historical screenshot failure was not reproduced, so its exact cause remains unconfirmed.
- 94 automated tests pass. Secured static export verified. Latest release: 21 live paths HTTP 200 with valid inline CSP hashes; noindex preserved and expected slash redirects 308.
- Actual SIA fixture verified interim text in the box before stopping, zero automatic sends, no final duplication and preserved draft on busy response. Synthetic recognition does not prove physical phone microphone behavior. Backend replay of screenshot-style follow-up returned HTTP 200 reviewed and the relevant amount question, without provider calls.
- Final browser reinspection was unavailable because the browser binding stopped working; no new live screenshot is claimed. Existing screenshots are from previous releases.
- Deployment maintenance: lib/sia-advisor.mjs now re-exports supabase/functions/_shared/sia-advisor.mjs. Include that shared module and its dependencies in future sia-guide deployment packages.
- Owner requirements are recorded in PRODUCT-REQUIREMENTS.md; comparison research and acceptance journeys in SIA-JOURNEY-REVIEW.md. Keep visitor chats in memory only.
- Coverage remains ten official sources, with three structured loan schemes; do not claim whole-market coverage or guaranteed resolution of every question. Physical device and Auth URL/email acceptance remain separate unfinished owner checks.

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
- Add only genuine partner URLs with actual approval and review evidence. Angel One and Kotak811 are already supplied, approved and mapped; do not recreate them.
- Bank monitoring errors were fixed on 29 October; NPCI remains robots-blocked. Do not bypass source restrictions or infer product-policy changes from a text-change alert.

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

## Partner session save — 28 October 2026
Published e71ccca4.sahifayda.pages.dev and admin-console v10. Permission source note autofills, consent stays explicit, no repeated password for partner saves. 64 tests and secure export pass. Live admin nine scripts match; no-store/CSP retained. Live signed-out endpoint 401 and untrusted origin 403. User explicitly authorized removing partner-save reauthentication; other account actions unchanged.

## Angel One reviewed integration — 28 October 2026
Published 9b264133.sahifayda.pages.dev; admin-console v11, sia-guide v18. Eleven reviewed products, capped offer and ongoing fees separated. Existing exact approved Angel One URL mapped with audit/revision check; no duplicate. 66 tests, 22-page secure build, live local SIA named details/comparison/referral pass. Resolver click acceptance rolled back; no real application or extra click. See CONTINUE-HERE.md.

## SIA direct answers / pause-friendly mic — 28 October 2026
Final frontend bf9cb238.sahifayda.pages.dev; sia-guide v19, admin-console v12. Clear zero-balance request immediately names Kotak811/SBI BSBD; no repeated channel question. Compact conditions/detail links replace chat fee tables. Draft-safe retry/cancel, 40 RAM messages, continuous bounded mic session with no auto-send. 71 tests and final secure export pass; live sequence 12 local + 1 AI reply, final 390px mobile no overflow. Physical phone acoustics remain unverified. See CONTINUE-HERE.md.

## 29 October 2026 — pending SIA refinements published
Release b91929c8.sahifayda.pages.dev; explicit owner deployment approval received. 78 tests and secure production export passed. Live fee empty-match, insurance-to-APR guide link and 21-path HTTP/CSP/noindex checks passed. See CONTINUE-HERE.md.


## 29 October — microphone, conversational loans and daily official information
Published frontend 371ed210.sahifayda.pages.dev; sia-guide v23 and finance-refresh v4 ACTIVE. 85 tests, secured 36-page build and 21 live HTTP/CSP checks pass. Synthetic cumulative/replayed microphone results become one editable phrase, never auto-send. Actual live five-lakh personal and ten-lakh business conversations preserve facts, reach verified matching terms and simple Apply links; 390px no horizontal overflow. Daily 10:10 IST source job active, ten official sources, eight successful observations and two explicitly unavailable sources. Three supported loan-rate schemes auto-update; other snapshots and older product-library terms are not a whole-market feed. Public table read-only, internal issue column denied, unauthorised job 401, attacker origin 403. One real AI comparison successfully used current official ranges/fees. Physical phone mic and owner-managed Auth URL/email acceptance remain unverified. See newest CONTINUE-HERE.md.

