import formatMoney from '../lib/formatMoney';

describe('formatMoney function', () => {
  it('works with fractional dollars', () => {
    expect(formatMoney(1)).toBe('$0.01');
    expect(formatMoney(10)).toBe('$0.10');
    expect(formatMoney(9)).toBe('$0.09');
    expect(formatMoney(40)).toBe('$0.40');
  });

  it('leave cents off for whole dollars', () => {
    expect(formatMoney(5000)).toEqual('$50');
    expect(formatMoney(100)).toEqual('$1');
    expect(formatMoney(50000000)).toEqual('$500,000');
  });

  it('works with whole and fractional dolars', () => {
    expect(formatMoney(5012)).toEqual('$50.12');
    expect(formatMoney(101)).toEqual('$1.01');
    expect(formatMoney(239744747909923)).toEqual('$2,397,447,479,099.23');
  });
});
