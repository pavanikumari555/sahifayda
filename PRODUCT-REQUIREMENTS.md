# SahiFayda — user-approved product requirements

Read this before changing SIA or the public journey. Latest clarification: 28 October 2026.

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
- `supabase/functions/_shared/reviewed-products.mjs` is the central, dated source for ten informational products. Recheck by 2026-11-27 before continuing to present those terms as reviewed.
- Cards, savings and demat have named reviewed examples. Loan/insurance interviews ask relevant questions; comparisons of actual user-supplied quotes are explicitly unverified, with missing facts requested. No live lender/policy feed is connected.
- Provider instructions now support need → follow-up → comparison → reasons for all five categories, using only reviewed facts or explicitly unverified user-supplied terms. Unknown rates and invented numbers/percentages are rejected; arithmetic goes to calculators.
- Explicit two-APR quote comparisons use reviewed deterministic logic in the UI and endpoint. APR already includes associated charges; confirm the KFS and never add included processing fees twice. Nominal interest rates must not be silently treated as APR. Unknown quote formats use AI and require checking, not a claim of perfect financial accuracy.
- Structured preferences remain in component memory beyond the short visible history; when free-form help is needed, a bounded user-data summary accompanies recent messages. It is not a trusted system instruction or database record.
- Check service availability when opening the chat. Local guide steps use no provider quota; AI paths retain the global budget guard, origin checks, private-detail filters and no-chat-storage behavior.
