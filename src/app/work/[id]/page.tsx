import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cases, profile } from "@/content/site";
import { siteUrl } from "../../site-url";
import { CaseExplorer } from "@/site/CaseExplorer";
import { PravasaDemo, LaEuropaDemo } from "@/site/Demos";
import { PilotDemo } from "@/site/PilotDemo";

/*
  One page per case study, so each project can be found and ranked on its
  own. Everything is rendered on the server: the whole story is in the HTML
  for search engines, and the diagram and demo hydrate on top.
*/

type Params = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return cases.map((c) => ({ id: c.id }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const cs = cases.find((c) => c.id === id);
  if (!cs) return {};
  const title = `${cs.name} · case study · ${profile.name}`;
  return {
    title,
    description: cs.summary,
    alternates: { canonical: `/work/${cs.id}` },
    openGraph: {
      title,
      description: cs.summary,
      type: "article",
      url: `/work/${cs.id}`,
      ...(cs.cover ? { images: [{ url: cs.cover, alt: `${cs.name} screenshot` }] } : {}),
    },
    twitter: { card: "summary_large_image", title, description: cs.summary },
  };
}

export default async function CasePage({ params }: Params) {
  const { id } = await params;
  const i = cases.findIndex((c) => c.id === id);
  if (i < 0) notFound();
  const cs = cases[i];
  const prev = cases[(i - 1 + cases.length) % cases.length];
  const next = cases[(i + 1) % cases.length];
  const url = `${siteUrl}/work/${cs.id}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${url}#work`,
        name: cs.name,
        headline: `${cs.name}: ${cs.kicker}`,
        description: cs.summary,
        url,
        inLanguage: "en",
        creator: { "@id": `${siteUrl}/#person` },
        author: { "@type": "Person", "@id": `${siteUrl}/#person`, name: profile.name, url: siteUrl },
        keywords: cs.stack.join(", "),
        ...(cs.cover ? { image: `${siteUrl}${cs.cover}` } : {}),
        ...(cs.live ? { sameAs: cs.live } : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: profile.name, item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Work", item: `${siteUrl}/#work` },
          { "@type": "ListItem", position: 3, name: cs.name, item: url },
        ],
      },
    ],
  };

  return (
    <div className="cpage">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <nav className="cpage__nav container" aria-label="Breadcrumb">
        <Link href="/" className="cpage__brand"><span className="mono-mark__glyph">VD</span><span>{profile.name}</span></Link>
        <ol className="cpage__crumbs mono">
          <li><Link href="/#work">Work</Link></li>
          <li aria-current="page">{cs.name}</li>
        </ol>
        <Link href="/resume" className="btn btn--ghost btn--sm">Résumé</Link>
      </nav>

      <main>
        <header className="container cpage__head">
          <p className="cpage__index mono">Case study {cs.index} / {String(cases.length).padStart(2, "0")}</p>
          <p className="eyebrow">{cs.kicker}</p>
          <h1 className="cpage__title">{cs.name}</h1>
          <p className="cpage__summary">{cs.summary}</p>
          <p className="cpage__role mono">{cs.role}{cs.credit && <> · {cs.credit}</>}</p>
          <div className="cpage__links">
            {cs.live && <a className="btn btn--primary btn--sm" href={cs.live} target="_blank" rel="noopener noreferrer">Visit live site ↗</a>}
            {cs.code && <a className="btn btn--ghost btn--sm" href={cs.code} target="_blank" rel="noopener noreferrer">Read the code ↗</a>}
          </div>
          <dl className="case__metrics cpage__metrics">
            {cs.metrics.map((m) => <div key={m.label}><dt>{m.value}</dt><dd>{m.label}</dd></div>)}
          </dl>
        </header>

        <section className="container cpage__section" aria-labelledby="arch">
          <h2 id="arch" className="cpage__h2">The architecture, step by step</h2>
          <CaseExplorer cs={cs} />
        </section>

        <section className="container cpage__section" aria-labelledby="story">
          <h2 id="story" className="cpage__h2">The full story</h2>
          <ol className="cpage__story">
            {cs.steps.map((s, k) => (
              <li key={s.title}>
                <span className="cpage__n mono">{String(k + 1).padStart(2, "0")}</span>
                <div><h3>{s.title}</h3><p>{s.body}</p></div>
              </li>
            ))}
          </ol>
        </section>

        <section className="container cpage__section" aria-labelledby="stack">
          <h2 id="stack" className="cpage__h2">Built with</h2>
          <ul className="chips">{cs.stack.map((x) => <li key={x}>{x}</li>)}</ul>
          <ul className="cpage__parts">
            {cs.nodes.map((n) => <li key={n.id}><b>{n.label}</b>{n.sub && <span className="mono"> · {n.sub}</span>}<p>{n.info}</p></li>)}
          </ul>
        </section>

        {(cs.demo || cs.cover) && (
          <section className="container cpage__section" aria-labelledby="see">
            <h2 id="see" className="cpage__h2">{cs.demo ? "Try it" : "See it"}</h2>
            <div className={`case__extra${cs.demo && cs.cover && cs.demo !== "pilot" ? " has-two" : ""}${cs.demo === "pilot" ? " is-pilot" : ""}`}>
              {cs.demo && (cs.demo === "pravasa" ? <PravasaDemo /> : cs.demo === "pilot" ? <PilotDemo /> : <LaEuropaDemo />)}
              {cs.video ? (
                <div className="shot">
                  <span className="shot__frame">
                    <span className="shot__bar"><i /><i /><i /><b>{cs.name} · launch film</b></span>
                    <video src={cs.video} poster={cs.cover} controls muted playsInline preload="none" aria-label={`${cs.name} launch film`} />
                  </span>
                </div>
              ) : cs.cover && (
                <a className="shot" href={cs.live} target="_blank" rel="noopener noreferrer">
                  <span className="shot__frame">
                    <span className="shot__bar"><i /><i /><i /><b>{cs.live?.replace("https://", "")}</b></span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={cs.cover} alt={`${cs.name} live site`} loading="lazy" decoding="async" />
                  </span>
                </a>
              )}
            </div>
          </section>
        )}

        <section className="container cpage__cta">
          <p className="eyebrow">Have something like this to build?</p>
          <h2 className="cpage__cta-title">Tell me what you need. I&rsquo;ll show you how I&rsquo;d wire it.</h2>
          <div className="cpage__links">
            <Link className="btn btn--primary" href="/#sketch">Sketch your system</Link>
            <a className="btn btn--ghost" href={`mailto:${profile.email}`}>{profile.email}</a>
          </div>
        </section>

        <nav className="container cpage__pager" aria-label="More case studies">
          <Link href={`/work/${prev.id}`} className="cpage__pg"><span className="mono">← {prev.index}</span><b>{prev.name}</b></Link>
          <Link href="/#work" className="cpage__pg is-mid"><span className="mono">All work</span></Link>
          <Link href={`/work/${next.id}`} className="cpage__pg is-next"><span className="mono">{next.index} →</span><b>{next.name}</b></Link>
        </nav>
      </main>

      <footer className="footer">
        <div className="container footer__inner">
          <span>© 2026 {profile.name} · {profile.city}</span>
          <Link href="/" className="mono">Back to the portfolio</Link>
        </div>
      </footer>
    </div>
  );
}
