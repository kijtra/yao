import type { LoanInput, LoanResult } from "./types";

/**
 * 元利均等返済の計算。
 *
 * 月々返済額 = P * i * (1+i)^n / ((1+i)^n - 1)
 *   P: 元金（円）
 *   i: 月利（年利 / 12 / 100）
 *   n: 返済回数（年数 * 12）
 *
 * 月々返済額は実務慣習に合わせて Math.floor で切り捨て（円未満は丸める）。
 * 利息ゼロの場合は単純に元金を月数で割る。
 */
export function calcEqualPayment(input: LoanInput): LoanResult {
  const principal = input.amount * 10_000;
  const monthlyRate = input.rate / 100 / 12;
  const months = input.years * 12;

  if (monthlyRate === 0) {
    const monthly = Math.floor(principal / months);
    const total = monthly * months;
    return { monthly, total, interest: total - principal };
  }

  const factor = Math.pow(1 + monthlyRate, months);
  const monthly = Math.floor((principal * monthlyRate * factor) / (factor - 1));
  const total = monthly * months;
  const interest = total - principal;

  return { monthly, total, interest };
}
