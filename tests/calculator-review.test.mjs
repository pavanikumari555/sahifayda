import test from 'node:test';
import assert from 'node:assert/strict';
import {shoppingSavings,carComparison,emergencyPlan,numericInput} from '../lib/calculator-math.mjs';
import {toolRoutes} from '../lib/tool-routes.mjs';
import {toolContent} from '../lib/tool-content.mjs';
import {guideSlugs} from '../lib/guides.mjs';
const close=(a,b)=>assert.ok(Math.abs(a-b)<0.01);
const car={price:800000,down:160000,rate:9.5,months:60,km:1500,mileage:15,fuel:100,insurance:12000,maintenance:24000,parking:2000,cab:1000,resale:300000};
test('high distance cannot override a cheaper entered cab cost and resale is counted once',()=>{
 const a=carComparison(car),b=carComparison({...car,resale:0});
 assert.ok(a.difference>0);close(b.carNet-a.carNet,300000);close(a.carCash,a.monthlyOutflow*60+car.down);
 close(a.breakEvenCab,a.carNet/60);close(carComparison({...car,cab:a.breakEvenCab}).difference,0);
});
test('cash-funded and zero-interest car purchases are finite and invalid inputs are rejected',()=>{
 const a=carComparison({...car,down:car.price});assert.equal(a.emi,0);
 const b=carComparison({...car,rate:0});close(b.emi,(car.price-car.down)/60);
 for(const override of [{down:800001},{resale:800001},{mileage:0},{months:12.5},{km:NaN},{cab:-1}])assert.equal(carComparison({...car,...override}),null);
});
test('cashback and discount are alternatives unless combining is explicitly allowed',()=>{
 const inputs={price:30000,discountRate:10,discountCap:1500,cashbackRate:5,cashbackCap:1000,fee:200,stackable:false};
 const a=shoppingSavings(inputs);assert.equal(a.benefit,1500);assert.equal(a.effectiveCost,28700);
 const b=shoppingSavings({...inputs,stackable:true});assert.equal(b.benefit,2500);
 const c=shoppingSavings({...inputs,cashbackCap:10000,stackable:true});assert.equal(c.cashback,1425);
 assert.equal(shoppingSavings({...inputs,price:numericInput('')}),null);
 assert.equal(shoppingSavings({...inputs,cashbackRate:101}),null);
});
test('emergency target uses the household total once and supports a custom buffer',()=>{
 const a=emergencyPlan(30000,50000,5000,'salaried',6);assert.equal(a.target,180000);assert.equal(a.monthsToTarget,26);
 assert.equal(emergencyPlan(30000,50000,0,'salaried',6).monthsToTarget,null);
 assert.equal(emergencyPlan(30000,200000,0,'salaried',6).monthsToTarget,0);
 assert.equal(emergencyPlan(30000,50000,5000,'salaried',9).target,270000);
 assert.equal(emergencyPlan(30000,50000,5000,'salaried',0),null);
});
test('every public calculator has bilingual methodology and links to an existing guide',()=>{
 assert.equal(toolRoutes.length,6);
 for(const route of toolRoutes)for(const language of ['en','hi']){
  const content=toolContent[route][language];assert.ok(content.method&&content.example&&content.limits);
  assert.ok(content.faq.length>=2);assert.ok(guideSlugs.includes(content.guide),'Broken guide: '+content.guide);
 }
});
