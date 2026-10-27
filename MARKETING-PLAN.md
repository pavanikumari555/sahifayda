# SahiFayda — marketing requirements and working formats

Saved: 27 October 2026, Asia/Calcutta. User explicitly requested attractive, useful English + Devanagari Hindi content for Instagram, Facebook Page, Telegram and WhatsApp Channel. This is a content/design plan, not an activated campaign or schedule.

## Publishing routes

| Destination | Planned route | Current state |
|---|---|---|
| Instagram professional account | Buffer | Account identity and connection pending |
| Facebook Page | Buffer | Exact Page and connection pending |
| Telegram channel | Direct bot integration | Exact channel and bot authorization pending |
| WhatsApp Channel | Manual channel publishing for now | Buffer currently does not support WhatsApp; no supported Channel automation established |

Buffer's official supported-channel list explicitly excludes WhatsApp and Telegram. Do not confuse WhatsApp Business customer messaging with WhatsApp Channel publishing, and do not claim an API enum proves usable publishing support. Recheck support before integration.
Source: https://support.buffer.com/articles/connecting-your-channels-to-buffer-HvWLgAJvL9

## Design system

- Brand palette follows the website: forest #245b48, ink #17352d, cream #fbfcf6, lime #d1e78e; occasional sand for comparisons.
- Strong Devanagari headline, short English anchor, one main visual idea. Bilingual does not mean duplicating a long article twice on a single image.
- Use Noto Sans Devanagari for reliable Hindi rendering and Manrope/DM Sans for English. Keep Hindi matras and line spacing intact.
- Logical design canvases: portrait feed 1080×1350, square summary 1080×1080, story/reel cover 1080×1920. These are design targets; verify each platform's current publishing specs at export.
- Place critical text away from edges and story UI. Keep source/assumption text readable on phones. Create a new composition for each aspect ratio instead of stretching or blindly cropping.
- No fake testimonials, partner logos, earnings, guaranteed returns, universal savings or urgency. Sample calculations must say they are hypothetical.

## Six reusable formats

1. **One decision, two quotes** — visual A/B table: EMI, duration, down payment, separate fees, total payment. Show the trade-off, not a blanket recommendation.
2. **Monthly money snapshot** — income → spending → remaining balance, with a simple category checklist. Explain approximate inputs and irregular expenses.
3. **Before-you-buy checklist** — three clear checks and an example. Applicable to phones, appliances and vehicles; no live prices claimed.
4. **Myth / fact** — one narrowly defined misconception, a short correction and a practical next action. Credit-card claims need the issuer's current terms before publication.
5. **One-question story / reel cover** — hook or quiz, followed by an answer card. No fake polls or invented audience responses.
6. **Channel digest** — compact Telegram/WhatsApp text: problem, worked example, action, assumptions, source, relevant tool link only once public.

The companion HTML is a responsive design board with six editable, code-based concept layouts. It is not a raster export pack or a Buffer-ready upload, and no individual marketing PNG/video has been exported yet.

## Initial content batch

### A — छोटी EMI, बड़ा कुल भुगतान?

English anchor: A smaller EMI can cost more overall.

Hypothetical same-purchase example:
- A: ₹30,000 down payment + ₹3,400 × 24 months + ₹2,000 separate fees = ₹1,13,600.
- B: ₹30,000 down payment + ₹2,500 × 36 months + ₹1,000 separate fees = ₹1,21,000.
- Difference: ₹7,400. B has the lower EMI and higher entered total.

Caption draft: “EMI छोटी दिख रही है? कुल भुगतान भी जोड़ें। इस काल्पनिक उदाहरण में B की EMI कम है, लेकिन पूरा भुगतान ₹7,400 ज़्यादा है। अपनी महीने की भुगतान क्षमता और बाकी शुल्क भी जाँचें। / Compare the full cost and monthly affordability before choosing.”

CTA after the tool is public: “अपने दोनों कोटेशन साथ रखकर तुलना करें।” Until then: educational post only; no unlaunched link.

### B — हर छोटी खरीद लिखना ज़रूरी नहीं

English anchor: Start with an approximate monthly picture.

Income ₹50,000; entered spending ₹38,000; remaining ₹12,000. Illustrative, not a promised saving.

