"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface EndSectionProps {
  email: string;
  github: string;
  githubLabel: string;
}

function ContactLink({ href, label, isEmail }: { href: string; label: string; isEmail?: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);

  useGSAP(() => {
    gsap.set(ref.current, { opacity: 0, y: 16 });
    gsap.to(ref.current, {
      opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
      scrollTrigger: { trigger: ref.current, start: "top 90%", toggleActions: "play none none reverse" },
    });
  });

  return (
    <a
      ref={ref}
      href={isEmail ? `mailto:${href}` : href}
      target={isEmail ? undefined : "_blank"}
      rel={isEmail ? undefined : "noopener noreferrer"}
      className="group block font-display font-bold"
      style={{
        fontSize: "clamp(1.2rem, 3vw, 2rem)",
        color: "var(--color-paper)",
        textDecoration: "none",
        letterSpacing: "-0.01em",
        marginBottom: "1.2rem",
        opacity: 0,
        transition: "color 0.3s ease",
      }}
    >
      <span
        style={{
          display: "inline-block",
          borderBottom: "1.5px solid rgba(247,244,237,0.35)",
          paddingBottom: "2px",
        }}
        className="group-hover:border-[var(--color-paper)]"
      >
        {label}
      </span>
    </a>
  );
}

export function EndSection({ email, github, githubLabel }: EndSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const finRef     = useRef<HTMLDivElement>(null);
  const noteRef    = useRef<HTMLParagraphElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    /* FIN. ink-drop */
    const el = finRef.current;
    if (el) {
      const letters = Array.from(el.querySelectorAll<HTMLSpanElement>("[data-letter]"));
      gsap.set(letters, { opacity: 0, scale: 0.05, filter: "blur(14px)" });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 82%", end: "top 40%", scrub: 1 },
      });
      letters.forEach((lt, i) => {
        tl.to(lt, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.4, ease: "back.out(1.6)" }, i * 0.18);
      });
    }

    if (noteRef.current) {
      gsap.fromTo(noteRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: noteRef.current, start: "top 85%", toggleActions: "play none none reverse" } }
      );
    }
  }, { scope: sectionRef });

  const FIN = "FIN.";

  return (
    <section
      ref={sectionRef}
      className="relative py-40 px-6"
      style={{ background: "var(--color-ink)", color: "var(--color-paper)" }}
    >
      {/* Grain overlay for texture on dark bg */}
      <div className="paper-grain" style={{ position: "absolute", inset: 0, opacity: 0.03, pointerEvents: "none" }} aria-hidden />

      <div
        className="mx-auto"
        style={{ maxWidth: "min(92vw, 900px)", paddingLeft: "clamp(1.5rem, 4vw, 3rem)", paddingRight: "clamp(1.5rem, 4vw, 3rem)" }}
      >
        {/* Top ornament — cream line */}
        <div style={{ height: "1px", background: "var(--color-paper)", opacity: 0.15, marginBottom: "5rem" }} />

        {/* FIN. */}
        <div
          ref={finRef}
          className="font-display font-bold text-center mb-6 select-none"
          style={{
            fontSize: "clamp(4rem, 16vw, 12rem)",
            letterSpacing: "0.2em",
            color: "var(--color-paper)",
            lineHeight: 1,
          }}
          aria-label="Fin"
        >
          {[...FIN].map((ch, i) => (
            <span
              key={i}
              data-letter="true"
              style={{ display: "inline-block", transformOrigin: "center bottom" }}
              aria-hidden="true"
            >
              {ch}
            </span>
          ))}
        </div>

        {/* Closing note */}
        <p
          ref={noteRef}
          className="font-hand text-center mb-24 opacity-0"
          style={{ fontSize: "1.15rem", color: "var(--color-paper)", opacity: 0.55 }}
        >
          Five cases. One developer.
          <br />
          The next one&rsquo;s yours — if you call.
        </p>

        {/* Ornament divider */}
        <div className="flex justify-center mb-16">
          <svg viewBox="0 0 160 20" width="160" height="20" fill="none" stroke="var(--color-paper)" strokeWidth="1" strokeLinecap="round" aria-hidden="true" style={{ opacity: 0.3 }}>
            <line x1="0" y1="10" x2="60" y2="10" />
            <circle cx="80" cy="10" r="6" />
            <path d="M 74 10 L 80 4 L 86 10 L 80 16 Z" />
            <line x1="100" y1="10" x2="160" y2="10" />
          </svg>
        </div>

        {/* Contact */}
        <div ref={contactRef} className="text-center">
          <p
            className="font-hand mb-8"
            style={{ fontSize: "1.05rem", color: "var(--color-paper)", opacity: 0.4 }}
          >
            reach out ↓
          </p>

          <ContactLink href={email} label={email} isEmail />
          <ContactLink href={github} label={`github.com/${githubLabel}`} />
        </div>

        {/* Footer */}
        <div className="mt-24 text-center">
          <p
            className="font-type"
            style={{ fontSize: "0.65rem", letterSpacing: "0.4em", color: "var(--color-paper)", opacity: 0.2 }}
          >
            VANSH DOBARIYA &nbsp;·&nbsp; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </section>
  );
}
