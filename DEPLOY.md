# やおツールズ デプロイ手順

各サブサイトを **Cloudflare Workers (Static Assets)** の独立プロジェクトとしてデプロイする。
Workers Builds の GitHub 連携で push → 自動ビルド → 自動デプロイ。
リポジトリは monorepo (`yao`)、Root directory をサイトごとに変えて1リポジトリから複数 Workers プロジェクトを生やす構成。

| サブサイト | リポジトリ内パス | Workers プロジェクト名 | 公開URL |
|---|---|---|---|
| loan-calc | `/loan-calc` | `loan-calc` | `https://loan-calc.yao.tools` |
| （将来）salary-calc | `/salary-calc` | `salary-calc` | `https://salary-calc.yao.tools` |

## なぜ Pages ではなく Workers？

Cloudflare は新規プロジェクトを Workers Static Assets で作る方向に統合中。
Pages は既存ユーザー向けに維持されるが、新規は Workers が推奨。
本リポジトリも Workers Builds 前提でセットアップしてある。

## 前提

- ドメイン `yao.tools` のネームサーバーは Cloudflare に移管済み（CF DNS 管理下）
- GitHub リポジトリ: `github.com/kijtra/yao`（private）
- Cloudflare アカウント所持

## リポジトリ側の準備（実装済）

各サブサイトに以下を配置:

- `<site>/wrangler.jsonc` … Workers の設定。`assets.directory` でビルド出力ディレクトリを指定
- `<site>/.nvmrc` … Node バージョン固定（`22`）
- `<site>/package.json` の `packageManager` … pnpm バージョン固定
- `<site>/package.json` の `devDependencies.wrangler` … wrangler CLI 同梱
- `<site>/pnpm-workspace.yaml` の `allowBuilds.workerd: true` … pnpm の build script 許可

## 1. Workers プロジェクト作成（loan-calc を例に）

1. Cloudflare ダッシュボード → **Workers & Pages** → **Create** → **Import a repository**
2. GitHub アカウント連携、`kijtra/yao` リポジトリを選択
3. プロジェクト名: `loan-calc`
4. **Production branch**: `main`
5. **Build settings**:
   - **Build command**: `pnpm install --frozen-lockfile && pnpm build`
   - **Deploy command**: `npx wrangler deploy`（デフォルトのまま）
   - **Root directory**: `loan-calc` ← サイトごとにここを変える
   - Build output directory は **ダッシュボードでは指定しない**（`wrangler.jsonc` の `assets.directory` が使われる）
6. **Environment variables**（Production / Preview 両方に同じ値を入れる）:
   | キー | 値の例 |
   |---|---|
   | `PUBLIC_OWNER_NAME` | `やおツールズ` |
   | `PUBLIC_CONTACT_FORM_URL` | （Google フォーム作成後の URL） |
   | `PUBLIC_LOAN_CALC_GA_ID` | （GA4 プロパティ作成後の測定 ID） |
   | `NODE_VERSION` | `22`（`.nvmrc` で代用可、明示すると確実） |
7. **Create and deploy** → 初回ビルド → `loan-calc.<account>.workers.dev` で動作確認

## 2. カスタムドメイン紐付け（`loan-calc.yao.tools`）

CF DNS 管理下なので自動で済む:

1. Workers プロジェクト → **Settings** → **Domains & Routes** → **Add** → **Custom domain**
2. `loan-calc.yao.tools` を入力 → **Add domain**
3. CF が自動で DNS レコードを追加、SSL 証明書も自動発行（数分で有効化）

## 3. 動作確認

- `https://loan-calc.yao.tools/` でトップ表示
- `https://loan-calc.yao.tools/sitemap-index.xml` で sitemap が返る
- `https://loan-calc.yao.tools/robots.txt` の Sitemap 行が本番URLを指している
- 任意の `home/<params>/` ページの canonical / OGP / BreadcrumbList JSON-LD が本番URLになっている

## 新サイト追加時の手順

1. リポジトリに新サイトディレクトリを追加（例: `salary-calc/`）。`loan-calc/` の構成を雛形にする:
   - `.nvmrc`、`package.json`（`packageManager` 含む）、`pnpm-workspace.yaml`、`wrangler.jsonc`
   - `astro.config.mjs` に `site: 'https://salary-calc.yao.tools'` と `envDir: '../'`
   - `wrangler.jsonc` の `name` をサイト名（例: `salary-calc`）に変更
2. 親 `.env.example` に `PUBLIC_<SITE>_GA_ID=` を追記
3. Workers プロジェクト新規作成（Root directory = `<site>`、他は loan-calc と同じパターン）
4. 環境変数を Production / Preview に投入
5. カスタムドメイン `<site>.yao.tools` を紐付け（手順 2 と同じ）

## ローカルでの動作確認（任意）

CF アカウントに認証してビルド成果物のドライランを試せる:

```sh
cd loan-calc
pnpm build
pnpm exec wrangler deploy --dry-run    # 実デプロイせず内容だけ確認
pnpm exec wrangler login                # CF アカウント認証（初回のみ）
pnpm exec wrangler deploy               # ローカルからの実デプロイ（緊急時用）
```

通常は GitHub に push → Workers Builds が自動でビルド・デプロイ。`wrangler deploy` のローカル実行は使わない。

## 留意点

- **環境変数の出処**: ローカル開発は親 `niche-sites/.env`、本番は Workers の Environment Variables。Vite はどちらも同じ `import.meta.env.PUBLIC_*` で参照できる
- **`.env` はコミットしない**: `.gitignore` で除外済。実値は Workers 側にのみ入れる
- **pnpm lock file**: 各サイトの `<site>/pnpm-lock.yaml` をコミット対象にする。CF Builds のビルドは `--frozen-lockfile` で再現性担保
- **テスト**: `pnpm test` は Build command には含めない。GitHub Actions で別途回す想定（未整備）
- **Preview deployment**: PR を開くと自動で preview URL が発行される（Workers Builds の Preview deploy command が自動で走る）
- **`compatibility_date`**: `wrangler.jsonc` の値は新サイト追加時の日付に合わせる。古いまま放置すると将来の API 改善を受けられない
