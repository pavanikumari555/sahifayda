import {test} from 'node:test';
import assert from 'node:assert/strict';
import {recoveryFragment} from '../lib/admin-recovery.mjs';

test('recovery rejects expired, non-recovery, missing and oversized URL credentials',()=>{
 const now=1700000000000;
 for(const hash of ['', '#type=signup&access_token=token&expires_in=3600', '#type=recovery&expires_in=3600', '#type=recovery&access_token=token&expires_in=-1', '#type=recovery&access_token=token&expires_in=invalid', '#type=recovery&access_token=token&expires_in=3600&expires_at=1699999999', '#type=recovery&access_token=token&expires_in=3600&expires_at=invalid', '#type=recovery&access_token='+ 'x'.repeat(5001)+'&expires_in=3600'])assert.equal(recoveryFragment(hash,now),null);
});

test('recovery keeps only its access token and respects the shorter expiry',()=>{
 const now=1700000000000;
 assert.deepEqual(recoveryFragment('#type=recovery&access_token=token&refresh_token=do-not-store&expires_in=3600',now),{token:'token',expiresAt:now+1800000});
 assert.deepEqual(recoveryFragment('#type=recovery&access_token=token&expires_in=3600&expires_at=1700000060',now),{token:'token',expiresAt:now+60000});
});
