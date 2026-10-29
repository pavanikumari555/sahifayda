import {intentOf} from './sia-advisor.mjs';
import {serviceGuideFor} from '../supabase/functions/_shared/service-guides.mjs';

export function readingGuideFor(text,profile){
 if(/upi|यूपीआई/i.test(text))return 'upi-payment-pending';
 if(/budget|बजट/i.test(text))return 'monthly-budget';
 if(/mudra|मुद्रा/i.test(text))return 'business-loan';
 if(/\bapr\b|interest|ब्याज/i.test(text))return 'loan-options';
 if(/emi|किस्त/i.test(text))return 'emi-total-cost';
 const category=intentOf(text)||profile?.category;
 return serviceGuideFor({category,values:category===profile?.category?profile?.values:{}});
}
