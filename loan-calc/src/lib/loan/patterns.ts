import type { LoanInput } from "./types";

// === 住宅ローン ===

export const HOME_AMOUNTS = [
  1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 6000, 7000, 8000,
] as const;
export const HOME_YEARS = [20, 25, 30, 35] as const;
export const HOME_RATES = [0.5, 1.0, 1.5, 2.0, 2.5] as const;

/**
 * 住宅ローンの全生成パターン（12 × 4 × 5 = 240件）。
 * `getStaticPaths` で全パスを事前生成するために使う。
 */
export function homePatterns(): LoanInput[] {
  const out: LoanInput[] = [];
  for (const amount of HOME_AMOUNTS) {
    for (const years of HOME_YEARS) {
      for (const rate of HOME_RATES) {
        out.push({ amount, years, rate });
      }
    }
  }
  return out;
}

// === マイカーローン ===

export const CAR_AMOUNTS = [100, 150, 200, 250, 300, 400, 500] as const;
export const CAR_YEARS = [3, 5, 7, 10] as const;
export const CAR_RATES = [1.0, 2.0, 3.0, 5.0] as const;

/**
 * マイカーローンの全生成パターン（7 × 4 × 4 = 112件）。
 * 金額帯は中古車〜上級新車をカバー、金利は銀行マイカーローン（1〜2%）
 * からディーラーローン（3〜5%）までの幅を想定。
 */
export function carPatterns(): LoanInput[] {
  const out: LoanInput[] = [];
  for (const amount of CAR_AMOUNTS) {
    for (const years of CAR_YEARS) {
      for (const rate of CAR_RATES) {
        out.push({ amount, years, rate });
      }
    }
  }
  return out;
}

// === カードローン ===

export const CARD_AMOUNTS = [10, 30, 50, 100, 200, 300] as const;
export const CARD_YEARS = [1, 2, 3, 5] as const;
export const CARD_RATES = [3.0, 5.0, 10.0, 15.0, 18.0] as const;

/**
 * カードローンの全生成パターン（6 × 4 × 5 = 120件）。
 * 計算方式は元利均等返済方式（市場の主流に合わせる）。
 * リボ払い（定額リボ）の計算ロジックは別物だが、本ツールでは扱わない。
 */
export function cardPatterns(): LoanInput[] {
  const out: LoanInput[] = [];
  for (const amount of CARD_AMOUNTS) {
    for (const years of CARD_YEARS) {
      for (const rate of CARD_RATES) {
        out.push({ amount, years, rate });
      }
    }
  }
  return out;
}
