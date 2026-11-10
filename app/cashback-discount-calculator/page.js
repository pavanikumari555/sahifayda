import Calculator from '../SmartCardOfferCalculator';
import ToolPage,{toolMetadata,ToolStructuredData} from '../tool-page';
const path='/cashback-discount-calculator/';
const title="Cashback vs Instant Discount Calculator India";
const description="Enter a purchase price, category and store to compare card examples. Check actual offer terms.";
export const metadata=toolMetadata({path,language:'en',title:title+' | SahiFayda',description});
export default function Page(){return <ToolPage path={path} language="en" title={title} intro={description} steps={["Enter the product price.","Choose the product category and store.","Compare card examples and check the store terms."]}><Calculator language="en"/><ToolStructuredData language="en" name={title} description={description}/></ToolPage>;}
export const dynamic='force-static';
