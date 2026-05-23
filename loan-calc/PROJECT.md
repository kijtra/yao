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
amounts: [10, 30, 50, 100, 200, 300]         // 6パターン
years: [1, 2, 3, 5]                          // 4パターン
rates: [3.0, 5.0, 10.0, 15.0, 18.0]          // 5パターン
// → 120ページ
```

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
- [ ] マイカーローン、カードローン追加（`car/`, `card/` 一式）
- [ ] グラフ表示実装（Islands で JS 化、Chart.js or 軽量SVG）
- [x] 関連リンク・内部リンク強化（近傍パターンへのリンク、金利/期間比較表）
- [ ] レスポンシブデザイン（モバイル実機確認）

### Phase 3: コンテンツ充実（〜1ヶ月）
- [ ] 解説記事10本作成（AdSense 審査のコンテンツ要件）
- [x] 必須固定ページ作成（about / privacy / contact）
- [x] SEOメタタグ最適化（canonical / OGP / Twitter Card / BreadcrumbList JSON-LD）
- [x] サイトマップ生成（`@astrojs/sitemap` で 245 URL 自動生成）

### Phase 4: 公開・審査（〜1.5ヶ月）
- [ ] Cloudflare Pages にデプロイ（実ドメイン確定で `astro.config.mjs` の `site` と `robots.txt` の Sitemap URL を差し替え）
- [ ] Google フォーム作成 + URL を `.env` の `PUBLIC_CONTACT_FORM_URL` に設定
- [ ] GA4 プロパティ取得 + `PUBLIC_LOAN_CALC_GA_ID` を `.env` に設定
- [ ] Search Console 登録 + sitemap 送信
- [ ] AdSense 審査申請
- [ ] 審査通過後、広告枠実装

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

### 完了済（住宅ローン MVP + SEO 基盤 + 公開）

**計算ロジック**
- `calcEqualPayment`: 元利均等返済（万円→円換算、金利0% 対応）
- `calcAmortizationSchedule`: 年単位の元金/利息/残債推移、最終月の端数調整
- `buildInsights`: 借入額/期間/金利の数値帯に応じた解説テキスト生成
- `buildSlug` / `parseSlug`: URL slug の表記固定（`.toFixed(1)` で整数金利は `.0` 形式）
- vitest で 18 ケース（既知値範囲・元利均等の性質・round-trip）

**ページ**
- `/`: トップ（ツール一覧）
- `/home/`: 住宅ローン入力フォーム（select + リアルタイム控えめプレビュー + 自由入力モード切替 + 大型プレビュー、URL遷移なしの「電卓モード」）
- `/home/[params]/`: 240パターンを `getStaticPaths` で事前生成。結果サマリー / 条件特有の解説 / 金利・期間比較表 / 年次返済表（折りたたみ）/ 近傍パターンへの関連リンク
- `/about/`, `/privacy/`, `/contact/`: AdSense 審査3点セット
- フッターから3固定ページに全頁から到達可能

**SEO 基盤**
- `@astrojs/sitemap` で sitemap-index.xml + sitemap-0.xml（245 URL）自動生成
- BaseLayout に canonical / OGP / Twitter Card / BreadcrumbList JSON-LD（パンくず用構造化データ）
- robots.txt に Sitemap 行
- GA4 タグ（`PUBLIC_LOAN_CALC_GA_ID` 設定 + 本番ビルド時のみ出力、is:inline）

**共通環境変数の運用**
- 親 `niche-sites/.env` に集約、各サイトは `vite.envDir: '../'` で読む
- 共通: `PUBLIC_OWNER_NAME`、`PUBLIC_CONTACT_FORM_URL`
- サイト別: `PUBLIC_<SITE>_GA_ID`（prefix で識別）

### 本番公開・解析基盤（2026-05-23 完了）

- **本番ドメイン** = `https://loan-calc.yao.tools` で稼働中（Cloudflare Workers Static Assets、GitHub 連携の Workers Builds で自動デプロイ）
- **`PUBLIC_OWNER_NAME`** = 「やおツールズ」を Workers の Build 環境変数に設定
- **`PUBLIC_CONTACT_FORM_URL`** = Google フォーム（`https://forms.gle/jVnHgBpDc7Q5giaEA`）に紐付け、contact ページから到達可能
- **`PUBLIC_LOAN_CALC_GA_ID`** = GA4 プロパティ `G-G8ECYM8W47` を本番ビルドで注入
- **Search Console** = `yao.tools` ルートのドメインプロパティで認証済、sitemap-index.xml 送信済
- **デプロイ手順は親 `niche-sites/DEPLOY.md` に外出し**（Workers Builds の設定値、カスタムドメイン、Search Console 登録、新サイト追加時の手順まで）

### 次にやることの候補（優先度順）

1. **マイカーローン展開（`car/` 一式）** ← 着手中。仕様は本ファイル「生成パターンの想定 > マイカーローン」（112パターン、URL `/car/[params]/`）
2. **解説記事10本（`articles/`）** = AdSense 審査のコンテンツ要件、最も時間がかかる本丸
3. **カードローン展開（`card/` 一式）** = 120パターン、リボ計算ロジック追加
4. **og:image 動的生成** = パターン別の数値入り画像、SNS シェア時のクリック率向上
5. **モバイル実機確認** = レスポンシブ最終チェック
6. **2サイト目（salary-calc など）の立ち上げ** = サブドメイン運用の動作実証

### 開発方針メモ

- **「まず作って直していく」** = 完璧を目指さない、住宅ローン1ジャンルで Google からの流入を観察してから他ジャンルに展開
- **自由入力モードは「簡易計算機」扱い** = SEO目線では本命ではないので、フォームの右寄せ・小さい表示で視覚的に控えめにしてある（詳細は IDEAS.md）
- **共通パッケージは作らない** = サイト数が増えて共通化したくなったら pnpm workspaces で対応
- **新概念の初出は CLAUDE.md の方針通り AskUserQuestion で確認** = TypeScript / Astro / pnpm / monorepo は学習過程
