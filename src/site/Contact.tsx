"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { profile } from "@/content/site";

/* The request path ends here: the response comes back 200 OK. */
export function Contact() {
  const ref = useRef<HTMLElement>(null);
  const [ok, setOk] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOk(true); io.disconnect(); } }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard blocked: the mailto link still works */ }
  };

  return (
    <section ref={ref} id="contact" className="section contact" data-section="contact" data-path="200 OK">
      <div className="container">
        <div className={`contact__status mono${ok ? " is-ok" : ""}`} aria-hidden="true">
          <span className="contact__req">POST /collaborate</span>
          <span className="contact__arrow">→</span>
          <span className="contact__res"><i />{ok ? "200 OK" : "pending"}</span>
        </div>
        <h2 className="contact__title" data-split>Have an idea, even a crazy one? Let&rsquo;s build it.</h2>
        <p className="lede" data-reveal>
          I&rsquo;m open to full-time roles anywhere in the world, hybrid, remote or on-site, and to building something new
          with you. Tell me what you&rsquo;re building and I&rsquo;ll tell you how I&rsquo;d build it.
        </p>
        <div className="contact__actions" data-reveal>
          <a className="btn btn--primary btn--lg" href={`mailto:${profile.email}`} data-magnetic>Email me</a>
          <button type="button" className="btn btn--ghost btn--lg" onClick={copy}>{copied ? "Copied ✓" : "Copy email"}</button>
          <a className="btn btn--ghost btn--lg" href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a className="btn btn--ghost btn--lg" href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          <Link className="btn btn--link btn--lg" href="/resume">Résumé →</Link>
        </div>
        <p className="contact__email mono" data-reveal>{profile.email}</p>
      </div>
    </section>
  );
}
