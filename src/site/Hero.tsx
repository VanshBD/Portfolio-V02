"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { profile } from "@/content/site";
import { HeroNetwork } from "./HeroNetwork";
import { StreakPill } from "./GitHubPulse";

gsap.registerPlugin(SplitText, useGSAP);

export function Hero({ streak }: { streak?: number }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const split = SplitText.create(".hero__title", { type: "words,lines", mask: "lines" });
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.from(".hero__eyebrow", { autoAlpha: 0, y: 12, duration: 0.8 }, 0.1)
      .from(split.words, { yPercent: 115, duration: 1.3, stagger: 0.06 }, 0.2)
      .from(".hero [data-hero-in]", { autoAlpha: 0, y: 22, duration: 1, stagger: 0.08 }, 0.7)
      .from(".hero__net", { autoAlpha: 0, duration: 1.8, ease: "power2.out" }, 0.3);
    return () => split.revert();
  }, { scope: ref });

  return (
    <section ref={ref} id="top" className="hero" data-section="top" data-path="/">
      <HeroNetwork />
      <div className="container hero__inner">
        <p className="hero__eyebrow eyebrow">
          <span className="live-dot" aria-hidden="true" /> {profile.status}
        </p>
        <h1 className="hero__title">
          <span className="hero__name">{profile.name}</span>
          {profile.headline}
        </h1>
        <p className="hero__sub" data-hero-in>{profile.sub}</p>
        <div className="hero__meta" data-hero-in>
          <span>{profile.role}</span><span aria-hidden="true">·</span>
          <span>{profile.focus}</span><span aria-hidden="true">·</span>
          <span>{profile.city}</span>
          {streak ? <StreakPill streak={streak} /> : null}
        </div>
        <div className="hero__ctas" data-hero-in>
          <a href="#work" className="btn btn--primary" data-magnetic>See how I build</a>
          <Link href="/resume" className="btn btn--ghost" data-magnetic>Résumé</Link>
          <a href={`mailto:${profile.email}`} className="btn btn--link">{profile.email}</a>
        </div>
      </div>
      <a href="#how" className="hero__scroll" aria-label="Scroll to the next section">
        <span>Scroll</span>
        <i aria-hidden="true" />
      </a>
    </section>
  );
}
