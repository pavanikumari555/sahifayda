// Review state survives subsequent daily checks. An unchanged second observation
// must never silently approve a previously detected change.
export function observationUpdate(source, prior, parsed, digest, attempted) {
 const loan=parsed.facts.kind==='loan_rate';
 const baseline=parsed.facts.kind==='source_snapshot' && (!prior?.content_hash || prior.status==='verified'&&prior.content_hash===digest&&prior.facts?.kind==='source_snapshot');
 const approved=prior?.facts?.approved_hash || (baseline?digest:null);
 const same=approved===digest && prior?.facts?.kind===parsed.facts.kind;
 const status=loan||same||baseline?'verified':'review_due';
 const revision=prior?.content_hash===digest?(prior?.revision||1):(prior?.revision||0)+1;
 return {id:source.id,category:source.category,title:source.name,source_url:source.url,
  status,content_hash:digest,revision,last_attempt_at:attempted,
  checked_at:status==='verified'?attempted:prior?.checked_at||null,
  excerpt:parsed.excerpt,
  facts:status==='verified'?{...parsed.facts,...(!loan?{approved_hash:approved}:{} )}:
   {...(prior?.facts||{}),candidate:parsed.facts},
  issue:status==='verified'?null:'Source observation needs review; no changed card or catalogue terms were published.'};
}
export function approvalUpdate(row, source, expectedRevision, expectedHash, now=new Date()) {
 if(!source||row?.source_url!==source.url||row?.revision!==expectedRevision||row?.content_hash!==expectedHash||
  !/^[a-f0-9]{64}$/.test(expectedHash||'')||!row.facts?.candidate||row.issue!=='Source observation needs review; no changed card or catalogue terms were published.'||
  now.getTime()-Date.parse(row.last_attempt_at)<0||now.getTime()-Date.parse(row.last_attempt_at)>48*3600000)throw Error('Reload and run the source check before reviewing this observation.');
 return {status:'verified',facts:{...row.facts.candidate,approved_hash:expectedHash},checked_at:row.last_attempt_at,issue:null};
}
