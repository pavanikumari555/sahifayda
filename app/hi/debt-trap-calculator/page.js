import Calculator from '../../CreditCardDebtTrapCalculator';
import ToolPage,{toolMetadata,ToolStructuredData} from '../../tool-page';
const path='/debt-trap-calculator/';
const title="क्रेडिट कार्ड Minimum Due बनाम EMI कैलकुलेटर";
const description="Minimum due भरने और EMI के ब्याज, GST, शुल्क और पहले भुगतान की तुलना करें।";
export const metadata=toolMetadata({path,language:'hi',title:title+' | SahiFayda',description});
export default function Page(){return <ToolPage path={path} language="hi" title={title} intro={description} steps={["कार्ड का बकाया और मासिक बजट भरें।","Minimum due को 3, 6, 12 और 24 महीने की उदाहरण EMI से तुलना करें।","नया कर्ज लेने से पहले पूरा बिल, पहला भुगतान और बैंक की असली शर्तें देखें।"]}><Calculator language="hi"/><ToolStructuredData language="hi" name={title} description={description}/></ToolPage>;}
export const dynamic='force-static';
