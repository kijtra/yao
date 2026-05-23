import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * 解説記事コレクション。`src/content/articles/*.md` を Markdown で管理する。
 *
 * - id（= ファイル名から拡張子を除いたもの）が URL slug になる
 * - frontmatter のスキーマは下記 zod で固定。違反するとビルド時にエラー
 */
const articles = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/articles" }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles };
