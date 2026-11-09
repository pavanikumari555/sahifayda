# SahiFayda — user-approved product requirements

Read this before changing SIA or the public journey. Latest clarification: 29 October 2026.

## Faster SIA and a shared reviewed brain — latest owner request, 29 October 2026

- Owner is dissatisfied with slow, irrelevant replies. Research useful agent patterns and implement a shared reviewed knowledge layer for repeated questions and exact product facts, preserving prior requirements.
- Answer the actual question first; do not replace a meaning/fee/application problem with a generic sales interview. Remember shown products for pronoun follow-ups, known amount/purpose and shopping preferences. A named broker opening must remain a broker opening.
- Common reviewed replies should work locally without model/provider wait. Unknown questions use relevant reviewed context, not an indiscriminate whole-catalogue prompt. Missing evidence must be explicit; do not invent bank eligibility, document periods, insurance conditions or approval rules.
- Keep source review/visibility, exact application mapping, commission disclosure, optional contact privacy, RAM-only chat and no provider-conversion API dependency. Do not treat visitor conversations as shared training facts. Implementation/research notes are in SIA-BRAIN.md.

## Easier discovery and less scrolling — latest owner request, 29 October 2026

- Owner liked the reviewed service information and requested all services to be obvious at a glance, with less searching/scrolling. Put eight direct service shortcuts in the homepage first screen, with SIA and existing money tools still directly available.
- Every service page needs a compact sticky service switcher and direct product selector. Product anchors and selector jumps open the exact product's full information. Start cards with main fees; full fees, eligibility, restrictions, application steps and official sources remain available in an expandable section. Keep Apply and optional Help available.
- Start the all-services directory with category choices instead of a long mixed product list. Preserve source dates, active/stale checks, exact referral mapping, commission disclosures, comparison and manual provider-app follow-up. No financial facts, account eligibility or backend integration changes are part of this layout refresh.

## Direct referral links and simple owner follow-up — latest clarification, 29 October 2026

- Owner pastes their own Angel One, Kotak811, GroMo or direct programme link; visitors follow it directly. Actual account opening/progress/commission will be checked manually by the owner in their provider app. Provider conversion API/webhook is not needed or a future dependency in this workflow. Keep the existing finance-source refresh and website backend independent of this decision.
- Admin shows which link was clicked and when, in IST, with anonymous reference and existing totals. A click alone cannot reveal a person's name/mobile or confirm an opening; never infer either. Recent event history remains 90 days.
- Owner wants only enough information to help a visitor who gets stuck. Add an optional small support form beside non-shopping Apply links. It must never block or gate the direct link. Visitor voluntarily supplies a name and/or mobile, a self-reported progress status and short issue, with explicit support-contact consent. No OTP/PIN/PAN/Aadhaar/bank documents or passwords; never send support contacts to SIA/AI, analytics or logs.
- Keep submitted contacts private to authenticated enabled owners. Admin can compare the provider app manually and mark helping/opened/resolved. Distinguish self-reported status from owner-confirmed status and recorded clicks. No automatic outbound call/message or promise of provider approval. Apply a 90-day contact-retention policy with scheduled cleanup. Existing aggregate manual report tools stay optional/collapsed; do not keep asking for provider API keys or compulsory reports.

## Consolidated owner direction — 29 October 2026, eight services and shopping

