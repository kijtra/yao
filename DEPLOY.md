# やおツールズ デプロイ手順

各サブサイトを **Cloudflare Pages の独立プロジェクト** としてデプロイする。
GitHub 連携方式（push → 自動ビルド）。リポジトリは monorepo (`yao`)、
Root directory をサイトごとに変えて1リポジトリから複数 Pages プロジェクトを生やす構成。

| サブサイト | リポジトリ内パス | CF Pages プロジェクト名 | 公開URL |
|---|---|---|---|
| loan-calc | `/loan-calc` | `loan-calc` | `https://loan-calc.yao.tools` |
| （将来）salary-calc | `/salary-calc` | `salary-calc` | `https://salary-calc.yao.tools` |

## 前提

- ドメイン `yao.tools` のネームサーバーは Cloudflare に移管済み（CF DNS 管理下）
- GitHub リポジトリ: `github.com/<owner>/yao`（private）
- Cloudflare アカウント所持

## 1. CF Pages プロジェクト作成（loan-calc を例に）

1. Cloudflare ダッシュボード → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. GitHub アカウント連携、`yao` リポジトリを選択
3. **Production branch**: `main`
4. **Build settings**:
   - Framework preset: **Astro**
   - Build command: `pnpm install --frozen-lockfile && pnpm build`
   - Build output directory: `dist`
   - **Root directory: `loan-calc`** ← サイトごとにここを変える
5. **Environment variables**（Production / Preview 両方に同じ値を入れる）:
   | キー | 値の例 |
   |---|---|
   | `PUBLIC_OWNER_NAME` | `やおツールズ` |
   | `PUBLIC_CONTACT_FORM_URL` | （Google フォーム作成後の URL） |
   | `PUBLIC_LOAN_CALC_GA_ID` | （GA4 プロパティ作成後の測定 ID） |
   | `NODE_VERSION` | `22`（`.nvmrc` で代用可、明示すると確実） |
6. **Save and Deploy** → 初回ビルド → `<project>.pages.dev` の URL で動作確認

## 2. カスタムドメイン紐付け（`loan-calc.yao.tools`）

CF DNS 管理下なので自動で済む:

1. Pages プロジェクト → **Custom domains** → **Set up a custom domain**
2. `loan-calc.yao.tools` を入力 → **Continue** → **Activate domain**
3. CF が自動で CNAME を追加、SSL 証明書も自動発行（数分で有効化）

## 3. 動作確認

- `https://loan-calc.yao.tools/` でトップ表示
- `https://loan-calc.yao.tools/sitemap-index.xml` で sitemap が返る
- `https://loan-calc.yao.tools/robots.txt` の Sitemap 行が本番URLを指している
- 任意の `home/<params>/` ページの canonical / OGP / BreadcrumbList JSON-LD が本番URLになっている

## 新サイト追加時の手順

1. リポジトリに新サイトディレクトリを追加（例: `salary-calc/`）
   - `loan-calc/` の構成を雛形にする
   - `.nvmrc`、`package.json`（`packageManager` 含む）、`astro.config.mjs`（`site` と `envDir: '../'`）を配置
2. 親 `.env.example` に `PUBLIC_<SITE>_GA_ID=` を追記
3. CF Pages で新規プロジェクト作成
   - Root directory = `<site>`、他の設定は loan-calc と同じパターン
   - 環境変数を Production / Preview に投入
4. カスタムドメイン `<site>.yao.tools` を紐付け（手順 2 と同じ）

## 留意点

- **環境変数の出処**: ローカル開発は親 `niche-sites/.env`、本番は CF Pages の Environment Variables。Vite は両方を同じ `import.meta.env.PUBLIC_*` で参照できる
- **`.env` はコミットしない**: `.gitignore` で除外済。実値は CF Pages 側にのみ入れる
- **pnpm lock file**: 各サイトの `<site>/pnpm-lock.yaml` をコミット対象にする。CF Pages のビルドは `--frozen-lockfile` で再現性を担保
- **テスト**: `pnpm test` は CF Pages のビルドコマンドには含めない。テストは GitHub Actions など別経路で回す（未整備）
- **Preview deployment**: PR を開くと自動で preview URL が発行される。本番反映前の目視確認に使う
