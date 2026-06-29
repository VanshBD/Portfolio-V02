import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { r } from "@/lib/svg";

/*
  Creates a GSAP timeline (paused) that draws every SVG geometry element inside
  `svgRef` via stroke-dashoffset. Returns:

    tlRef    — the timeline, call `.progress(p)` to drive it
    dotRef   — an SVGCircleElement that tracks the pen tip; add it to your SVG

  The pen-tip dot (amber) follows the front of whichever path is currently
  being drawn, giving the illusion of a real hand sketching.
*/
export function useControlledTimeline(
  svgRef: React.RefObject<SVGSVGElement | null>,
  { gapPerElement = 0.32, drawDuration = 0.55 } = {}
) {
  const tlRef  = useRef<gsap.core.Timeline | null>(null);
  const dotRef = useRef<SVGCircleElement | null>(null);

  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const elements = Array.from(
      svg.querySelectorAll<SVGGeometryElement>("path, circle, ellipse, line, rect, polyline")
    ).filter((el) => !el.hasAttribute("data-nodraw"));

    const tl = gsap.timeline({ paused: true });
    tlRef.current = tl;

    elements.forEach((el, i) => {
      let len = 0;
      try { len = el.getTotalLength?.() ?? 60; } catch { len = 60; }
      len = r(len);

      gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });

      /* proxy object tracks how much of this element is drawn */
      const proxy = { drawn: 0 };

      tl.to(
        el,
        { strokeDashoffset: 0, ease: "none", duration: drawDuration },
        i * gapPerElement
      );

      /* parallel tween moves the pen-tip dot */
      if (el.getPointAtLength) {
        tl.to(
          proxy,
          {
            drawn: len,
            ease: "none",
            duration: drawDuration,
            onUpdate() {
              const dot = dotRef.current;
              if (!dot) return;
              try {
                const pt = el.getPointAtLength(proxy.drawn);
                dot.setAttribute("cx", String(r(pt.x)));
                dot.setAttribute("cy", String(r(pt.y)));
                dot.style.opacity = "1";
              } catch { /* path not ready */ }
            },
          },
          i * gapPerElement
        );
      }
    });

    /* hide dot after last element finishes */
    if (dotRef.current) {
      tl.to(dotRef.current, { opacity: 0, duration: 0.15 }, ">");
    }

    return () => { tl.kill(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { tlRef, dotRef };
}
