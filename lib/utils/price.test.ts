// lib/utils/price.test.ts
import { describe, it, expect } from 'vitest';
import { fmt, calcTotal } from './price';

describe('fmt', () => {
  it('formats 6.5 as "6.50"', () => expect(fmt(6.5)).toBe('6.50'));
  it('formats 0 as "0.00"', () => expect(fmt(0)).toBe('0.00'));
});

describe('calcTotal', () => {
  it('sums price × qty for each item', () => {
    expect(calcTotal([{ price: 6.75, qty: 1 }, { price: 7.25, qty: 2 }])).toBe(21.25);
  });
  it('returns 0 for empty cart', () => {
    expect(calcTotal([])).toBe(0);
  });
});