- One admin-managed exact product/plan catalogue supplies SIA, direct browsing, comparison cards and mapped commercial links. Retain completed work; no invented provider relationships. Support savings zero/minimum balance, demat segment fees, credit cards with explicit annual charges/UPI conditions, FD-secured cards within cards, insurance types/exact policies, purpose-specific loans, credit lines, referral apps and shopping merchants. Add new India products/variants without a code preset; do not claim complete national coverage.
- Generic account opening asks zero minimum balance or maintainable minimum balance and permits related questions. Latest loan clarification asks purpose first when missing; never repeat supplied amount/purpose. Retain spoken amounts and open-chat context.
- Owner can edit sourced bilingual descriptions, costs, limits, steps, matching fields and source review dates; active/draft/paused/archived products are separate from link permission. Pausing/expiry must remove mapped public applications at the database/server as well as UI. Product edits need no static-site rebuild.
- Links support 24/48/72 hours from now, never or custom expiry, with effective expired/review-due status. Never is not exemption from source review or programme expiry; provider-issued link may expire earlier. Public actions use Apply or View & shop; disclose commission nearby. Preserve promotion permission, exact mapping, owner session auth and revision checks.
- Track clicks separately from provider-evidenced application, loan approval, account/card/policy issuance, loan disbursal, purchase and app activation. Never equate clicks to unique people, account openings or paid commission. Aggregate report import/export remains supported; no public provider conversion API is assumed. Do not repeat commission at intermediate application/approval stages.
- Shopping example ₹30,000 mobile: retain budget, ask merchant/model and existing card, show relevant reviewed card fees and approved store link. Separate upfront price/discount from later reward, caps/EMI exclusions and card approval delays. No invented current price/offer or guaranteed stacking. Amazon/Flipkart routes require owner programme links; Myntra configurable but draft until website permission is verified.
- Commercial inventory can be activated/paused by owner and filtered to available links. Comparison suitability/order does not change merely because one pays more commission. Keep official educational sources separate.
- Existing ten-source daily refresh is retained; automatic structured rate extraction remains limited to the three supported loans. Expanded catalogue records are source-reviewed, not a claim of market-wide autonomous product extraction. Actual phone mic and auth email acceptance remain owner/device checks.

## Phone screenshot follow-up — live dictation and real-world problems, 29 October

- Latest owner correction: do not show a Hindi/English language selector inside SIA. Infer reply language from each user message, including switching languages within the same chat; Hindi script gets Hindi, Roman Hindi gets Hinglish, English gets English. Brief neutral follow-ups retain the previous user language. The browser microphone has no universal audio auto-detection API: choose its recognition locale automatically from prior user words or the browser preference, hold it steady during a recording, and do not claim untested multilingual audio recognition.

- Owner showed speech appearing above the composer, sometimes not reaching the box, and an unavailable-answer error after “aur is type ka kam hai mera IT services deta hun”. While listening, show interim words directly in the composer; on final recognition replace that session’s interim hypothesis, never append it again. Preserve an earlier typed draft and partial speech on error. No automatic sending; make stopping/editing/sending clear. The later automatic-language correction above supersedes the speaking-language selector.
- Remember work type, new/existing business, known amount/purpose, absent collateral/turnover and other supplied needs throughout the open chat, including AI-served and failed turns. Project instructions are saved here; private visitor chat remains RAM-only and is not persisted as project memory.
- Understand the actual daily-life problem: opening a suitable account vs verification failure, opening funding vs minimum balance, an unexplained charge, a rejected loan or missing accepted records. Give a relevant practical next step, ask one useful missing question, and do not restart a product-sales interview or repeat already answered questions. Do not guarantee whole-market best, approval or complete understanding of every possible question.
- Review comparable first-party product/eligibility flows for guidance, while grounding financial facts in official sources and preserving SahiFayda’s conversational format and privacy. Keep shared reviewed handling on client and server so common follow-ups need no model request and cannot fail solely because a provider is busy. Unhandled AI failures must preserve the draft and expose an accurate user-facing reason; diagnostics may store only safe provider/reason codes, never prompts, answers, transcripts or secrets.

## Latest owner correction — 29 October 2026

