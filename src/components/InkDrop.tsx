"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface InkDropProps {
  text: string;
  className?: string;
  start?: string;
  end?: string;
  /* If true, play immediately (no ScrollTrigger) — used for the title page auto-animation */
  autoPlay?: boolean;
  autoDelay?: number;
  onComplete?: () => void;
}

/*
  Each letter blooms from an invisible ink-drop (tiny + blurred) to full size.
  In scroll mode: triggered by scroll position.
  In autoPlay mode: plays on mount, used for the title page opening.
*/
export function InkDrop({
  text,
  className = "",
  start = "top 85%",
  end = "top 45%",
  autoPlay = false,
  autoDelay = 0,
  onComplete,
}: InkDropProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const letters = [...text]; /* spread handles multi-byte */

  useGSAP(() => {
    const container = containerRef.current;
    if (!container) return;

    const refs = letterRefs.current.filter(Boolean) as HTMLSpanElement[];
    gsap.set(refs, { opacity: 0, scale: 0.06, filter: "blur(12px)" });

    const tl = gsap.timeline({ onComplete });

    refs.forEach((el, i) => {
      tl.to(
        el,
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.32,
          ease: "back.out(1.4)",
        },
        i * (autoPlay ? 0.11 : 0.18)
      );
    });

    if (autoPlay) {
      tl.delay(autoDelay);
    } else {
      ScrollTrigger.create({
        trigger: container,
        start,
        end,
        scrub: 1,
        animation: tl,
      });
    }
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className={`inline-block ${className}`} aria-label={text}>
      {letters.map((ch, i) => (
        <span
          key={i}
          ref={(el) => { letterRefs.current[i] = el; }}
          style={{
            display: ch === " " ? "inline" : "inline-block",
            transformOrigin: "center bottom",
          }}
          aria-hidden="true"
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </div>
  );
}
