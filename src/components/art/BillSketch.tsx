"use client";

import { useRef, useEffect } from "react";
import { useControlledTimeline } from "@/hooks/useControlledTimeline";

interface Props { progress?: number; }

export function BillSketch({ progress = 0 }: Props) {
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
      aria-label="Invoice with paid stamp"
      className="w-full h-full"
    >
      <rect x="90" y="20" width="220" height="250" rx="2" strokeWidth="1.5" />
      <rect x="90" y="20" width="220" height="42" rx="2" strokeWidth="1" stroke="var(--color-pencil)" />
      <rect x="102" y="30" width="22" height="22" strokeWidth="1" stroke="var(--color-pencil)" />
      <line x1="138" y1="38" x2="245" y2="38" strokeWidth="3.5" />
      <line x1="138" y1="48" x2="210" y2="48" strokeWidth="1.5" stroke="var(--color-pencil)" />
      <line x1="106" y1="82"  x2="240" y2="82"  strokeWidth="0.9" stroke="var(--color-pencil)" />
      <line x1="240" y1="82"  x2="295" y2="82"  strokeWidth="0.9" />
      <line x1="106" y1="102" x2="220" y2="102" strokeWidth="0.9" stroke="var(--color-pencil)" />
      <line x1="240" y1="102" x2="295" y2="102" strokeWidth="0.9" />
      <line x1="106" y1="122" x2="235" y2="122" strokeWidth="0.9" stroke="var(--color-pencil)" />
      <line x1="240" y1="122" x2="295" y2="122" strokeWidth="0.9" />
      <line x1="106" y1="142" x2="200" y2="142" strokeWidth="0.9" stroke="var(--color-pencil)" />
      <line x1="240" y1="142" x2="295" y2="142" strokeWidth="0.9" />
      <line x1="106" y1="162" x2="295" y2="162" strokeWidth="1.2" />
      <line x1="180" y1="174" x2="250" y2="174" strokeWidth="0.9" stroke="var(--color-pencil)" />
      <line x1="255" y1="174" x2="295" y2="174" strokeWidth="1.2" />
      <line x1="190" y1="187" x2="250" y2="187" strokeWidth="0.9" stroke="var(--color-pencil)" />
      <line x1="255" y1="187" x2="295" y2="187" strokeWidth="1.1" />
      <rect x="165" y="200" width="130" height="28" strokeWidth="1.5" />
      <line x1="172" y1="214" x2="226" y2="214" strokeWidth="1" stroke="var(--color-pencil)" />
      <line x1="235" y1="214" x2="288" y2="214" strokeWidth="2" />
      <circle cx="148" cy="200" r="36" strokeWidth="1.8" />
      <circle cx="148" cy="200" r="30" strokeWidth="0.7" stroke="var(--color-pencil)" />
      <line x1="125" y1="196" x2="171" y2="196" strokeWidth="3.5" />
      <line x1="128" y1="206" x2="168" y2="206" strokeWidth="2" stroke="var(--color-pencil)" />

      <circle ref={dotRef} r="5" fill="#c8902e" opacity="0" data-nodraw="true" />
    </svg>
  );
}
