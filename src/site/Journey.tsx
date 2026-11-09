"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { journey, type JourneyBranch } from "@/content/site";
import { scrollToTarget } from "./Motion";

gsap.registerPlugin(ScrollTrigger);

/*
  The journey as a git history. On wide screens the section pins and a HEAD
  marker walks the commit graph as you scroll: lanes light up behind it,
  each commit pops, the year rolls over in the background and a small
  `git log` beside the heading prints the latest commits. Click any commit
  to check it out. Phones and reduced motion get a plain vertical log.
*/

const S = 300; // space between commits
const X0 = 24; // x of the first commit
const LANE: Record<JourneyBranch, number> = { builds: 46, main: 98, hackathons: 150 };
const H = 178;
const N = journey.length;
const X = (i: number) => X0 + i * S;
const W = X(N - 1) + 300;
const HEAD_FROM = X(0) - 70;
const HEAD_TO = X(N - 1) + 70; // a little past the last commit so "Now" lights before the pin ends

/* short, stable commit hashes (FNV-1a) */
function sha(s: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16).padStart(8, "0").slice(0, 7);
}
const HASHES = journey.map((j) => sha(j.title + j.when));

/* side branches: commits on the same lane at most two apart share one branch */
function branchPaths() {
  const out: { lane: JourneyBranch; d: string }[] = [];
  (["builds", "hackathons"] as const).forEach((lane) => {
    const idx = journey.map((j, i) => (j.branch === lane ? i : -1)).filter((i) => i >= 0);
    const runs: number[][] = [];
    idx.forEach((i) => {
      const last = runs[runs.length - 1];
      if (last && i - last[last.length - 1] <= 2) last.push(i); else runs.push([i]);
    });
    const my = LANE.main, ly = LANE[lane];
    runs.forEach((r) => {
      const a = X(r[0]), b = X(r[r.length - 1]);
      const fork = a - S * 0.55, merge = Math.min(b + S * 0.55, X(N - 1));
      out.push({ lane, d: `M${fork} ${my} C${fork + 80} ${my} ${a - 80} ${ly} ${a} ${ly} L${b} ${ly} C${b + 80} ${ly} ${merge - 80} ${my} ${merge} ${my}` });
    });
  });
  return out;
}
const BRANCHES = branchPaths();
const MAIN = `M${X(0)} ${LANE.main} L${X(N - 1)} ${LANE.main}`;

const laneVar = (b: JourneyBranch) => `var(--lane-${b})`;
const yearOf = (i: number) => (i < 0 ? "2023" : journey[i].when.match(/\d{4}/)?.[0] ?? "now");

