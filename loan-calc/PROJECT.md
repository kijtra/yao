# ローン計算ツール集サイト（仮称: loan-calc）

> このファイルは loan-calc サイトの **仕様書**。ブレインストーミングメモは `IDEAS.md` に分離してある。
> Claude への作業方針・ユーザー背景は親ディレクトリの `../CLAUDE.md` を参照。

## プロジェクト概要

**目的**: 放置で月1万円程度のAdSense収益を生むツール系SEOサイトの構築

**コンセプト**: 各種ローンの計算機 + 計算結果ページの大量生成によるロングテールSEO

**性質**: 個人プロジェクト（業務とは別軸）。緩く始めて作りながら改善していく方針。

## ターゲットと収益モデル

- **検索意図**: 「3000万 35年 1.5% 月々」のような具体的な数値を伴う検索
- **狙うキーワード**: ロングテール（ビッグワードでの上位は狙わない）
- **収益源**: 主にAdSense。将来的に金融アフィリエイトも検討
- **AdSense審査**: 当面は無広告で運用（審査通過まで）
- **目標**: 月3万PV程度で月1万円が現実的なライン

## 技術スタック

### フレームワーク: Astro
- **理由**:
  - 静的サイト生成（SSG）でロングテールページを大量生成可能
  - JS出力がデフォルトゼロでCore Web Vitals有利（SEO効果）
  - PHPライクなテンプレ構造で学習コスト低い
  - インタラクティブ部分だけJS有効化（Islands Architecture）
  - Cloudflare Pagesとの相性◎

### 言語: TypeScript
- **理由**:
  - JS知識があれば学習コスト低い（型注釈を足すだけ）
  - 計算ロジックで型安全性が活きる
  - IDE補完が強力
  - AI（Claude含む）にコード書かせる時の精度が上がる
  - Astro公式もTS推奨

### スタイル: Tailwind CSS v4
- Astroに `astro add tailwind` で導入済み
- ユーティリティクラスで素早く整える

### ホスティング: Cloudflare Pages
- **理由**:
  - 無料枠が広い（帯域無制限）
  - GitHub連携で自動ビルド・デプロイ
  - CDN高速
  - GitHub Pagesより制約が緩い

### ドメイン
- **初期**: Cloudflare Pagesのデフォルトドメイン（`*.pages.dev`）
- **移行**: 月3000PV超えたら独自ドメイン検討
- **注意**: AdSense審査では`.pages.dev`だと通りにくい可能性あり

### バージョン管理・パッケージマネージャ
- GitHubリポジトリ（親 `niche-sites/` 単位で1リポジトリ。サイトはサブディレクトリ）
- パッケージマネージャ: **pnpm 11**（corepack 経由）
- 開発環境: Mac（Apple Silicon M5）、VSCode

## サイト構造

### URL設計

```
/                              # トップ（全ローン種別の入口）
/home/                         # 住宅ローン計算機
/home/3000-35-1.5/             # 結果ページ（借入額-年数-金利）
/car/                          # マイカーローン計算機
/car/300-7-2.5/                # 結果ページ
/card/                         # カードローン計算機
/card/50-3-18.0/               # 結果ページ
/education/                    # 教育ローン
/reform/                       # リフォームローン
/articles/                     # 解説記事
/about/                        # 運営者情報
/privacy/                      # プライバシーポリシー
/contact/                      # お問い合わせ
```

### ローン種別の優先度

| 種別 | 単価 | 検索Vol | 競合 | 優先度 |
|---|---|---|---|---|
| 住宅ローン | 圧倒的高 | 大 | 強 | ★★★ |
| カードローン | 高 | 大 | 強 | ★★★ |
| マイカーローン | 中 | 中 | 中 | ★★ |
| 教育ローン | 中 | 小 | 弱 | ★★ |
| 奨学金返済 | 低 | 中 | 弱 | ★★ |
| リフォームローン | 中 | 小 | 弱 | ★ |

**戦略**: 住宅ローン・カードローンで大量ページ生成（本命）、その他は計算機メインで控えめに。

## 想定ディレクトリ構造

