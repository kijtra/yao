import type { LoanInput } from "./types";

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
