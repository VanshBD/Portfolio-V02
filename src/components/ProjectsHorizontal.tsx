"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { book } from "@/content/book";
import { ProjectPage } from "./ProjectPage";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CHAPTERS = book.chapters;
const N = CHAPTERS.length;

export function ProjectsHorizontal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);

  const [activeSlide, setActiveSlide]     = useState(0);
  const [slideProgress, setSlideProgress] = useState(0);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track   = trackRef.current;
      if (!section || !track) return;

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
        onUpdate(self) {
          const raw      = self.progress * (N - 1);
          const page     = Math.min(Math.floor(raw), N - 1);
          const pageProg = raw - page;

          gsap.set(track, { x: -raw * window.innerWidth });
          setActiveSlide(page);
          setSlideProgress(pageProg);
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    /* Section height = N × 100vh so there's enough scroll travel */
    <section
      ref={sectionRef}
      style={{ height: `${N * 100}vh` }}
      aria-label="Case files"
    >
      {/* Sticky viewport */}
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>

        {/* Chapter indicator dots */}
        <nav
          aria-label="Project navigation"
          style={{
            position: "absolute",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            display: "flex",
            gap: "10px",
          }}
        >
          {CHAPTERS.map((ch, i) => (
            <button
              key={ch.id}
              aria-label={`Go to ${ch.project}`}
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                border: "none",
                padding: 0,
                cursor: "pointer",
                background: "var(--color-ink)",
                opacity: activeSlide === i ? 0.9 : 0.2,
                transition: "opacity 0.3s ease, transform 0.3s ease",
                transform: activeSlide === i ? "scale(1.4)" : "scale(1)",
              }}
            />
          ))}
        </nav>

        {/* Horizontal track */}
        <div
          ref={trackRef}
          style={{
            display: "flex",
            width: `${N * 100}vw`,
            height: "100vh",
            willChange: "transform",
          }}
        >
          {CHAPTERS.map((ch, i) => (
            <ProjectPage
              key={ch.id}
              chapter={ch}
              index={i}
              activeSlide={activeSlide}
              slideProgress={slideProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
