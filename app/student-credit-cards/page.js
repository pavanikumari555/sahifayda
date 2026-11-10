import StudentCardFinder from '../StudentCardFinder';
import ToolPage, { ToolStructuredData, toolMetadata } from '../tool-page';

const path = '/student-credit-cards/';
const title = 'First Credit Card Finder for Students';
const description = 'No salary slip or credit history yet? Understand FD-backed (secured) credit cards: the deposit needed, fees, and how on-time full payments help build a credit record.';

export const metadata = toolMetadata({ path, language: 'en', title: 'Student & First Credit Card Finder: FD-Backed Cards Explained | SahiFayda', description });

export default function StudentCreditCardsPage() {
  return (
    <ToolPage
      language="en"
      path={path}
      title={title}
      intro="Students and people without income proof often start with a card backed by a fixed deposit. Answer a few questions to see which routes fit, what they cost and what to check before applying."
      steps={[
        'Choose the profile that matches you, for example student or no income proof.',
        'Enter how much you can keep in a fixed deposit.',
        'Read each option’s deposit, fees and conditions on the provider’s current terms.',
        'If you get a card, keep spending low and pay the full bill on time every month.',
      ]}
    >
      <StudentCardFinder language="en" />
      <ToolStructuredData language="en" name="SahiFayda Student & First Credit Card Finder" description={description} />
    </ToolPage>
  );
}
