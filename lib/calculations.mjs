export function amount(value) {
  const n = Number(value);
  if (value === '' || !Number.isFinite(n) || n < 0 || n > 1e10) throw new Error('Enter an amount between 0 and 10,000,000,000.');
  return Math.round(n * 100) / 100;
}
export function monthlyReview(income, expenses) {
  const monthlyIncome = amount(income);
  if (monthlyIncome <= 0) throw new Error('Enter a monthly income greater than zero.');
  const spending = expenses.map(amount);
  const total = Math.round(spending.reduce((sum, value) => sum + value, 0) * 100) / 100;
  const balance = Math.round((monthlyIncome - total) * 100) / 100;
  return { income: monthlyIncome, total, balance, share: total / monthlyIncome, spending };
}
export function quoteTotal(quote) {
  const down = amount(quote.down), emi = amount(quote.emi), months = amount(quote.months), fees = amount(quote.fees);
  if (!Number.isInteger(months) || months < 1 || months > 600) throw new Error('Tenure must be a whole number from 1 to 600 months.');
  return { down, emi, months, fees, total: Math.round((down + emi * months + fees) * 100) / 100 };
}
