import HomeLoanCalculator from '../../HomeLoanCalculator';
import ToolPage, { ToolStructuredData, toolMetadata } from '../../tool-page';

const path = '/home-loan-calculator/';
const title = 'होम लोन EMI बनाम किराया कैलकुलेटर';
const description = 'होम लोन की EMI का अनुमान लगाएँ, स्टाम्प ड्यूटी और रजिस्ट्री जैसे एक बार के खर्च जोड़ें, और लंबे समय में घर खरीदने व किराये पर रहने के खर्च की तुलना करें।';

export const metadata = toolMetadata({ path, language: 'hi', title: 'होम लोन EMI बनाम किराया कैलकुलेटर: घर खरीदें या किराये पर रहें? | सहीफ़ायदा', description });

export default function HomeLoanCalculatorPageHi() {
  return (
    <ToolPage
      language="hi"
      path={path}
      title={title}
      intro="घर खरीदना बड़ा और लंबे समय का फ़ैसला है। अपनी कीमत, लोन और किराये के आँकड़े भरकर EMI का अनुमान लगाएँ और देखें कि सालों में खरीदना और किराये पर रहना कैसे तुलना करते हैं।"
      steps={[
        'घर की कीमत और अपना डाउन पेमेंट भरें।',
        'आपको मिली ब्याज दर और लोन की अवधि भरें।',
        'अभी का मासिक किराया, अपनी उम्र और शहर भरें।',
        'EMI, कुल खर्च और ब्रेक-ईवन साल मिलाएँ, फिर बैंक का असली कोटेशन और फ़ीस जाँचें।',
      ]}
    >
      <HomeLoanCalculator language="hi" />
      <ToolStructuredData language="hi" name="सहीफ़ायदा होम लोन EMI बनाम किराया कैलकुलेटर" description={description} />
    </ToolPage>
  );
}

export const dynamic = 'force-static';
