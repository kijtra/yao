// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // sitemap.xml と canonical/OGP の絶対URL生成のベース。
  // やおツールズ（yao.tools）のサブドメイン運用。
  site: 'https://loan-calc.yao.tools',

  vite: {
    plugins: [tailwindcss()],
    // 親 niche-sites/.env を読みに行く（PUBLIC_OWNER_NAME などを全サイトで共有）
    envDir: '../',
  },

  integrations: [sitemap()]
});
