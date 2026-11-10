import Calculator from '../../EmergencyFundCalculator';
import ToolPage,{toolMetadata,ToolStructuredData} from '../../tool-page';
const path='/emergency-fund/';
const title="इमरजेंसी फंड कैलकुलेटर: कितनी बचत अलग रखें?";
const description="परिवार के जरूरी खर्च, चुने महीने और उपलब्ध बचत से emergency fund का लक्ष्य और समय निकालें।";
export const metadata=toolMetadata({path,language:'hi',title:title+' | SahiFayda',description});
export default function Page(){return <ToolPage path={path} language="hi" title={title} intro={description} steps={["परिवार का कुल जरूरी मासिक खर्च भरें।","आय का प्रकार चुनें और जोखिम के अनुसार buffer महीने बदलें।","पहले से उपलब्ध और हर महीने की नई बचत से कमी और समय देखें।"]}><Calculator language="hi"/><ToolStructuredData language="hi" name={title} description={description}/></ToolPage>;}
export const dynamic='force-static';
