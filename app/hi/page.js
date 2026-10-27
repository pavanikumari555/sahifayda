import Home from '../ui';
import { pageMetadata } from '../../lib/site-config.mjs';
export const metadata = pageMetadata('hi');
export default function Page() { return <Home language="hi" />; }
