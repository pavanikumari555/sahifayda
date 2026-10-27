// The transcript is interpreted in memory, never forwarded to either model.
export function voiceTopic(transcript){
 if(typeof transcript!=='string'||transcript.length>1000)return null;
 const text=transcript.toLowerCase().normalize('NFKC');
 const rules=[['card_route',/unemploy|without.*salary|no.*job|itr|बेरोज|नौकरी.*नहीं|आईटीआर|आईटीआर/],['upi',/upi|यू\s*पी\s*आई|यूपीआई|payment.*(pending|fail)|पेमेंट.*(अटक|फेल)|भुगतान.*(अटक|फेल|लंबित)|(अटक|फेल|लंबित).*भुगतान/],['minimum',/minimum|credit\s*card|क्रेडिट\s*कार्ड|न्यूनतम|कार्ड.*बिल/],['comparison',/emi|ईएमआई|ई\s*एम\s*आई|quote|कोटेशन|किस्त|तुलना/],['partners',/affiliate|referral|partner|रेफरल|रेफ़रल|पार्टनर|एफिलिएट|एफ़िलिएट/],['budget',/budget|बजट|खर्च|ख़र्च|income|आय|saving|बचत|महीने|महीना/]];
 return rules.find(([,pattern])=>pattern.test(text))?.[0]||null;
}
