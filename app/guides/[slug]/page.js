import {notFound} from 'next/navigation';
import GuideArticle,{guideMetadata} from '../../guide-article';
import {guides,guideSlugs} from '../../../lib/guides.mjs';
export const dynamicParams=false;
export function generateStaticParams(){return guideSlugs.map(slug=>({slug}));}
export async function generateMetadata({params}){return guideMetadata((await params).slug,'en');}
export default async function Page({params}){const {slug}=await params;if(!Object.hasOwn(guides,slug))notFound();return <GuideArticle slug={slug} language="en"/>;}
