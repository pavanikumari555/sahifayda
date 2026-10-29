# SIA everyday needs review — 29 October 2026

The owner's phone screenshot showed interim speech outside the composer and an unavailable reply to an IT-services business follow-up. The review connects that report with earlier short-answer, memory, current-source and application-link requirements.

## Comparable first-party flows inspected

- [Paisabazaar business-loan eligibility](https://www.paisabazaar.com/business-loan/eligibility/): separates business/product context, eligibility considerations, comparisons and application routes. Useful lesson: understand the specific need before presenting options. We did not copy lender prices or ask for contact information, PAN or consent to a lead form.
- [BankBazaar business-loan flow](https://cobrand.bankbazaar.com/business-loan.html): places product information, comparison and explanatory questions together. Useful lesson: keep details readable outside chat and make the next action clear. Its prices/coverage are not the authority for SahiFayda's current terms.

## Official grounding used

- [Kotak811 terms](https://images.kotak.bank.in/bank/mailers/2026/files/Kotak811_Common_T%26C.pdf): opening funding and ongoing minimum balance are distinct. SIA asks which bank/variant rather than applying one bank's condition to every account.
- [HDFC salary-account FAQs](https://www.hdfc.bank.in/salary-account/regular-salary-account/faq) and [regular salary-account page](https://www.hdfc.bank.in/salary-account/regular-salary-account): salary-account arrangements and salary-credit conditions must be checked with the employer/provider; no universal conversion deadline is invented.
- [HDFC business-loan terms](https://www.hdfc.bank.in/business-loan) and existing RBI/PMMY references in service guides: business vintage and scheme conditions matter; a new business is not an established-business loan applicant by assumption. Document rules, rates, amounts and approval are not fabricated.

## Acceptance cases

| Situation | Expected behavior |
| --- | --- |
| User speaks while mic is running | Words appear in the composer as the current hypothesis; no duplicate text above it and no auto-send |
| User typed a draft before dictation | Preserve that base draft while replacing only this session's interim speech |
| Recognition ends, errors or sends a late empty event | Retain words already visible, make the final draft editable and clear the listening state |
| IT-services business follow-up | Remember sector, purpose, amount, business stage and absence of collateral/turnover; ask only a genuinely missing useful question |
| A bank account is requested without a type | Clarify personal, salary or business use before choosing an account |
| KYC/video verification stops | Identify the failed step and use official provider support; do not ask for identity documents in chat |
| Opening money is requested despite “zero balance” | Explain opening funding versus ongoing balance, then identify the bank/variant |
| Balance charge or loan refusal | Ask the stated charge/rejection reason, not restart a product application interview |
| ITR or salary slip absent | Explain that accepted genuine records depend on the lender; never suggest false employment or documents |
| A question needs AI and both providers fail | Preserve the draft, explain a safe reason category and record only provider/reason codes privately |

The shared reviewed advisor is used by the frontend and server. Unsupported or ambiguous requests still use grounded AI with bounded history. This is not a claim to understand every possible question, to cover the whole market or to decide approval. Project requirements are durable; visitor conversation remains in RAM and is not saved to the database.
