"use client";

import { useRef, useEffect } from "react";
import { useControlledTimeline } from "@/hooks/useControlledTimeline";
import { r } from "@/lib/svg";

interface Props { progress?: number; }

export function PravasakSketch({ progress = 0 }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { tlRef, dotRef } = useControlledTimeline(svgRef);

  useEffect(() => {
    tlRef.current?.progress(progress).pause();
  }, [progress, tlRef]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 400 280"
      fill="none"
      stroke="var(--color-ink)"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="Globe with travel routes"
      className="w-full h-full"
    >
      <circle cx="200" cy="145" r="105" strokeWidth="1.5" />
      <ellipse cx="200" cy="80"  rx="68"  ry="14" strokeWidth="0.8" stroke="var(--color-pencil)" />
      <ellipse cx="200" cy="115" rx="97"  ry="20" strokeWidth="0.8" stroke="var(--color-pencil)" />
      <ellipse cx="200" cy="145" rx="105" ry="24" strokeWidth="0.8" stroke="var(--color-pencil)" />
      <ellipse cx="200" cy="175" rx="97"  ry="20" strokeWidth="0.8" stroke="var(--color-pencil)" />
      <ellipse cx="200" cy="210" rx="68"  ry="14" strokeWidth="0.8" stroke="var(--color-pencil)" />
      <path d="M 200 40 A 60 105 0 0 1 200 250" strokeWidth="0.8" stroke="var(--color-pencil)" />
      <path d="M 200 40 A 60 105 0 0 0 200 250" strokeWidth="0.8" stroke="var(--color-pencil)" />
      <path d="M 148 53 A 100 105 0 0 0 148 237" strokeWidth="0.8" stroke="var(--color-pencil)" />
      <path d="M 252 53 A 100 105 0 0 1 252 237" strokeWidth="0.8" stroke="var(--color-pencil)" />
      <path d="M 115 190 C 130 100 270 80 320 130" strokeWidth="1.4" strokeDasharray="5 4" />
      <path d="M 318 128 L 308 122 L 326 126 L 308 134 Z" strokeWidth="1" fill="var(--color-ink)" />
      <circle cx="115" cy="190" r="5"  strokeWidth="1.4" />
      <line   x1="115" y1="195" x2="115" y2="208" strokeWidth="1.2" />
      <circle cx="320" cy="130" r="5"  strokeWidth="1.4" />
      <line   x1="320" y1="135" x2="320" y2="148" strokeWidth="1.2" />
      <circle cx="115" cy={r(210)} r="2.5" strokeWidth="1" />
      <circle cx="320" cy={r(150)} r="2.5" strokeWidth="1" />

      {/* Pen-tip dot — positioned by hook */}
      <circle ref={dotRef} r="5" fill="#c8902e" opacity="0" data-nodraw="true" />
    </svg>
  );
}
