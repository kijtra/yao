// プレースホルダ用の OG画像（1200x630 PNG）を生成して public/og-image.png に書き出す。
// 正式なブランド画像が用意できるまでの仮置き。本物が用意できたら
// public/og-image.png を上書き or このスクリプトをカスタマイズして再実行する。
//
// 実行: pnpm exec node scripts/generate-og-image.mjs

import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, "..", "public", "og-image.png");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect x="80" y="80" width="1040" height="470" fill="none" stroke="#475569" stroke-width="2" rx="16"/>
  <text x="600" y="290" font-family="Hiragino Sans, Yu Gothic, Noto Sans JP, sans-serif" font-size="88" font-weight="700" fill="#f8fafc" text-anchor="middle">ローン計算ツール集</text>
  <text x="600" y="370" font-family="Hiragino Sans, Yu Gothic, Noto Sans JP, sans-serif" font-size="32" fill="#cbd5e1" text-anchor="middle">住宅・マイカー・カードローンの返済シミュレーション</text>
  <text x="600" y="490" font-family="ui-monospace, monospace" font-size="22" fill="#64748b" text-anchor="middle">loan-calc.pages.dev</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(outPath);
console.log(`Generated: ${outPath}`);
