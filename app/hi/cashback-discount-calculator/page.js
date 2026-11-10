import Calculator from '../../SmartCardOfferCalculator';
import ToolPage,{toolMetadata,ToolStructuredData} from '../../tool-page';
const path='/cashback-discount-calculator/';
const title="कैशबैक बनाम तुरंत छूट कैलकुलेटर";
const description="खरीदारी की कीमत, सामान और स्टोर चुनकर कार्ड के उदाहरण मिलाएँ। असली ऑफ़र की शर्तें जाँचें।";
export const metadata=toolMetadata({path,language:'hi',title:title+' | SahiFayda',description});
export default function Page(){return <ToolPage path={path} language="hi" title={title} intro={description} steps={["सामान की कीमत भरें।","सामान की श्रेणी और स्टोर चुनें।","कार्ड के उदाहरण मिलाएँ और स्टोर की शर्तें जाँचें।"]}><Calculator language="hi"/><ToolStructuredData language="hi" name={title} description={description}/></ToolPage>;}
export const dynamic='force-static';
