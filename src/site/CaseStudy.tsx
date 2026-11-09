"use client";

import { useEffect, useRef, useState } from "react";
import type { CaseStudy as CS } from "@/content/site";
import { Diagram } from "./Diagram";
import { PravasaDemo, LaEuropaDemo } from "./Demos";

/*
  One case study. The story steps scroll on the left; the architecture
  diagram stays pinned on the right and lights up the boxes and connections
  for whichever step is in the middle of the screen.
*/
export function CaseStudy({ cs }: { cs: CS }) {
  const [step, setStep] = useState(0);
  const [replay, setReplay] = useState(0);
  const [reduced, setReduced] = useState(false);
  const stepRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const t = window.setTimeout(() => setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches), 0);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setStep(Number((e.target as HTMLElement).dataset.step)); }),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    stepRefs.current.forEach((el) => el && io.observe(el));
    return () => { clearTimeout(t); io.disconnect(); };
  }, []);

  const total = cs.steps.length;

  return (
    <section id={`case-${cs.id}`} className="case" data-section="work" data-path={`/work/${cs.id}`}>
      <div className="container">
        <header className="case__head">
          <span className="case__index" aria-hidden="true">{cs.index}</span>
          <div>
            <p className="eyebrow" data-reveal>{cs.kicker}</p>
            <h3 className="case__name" data-split>{cs.name}</h3>
            <p className="case__summary" data-reveal>{cs.summary}</p>
            <p className="case__role mono" data-reveal>
              {cs.role}{cs.credit && <><span aria-hidden="true"> · </span>{cs.credit}</>}
            </p>
          </div>
        </header>

        <div className="case__body">
          <ol className="case__steps">
            {cs.steps.map((s, i) => (
              <li
                key={s.title}
                ref={(el) => { stepRefs.current[i] = el; }}
                data-step={i}
                className={`cstep${i === step ? " is-active" : ""}${i < step ? " is-past" : ""}`}
              >
                <p className="cstep__n mono">{String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</p>
                <h4 className="cstep__title">{s.title}</h4>
                <p className="cstep__body">{s.body}</p>
              </li>
            ))}
          </ol>

          <div className="case__stage">
            <div className="case__stage-inner">
              <div className="case__stage-top">
                <span className="mono">{cs.steps[step].title}</span>
                <button type="button" className="icon-btn icon-btn--sm" onClick={() => setReplay((r) => r + 1)} aria-label="Replay the request flow" title="Replay">
                  <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.3-5.6M4 4v4.5h4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </div>
              <Diagram cs={cs} step={step} replay={replay} reduced={reduced} />
              <div className="case__progress" aria-hidden="true">
                {cs.steps.map((s, i) => <i key={s.title} className={i <= step ? "is-on" : ""} />)}
              </div>
            </div>
          </div>
        </div>

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
            <ul className="chips">{cs.stack.map((s) => <li key={s}>{s}</li>)}</ul>
            <div className="case__links">
              {cs.live && <a className="btn btn--primary btn--sm" href={cs.live} target="_blank" rel="noopener noreferrer" data-magnetic>Visit live site ↗</a>}
              {cs.code && <a className="btn btn--ghost btn--sm" href={cs.code} target="_blank" rel="noopener noreferrer" data-magnetic>Read the code ↗</a>}
            </div>
          </div>
        </div>

        {(cs.demo || cs.cover) && (
          <div className={`case__extra${cs.demo && cs.cover ? " has-two" : ""}`}>
            {cs.demo && (
              <div data-reveal>
                <p className="eyebrow eyebrow--dim">Try it</p>
                {cs.demo === "pravasa" ? <PravasaDemo /> : <LaEuropaDemo />}
              </div>
            )}
            {cs.cover && (
              <a className="shot" href={cs.live} target="_blank" rel="noopener noreferrer" data-reveal>
                <p className="eyebrow eyebrow--dim">See it live</p>
                <span className="shot__frame">
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
