import type { Metadata } from "next";

import { SITE } from "./site";

interface BuildMetadataOptions {
  title: string;
  description: string;
  /** Route path such as "/tools/calculator". */
  path: string;
  keywords?: string[];
  /** Set for immersive pretend modes we do not want indexed as thin content. */
  noIndex?: boolean;
}

export function buildMetadata({
  title,
  description,
  path,
  keywords,
  noIndex,
}: BuildMetadataOptions): Metadata {
  const url = `${SITE.url}${path}`;
  const fullTitle = path === "/" ? title : `${title} | ${SITE.name}`;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "website",
      siteName: SITE.name,
      locale: SITE.locale,
      title: fullTitle,
      description,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}

/** JSON-LD helper — rendered through a <script type="application/ld+json">. */
export function webApplicationJsonLd(options: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: options.name,
    description: options.description,
    url: `${SITE.url}${options.path}`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    inLanguage: "ko-KR",
    offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
  };
}