- Microphone dictation on a real phone repeated words in the composer. Merge cumulative/overlapping recognition results and restart replays; deliver a single editable transcript only on stopping. Preserve intended repetition inside one hypothesis and never auto-send.
- A generic loan request must be a natural conversation: first ask the amount, then the purpose if still missing; remember both. Once enough is known, compare verified relevant loan terms and explain the lowest published rate among the covered matching sources, with actual fees/conditions. Do not assert a universally best loan or that the user qualifies for the advertised floor rate. This supersedes the earlier immediate generic loan-guide response.
- Cover daily-life finance (accounts, demat, loans, cards, insurance and existing tools) through a connected information library. Collect current official-source data, automatically refresh verified supported facts, make the same records available to SIA and direct readers. A source failure/ambiguous parse must not publish invented updates. Show source/check date and distinguish published starting rates from an applicant's actual APR/quote. State coverage honestly; the whole internet is not a verified dataset.
- Public application buttons should say “आवेदन के लिए यहाँ क्लिक करें” / “Click here to apply”, without referral/affiliate wording in the action label. Preserve exact-product mapping, destination revalidation and a concise nearby commission disclosure. Keep programme permission evidence and technical referral types inside admin/backend.
- Connect this correction with all earlier requirements; do not erase earlier approved work. Owner is handling the Supabase production URL configuration in their browser; do not request their password or reset token.

## All-service research, simple posts and short SIA replies (latest owner direction)

- Apply the direct-answer approach across savings, credit cards, demat, loans (including business), insurance and the existing money tools. Do not patch only the last screenshot. Research official sources first, publish simple English/Hindi service posts on this website, and use the same reviewed content for SIA.
- User example: “मुझे 10 लाख का लोन चाहिए” followed by “बिजनेस लोन चाहिए”. Retain ₹10 lakh and recognise business purpose; never repeat the home/education/vehicle/personal question. Give a useful next step and own-site business-loan guide, without requiring a long interview or inventing loan approval/rates.
- SIA should give a brief relevant answer, a real approved referral when available, and a clear link to the relevant own-site post for full information. Avoid long information/fee walls in chat. Detail pages should explain the service, practical next steps, costs/limitations, official sources and safe application/help routes in language an ordinary person can follow.
- Missing real offers are not a reason to invent a lender or promise approval. Give a researched informational route and label official sources separately from commercial links. Rankings remain independent of commission; exact-product mapping and disclosures remain.
- These instructions supersede older mandatory interview sequences where enough intent is already supplied. Preserve known context/corrections, repayment-risk protections, privacy, mic/no-auto-send, admin autofill/session-save, existing tools and the economical-work preference. Save this direction and connect it with earlier requirements/checkpoints before future changes.

## Direct answers and microphone pauses (latest user correction)

- The user's screenshots showed a zero-minimum-balance savings request followed by “सभी प्रकार की सेवाएं उसे करूंगा”, with SIA repeating the same app/branch question. A clear zero-balance need must immediately show reviewed Kotak811/SBI BSBD examples and material conditions; channel preference is optional. Both/all services is a valid preference, never an unanswered question.
- Keep the chat simple: short relevant product summaries and a clear full-details page link. Full fee tables, restrictions and opening steps belong on those pages. Preserve the approved referral action and disclosure. Do not confuse zero minimum balance with zero opening funding, all services free, or guaranteed eligibility.
- Preserve necessary card repayment/fee questions and demat segment distinctions; remove avoidable interviews, not facts needed for an accurate answer.
- Mic uses continuous/interim recognition with bounded same-session restart after browser pause, manual Stop, 8-second silence timeout and 60-second total cap. Collect spoken parts into one editable draft and never auto-send. On unmount/permission denial, stop cleanly. Physical-phone recognition still needs device acceptance.
- A failed/slow/cancelled AI request must retain the draft and show a clear retry/cancel state. Local reviewed replies must not depend on AI availability or provider quota. The open chat retains up to 40 messages in RAM; provider history is still at most four bounded entries and no chat/transcripts are persisted.

## Quick partner-link entry (latest admin request)

