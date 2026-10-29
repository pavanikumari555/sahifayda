import {financeSourceById} from '../supabase/functions/_shared/finance-sources.mjs';
export {currentFinanceRecords,loanComparisons,financeSourceById} from '../supabase/functions/_shared/finance-sources.mjs';
export async function readFinanceKnowledge(fetcher=fetch){
 const fields='id,category,title,source_url,status,facts,excerpt,revision,checked_at,last_attempt_at';
 const r=await fetcher(process.env.NEXT_PUBLIC_SUPABASE_URL+'/rest/v1/finance_knowledge?select='+fields+'&order=id&limit=30',{headers:{apikey:process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY},cache:'no-store',signal:AbortSignal.timeout(8000)});
 if(!r.ok)throw Error('Current information is unavailable');
 const rows=await r.json();
 if(!Array.isArray(rows)||rows.length>30||rows.some(row=>!financeSourceById[row.id]||row.source_url!==financeSourceById[row.id].url||typeof row.excerpt!=='string'||row.excerpt.length>2000||!['verified','review_due'].includes(row.status)))throw Error('Invalid source response');
 return rows;
}
