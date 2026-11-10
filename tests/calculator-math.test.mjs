import test from 'node:test';
import assert from 'node:assert/strict';
import { monthlyPayment, numericInput, homeComparison, debtComparison } from '../lib/calculator-math.mjs';
const close = (a,b) => assert.ok(Math.abs(a-b)<0.01, a+' != '+b);
const home = {homePrice:1200000, downPayment:200000, interestRate:0, tenure:10, currentRent:5000,
 registryRate:0, stampRate:0, maintenance:0, appreciation:0, rentGrowth:0, investmentRate:0};
test('empty and non-finite inputs do not become valid amounts',()=>{
 for(const v of ['', ' ', null, undefined, Infinity]) assert.ok(!Number.isFinite(numericInput(v)));
 assert.equal(numericInput('0'),0);
 assert.equal(homeComparison({...home,downPayment:1200001}),null);
 assert.equal(homeComparison({...home,currentRent:NaN}),null);
 assert.equal(debtComparison(50000,-1),null);
});
test('zero-rate and fully funded purchases never produce NaN',()=>{
 close(monthlyPayment(100000,0,10),10000);
 const r=homeComparison(home);close(r.emi,1000000/120);close(r.totalInterest,0);
 const cash=homeComparison({...home,downPayment:1200000});close(cash.emi,0);
 close(cash.buyerWealth,1800000);close(cash.renterWealth,1200000);
});
test('comparison conserves wealth for identical budgets without growth or fees',()=>{
 const r=homeComparison(home);close(r.buyerWealth,1200000);close(r.renterWealth,600000);
 close(r.buyerWealth-r.renterWealth,r.totalRentPaid);
});
test('home loan total contains loan interest once and no interest GST',()=>{
 const r=homeComparison({...home,interestRate:8,registryRate:6,stampRate:7,maintenance:3000});
 close(r.totalInvestment,200000+r.totalPayment+156000+360000);
 close(r.totalInterest,r.totalPayment-r.loanAmount);
});
test('minimum repayment uses the balance, minimum floor and final payment cap',()=>{
 const small=debtComparison(100,1000);assert.equal(small.minimumMonths,1);close(small.minimumTotal,104.13);
 const a=debtComparison(5000,8000),b=debtComparison(50000,8000);
 assert.ok(b.minimumMonths>a.minimumMonths);assert.ok(b.minimumTotal>50000);
});
test('EMI affordability includes the first month fee and tax and reacts to budget',()=>{
 const r=debtComparison(50000,8000);
 assert.ok(r.options.every(o=>o.firstMonthPayment>o.emi));
 assert.equal(r.recommended,12);assert.equal(debtComparison(50000,0).recommended,null);
 assert.equal(debtComparison(50000,20000).recommended,3);
 for(const o of r.options) close(o.totalPaid,50000+o.totalExtraCost);
 const x=r.options[0];assert.equal(debtComparison(50000,x.emi).options[0].affordable,false);
});
