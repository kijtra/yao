import { describe, it, expect } from "vitest";
import { calcEqualPayment } from "./equal-payment";

describe("calcEqualPayment", () => {
  it("金利0%なら元金を月数で割っただけ・利息ゼロ", () => {
    const result = calcEqualPayment({ amount: 1200, years: 10, rate: 0 });
    expect(result.monthly).toBe(100_000);
    expect(result.total).toBe(12_000_000);
    expect(result.interest).toBe(0);
  });

  it("3000万円・35年・年利1.5%は月々9万円台前半", () => {
    const result = calcEqualPayment({ amount: 3000, years: 35, rate: 1.5 });
    expect(result.monthly).toBeGreaterThanOrEqual(91_000);
    expect(result.monthly).toBeLessThanOrEqual(92_000);
  });

  it("total = monthly × 月数 の関係を満たす", () => {
    const result = calcEqualPayment({ amount: 2500, years: 30, rate: 1.0 });
    expect(result.total).toBe(result.monthly * 30 * 12);
  });

  it("interest = total - 元金（円換算）", () => {
    const result = calcEqualPayment({ amount: 5000, years: 35, rate: 2.0 });
    expect(result.interest).toBe(result.total - 50_000_000);
  });

  it("金利が高いほど月々返済額が増える", () => {
    const low = calcEqualPayment({ amount: 3000, years: 35, rate: 0.5 });
    const high = calcEqualPayment({ amount: 3000, years: 35, rate: 2.5 });
    expect(high.monthly).toBeGreaterThan(low.monthly);
  });

  it("期間が長いほど月々返済額は減るが総利息は増える", () => {
    const short = calcEqualPayment({ amount: 3000, years: 20, rate: 1.5 });
    const long = calcEqualPayment({ amount: 3000, years: 35, rate: 1.5 });
    expect(long.monthly).toBeLessThan(short.monthly);
    expect(long.interest).toBeGreaterThan(short.interest);
  });
});
