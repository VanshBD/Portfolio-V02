"use client";

import { useEffect, useRef, useState } from "react";
import { scrollToTarget } from "./Motion";

interface Marker { label: string; at: number; el: HTMLElement }

/*
  The request path: a rail on the left edge that runs the length of the page.
  A packet of light rides it with the scroll, passing a marker for every
  section ([data-path]) and arriving at "200 OK" at the contact section.
*/
export function RequestPath() {
  const fill = useRef<HTMLDivElement>(null);
  const packet = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [passed, setPassed] = useState(-1);
  const [done, setDone] = useState(false);

  /* where each section sits along the page, as 0..1 */
  useEffect(() => {
    const measure = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const list = Array.from(document.querySelectorAll<HTMLElement>("[data-path]")).map((el) => {
        const top = el.getBoundingClientRect().top + window.scrollY;
        return { label: el.dataset.path ?? "", at: Math.min(1, Math.max(0, (top - window.innerHeight * 0.4) / max)), el };
      });
      setMarkers(list);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      if (fill.current) fill.current.style.transform = `scaleY(${p})`;
      if (packet.current) packet.current.style.top = `${p * 100}%`;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      let last = -1;
      markers.forEach((m, i) => { if (p >= m.at - 0.002) last = i; });
      setPassed(last);
      setDone(p > 0.985);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, [markers]);

  return (
    <>
      <div className="rpath" aria-hidden="true">
        <div className="rpath__rail">
          <div ref={fill} className="rpath__fill" />
          <div ref={packet} className={`rpath__packet${done ? " is-done" : ""}`} />
          {markers.map((m, i) => (
            <button
              key={m.label + i}
              type="button"
              tabIndex={-1}
              className={`rpath__mark${i <= passed ? " is-passed" : ""}${i === passed ? " is-current" : ""}`}
              style={{ top: `${m.at * 100}%` }}
              onClick={() => scrollToTarget(m.el)}
            >
              <span>{m.label}</span>
            </button>
          ))}
        </div>
        <div className={`rpath__status${done ? " is-ok" : ""}`}>{done ? "200 OK" : "···"}</div>
      </div>
      <div className="rpath-mobile" aria-hidden="true"><div ref={bar} /></div>
    </>
  );
}