export function Journey() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const graph = useRef<SVGSVGElement>(null);
  const clip = useRef<SVGRectElement>(null);
  const head = useRef<SVGGElement>(null);
  const trig = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(N - 1);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const sec = section.current, tr = track.current, g = graph.current;
    if (!sec || !tr || !g) return;
    const wide = window.matchMedia("(min-width: 900px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    const setup = () => {
      trig.current?.kill(); trig.current = null;
      sec.style.height = "";
      tr.style.transform = "";
      if (!wide.matches || reduced) {
        sec.classList.remove("is-horizontal");
        raf = requestAnimationFrame(() => setActive(N - 1));
        return;
      }
      sec.classList.add("is-horizontal");
      const vw = window.innerWidth;
      const left0 = g.getBoundingClientRect().left;
      const maxShift = Math.max(0, left0 + W + 40 - vw);
      const anchor = vw * 0.5;
      sec.style.height = `${window.innerHeight + (HEAD_TO - HEAD_FROM) * 0.85}px`;

      let last = -2;
      const apply = (p: number) => {
        const hx = HEAD_FROM + p * (HEAD_TO - HEAD_FROM);
        const shift = Math.min(maxShift, Math.max(0, left0 + hx - anchor));
        tr.style.transform = `translate3d(${-shift}px, 0, 0)`;
        clip.current?.setAttribute("width", String(Math.max(0, hx)));
        head.current?.setAttribute("transform", `translate(${hx} 0)`);
        let a = -1;
        for (let i = 0; i < N; i++) if (X(i) <= hx + 2) a = i;
        if (a !== last) { last = a; setActive(a); }
      };

      trig.current = ScrollTrigger.create({ trigger: sec, start: "top top", end: "bottom bottom", onUpdate: (self) => apply(self.progress) });
      ScrollTrigger.refresh();
      raf = requestAnimationFrame(() => apply(trig.current?.progress ?? 0));
    };

    setup();
    wide.addEventListener("change", setup);
    window.addEventListener("resize", setup);
    return () => {
      cancelAnimationFrame(raf);
      trig.current?.kill();
      wide.removeEventListener("change", setup);
      window.removeEventListener("resize", setup);
    };
  }, []);

  /* check out a commit: scroll until HEAD sits on it */
  const checkout = (i: number) => {
    const st = trig.current;
    if (!st) return;
    const p = (X(i) + 6 - HEAD_FROM) / (HEAD_TO - HEAD_FROM);
    scrollToTarget(st.start + p * (st.end - st.start));
  };

  const log = journey.slice(0, active + 1).map((j, i) => ({ ...j, hash: HASHES[i], i })).reverse().slice(0, 5);
  const year = yearOf(active);

  return (
    <section ref={section} id="journey" className="journey" data-section="journey" data-path="/journey">
      <div className="journey__sticky">
        <span key={year} className="journey__year" aria-hidden="true">{year}</span>

        <div className="container journey__head">
          <div>
            <p className="eyebrow" data-reveal>Journey · 2023 → now</p>
            <h2 className="h2" data-split>From git init to client systems.</h2>
            <p className="journey__legend mono" data-reveal>
              {(["main", "builds", "hackathons"] as const).map((b) => (
                <span key={b} style={{ "--lane": laneVar(b) } as CSSProperties}><i />{b}</span>
              ))}
            </p>
          </div>
          <div className="gitlog mono" data-reveal aria-hidden="true">
            <p className="gitlog__cmd"><span>~/vansh</span> $ git log --oneline</p>
            <ol>
              {log.map((c, k) => (
                <li key={c.hash} style={{ "--lane": laneVar(c.branch) } as CSSProperties}>
                  <b>*</b> <span className="gitlog__hash">{c.hash}</span>
                  {k === 0 && <span className="gitlog__ref"> (HEAD → {c.branch})</span>}
                  {k > 0 && c.branch !== "main" && <span className="gitlog__br"> ({c.branch})</span>}
                  {" "}{c.title}
                </li>
              ))}
              {!log.length && <li className="gitlog__empty">fatal: no commits yet, keep scrolling</li>}
            </ol>
          </div>
        </div>

        <div className="journey__viewport">
          <div ref={track} className="journey__track">
            <svg ref={graph} className="jgraph" width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
              <defs>
                <clipPath id="jgraph-lit"><rect ref={clip} x="-40" y="0" width={W} height={H} /></clipPath>
              </defs>
              {/* the whole history, faint */}
              <g className="jgraph__ghost">
                <path d={MAIN} />
                {BRANCHES.map((b, i) => <path key={i} d={b.d} />)}
                <path d={`M${X(N - 1)} ${LANE.main} H${W - 30}`} className="jgraph__next" />
              </g>
              {/* the part HEAD has walked, in colour */}
              <g clipPath="url(#jgraph-lit)" className="jgraph__lit">
                <path d={MAIN} style={{ stroke: laneVar("main") }} />
                {BRANCHES.map((b, i) => <path key={i} d={b.d} style={{ stroke: laneVar(b.lane) }} />)}
              </g>
              <text x={W - 30} y={LANE.main - 12} className="jgraph__nexttext" textAnchor="end">next: your project?</text>
              {journey.map((j, i) => (
                <g
                  key={j.title}
                  className={`jnode${i <= active ? " is-on" : ""}${i === active ? " is-head" : ""}${hover === i ? " is-hover" : ""}`}
                  style={{ "--lane": laneVar(j.branch) } as CSSProperties}
                  transform={`translate(${X(i)} ${LANE[j.branch]})`}
                >
                  <circle r="15" className="jnode__ring" />
                  <circle r="7" className="jnode__dot" />
                </g>
              ))}
              <g ref={head} className="jhead" transform={`translate(${HEAD_TO} 0)`}>
                <line x1="0" y1="20" x2="0" y2={H} />
                <rect x="-23" y="0" width="46" height="18" rx="9" />
                <text x="0" y="12.5" textAnchor="middle">HEAD</text>
              </g>
            </svg>

            <ol className="journey__stops">
              {journey.map((j, i) => (
                <li
                  key={j.title}
                  className={`stop${i <= active ? " is-on" : ""}${i === active ? " is-head" : ""}`}
                  style={{ "--lane": laneVar(j.branch) } as CSSProperties}
                  tabIndex={0}
                  role="button"
                  aria-label={`${j.when}: ${j.title}`}
                  data-cursor="checkout"
                  onClick={() => checkout(i)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); checkout(i); } }}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                >
                  <p className="stop__meta mono"><span className="stop__hash">{HASHES[i]}</span><span>{j.when}</span></p>
                  <h3 className="stop__title">{j.title}</h3>
                  <p className="stop__text">{j.text}</p>
                  <span className="stop__branch mono">{j.branch}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
