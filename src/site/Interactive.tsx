"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { profile } from "@/content/site";
import { act } from "./Playful";

/* Adds .is-in once the element scrolls into view. */
function useInView<T extends Element>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, inView] as const;
}

/* ── "How I build" card graphics ── */
export function HowGraphic({ kind }: { kind: "drop" | "pulse" }) {
  const [ref, inView] = useInView<SVGSVGElement>();
  if (kind === "drop") {
    /* response time before and after caching: the line falls by 48% */
    return (
      <svg ref={ref} viewBox="0 0 260 74" className={`how__graph${inView ? " is-in" : ""}`} aria-hidden="true">
        <line x1="0" y1="66" x2="260" y2="66" className="how__graph-base" />
        <path d="M0 18 L18 14 L34 20 L50 12 L66 18 L82 15 L98 19 L114 16 L122 18 C136 18 140 46 156 46 L172 44 L188 47 L204 43 L220 46 L236 44 L260 45" pathLength={1} className="how__graph-line" />
        <circle cx="260" cy="45" r="4" className="how__graph-dot" />
        <text x="0" y="8" className="how__graph-label">before</text>
        <text x="200" y="36" className="how__graph-label how__graph-label--ok">after · −48%</text>
      </svg>
    );
  }
  /* a live heartbeat: systems that keep running */
  return (
    <svg viewBox="0 0 260 60" className="how__graph how__graph--pulse" aria-hidden="true">
      <g className="how__pulse-track">
        {[0, 1].map((k) => (
          <path key={k} transform={`translate(${k * 260} 0)`} d="M0 34 H60 L70 34 L78 14 L88 52 L96 26 L102 34 H170 L178 34 L186 18 L194 46 L200 34 H260" className="how__pulse-line" />
        ))}
      </g>
      <circle cx="252" cy="34" r="4" className="how__graph-dot how__graph-dot--ok" />
    </svg>
  );
}

/* ── Learning now: a tiny chain you can break ── */
function hash(s: string) {
  /* FNV-1a, shown as 8 hex characters: a stand-in for SHA-256, for teaching only */
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16).padStart(8, "0");
}

interface Block { data: string; nonce: number }
const START: Block[] = [
  { data: "Genesis", nonce: 0 },
  { data: "Vansh learns Solidity", nonce: 0 },
  { data: "Vansh learns Rust", nonce: 0 },
];

/* find a nonce so the hash starts with "00" (proof of work, tiny edition) */
function mine(prev: string, data: string) {
  let n = 0;
  while (!hash(prev + data + n).startsWith("00") && n < 200000) n++;
  return n;
}

function build(blocks: Block[]) {
  const out: { data: string; nonce: number; prev: string; hash: string; valid: boolean }[] = [];
  let prev = "00000000";
  let chainOk = true;
  blocks.forEach((b) => {
    const h = hash(prev + b.data + b.nonce);
    const valid = chainOk && h.startsWith("00");
    if (!valid) chainOk = false;
    out.push({ ...b, prev, hash: h, valid });
    prev = h;
  });
  return out;
}

const minedStart = (() => {
  let prev = "00000000";
  return START.map((b) => {
    const nonce = mine(prev, b.data);
    prev = hash(prev + b.data + nonce);
    return { ...b, nonce };
  });
})();

export function BlockToy() {
  const [blocks, setBlocks] = useState<Block[]>(minedStart);
  const [mining, setMining] = useState(false);
  const chain = build(blocks);
  const broken = chain.some((b) => !b.valid);

  const tamper = () => {
    if (!chain[1].data.includes("edited")) act("tamper");
    setBlocks((b) => b.map((x, i) => (i === 1 ? { ...x, data: x.data === "Vansh learns Solidity" ? "Vansh learns Solidity (edited!)" : "Vansh learns Solidity" } : x)));
  };

  const remine = () => {
    setMining(true);
    window.setTimeout(() => {
      setBlocks((bs) => {
        let prev = "00000000";
        return bs.map((b) => {
          const nonce = mine(prev, b.data);
          prev = hash(prev + b.data + nonce);
          return { ...b, nonce };
        });
      });
      setMining(false);
    }, 650);
  };

  return (
    <div className="chain">
      <div className="chain__blocks">
        {chain.map((b, i) => (
          <div key={i} className={`block${b.valid ? "" : " is-bad"}${mining ? " is-mining" : ""}`}>
            <p className="block__n mono">Block {i}</p>
            <p className="block__data">{b.data}</p>
            <dl className="block__meta mono">
              <div><dt>prev</dt><dd>{b.prev}</dd></div>
              <div><dt>nonce</dt><dd>{b.nonce}</dd></div>
              <div><dt>hash</dt><dd className="block__hash">{b.hash}</dd></div>
            </dl>
            {i < chain.length - 1 && <span className="block__link" aria-hidden="true" />}
          </div>
        ))}
      </div>
      <div className="chain__actions">
        <button type="button" className="btn btn--ghost btn--sm" onClick={tamper} disabled={mining}>
          {chain[1].data.includes("edited") ? "Undo the edit" : "Tamper with block 1"}
        </button>
        <button type="button" className="btn btn--primary btn--sm" onClick={remine} disabled={!broken || mining}>
          {mining ? "Mining…" : "Re-mine the chain"}
        </button>
        <span className={`chain__status mono${broken ? " is-bad" : ""}`} role="status">
          {broken ? "✕ chain broken: every block after the edit is invalid" : "✓ chain valid: every hash starts with 00"}
        </span>
      </div>
      <p className="chain__note">A learning toy: real chains use SHA-256 and far harder proof of work.</p>
    </div>
  );
}

