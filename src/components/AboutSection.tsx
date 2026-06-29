"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { WriteText } from "./WriteText";
import { DrawPath } from "./DrawPath";
import { AuthorSketch } from "./art/AuthorSketch";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface AboutSectionProps {
  bio: string;
  skills: readonly string[];
}

export function AboutSection({ bio, skills }: AboutSectionProps) {
  const sectionRef  = useRef<HTMLElement>(null);
  const headRef     = useRef<HTMLDivElement>(null);
  const sketchRef   = useRef<HTMLDivElement>(null);
  const skillRefs   = useRef<(HTMLSpanElement | null)[]>([]);
  const [sketchProg, setSketchProg] = useState(0);

  useGSAP(() => {
    const el = headRef.current;
    if (!el) return;

    /* Heading ink-drop on scroll */
    const letters = Array.from(el.querySelectorAll<HTMLSpanElement>("[data-letter]"));
    gsap.set(letters, { opacity: 0, scale: 0.07, filter: "blur(12px)" });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: "top 85%", end: "top 40%", scrub: 1 },
    });
    letters.forEach((lt, i) => {
      tl.to(lt, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.35, ease: "back.out(1.4)" }, i * 0.15);
    });

    /* Sketch progress driven by scroll */
    const proxy = { p: 0 };
    gsap.to(proxy, {
      p: 1,
      ease: "none",
      scrollTrigger: {
        trigger: sketchRef.current,
        start: "top 80%",
        end: "bottom 30%",
        scrub: 1.5,
        onUpdate() { setSketchProg(proxy.p); },
      },
    });

    /* Skills stagger */
    const skillEls = skillRefs.current.filter(Boolean) as HTMLSpanElement[];
    gsap.set(skillEls, { opacity: 0, y: 6 });
    const sTl = gsap.timeline({
      scrollTrigger: { trigger: sectionRef.current, start: "top 30%", end: "top -20%", scrub: 1.2 },
    });
    skillEls.forEach((el, i) => {
      sTl.to(el, { opacity: 1, y: 0, duration: 0.5 }, i * 0.4);
    });
  }, { scope: sectionRef });

  const HEADING = "The Author";

  return (
    <section
      ref={sectionRef}
      className="relative mx-auto py-32"
      style={{ maxWidth: "min(92vw, 900px)", paddingLeft: "clamp(1.5rem, 4vw, 3rem)", paddingRight: "clamp(1.5rem, 4vw, 3rem)" }}
    >
      {/* Chapter badge */}
      <p className="chapter-badge mb-3">CHAPTER · 00</p>

      {/* Editorial two-column layout on wide screens */}
      <div className="xl:grid xl:gap-16" style={{ gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)" }}>

        {/* Left: heading + bio */}
        <div>
          {/* Heading ink-drop */}
          <div
            ref={headRef}
            className="font-display font-bold mb-2 leading-tight"
            style={{ fontSize: "clamp(2.4rem, 5vw, 3.8rem)", letterSpacing: "0.02em", color: "var(--color-ink)" }}
            aria-label={HEADING}
          >
            {[...HEADING].map((ch, i) => (
              <span
                key={i}
                data-letter="true"
                style={{ display: ch === " " ? "inline" : "inline-block", transformOrigin: "center bottom" }}
                aria-hidden="true"
              >
                {ch === " " ? " " : ch}
              </span>
            ))}
          </div>

          <DrawPath
            d="M 0 4 Q 160 2 320 5"
            viewBox="0 0 320 8"
            height={8}
            strokeWidth={1.2}
            start="top 80%"
            end="top 55%"
            className="mb-10"
          />

          <WriteText
            text={bio}
            as="p"
            className="font-type leading-relaxed mb-10"
            style={{ fontSize: "1rem", lineHeight: "1.9", color: "var(--color-ink)", overflowWrap: "break-word" }}
            showCursor
            start="top 70%"
            end="top 5%"
          />
        </div>

        {/* Right: illustration */}
        <div ref={sketchRef} className="flex items-center justify-center xl:mt-16">
          <div className="w-full" style={{ maxWidth: "380px" }}>
            <AuthorSketch progress={sketchProg} />
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="mt-16">
        <p
          className="font-hand mb-4"
          style={{ fontSize: "0.95rem", color: "var(--color-pencil)", transform: "rotate(-1.2deg)", display: "inline-block" }}
        >
          tools of the trade ↓
        </p>
        <div className="flex flex-wrap gap-2 mt-2">
          {skills.map((sk, i) => (
            <span
              key={sk}
              ref={(el) => { skillRefs.current[i] = el; }}
              className="tech-tag"
            >
              {sk}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-20">
        <DrawPath
          d="M 0 1 H 600"
          viewBox="0 0 600 2"
          height={2}
          strokeWidth={0.8}
          stroke="var(--color-pencil)"
          start="top 90%"
          end="top 60%"
        />
      </div>
    </section>
  );
}
