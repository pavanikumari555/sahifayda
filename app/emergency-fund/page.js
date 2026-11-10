import EmergencyFundCalculator from '../EmergencyFundCalculator';
import ToolPage, { ToolStructuredData, toolMetadata } from '../tool-page';

const path = '/emergency-fund/';
const title = 'Emergency Fund Calculator';
const description = 'Estimate how much emergency money to keep aside based on your monthly expenses, family size and how steady your income is.';

export const metadata = toolMetadata({ path, language: 'en', title: 'Emergency Fund Calculator (India): How Much to Keep Aside | SahiFayda', description });

export default function EmergencyFundPage() {
  return (
    <ToolPage
      language="en"
      path={path}
      title={title}
      intro="An emergency fund is money kept separately for job loss, medical bills or urgent family needs. Use your own expenses to estimate a target and see how far you are from it."
      steps={[
        'Enter your essential monthly expenses, including EMIs and rent.',
        'Choose your family size and type of income (salaried, self-employed or freelance).',
        'Add the emergency money you already have and how much you can save each month.',
        'Review the suggested target, the gap and roughly how long it may take to build.',
      ]}
    >
      <EmergencyFundCalculator language="en" />
      <ToolStructuredData language="en" name="SahiFayda Emergency Fund Calculator" description={description} />
    </ToolPage>
  );
}
