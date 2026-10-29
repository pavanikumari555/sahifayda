export const reportHeaders=['link_id','report_ref','event_type','status','conversion_count','commission_inr','period_start','period_end','reported_on','source_note'];
export const reportEventLabels={application_submitted:'Application submitted',loan_approved:'Loan approved',account_opened:'Account opened',card_issued:'Card issued',loan_disbursed:'Loan disbursed',policy_issued:'Policy issued',purchase_completed:'Purchase completed',app_activated:'App activated',other:'Other partner-defined conversion'};
export const finalReportEvents=new Set(['account_opened','card_issued','loan_disbursed','policy_issued','purchase_completed','app_activated','other']);
// Each event is a different stage. A single application can appear in several
// stages; their counts must not be added together as unique conversions.
export function reportStageTotals(reports=[],linkId=null){
 const stages=Object.fromEntries(Object.keys(reportEventLabels).map(key=>[key,{pending:0,approved:0,rejected:0,commission:0,records:0}]));
 for(const row of reports){
  if(linkId&&row.link_id!==linkId)continue;
  const stage=stages[row.event_type];if(!stage||!['pending','approved','rejected'].includes(row.status))continue;
  const count=Number(row.conversion_count);if(!Number.isInteger(count)||count<0)continue;
  stage[row.status]+=count;stage.records++;
  if(row.status==='approved'&&finalReportEvents.has(row.event_type)){const commission=Number(row.commission_inr);if(Number.isFinite(commission)&&commission>=0)stage.commission+=commission;}
 }
 return stages;
}
export function exportPartnerReports(reports=[]){
 const cell=value=>'"'+String(value??'').replace(/^[=+@\-\t\r]/,"'$&").replaceAll('"','""')+'"';
 return '\uFEFF'+[reportHeaders.join(','),...reports.map(row=>reportHeaders.map(key=>cell(row[key])).join(','))].join('\r\n');
}
export function parsePartnerReports(csv){
 if(typeof csv!=='string'||csv.length>64000)throw Error('Use an aggregate CSV under 64 KB.');
 const rows=[];let row=[],field='',quoted=false;
 const input=csv.replace(/^\uFEFF/,'').replaceAll('\r\n','\n');
 for(let i=0;i<input.length;i++){
  const char=input[i];
  if(char==='"'){if(quoted&&input[i+1]==='"'){field+='"';i++;}else if(!quoted&&field.length)throw Error('Invalid CSV quoting.');else quoted=!quoted;}
  else if(char===','&&!quoted){row.push(field);field='';}
  else if(char==='\n'&&!quoted){row.push(field);if(row.some(value=>value.trim()))rows.push(row);row=[];field='';}
  else field+=char;
 }
 if(quoted)throw Error('Unclosed CSV quote.');row.push(field);if(row.some(value=>value.trim()))rows.push(row);
 if(rows.length<2||rows.length>51)throw Error('Import 1 to 50 aggregate rows at a time.');
 const header=rows.shift().map(value=>value.trim());
 if(header.length!==reportHeaders.length||new Set(header).size!==header.length||reportHeaders.some(key=>!header.includes(key)))throw Error('Use the exact aggregate-report template headers. No customer data columns are accepted.');
 const seen=new Set();return rows.map((values,index)=>{
  if(values.length!==header.length)throw Error('Column count differs on row '+(index+2));
  const record=Object.fromEntries(header.map((key,i)=>[key,values[i].trim()]));
  for(const key of ['conversion_count','commission_inr']){if(!/^\d+(\.\d{1,2})?$/.test(record[key]))throw Error('Invalid numeric field on row '+(index+2));record[key]=Number(record[key]);}
  const identity=record.link_id+'|'+record.report_ref;if(seen.has(identity))throw Error('A report reference appears twice in this file.');seen.add(identity);return record;
 });
}
