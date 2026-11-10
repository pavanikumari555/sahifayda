import Calculator from '../EmergencyFundCalculator';
import ToolPage,{toolMetadata,ToolStructuredData} from '../tool-page';
const path='/emergency-fund/';
const title="Emergency Fund Calculator India: Target and Saving Time";
const description="Plan a household emergency buffer using essential expenses, coverage months and accessible savings.";
export const metadata=toolMetadata({path,language:'en',title:title+' | SahiFayda',description});
export default function Page(){return <ToolPage path={path} language="en" title={title} intro={description} steps={["Enter the whole household’s essential monthly expenses.","Choose income type and adjust the buffer months for your risks.","Add current savings and new monthly savings to see the gap and timeline."]}><Calculator language="en"/><ToolStructuredData language="en" name={title} description={description}/></ToolPage>;}
export const dynamic='force-static';
