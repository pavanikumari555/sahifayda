// Pure browser-side calculations. Empty/non-finite values never become a made-up default.
const inRange = (n, min, max) => typeof n === 'number' && Number.isFinite(n) && n >= min && n <= max;
export const numericInput = value => (typeof value !== 'number' && (typeof value !== 'string' || value.trim() === '')) ? NaN : Number(value);

export function monthlyPayment(principal, annualRate, months) {
  if (!inRange(principal, 0, 1e10) || !inRange(annualRate, 0, 100) || !Number.isInteger(months) || months < 1 || months > 1200) return null;
  if (principal === 0) return 0;
  if (annualRate === 0) return principal / months;
  const r = annualRate / 1200;
  return principal * r / (1 - Math.pow(1 + r, -months));
}

export function homeComparison({ homePrice, downPayment, interestRate, tenure, currentRent,
  registryRate = 1, stampRate = 7, maintenance = 3000, appreciation = 6, rentGrowth = 5, investmentRate = 8 }) {
  if (!inRange(homePrice, 1, 1e10) || !inRange(downPayment, 0, homePrice) || !inRange(interestRate, 0, 100)
    || !Number.isInteger(tenure) || !inRange(tenure, 1, 50) || !inRange(currentRent, 0, 1e8)
    || !inRange(registryRate, 0, 30) || !inRange(stampRate, 0, 30) || !inRange(maintenance, 0, 1e8)
    || !inRange(appreciation, -50, 50) || !inRange(rentGrowth, -50, 50) || !inRange(investmentRate, -50, 50)) return null;
  const months = tenure * 12, loanAmount = homePrice - downPayment;
  const emi = monthlyPayment(loanAmount, interestRate, months);
  const registryFees = homePrice * registryRate / 100, stampDuty = homePrice * stampRate / 100;
  const upfrontCosts = registryFees + stampDuty;
  const totalPayment = emi * months, totalInterest = Math.max(0, totalPayment - loanAmount);
  // Same initial funds and monthly budget for both choices. The cheaper side invests
  // the difference at each month end. Costs are not deducted twice from terminal wealth.
  const growth = Math.pow(1 + investmentRate / 100, 1 / 12);
  let renterInvestments = downPayment + upfrontCosts, buyerInvestments = 0;
  let balance = loanAmount, totalRentPaid = 0, firstBuyLeadMonth = null, buyerWealth = 0;
  for (let month = 1; month <= months; month++) {
    const rent = currentRent * Math.pow(1 + rentGrowth / 100, Math.floor((month - 1) / 12));
    const ownerMonthlyCost = emi + maintenance;
    renterInvestments = renterInvestments * growth + Math.max(0, ownerMonthlyCost - rent);
    buyerInvestments = buyerInvestments * growth + Math.max(0, rent - ownerMonthlyCost);
    totalRentPaid += rent;
    balance = Math.max(0, balance * (1 + interestRate / 1200) - emi);
    if (month === months) balance = 0;
    buyerWealth = homePrice * Math.pow(1 + appreciation / 100, month / 12) - balance + buyerInvestments;
    if (firstBuyLeadMonth === null && buyerWealth >= renterInvestments) firstBuyLeadMonth = month;
  }
  return { loanAmount, emi, totalPayment, totalInterest, registryFees, stampDuty, upfrontCosts,
    totalMaintenance: maintenance * months, totalInvestment: downPayment + upfrontCosts + totalPayment + maintenance * months,
    totalRentPaid, futureHomeValue: homePrice * Math.pow(1 + appreciation / 100, tenure),
    buyerInvestments, buyerWealth, renterWealth: renterInvestments, firstBuyLeadMonth };
}

export function debtComparison(bill, monthlyBudget) {
  if (!inRange(bill, 1, 1e8) || !inRange(monthlyBudget, 0, 1e8)) return null;
  // Explicit example rule: 5% of opening principal + interest/GST, minimum ₹500,
  // capped at the full balance. No new spending, late fees or missed payments.
  let balance = bill, minimumTotal = 0, minimumMonths = 0, firstMinimum = 0;
  while (balance > 0.005 && minimumMonths < 1200) {
    const charge = balance * 0.035 * 1.18;
    const payment = Math.min(balance + charge, Math.max(500, balance * 0.05 + charge));
    if (minimumMonths === 0) firstMinimum = payment;
    balance = Math.max(0, balance + charge - payment);
    minimumTotal += payment;
    minimumMonths++;
  }
  const processingFee = Math.max(bill * 0.015, 199) * 1.18;
  const options = [3, 6, 12, 24].map(months => {
    const emi = monthlyPayment(bill, 15, months);
    const interest = emi * months - bill, gst = interest * 0.18;
    // EMI interest declines; the first month has the largest GST. Include the
    // processing fee in the first-month cash need, rather than hiding it.
    const firstMonthPayment = emi + bill * (0.15 / 12) * 0.18 + processingFee;
    return { months, emi, firstMonthPayment, processingFee, interest, gst,
      totalExtraCost: interest + gst + processingFee, totalPaid: emi * months + gst + processingFee,
      affordable: firstMonthPayment <= monthlyBudget };
  });
  const recommended = options.find(option => option.affordable)?.months ?? null;
  return { firstMinimum, minimumTotal, minimumMonths, minimumInterestAndTax: minimumTotal - bill,
    minimumAffordable: firstMinimum <= monthlyBudget, options, recommended };
}

export function emergencyPlan(expenses, currentFund, savings, jobType) {
  if (!inRange(expenses, 1, 1e8) || !inRange(currentFund, 0, 1e10) || !inRange(savings, 0, 1e8)
    || !['salaried', 'self_employed', 'freelance'].includes(jobType)) return null;
  const months = { salaried: 6, self_employed: 9, freelance: 12 }[jobType];
  const target = expenses * months, gap = target - currentFund;
  return { months, target, gap, monthsToTarget: gap <= 0 ? 0 : savings > 0 ? Math.ceil(gap / savings) : null };
}

export function shoppingSavings({ price, discountRate, discountCap, cashbackRate, cashbackCap, fee, stackable }) {
  if (!inRange(price, 1, 1e9) || !inRange(discountRate, 0, 100) || !inRange(cashbackRate, 0, 100)
    || !inRange(discountCap, 0, 1e9) || !inRange(cashbackCap, 0, 1e9) || !inRange(fee, 0, 1e9)) return null;
  const discount = Math.min(price * discountRate / 100, discountCap);
  const upfrontPrice = price - discount;
  // Without explicit confirmation, do not add rewards to the discount. Calculate
  // cashback separately as an alternative, based on the original price.
  const cashback = Math.min((stackable ? upfrontPrice : price) * cashbackRate / 100, cashbackCap);
  const combined = stackable ? discount + cashback : Math.max(discount, cashback);
  return { discount, upfrontPrice, cashback, benefit: combined, netSaving: combined - fee,
    effectiveCost: price - combined + fee };
}

export function eligibleExamples(cards, amount) {
  return inRange(amount, 0, 1e9) ? cards.filter(card => amount >= card.minFd) : [];
}
