import type { LoanInput } from "./types";

/**
 * LoanInput → URL slug 文字列。
 * 例: { amount: 3000, years: 35, rate: 1.5 } → "3000-35-1.5"
 *
 * rate は `.toFixed(1)` で固定し、`1.0` のような表記の安定性を担保する
 * （URLの一貫性確保。/home/3000-35-1/ と /home/3000-35-1.0/ が混在しない）。
 */
export function buildSlug(input: LoanInput): string {
  return `${input.amount}-${input.years}-${input.rate.toFixed(1)}`;
}

/**
 * URL slug → LoanInput。不正な形式の場合は null。
 * 例: "3000-35-1.5" → { amount: 3000, years: 35, rate: 1.5 }
 */
export function parseSlug(slug: string): LoanInput | null {
  const parts = slug.split("-");
  if (parts.length !== 3) return null;

  const amount = Number(parts[0]);
  const years = Number(parts[1]);
  const rate = Number(parts[2]);

  if (!Number.isFinite(amount) || amount <= 0) return null;
  if (!Number.isFinite(years) || years <= 0) return null;
  if (!Number.isFinite(rate) || rate < 0) return null;

  return { amount, years, rate };
}
