"use client";

import { useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Chapter as ChapterData } from "@/content/types";
import { spotVar } from "@/content/characters";
import { useComicStore } from "@/store/comic";
import { Panel } from "./Panel";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface ChapterProps {
  chapter: ChapterData;
  chapterIndex: number;
}

/* Scroll travel per panel, in vh. Higher = slower, more dwell time. */
const VH_PER_PANEL = 110;

export function Chapter({ chapter, chapterIndex }: ChapterProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const setChapter = useComicStore((s) => s.setChapter);
  const setCurrentPanel = useComicStore((s) => s.setCurrentPanel);
  const setScrollProgress = useComicStore((s) => s.setScrollProgress);
  const reducedMotion = useComicStore((s) => s.reducedMotion);

  const spot = chapter.spot !== "none" ? spotVar[chapter.spot] : undefined;
  const N = chapter.panels.length;

  const onUpdate = useCallback(
    (self: ScrollTrigger) => {
      const p = self.progress;
      const raw = p * N;
      const idx = Math.min(Math.floor(raw), N - 1);
      setActive(idx);
      setProgress(raw - idx);
      setScrollProgress(p);
      setCurrentPanel(idx);
      if (p > 0.05 && p < 0.98) setChapter(chapterIndex);
    },
    [N, chapterIndex, setChapter, setCurrentPanel, setScrollProgress]
  );

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const wraps = panelRefs.current.filter(Boolean) as HTMLDivElement[];
      if (!wraps.length) return;

      /* Reduced motion: static, no pin, show first panel only. */
      if (reducedMotion) {
        gsap.set(wraps, { opacity: 1 });
        return;
      }

      gsap.set(wraps.slice(1), { opacity: 0 });
      gsap.set(wraps[0], { opacity: 1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${N * VH_PER_PANEL}vh`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          onUpdate,
          onEnter: () => setChapter(chapterIndex),
          onEnterBack: () => setChapter(chapterIndex),
        },
      });

      for (let i = 0; i < N - 1; i++) {
        tl.to(wraps[i], { opacity: 1, duration: 0.72 }, i);
        tl.to(wraps[i], { opacity: 0, duration: 0.28, ease: "power1.in" }, i + 0.72);
        tl.fromTo(
          wraps[i + 1],
          { opacity: 0 },
          { opacity: 1, duration: 0.28, ease: "power1.out" },
          i + 0.72
        );
      }
      tl.to(wraps[N - 1], { opacity: 1, duration: 0.28 }, N - 1);
    },
    { scope: sectionRef, dependencies: [chapter.id, reducedMotion] }
  );

  return (
    <section
      ref={sectionRef}
      data-chapter={chapter.id}
      data-chapter-index={chapterIndex}
      className="relative h-screen w-screen overflow-hidden"
      style={{ background: "#0a0a0a" }}
    >
      {/* Panels stacked; GSAP drives opacity */}
      {chapter.panels.map((panel, i) => (
        <div
          key={panel.id}
          ref={(el) => {
            panelRefs.current[i] = el;
          }}
          className="absolute inset-0"
          style={reducedMotion ? { position: "relative", minHeight: "100vh" } : undefined}
          aria-hidden={active !== i}
        >
          <Panel
            panel={panel}
            spot={spot}
            spotKey={chapter.spot}
            kicker={chapter.kicker}
            caseTitle={chapter.title}
            active={reducedMotion ? true : active === i}
            panelProgress={active === i ? progress : 0}
            reducedMotion={reducedMotion}
          />
        </div>
      ))}

      {/* Panel dot nav */}
      {N > 1 && !reducedMotion && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex gap-2 pointer-events-none">
          {chapter.panels.map((_, i) => (
            <span
              key={i}
              className="block h-1.5 rounded-full transition-all duration-300"
              style={{
                width: active === i ? "20px" : "6px",
                backgroundColor: active === i ? (spot ?? "#e6e1d3") : "#2b2722",
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
