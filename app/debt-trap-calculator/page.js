import CreditCardDebtTrapCalculator from '../CreditCardDebtTrapCalculator';
import ToolPage, { ToolStructuredData, toolMetadata } from '../tool-page';

const path = '/debt-trap-calculator/';
const title = 'Credit Card Minimum Due vs EMI Calculator';
const description = 'See how interest and GST can build up when you pay only the minimum due on a credit card bill, and compare it with 3, 6, 12 or 24-month EMI options.';

export const metadata = toolMetadata({ path, language: 'en', title: 'Credit Card Minimum Due vs EMI Calculator (India) | SahiFayda', description });

export default function DebtTrapCalculatorPage() {
  return (
    <ToolPage
      language="en"
      path={path}
      title={title}
      intro="Paying only the minimum due keeps the card active, but interest keeps running on the rest. Estimate the cost and compare it with converting the bill into an EMI."
      steps={[
        'Enter your outstanding credit card bill.',
        'Enter how much you can pay towards it each month.',
        'Compare minimum due with each EMI tenure: monthly payment, total interest and GST.',
        'Confirm the actual rate, processing fee and foreclosure terms with your card issuer before converting.',
      ]}
    >
      <CreditCardDebtTrapCalculator initialBill={50000} language="en" />
      <ToolStructuredData language="en" name="SahiFayda Credit Card Minimum Due vs EMI Calculator" description={description} />
    </ToolPage>
  );
}
