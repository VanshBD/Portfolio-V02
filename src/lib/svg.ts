/* ============================================================
   SVG geometry helpers.

   CRITICAL — hydration safety: Node (SSR) and V8 (browser) can disagree
   on the last bits of a float (e.g. Math.sin output), so any computed
   coordinate rendered into SVG MUST be rounded to a fixed precision or
   React throws a hydration mismatch. Always pipe trig/derived numbers
   through `r()` before they hit the DOM.
   ============================================================ */

/** Round to 3 decimals — identical on server and client. */
export const r = (n: number): number => Math.round(n * 1000) / 1000;

const TAU = Math.PI * 2;

/** A point on a circle, rounded. angle in radians. */
export function onCircle(cx: number, cy: number, radius: number, angle: number) {
  return { x: r(cx + Math.cos(angle) * radius), y: r(cy + Math.sin(angle) * radius) };
}

/** Deterministic pseudo-random in [0,1) from an integer seed (no Math.random). */
export function seeded(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/** Evenly spaced radial lines (speed-lines / sunburst), pre-rounded. */
export function radialLines(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  count: number,
  jitter = 0
) {
  return Array.from({ length: count }, (_, i) => {
    const a = (i / count) * TAU + (jitter ? (seeded(i) - 0.5) * jitter : 0);
    const inner = onCircle(cx, cy, innerR, a);
    const outer = onCircle(cx, cy, outerR, a);
    return { x1: inner.x, y1: inner.y, x2: outer.x, y2: outer.y, i };
  });
}
