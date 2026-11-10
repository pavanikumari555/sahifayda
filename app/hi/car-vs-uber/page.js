import CarVsUberCalculator from '../../CarVsUberCalculator';
import ToolPage, { ToolStructuredData, toolMetadata } from '../../tool-page';

const path = '/car-vs-uber/';
const title = 'कार बनाम Uber/Ola खर्च कैलकुलेटर';
const description = 'पाँच साल में अपनी कार का खर्च (EMI, पेट्रोल, बीमा, पार्किंग, रखरखाव) का अनुमान लगाएँ और उसकी तुलना कैब, ऑटो और मेट्रो के खर्च से करें।';

export const metadata = toolMetadata({ path, language: 'hi', title: 'कार बनाम Uber/Ola खर्च कैलकुलेटर | सहीफ़ायदा', description });

export default function CarVsUberPageHi() {
  return (
    <ToolPage
      language="hi"
      path={path}
      title={title}
      intro="कार खरीदने की सोच रहे हैं? अपने आँकड़े भरें और देखें कि कार रखने का पूरा खर्च लगभग कितना बनता है, और उतने ही सफ़र के लिए कैब या मेट्रो में कितना लगता।"
      steps={[
        'कार की कीमत और अपना डाउन पेमेंट भरें।',
        'महीने में कितने किलोमीटर चलेंगे, पेट्रोल का दाम और पार्किंग का खर्च लिखें।',
        'अभी हर महीने कैब, ऑटो या मेट्रो पर कितना खर्च होता है, वह भरें।',
        'पाँच साल का कुल खर्च मिलाएँ और देखें कि कौन-सी बात नतीजे को सबसे ज़्यादा बदलती है।',
      ]}
    >
      <CarVsUberCalculator language="hi" />
      <ToolStructuredData language="hi" name="सहीफ़ायदा कार बनाम Uber/Ola खर्च कैलकुलेटर" description={description} />
    </ToolPage>
  );
}
