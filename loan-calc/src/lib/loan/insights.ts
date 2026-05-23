import type { LoanInput } from "./types";

/**
 * 借入額・期間・金利のそれぞれの「特徴的なコメント」を組み合わせて、
 * 結果ページに条件特有の補足テキストを出すための文字列配列を返す。
 *
 * 値の刻みは生成パターン側（patterns.ts）と必ずしも完全一致しなくてよい。
 * 「同じテキストが大量に複製される」のを避けるため、ある程度の段階分けにしている。
 */

// === 住宅ローン用 ===

function homeAmountInsight(amount: number): string {
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

function homeYearsInsight(years: number): string {
  if (years <= 20) {
    return "返済期間としては短めの設定で、月々の負担は重くなりますが、総利息を大きく抑えられます。";
  }
  if (years <= 30) {
    return "標準的な返済期間で、月々の返済額と総利息のバランスが取りやすい設定です。";
  }
  return "住宅ローンとしては最長クラスの返済期間です。月々の負担を抑えられる代わりに、利息総額は大きくなります。";
}

function homeRateInsight(rate: number): string {
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

export function buildHomeInsights(input: LoanInput): string[] {
  return [
    homeAmountInsight(input.amount),
    homeYearsInsight(input.years),
    homeRateInsight(input.rate),
  ];
}

// === マイカーローン用 ===

function carAmountInsight(amount: number): string {
  if (amount <= 150) {
    return "中古車や軽自動車の購入想定として現実的な金額帯です。";
  }
  if (amount <= 300) {
    return "コンパクトカーや小型セダンの新車購入でよく選ばれる金額帯です。";
  }
  if (amount <= 400) {
    return "ミドルサイズのセダンや SUV の新車購入で目安となる金額帯です。";
  }
  return "上級車や大型 SUV の購入想定で、頭金や残価設定型ローンとの併用も検討したい水準です。";
}

function carYearsInsight(years: number): string {
  if (years <= 3) {
    return "短めの返済期間で、月々の負担は重くなりますが利息総額を抑えられます。";
  }
  if (years <= 5) {
    return "マイカーローンとして標準的な返済期間で、月々と総額のバランスが取りやすい設定です。";
  }
  if (years <= 7) {
    return "やや長めの返済期間で、月々の負担を抑えやすい代わりに利息総額は増えます。";
  }
  return "マイカーローンとしては長期の返済期間です。月々を抑える代わりに、車検や買い替えタイミングとの兼ね合いに注意が必要です。";
}

function carRateInsight(rate: number): string {
  if (rate <= 1.0) {
    return "銀行マイカーローンの低位水準で、優良な信用条件で借りるケースに該当します。";
  }
  if (rate <= 2.0) {
    return "銀行マイカーローンとして一般的な金利水準です。";
  }
  if (rate <= 3.0) {
    return "ディーラーローンや信販系ローンの低位〜中位の金利帯です。";
  }
  return "ディーラーローンとして高めの金利水準で、残価設定型ローンの試算でもよく使われる値です。";
}

export function buildCarInsights(input: LoanInput): string[] {
  return [
    carAmountInsight(input.amount),
    carYearsInsight(input.years),
    carRateInsight(input.rate),
  ];
}
