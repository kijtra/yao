// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // sitemap.xml と canonical/OGP の絶対URL生成のベース。
  // Cloudflare Pages のデフォルトドメインを仮置き。独自ドメインに変えたら差し替え。
  site: 'https://loan-calc.pages.dev',

  vite: {
    plugins: [tailwindcss()],
    // 親 niche-sites/.env を読みに行く（PUBLIC_OWNER_NAME などを全サイトで共有）
    envDir: '../',
  },

  integrations: [sitemap()]
});
