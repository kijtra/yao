import type { APIRoute, GetStaticPaths } from "astro";
import { homePatterns } from "../../../lib/loan/patterns";
import { buildSlug } from "../../../lib/loan/slug";
import { renderOgImage } from "../../../lib/og";

export const getStaticPaths: GetStaticPaths = () => {
  return homePatterns().map((p) => ({
    params: { params: buildSlug(p) },
    props: p,
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { amount, years, rate } = props as { amount: number; years: number; rate: number };
  const headline = `${amount.toLocaleString()}万円・${years}年・${rate.toFixed(1)}%`;

  const png = await renderOgImage({
    genre: "home",
    headline,
  });

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