Caption draft: “घर, राशन, EMI, बिल और बाकी खर्च का लगभग महीना भर का हिसाब लिखें। खरीद का खर्च गिन लिया है तो उसी कार्ड का बिल फिर से न जोड़ें। बची रकम में से अनियमित बिल और ज़रूरी बचत भी सोचें। / A rough budget can help you start; it is not a complete financial plan.”

### C — खरीदने से पहले ये तीन बातें

English anchor: Price. Fees. Affordability.

Caption draft: “सिर्फ़ छूट नहीं—आख़िरी देय कीमत देखें। EMI है तो अलग शुल्क और पूरा भुगतान जोड़ें। फिर सोचें: हर महीने यह भुगतान आराम से कर पाएँगे? / Check the final price, total repayment and monthly affordability.”

### D — Minimum due ≠ full bill

Caption draft: “केवल न्यूनतम देय भरने पर बाकी बिल पर ब्याज या अन्य शुल्क लग सकते हैं। कुल देय, तारीख और अपने कार्ड की मौजूदा शर्तें पढ़ें। / Read your issuer's current terms; minimum due is not the same as full repayment.”
Publication condition: add the exact issuer's official source and review date before publishing a product-specific illustration. Do not attach invented interest calculations.

### E — Which quote has the lower total?

Story sequence: 1) A ₹3,400 × 24; B ₹2,500 × 36; same down payment, stated separate fees. 2) Reveal totals and ₹7,400 difference. 3) Explain affordability and excluded costs. Never show only EMI and ask the user to infer missing fees.

### F — Telegram / WhatsApp digest

“आज की पैसे वाली समझ 💡\nछोटी EMI हमेशा कम कुल खर्च नहीं होती।\n\nकाल्पनिक उदाहरण: समान ₹30,000 शुरुआती भुगतान के साथ A का कुल ₹1,13,600 और B का ₹1,21,000 है। A में ₹2,000 और B में ₹1,000 अलग शुल्क शामिल हैं।\n\nअगला कदम: EMI × महीने + शुरुआती भुगतान + अलग शुल्क जोड़ें। फिर अपनी महीने की भुगतान क्षमता देखें। बाकी बीमा/अंतिम किस्त/शुल्क छूटे हों तो उन्हें भी जोड़ना होगा।\n\nEnglish: Compare total payment and monthly affordability together.\n— SahiFayda”

## Workflow to implement later

Problem → approved source → checked calculation → bilingual copy → channel-specific artwork/caption/alt text → review → approved queue → Buffer or direct Telegram → recorded result.

- Default draft state; no credentials, connected channels, scheduled jobs, paid promotion or automatic posting configured now.
- User's later channel identity and posting-scope authorization are needed before activation. Marketing pause is independent from tool availability and SIA pause.
- Use source/check dates, copy version, campaign ID, target channel, asset variants and posting result. An idempotency key prevents duplicate retries after an uncertain API result.
- On outdated financial terms, pause the affected draft and request review. No automatic re-publication of stale facts.
- Use anonymised examples only; no user expense history, testimonials or private chats in marketing.
- Measure whether users reach and complete a useful tool; saves, clicks and reach are supporting metrics, not proof of user financial benefit. Do not promise reach or traffic.
- Initial editorial rhythm for later approval: two useful educational posts and one practical example per week, reused thoughtfully across channels. This is a proposal, not a scheduled automation.

## Order remains

Local website review first → secure admin and SIA work → public release when user asks → verified channel connections → approved marketing activation. Domain purchase is deferred by the user.

## Visual direction v0.2 — 27 October 2026

User requested a more attractive original design informed by Mounteyes and PublicNaukri, plus light/dark themes. Both reference homepages were visually inspected. Adopted a dark grid hero, clearer hierarchy and strong actions; retained SahiFayda's own layout, money examples and teal/amber identity. No reference code, logos, text or images copied.

Website: navy/teal hero, dashboard illustration, revised cards, complete light/dark tokens including forms, result and error states. Header toggle saves only a local theme preference; default light. No provider credentials or financial inputs stored. Theme remains on reload.

Marketing: all six concepts restyled, with distinct compositions/colours and bilingual text. Design board supports light and dark editions. HTML now uses sibling CSS/JS files; keep the three saved files together. Canvas heights are flexible for readable bilingual explanations; final platform-specific image/video exports still require deliberate composition and review.

Browser checked theme switching, reload persistence, dark calculator result, Hindi homepage and social-card overflow at narrow width. No social posting or website deployment occurred.