/* ── Contact: write your request, then "deploy" it to your email app ── */
const STAGES = ["lint", "test", "build", "deploy"] as const;

export function ComposeRequest() {
  const [name, setName] = useState("");
  const [idea, setIdea] = useState("");
  const [stage, setStage] = useState(-1); // -1 idle, 0..3 running, 4 done
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const body = JSON.stringify({ from: name || "you", building: idea || "something crazy", reply: "please" }, null, 2);
  const running = stage >= 0 && stage < STAGES.length;
  const done = stage === STAGES.length;

  const note = (i: number) => {
    if (i === 0) {
      if (!idea.trim()) return "idea is empty, sending a short hello";
      return name.trim() ? "name and idea look good" : "idea looks good, signing as \"you\"";
    }
    if (i === 1) return "1 passed: a human will read this";
    if (i === 2) return "email drafted with your idea";
    return "handed to your email app";
  };

  const send = (e: FormEvent) => {
    e.preventDefault();
    if (running) return;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setStage(0);
    STAGES.forEach((_, i) => {
      timers.current.push(window.setTimeout(() => {
        setStage(i + 1);
        if (i === STAGES.length - 1) {
          const subject = encodeURIComponent(`Let's build: ${idea.slice(0, 60) || "an idea"}`);
          const text = encodeURIComponent(`Hi Vansh,\n\n${idea || "I'd like to talk about a project."}\n\n${name ? `- ${name}` : ""}`);
          window.location.href = `mailto:${profile.email}?subject=${subject}&body=${text}`;
          act("sent");
        }
      }, 520 * (i + 1)));
    });
  };

  return (
    <form className="compose" onSubmit={send}>
      <div className="compose__fields">
        <label className="field">Your name
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} placeholder="e.g. Priya from Acme" autoComplete="name" />
        </label>
        <label className="field">What are you building?
          <input value={idea} onChange={(e) => setIdea(e.target.value)} maxLength={140} placeholder="e.g. a booking platform for clinics" />
        </label>
        <button type="submit" className="btn btn--primary" data-magnetic disabled={running}>
          {running ? "Deploying…" : done ? "Send again" : "Send request"}
        </button>
        <p className="compose__note">Opens your email app with this message ready. Nothing is stored here.</p>
      </div>
      <pre className="compose__req mono" aria-label="Your request, as JSON">
        <span className="compose__line"><b>POST</b> /collaborate <i>HTTP/1.1</i></span>
        {"\n"}<span className="compose__dim">to: {profile.email}</span>
        {"\n\n"}{body}
        {stage >= 0 && (
          <span className="compose__pipe" role="status">
            {"\n\n"}<span className="compose__dim">$ deploy request</span>
            {STAGES.map((s, i) => i <= stage && (
              <span key={s} className={`compose__stage${i < stage ? " is-done" : " is-run"}`}>
                {"\n"}<i>{i < stage ? "✓" : "◌"}</i> {s.padEnd(7)}<em>{i < stage ? note(i) : "running…"}</em>
              </span>
            ))}
          </span>
        )}
        {"\n\n"}<span className={`compose__res${done ? " is-ok" : ""}`}>
          {done ? "← 200 OK · press send in your email app" : running ? "← deploying…" : "← waiting to send"}
        </span>
      </pre>
    </form>
  );
}
