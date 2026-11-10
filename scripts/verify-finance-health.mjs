const address='https://xkkmjuqziqrpggtgxlxc.supabase.co/functions/v1/finance-refresh';
const response=await fetch(address,{signal:AbortSignal.timeout(20000)});
const health=await response.json();
if(!response.ok||health.ok!==true||!Number.isInteger(health.coverage)||health.observed!==health.coverage)throw Error('Daily source refresh is missing, stale or unavailable. Check Supabase Cron and Finance data & review queue.');
console.log(`Daily attempts are current for ${health.observed} sources; ${health.review_due} need review. This does not confirm every offer.`);