```
loan-calc/
├ src/
│  ├ pages/
│  │  ├ index.astro                  # トップ
│  │  ├ home/
│  │  │  ├ index.astro               # 住宅ローン計算機本体
│  │  │  └ [params].astro            # 結果ページ動的生成
│  │  ├ car/
│  │  │  ├ index.astro
│  │  │  └ [params].astro
│  │  ├ card/
│  │  │  ├ index.astro
│  │  │  └ [params].astro
│  │  ├ articles/                    # 解説記事
│  │  ├ about.astro
│  │  ├ privacy.astro
│  │  └ contact.astro
│  ├ components/
│  │  ├ Layout.astro                 # 共通レイアウト
│  │  ├ Calculator.tsx               # 入力フォーム（インタラクティブ）
│  │  ├ ResultTable.astro            # 返済表
│  │  ├ ResultChart.tsx              # グラフ（インタラクティブ）
│  │  └ RelatedLinks.astro           # 関連リンク
│  └ lib/
│     ├ loan/
│     │  ├ index.ts                  # エントリポイント
│     │  ├ equal-payment.ts          # 元利均等返済
│     │  ├ equal-principal.ts        # 元金均等返済
│     │  └ revolving.ts              # リボ計算
│     ├ patterns.ts                  # 生成する組合せ定義
│     └ types.ts                     # 共通型定義
├ public/
│  ├ favicon.ico
│  └ robots.txt
├ astro.config.mjs
├ tsconfig.json
└ package.json
```

## 結果ページの設計方針

各結果ページに含めるべき要素：

1. **見出し**: 「〇〇万円を〇〇年・金利〇〇%で借りた場合のシミュレーション」
2. **結果サマリー**: 月々返済額、総返済額、利息総額
3. **返済グラフ**: 元金と利息の推移（Islands ArchitectureでJS化）
4. **返済表**: 1年ごとの内訳（折りたたみ可）
5. **比較表**:
   - 金利を変えた場合（前後3パターン）
   - 期間を変えた場合（前後2パターン）
6. **関連リンク**: 近い条件の組合せへの内部リンク（クロール促進）
7. **解説テキスト**: その条件特有の補足説明
8. **将来のアフィリ枠**: 住宅ローン比較、火災保険など（審査通過後に実装）

## 生成パターンの想定

### 住宅ローン（初期は厳選200〜300ページから）

```typescript
amounts: [1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 6000, 7000, 8000] // 12パターン
years: [20, 25, 30, 35]                                                              // 4パターン
rates: [0.5, 1.0, 1.5, 2.0, 2.5]                                                     // 5パターン
// → 240ページ
```

### マイカーローン

```typescript
amounts: [100, 150, 200, 250, 300, 400, 500] // 7パターン（万円）
years: [3, 5, 7, 10]                          // 4パターン（年）
rates: [1.0, 2.0, 3.0, 5.0]                  // 4パターン（%）
// → 112ページ
```

**金額帯の意図**:
- 100〜150万: 中古車・軽自動車レンジ
- 200〜300万: コンパクトカー〜セダンの新車レンジ
- 400〜500万: 上級車・新車SUVレンジ

**金利帯の意図**（マイカーローンは住宅ローンより幅が広い）:
- 1.0%: 銀行マイカーローン（低位、優良条件）
- 2.0%: 銀行マイカーローン（中位、一般条件）
- 3.0%: ディーラーローン（低位）
- 5.0%: ディーラーローン（中位〜高位、残価設定型を含む）

**URL設計**:
- `/car/`: 入力フォーム（home/ と同じ構造、select + 自由入力モード）
- `/car/[params]/`: 112 パターン結果ページ（`/car/300-5-3.0/` 等）

**コード再利用方針**:
- `calcEqualPayment` / `calcAmortizationSchedule` / slug 系: そのまま流用
- `patterns.ts` に `CAR_AMOUNTS` / `CAR_YEARS` / `CAR_RATES` / `carPatterns()` を **並列追加**
- `insights.ts` にマイカー文脈の `carAmountInsight` / `carYearsInsight` / `carRateInsight` を追加
- 残価設定型・ボーナス併用払いは MVP 対象外（IDEAS.md にメモ）

### カードローン

```typescript
amounts: [10, 30, 50, 100, 200, 300]         // 6パターン（万円）
years: [1, 2, 3, 5]                          // 4パターン（年）
rates: [3.0, 5.0, 10.0, 15.0, 18.0]          // 5パターン（%）
// → 120ページ
```

**金額帯の意図**:
- 10〜30万: 急な出費の補填、生活費の補完
- 50〜100万: 引越し費用・医療費など大きめの出費
- 200〜300万: おまとめローンや事業性に近い借入

**金利帯の意図**（カードローンは住宅・マイカーより幅が広く、利息制限法上限近くまで）:
- 3.0%: 銀行カードローンの優遇金利水準（属性良好）
- 5.0%: 銀行カードローンの標準金利
- 10.0%: 銀行カードローン上位帯／消費者金融低位
- 15.0%: 消費者金融の中位〜上位
- 18.0%: 利息制限法上限（10万円未満は20%、10〜100万円18%、100万円超15%）

