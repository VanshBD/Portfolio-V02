import { profile, cases } from "@/content/site";
import { siteUrl } from "./site-url";

/*
  Structured data for search engines: who Vansh is (Person), linked to his
  LinkedIn and GitHub so name searches connect them, plus the website itself.
*/
export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: profile.name,
        url: siteUrl,
        email: `mailto:${profile.email}`,
        jobTitle: profile.role,
        description: profile.sub,
        address: { "@type": "PostalAddress", addressLocality: "Ahmedabad", addressRegion: "Gujarat", addressCountry: "IN" },
        alumniOf: { "@type": "CollegeOrUniversity", name: "Swarnim Startup & Innovation University" },
        knowsAbout: ["Backend development", "Node.js", "Express", "TypeScript", "Next.js", "React", "MongoDB", "Redis", "REST APIs", "RBAC", "WebSockets", "AI integration", "RAG"],
        sameAs: [profile.linkedin, profile.github],
        award: ["1st Runner Up, PromptWars Ahmedabad 2026"],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: `${profile.name} · Portfolio`,
        author: { "@id": `${siteUrl}/#person` },
        inLanguage: "en",
      },
      {
        "@type": "ItemList",
        name: "Case studies",
        itemListElement: cases.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "CreativeWork",
            name: c.name,
            description: c.summary,
            url: `${siteUrl}/#case-${c.id}`,
            creator: { "@id": `${siteUrl}/#person` },
            ...(c.live ? { sameAs: c.live } : {}),
          },
        })),
      },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
