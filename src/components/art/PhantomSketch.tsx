"use client";

import { useRef, useEffect } from "react";
import { useControlledTimeline } from "@/hooks/useControlledTimeline";
import { r } from "@/lib/svg";

interface Props { progress?: number; }

const BLOCKS = [
  { x: 22,  y: 100 },
  { x: 102, y: 78  },
  { x: 182, y: 100 },
  { x: 262, y: 78  },
  { x: 342, y: 100 },
];
const BW = 56;
const BH = 72;

export function PhantomSketch({ progress = 0 }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { tlRef, dotRef } = useControlledTimeline(svgRef);

  useEffect(() => {
    tlRef.current?.progress(progress).pause();
  }, [progress, tlRef]);

  const last = BLOCKS[BLOCKS.length - 1];
  const lx = r(last.x + BW / 2);
  const ly = r(last.y - 22);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 420 260"
      fill="none"
      stroke="var(--color-ink)"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="Blockchain of locked blocks sketch"
      className="w-full h-full"
    >
      {BLOCKS.slice(0, -1).map(({ x, y }, i) => {
        const next = BLOCKS[i + 1];
        return (
          <ellipse
            key={`link-${i}`}
            cx={r((x + BW + next.x) / 2)}
            cy={r((y + BH / 2 + next.y + BH / 2) / 2)}
            rx={r((next.x - x - BW) / 2 + 2)}
            ry={8}
            strokeWidth="1.3"
            stroke="var(--color-pencil)"
          />
        );
      })}

      {BLOCKS.map(({ x, y }, i) => (
        <g key={`block-${i}`}>
          <rect x={x} y={y} width={BW} height={BH} rx="3" strokeWidth="1.5" />
          <line x1={r(x+8)}  y1={r(y+16)} x2={r(x+BW-8)}  y2={r(y+16)} strokeWidth="0.8" stroke="var(--color-pencil)" />
          <line x1={r(x+8)}  y1={r(y+26)} x2={r(x+BW-8)}  y2={r(y+26)} strokeWidth="0.8" stroke="var(--color-pencil)" />
          <line x1={r(x+8)}  y1={r(y+36)} x2={r(x+BW-8)}  y2={r(y+36)} strokeWidth="0.8" stroke="var(--color-pencil)" />
          <line x1={r(x+8)}  y1={r(y+46)} x2={r(x+BW-14)} y2={r(y+46)} strokeWidth="0.8" stroke="var(--color-pencil)" />
          <circle cx={r(x+BW/2)} cy={r(y+60)} r={3} strokeWidth="1" />
        </g>
      ))}

      {/* Padlock on last block */}
      <path d={`M ${r(lx-10)} ${ly} A 10 10 0 0 1 ${r(lx+10)} ${ly}`} strokeWidth="2" />
      <rect x={r(lx-13)} y={ly} width={26} height={20} rx="3" strokeWidth="1.8" />
      <circle cx={lx} cy={r(ly+9)} r={3.5} strokeWidth="1.2" />
      <line x1={lx} y1={r(ly+12.5)} x2={lx} y2={r(ly+17)} strokeWidth="1.2" />

      {/* Ethereum diamond */}
      <path d="M 210 230 L 196 214 L 210 206 L 224 214 Z" strokeWidth="1.3" stroke="var(--color-pencil)" />
      <path d="M 210 230 L 196 218 L 210 224 L 224 218 Z" strokeWidth="1"   stroke="var(--color-pencil)" />

      <circle ref={dotRef} r="5" fill="#c8902e" opacity="0" data-nodraw="true" />
    </svg>
  );
}
