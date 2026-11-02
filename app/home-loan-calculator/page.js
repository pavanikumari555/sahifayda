import HomeLoanCalculator from '../HomeLoanCalculator';
import ToolPage, { ToolStructuredData, toolMetadata } from '../tool-page';

const path = '/home-loan-calculator/';
const title = 'Home Loan EMI vs Rent Calculator';
const description = 'Estimate your home loan EMI, add one-time costs like stamp duty and registration, and compare the long-term cost of buying with continuing to rent.';

export const metadata = toolMetadata({ path, language: 'en', title: 'Home Loan EMI vs Rent Calculator (India): Buy or Rent? | SahiFayda', description });

export default function HomeLoanCalculatorPage() {
  return (
    <ToolPage
      language="en"
      path={path}
      title={title}
      intro="Buying a home is a large, long commitment. Use your own price, loan and rent figures to estimate the EMI and see how buying compares with renting over the years."
      steps={[
        'Enter the home price and your down payment.',
        'Add the interest rate offered to you and the loan tenure.',
        'Enter your current monthly rent, your age and your city.',
        'Compare EMI, total cost and the break-even year, then check the lender’s actual quote and fees.',
      ]}
    >
      <HomeLoanCalculator language="en" />
      <ToolStructuredData language="en" name="SahiFayda Home Loan EMI vs Rent Calculator" description={description} />
    </ToolPage>
  );
}

export const dynamic = 'force-static';
