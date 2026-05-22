/**
 * ローン計算の入力値。
 * - amount: 借入額（万円）。URL パラメータと合わせるため万円単位
 * - years: 返済年数
 * - rate: 年利（%）。1.5 は 1.5% を意味する（0.015 ではない）
 */
export interface LoanInput {
  amount: number;
  years: number;
  rate: number;
}

/**
 * 計算結果。すべて円単位。
 */
export interface LoanResult {
  /** 月々の返済額（円） */
  monthly: number;
  /** 総返済額（円） */
  total: number;
  /** 利息総額（円）= total - 借入額 */
  interest: number;
}
