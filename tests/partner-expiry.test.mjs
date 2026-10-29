import {test} from 'node:test';
import assert from 'node:assert/strict';
import {expiryForHours,expiryToIso,partnerAvailability} from '../lib/partner-expiry.mjs';
const now=new Date('2026-10-29T08:00:00Z');
const active={state:'active',promotion_approved:true,reviewed_on:'2026-10-29',expires_at:null};
test('24/48/72 hour choices use UTC, cross date boundaries and never does not mean review exemption',()=>{
 for(const hours of [24,48,72])assert.equal(Date.parse(expiryToIso(expiryForHours(hours,now)))-now.getTime(),hours*3600000);
 assert.equal(expiryToIso(expiryForHours('never',now)),null);
 assert.equal(partnerAvailability({...active,reviewed_on:'2020-01-01'},now).id,'review_due');
 assert.throws(()=>expiryForHours(12,now));
 assert.throws(()=>expiryToIso('2026-02-31T10:00'));
});
test('a stored active flag never hides expired, paused or unapproved effective availability',()=>{
 assert.equal(partnerAvailability(active,now).id,'active');
 assert.equal(partnerAvailability({...active,expires_at:now.toISOString()},now).id,'expired');
 assert.equal(partnerAvailability({...active,expires_at:'invalid'},now).id,'expired');
 assert.equal(partnerAvailability({...active,state:'paused'},now).id,'paused');
 assert.equal(partnerAvailability({...active,promotion_approved:false},now).id,'unapproved');
 assert.equal(partnerAvailability({...active,reviewed_on:'2026-10-30'},now).id,'review_due');
});
