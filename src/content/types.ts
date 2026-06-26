/* ============================================================
   The comic's data model.
   Components render this contract — they never hard-code story.
   Full authoring happens in Phase 3 (script.ts); the shapes live here.
   ============================================================ */

/** Muted, noir-safe spot colors — one per case. */
export type SpotColor =
  | "cyan"
  | "amber"
  | "green"
  | "violet"
  | "emerald"
  | "danger"
  | "none";

/** A parallax depth band inside a panel. */
export type Depth = "bg" | "mid" | "fg";

/** A noir narration box (typewriter caption). */
export interface Caption {
  text: string;
  /** Anchor within the panel, 0–1 coordinates. */
  at?: { x: number; y: number };
  voice?: "narration" | "thought";
}

/** A character speech bubble. */
export interface Bubble {
  speaker: string;
  text: string;
  at: { x: number; y: number };
  /** Direction the tail points toward the speaker. */
  tail?: "left" | "right" | "down" | "up";
  shout?: boolean;
}

/** Drawn onomatopoeia (RING, CLACK, BAM…). */
export interface Sfx {
  text: string;
  at: { x: number; y: number };
  rotate?: number;
}

/** One coded-SVG art layer, resolved to a component at render time. */
export interface ArtLayer {
  /** Key into the art registry, e.g. "skyline" | "figure" | "neon". */
  kind: string;
  depth: Depth;
  /** Free-form props handed to the art component. */
  props?: Record<string, unknown>;
}

/** A single comic panel. */
export interface Panel {
  id: string;
  /** Layout hint for the chapter grid. */
  layout?: "full" | "wide" | "tall" | "inset" | "splash";
  layers: ArtLayer[];
  captions?: Caption[];
  bubbles?: Bubble[];
  sfx?: Sfx[];
  /** Panels marked dark enable the flashlight cursor. */
  dark?: boolean;
  /** Hidden ink revealed only by the torch. */
  secret?: { text: string; at: { x: number; y: number } };
}

/** The real engineering behind a case's noir metaphor (director's commentary). */
export interface Dossier {
  project: string;
  realStory: string;
  techStack: string[];
  github: string;
}

/** A chapter = a scroll-pinned sequence of panels. */
export interface Chapter {
  id: string;
  /** Roman/issue label, e.g. "CASE FILE 02". */
  kicker: string;
  title: string;
  spot: SpotColor;
  panels: Panel[];
  dossier?: Dossier;
}

export interface ComicScript {
  series: string;
  issue: string;
  chapters: Chapter[];
}
