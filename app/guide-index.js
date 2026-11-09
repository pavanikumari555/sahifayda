import FinanceUpdates from './finance-updates';
import {guides,guideSlugs,guidePath} from '../lib/guides.mjs';
import './guide.css';
import BrandLogo from './brand';
export default function GuideIndex({language}){
 const hi=language==='hi';
 return <><header className="guide-header wrap"><BrandLogo href={hi?'/hi/':'/'} className="logo brand-logo" size={34}/><a href={hi?'/guides/':'/hi/guides/'}>{hi?'English':'हिन्दी'}</a></header><main className="guide-article wrap"><h1>{hi?'हर सेवा की आसान जानकारी':'Simple guides for every service'}</h1><p>{hi?'खाता, कार्ड, डीमैट, लोन या बीमा—अपने काम की जानकारी पढ़ें और अगला कदम समझें।':'Accounts, cards, demat, loans and insurance: read what you need and understand the next step.'}</p><FinanceUpdates language={language}/><div className="guide-index">{[...guideSlugs.slice(3),...guideSlugs.slice(0,3)].map(slug=><article className="guide-product" key={slug}><h2><a href={guidePath(slug,language)}>{guides[slug][language].title} →</a></h2><p>{guides[slug][language].description}</p></article>)}</div></main></>;
}
