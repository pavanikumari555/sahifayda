# Official-source automation — 10 November 2026

## Latest follow-up: ₹30,000 mobile journey

- The owner's latest message confirms proceeding and asks for budget-specific high-savings card suggestions and changing offers across the website. Local implementation now includes a shared net-savings ranking engine in `_shared/shopping-offers.mjs`, a bilingual shopping finder, SIA shopping comparisons and structured owner-editable campaign fields.
- Ranking accounts for ownership, known new-card cost including taxes, transaction costs, remaining statement allowance, min spend, merchant/model/payment/membership restrictions, campaign expiry and explicit stacking. Unknown costs/caps exclude a route from the priced ranking. Multiple campaigns for the same card are alternatives, not additive rewards. A single covered card is not a market-wide best claim.
- SIA retains the ₹30,000 budget across exact-card, Prime, full-payment/EMI and remaining-cap replies. Only a bank name triggers an exact-variant clarification. The bounded RAM/context-summary paths preserve these values; none are stored as analytics or shared training data.
- SBI's current official FAQ publishes online 5% with ₹2,000 online and ₹4,000 combined statement-cycle limits. The new parser checks separate caps. Its source-derived card record remains a candidate requiring acceptance; fee/category/EMI details must not be invented from the FAQ alone. Reference: https://www.sbicard.com/en/faq/cashback-sbi-card-faq.page
- `finance-refresh` **version 6 is live**, including the latest baseline refinement and SBI parser. An explicit authenticated invocation (request 36) returned HTTP 200 and all 17 source attempts. SBI parsed `onlineRate=5, onlineCap=2000, totalCap=4000`. IDFC, Amazon and SBI observations remain pending review.
- Automatic approval review rejected the IDFC/Amazon acceptance again even after the owner's confirmation, stating that exact production-record approval was not established. It separately rejected the admin-console and sia-guide deployments. Those production functions remain unchanged. No workaround was used; the local shopping UI/ranking is not yet live.
- All **161 tests pass**. Compilation, TypeScript and all 66 Next prerenders passed; final static export failed at Windows EPERM creating `out/guides/business-loan`. The parent process can create that directory, but this is not proof of a complete secure build. Do not upload this partial export or use DeployOnly. Git writes remain blocked as previously recorded.
- Remaining exact approval scope: accept the dated IDFC/Amazon candidate records (and independently review the new SBI structured record), deploy the tested `admin-console` source-review/offer-management actions and `sia-guide` shared source/ranking flow; then complete the full build, mukeshs555 push, Cloudflare upload and release verification. Existing authentication, quotas, budget, origin checks, private-chat rules and affiliate permissions are preserved by the local code.

The older checkpoint below is historical and superseded by this section.

## What the system does

- Supabase Cron already runs `finance-refresh` daily at 04:40 UTC / 10:10 AM IST. Do not create a second scheduler or expose its Vault job token.
- The allowlist now contains 17 exact official sources. Sources are in `_shared/finance-sources.mjs`; it is deliberately not a claim of whole-market coverage. New owner-added products need an approved source adapter to join this monitor.
- Three existing loan parsers publish only when all required rate, fee, amount and applicable business/amount conditions parse. A failure retains old observations as `review_due`, not fresh offers.
- IDFC FIRST WOW!/EA₹N deposit/regular-fee fields and Amazon Pay ICICI membership rewards have dedicated parsers. Their initial observations and all changed page text need explicit review. This includes navigation changes: the conservative full-readable-text hash can cause false alerts.
- Generic sources store change observations, not automatically extracted product fees. A first generic baseline is an observation only; it never renews a product review or invents terms.
- Repeated observations cannot clear a pending change. Owner review is revision/hash/attempt checked, authenticated, owner-only, and audited. Read the full source, not just the short excerpt. Product restrictions and dates still need separate catalogue edits.
- FD finder and Amazon example now read accepted observations. They pause named matching/examples when unavailable, failed, unapproved or older than 48 hours. Inputs remain editable; new data never overwrites a visitor's entered quote.
- Public directory and SIA share source-status filtering. Supported dynamic fields use the same accepted records. Source checks never change commercial URLs, permissions, product state, ranking or product review expiry.
- GitHub's old misleading offer-sync/search-ping workflows are replaced by actual daily-refresh health and sitemap-availability checks. Neither claims search submission or indexing success.

## Research and implementation references

- IDFC FIRST FD-card FAQ: https://www.idfcfirst.bank.in/credit-card/credit-card-against-fixed-deposits — separate WOW ₹20,000 and EA₹N ₹5,000; EA₹N regular ₹499 + GST fees vs limited joining offer/annual waiver. No inferred approval or fixed deposit yield.
- Amazon Pay ICICI: https://www.icici.bank.in/personal-banking/cards/credit-card/amazon-pay-credit-card — membership-dependent ordinary-purchase rewards, NIL joining/annual fees, invite-only, Amazon Pay balance and exclusions. No confirmed instant-discount/EMI stacking.
- Supabase scheduler: https://supabase.com/docs/guides/functions/schedule-functions — Cron + pg_net + Vault. Existing production job and its HTTP response were inspected independently.
- https://github.com/vercel-labs/skills and its `find-skills` instructions were read. Local `find-skills`, `react-best-practices`, `web-design-guidelines`, and `reverse-engineer-anything` already exist under the user's Codex skills directory. No new installation is claimed.
- React guidelines applied: shared in-flight finance reads, parallel independent directory/source loading, periodic revalidation, cleanup and derived state. Web-interface checks applied to new async status, labelled forms, semantic buttons, keyboard access and bilingual copy.
- REA explicitly excludes ordinary source-repository analysis. No REA engine/plugin was installed or used for this source-code task.

## Verified production state and remaining gates

1. `finance-refresh` version 5 was deployed through Supabase. A narrowly scoped authenticated refresh returned HTTP 200, observing all 17 sources. HDFC personal/business parsed; ICICI amount text, Kotak readable text and NPCI robots permission did not. These failures were not bypassed.
2. IDFC/Amazon parsers produced the expected candidate fields. Approval of those exact records was rejected by automatic approval review and remains pending owner confirmation. Other new/changed source baselines also remain in the review queue; do not describe all 17 as verified product facts.
3. The final local finance-sync baseline refinement, SIA source filtering and admin review actions have NOT been deployed. Automatic approval review rejected the attempted follow-up rollout, citing failed full build and incomplete dependency validation. The production SIA/admin functions were preserved.
4. All 154 local tests and server rendering pass; all 20 backend modules resolve and parse, and the publishing PowerShell script parses. Next compilation passes; static export fails at Windows EPERM creating a Next output directory. `.git/index.lock` creation is also denied in this session; no new commit/push was made. GitHub authentication could not be validated in the restricted session.
5. After the owner confirms the remaining rollout, deploy the reviewed Edge Function payloads and verify them. Run the full `scripts/publish-fixes.ps1` in normal PowerShell to test/build, use only `mukeshs555`, reject concurrent remote changes, commit the explicit file list, push and upload the fresh Cloudflare export. `-DeployOnly` is unsuitable for these application changes.
6. Do not infer frontend deployment from the successful refresh backend update. A Cloudflare release marker and live routes must be checked after upload.

No visitor conversations, financial inputs, support contacts or credentials are included in refresh records, health responses, workflow logs or test fixtures.
