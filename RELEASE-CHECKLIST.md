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
