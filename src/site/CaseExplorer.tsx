"use client";

import { useEffect, useState } from "react";
import type { CaseStudy } from "@/content/site";
import { Diagram } from "./Diagram";

/* The live diagram for a case-study page: pick a step, or let it play. */
export function CaseExplorer({ cs }: { cs: CaseStudy }) {
  const [step, setStep] = useState(0);
  const [replay, setReplay] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [playing, setPlaying] = useState(false);
  const total = cs.steps.length;

  useEffect(() => {
    const t = window.setTimeout(() => setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches), 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const t = window.setTimeout(() => {
      if (step >= total - 1) setPlaying(false);
      else setStep(step + 1);
    }, 2600);
    return () => clearTimeout(t);
  }, [playing, step, total]);

  const s = cs.steps[step];
  return (
    <div className="cx">
      <div className="cx__side">
        <p className="cstep__n mono">{String(step + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</p>
        <div key={step} className="case__story-text">
          <h3 className="cstep__title">{s.title}</h3>
          <p className="cstep__body">{s.body}</p>
        </div>
        <ol className="case__nav" aria-label={`${cs.name} steps`}>
          {cs.steps.map((x, i) => (
            <li key={x.title}>
              <button
                type="button"
                className={`${i === step ? "is-active" : ""}${i < step ? " is-past" : ""}`}
                aria-current={i === step ? "step" : undefined}
                onClick={() => { setPlaying(false); setStep(i); }}
              >
                <span className="case__nav-dot" aria-hidden="true" />
                <span className="case__nav-label">{x.title}</span>
              </button>
            </li>
          ))}
        </ol>
        <div className="cx__controls">
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => { setStep(Math.max(0, step - 1)); setPlaying(false); }} disabled={step === 0}>← Back</button>
          <button type="button" className="btn btn--primary btn--sm" onClick={() => { if (step >= total - 1) setStep(0); setPlaying((p) => !p); }}>
            {playing ? "Pause" : step >= total - 1 ? "Play again" : "Play the story"}
          </button>
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => { setStep(Math.min(total - 1, step + 1)); setPlaying(false); }} disabled={step === total - 1}>Next →</button>
        </div>
      </div>
      <div className="case__stage">
        <div className="case__stage-inner">
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
  );
}
