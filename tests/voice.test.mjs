import {test} from 'node:test';
import assert from 'node:assert/strict';
import {voiceTopic} from '../lib/voice-topic.mjs';
test('Hindi and English speech choose an approved topic without preserving the transcript',()=>{
 for(const [question,expected] of [['मेरे महीने का खर्च कैसे समझें','budget'],['छोटी ईएमआई का कुल भुगतान','comparison'],['credit card minimum due','minimum'],['यूपीआई भुगतान अटका है','upi'],['What are referral links','partners']])assert.equal(voiceTopic(question),expected);
 assert.equal(voiceTopic('unrelated conversation'),null);assert.equal(voiceTopic(null),null);assert.equal(voiceTopic('x'.repeat(1001)),null);
});
