"use client";

import { motion } from "framer-motion";
import { spotVar } from "@/content/characters";
import type { SpotColor } from "@/content/types";

const SPOTS: SpotColor[] = ["cyan", "amber", "green", "violet", "emerald", "danger"];

/** The Phase 0 newspaper cover — reborn as the comic's opening page.
 *  Renders inside ComicFrame's paper interior; self-contained masthead,
 *  title, registration bar, and an animated "SCROLL TO ENTER" prompt. */
export function Cover() {
  return (
    <div className="relative z-10 flex h-full flex-col px-5 py-5 sm:px-10 sm:py-8 lg:px-16 lg:py-10">
      {/* Masthead */}
      <header className="flex shrink-0 items-start justify-between gap-6 border-b-2 border-ink pb-3">
        <p className="font-caption text-[9px] leading-relaxed tracking-[0.35em] text-smoke sm:text-[11px]">
          NULL CITY PRESS
          <br />
          NIGHT EDITION · EST. 2024
        </p>
        <p className="text-right font-caption text-[9px] leading-relaxed tracking-[0.35em] text-smoke sm:text-[11px]">
          ISSUE #1
          <br />
          ONE DOLLAR
        </p>
      </header>

      {/* Title block */}
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center text-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-3 font-caption text-[10px] tracking-[0.45em] text-ash sm:mb-5 sm:text-xs"
        >
          THEY SAID IT COULDN&rsquo;T BE BUILT
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="registration font-display font-bold leading-[0.82] text-ink"
          style={{
            fontSize: "clamp(2.6rem, 12vw, 8.5rem)",
            ["--reg" as string]: "2px",
            letterSpacing: "-0.02em",
          }}
        >
          NULL CITY
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="mt-4 font-display text-xs uppercase tracking-[0.35em] text-ash sm:mt-6 sm:text-base"
        >
          The Debugger
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.6 }}
          className="mt-2 font-caption text-[10px] tracking-[0.2em] text-smoke sm:text-xs"
        >
          A VANSH DOBARIYA STORY
        </motion.p>
      </div>

      {/* Footer */}
      <footer className="shrink-0 border-t-2 border-ink pt-3">
        {/* Printer's registration colour bar */}
        <div className="mb-3 flex h-2 w-full overflow-hidden border border-ink">
          {SPOTS.map((s) => (
            <div key={s} className="flex-1" style={{ backgroundColor: spotVar[s] }} />
          ))}
        </div>
        <div className="flex items-baseline justify-between">
          <span className="font-caption text-[9px] tracking-[0.3em] text-smoke sm:text-[10px]">
            FIVE CASES · ONE DEVELOPER
          </span>
          <motion.span
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="font-caption text-[9px] tracking-[0.3em] text-ash sm:text-[10px]"
          >
            SCROLL TO ENTER ↓
          </motion.span>
          <span className="font-display text-xl font-bold text-ink sm:text-2xl">#1</span>
        </div>
      </footer>
    </div>
  );
}
