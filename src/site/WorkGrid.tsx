"use client";

import { useRef, type PointerEvent } from "react";
import { work, type Work } from "@/content/site";

/* Drawn covers for private work that has no public screenshots. */
function Art({ kind }: { kind: "hospital" | "swiftrut" | "ovx" }) {
  if (kind === "ovx") {
    return (
      <div className="art art--ovx" aria-hidden="true">
        <p className="art__q">“भारत की राजधानी क्या है?” · “What is the capital of India?”</p>
        {[["guard", 6], ["encode", 18], ["search", 30], ["answer", 12]].map(([k, w]) => (
          <div key={k} className="art__bar"><span>{k}</span><i style={{ width: `${w}%` }} /></div>
        ))}
        <p className="art__total"><b>9.43 ms</b> median · 1.17M chunks</p>
      </div>
    );
  }
  if (kind === "hospital") {
    return (
      <div className="art art--hospital" aria-hidden="true">
        <div className="art__row"><span>Reception</span><b>10:30 · Dr. appointment booked</b></div>
        <div className="art__row"><span>Doctor</span><b>Consultation note saved</b></div>
        <div className="art__row art__row--signal"><span>Reminder</span><b>Check-up due in 7 days · medicines at 9 PM</b></div>
        <div className="art__phone"><i />Next check-up reminder sent</div>
      </div>
    );
  }
  return (
    <div className="art art--swiftrut" aria-hidden="true">
      <div className="art__metric"><b>65%</b><span>faster resume generation</span></div>
      <div className="art__metric"><b>800</b><span>live WebSocket connections</span></div>
      <div className="art__metric"><b>&lt;120 ms</b><span>latency under load</span></div>
    </div>
  );
}

function Card({ w }: { w: Work }) {
  const ref = useRef<HTMLElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const href = w.live ?? w.code;

  const move = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    ref.current.style.setProperty("--rx", `${(0.5 - y) * 7}deg`);
    ref.current.style.setProperty("--ry", `${(x - 0.5) * 9}deg`);
    ref.current.style.setProperty("--gx", `${x * 100}%`);
    ref.current.style.setProperty("--gy", `${y * 100}%`);
  };
  const leave = () => {
    ref.current?.style.setProperty("--rx", "0deg");
    ref.current?.style.setProperty("--ry", "0deg");
    vid.current?.pause();
  };

  return (
    <article ref={ref} className="wcard" data-reveal onPointerMove={move} onPointerLeave={leave} onPointerEnter={() => { vid.current?.play().catch(() => {}); }}>
      <div className="wcard__tilt">
        <div className="wcard__media">
          {w.video ? (
            <video ref={vid} src={w.video} poster={w.cover} muted loop playsInline preload="none" aria-label={`${w.title} launch clip`} />
          ) : w.cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={w.cover} alt={`${w.title} screenshot`} loading="lazy" decoding="async" />
          ) : w.art ? <Art kind={w.art} /> : null}
          {w.video && <span className="wcard__play mono">▶ hover to play</span>}
          <span className="wcard__glare" aria-hidden="true" />
        </div>
        <div className="wcard__body">
          <p className="wcard__kind mono">{w.kind}</p>
          <h3 className="wcard__title">
            {href ? <a href={href} target="_blank" rel="noopener noreferrer" className="wcard__link">{w.title}</a> : w.title}
          </h3>
          <p className="wcard__line">{w.line}</p>
          <div className="wcard__foot">
            <ul className="chips chips--sm">{w.stack.map((s) => <li key={s}>{s}</li>)}</ul>
            <span className="wcard__links">
              {w.live && <a href={w.live} target="_blank" rel="noopener noreferrer">Live ↗</a>}
              {w.code && <a href={w.code} target="_blank" rel="noopener noreferrer">Code ↗</a>}
              {!w.live && !w.code && <span className="pill pill--dim">Private</span>}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

export function WorkGrid() {
  return (
    <section id="more" className="section more" data-section="more" data-path="/work/more">
      <div className="container">
        <p className="eyebrow" data-reveal>More work</p>
        <h2 className="h2" data-split>Products, tools and hackathon builds.</h2>
        <div className="wgrid">
          {work.map((w) => <Card key={w.id} w={w} />)}
        </div>
      </div>
    </section>
  );
}
