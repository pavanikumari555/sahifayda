import CreditCardDebtTrapCalculator from '../../CreditCardDebtTrapCalculator';
import ToolPage, { ToolStructuredData, toolMetadata } from '../../tool-page';

const path = '/debt-trap-calculator/';
const title = 'क्रेडिट कार्ड: मिनिमम ड्यू बनाम EMI कैलकुलेटर';
const description = 'क्रेडिट कार्ड बिल पर सिर्फ़ मिनिमम ड्यू भरने से ब्याज और GST कैसे बढ़ता है, देखें और इसकी तुलना 3, 6, 12 या 24 महीने की EMI से करें।';

export const metadata = toolMetadata({ path, language: 'hi', title: 'क्रेडिट कार्ड मिनिमम ड्यू बनाम EMI कैलकुलेटर | सहीफ़ायदा', description });

export default function DebtTrapCalculatorPageHi() {
  return (
    <ToolPage
      language="hi"
      path={path}
      title={title}
      intro="सिर्फ़ मिनिमम ड्यू भरने से कार्ड चालू रहता है, पर बाकी रकम पर ब्याज लगता रहता है। अनुमान लगाएँ कि इसका खर्च कितना होगा और बिल को EMI में बदलने से तुलना करें।"
      steps={[
        'अपने क्रेडिट कार्ड का बकाया बिल भरें।',
        'हर महीने इसके लिए कितना भर सकते हैं, वह रकम भरें।',
        'मिनिमम ड्यू और हर EMI अवधि की तुलना करें: महीने की किस्त, कुल ब्याज और GST।',
        'EMI में बदलने से पहले असली दर, प्रोसेसिंग फ़ीस और जल्दी चुकाने की शर्तें अपने बैंक से पक्की करें।',
      ]}
    >
      <CreditCardDebtTrapCalculator initialBill={50000} language="hi" />
      <ToolStructuredData language="hi" name="सहीफ़ायदा क्रेडिट कार्ड मिनिमम ड्यू बनाम EMI कैलकुलेटर" description={description} />
    </ToolPage>
  );
}
