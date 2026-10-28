// APR already includes associated charges. Never add a processing fee twice.
// No eligibility decision, new arithmetic, live rate or whole-market recommendation.
export function compareAprQuotes(question,language='en'){
 if(typeof question!=='string'||!/compare|comparison|\bvs\b|versus|better|which|तुलना|बेहतर|kaunsa|farq|फर्क/i.test(question))return null;
 const rates=[...question.matchAll(/\bAPR\s*(?:of|is|:|=)?\s*(\d+(?:\.\d+)?)\s*%/gi)].map(m=>({text:m[1],value:Number(m[1])}));
 if(rates.length!==2||rates.some(r=>r.value<0||r.value>1000))return null;
 const hi=/[\u0900-\u097f]/.test(question),roman=/\b(hai|hu|kaunsa|konsa|btao|batao|mere|mera|meri|kyu|kyun|chahiye)\b/i.test(question);
 const S=(en,hindi,hinglish)=>hi?hindi:roman?hinglish:en;
 const same=rates[0].value===rates[1].value,lower=rates[0].value<rates[1].value?0:1;
 const first=S('first','पहले','pehle'),second=S('second','दूसरे','doosre');
 const choice=lower===0?first:second;
 const answer=S(`You quoted APRs of ${rates[0].text}% and ${rates[1].text}%. `,`आपने APR ${rates[0].text}% और ${rates[1].text}% बताए हैं। `,`Aapne APR ${rates[0].text}% aur ${rates[1].text}% bataye hain. `)+
 (same?S('The quoted APRs are equal; compare the other terms before choosing. ','दोनों APR बराबर हैं; चुनने से पहले अन्य शर्तें देखें। ','Dono APR barabar hain; choose karne se pehle doosre terms dekhiye. '):S(`If both are genuine all-inclusive APRs for the same loan amount and tenure, the ${choice} quote has the lower annual credit cost. `,`अगर दोनों एक ही लोन रकम और अवधि के वास्तविक, सभी शुल्क सहित APR हैं, तो ${choice} कोट की सालाना क्रेडिट लागत कम है। `,`Agar dono same loan amount aur tenure ke asli all-inclusive APR hain, to ${choice} quote ki annual credit cost kam hai. `))+
 S('APR includes interest and associated charges. Check each lender’s Key Facts Statement to confirm which fees are included; do not add an included processing fee twice. Prepayment, contingent charges and repayment schedule can still differ. These are your unverified quotes, not an approval or affordability assessment.','APR में ब्याज और संबंधित शुल्क शामिल होते हैं। हर बैंक के Key Facts Statement में देखें कि कौन-सी फीस शामिल है; शामिल प्रोसेसिंग फीस को दोबारा न जोड़ें। प्रीपेमेंट, शर्त पर लगने वाले शुल्क और किस्त का शेड्यूल अलग हो सकते हैं। ये आपके बताए अनवेरिफ़ाइड कोट हैं, मंज़ूरी या भुगतान क्षमता की जाँच नहीं।','APR mein interest aur associated charges shamil hote hain. Har lender ke Key Facts Statement mein check karein ki kaunsi fees included hain; included processing fee ko do baar mat jodiye. Prepayment, contingent charges aur repayment schedule alag ho sakte hain. Ye aapke unverified quotes hain, approval ya affordability assessment nahi.');
 return {answer,links:[{title:'RBI: loan terms and APR',url:'https://rbi.org.in/CommonPerson/english/scripts/FAQs.aspx?Id=701'}]};
}
