import Calculator from '../CreditCardDebtTrapCalculator';
import ToolPage,{toolMetadata,ToolStructuredData} from '../tool-page';
const path='/debt-trap-calculator/';
const title="Credit Card Minimum Due vs EMI Calculator India";
const description="Compare example minimum-due repayment with EMI cost, GST, fees and first-payment budget.";
export const metadata=toolMetadata({path,language:'en',title:title+' | SahiFayda',description});
export default function Page(){return <ToolPage path={path} language="en" title={title} intro={description} steps={["Enter the card outstanding and monthly repayment budget.","Compare simulated minimum payments with 3, 6, 12 and 24-month EMI options.","Check the full bill, first payment and actual bank terms before borrowing."]}><Calculator language="en"/><ToolStructuredData language="en" name={title} description={description}/></ToolPage>;}
export const dynamic='force-static';
