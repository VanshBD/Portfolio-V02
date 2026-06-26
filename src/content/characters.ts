import type { SpotColor } from "./types";

/** Resolve a spot-color token to its CSS variable. */
export const spotVar: Record<SpotColor, string> = {
  cyan: "var(--color-spot-cyan)",
  amber: "var(--color-spot-amber)",
  green: "var(--color-spot-green)",
  violet: "var(--color-spot-violet)",
  emerald: "var(--color-spot-emerald)",
  danger: "var(--color-spot-danger)",
  none: "var(--color-ink)",
};

export interface Character {
  name: string;
  role: string;
  note: string;
}

export const CAST: Record<string, Character> = {
  debugger: {
    name: "THE DEBUGGER",
    role: "Vansh Dobariya — freelance debugger",
    note: "Part architect, part detective. Ships under pressure. Never sleeps; neither do the servers.",
  },
  typescript: {
    name: "TYPESCRIPT",
    role: "The femme fatale",
    note: "Strict. Demanding. Always right in the end. It's complicated.",
  },
  bug: {
    name: "THE BUG",
    role: "The antagonist",
    note: "Shape-shifts — a race condition, a memory leak, a null at 2 a.m.",
  },
};

/** Where the story lives in the real world. */
export const CONTACT = {
  name: "Vansh Dobariya",
  github: "https://github.com/VanshBD",
  linkedin: "https://in.linkedin.com/in/vansh-dobariya",
  location: "India",
} as const;
