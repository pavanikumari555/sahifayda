import Calculator from '../../StudentCardFinder';
import ToolPage,{toolMetadata,ToolStructuredData} from '../../tool-page';
const path='/student-credit-cards/';
const title="पहला Student FD क्रेडिट कार्ड: जमा और शुल्क तुलना";
const description="अपनी FD राशि को सीमित समीक्षित उत्पादों की न्यूनतम जमा, शुल्क और शर्तों से मिलाएँ।";
export const metadata=toolMetadata({path,language:'hi',title:title+' | SahiFayda',description});
export default function Page(){return <ToolPage path={path} language="hi" title={title} intro={description} steps={["योग्य FD में रख सकने वाली राशि भरें।","जमा की शर्त से मेल खाते सीमित समीक्षित उदाहरण पढ़ें।","आवेदन से पहले शुल्क, KYC, मंजूरी और official शर्तें जाँचें।"]}><Calculator language="hi"/><ToolStructuredData language="hi" name={title} description={description}/></ToolPage>;}
export const dynamic='force-static';
