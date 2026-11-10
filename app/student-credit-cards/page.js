import Calculator from '../StudentCardFinder';
import ToolPage,{toolMetadata,ToolStructuredData} from '../tool-page';
const path='/student-credit-cards/';
const title="Student and First FD Credit Card Finder India";
const description="Compare your FD budget with a limited reviewed set of deposit requirements, fees and conditions.";
export const metadata=toolMetadata({path,language:'en',title:title+' | SahiFayda',description});
export default function Page(){return <ToolPage path={path} language="en" title={title} intro={description} steps={["Enter the amount you can keep in an eligible FD.","Read the limited reviewed examples that meet the deposit threshold.","Check fees, KYC, bank approval and the official terms before applying."]}><Calculator language="en"/><ToolStructuredData language="en" name={title} description={description}/></ToolPage>;}
export const dynamic='force-static';
