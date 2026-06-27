"use client";

import { motion } from "framer-motion";
import { script } from "@/content/script";
import { spotVar } from "@/content/characters";
import { useComicStore } from "@/store/comic";

const TOTAL = script.chapters.length;

export function ComicHUD() {
  const currentChapter = useComicStore((s) => s.currentChapter);
  const currentPanel = useComicStore((s) => s.currentPanel);
  const scrollProgress = useComicStore((s) => s.scrollProgress);
  const chapter = script.chapters[currentChapter] ?? script.chapters[0];
  const spot = chapter.spot !== "none" ? spotVar[chapter.spot] : "#e6e1d3";
  const overall = Math.min(1, (currentChapter + scrollProgress) / TOTAL);
  const dossier = chapter.dossier;

  /* The opening cover is self-contained (its own masthead) — hide the HUD there. */
  const onCover = currentChapter === 0 && currentPanel === 0;

  return (
    <>
      {/* ── Masthead ── */}
      <motion.div
        className="pointer-events-none fixed inset-x-0 top-0 z-50"
        initial={false}
        animate={{ opacity: onCover ? 0 : 1, y: onCover ? -12 : 0 }}
        transition={{ duration: 0.4 }}
      >
        <div
          className="flex items-center justify-between px-4 py-2 sm:px-7 sm:py-3"
          style={{ background: "linear-gradient(to bottom, rgba(10,10,10,0.82) 0%, transparent 100%)" }}
        >
          <div className="leading-tight">
            <p className="font-display text-[11px] font-bold tracking-[0.34em] text-paper sm:text-xs">NULL CITY PRESS</p>
            <p className="font-caption text-[8px] tracking-[0.3em] text-ash sm:text-[9px]">NIGHT EDITION · EST. 2024</p>
          </div>

          <p className="hidden font-caption text-[10px] tracking-[0.4em] uppercase sm:block" style={{ color: spot }}>
            {chapter.kicker}
          </p>

          <p className="font-caption text-[9px] tracking-[0.3em] text-ash sm:text-[10px]">
            PAGE {String(currentChapter + 1).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
          </p>
        </div>

        {/* Progress bar */}
        <div className="h-[3px] w-full bg-black/40">
          <motion.div
            className="h-full origin-left"
            style={{ backgroundColor: spot, scaleX: overall }}
            transition={{ ease: "linear" }}
          />
        </div>
      </motion.div>

      {/* ── Case dossier ribbon — permanently mounted, animated in/out ── */}
      <motion.div
        className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 pb-3 sm:pb-5"
        initial={false}
        animate={dossier ? { opacity: 1, y: 0 } : { opacity: 0, y: 48 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        style={{ pointerEvents: dossier ? "auto" : "none" }}
      >
        {dossier && (
          <div
            className="flex max-w-3xl flex-wrap items-center gap-x-4 gap-y-2 border-2 border-ink bg-paper px-4 py-2.5"
            style={{ boxShadow: "4px 4px 0 rgba(10,10,10,0.45)" }}
          >
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 shrink-0" style={{ backgroundColor: spot }} />
              <span className="font-display text-xs font-bold uppercase tracking-[0.18em] text-ink">{dossier.project}</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {dossier.techStack.map((t) => (
                <span key={t} className="border border-ink/40 px-1.5 py-0.5 font-caption text-[9px] tracking-wide text-smoke">
                  {t}
                </span>
              ))}
            </div>

            <a
              href={dossier.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group ml-auto flex items-center gap-1 font-display text-[10px] font-bold uppercase tracking-[0.2em] text-ink no-underline"
            >
              <span className="border-b-2 border-transparent transition-colors group-hover:border-ink">OPEN CASE FILE ↗</span>
            </a>
          </div>
        )}
      </motion.div>
    </>
  );
}
