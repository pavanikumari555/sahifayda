import CarVsUberCalculator from '../CarVsUberCalculator';
import ToolPage, { ToolStructuredData, toolMetadata } from '../tool-page';

const path = '/car-vs-uber/';
const title = 'Car vs Uber/Ola Cost Calculator';
const description = 'Estimate what owning a car costs over five years (EMI, fuel, insurance, parking, upkeep) and compare it with using cabs, autos and public transport in your city.';

export const metadata = toolMetadata({ path, language: 'en', title: 'Car vs Uber/Ola Cost Calculator (India) | SahiFayda', description });

export default function CarVsUberPage() {
  return (
    <ToolPage
      language="en"
      path={path}
      title={title}
      intro="Thinking of buying a car? Put in your own numbers to see an estimate of the full cost of owning one, compared with cabs and public transport for the same travel."
      steps={[
        'Enter the car price and your down payment.',
        'Add your expected monthly distance, fuel price and parking cost.',
        'Enter what you spend each month on cabs, autos or Metro now.',
        'Compare the five-year totals and check which assumptions change the result most.',
      ]}
    >
      <CarVsUberCalculator language="en" />
      <ToolStructuredData language="en" name="SahiFayda Car vs Uber/Ola Cost Calculator" description={description} />
    </ToolPage>
  );
}
