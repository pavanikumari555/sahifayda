import {test} from 'node:test';
import assert from 'node:assert/strict';
import {cardRoute} from '../lib/card-route.mjs';
test('ITR filing alone never creates a card approval or affordability route',()=>{
 const base={income:'none',repayment:'no',deposit:'yes',itr:'yes'};
 assert.equal(cardRoute(base),'stabilise');
 assert.equal(cardRoute({...base,repayment:'yes',deposit:'no'}),'income_first');
 assert.equal(cardRoute({...base,repayment:'yes'}),'secured_review');
 assert.equal(cardRoute({...base,income:'variable',repayment:'yes'}),'compare_routes');
 assert.throws(()=>cardRoute({...base,repayment:''}));
});
