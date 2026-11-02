// Dedicated calculator pages. Each exists in English and under /hi.
export const toolRoutes=['/home-loan-calculator/','/emergency-fund/','/debt-trap-calculator/','/student-credit-cards/','/car-vs-uber/'];
export const toolPaths=language=>toolRoutes.map(route=>(language==='hi'?'/hi':'')+route);
