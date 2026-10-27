import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parsePartnerReports,reportHeaders} from '../lib/partner-reports.mjs';
const header=reportHeaders.join(',');
const record='11111111-1111-1111-1111-111111111111,report-1,account_opened,approved,3,250.50,2026-10-01,2026-10-20,2026-10-21,"Partner dashboard, aggregate summary"';
test('aggregate imports preserve quoted evidence, parse counts and reject PII columns',()=>{
 const rows=parsePartnerReports(header+'\n'+record);assert.equal(rows[0].conversion_count,3);assert.equal(rows[0].commission_inr,250.5);assert.equal(rows[0].source_note,'Partner dashboard, aggregate summary');
 assert.throws(()=>parsePartnerReports(header+',customer_phone\n'+record+',123'),/headers/);
 assert.throws(()=>parsePartnerReports(header+'\n'+record+'\n'+record),/twice/);
 assert.throws(()=>parsePartnerReports(header+'\n'+record.replace(',3,',',=3,')),/numeric/);
 assert.throws(()=>parsePartnerReports(header+'\n'+record+'"'),/quote/);
});