- Selecting a known product fills its category, bilingual titles/descriptions, disclosures, official source and reviewed product mapping. Owner pastes their own referral URL and can edit every filled field.
- Keep details collapsed by default; show product selection and destination first. Offer reusable saved details for custom products in every category. Unknown providers still need a real official source once; do not invent provider facts or programme permission.
- Angel One now has a reviewed resident-online product record, admin shortcut and exact referral mapping. Show its capped 30-day/₹500 introductory brokerage benefit separately from ongoing fees, conditional AMC and unresolved all-in opening extras. Current pricing/support supersede conflicting legacy free-delivery wording. Never map it to a different broker or rank it higher for commission.
- A product switch clears the previous destination, approval, expiry and attribution. Draft saving needs no promotion confirmation. Latest owner request: autofill an editable official-source review note, keep the explicit promotion checkbox, and save commercial links using the verified logged-in owner session without asking for a password again. Preserve server authentication, active membership/owner checks, current review, expiry, exact mapping and audit. Do not auto-check approval, invent commission/expiry, or copy passwords into templates. Password/account-change reauthentication is outside this partner-form request.
- Preserve existing real admin drafts/sessions during QA. Use a synthetic local component fixture for save acceptance.

## Connected product-library and referral flow (latest user request)

- Users must receive useful detail on SahiFayda, not just an external link. One reviewed product library supplies SIA, direct browsing, fee tables, limitations, application steps and comparison views.
- Savings: show minimum balance separately from opening funding, physical/virtual debit card fees, interest source/date, KYC channel, cash/branch restrictions, other charges and who the features match.
- Demat: distinguish delivery, intraday, futures and options. Zero delivery brokerage is not zero F&O brokerage. Recognize Hindi/Hinglish “future option”, “F&O”, “brokrage”, and fee preferences, even when the initial request does not contain “demat”.
- If a reviewed ongoing zero-brokerage plan exists, show it with opening/subscription/other charges. Trials must show duration, eligibility caveat, ongoing charge and possible expiry. Never invent a one-time or lifetime plan from outdated marketing.
- Rank by the user's requested segment/features/fees, independently of commission. Explain which preference each result matches. “Best” means best fit among the reviewed options, not universal suitability, execution quality or guaranteed outcomes.
- Admin must bind a real affiliate/referral URL to an exact product/plan. Only approved, active, unexpired, current links can appear in SIA or library cards. General/unmapped links must not attach to a similarly named product.
- The user will add real links later. Do not create fake live referral offers. Keep informational official sources visible; render a separate disclosed “Open/apply through referral” action when a matching link is available. Revalidate before redirecting, including product mapping.
- Account opening takes place on the provider website. Clicks are not accounts opened or commission earned; existing aggregate reporting remains the evidence source.
- Add bilingual browse/category/comparison pages, discoverable from the homepage and SIA. Preserve the conversational composer and existing tools. Keep initial guidance fast; optional referral lookup must not delay the answer.

### Implementation flow

1. Identify goal and the exact segment/variant; retain known preferences and ask only missing useful questions.
2. Match current reviewed product records; show relevant cost rows, reasons and restrictions; allow reading expanded information on the same page/chat.
3. Compare selected products side by side from the same records; link to dated official fee/offer sources for verification.
4. Independently look up approved public partner rows by exact product key and category. Show commission disclosure next to the matching action; do not alter ranking.
5. On action, revalidate current destination and product key on the server, record an anonymous click and redirect to the approved provider flow.
6. Owner can map, preview, save, pause or expire links in the existing admin panel. No fresh user authorisation is needed for this already requested implementation.

Official pricing research (2026-10-28): Flattrade charges/zero-brokerage FAQ; m.Stock current pricing (30-day introduction followed by published per-order price, not an assumed old lifetime plan); Shoonya pricing FAQ (F&O differs from delivery); Zerodha and Groww official tariffs. Savings sources include Kotak811 July-2026 schedule/FAQ and SBI BSBD/deposit-rate pages. Unknown or conflicting fields must be labelled, not guessed.

