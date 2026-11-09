"use client";

import { useEffect, useRef, useState } from "react";

/*
  ObscurPilot's safety checks, ticking on one by one when the card scrolls
  into view. Hovering the card (or focusing a pill) runs them again.
*/
export function CheckPills({ checks }: { checks: string[] }) {
  const ref = useRef<HTMLUListElement>(null);
  const [on, setOn] = useState(0);
  const timers = useRef<number[]>([]);

  const play = () => {
    timers.current.forEach(clearTimeout);
    setOn(0);
    timers.current = checks.map((_, i) => window.setTimeout(() => setOn(i + 1), 260 + i * 260));
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { play(); io.disconnect(); } }, { threshold: 0.6 });
    io.observe(el);
    const card = el.closest(".how__card");
    const replay = () => play();
    card?.addEventListener("mouseenter", replay);
    const list = timers.current;
    return () => { io.disconnect(); card?.removeEventListener("mouseenter", replay); list.forEach(clearTimeout); timers.current.forEach(clearTimeout); };
    // play only reads refs and setters, so it is safe to bind once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ul ref={ref} className="how__checks" aria-label={`Checks: ${checks.join(", ")}`}>
      {checks.map((c, i) => (
        <li key={c} className={i < on ? "is-ok" : ""}>
          <span aria-hidden="true">{i < on ? "✓" : "·"}</span>{c}
        </li>
      ))}
    </ul>
  );
}
