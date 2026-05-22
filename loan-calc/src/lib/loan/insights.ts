import type { LoanInput } from "./types";

/**
 * 借入額・期間・金利のそれぞれの「特徴的なコメント」を組み合わせて、
 * 結果ページに条件特有の補足テキストを出すための文字列配列を返す。
 *
 * 値の刻みは生成パターン側（patterns.ts）と必ずしも完全一致しなくてよい。
 * 「同じテキストが大量に複製される」のを避けるため、ある程度の段階分けにしている。
 */

function amountInsight(amount: number): string {
  if (amount <= 2000) {
    return "比較的少額の借入で、地方の戸建てや中古マンションの購入想定として現実的な金額です。";
  }
  if (amount <= 3500) {
    return "新築マンションや郊外戸建ての購入でよく選ばれる借入額の帯です。";
  }
  if (amount <= 5000) {
    return "首都圏の新築物件や高めの戸建てを購入する場合の典型的な借入額です。";
  }
  return "高額借入の領域で、世帯年収や将来のライフプランとの整合性をより慎重に確認したい水準です。";
}

function yearsInsight(years: number): string {
  if (years <= 20) {
    return "返済期間としては短めの設定で、月々の負担は重くなりますが、総利息を大きく抑えられます。";
  }
  if (years <= 30) {
    return "標準的な返済期間で、月々の返済額と総利息のバランスが取りやすい設定です。";
  }
  return "住宅ローンとしては最長クラスの返済期間です。月々の負担を抑えられる代わりに、利息総額は大きくなります。";
}

function rateInsight(rate: number): string {
  if (rate < 1.0) {
    return "歴史的にも低い水準の金利で、変動金利型の試算でよく使われる値です。";
  }
  if (rate < 1.5) {
    return "近年の住宅ローン金利として現実的な水準で、固定金利型でも見られる帯です。";
  }
  if (rate < 2.0) {
    return "長期固定金利型で標準的に見られる水準です。";
  }
  return "やや高めの金利水準で、長期固定金利型（フラット35など）の上限近くにあたる設定です。";
}

export function buildInsights(input: LoanInput): string[] {
  return [
    amountInsight(input.amount),
    yearsInsight(input.years),
    rateInsight(input.rate),
  ];
}
