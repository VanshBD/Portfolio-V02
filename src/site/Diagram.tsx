"use client";

import { useMemo, useState } from "react";
import type { CaseStudy, DNode } from "@/content/site";

const W = 610, H = 430;
const NW = 150, NH = 58;

/* Content is authored on a 540-wide grid; spread the three columns apart so connectors have room to curve. */
const spread = (x: number) => (x < 100 ? x : x < 300 ? x + 34 : x + 68);
const box = (n: DNode) => ({ x: spread(n.x), y: n.y, w: n.w ?? NW, h: n.h ?? NH });

/*
  Connector routing.
  - Each edge leaves and enters on the facing sides of its boxes.
  - When several edges share a side, they get their own evenly spaced port,
    ordered by where each one is going, so fans never knot into one point
    and don't cross right at the box.
  - A vertical edge that would run through another box in the same column
    bends around the column's open side instead.
*/
type Side = "l" | "r" | "t" | "b";
interface Leg { id: string; a: DNode; b: DNode; sa: Side; sb: Side; around: boolean }

const centre = (n: DNode) => { const B = box(n); return { x: B.x + B.w / 2, y: B.y + B.h / 2 }; };

function plan(cs: CaseStudy): Leg[] {
  const byId = Object.fromEntries(cs.nodes.map((n) => [n.id, n]));
  return cs.edges.map((e) => {
    const a = byId[e.from], b = byId[e.to], A = box(a), B = box(b);
    const id = `${e.from}>${e.to}`;
    if (B.x >= A.x + A.w - 4) return { id, a, b, sa: "r", sb: "l", around: false };
    if (A.x >= B.x + B.w - 4) return { id, a, b, sa: "l", sb: "r", around: false };
    const top = Math.min(A.y + A.h, B.y + B.h), bottom = Math.max(A.y, B.y);
    const blocked = cs.nodes.some((n) => {
      if (n === a || n === b) return false;
      const N = box(n);
      return N.x < Math.max(A.x + A.w, B.x + B.w) && N.x + N.w > Math.min(A.x, B.x) && N.y > top - 2 && N.y + N.h < bottom + 2;
    });
    if (blocked) {
      const side: Side = A.x + A.w / 2 > W / 2 ? "l" : "r";
      return { id, a, b, sa: side, sb: side, around: true };
    }
    const down = B.y > A.y;
    return { id, a, b, sa: down ? "b" : "t", sb: down ? "t" : "b", around: false };
  });
}

/* evenly spaced ports per node side, sorted by the other end's position */
function ports(legs: Leg[]) {
  const groups = new Map<string, { leg: Leg; end: "a" | "b"; key: number }[]>();
  legs.forEach((leg) => {
    (["a", "b"] as const).forEach((end) => {
      const node = end === "a" ? leg.a : leg.b, other = end === "a" ? leg.b : leg.a;
      const side = end === "a" ? leg.sa : leg.sb;
      const o = centre(other);
      const k = `${node.id}:${side}`;
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k)!.push({ leg, end, key: side === "l" || side === "r" ? o.y : o.x });
    });
  });
  const at = new Map<string, { x: number; y: number }>();
  groups.forEach((list, k) => {
    const [nodeId, side] = k.split(":") as [string, Side];
    const node = (list[0].end === "a" ? list[0].leg.a : list[0].leg.b);
    const N = box(node);
    list.sort((p, q) => p.key - q.key);
    const span = side === "l" || side === "r" ? N.h * 0.56 : N.w * 0.5;
    const gap = list.length > 1 ? Math.min(14, span / (list.length - 1)) : 0;
    list.forEach((p, i) => {
      const off = (i - (list.length - 1) / 2) * gap;
      const pt =
        side === "l" ? { x: N.x, y: N.y + N.h / 2 + off } :
        side === "r" ? { x: N.x + N.w, y: N.y + N.h / 2 + off } :
        side === "t" ? { x: N.x + N.w / 2 + off, y: N.y } :
        { x: N.x + N.w / 2 + off, y: N.y + N.h };
      at.set(`${p.leg.id}:${p.end}:${nodeId}`, pt);
    });
  });
  return at;
}

