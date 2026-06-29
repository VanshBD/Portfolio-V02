"use client";

import { useRef, useEffect } from "react";
import { useControlledTimeline } from "@/hooks/useControlledTimeline";

interface Props { progress?: number; }

export function AuthorSketch({ progress = 0 }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { tlRef, dotRef } = useControlledTimeline(svgRef, { gapPerElement: 0.2, drawDuration: 0.5 });

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
      aria-label="Developer at desk sketch"
      className="w-full h-full"
    >
      {/* Desk */}
      <line x1="30" y1="205" x2="370" y2="205" strokeWidth="2" />

      {/* Monitor */}
      <rect x="145" y="95"  width="140" height="96" rx="3" strokeWidth="1.5" />
      <rect x="152" y="101" width="126" height="76" rx="2" strokeWidth="0.8" stroke="var(--color-pencil)" />
      <line x1="162" y1="118" x2="220" y2="118" strokeWidth="1.2" stroke="var(--color-pencil)" />
      <line x1="162" y1="130" x2="264" y2="130" strokeWidth="1.2" stroke="var(--color-pencil)" />
      <line x1="162" y1="142" x2="240" y2="142" strokeWidth="1.2" stroke="var(--color-pencil)" />
      <line x1="162" y1="154" x2="200" y2="154" strokeWidth="1.2" stroke="var(--color-pencil)" />
      <path d="M 204 191 L 196 205 H 236 L 228 191" strokeWidth="1.2" />
      <rect x="145" y="197" width="130" height="10" rx="2" strokeWidth="1" stroke="var(--color-pencil)" />

      {/* Person (side view) */}
      <circle cx="88" cy="106" r="17" strokeWidth="1.4" />
      <line x1="88" y1="123" x2="88" y2="135" strokeWidth="1.3" />
      <path d="M 78 135 Q 75 170 80 205" strokeWidth="1.3" />
      <path d="M 98 135 Q 102 170 100 205" strokeWidth="1.3" />
      <line x1="90" y1="148" x2="140" y2="162" strokeWidth="1.3" />
      <line x1="140" y1="162" x2="160" y2="195" strokeWidth="1.3" />
      <path d="M 62 145 Q 55 150 52 175 Q 55 200 64 205" strokeWidth="1.2" stroke="var(--color-pencil)" />
      <line x1="52" y1="195" x2="108" y2="195" strokeWidth="1" stroke="var(--color-pencil)" />

      {/* Coffee mug */}
      <rect x="306" y="178" width="24" height="27" rx="2" strokeWidth="1.2" />
      <path d="M 330 184 Q 342 184 342 191 Q 342 198 330 198" strokeWidth="1.1" />
      <path d="M 312 174 Q 314 168 312 162" strokeWidth="0.9" stroke="var(--color-pencil)" />
      <path d="M 320 174 Q 322 166 320 158" strokeWidth="0.9" stroke="var(--color-pencil)" />
      <path d="M 328 174 Q 330 168 328 162" strokeWidth="0.9" stroke="var(--color-pencil)" />

      {/* Floating code snippet */}
      <rect x="300" y="60" width="72" height="48" rx="3" strokeWidth="0.8" stroke="var(--color-pencil)" strokeDasharray="3 3" />
      <line x1="308" y1="74" x2="364" y2="74" strokeWidth="0.8" stroke="var(--color-pencil)" />
      <line x1="308" y1="84" x2="348" y2="84" strokeWidth="0.8" stroke="var(--color-pencil)" />
      <line x1="308" y1="94" x2="355" y2="94" strokeWidth="0.8" stroke="var(--color-pencil)" />

      <circle ref={dotRef} r="5" fill="#c8902e" opacity="0" data-nodraw="true" />
    </svg>
  );
}
