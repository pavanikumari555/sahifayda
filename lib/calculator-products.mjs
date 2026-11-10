// Small reviewed subset, not a national eligibility feed. No commercial links.
export const calculatorReview = '2026-11-10';
export const calculatorRecheck = '2026-12-10';
export const fdSource = 'https://www.idfcfirst.bank.in/credit-card/credit-card-against-fixed-deposits';
export const fdCards = [
  { id: 'idfc-first-earn', name: 'IDFC FIRST EA₹N', minFd: 5000,
    en: 'Virtual RuPay card. Published regular joining and annual fee: ₹499 + GST each. The same page advertises a limited joining-fee offer and conditional annual waiver; confirm the offer in your application. Deposit matching alone does not confirm approval.',
    hi: 'वर्चुअल RuPay कार्ड। प्रकाशित सामान्य जॉइनिंग और सालाना शुल्क: दोनों ₹499 + GST। उसी पेज पर सीमित जॉइनिंग ऑफर और शर्तों पर सालाना शुल्क माफी भी है; आवेदन में पुष्टि करें। FD राशि मिलना मंजूरी नहीं है।' },
  { id: 'idfc-first-wow', name: 'IDFC FIRST WOW!', minFd: 20000,
    en: 'No joining or annual fee in the reviewed FAQ. Applicant must be 18+, meet residence, location, KYC and eligible individual-FD conditions. Check the final limit and other charges with the bank.',
    hi: 'समीक्षित FAQ में जॉइनिंग और सालाना शुल्क नहीं है। 18+ उम्र, निवास, सेवा-क्षेत्र, KYC और व्यक्तिगत FD की शर्तें लागू हैं। अंतिम सीमा व दूसरे शुल्क बैंक से जाँचें।' },
];
export function reviewedFdCards(amount, today = new Date().toISOString().slice(0, 10)) {
  if (today < calculatorReview || today > calculatorRecheck || !Number.isFinite(amount) || amount < 0 || amount > 1e9) return [];
  return fdCards.filter(card => amount >= card.minFd);
}
