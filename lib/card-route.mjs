export function cardRoute({income,repayment,deposit,itr}){
 if(!['none','variable','regular'].includes(income)||!['yes','no','unknown'].includes(repayment)||!['yes','no'].includes(deposit)||!['yes','no'].includes(itr))throw Error('Complete the questions.');
 if(repayment!=='yes')return 'stabilise';
 if(income==='none')return deposit==='yes'?'secured_review':'income_first';
 if(income==='variable')return deposit==='yes'?'compare_routes':'document_review';
 return 'document_review';
}
