import { test } from 'node:test';
import assert from 'node:assert/strict';
import { monthlyReview, quoteTotal, amount } from '../lib/calculations.mjs';
test('monthly report reconciles decimal expenses and allows a real deficit', () => {
  assert.deepEqual(monthlyReview(100, [70.15, 40.2]).balance, -10.35);
  assert.equal(monthlyReview(50000, [12000, 8000, 6000, 3000, 9000]).balance, 12000);
});
test('lower EMI can cost more across the full loan term', () => {
  const a = quoteTotal({ down: 30000, emi: 3400, months: 24, fees: 2000 });
  const b = quoteTotal({ down: 30000, emi: 2500, months: 36, fees: 1000 });
  assert.equal(a.total, 113600);
  assert.equal(b.total - a.total, 7400);
});
test('invalid inputs cannot generate misleading financial results', () => {
  for (const bad of ['', -1, Infinity, 'oops', 1e11]) assert.throws(() => amount(bad));
  assert.throws(() => monthlyReview(0, [1]));
  assert.throws(() => quoteTotal({ down: 1, emi: 1, months: 2.5, fees: 1 }));
});
