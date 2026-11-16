import type { MetadataRoute } from "next";
import { cases } from "@/content/site";
import { siteUrl } from "./site-url";

/*
  Every page Google can index: the home page, the résumé and one page per
  case study. Section anchors (#work, #journey...) don't belong here; search
  engines ignore them. Project covers are listed so they can show in image
  search.
*/
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: `${siteUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
      images: cases.filter((c) => c.cover).map((c) => `${siteUrl}${c.cover}`),
    },
    ...cases.map((c) => ({
      url: `${siteUrl}/work/${c.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
      ...(c.cover ? { images: [`${siteUrl}${c.cover}`] } : {}),
    })),
    { url: `${siteUrl}/resume`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];
}
