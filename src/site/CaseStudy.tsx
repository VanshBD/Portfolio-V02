"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cases, type CaseStudy as CS } from "@/content/site";
import { Diagram } from "./Diagram";
import { PravasaDemo, LaEuropaDemo } from "./Demos";
import { PilotDemo } from "./PilotDemo";
import { scrollToTarget } from "./Motion";

gsap.registerPlugin(ScrollTrigger);

/*
  One case study as a single pinned screen: the story and the live diagram
  stay put while a short scroll steps through the story. The step list is
  clickable, so visitors can jump straight to any step or move on.
*/
export function CaseStudy({ cs }: { cs: CS }) {
  const [step, setStep] = useState(0);
  const [replay, setReplay] = useState(0);
  const [reduced, setReduced] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const st = useRef<ScrollTrigger | null>(null);
  const total = cs.steps.length;

  useEffect(() => {
    const t = window.setTimeout(() => setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches), 0);
    const el = scroller.current;
    if (!el) return () => clearTimeout(t);
    const top = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--top")) || 68;
    st.current = ScrollTrigger.create({
      trigger: el,
      start: `top ${top}px`,
      end: "bottom bottom",
      onUpdate: (self) => setStep(Math.min(total - 1, Math.floor(self.progress * total * 0.999))),
    });
    return () => { clearTimeout(t); st.current?.kill(); st.current = null; };
  }, [total]);

  /* jump to the scroll position that shows step i */
  const goTo = (i: number) => {
    const s = st.current;
    if (!s) { setStep(i); return; }
    scrollToTarget(s.start + ((i + 0.5) / total) * (s.end - s.start));
  };

  const s = cs.steps[step];

  return (
    <section id={`case-${cs.id}`} className="case" data-section="work" data-path={`/work/${cs.id}`}>
      <div className="container">
        <header className="case__head">
          <span className="case__index" aria-hidden="true" data-parallax="0.35">{cs.index}<small>/{String(cases.length).padStart(2, "0")}</small></span>
          <div>
            <p className="eyebrow" data-reveal>{cs.kicker}</p>
            <h3 className="case__name" data-split>{cs.name}</h3>
            <p className="case__summary" data-reveal>{cs.summary}</p>
            <p className="case__role mono" data-reveal>
              {cs.role}{cs.credit && <><span aria-hidden="true"> · </span>{cs.credit}</>}
            </p>
          </div>
        </header>
      </div>

      <div ref={scroller} className="case__scroller" style={{ "--steps": total } as React.CSSProperties}>
        <div className="case__pin">
          <div className="container case__pin-grid">
            <div className="case__story">
              <p className="cstep__n mono">{String(step + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</p>
              <div key={step} className="case__story-text">
                <h4 className="cstep__title">{s.title}</h4>
                <p className="cstep__body">{s.body}</p>
              </div>
              <ol className="case__nav" aria-label={`${cs.name} story steps`}>
                {cs.steps.map((x, i) => (
                  <li key={x.title}>
                    <button
                      type="button"
                      className={`${i === step ? "is-active" : ""}${i < step ? " is-past" : ""}`}
                      aria-current={i === step ? "step" : undefined}
                      onClick={() => goTo(i)}
                    >
                      <span className="case__nav-dot" aria-hidden="true" />
                      <span className="case__nav-label">{x.title}</span>
                    </button>
                  </li>
                ))}
              </ol>
              <p className="case__hint mono">Scroll, or pick a step</p>
            </div>

            <div className="case__stage">
              <div className="case__stage-inner" data-spotlight>
                <div className="case__stage-top">
                  <span className="mono">{s.title}</span>
                  <button type="button" className="icon-btn icon-btn--sm" onClick={() => setReplay((r) => r + 1)} aria-label="Replay the request flow" title="Replay">
                    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.3-5.6M4 4v4.5h4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                </div>
                <Diagram cs={cs} step={step} replay={replay} reduced={reduced} />
                <div className="case__progress" aria-hidden="true">
                  {cs.steps.map((x, i) => <i key={x.title} className={i <= step ? "is-on" : ""} />)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="case__foot">
          <dl className="case__metrics">
            {cs.metrics.map((m, i) => (
              <div key={m.label} data-reveal data-delay={i * 0.06}>
                <dt>{m.value}</dt>
                <dd>{m.label}</dd>
              </div>
            ))}
          </dl>
          <div className="case__meta" data-reveal>
            <ul className="chips">{cs.stack.map((x) => <li key={x}>{x}</li>)}</ul>
            <div className="case__links">
              {cs.live && <a className="btn btn--primary btn--sm" href={cs.live} target="_blank" rel="noopener noreferrer" data-magnetic data-cursor="Open">Visit live site ↗</a>}
              {cs.code && <a className="btn btn--ghost btn--sm" href={cs.code} target="_blank" rel="noopener noreferrer" data-magnetic data-cursor="Code">Read the code ↗</a>}
            </div>
          </div>
        </div>

        {(cs.demo || cs.cover) && (
          <div className={`case__extra${cs.demo && cs.cover && cs.demo !== "pilot" ? " has-two" : ""}${cs.demo === "pilot" ? " is-pilot" : ""}`}>
            {cs.demo && (
              <div data-reveal>
                <p className="eyebrow eyebrow--dim">Try it</p>
                {cs.demo === "pravasa" ? <PravasaDemo /> : cs.demo === "pilot" ? <PilotDemo /> : <LaEuropaDemo />}
              </div>
            )}
            {cs.video ? (
              <div className="shot" data-reveal>
                <p className="eyebrow eyebrow--dim">Watch the launch film</p>
                <span className="shot__frame" data-clip data-cursor="Play">
                  <span className="shot__bar"><i /><i /><i /><b>ObscurPilot · launch film</b></span>
                  <video src={cs.video} poster={cs.cover} controls muted playsInline preload="none" aria-label={`${cs.name} launch film`} />
                </span>
              </div>
            ) : cs.cover && (
              <a className="shot" href={cs.live} target="_blank" rel="noopener noreferrer" data-reveal data-cursor="Open">
                <p className="eyebrow eyebrow--dim">See it live</p>
                <span className="shot__frame" data-clip>
                  <span className="shot__bar"><i /><i /><i /><b>{cs.live?.replace("https://", "")}</b></span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cs.cover} alt={`${cs.name} live site`} loading="lazy" decoding="async" />
                </span>
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
