import { notFound } from 'next/navigation';
import ToolPage, { toolMetadata } from './tool-page';
import { infoPages, infoSlugs } from '../lib/info-pages.mjs';
export function infoMetadata(slug,language){const c=infoPages[slug]?.[language];return c?toolMetadata({path:'/'+slug+'/',language,title:c.title+' | SahiFayda',description:c.intro}):{};}
export default function InfoPage({slug,language}){const c=infoPages[slug]?.[language];if(!c)notFound();const hi=language==='hi';return <ToolPage language={language} path={'/'+slug+'/'} title={c.title} intro={c.intro}>
 <article className="toolpage-method"><p>{hi?'अपडेट: ':'Updated: '}<time dateTime="2026-11-10">2026-11-10</time></p>{c.sections.map(([title,text])=><section key={title}><h2>{title}</h2><p>{text}</p></section>)}
 {slug==='contact'&&<p><a href="https://github.com/pavanikumari555/sahifayda/issues/new" target="_blank" rel="noopener noreferrer">{hi?'Public तकनीकी bug report (निजी जानकारी न दें)':'Public technical bug report (no personal details)'}</a></p>}
 <nav className="toolpage-related">{infoSlugs.filter(s=>s!==slug).map(s=><a key={s} href={(hi?'/hi':'')+'/'+s+'/'}>{infoPages[s][language].title}</a>)}</nav>
 </article></ToolPage>;}
