"use client";

import { useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Tag = "p" | "h1" | "h2" | "h3" | "h4" | "span" | "div";

interface WriteTextProps {
  text: string;
  as?: Tag;
  className?: string;
  style?: CSSProperties;
  showCursor?: boolean;
  start?: string;
  end?: string;
  highlightWords?: string[];
}

/*
  Reveals text word-by-word as the user scrolls, with a blinking cursor
  sitting at the write-head. highlightWords receives a list of words to
  mark with the yellow highlight class once they appear.
*/
export function WriteText({
  text,
  as: Tag = "p",
  className = "",
  style,
  showCursor = false,
  start = "top 88%",
  end = "top 28%",
  highlightWords = [],
}: WriteTextProps) {
  const containerRef = useRef<HTMLElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const cursorRef = useRef<HTMLSpanElement>(null);

  const words = text.split(" ");
  const highlightSet = new Set(highlightWords.map((w) => w.toLowerCase()));

  useGSAP(() => {
    const container = containerRef.current;
    if (!container) return;

    const refs = wordRefs.current.filter(Boolean) as HTMLSpanElement[];
    if (!refs.length) return;

    gsap.set(refs, { opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start,
        end,
        scrub: 1.5,
      },
    });

    refs.forEach((el, i) => {
      tl.to(el, { opacity: 1, duration: 0.8 }, i * 0.8);
    });

    if (cursorRef.current) {
      tl.to(cursorRef.current, { opacity: 0, duration: 0.4 }, refs.length * 0.8);
    }
  }, { scope: containerRef });

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const El = Tag as any;

  return (
    <El ref={containerRef} className={className} style={style}>
      {words.map((word, i) => {
        const isHighlight = highlightSet.has(word.toLowerCase().replace(/[.,]/g, ""));
        return (
          <span
            key={i}
            ref={(el) => { wordRefs.current[i] = el; }}
            className={isHighlight ? "ink-highlight" : undefined}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
      {showCursor && (
        <span
          ref={cursorRef}
          className="writing-cursor"
          aria-hidden="true"
        />
      )}
    </El>
  );
}
