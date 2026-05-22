import type { LoanInput } from "./types";

export interface YearlySchedule {
  /** 年（1, 2, 3, ...） */
  year: number;
  /** その年の元金返済額合計（円） */
  principal: number;
  /** その年の利息支払額合計（円） */
  interest: number;
  /** 年末時点の残債（円） */
  balance: number;
}

/**
 * 元利均等返済の年次返済表を返す。
 *
 * 各月の内訳:
 *   利息 = 前月末残債 × 月利（円未満切り捨て）
 *   元金 = 月々返済額 - 利息
 *   月末残債 = 前月末残債 - 元金
 *
 * 最終月は端数調整で残債を 0 にする（実務でもよくある処理）。
 * 各年エントリは「その年の元金返済合計 / 利息合計 / 年末残債」。
 */
export function calcAmortizationSchedule(input: LoanInput): YearlySchedule[] {
  const principal = input.amount * 10_000;
  const monthlyRate = input.rate / 100 / 12;
  const months = input.years * 12;

  let monthly: number;
  if (monthlyRate === 0) {
    monthly = Math.floor(principal / months);
  } else {
    const factor = Math.pow(1 + monthlyRate, months);
    monthly = Math.floor((principal * monthlyRate * factor) / (factor - 1));
  }

  const schedule: YearlySchedule[] = [];
  let balance = principal;
  let yearPrincipal = 0;
  let yearInterest = 0;

  for (let m = 1; m <= months; m++) {
    const interestThisMonth = Math.floor(balance * monthlyRate);
    let principalThisMonth = monthly - interestThisMonth;

    if (m === months || principalThisMonth > balance) {
      principalThisMonth = balance;
    }

    balance -= principalThisMonth;
    yearPrincipal += principalThisMonth;
    yearInterest += interestThisMonth;

    if (m % 12 === 0 || m === months) {
      schedule.push({
        year: Math.ceil(m / 12),
        principal: yearPrincipal,
        interest: yearInterest,
        balance: Math.max(0, balance),
      });
      yearPrincipal = 0;
      yearInterest = 0;
    }
  }

  return schedule;
}
