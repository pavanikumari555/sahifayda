import {notFound} from 'next/navigation';
import ProductLibrary from '../../product-library';
import {productCategories} from '../../../supabase/functions/_shared/reviewed-products.mjs';
import '../../products.css';
import {productMetadata} from '../../../lib/product-pages.mjs';
export async function generateMetadata({params}){const {category}=await params;const key=Object.keys(productCategories).find(id=>productCategories[id].slug===category);return key?productMetadata('en',key):{};}
export function generateStaticParams(){return Object.values(productCategories).map(p=>({category:p.slug}));}
export const dynamicParams=false;
export default async function Page({params}){const {category}=await params;const key=Object.keys(productCategories).find(id=>productCategories[id].slug===category);if(!key)notFound();return <ProductLibrary language="en" category={key}/>;}
