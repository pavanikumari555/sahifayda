import Calculator from '../../CarVsUberCalculator';
import ToolPage,{toolMetadata,ToolStructuredData} from '../../tool-page';
const path='/car-vs-uber/';
const title="कार बनाम Uber/Ola खर्च कैलकुलेटर";
const description="एक ही यात्रा और अवधि में कार की resale के बाद लागत को cab, auto और Metro से तुलना करें।";
export const metadata=toolMetadata({path,language:'hi',title:title+' | SahiFayda',description});
export default function Page(){return <ToolPage path={path} language="hi" title={title} intro={description} steps={["कार की on-road कीमत, डाउन पेमेंट, ब्याज और अवधि भरें।","दूरी, माइलेज, संचालन खर्च और अनुमानित resale भरें।","उसी यात्रा के पूरे transport budget से तुलना करें।"]}><Calculator language="hi"/><ToolStructuredData language="hi" name={title} description={description}/></ToolPage>;}
export const dynamic='force-static';
