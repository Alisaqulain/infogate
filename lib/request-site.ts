import { cache } from "react";
import { headers } from "next/headers";
import { SITE_URL } from "@/lib/site";

/**
 * Origin for the current request (e.g. http://localhost:3000 in dev).
 * Keeps canonical + hreflang aligned with the URL Lighthouse (and users) see.
 */
export const getRequestSiteUrl = cache(async (): Promise<string> => {
  const h = await headers();
  const hostRaw = h.get("x-forwarded-host") ?? h.get("host") ?? "";
  const host = hostRaw.split(",")[0]?.trim();
  if (!host) return SITE_URL;

  const protoRaw = h.get("x-forwarded-proto");
  const firstProto = protoRaw?.split(",")[0]?.trim();
  const isLocal =
    host.startsWith("localhost:") ||
    host === "localhost" ||
    host.startsWith("127.") ||
    host.endsWith(".local");
  const proto = firstProto ?? (isLocal ? "http" : "https");

  return `${proto}://${host}`;
});
