# niche-sites プロジェクト方針

## プロジェクトの性質

業務とは別の個人プロジェクト。AdSense収益狙いのニッチサイト群を構築するのが表向きの目的だが、**TypeScript / pnpm / monorepo / Astro を実際に使いながら覚える**という個人的な学習も兼ねている。

サイトの仕様詳細は `PROJECT.md` 参照。

## ユーザーのバックグラウンド（このプロジェクト固有）

- 普段は **PHP畑**（業務ではPHPメイン）。CTO。
- JS / HTML / CSS / MySQL は問題なく扱える
- **TypeScript は未経験**
- **pnpm は未経験**（npm は触ったことあり）
- **monorepo 管理は未経験**
- **Astro は初挑戦**

## 期待する進め方

「黙って完成形を出す」のではなく、**作業しながら新概念に軽い解説を添える**スタイルで進める。

- TypeScript の型構文・ジェネリクス・ユニオン型などは **PHPとの対比** で 1〜2 行説明する（例: 「TSの`interface`はPHPと違って構造的型付け。`implements`宣言なしで形が合えば代入できる」）
- pnpm 独自コマンドやワークスペース機能を使うときは何をしているか軽く触れる
- Astro 独特の概念（Islands Architecture、`getStaticPaths`、フロントマター `---`、`.astro` ファイルの構造など）は初出時に説明
- 既知の概念（DOM API、CSSセレクタ、HTTP、Git基本操作など）は説明不要
- 解説は短く。冗長な親切は不要。新概念の **初出だけ** 補足する

## 未経験領域の概念に出会ったときの確認

ユーザーは以下の領域が未経験。これらに関連する **新概念が初出する場面** で、作業を進める前に `AskUserQuestion` で軽く確認する。

### 確認対象の領域（例）

- **TypeScript の型機能**: ジェネリクス、ユニオン/インターセクション型、`type` vs `interface`、structural typing、`satisfies`、`unknown` vs `any`、宣言マージ、`as const`、Conditional Types
- **モダン JS のツールチェーン**: Vite、esbuild、Rollup、ESM vs CommonJS、tree shaking、HMR、source map、code splitting
- **pnpm 独自機能**: `workspaces`、`workspace:*` プロトコル、`peerDependencies`、catalog、`overrides`、サプライチェーン保護（`minimumReleaseAge`、`allowBuilds`）、`onlyBuiltDependencies`
- **monorepo 運用**: 共通パッケージ、内部依存、changesets、turborepo、root vs workspace の `package.json`
- **Astro 固有概念**: Islands Architecture、`getStaticPaths`、フロントマター `---`、`client:load` / `client:idle` / `client:visible` 等のディレクティブ、Astro Components vs UI Framework Components、コンテンツコレクション、`Astro.glob`、SSG vs SSR vs Hybrid
- **モダン CSS の慣習**: Tailwind の utility-first 思想、CSS custom properties（`--var`）、cascade layers（`@layer`）、`@import` の挙動、container queries、`oklch()` 色空間
- **Node.js エコシステム周辺**: corepack、Node バージョン管理（nvm/Volta）、ネイティブモジュールの `postinstall`、Apple Silicon バイナリ問題
- **CI/CD 慣習**: Cloudflare Pages のビルド・preview deployment・edge function、GitHub Actions、conventional commits、semantic-release

### 質問のスタイル

`AskUserQuestion` で 2〜3 択にする。基本パターン:

- **「知ってる」** → 説明スキップして進める
- **「聞いたことはあるが詳しくない」** → 1〜2 行で要点だけ補足
- **「初耳/知らない」** → PHPとの対比を交えて短く解説、必要ならコード例

質問例:

> 「`pnpm workspaces` って知ってる？ monorepo 機能だけど、composer のサブパッケージ管理に近い」
>
> 「TypeScript の `satisfies` 演算子は知ってる？ 型チェックだけして変数の型は推論されたままにする演算子」
>
> 「Vite の HMR（Hot Module Replacement）って何か解る？ ブラウザリロードせずにモジュールだけ差し替える仕組み」

### 既出の概念は再質問しない

同じ会話の中で一度説明した概念は次は聞かずに進める。会話履歴から既出かどうか判断する。

### 質問しすぎない

新概念が連続で出てくる場面で毎回聞くと作業が止まる。1セッションで聞く確認は多くて 2〜3 個に抑え、それ以上は短い解説を添えて進めて構わない。確認すべきは「ここを理解しておかないと次の判断ができない」レベルの概念。

## 構成方針（決定済）

- 親レベル（`niche-sites/`）で Claude Code を起動し、全サイト横断で扱う
- サイトは **サブディレクトリで完全独立**（独立 Astro プロジェクト、独立デプロイ）
- 共通パッケージは作らない（必要になったら `pnpm workspaces` 化を後追いで検討）
- サブドメイン運用想定（SEO的に各サイトを独立特化サイトとして扱う）

## 現在のサイト

- `loan-calc/` … ローン計算ツール（Astro 6 + TypeScript strict + Tailwind v4 + pnpm 11）

## サイトごとのドキュメント

各サイト配下に2種類のMarkdownを置く方針:

- `<site>/PROJECT.md` … **仕様書**。URL設計・データモデル・開発フェーズなど確定情報
- `<site>/IDEAS.md` … **ブレインストーミングメモ**。未確定の拡張アイデア、検討中の機能、捨てた案の記録

**Claude の動き方**:
- 該当サイトを触る作業のときは、まず `<site>/PROJECT.md` を Read して仕様を把握する
- `<site>/IDEAS.md` は **「実装予定」ではない** ことに注意。ここに書いてある内容を勝手に実装しない
- 仕様が確定したら IDEAS.md から PROJECT.md へ移す

## 共通環境変数

全サイトで使う運営者名・問い合わせ先などは、親 `niche-sites/.env` に集約。各サイトの `astro.config.mjs` で `envDir: '../'` を指定して読みに行く。

### 親 .env のキー設計

- `PUBLIC_OWNER_NAME` … 全サイト共通の運営者名（例: ニッチサイト編集部）
- `PUBLIC_CONTACT_FORM_URL` … 共通の Google フォーム URL（1フォームで全サイト分の問い合わせを受ける）
- `PUBLIC_<SITE>_GA_ID` … サイト別 GA4 ID。prefix でサイトを識別（例: `PUBLIC_LOAN_CALC_GA_ID`）

`PUBLIC_` プレフィックスはクライアント側に公開される値（Vite/Astro 慣習）。サーバ専用にしたい変数を後から増やす場合は `PUBLIC_` を付けずに書く。

### サイト固有の `.env` は作らない

`envDir: '../'` を指定するとサイト直下の `.env` は読まれない。混乱の元なので、サイト固有 `.env.example` は置かず、親 `.env.example` だけを参照する運用にする。

### 新規サイトを追加するとき

1. `niche-sites/.env.example` に新サイト用の `PUBLIC_<NEWSITE>_GA_ID=` を追記
2. 新サイトの `astro.config.mjs` に `envDir: '../'` を設定
3. 新サイトの BaseLayout で `import.meta.env.PUBLIC_<NEWSITE>_GA_ID` を参照
4. `PUBLIC_OWNER_NAME` / `PUBLIC_CONTACT_FORM_URL` はそのまま共有
