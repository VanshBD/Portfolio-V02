"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/* Publisher ornament — a small SVG seal drawn by the auto-timeline */
function PublisherMark() {
  return (
    <svg
      viewBox="0 0 80 80"
      width="80"
      height="80"
      fill="none"
      stroke="var(--color-pencil)"
      strokeWidth="1.2"
      strokeLinecap="round"
      aria-hidden="true"
      className="mx-auto mt-6"
    >
      <circle cx="40" cy="40" r="36" />
      <circle cx="40" cy="40" r="28" />
      {/* Decorative rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = Math.round((40 + Math.cos(rad) * 28) * 1000) / 1000;
        const y1 = Math.round((40 + Math.sin(rad) * 28) * 1000) / 1000;
        const x2 = Math.round((40 + Math.cos(rad) * 36) * 1000) / 1000;
        const y2 = Math.round((40 + Math.sin(rad) * 36) * 1000) / 1000;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="1" />;
      })}
      {/* VD monogram lines */}
      <path
        d="M 30 30 L 40 54 L 50 30"
        strokeWidth="1.8"
        stroke="var(--color-ink)"
      />
      <path d="M 30 50 L 50 50" strokeWidth="0.8" />
    </svg>
  );
}

export function TitleSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const borderTopRef = useRef<HTMLSpanElement>(null);
  const borderRightRef = useRef<HTMLSpanElement>(null);
  const borderBotRef = useRef<HTMLSpanElement>(null);
  const borderLeftRef = useRef<HTMLSpanElement>(null);
  const smallRef = useRef<HTMLParagraphElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  const [nameVisible, setNameVisible] = useState(false);

  /* Inner border (offset inward) */
  const borderIn = {
    top: useRef<HTMLSpanElement>(null),
    right: useRef<HTMLSpanElement>(null),
    bottom: useRef<HTMLSpanElement>(null),
    left: useRef<HTMLSpanElement>(null),
  };

  useGSAP(
    () => {
      const tl = gsap.timeline({ delay: 0.4 });

      /* 1 — outer border traces */
      tl.fromTo(
        borderTopRef.current,
        { width: "0%" },
        { width: "100%", duration: 0.5, ease: "none" },
      )
        .fromTo(
          borderRightRef.current,
          { height: "0%" },
          { height: "100%", duration: 0.4, ease: "none" },
        )
        .fromTo(
          borderBotRef.current,
          { width: "0%" },
          { width: "100%", duration: 0.5, ease: "none" },
          "-=0.1",
        )
        .fromTo(
          borderLeftRef.current,
          { height: "0%" },
          { height: "100%", duration: 0.4, ease: "none" },
          "-=0.1",
        );

      /* 2 — inner border */
      tl.fromTo(
        borderIn.top.current,
        { width: "0%" },
        { width: "100%", duration: 0.4, ease: "none" },
        "-=0.3",
      )
        .fromTo(
          borderIn.right.current,
          { height: "0%" },
          { height: "100%", duration: 0.3, ease: "none" },
        )
        .fromTo(
          borderIn.bottom.current,
          { width: "0%" },
          { width: "100%", duration: 0.4, ease: "none" },
          "-=0.1",
        )
        .fromTo(
          borderIn.left.current,
          { height: "0%" },
          { height: "100%", duration: 0.3, ease: "none" },
          "-=0.1",
        );

      /* 3 — "THE PORTFOLIO OF" writes in */
      tl.fromTo(
        smallRef.current,
        { opacity: 0, letterSpacing: "0.6em" },
        {
          opacity: 1,
          letterSpacing: "0.4em",
          duration: 0.6,
          ease: "power2.out",
        },
        "+=0.1",
      );

      /* 4 — name ink-drops (driven by callback) */
      tl.call(() => setNameVisible(true), [], "+=0.15");

      /* 5 — subtitle */
      tl.fromTo(
        subRef.current,
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.6 },
        "+=1.6",
      );

      /* 6 — publisher mark */
      tl.fromTo(
        markRef.current,
        { opacity: 0, scale: 0.6 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)" },
        "+=0.2",
      );

      /* 7 — scroll hint */
      tl.fromTo(
        hintRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        "+=0.4",
      );
    },
    { scope: sectionRef },
  );

  /* Ink-drop the name letters once triggered */
  const nameLetters = "VANSH DOBARIYA".split("");

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center justify-center paper-grain overflow-hidden"
      style={{ background: "var(--color-paper)" }}
    >
      {/* ── Outer border (traces on load) ── */}
      <span
        ref={borderTopRef}
        className="absolute top-8    left-8    h-[1.5px] bg-ink"
        style={{ width: 0 }}
        aria-hidden
      />
      <span
        ref={borderRightRef}
        className="absolute top-8    right-8   w-[1.5px] bg-ink"
        style={{ height: 0 }}
        aria-hidden
      />
      <span
        ref={borderBotRef}
        className="absolute bottom-8 right-8   h-[1.5px] bg-ink"
        style={{ width: 0 }}
        aria-hidden
      />
      <span
        ref={borderLeftRef}
        className="absolute bottom-8 left-8    w-[1.5px] bg-ink"
        style={{ height: 0 }}
        aria-hidden
      />

      {/* ── Inner border ── */}
      <span
        ref={borderIn.top}
        className="absolute top-12    left-12   h-px bg-pencil opacity-60"
        style={{ width: 0 }}
        aria-hidden
      />
      <span
        ref={borderIn.right}
        className="absolute top-12    right-12  w-px bg-pencil opacity-60"
        style={{ height: 0 }}
        aria-hidden
      />
      <span
        ref={borderIn.bottom}
        className="absolute bottom-12 right-12  h-px bg-pencil opacity-60"
        style={{ width: 0 }}
        aria-hidden
      />
      <span
        ref={borderIn.left}
        className="absolute bottom-12 left-12   w-px bg-pencil opacity-60"
        style={{ height: 0 }}
        aria-hidden
      />

      {/* ── Centre content ── */}
      <div
        className="relative z-10 text-center px-4 py-16 w-full"
        style={{ maxWidth: "100vw" }}
      >
        {/* Small pre-title */}
        <p
          ref={smallRef}
          className="font-type text-xs uppercase mb-8 opacity-0"
          style={{
            letterSpacing: "0.45em",
            color: "var(--color-pencil)",
          }}
        >
          THE PORTFOLIO OF
        </p>

        {/* Main name — ink-drop letters — viewport-filling */}
        <div
          ref={nameRef}
          className="font-display font-bold leading-none select-none"
          style={{
            fontSize: "clamp(2.4rem, 10.5vw, 9.5rem)",
            letterSpacing: "0.06em",
            whiteSpace: "nowrap",
            color: "var(--color-ink)",
          }}
          aria-label="Vansh Dobariya"
        >
          {nameLetters.map((ch, i) => (
            <span
              key={i}
              style={{
                display: ch === " " ? "inline" : "inline-block",
                transformOrigin: "center bottom",
                /* auto-play via CSS animation once nameVisible is set */
                animation: nameVisible
                  ? `ink-reveal 0.38s ${(0.08 + i * 0.07).toFixed(2)}s both`
                  : "none",
                opacity: nameVisible ? undefined : 0,
              }}
              aria-hidden="true"
            >
              {ch === " " ? " " : ch}
            </span>
          ))}
        </div>

        {/* Subtitle */}
        <p
          ref={subRef}
          className="font-type mt-6 opacity-0"
          style={{
            fontSize: "clamp(0.7rem, 1.2vw, 1rem)",
            letterSpacing: "0.35em",
            color: "var(--color-pencil)",
          }}
        >
          Full Stack Developer &nbsp;·&nbsp; Ahmedabad, India
        </p>

        {/* Publisher mark */}
        <div ref={markRef} className="opacity-0">
          <PublisherMark />
        </div>

        {/* Scroll hint */}
        <div
          ref={hintRef}
          className="mt-10 opacity-0 select-none"
          aria-hidden="true"
        >
          <p className="scroll-hint" style={{ color: "var(--color-pencil)" }}>
            ↓ scroll to read
          </p>
        </div>
      </div>

      {/* Corner ornaments (small ×) */}
      {[
        "top-[28px] left-[28px]",
        "top-[28px] right-[28px]",
        "bottom-[28px] left-[28px]",
        "bottom-[28px] right-[28px]",
      ].map((pos, i) => (
        <svg
          key={i}
          className={`absolute ${pos} opacity-40`}
          width="10"
          height="10"
          viewBox="0 0 10 10"
          stroke="var(--color-ink)"
          strokeWidth="1.2"
          aria-hidden="true"
        >
          <line x1="0" y1="5" x2="10" y2="5" />
          <line x1="5" y1="0" x2="5" y2="10" />
        </svg>
      ))}
    </section>
  );
}
