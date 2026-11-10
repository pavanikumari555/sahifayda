// Only these exact issuer variants are supported. Marketing offers are never
// inferred from a percentage alone; changed page text requires owner review.
export function extractCardTerms(source, text) {
 const number = value => Number(value.replaceAll(',', ''));
 if(source.parser==='sbi-cashback'){
  const rate=text.match(/cashback of\s*(\d+(?:\.\d+)?)%\s*on online transactions/i);
  const cap=text.match(/maximum cashback that may be earned on online transactions in a statement cycle is\s*Rs\.?\s*([\d,]+)/i);
  const total=text.match(/aggregate cashback in a single statement cycle exceed\s*Rs\.?\s*([\d,]+)/i);
  if(!rate||!cap||!total||!Number.isFinite(number(cap[1]))||number(cap[1])>number(total[1])||Number(rate[1])>10||number(total[1])>100000)throw Error('SBI rate or statement-cycle caps need review');
  return {kind:'sbi_card_terms',onlineRate:Number(rate[1]),onlineCap:number(cap[1]),totalCap:number(total[1]),conditions:'Eligible online non-EMI purchases only; merchant/category exclusions and posting-date rules apply. Enter remaining online/aggregate cashback allowance. Returns reverse rewards; checkout discount stacking is not confirmed.'};
 }
 if (source.parser === 'idfc-fd') {
  const section = text.slice(text.indexOf('What is the minimum FD'));
  const wow = section.match(/FIRST WOW![\s\S]{0,180}?minimum deposit of\s*(?:₹|Rs\.?)\s*([\d,]+)/i);
  const earn = section.match(/FIRST EA(?:₹|R)N[\s\S]{0,240}?minimum amount of\s*(?:₹|Rs\.?)\s*([\d,]+)/i);
  const fee = section.match(/joining fee is\s*(?:₹|Rs\.?)\s*([\d,]+)\s*\+\s*GST,?\s*and the annual fee[\s\S]{0,80}?(?:₹|Rs\.?)\s*([\d,]+)\s*\+\s*GST/i);
  if (!wow || !earn || !fee || !/18 years of age|18 years or older/i.test(section) || !/no joining, membership, or annual fee/i.test(section)) throw Error('FD variant, fee or eligibility section needs review');
  const values = [number(wow[1]),number(earn[1]),number(fee[1]),number(fee[2])];
  if (values.some(v=>!Number.isFinite(v)||v<0||v>1e7) || values[0]<1000 || values[1]<1000) throw Error('Implausible FD terms');
  return {kind:'fd_card_terms', cards:[
   {id:'idfc-first-wow',name:'IDFC FIRST WOW!',minFd:values[0],joiningFee:0,annualFee:0},
   {id:'idfc-first-earn',name:'IDFC FIRST EA₹N',minFd:values[1],joiningFee:values[2],annualFee:values[3]}
  ],conditions:'Deposit matching is not approval. Age, residence/location, KYC and FD/lien conditions apply. Confirm all charges and limited fee-waiver offers with the issuer.'};
 }
 const rewards = text.match(/Earn Points on every\s*(?:₹|Rs\.?)?\s*100\s*spend\s*(\d+(?:\.\d+)?)\s*Prime Member\s*(\d+(?:\.\d+)?)\s*Non-?\s*Prime Member/i);
 if (!rewards || !/Joining Fee\s*NIL\s*Annual Fee\s*NIL/i.test(text) || !/unlimited rewards|unlimited reward points|Unlimited,? rewards/i.test(text) || !/invite.only/i.test(text)) throw Error('Amazon membership rewards, fee or conditions need review');
 const prime=Number(rewards[1]),nonPrime=Number(rewards[2]);
 if(prime<0||prime>10||nonPrime<0||nonPrime>prime)throw Error('Implausible Amazon rewards');
 return {kind:'amazon_card_terms',prime,nonPrime,joiningFee:0,annualFee:0,conditions:'Eligible ordinary Amazon purchases only; rewards are Amazon Pay balance. Exclusions and checkout terms apply. No EMI reward or discount stacking is assumed. Invite-only; issuer decides approval.'};
}
