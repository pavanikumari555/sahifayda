import InfoPage, { infoMetadata } from '../info-page';
import { infoSlugs } from '../../lib/info-pages.mjs';
export const dynamicParams=false;
export const dynamic='force-static';
export function generateStaticParams(){return infoSlugs.map(info=>({info}));}
export async function generateMetadata({params}){const {info}=await params;return infoMetadata(info,'en');}
export default async function Page({params}){const {info}=await params;return <InfoPage slug={info} language="en"/>;}