**URL設計**:
- `/card/`: 入力フォーム（home/, car/ と同じ構造、select + 自由入力モード）
- `/card/[params]/`: 120 パターン結果ページ（`/card/100-3-15.0/` 等）

**計算方式（重要）**:
- カードローン市場では銀行・消費者金融とも **元利均等返済方式が主流**。`calcEqualPayment` をそのまま流用する
- 「リボ払い」（クレジットカードの定額リボ：毎月の支払額固定で期間不定）は **MVP 対象外**。概念解説は記事で扱う
- ボーナス併用払い・繰上返済も MVP 対象外

**コード再利用方針**:
- `calcEqualPayment` / `calcAmortizationSchedule` / slug 系: そのまま流用
- `patterns.ts` に `CARD_AMOUNTS` / `CARD_YEARS` / `CARD_RATES` / `cardPatterns()` を **並列追加**
- `insights.ts` にカードローン文脈の `cardAmountInsight` / `cardYearsInsight` / `cardRateInsight` を追加

**段階的拡張**: 最初は厳選パターンで品質重視。アクセス見ながら需要ある領域を拡張。半端な数字（3010万等）はクエリパラメータで対応する選択肢もアリ。

## 計算ロジック（参考実装イメージ）

### 元利均等返済

```typescript
// 月々の返済額が一定（住宅ローンで一般的）
function calcEqualPayment(
  principal: number,    // 借入額（円）
  annualRate: number,   // 年利（%）
  years: number         // 返済年数
): {
  monthly: number;
  total: number;
  interest: number;
} {
  const monthlyRate = annualRate / 100 / 12;
  const months = years * 12;
  const monthly = Math.floor(
    principal * monthlyRate * Math.pow(1 + monthlyRate, months)
    / (Math.pow(1 + monthlyRate, months) - 1)
  );
  const total = monthly * months;
  const interest = total - principal;
  return { monthly, total, interest };
}
```

### 元金均等返済

毎月の元金返済額が一定。利息は残債に応じて減少。

### リボ払い計算

カードローンのリボ用。毎月の支払額固定で残債を減らす形式。

## AdSense審査通過までの準備

### 必須ページ
- 運営者情報（about）
- プライバシーポリシー（privacy）
- お問い合わせ（contact）

### コンテンツ要件
- 質の高い記事を10本程度（最低）
- 各記事1500〜3000文字程度
- 独自性のある解説（金利の仕組み、ローン選びのコツなど）

### 推奨記事テーマ例
- 「住宅ローン金利の基礎知識」
- 「元利均等と元金均等の違い」
- 「カードローンと消費者金融の違い」
- 「金利が0.5%違うとどれくらい総額が変わるか」
- 「繰り上げ返済のシミュレーション」

## 開発フェーズ

### Phase 1: プロトタイプ（〜1週間）
- [x] Astroプロジェクトセットアップ
- [x] 住宅ローンだけ実装（計算機 + 結果ページ 240パターン）
- [x] 基本的なデザイン（Tailwind v4 ベタ書き、独立サイト感を意識）
- [x] ローカルで動作確認（`pnpm dev` / `pnpm build` 通過）

### Phase 2: 機能拡張（〜2週間）
- [x] マイカーローン・カードローン追加（`car/` 112パターン、`card/` 120パターン）
- [ ] グラフ表示実装（Islands で JS 化、Chart.js or 軽量SVG）
- [x] 関連リンク・内部リンク強化（近傍パターンへのリンク、金利/期間比較表、記事↔計算機の双方向リンク）
- [x] レスポンシブデザイン（モバイル実機確認済）

### Phase 3: コンテンツ充実（〜1ヶ月）
- [x] 解説記事15本作成（住宅7・マイカー3・カードローン5。AdSense 審査のコンテンツ要件を満たす）
- [x] 必須固定ページ作成（about / privacy / contact）
- [x] SEOメタタグ最適化（canonical / OGP / Twitter Card / BreadcrumbList JSON-LD）
- [x] サイトマップ生成（`@astrojs/sitemap` で 495 URL 自動生成）
- [x] og:image 動的生成（satori + sharp、build-time PNG 482枚: home240 + car112 + card120 + articles10）
- [x] ads.txt エンドポイント実装（`PUBLIC_ADSENSE_CLIENT_ID` から生成）

### Phase 4: 公開・審査（〜1.5ヶ月）
- [x] Cloudflare Workers Static Assets にデプロイ（`loan-calc.yao.tools` 本番稼働中）
- [x] Google フォーム作成 + `PUBLIC_CONTACT_FORM_URL` を Workers 環境変数に設定
- [x] GA4 プロパティ取得 + `PUBLIC_LOAN_CALC_GA_ID`（`G-G8ECYM8W47`）を Workers 環境変数に設定
- [x] Search Console 登録（`yao.tools` ドメインプロパティで認証済）+ sitemap 送信済
- [x] AdSense 審査申請済（審査中）
- [ ] 審査通過後、広告枠実装 + `PUBLIC_ADSENSE_CLIENT_ID` 反映確認

