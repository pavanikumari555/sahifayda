import ProductLibrary from '../../product-library';
import '../../products.css';
import {productMetadata} from '../../../lib/product-pages.mjs';
export const metadata=productMetadata('hi');
export default function Page(){return <ProductLibrary language="hi"/>;}
