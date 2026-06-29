"use client";

import { useRef, useEffect } from "react";
import { useControlledTimeline } from "@/hooks/useControlledTimeline";
import { r, onCircle } from "@/lib/svg";

interface Props { progress?: number; }

const CX = 200;
const CY = 145;
const ORBIT = 98;

const nodes = [0, 72, 144, 216, 288].map((deg) => {
  const rad = (deg * Math.PI) / 180;
  return onCircle(CX, CY, ORBIT, rad);
});

export function TeamSketch({ progress = 0 }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { tlRef, dotRef } = useControlledTimeline(svgRef);

  useEffect(() => {
    tlRef.current?.progress(progress).pause();
  }, [progress, tlRef]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 400 290"
      fill="none"
      stroke="var(--color-ink)"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="Network of team nodes sketch"
      className="w-full h-full"
    >
      {nodes.map(({ x, y }, i) => (
        <line
          key={`line-${i}`}
          x1={r(x)} y1={r(y)}
          x2={CX}   y2={CY}
          strokeWidth="0.9"
          stroke="var(--color-pencil)"
        />
      ))}

      <circle cx={CX} cy={CY} r={28} strokeWidth="1.8" />
      <circle cx={CX} cy={r(CY - 8)} r={5} strokeWidth="0.9" />
      <path d={`M ${r(CX-7)} ${r(CY+12)} Q ${CX} ${r(CY+4)} ${r(CX+7)} ${r(CY+12)}`} strokeWidth="0.9" />

      {nodes.map(({ x, y }, i) => (
        <g key={`node-${i}`}>
          <circle cx={r(x)} cy={r(y)} r={20} strokeWidth="1.3" />
          <circle cx={r(x)} cy={r(y-8)} r={5}  strokeWidth="0.9" />
          <path d={`M ${r(x-7)} ${r(y+12)} Q ${r(x)} ${r(y+4)} ${r(x+7)} ${r(y+12)}`} strokeWidth="0.9" />
        </g>
      ))}

      <circle cx={CX} cy={CY} r={42}  strokeWidth="0.5" stroke="var(--color-pencil)" strokeDasharray="3 4" />
      <circle cx={CX} cy={CY} r={56}  strokeWidth="0.4" stroke="var(--color-pencil)" strokeDasharray="2 5" />
      <circle cx={r(CX + 20)} cy={r(CY - 20)} r={4} strokeWidth="1.2" />

      <circle ref={dotRef} r="5" fill="#c8902e" opacity="0" data-nodraw="true" />
    </svg>
  );
}
