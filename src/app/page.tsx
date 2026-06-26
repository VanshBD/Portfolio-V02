import { spotVar } from "@/content/characters";
import type { SpotColor } from "@/content/types";

/**
 * PHASE 0 — Foundation cover.
 * One full-bleed, full-height noir cover (no scroll, no side margins) that also
 * proves the design system: palette, halftone, grain, fonts, registration glitch,
 * and the per-case spot colors (as a printer's registration bar at the foot).
 * Replaced by <Comic/> in Phase 1.
 */

const SPOTS: SpotColor[] = ["cyan", "amber", "green", "violet", "emerald", "danger"];

export default function Home() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-ink">
      {/* Full-bleed printed page */}
      <section className="paper grain vignette absolute inset-0 flex flex-col">
        {/* Halftone texture wash along the edges */}
        <div className="halftone shade-25 pointer-events-none absolute inset-x-0 top-0 h-40 opacity-[0.18]" />
        <div className="halftone shade-25 pointer-events-none absolute inset-x-0 bottom-0 h-40 opacity-[0.18]" />

        {/* Inner frame with generous padding */}
        <div className="relative flex h-full flex-col px-6 py-6 sm:px-12 sm:py-10 lg:px-20 lg:py-12">
          {/* ── Masthead ── */}
          <header className="flex shrink-0 items-start justify-between gap-6 border-b-2 border-ink pb-4">
            <p className="font-caption text-[10px] sm:text-[11px] tracking-[0.35em] text-smoke leading-relaxed">
              NULL CITY PRESS
              <br />
              NIGHT EDITION · EST. 2024
            </p>
            <p className="font-caption text-[10px] sm:text-[11px] tracking-[0.35em] text-smoke text-right leading-relaxed">
              ISSUE #1
              <br />
              ONE DOLLAR
            </p>
          </header>

          {/* ── Title block (fills the middle, centered) ── */}
          <div className="flex flex-1 flex-col items-center justify-center text-center min-h-0">
            <p className="font-caption text-[10px] sm:text-xs tracking-[0.45em] text-ash mb-4 sm:mb-6">
              THEY SAID IT COULDN&rsquo;T BE BUILT
            </p>

            <h1
              className="font-display font-bold text-ink leading-[0.82] registration"
              style={{
                fontSize: "clamp(3rem, 13vw, 9.5rem)",
                ["--reg" as string]: "2px",
                letterSpacing: "-0.02em",
              }}
            >
              NULL CITY
            </h1>

            <p className="font-display tracking-[0.35em] text-ash text-xs sm:text-base mt-5 sm:mt-7 uppercase">
              The Debugger
            </p>
            <p className="font-caption tracking-[0.2em] text-smoke text-[10px] sm:text-xs mt-2">
              A VANSH DOBARIYA STORY
            </p>
          </div>

          {/* ── Foot: registration color bar + dateline ── */}
          <footer className="shrink-0 border-t-2 border-ink pt-4">
            {/* printer's registration color bar */}
            <div className="mb-4 flex h-2 w-full overflow-hidden border border-ink">
              {SPOTS.map((s) => (
                <div
                  key={s}
                  className="flex-1"
                  style={{ backgroundColor: spotVar[s] }}
                />
              ))}
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-caption text-[9px] sm:text-[10px] tracking-[0.3em] text-smoke">
                FIVE CASES · ONE DEVELOPER
              </span>
              <span className="font-caption text-[9px] sm:text-[10px] tracking-[0.3em] text-ash hidden sm:block">
                SCROLL TO ENTER ↓
              </span>
              <span className="font-display font-bold text-ink text-xl sm:text-2xl">
                #1
              </span>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}