- A normal user describes a problem in their own words. Do not replace conversation with category/radio-button forms.
- Keep the bottom text composer, small adjacent microphone and Send. Speech becomes editable text; never auto-send.
- Need → understand already supplied details → one relevant missing question at a time → useful comparisons → explain why an option fits and its drawbacks.
- Apply this method to cards, savings accounts, loans, demat and insurance. Category-specific questions are necessary; do not use one financial questionnaire for everything.
- Example acceptance journey: “credit card lena hai, income 30000 per month” must acknowledge the income, ask about use/fees/repayment, and reach sourced card comparisons. Never repeatedly ask for known income or infer approval from income.
- Remember stated preferences throughout the open chat, accept corrections and changes of topic. Keep the memory in RAM; clear on closing/refreshing. Do not persist private chat or send it to analytics.
- Fast reviewed guidance must not wait for an LLM or consume provider credits. Use AI for questions outside supported parsing, with clear busy/error states and the draft preserved.
- Research comparable journeys and official product terms before meaningful changes. Every named comparison needs an official source, review date, material fees/restrictions, and reasons tied to stated needs. Do not invent missing facts or claim whole-market “best”.
- Informational issuer links are separate from approved affiliate offers. No invented partner approval, hidden commission ranking, account opening or application submission.
- When a category lacks reviewed product data, say so and gather the actual quotes/terms needed to compare. Do not pretend the whole category is covered.
- Preserve existing useful tools. Do not redesign the whole site without connecting the change to the user's instructions.
- Keep work economical; test the real journeys and publish authorized fixes to the existing Cloudflare site.

## Research for this change

Comparison journey: https://www.paisabazaar.com/credit-cards/ — usage and profile matter, not income alone. SIA uses conversational questions instead of copying a long lead form.

Official research, checked 2026-10-28:
- https://www.icici.bank.in/personal-banking/cards/credit-card/amazon-pay-credit-card — no joining/annual fee; invite-only; Amazon focus. No approval inference.
- https://www.hdfc.bank.in/credit-cards/moneyback-plus-credit-card — membership fee ₹500 plus taxes; merchant rewards have conditions.
- https://www.hdfc.bank.in/credit-cards/moneyback-plus-credit-card/eligibility — salaried and self-employed criteria differ. Public pages differ on gross/net wording; do not automate eligibility decisions.
- https://www.sbicard.com/en/faq/cashback-sbi-card-faq.page — online cashback product, fees and exclusions must be reviewed. Dynamic product page did not expose complete text; use FAQ for catalog facts.
- https://www.kotak811.bank.in/savings-account/811-zero-balance-digital-savings-account — no minimum balance; online opening has initial funding, distinct from minimum balance; optional physical-card charges.
- https://images.kotak.bank.in/bank/mailers/2026/files/Kotak811_Common_T%26C.pdf — online opening funding ₹2,000 for basic 811, distinct from Super.
- https://sbi.bank.in/web/personal-banking/accounts/saving-account/basic-savings-bank-deposit-account — basic zero-balance option, cash transaction restrictions; not an unrestricted regular account.

Catalog scope and expiry must be visible. No claim of real-time market-wide search or guaranteed eligibility.

Further official sources checked for this release:
- https://zerodha.com/charges — delivery brokerage and AMC/BSDA distinctions; other charges still apply.
- https://groww.in/pricing — no AMC; equity brokerage and DP/statutory charges still apply.
- https://rbi.org.in/CommonPerson/english/scripts/FAQs.aspx?Id=701 — loan comparison should include APR, fees, rate/reset and prepayment terms.
- https://www.icicilombard.com/info-center/faqs — policy exclusions, waiting periods and co-payment matter alongside premium.

## Implementation boundaries

