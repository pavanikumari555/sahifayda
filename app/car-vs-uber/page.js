import Calculator from '../CarVsUberCalculator';
import ToolPage,{toolMetadata,ToolStructuredData} from '../tool-page';
const path='/car-vs-uber/';
const title="Car vs Uber/Ola Cost Calculator India";
const description="Compare car ownership after resale with your complete cab, auto and Metro cost over the same period.";
export const metadata=toolMetadata({path,language:'en',title:title+' | SahiFayda',description});
export default function Page(){return <ToolPage path={path} language="en" title={title} intro={description} steps={["Enter on-road price, down payment, loan rate and period.","Add distance, mileage, running costs and expected resale.","Compare with your full transport budget for the same travel."]}><Calculator language="en"/><ToolStructuredData language="en" name={title} description={description}/></ToolPage>;}
export const dynamic='force-static';
