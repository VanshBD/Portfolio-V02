"use client";

import { useMemo, useState } from "react";
import type { CaseStudy, DNode } from "@/content/site";

const W = 610, H = 430;
const NW = 150, NH = 58;

/* Content is authored on a 540-wide grid; spread the three columns apart so connectors have room to curve. */
const spread = (x: number) => (x < 100 ? x : x < 300 ? x + 34 : x + 68);
const box = (n: DNode) => ({ x: spread(n.x), y: n.y, w: n.w ?? NW, h: n.h ?? NH });

/* A curved connector between two boxes, leaving and entering on the facing sides. */
function connector(a: DNode, b: DNode) {
  const A = box(a), B = box(b);
  const ac = { x: A.x + A.w / 2, y: A.y + A.h / 2 };
  const bc = { x: B.x + B.w / 2, y: B.y + B.h / 2 };
  if (B.x >= A.x + A.w - 4) {
    const sx = A.x + A.w, sy = ac.y, ex = B.x, ey = bc.y, mx = (sx + ex) / 2;
    return `M${sx} ${sy} C${mx} ${sy} ${mx} ${ey} ${ex} ${ey}`;
  }
  if (A.x >= B.x + B.w - 4) {
    const sx = A.x, sy = ac.y, ex = B.x + B.w, ey = bc.y, mx = (sx + ex) / 2;
    return `M${sx} ${sy} C${mx} ${sy} ${mx} ${ey} ${ex} ${ey}`;
  }
  const down = bc.y > ac.y;
  const sx = ac.x, sy = down ? A.y + A.h : A.y, ex = bc.x, ey = down ? B.y : B.y + B.h, my = (sy + ey) / 2;
  return `M${sx} ${sy} C${sx} ${my} ${ex} ${my} ${ex} ${ey}`;
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
          const d = connector(byId[e.from], byId[e.to]);
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
