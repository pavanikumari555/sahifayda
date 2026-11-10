import Calculator from '../../HomeLoanCalculator';
import ToolPage,{toolMetadata,ToolStructuredData} from '../../tool-page';
const path='/home-loan-calculator/';
const title="घर खरीदें या किराए पर रहें? EMI बनाम किराया कैलकुलेटर";
const description="घर की EMI, शुरुआती शुल्क, बढ़ता किराया और निवेश की तुलना अपनी धारणाओं से करें।";
export const metadata=toolMetadata({path,language:'hi',title:title+' | SahiFayda',description});
export default function Page(){return <ToolPage path={path} language="hi" title={title} intro={description} steps={["घर की कीमत, डाउन पेमेंट, ब्याज और अवधि भरें।","मासिक किराया भरें; शुल्क, रखरखाव और वृद्धि की धारणाएँ बदलें।","अंतिम संपत्ति की तुलना करें और अलग returns पर फिर जाँचें।"]}><Calculator language="hi"/><ToolStructuredData language="hi" name={title} description={description}/></ToolPage>;}
export const dynamic='force-static';
