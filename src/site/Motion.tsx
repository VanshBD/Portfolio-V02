"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

/* The shared Lenis instance, so anchors and the request path can use it. */
export const scroller: { lenis: Lenis | null } = { lenis: null };

export const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Smooth-scroll to an element or to the top, falling back to native scrolling. */
export function scrollToTarget(target: string | HTMLElement | number) {
  if (scroller.lenis) scroller.lenis.scrollTo(target, { offset: typeof target === "number" ? 0 : -72, duration: 1.4 });
  else if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
  else {
    const el = typeof target === "string" ? document.querySelector(target) : target;
    el?.scrollIntoView({ behavior: "smooth" });
  }
}

/*
  Page-wide motion:
  - Lenis momentum scrolling, synced with ScrollTrigger
  - [data-reveal]    fades and rises into view once
  - [data-split]     headline words rise from a mask
  - [data-count]     numbers count up once (data-to, data-suffix, data-prefix)
  - [data-magnetic]  buttons lean toward the cursor
  - a[href^="#"]     in-page links scroll smoothly
*/
export function Motion() {
  useEffect(() => {
    const reduced = prefersReduced();
    const cleanups: (() => void)[] = [];

    /* in-page anchors */
    const onAnchor = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      scrollToTarget(el as HTMLElement);
      history.replaceState(null, "", id);
    };
    document.addEventListener("click", onAnchor);
    cleanups.push(() => document.removeEventListener("click", onAnchor));

    if (reduced) {
      document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
        el.textContent = (el.dataset.prefix ?? "") + Number(el.dataset.to ?? 0).toLocaleString("en-IN") + (el.dataset.suffix ?? "");
      });
      return () => cleanups.forEach((c) => c());
    }

    document.documentElement.classList.add("has-motion");

    /* smooth scroll */
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 });
    scroller.lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    cleanups.push(() => { gsap.ticker.remove(raf); lenis.destroy(); scroller.lenis = null; });

    const ctx = gsap.context(() => {
      /* reveals */
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        const delay = Number(el.dataset.delay ?? 0);
        gsap.fromTo(el, { autoAlpha: 0, y: 36 }, {
          autoAlpha: 1, y: 0, duration: 1, delay, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      /* headlines */
      gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
        const split = SplitText.create(el, { type: "words,lines", mask: "lines" });
        gsap.from(split.words, {
          yPercent: 110, duration: 1.1, ease: "expo.out", stagger: 0.045,
          scrollTrigger: { trigger: el, start: "top 86%", once: true },
        });
        cleanups.push(() => split.revert());
      });

      /* counters */
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const to = Number(el.dataset.to ?? 0);
        const pre = el.dataset.prefix ?? "", suf = el.dataset.suffix ?? "";
        const o = { v: 0 };
        el.textContent = pre + "0" + suf;
        gsap.to(o, {
          v: to, duration: 1.6, ease: "power2.out",
          onUpdate: () => { el.textContent = pre + Math.round(o.v).toLocaleString("en-IN") + suf; },
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });
    });
    cleanups.push(() => ctx.revert());

    /* magnetic buttons (mouse only) */
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
        const move = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.35, duration: 0.4, ease: "power3.out" });
        };
        const leave = () => gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.4)" });
        el.addEventListener("mousemove", move);
        el.addEventListener("mouseleave", leave);
        cleanups.push(() => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", leave); });
      });
    }

    /* fonts change layout, so measure again once they're in */
    document.fonts?.ready.then(() => ScrollTrigger.refresh()).catch(() => {});
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 600);
    cleanups.push(() => clearTimeout(t));

    return () => cleanups.forEach((c) => c());
  }, []);

  return null;
}
