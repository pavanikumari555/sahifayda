import Calculator from '../SmartCardOfferCalculator';
import ToolPage,{toolMetadata,ToolStructuredData} from '../tool-page';
const path='/cashback-discount-calculator/';
const title="Cashback vs Instant Discount Calculator India";
const description="Compare bank discounts and cashback with remaining caps, separate fees and confirmed stacking.";
export const metadata=toolMetadata({path,language:'en',title:title+' | SahiFayda',description});
export default function Page(){return <ToolPage path={path} language="en" title={title} intro={description} steps={["Enter the eligible price and offer rates.","Add remaining caps and fees; confirm stacking only when the terms permit it.","Compare payment today, later cashback and effective cost."]}><Calculator language="en"/><ToolStructuredData language="en" name={title} description={description}/></ToolPage>;}
export const dynamic='force-static';
