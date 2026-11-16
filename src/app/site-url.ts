/* The public address of the site, used for the canonical link, sitemap,
   robots.txt, share images and structured data. Set NEXT_PUBLIC_SITE_URL
   when a custom domain is added; until then production uses the address
   that's shared publicly (not Vercel's internal project address). */
const PUBLIC_URL = "https://vansh-dobariya.vercel.app";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.NODE_ENV === "production" ? PUBLIC_URL : "http://localhost:3000");
