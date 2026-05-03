import { getRequestSiteUrl } from "@/lib/request-site";
import { LOGO_SRC, SITE_NAME } from "@/lib/site";

type Props = { locale: string };

export async function SeoJsonLd({ locale }: Props) {
  const siteUrl = await getRequestSiteUrl();
  const inLanguage = locale === "ar" ? "ar" : "en";
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: SITE_NAME,
        inLanguage: [inLanguage, inLanguage === "ar" ? "en" : "ar"],
        publisher: { "@id": `${siteUrl}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: SITE_NAME,
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}${LOGO_SRC}`,
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