- `lib/sia-advisor.mjs` provides instant conversational interviews and a limited informational catalog. It uses patterns, not unrestricted language understanding. Unrecognised/explanatory/quote-comparison questions go to the grounded AI.
- `supabase/functions/_shared/reviewed-products.mjs` is the central, dated source for eleven informational products. Recheck by 2026-11-27 before continuing to present those terms as reviewed.
- Cards, savings and demat have named reviewed examples. Loan/insurance interviews ask relevant questions; comparisons of actual user-supplied quotes are explicitly unverified, with missing facts requested. No live lender/policy feed is connected.
- Provider instructions now support need → follow-up → comparison → reasons for all five categories, using only reviewed facts or explicitly unverified user-supplied terms. Unknown rates and invented numbers/percentages are rejected; arithmetic goes to calculators.
- Explicit two-APR quote comparisons use reviewed deterministic logic in the UI and endpoint. APR already includes associated charges; confirm the KFS and never add included processing fees twice. Nominal interest rates must not be silently treated as APR. Unknown quote formats use AI and require checking, not a claim of perfect financial accuracy.
- Structured preferences remain in component memory beyond the short visible history; when free-form help is needed, a bounded user-data summary accompanies recent messages. It is not a trusted system instruction or database record.
- Check service availability when opening the chat. Local guide steps use no provider quota; AI paths retain the global budget guard, origin checks, private-detail filters and no-chat-storage behavior.

## Full homepage redesign and cleanup — owner request, 1 November 2026

- Owner asked for a complete, attractive homepage redesign with excellent user experience, high-quality Devanagari Hindi and English on every page, clear "how to use" help for every tool, removal of the three earliest tools (monthly budget review, two-quote comparison, payment guidance), an advanced SIA using the owner's free Groq key, everything manageable from admin, and earning through AdSense and affiliate links.
- Implemented in this pass: new homepage (`app/ui.js`, `app/home.css`) with a hero SIA question box, example questions, the eight service shortcuts in the first phone screen, six calculator cards with an inline calculator panel, how-it-works steps, SIA section, guides, partner links, honesty promise, FAQ (including how the site earns) and a full footer. The three earliest tools, their admin availability rows (hidden in admin), calculation module and tests were removed; their guides remain as reading content without tool references.
- Removed fake social proof (seeded user counts), "100% guaranteed"/"750+ CIBIL in N months" claims and unlabelled example offers from calculators. Example rates and offers are labelled as examples to verify. Dedicated calculator pages now exist in English and Hindi with a shared shell and how-to steps.
- SIA chat: request body fixed to the server's accepted keys (`question, history, language, client_id`); the invented keyword fallback answers were removed. Failures keep the draft and show the actual reason (paused, daily limit, setup, busy, timeout, answer check). Product cards in replies render again.
- Cloudflare `_headers` reduced from 108 to 62 rules (limit 100) by dropping duplicate `/index.html` rules; the build now fails above 100. Calculator pages added to the indexable sitemap.
- Still pending owner input: Groq key in Supabase secrets and backend deploy for any SIA brain changes; AdSense publisher ID, legal/contact pages, custom domain and the decision to enable indexing; admin-managed homepage/site settings need a database table and admin-console deploy.

## Brand redesign, SIA chat on top and admin homepage controls — owner request, 9 November 2026

- Owner supplied the SF monogram and SahiFayda wordmark logos. The site uses their colours (navy #03224A, green #058C6F, gold #EBA500) on every page header, favicon, app icons and social preview. Assets are generated by `scripts/brand-assets.ps1` into `public/brand/` and `public/icons/`.
- Reference site www.publicnaukri.com: SIA's chat box sits at the top of the homepage ("Tell SIA what you need"), with a "Run by AI" strip. All Ask SIA buttons and example chips feed that one embedded chat. Automation claims stay honest: SIA checks the fixed official-source list daily, answers common questions from reviewed facts and uses AI otherwise; it does not open accounts, submit applications or decide approval. The homepage shows the real source-check log (`finance_knowledge`), never invented updates.
- The three earliest tools were already removed in commit 423ecaf. The six current calculators are useful and kept; none deleted in this pass.
- Admin → "Homepage & design" (owner only, revision-checked, audited) controls the announcement bar (internal paths only), headline/sub-heading, SIA example questions and which sections/calculators appear. No rebuild needed. Requires `supabase/changes/site_settings.sql` and an admin-console deploy; until then the homepage uses built-in defaults.
