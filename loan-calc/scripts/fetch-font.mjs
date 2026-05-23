/**
 * og:image 生成で使う Noto Sans JP Bold を GitHub から取得する。
 * ビルド時に `pnpm build` の最初に走り、ローカルにフォントがなければ DL。
 *
 * リポジトリに 16MB のフォントを含めると重いので、ビルド時取得方式にする。
 * 既に存在する場合はスキップ（ローカル開発の高速化）。
 */

import fs from "node:fs/promises";

const URL =
  "https://github.com/notofonts/noto-cjk/raw/main/Sans/OTF/Japanese/NotoSansCJKjp-Bold.otf";
const TARGET = "src/assets/fonts/NotoSansJP-Bold.otf";

try {
  const stat = await fs.stat(TARGET);
  if (stat.size > 1_000_000) {
    console.log(`[fetch-font] Already exists: ${TARGET} (${(stat.size / 1024 / 1024).toFixed(2)}MB)`);
    process.exit(0);
  }
} catch {
  // not found, fall through to download
}

console.log(`[fetch-font] Downloading ${URL}...`);
const res = await fetch(URL);
if (!res.ok) {
  console.error(`[fetch-font] Failed: HTTP ${res.status}`);
  process.exit(1);
}
const buf = Buffer.from(await res.arrayBuffer());

await fs.mkdir("src/assets/fonts", { recursive: true });
await fs.writeFile(TARGET, buf);
console.log(
  `[fetch-font] Downloaded ${(buf.length / 1024 / 1024).toFixed(2)}MB to ${TARGET}`
);
