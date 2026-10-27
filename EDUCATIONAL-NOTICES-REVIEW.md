# SahiFayda — educational notices and advice boundaries

Reviewed: 27 October 2026, Asia/Calcutta.

## Decision

Add a clear contextual notice to the existing budget/quote calculators, the credit-card minimum-due guide and their results. Add an easily accessible scope explanation and clarify SIA's limited guide role. This is appropriate to the actual educational functionality, not a liability waiver or a guarantee that legal action cannot arise.

The user asked for research before adding wording and does not want people pressured into financial decisions. Do not implement a new debt planner merely because notices have been added. The debt-help proposal remains research only.

## Research findings and limits

1. **A disclaimer does not repair misleading claims.** The Government's explanation of the CCPA 2022 misleading-advertising guidelines says a disclaimer should not hide material information or attempt to correct a misleading advertisement. That is directly relevant to future marketing; using the same principle to keep calculator claims clear is a product-design inference. It is not a legal finding that every calculator element is an advertisement or that the site's complete legal obligations have been resolved.
   - [Official PIB explanation](https://www.pib.gov.in/Pressreleaseshare.aspx?PRID=1832906&lang=2&reg=48)

2. **Activity matters, not only the label.** SEBI's investor guidance describes the role and registration of investment advisers in securities/investment-related advice. The official regulations listing checked in research identified the regulations as last amended on 25 November 2025. These materials do not justify automatically treating all loan maths as SEBI investment advice, nor do they establish a blanket exemption for every website, private personalised AI answer or paid recommendation. The business's precise activities, personalisation, remuneration, product scope and representations need an India-qualified lawyer's assessment before expanding into advisory/regulated services.
   - [SEBI investor education](https://investor.sebi.gov.in/investment_advisor.html)
   - [Official regulations page, 25 November 2025 amendment](https://www.sebi.gov.in/legal/regulations/nov-2025/securities-and-exchange-board-of-india-investment-advisers-regulations-2013-and-securities-last-amended-on-november-25-2025-_98246.html)

3. **Education and commercial advice must be distinguished.** RBI-associated financial-literacy/credit-counselling material distinguishes financial education from commercial advice. That supports an education-first product direction, but it does not authorize SahiFayda to present itself as an accredited counsellor, bank, lender or regulated adviser.
   - [RBI FLCC concept note hosted by SLBC Andhra Pradesh](https://www.slbcap.nic.in/pages/RBI/FLCC%20Concept%20note%20of%20RBI.pdf)

This is source-based product research and a wording/behaviour revision. It is not professional legal advice, a legal compliance certificate, an assessment of all applicable Indian laws or an assurance of immunity from claims. A disclaimer cannot replace accurate calculations, fair marketing, privacy protection, proper permissions or required registration.

## Implemented wording

### Hindi notice

“यह आपके आँकड़ों और बताई मान्यताओं पर आधारित शैक्षिक अनुमान है, व्यक्तिगत वित्तीय सलाह नहीं। लोन, EMI या कर्ज़ चुकाने का तरीका बदलने से पहले उपयुक्त वित्तीय सलाहकार/क्रेडिट काउंसलर से सलाह लें और अपने ऋणदाता से शर्तें व शुल्क जाँचें।”

### English notice

“This is an educational estimate based on your inputs and the stated assumptions, not personalised financial advice. Before changing a loan, EMI or debt repayment arrangement, consult an appropriate financial adviser or credit counsellor and verify the terms and charges with your lender.”

### Result label

Hindi: “यह केवल गणना है—किसी उत्पाद, लोन या भुगतान का फ़ैसला लेने की सिफ़ारिश नहीं।”

English: “Calculation only — this does not recommend a product, loan or repayment decision.”

The expanded explanation also says that calculations do not assess personal suitability/affordability, do not guarantee outcomes and do not justify stopping payments, taking a loan, transferring a balance or accepting a settlement solely on the displayed result. Actual statements, agreement and written lender terms determine obligations. Users are pointed to appropriate qualified help, not an unverified paid referral or a claim that all debt counsellors require SEBI registration.

## Placement and UX

- Visible at the start of budget and quote calculator dialogs, in the selected interface language.
- Short contextual text repeated beside the results.
- Relevant notice for the minimum-due guide, without blocking ordinary UPI/status checking or reporting suspected unauthorised payments.
- SIA states that it only navigates educational tools; it does not make decisions, negotiate with lenders or evaluate suitability.
- Footer links to an expanded scope/limitations explanation.
- No compulsory checkbox, forced popup, login requirement or user waiver of legal rights.
- No “we can never be liable,” “100% legally safe,” “RBI approved” or “SEBI registered” statement added.

## Behaviour and copy corrections

The quote tool's discovery question formerly asked whether a purchase was within reach. It now asks for the **full purchase cost**, matching the actual function. The tool does not yet assess the user's complete affordability. A lower calculated total is presented as a number comparison, not a recommendation to choose a lender/product.

## Required guardrails for a future debt planner

- Only user-controlled scenarios with visible assumptions and verified, deterministic maths.
- Distinguish someone with affordable surplus from someone unable to meet required payments; do not manufacture a repayment solution for a budget deficit.
- Show options and uncertainties instead of “you must pay this lender first.” Explain overdue/secured obligations and when the tool is insufficient.
- No guarantees of savings, clearance dates, loan approval, fee waivers, debt settlement or credit-score repair.
- No default new-loan/credit-card/referral recommendation for someone in financial distress.
- No lender negotiation, account access, collection of repayments or automated external financial actions.
- Reassess legal scope before personalised live-AI advice, paid counselling, product distribution, lead generation or settlement services. Do not assume this notice covers those later activities.

## Legal review still needed before public launch/expansion

The user's concern cannot be resolved by a footer alone. Before public launch and especially before regulated or personalised commercial services, obtain review from an India-qualified lawyer of the actual flows, claims, affiliations, referral arrangements, entity details, Terms/Privacy and data practices. No lawyer was contacted, no fees were incurred and no legal sign-off has been obtained here. The current notices are factual explanations, not a substitute for that review.
