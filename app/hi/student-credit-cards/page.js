import StudentCardFinder from '../../StudentCardFinder';
import ToolPage, { ToolStructuredData, toolMetadata } from '../../tool-page';

const path = '/student-credit-cards/';
const title = 'स्टूडेंट्स के लिए पहला क्रेडिट कार्ड';
const description = 'सैलरी स्लिप या क्रेडिट हिस्ट्री नहीं है? FD पर मिलने वाले (सिक्योर्ड) क्रेडिट कार्ड समझें: कितनी FD चाहिए, फ़ीस क्या है और समय पर पूरा बिल भरने से क्रेडिट रिकॉर्ड कैसे बनता है।';

export const metadata = toolMetadata({ path, language: 'hi', title: 'स्टूडेंट्स और पहला क्रेडिट कार्ड: FD वाले कार्ड की आसान जानकारी | सहीफ़ायदा', description });

export default function StudentCreditCardsPageHi() {
  return (
    <ToolPage
      language="hi"
      path={path}
      title={title}
      intro="स्टूडेंट्स और जिनके पास आय का सबूत नहीं है, वे अक्सर FD पर मिलने वाले कार्ड से शुरुआत करते हैं। कुछ सवालों के जवाब दें और देखें कि कौन-से विकल्प आपके काम के हैं, उनका खर्च क्या है और आवेदन से पहले क्या जाँचना है।"
      steps={[
        'अपनी स्थिति चुनें, जैसे स्टूडेंट या आय का सबूत नहीं।',
        'FD में कितना पैसा रख सकते हैं, वह भरें।',
        'हर विकल्प की FD, फ़ीस और शर्तें बैंक की मौजूदा शर्तों में पढ़ें।',
        'कार्ड मिलने पर खर्च कम रखें और हर महीने पूरा बिल समय पर भरें।',
      ]}
    >
      <StudentCardFinder language="hi" />
      <ToolStructuredData language="hi" name="सहीफ़ायदा स्टूडेंट क्रेडिट कार्ड फ़ाइंडर" description={description} />
    </ToolPage>
  );
}
