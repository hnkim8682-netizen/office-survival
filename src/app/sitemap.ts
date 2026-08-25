import type { MetadataRoute } from "next";

import { CATEGORIES, getTools } from "@/lib/registry";
import { SITE } from "@/lib/seo/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: SITE.url, lastModified, changeFrequency: "daily", priority: 1 },
    ...CATEGORIES.map((category) => ({
      url: `${SITE.url}${category.href}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    // Only shipped tools belong in the sitemap; "coming soon" routes 404.
    ...getTools({ includeSoon: false }).map((tool) => ({
      url: `${SITE.url}${tool.href}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
