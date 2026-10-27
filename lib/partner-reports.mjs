export const reportHeaders=['link_id','report_ref','event_type','status','conversion_count','commission_inr','period_start','period_end','reported_on','source_note'];
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
