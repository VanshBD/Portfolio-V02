"use client";

import dynamic from "next/dynamic";
import type { Chapter } from "@/content/book";

const artComponents: Record<string, React.ComponentType<{ progress?: number }>> = {
  pravasa:    dynamic(() => import("@/components/art/PravasakSketch").then(m => ({ default: m.PravasakSketch }))),
  billstack:  dynamic(() => import("@/components/art/BillSketch").then(m => ({ default: m.BillSketch }))),
  teamos:     dynamic(() => import("@/components/art/TeamSketch").then(m => ({ default: m.TeamSketch }))),
  promptwars: dynamic(() => import("@/components/art/PromptSketch").then(m => ({ default: m.PromptSketch }))),
  phantom:    dynamic(() => import("@/components/art/PhantomSketch").then(m => ({ default: m.PhantomSketch }))),
};

interface Props {
  chapter: Chapter;
  index: number;
  activeSlide: number;
  slideProgress: number;
}

export function ProjectPage({ chapter, index, activeSlide, slideProgress }: Props) {
  const Art = artComponents[chapter.artKind as keyof typeof artComponents];

  const artProgress =
    activeSlide > index   ? 1 :
    activeSlide === index ? slideProgress :
    0;

  const isActive = activeSlide === index;

  return (
    <div
      className="relative flex-shrink-0 flex items-stretch"
      style={{ width: "100vw", height: "100vh" }}
    >
      {/* ── Left half: ghost chapter number + illustration ── */}
      <div
        className="relative flex flex-col items-center justify-center"
        style={{ width: "50%", padding: "4vw", background: "var(--color-paper)" }}
      >
        {/* Giant ghost chapter number */}
        <span
          className="font-display font-bold select-none pointer-events-none absolute"
          style={{
            fontSize: "clamp(8rem, 22vw, 20rem)",
            lineHeight: 1,
            color: "var(--color-ink)",
            opacity: 0.04,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            letterSpacing: "-0.05em",
            zIndex: 0,
          }}
          aria-hidden="true"
        >
          {chapter.number}
        </span>

        {/* Art container */}
        <div className="relative z-10 w-full" style={{ maxWidth: "360px", aspectRatio: "4/3" }}>
          {Art && <Art progress={artProgress} />}
        </div>

        {/* Annotation */}
        <p
          className="font-hand absolute bottom-8 right-4 text-right text-sm leading-snug"
          style={{
            color: "var(--color-pencil)",
            whiteSpace: "pre-line",
            opacity: isActive ? 1 : 0,
            transition: "opacity 0.6s ease 0.4s",
          }}
        >
          {chapter.annotation}
        </p>
      </div>

      {/* ── Vertical divider ── */}
      <div style={{ width: "1px", background: "var(--color-ink)", opacity: 0.12, flexShrink: 0 }} />

      {/* ── Right half: text content ── */}
      <div
        className="flex flex-col justify-center overflow-hidden"
        style={{
          width: "50%",
          padding: "6vw 5vw 6vw 4vw",
          background: "var(--color-paper)",
          opacity: isActive ? 1 : 0.3,
          transition: "opacity 0.5s ease",
          boxSizing: "border-box",
        }}
      >
        {/* Chapter badge */}
        <p
          className="font-type text-xs uppercase mb-4"
          style={{ letterSpacing: "0.35em", color: "var(--color-pencil)" }}
        >
          Chapter · {chapter.number}
        </p>

        {/* Project title */}
        <h2
          className="font-display font-bold leading-none mb-2"
          style={{
            fontSize: "clamp(1.8rem, 3.5vw, 3.2rem)",
            color: "var(--color-ink)",
            letterSpacing: "-0.02em",
          }}
        >
          {chapter.title}
        </h2>

        {/* Project name */}
        <p
          className="font-type mb-6"
          style={{ fontSize: "0.8rem", letterSpacing: "0.25em", color: "var(--color-pencil)" }}
        >
          {chapter.project}
        </p>

        {/* Ink underline — slides in when active */}
        <div
          style={{
            height: "1.5px",
            background: "var(--color-ink)",
            width: isActive ? "60px" : "0px",
            transition: "width 0.6s ease 0.2s",
            marginBottom: "1.5rem",
          }}
        />

        {/* Tagline */}
        <p
          className="font-type mb-4"
          style={{
            fontSize: "clamp(0.95rem, 1.4vw, 1.1rem)",
            lineHeight: 1.6,
            color: "var(--color-ink)",
            fontStyle: "italic",
          }}
        >
          {chapter.tagline}
        </p>

        {/* Description */}
        <p
          className="font-type mb-8"
          style={{
            fontSize: "clamp(0.8rem, 1.1vw, 0.9rem)",
            lineHeight: 1.8,
            color: "var(--color-pencil)",
          }}
        >
          {chapter.description}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-2 mb-10">
          {chapter.techStack.map((tag) => (
            <span
              key={tag}
              className="font-type"
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.15em",
                padding: "3px 10px",
                border: "1px solid var(--color-ink)",
                color: "var(--color-ink)",
                opacity: 0.7,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        <a
          href={chapter.github}
          target="_blank"
          rel="noopener noreferrer"
          data-magnetic="true"
          className="inline-flex items-center gap-3 group font-display"
          style={{
            fontSize: "clamp(0.75rem, 1.2vw, 0.85rem)",
            letterSpacing: "0.2em",
            color: "var(--color-ink)",
            textDecoration: "none",
            textTransform: "uppercase",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "32px",
              height: "1.5px",
              background: "var(--color-ink)",
              flexShrink: 0,
            }}
          />
          Open Case File
        </a>
      </div>
    </div>
  );
}
