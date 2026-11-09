"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { journey } from "@/content/site";

gsap.registerPlugin(ScrollTrigger);

/*
  On wide screens the journey scrolls sideways: the section is tall, its
  content sticks, and vertical scroll moves the track left. A line draws
  along the stops as it goes. Phones and reduced motion get a vertical list.
*/
export function Journey() {
  const section = useRef<HTMLElement>(null);
  const sticky = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sec = section.current, tr = track.current, ln = line.current;
    if (!sec || !tr || !ln) return;
    const wide = window.matchMedia("(min-width: 900px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let st: ScrollTrigger | null = null;

    const setup = () => {
      st?.kill(); st = null;
      sec.style.height = "";
      tr.style.transform = "";
      if (!wide.matches || reduced) { sec.classList.remove("is-horizontal"); return; }
      sec.classList.add("is-horizontal");
      const distance = Math.max(0, tr.scrollWidth - window.innerWidth + 80);
      sec.style.height = `${window.innerHeight + distance}px`;
      st = ScrollTrigger.create({
        trigger: sec,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          tr.style.transform = `translate3d(${-self.progress * distance}px, 0, 0)`;
          ln.style.transform = `scaleX(${self.progress})`;
          tr.querySelectorAll<HTMLElement>(".stop").forEach((el, i, all) => {
            el.classList.toggle("is-on", self.progress >= i / (all.length - 1) - 0.04);
          });
        },
      });
      ScrollTrigger.refresh();
    };
    setup();
    const onResize = () => setup();
    wide.addEventListener("change", onResize);
    window.addEventListener("resize", onResize);
    return () => { st?.kill(); wide.removeEventListener("change", onResize); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <section ref={section} id="journey" className="journey" data-section="journey" data-path="/journey">
      <div ref={sticky} className="journey__sticky">
        <div className="container journey__head">
          <p className="eyebrow" data-reveal>Journey · 2023 → now</p>
          <h2 className="h2" data-split>From git init to client systems.</h2>
        </div>
        <div className="journey__viewport">
          <div className="journey__line" aria-hidden="true"><div ref={line} /></div>
          <div ref={track} className="journey__track">
            {journey.map((j) => (
              <article key={j.title} className="stop">
                <span className="stop__dot" aria-hidden="true" />
                <p className="stop__when mono">{j.when} · <span>{j.tag}</span></p>
                <h3 className="stop__title">{j.title}</h3>
                <p className="stop__text">{j.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