### Phase 5: 運用・拡張
- [ ] アクセス解析を見て需要ある組合せを追加
- [ ] 教育ローン、リフォームローン等を追加
- [ ] 独自ドメイン取得（アクセス次第）
- [ ] 金融アフィリエイト導入検討

## 重要な制約・注意事項

### SEO観点
- **薄いコンテンツの大量生成と判定されないよう注意**
  - 各ページに独自性のあるテキストを必ず含める
  - 単なる数値の羅列ページを避ける
  - 関連性の高い内部リンクで「孤立ページ」を作らない

### Astro実装上の注意
- `getStaticPaths`で大量パスを返す際、ビルド時間に注意
- インタラクティブ要素は`client:load`等のディレクティブで島化
- Cloudflare Pagesの無料プランのビルド制限を意識

### 金融情報の正確性
- 計算ロジックには複数のテストケースを用意
- 「概算であり実際の借入額を保証するものではない」旨を明記
- YMYL領域なので、誤情報は致命的

## 現在の進捗と次のステップ（最終更新: 2026-05-23）

### 完了済

**計算ロジック**
- `calcEqualPayment`: 元利均等返済（万円→円換算、金利0% 対応）
- `calcAmortizationSchedule`: 年単位の元金/利息/残債推移、最終月の端数調整
- `buildHomeInsights` / `buildCarInsights` / `buildCardInsights`: ジャンル別の解説テキスト生成
- `buildSlug` / `parseSlug`: URL slug の表記固定（`.toFixed(1)` で整数金利は `.0` 形式）
- vitest で 18 ケース

**計算機ページ**
- `/home/`・`/car/`・`/card/`: 各計算機フォーム（select + 自由入力モード、リアルタイムプレビュー）
- `/home/[params]/`: 240パターン。結果サマリー / 条件特有の解説 / 金利・期間比較表 / 年次返済表 / 関連リンク / 解説記事リンク
- `/car/[params]/`: 112パターン（同構成）
- `/card/[params]/`: 120パターン（同構成）
- `/articles/`: 解説記事一覧。各記事から対応計算機ページへリンク

**解説記事（15本）**
- 住宅ローン7本: 変動/固定金利、35vs30年、元利均等/元金均等、繰上返済、金利差、年収ベース借入、頭金
- マイカーローン3本: 銀行vsディーラー、残価設定型、中古車
- カードローン5本: 銀行vs消費者金融、リボ払いとの違い、繰上返済効果、総量規制/利息制限法、おまとめローン

**SEO・インフラ**
- sitemap-index.xml（495 URL）、robots.txt、canonical / OGP / Twitter Card / BreadcrumbList JSON-LD
- og:image ビルド時生成（satori + sharp）: home240 + car112 + card120 + articles15 = 487PNG
- ads.txt エンドポイント（AdSense 審査中。承認後に `PUBLIC_ADSENSE_CLIENT_ID` を設定すると有効化）
- GA4（`G-G8ECYM8W47`）、Google フォーム、Search Console 全て設定済
- 計算機ページ → 記事、記事 → 計算機の双方向内部リンク

**本番環境**
- `https://loan-calc.yao.tools`（Cloudflare Workers Static Assets）
- GitHub push → Workers Builds で自動ビルド・デプロイ
- 親 `.env` / Workers 環境変数で `PUBLIC_OWNER_NAME`・`PUBLIC_CONTACT_FORM_URL`・`PUBLIC_LOAN_CALC_GA_ID` 設定済

### 次にやること

1. **AdSense 審査通過後**: 広告枠実装（`PUBLIC_ADSENSE_CLIENT_ID` を Workers 環境変数に設定 → 全ページへの AdSense スクリプト自動注入が有効化）
2. **グラフ表示実装**: 元金/利息推移の可視化（Island で JS 化）
3. **2サイト目**: `salary-calc.yao.tools` などの立ち上げ（`DEPLOY.md` の手順に沿って追加）
4. **教育ローン・リフォームローン**: アクセス解析を見てから判断

### 開発方針メモ

- **「まず作って直していく」** = 住宅ローンで Google 流入を観察してから他ジャンルに展開
- **自由入力モードは「簡易計算機」扱い** = SEO目線では本命ではないので視覚的に控えめ（詳細は IDEAS.md）
- **共通パッケージは作らない** = 必要になったら pnpm workspaces で後追い対応
