"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface DrawPathProps {
  d: string;
  viewBox?: string;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  className?: string;
  width?: string | number;
  height?: string | number;
  start?: string;
  end?: string;
  delay?: number;
}

/* Renders a single SVG path that draws itself as the user scrolls. */
export function DrawPath({
  d,
  viewBox = "0 0 100 10",
  stroke = "var(--color-ink)",
  strokeWidth = 1.5,
  fill = "none",
  className = "",
  width = "100%",
  height = "auto",
  start = "top 88%",
  end = "top 30%",
  delay = 0,
}: DrawPathProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useGSAP(() => {
    const path = pathRef.current;
    if (!path) return;

    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });

    gsap.to(path, {
      strokeDashoffset: 0,
      ease: "none",
      delay,
      scrollTrigger: {
        trigger: svgRef.current,
        start,
        end,
        scrub: 1.2,
      },
    });
  }, { scope: svgRef });

  return (
    <svg
      ref={svgRef}
      viewBox={viewBox}
      width={width}
      height={height}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path ref={pathRef} d={d} />
    </svg>
  );
}
