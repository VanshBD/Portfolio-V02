import type { MetadataRoute } from "next";
import { siteUrl } from "./site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/resume`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];
}
