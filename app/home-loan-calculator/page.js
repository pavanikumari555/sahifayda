import Calculator from '../HomeLoanCalculator';
import ToolPage,{toolMetadata,ToolStructuredData} from '../tool-page';
const path='/home-loan-calculator/';
const title="Rent vs Buy Calculator India: Home EMI vs Rent";
const description="Compare home loan EMI, upfront fees, rent growth and invested savings using editable assumptions.";
export const metadata=toolMetadata({path,language:'en',title:title+' | SahiFayda',description});
export default function Page(){return <ToolPage path={path} language="en" title={title} intro={description} steps={["Enter home price, down payment, loan rate and tenure.","Add current rent; edit local fees, maintenance and growth assumptions.","Compare final wealth and try different returns before deciding."]}><Calculator language="en"/><ToolStructuredData language="en" name={title} description={description}/></ToolPage>;}
export const dynamic='force-static';
