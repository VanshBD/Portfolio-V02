"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/*
  A soft ring that trails the (still visible) system cursor. It grows over
  anything clickable and shows a word over elements with data-cursor.
  Mouse and trackpad only; touch devices never see it.
*/
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = ring.current, l = label.current;
    if (!r || !l) return;
    const x = gsap.quickTo(r, "x", { duration: 0.35, ease: "power3.out" });
    const y = gsap.quickTo(r, "y", { duration: 0.35, ease: "power3.out" });

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      r.classList.add("is-live");
      x(e.clientX); y(e.clientY);
      const t = e.target as Element | null;
      const tagged = t?.closest?.("[data-cursor]") as HTMLElement | null;
      const link = t?.closest?.("a, button, select, input, label, [role='button']");
      const word = tagged?.dataset.cursor ?? "";
      l.textContent = word;
      r.dataset.mode = word ? "label" : link ? "link" : "";
    };
    const leave = () => r.classList.remove("is-live");
    const down = () => r.classList.add("is-down");
    const up = () => r.classList.remove("is-down");
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  return <div ref={ring} className="cursor-ring" aria-hidden="true"><span ref={label} /></div>;
}
