import Calculator from '../../SmartCardOfferCalculator';
import ToolPage,{toolMetadata,ToolStructuredData} from '../../tool-page';
const path='/cashback-discount-calculator/';
const title="कैशबैक बनाम तुरंत छूट कैलकुलेटर";
const description="बैंक छूट और cashback की बची cap, अलग शुल्क और stacking से आज का भुगतान और बाद की बचत समझें।";
export const metadata=toolMetadata({path,language:'hi',title:title+' | SahiFayda',description});
export default function Page(){return <ToolPage path={path} language="hi" title={title} intro={description} steps={["योग्य कीमत और offer की दरें भरें।","बची cap और शुल्क भरें; शर्तों में अनुमति हो तभी stacking चुनें।","आज का भुगतान, बाद का cashback और प्रभावी लागत अलग देखें।"]}><Calculator language="hi"/><ToolStructuredData language="hi" name={title} description={description}/></ToolPage>;}
export const dynamic='force-static';
