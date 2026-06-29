"use client";

import { useRef, useEffect } from "react";
import { useControlledTimeline } from "@/hooks/useControlledTimeline";

interface Props { progress?: number; }

export function PromptSketch({ progress = 0 }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { tlRef, dotRef } = useControlledTimeline(svgRef);

  useEffect(() => {
    tlRef.current?.progress(progress).pause();
  }, [progress, tlRef]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 400 260"
      fill="none"
      stroke="var(--color-ink)"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="Two terminals facing off sketch"
      className="w-full h-full"
    >
      {/* Left terminal */}
      <rect x="18" y="30" width="158" height="200" rx="4" strokeWidth="1.5" />
      <rect x="18" y="30" width="158" height="24" rx="4" strokeWidth="1" stroke="var(--color-pencil)" />
      <circle cx="36" cy="42" r="4.5" strokeWidth="1" stroke="var(--color-pencil)" />
      <circle cx="52" cy="42" r="4.5" strokeWidth="1" stroke="var(--color-pencil)" />
      <circle cx="68" cy="42" r="4.5" strokeWidth="1" stroke="var(--color-pencil)" />
      <path d="M 30 74 L 36 74" strokeWidth="1.2" />
      <line x1="40" y1="74" x2="122" y2="74" strokeWidth="1" stroke="var(--color-pencil)" />
      <path d="M 30 94 L 36 94" strokeWidth="1.2" />
      <line x1="40" y1="94" x2="100" y2="94" strokeWidth="1" stroke="var(--color-pencil)" />
      <path d="M 30 114 L 36 114" strokeWidth="1.2" />
      <line x1="40" y1="114" x2="140" y2="114" strokeWidth="1" stroke="var(--color-pencil)" />
      <path d="M 30 134 L 36 134" strokeWidth="1.2" />
      <line x1="40" y1="134" x2="90"  y2="134" strokeWidth="1" stroke="var(--color-pencil)" />
      <rect x="40" y="152" width="8" height="12" strokeWidth="1" />

      {/* Lightning bolt VS center */}
      <path d="M 208 110 L 196 130 L 204 130 L 192 155 L 208 135 L 200 135 Z" strokeWidth="1.4" />

      {/* Right terminal */}
      <rect x="224" y="30" width="158" height="200" rx="4" strokeWidth="1.5" />
      <rect x="224" y="30" width="158" height="24" rx="4" strokeWidth="1" stroke="var(--color-pencil)" />
      <circle cx="364" cy="42" r="4.5" strokeWidth="1" stroke="var(--color-pencil)" />
      <circle cx="348" cy="42" r="4.5" strokeWidth="1" stroke="var(--color-pencil)" />
      <circle cx="332" cy="42" r="4.5" strokeWidth="1" stroke="var(--color-pencil)" />
      <path d="M 370 74 L 364 74" strokeWidth="1.2" />
      <line x1="360" y1="74"  x2="278" y2="74"  strokeWidth="1" stroke="var(--color-pencil)" />
      <path d="M 370 94 L 364 94" strokeWidth="1.2" />
      <line x1="360" y1="94"  x2="298" y2="94"  strokeWidth="1" stroke="var(--color-pencil)" />
      <path d="M 370 114 L 364 114" strokeWidth="1.2" />
      <line x1="360" y1="114" x2="256" y2="114" strokeWidth="1" stroke="var(--color-pencil)" />
      <path d="M 370 134 L 364 134" strokeWidth="1.2" />
      <line x1="360" y1="134" x2="268" y2="134" strokeWidth="1.5" stroke="var(--color-ink)" />
      <rect x="234" y="146" width="136" height="18" rx="2" strokeWidth="0.8" stroke="var(--color-pencil)" />

      <circle ref={dotRef} r="5" fill="#c8902e" opacity="0" data-nodraw="true" />
    </svg>
  );
}
