"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { profile } from "@/content/site";
import { scroller } from "./Motion";

const NAMES = ["Pravasa Transworld", "La Europa Education", "AUM Industries", "SwiftRut Technologies", "Hacker House Goa", "PromptWars Ahmedabad", "Obscur Labs", "Google Solution Challenge"];

/*
  Two bands drifting in opposite directions: who I've built for, and what
  I build with. Scrolling speeds them up and leans them with your momentum.
*/
export function Marquee() {
  const rows = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const pos = [0, 0];
    let skew = 0;
    const tick = () => {
      const v = scroller.lenis?.velocity ?? 0;
      skew += (Math.max(-8, Math.min(8, v * 0.35)) - skew) * 0.1;
      rows.current.forEach((row, i) => {
        if (!row) return;
        const half = row.scrollWidth / 2;
        const dir = i === 0 ? -1 : 1;
        pos[i] += dir * (0.45 + Math.abs(v) * 0.25);
        if (pos[i] <= -half) pos[i] += half;
        if (pos[i] > 0) pos[i] -= half;
        row.style.transform = `translate3d(${pos[i]}px,0,0) skewX(${-skew}deg)`;
      });
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  const lists = [NAMES, profile.heroStack];
  return (
    <section className="marquee" aria-label="Clients, events and the stack I build with">
      {lists.map((list, i) => (
        <div key={i} className={`marquee__row${i ? " marquee__row--alt" : ""}`}>
          <div ref={(el) => { rows.current[i] = el; }} className="marquee__track">
            {[...list, ...list].map((w, j) => (
              <span key={j} aria-hidden={j >= list.length}>
                {w}<i aria-hidden="true" />
              </span>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
