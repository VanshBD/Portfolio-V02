import { create } from "zustand";

/** How the comic is read. */
export type ReadingMode = "cinematic" | "reader";

interface ComicState {
  /** Index of the chapter currently in view (0 = cold open). */
  currentChapter: number;
  /** Active panel index within the current chapter. */
  currentPanel: number;
  /** Master scroll progress across the whole comic, 0 → 1. */
  scrollProgress: number;
  /** Ambient audio (rain, thunder, typewriter, stings) — off by default. */
  audioOn: boolean;
  /** Canvas rain overlay — independent of audio. */
  rainOn: boolean;
  /** Cinematic (pinned panels) vs reader (webtoon vertical scroll). */
  readingMode: ReadingMode;
  /** Mirrors prefers-reduced-motion; disables parallax/ink-bleed. */
  reducedMotion: boolean;
  /** Accessible plain-text version of the whole story. */
  transcriptOpen: boolean;
  /** First user interaction — gates audio autoplay policy. */
  hasInteracted: boolean;

  setChapter: (i: number) => void;
  setCurrentPanel: (i: number) => void;
  setScrollProgress: (p: number) => void;
  toggleAudio: () => void;
  toggleRain: () => void;
  setReadingMode: (m: ReadingMode) => void;
  setReducedMotion: (v: boolean) => void;
  toggleTranscript: () => void;
  markInteracted: () => void;
}

export const useComicStore = create<ComicState>((set) => ({
  currentChapter: 0,
  currentPanel: 0,
  scrollProgress: 0,
  audioOn: false,
  rainOn: true,
  readingMode: "cinematic",
  reducedMotion: false,
  transcriptOpen: false,
  hasInteracted: false,

  setChapter: (i) => set({ currentChapter: i }),
  setCurrentPanel: (i) => set({ currentPanel: i }),
  setScrollProgress: (p) => set({ scrollProgress: p }),
  toggleAudio: () => set((s) => ({ audioOn: !s.audioOn })),
  toggleRain: () => set((s) => ({ rainOn: !s.rainOn })),
  setReadingMode: (m) => set({ readingMode: m }),
  setReducedMotion: (v) => set({ reducedMotion: v }),
  toggleTranscript: () => set((s) => ({ transcriptOpen: !s.transcriptOpen })),
  markInteracted: () => set({ hasInteracted: true }),
}));
