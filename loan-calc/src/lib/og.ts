/**
 * og:image を生成するための共通ヘルパー。
 *
 * - satori で JSX 風のノードツリーから SVG を生成
 * - sharp で SVG を PNG にラスタライズ
 * - フォントはビルド時にロードしてモジュールキャッシュで使い回す
 *
 * AST を直接構築することで、satori-html を介したときに発生する
 * 「空白テキストノード」「style 属性内のクォート問題」を回避する。
 */

import fs from "node:fs/promises";
import path from "node:path";
import satori from "satori";
import sharp from "sharp";

const FONT_PATH = path.resolve("./src/assets/fonts/NotoSansJP-Bold.otf");
let cachedFont: ArrayBuffer | null = null;

async function loadFont(): Promise<ArrayBuffer> {
  if (cachedFont) return cachedFont;
  const buf = await fs.readFile(FONT_PATH);
  cachedFont = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
  return cachedFont;
}

/** ジャンルごとのアクセント色（背景の縦帯と subtitle 色に使う） */
export type OgGenre = "home" | "car" | "card" | "article" | "brand";

const GENRE_LABEL: Record<OgGenre, string> = {
  home: "住宅ローン計算",
  car: "マイカーローン計算",
  card: "カードローン計算",
  article: "解説記事",
  brand: "やおツールズ",
};

const GENRE_ACCENT: Record<OgGenre, string> = {
  home: "#1e3a8a",
  car: "#14532d",
  card: "#9a3412",
  article: "#1f2937",
  brand: "#0f172a",
};

interface OgImageInput {
  genre: OgGenre;
  /** 中央に大きく表示するメインテキスト（例: "3,000万円・35年・1.5%"） */
  headline: string;
  /** headline の下に小さく表示する補足（任意） */
  subline?: string;
  /** 右下に表示するサブドメイン名（既定: "loan-calc.yao.tools"） */
  hostLabel?: string;
}

type Style = Record<string, string | number>;
type Node = { type: string; props: { style: Style; children?: any } };

/** satori が期待する VNode をミニマルに作るヘルパー。 */
function el(type: string, style: Style, children?: any): Node {
  return { type, props: { style, children } };
}

/**
 * 1200x630 の OG 画像 PNG を生成する。
 */
export async function renderOgImage({
  genre,
  headline,
  subline,
  hostLabel = "loan-calc.yao.tools",
}: OgImageInput): Promise<Buffer> {
  const fontData = await loadFont();
  const accent = GENRE_ACCENT[genre];
  const genreLabel = GENRE_LABEL[genre];
  const headlineFontSize = headline.length > 20 ? 56 : 76;

  const mainBlockChildren: Node[] = [
    el("div", {
      fontSize: headlineFontSize,
      color: "#0f172a",
      lineHeight: 1.2,
      letterSpacing: "-0.01em",
      display: "flex",
      flexWrap: "wrap",
    }, headline),
  ];
  if (subline) {
    mainBlockChildren.push(
      el("div", {
        fontSize: 28,
        color: "#475569",
        lineHeight: 1.4,
        display: "flex",
      }, subline)
    );
  }

  const root = el(
    "div",
    {
      width: 1200,
      height: 630,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "64px 80px",
      background: "#ffffff",
      fontFamily: "Noto Sans JP",
      fontWeight: 700,
      position: "relative",
    },
    [
      el("div", {
        position: "absolute",
        top: 0,
        left: 0,
        width: 16,
        height: 630,
        background: accent,
      }),
      el("div", {
        fontSize: 32,
        color: accent,
        letterSpacing: "0.05em",
        display: "flex",
      }, genreLabel),
      el("div", {
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }, mainBlockChildren),
      el("div", {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        fontSize: 24,
        color: "#64748b",
      }, [
        el("div", { display: "flex" }, "やおツールズ"),
        el("div", { display: "flex" }, hostLabel),
      ]),
    ]
  );

  const svg = await satori(root as any, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Noto Sans JP",
        data: fontData,
        weight: 700,
        style: "normal",
      },
    ],
  });

  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return png;
}
