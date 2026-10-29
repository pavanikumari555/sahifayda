# SIA brain and answer quality

Owner direction, 29 October 2026: improve slow and irrelevant answers, use reviewed knowledge for repeated questions, remember the user's needs and apply useful agent patterns after research.

## What runs now

1. Validate the question locally and on the server. Keep chats in the open component's memory; never put chat text, contacts or generated answers in a shared cache.
2. Use the same `sia-brain.mjs` in the browser and Edge Function. Reviewed explanations cover APR, minimum due, pending UPI, zero balance, FD cards, brokerage/AMC/DP, service meanings and insurance differences. Repeating these questions needs no model call.
3. Match exact current catalogue products and requested cost fields. Answer the requested annual fee, debit-card fee, interest, AMC or segment brokerage directly from the owner-managed record. Never substitute the Amazon shopping guide for the ICICI card. Unknown fields are explicitly unconfirmed; paused/stale products are excluded.
4. Remember displayed product IDs for “isme…” follow-ups. If brokerage needs a segment, ask that one question and retain the broker when the user replies “intraday”. Opening a named broker stays with that broker. Preserve amount, purpose, shopping budget and other structured preferences; reset irrelevant preferences on a genuine topic change.
5. If the catalogue is still loading, wait for the shared in-flight public-data request instead of claiming no products exist. Concurrent components share only that public request, not visitor conversations. Application links remain independently revalidated.
6. For unfamiliar questions, retrieve at most six relevant current public records. The prompt uses the relevant records instead of the former 20,000-character catalogue dump. Match names, category and cost fields; ranking is independent of commission. General service facts and the existing financial observations remain available.
7. On the server, generic FAQ requests need only the service-status check. Product and finance reads run concurrently. Provider configuration/quota calls run only when AI is actually needed. Per-provider timeout is 9 seconds, with the existing configured fallback; the composer preserves the draft on failure/cancel.
8. Reject unsupported numeric duration claims and approval guarantees. An unrelated number in another product is not evidence for a new “last 2–3 years” rule. An uncovered agricultural underwriting question explicitly states the missing reviewed coverage and requests the actual bank/scheme rather than inventing its policy.

## How knowledge changes

Product facts continue to come from Admin → Products, using the existing review dates, visibility, revisions and exact link mapping. Fee changes do not need new hard-coded FAQ amounts. The small general explanation/router module is reviewed source code; it does not silently learn facts from visitor chats. This is a deterministic knowledge router plus limited retrieval and AI fallback, not a newly trained language model or whole-market search engine.

## Research behind this choice

- [Anthropic: Building effective agents](https://www.anthropic.com/research/building-effective-agents) recommends starting with simple composable workflows and adding retrieval/context before more complex autonomous loops. Extra model stages add latency and cost.
- [Microsoft: Application design for AI workloads](https://learn.microsoft.com/en-us/azure/well-architected/ai/application-design) separates knowledge, routing, inference and tools, and discusses caching suitable knowledge fragments. Here only public knowledge requests are coalesced; private responses are not shared.
- [Supabase: Edge Function limits](https://supabase.com/docs/guides/functions/limits) informed bounded calls. The existing authenticated admin and origin/validation boundaries remain in force; no new database permissions or conversion-provider integration was introduced.

For this small reviewed catalogue, bounded text/category/field retrieval is sufficient without a new embedding service, vector database or paid agent framework. More complex questions still depend on provider availability and can remain unanswerable when reviewed evidence is missing.

## Verification and measured limits

132 automated tests pass, including shared-knowledge language variants, exact fees, admin edits, stale/paused exclusions, pronoun and segment follow-ups, shopping memory, privacy, provider grounding and unsupported period/approval rejection. Production export security and noindex checks pass.

Three live endpoint samples before the change: APR 6,077 ms with AI; Kotak debit-card question 1,240 ms with a generic details pointer; misspelled Angle One question 15,176 ms ending in a busy error. First endpoint samples after the change: all reviewed answers, 2,363 / 2,084 / 1,226 ms respectively. These are small network-inclusive samples, not a statistical benchmark or a phone speed guarantee. On the updated browser, these common questions take the local reviewed route with no model/network request after public knowledge is loaded; mobile QA verified the answers and product follow-up at 390 px without horizontal overflow.

A live unfamiliar farm-income question exposed an unsupported period/policy claim during QA. That result was treated as a failure, prompting the coverage-gap route and stricter numeric-period/approval checks. The generated answer was not added to knowledge. Arbitrary AI prose is still not guaranteed correct; absent public evidence must remain a visible limitation.
