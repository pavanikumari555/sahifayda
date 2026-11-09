// Owner-managed homepage display settings. Public, non-sensitive content only:
// no financial facts, partner links or eligibility rules are configured here.
export const homeSections=['services','tools','updates','steps','guides','partners','promise','faq'];
export const homeTools=['home_loan','emergency_fund','debt_trap','card_offers','student_cards','car_vs_uber'];

export function siteSettingsDefaults(){
 return {
  announcement:{enabled:false,en:'',hi:'',url:''},
  hero:{title_en:'',title_hi:'',subtitle_en:'',subtitle_hi:''},
  examples:{en:[],hi:[]},
  sections:Object.fromEntries(homeSections.map(key=>[key,true])),
  tools:Object.fromEntries(homeTools.map(key=>[key,true])),
 };
}

const control=/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;
function text(value,max,name,min=0){
 if(value===undefined||value===null)value='';
 if(typeof value!=='string'||control.test(value))throw new Error(name+' must be plain text.');
 const clean=value.trim();
 if(clean.length>max||(clean.length>0&&clean.length<min))throw new Error(`${name} must be ${min?min+' to ':'up to '}${max} characters.`);
 return clean;
}
function flags(input,keys,name){
 const out={};
 for(const key of keys){
  const value=input?.[key];
  if(value!==undefined&&typeof value!=='boolean')throw new Error(name+' switches must be on or off.');
  out[key]=value!==false;
 }
 return out;
}

// Returns a fresh, complete settings object or throws a readable error.
export function validateSiteSettings(input){
 if(!input||typeof input!=='object'||Array.isArray(input))throw new Error('Settings must be an object.');
 const value=siteSettingsDefaults();
 const a=input.announcement||{};
 if(a.enabled!==undefined&&typeof a.enabled!=='boolean')throw new Error('Announcement switch must be on or off.');
 value.announcement={enabled:a.enabled===true,en:text(a.en,200,'English announcement'),hi:text(a.hi,200,'Hindi announcement'),url:text(a.url,160,'Announcement link')};
 // Internal paths only, so an announcement can never send visitors to an unreviewed external site.
 if(value.announcement.url&&!/^\/[a-z0-9/_#-]*$/i.test(value.announcement.url))throw new Error('Announcement link must be a website path such as /products/ or /#tools.');
 if(value.announcement.enabled&&(!value.announcement.en||!value.announcement.hi))throw new Error('Enter the announcement in English and Hindi before switching it on.');
 const h=input.hero||{};
 value.hero={title_en:text(h.title_en,120,'English headline'),title_hi:text(h.title_hi,120,'Hindi headline'),subtitle_en:text(h.subtitle_en,300,'English sub-heading'),subtitle_hi:text(h.subtitle_hi,300,'Hindi sub-heading')};
 for(const language of ['en','hi']){
  const list=input.examples?.[language]??[];
  if(!Array.isArray(list)||list.length>6)throw new Error('Use up to 6 example questions per language.');
  value.examples[language]=list.map((item,index)=>({label:text(item?.label,40,`Example ${index+1} label`,1),question:text(item?.question,300,`Example ${index+1} question`,3)})).filter(item=>item.label&&item.question);
 }
 value.sections=flags(input.sections,homeSections,'Section');
 value.tools=flags(input.tools,homeTools,'Calculator');
 return value;
}
