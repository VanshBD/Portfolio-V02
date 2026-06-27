"use client";

import type { ReactNode } from "react";

/** Printer's registration crosshair — the CMYK-offset corner mark that makes
 *  the whole page read as a misprinted comic book. */
function RegMark({ className = "" }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" className={className} aria-hidden="true">
      <circle cx="10" cy="10" r="6.5" fill="none" stroke="rgba(0,174,239,0.55)" strokeWidth="0.6" transform="translate(-1,0)" />
      <circle cx="10" cy="10" r="6.5" fill="none" stroke="rgba(236,0,140,0.55)" strokeWidth="0.6" transform="translate(1,0)" />
      <circle cx="10" cy="10" r="6.5" fill="none" stroke="#0a0a0a" strokeWidth="0.9" />
      <line x1="10" y1="0" x2="10" y2="20" stroke="#0a0a0a" strokeWidth="0.9" />
      <line x1="0" y1="10" x2="20" y2="10" stroke="#0a0a0a" strokeWidth="0.9" />
    </svg>
  );
}

interface ComicFrameProps {
  children: ReactNode;
  dark?: boolean;
  paper?: boolean;
  spot?: string;
  kicker?: string;
}

/** Wraps a panel's art + lettering in a printed-page frame: cream newsprint
 *  gutter, thick double ink border, halftone edges, corner registration marks,
 *  and an optional spot-color case tab. This is what unifies Phase 1 with the
 *  Phase 0 cover aesthetic. */
export function ComicFrame({ children, dark, paper, spot, kicker }: ComicFrameProps) {
  return (
    <div className="paper grain absolute inset-0">
      {/* Registration marks in the four gutter corners */}
      <RegMark className="absolute left-1.5 top-1.5 opacity-70" />
      <RegMark className="absolute right-1.5 top-1.5 opacity-70" />
      <RegMark className="absolute left-1.5 bottom-1.5 opacity-70" />
      <RegMark className="absolute right-1.5 bottom-1.5 opacity-70" />

      {/* The panel itself */}
      <div
        className="absolute inset-4 overflow-hidden sm:inset-6 lg:inset-8"
        style={{
          border: "4px solid #0a0a0a",
          boxShadow: "inset 0 0 0 1.5px #0a0a0a, 7px 7px 0 0 rgba(10,10,10,0.32)",
          background: paper ? "#e6e1d3" : dark ? "#0a0a0a" : "#0e0d0b",
        }}
      >
        <div className="relative h-full w-full">{children}</div>

        {/* Halftone print wash along top & bottom edges */}
        <div className="halftone shade-25 pointer-events-none absolute inset-x-0 top-0 z-[6] h-24 opacity-[0.16]" />
        <div className="halftone shade-25 pointer-events-none absolute inset-x-0 bottom-0 z-[6] h-24 opacity-[0.16]" />

        {/* Inner vignette to seat the art onto the page (lighter on paper) */}
        <div
          className="pointer-events-none absolute inset-0 z-[6]"
          style={{
            background: paper
              ? "radial-gradient(ellipse at center, transparent 68%, rgba(10,10,10,0.26) 100%)"
              : "radial-gradient(ellipse at center, transparent 62%, rgba(10,10,10,0.5) 100%)",
          }}
        />

        {/* Spot-color case tab, top-left inside the border */}
        {spot && kicker && (
          <div
            className="absolute left-0 top-0 z-20 px-3 py-1 font-display text-[9px] font-bold uppercase tracking-[0.3em] text-paper"
            style={{ backgroundColor: spot, boxShadow: "2px 2px 0 rgba(10,10,10,0.4)" }}
          >
            {kicker}
          </div>
        )}
      </div>
    </div>
  );
}
