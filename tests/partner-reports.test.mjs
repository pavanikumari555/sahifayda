import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parsePartnerReports,reportHeaders,reportStageTotals,exportPartnerReports} from '../lib/partner-reports.mjs';
const header=reportHeaders.join(',');
const record='11111111-1111-1111-1111-111111111111,report-1,account_opened,approved,3,250.50,2026-10-01,2026-10-20,2026-10-21,"Partner dashboard, aggregate summary"';
test('aggregate imports preserve quoted evidence, parse counts and reject PII columns',()=>{
 const rows=parsePartnerReports(header+'\n'+record);assert.equal(rows[0].conversion_count,3);assert.equal(rows[0].commission_inr,250.5);assert.equal(rows[0].source_note,'Partner dashboard, aggregate summary');
 assert.throws(()=>parsePartnerReports(header+',customer_phone\n'+record+',123'),/headers/);
 assert.throws(()=>parsePartnerReports(header+'\n'+record+'\n'+record),/twice/);
 assert.throws(()=>parsePartnerReports(header+'\n'+record.replace(',3,',',=3,')),/numeric/);
 assert.throws(()=>parsePartnerReports(header+'\n'+record+'"'),/quote/);
});
test('reported application, approval and final outcome stages stay separate and only final commission counts',()=>{
 const reports=[{link_id:'a',event_type:'application_submitted',status:'approved',conversion_count:8,commission_inr:100},{link_id:'a',event_type:'loan_approved',status:'approved',conversion_count:3,commission_inr:100},{link_id:'a',event_type:'loan_disbursed',status:'approved',conversion_count:2,commission_inr:500},{link_id:'b',event_type:'loan_disbursed',status:'pending',conversion_count:1,commission_inr:200}];
 const stages=reportStageTotals(reports,'a');
 assert.equal(stages.application_submitted.approved,8);assert.equal(stages.loan_approved.approved,3);assert.equal(stages.loan_disbursed.approved,2);
 assert.equal(stages.application_submitted.commission,0);assert.equal(stages.loan_approved.commission,0);assert.equal(stages.loan_disbursed.commission,500);assert.equal(stages.loan_disbursed.pending,0);
 assert.equal(reportStageTotals(reports).loan_disbursed.pending,1);assert.equal(reportStageTotals(reports).loan_disbursed.commission,500);
});
test('report export round trips quoted evidence and neutralizes spreadsheet formulas',()=>{
 const reports=parsePartnerReports(header+'\n'+record);reports[0].source_note='=SUM(1,2)';
 const output=exportPartnerReports(reports);assert.match(output,/"'=SUM\(1,2\)"/);
 assert.equal(parsePartnerReports(output)[0].source_note,"'=SUM(1,2)");
});
