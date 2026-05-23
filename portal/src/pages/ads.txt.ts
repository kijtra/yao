import type { APIRoute } from "astro";

export const GET: APIRoute = () => {
  const clientId = import.meta.env.PUBLIC_ADSENSE_CLIENT_ID ?? "";
  const pubId = clientId.replace(/^ca-/, "");
  const body = pubId
    ? `google.com, ${pubId}, DIRECT, f08c47fec0942fa0\n`
    : "# PUBLIC_ADSENSE_CLIENT_ID is not set\n";

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
