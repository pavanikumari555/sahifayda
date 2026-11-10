import EmergencyFundCalculator from '../../EmergencyFundCalculator';
import ToolPage, { ToolStructuredData, toolMetadata } from '../../tool-page';

const path = '/emergency-fund/';
const title = 'इमरजेंसी फ़ंड कैलकुलेटर';
const description = 'महीने के खर्च, परिवार के आकार और आय कितनी नियमित है, इसके आधार पर अनुमान लगाएँ कि मुश्किल समय के लिए कितना पैसा अलग रखना चाहिए।';

export const metadata = toolMetadata({ path, language: 'hi', title: 'इमरजेंसी फ़ंड कैलकुलेटर: कितना पैसा अलग रखें | सहीफ़ायदा', description });

export default function EmergencyFundPageHi() {
  return (
    <ToolPage
      language="hi"
      path={path}
      title={title}
      intro="इमरजेंसी फ़ंड वह पैसा है जो नौकरी छूटने, इलाज या परिवार की अचानक ज़रूरत के लिए अलग रखा जाता है। अपने खर्च भरकर लक्ष्य का अनुमान लगाएँ और देखें कि अभी कितना बाकी है।"
      steps={[
        'महीने के ज़रूरी खर्च भरें, जिनमें EMI और किराया भी शामिल हों।',
        'परिवार के सदस्यों की संख्या और आय का प्रकार (नौकरी, अपना काम या फ़्रीलांस) चुनें।',
        'अभी आपके पास जितना इमरजेंसी का पैसा है और हर महीने कितनी बचत कर सकते हैं, वह भरें।',
        'सुझाया गया लक्ष्य, कमी और उसे जोड़ने में लगभग कितना समय लगेगा, यह देखें।',
      ]}
    >
      <EmergencyFundCalculator language="hi" />
      <ToolStructuredData language="hi" name="सहीफ़ायदा इमरजेंसी फ़ंड कैलकुलेटर" description={description} />
    </ToolPage>
  );
}
