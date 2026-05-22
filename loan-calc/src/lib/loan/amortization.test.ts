import { describe, it, expect } from "vitest";
import { calcAmortizationSchedule } from "./amortization";

describe("calcAmortizationSchedule", () => {
  it("35年なら35年分のエントリを返す", () => {
    const schedule = calcAmortizationSchedule({ amount: 3000, years: 35, rate: 1.5 });
    expect(schedule).toHaveLength(35);
  });

  it("20年なら20年分のエントリを返す", () => {
    const schedule = calcAmortizationSchedule({ amount: 2000, years: 20, rate: 1.0 });
    expect(schedule).toHaveLength(20);
  });

  it("最終年の残債は 0 に収束する", () => {
    const schedule = calcAmortizationSchedule({ amount: 3000, years: 35, rate: 1.5 });
    expect(schedule[schedule.length - 1].balance).toBe(0);
  });

  it("元利均等の性質: 年が進むほど元金返済↑・利息↓", () => {
    const schedule = calcAmortizationSchedule({ amount: 3000, years: 35, rate: 1.5 });
    const first = schedule[0];
    const last = schedule[schedule.length - 1];
    expect(last.principal).toBeGreaterThan(first.principal);
    expect(last.interest).toBeLessThan(first.interest);
  });

  it("金利0% なら全エントリの利息がゼロ", () => {
    const schedule = calcAmortizationSchedule({ amount: 1200, years: 10, rate: 0 });
    for (const entry of schedule) {
      expect(entry.interest).toBe(0);
    }
  });

  it("各年エントリの year は連番", () => {
    const schedule = calcAmortizationSchedule({ amount: 3000, years: 30, rate: 1.0 });
    schedule.forEach((entry, idx) => {
      expect(entry.year).toBe(idx + 1);
    });
  });

  it("元金合計はおおむね借入額に一致する（端数調整のため厳密一致）", () => {
    const schedule = calcAmortizationSchedule({ amount: 3000, years: 35, rate: 1.5 });
    const totalPrincipal = schedule.reduce((sum, e) => sum + e.principal, 0);
    expect(totalPrincipal).toBe(30_000_000);
  });
});
