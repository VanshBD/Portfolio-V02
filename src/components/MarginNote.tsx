"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface MarginNoteProps {
  text: string;
  annotation?: string;
  side?: "left" | "right";
}

/*
  Handwritten-style margin note that rotates slightly and fades in as
  its chapter scrolls into view. On narrow screens it collapses inline.
*/
export function MarginNote({ text, annotation, side = "right" }: MarginNoteProps) {
  const noteRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = noteRef.current;
    if (!el) return;

    gsap.set(el, { opacity: 0, x: side === "right" ? 20 : -20, rotate: -2 });

    gsap.to(el, {
      opacity: 1,
      x: 0,
      rotate: side === "right" ? 1.5 : -1.5,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });
  }, { scope: noteRef });

  const offsetClass =
    side === "right"
      ? "xl:absolute xl:left-full xl:ml-10 xl:w-48"
      : "xl:absolute xl:right-full xl:mr-10 xl:w-48 xl:text-right";

  return (
    <div
      ref={noteRef}
      className={`${offsetClass} mt-6 xl:mt-0 xl:top-4`}
      aria-label={`Margin note: ${text}`}
    >
      {/* Small drawn arrow pointing into content (right side) */}
      <svg
        viewBox="0 0 40 16"
        width="40"
        height="16"
        fill="none"
        stroke="var(--color-pencil)"
        strokeWidth="1"
        strokeLinecap="round"
        className={`mb-1 ${side === "right" ? "block" : "ml-auto"}`}
        aria-hidden="true"
      >
        <path d="M 36 8 L 4 8 M 4 8 L 10 4 M 4 8 L 10 12" />
      </svg>

      <p
        className="font-hand text-sm leading-snug whitespace-pre-line"
        style={{ color: "var(--color-pencil)", fontSize: "0.85rem" }}
      >
        {text}
      </p>

      {annotation && (
        <p
          className="mt-1 font-hand text-xs"
          style={{ color: "var(--color-red)", fontSize: "0.75rem" }}
        >
          {annotation}
        </p>
      )}
    </div>
  );
}
