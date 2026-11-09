"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { scrollToTarget } from "./Motion";

const LINKS = [
  { href: "#work", label: "Work", match: ["work", "more"] },
  { href: "#journey", label: "Journey", match: ["journey"] },
  { href: "#skills", label: "Skills", match: ["skills", "awards", "learning"] },
  { href: "#contact", label: "Contact", match: ["contact"] },
];

export function TopBar() {
  const [active, setActive] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  /* read the theme the inline script applied */
  useEffect(() => {
    const t = window.setTimeout(() => setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark"), 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive((e.target as HTMLElement).dataset.section ?? ""); }),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    document.querySelectorAll("[data-section]").forEach((s) => io.observe(s));
    return () => { window.removeEventListener("scroll", onScroll); io.disconnect(); };
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("vd-theme", next); } catch { /* storage blocked */ }
  };

  return (
    <header className={`topbar${scrolled ? " is-scrolled" : ""}`}>
      <a href="#top" className="mono-mark" aria-label="Vansh Dobariya, back to top" onClick={(e) => { e.preventDefault(); scrollToTarget(0); }}>
        <span className="mono-mark__glyph">VD</span>
        <span className="mono-mark__name">Vansh Dobariya</span>
      </a>
      <nav className="topbar__nav" aria-label="Sections">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} className={l.match.includes(active) ? "is-active" : ""}>{l.label}</a>
        ))}
      </nav>
      <div className="topbar__actions">
        <button type="button" className="icon-btn" onClick={toggle} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`} title="Switch theme">
          {theme === "dark" ? (
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M12 2.5v2.5M12 19v2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M2.5 12H5M19 12h2.5M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>
          )}
        </button>
        <Link href="/resume" className="btn btn--ghost btn--sm">Résumé</Link>
      </div>
    </header>
  );
}