function routes(cs: CaseStudy): Record<string, string> {
  const legs = plan(cs);
  const at = ports(legs);
  const out: Record<string, string> = {};
  legs.forEach((leg) => {
    const s = at.get(`${leg.id}:a:${leg.a.id}`)!, e = at.get(`${leg.id}:b:${leg.b.id}`)!;
    if (leg.around) {
      const dir = leg.sa === "r" ? 1 : -1, bulge = 34 * dir;
      out[leg.id] = `M${s.x} ${s.y} C${s.x + bulge} ${s.y} ${e.x + bulge} ${e.y} ${e.x} ${e.y}`;
    } else if (leg.sa === "l" || leg.sa === "r") {
      const mx = (s.x + e.x) / 2;
      out[leg.id] = `M${s.x} ${s.y} C${mx} ${s.y} ${mx} ${e.y} ${e.x} ${e.y}`;
    } else {
      const my = (s.y + e.y) / 2;
      out[leg.id] = `M${s.x} ${s.y} C${s.x} ${my} ${e.x} ${my} ${e.x} ${e.y}`;
    }
  });
  return out;
}

interface Props {
  cs: CaseStudy;
  step: number;
  replay: number;
  reduced: boolean;
}

export function Diagram({ cs, step, replay, reduced }: Props) {
  const [focus, setFocus] = useState<string | null>(null);
  const byId = useMemo(() => Object.fromEntries(cs.nodes.map((n) => [n.id, n])), [cs]);
  const paths = useMemo(() => routes(cs), [cs]);
  const s = cs.steps[step];
  const activeNodes = useMemo(() => new Set(s.nodes), [s]);
  const activeEdges = useMemo(() => {
    if (s.edges) return new Set(s.edges);
    return new Set(cs.edges.filter((e) => activeNodes.has(e.from) && activeNodes.has(e.to)).map((e) => `${e.from}>${e.to}`));
  }, [s, cs, activeNodes]);
  const info = focus ? byId[focus] : null;

  return (
    <figure className="diagram">
      <svg viewBox={`0 0 ${W} ${H}`} role="group" aria-label={`${cs.name} architecture`}>
        <defs>
          <pattern id={`dots-${cs.id}`} width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" className="diagram__dot" />
          </pattern>
        </defs>
        <rect width={W} height={H} fill={`url(#dots-${cs.id})`} />

        {cs.edges.map((e) => {
          const id = `${e.from}>${e.to}`;
          const on = activeEdges.has(id);
          const d = paths[id];
          return (
            <g key={id} className={`edge${on ? " is-on" : ""}`}>
              <path d={d} className="edge__line" />
              {on && !reduced && (
                <circle key={`${id}-${replay}-${step}`} r="4" className="edge__packet">
                  <animateMotion dur="1.6s" repeatCount="indefinite" path={d} />
                </circle>
              )}
            </g>
          );
        })}

        {cs.nodes.map((n) => {
          const b = box(n);
          const on = activeNodes.has(n.id);
          const label = n.sub ? b.h >= 52 : false;
          return (
            <g
              key={n.id}
              className={`node node--${n.kind ?? "app"}${on ? " is-on" : ""}${focus === n.id ? " is-focus" : ""}`}
              transform={`translate(${b.x} ${b.y})`}
              tabIndex={0}
              role="button"
              aria-label={`${n.label}. ${n.info}`}
              onMouseEnter={() => setFocus(n.id)}
              onMouseLeave={() => setFocus(null)}
              onFocus={() => setFocus(n.id)}
              onBlur={() => setFocus(null)}
              onClick={() => setFocus(n.id)}
            >
              <rect width={b.w} height={b.h} rx="10" className="node__box" />
              <rect width="4" height={b.h - 20} x="0" y="10" rx="2" className="node__tick" />
              <text x="14" y={label ? 24 : b.h / 2 + 4.5} className="node__label">{n.label}</text>
              {label && <text x="14" y="43" className="node__sub">{n.sub}</text>}
            </g>
          );
        })}
      </svg>
      <figcaption className="diagram__info" aria-live="polite">
        {info ? (
          <><b>{info.label}</b> {info.info}</>
        ) : (
          <span className="diagram__hint">Hover or tap any box to see what it does.</span>
        )}
      </figcaption>
    </figure>
  );
}
