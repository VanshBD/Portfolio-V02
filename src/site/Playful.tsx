"use client";

import { useEffect, useRef, useState } from "react";
import { desk, duckStories, profile } from "@/content/site";

/* ── a tiny event bus: components report what the visitor did ── */
export type Act = "tamper" | "xray" | "duck" | "theme" | "sent";
export const act = (type: Act) => window.dispatchEvent(new CustomEvent<Act>("vd:act", { detail: type }));

function fnv(s: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16).padStart(8, "0").slice(0, 7);
}

/* ─────────────────────────────────────────────────────────────
   Vansh's desk, right now: local time in Ahmedabad, a sky that
   follows the hour, a probable status, and how the visitor's own
   working day overlaps with Vansh's core hours.
   ───────────────────────────────────────────────────────────── */
const DAY = 1440;
const mod = (n: number) => ((n % DAY) + DAY) % DAY;

function status(min: number) {
  const h = min / 60;
  if (h >= 23 || h < 1) return { text: "late-night debugging, probably", tone: "late" };
  if (h < 8) return { text: "asleep · back around 9 am", tone: "sleep" };
  if (h < desk.startHour) return { text: "starting the day, planning what to ship", tone: "late" };
  if (h < 13) return { text: "deep in a backend, probably", tone: "work" };
  if (h < 14) return { text: "on a lunch break", tone: "late" };
  if (h < desk.endHour) return { text: "shipping code, probably", tone: "work" };
  return { text: "learning Rust and Solidity, probably", tone: "late" };
}

/* a daily window [start, start+len) in a 0..1440 frame, split if it wraps */
function segments(start: number, len: number) {
  const s = mod(start);
  return s + len <= DAY ? [[s, len]] : [[s, DAY - s], [0, s + len - DAY]];
}

const fmtHours = (m: number) => {
  const h = Math.floor(m / 60), r = m % 60;
  return h && r ? `${h}h ${r}m` : h ? `${h} hour${h === 1 ? "" : "s"}` : `${r} min`;
};

/* a seeded skyline, so it looks the same on every render */
const SKYLINE = (() => {
  const out: { x: number; w: number; h: number; win: [number, number][] }[] = [];
  let seed = 7, x = 0;
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  while (x < 1000) {
    const w = 24 + Math.round(rnd() * 36), h = 12 + Math.round(rnd() * 34);
    const win: [number, number][] = [];
    for (let wy = 120 - h + 8; wy < 112; wy += 11) for (let wx = x + 6; wx < x + w - 8; wx += 10) if (rnd() > 0.55) win.push([wx, wy]);
    out.push({ x, w, h, win });
    x += w + 2 + Math.round(rnd() * 6);
  }
  return out;
})();

/* a wide band of sky over Ahmedabad: the sun or moon crosses it with the hour */
function Sky({ min }: { min: number }) {
  const h = min / 60;
  const phase = h >= 6 && h < 8 ? "dawn" : h >= 8 && h < 17.5 ? "day" : h >= 17.5 && h < 19.5 ? "dusk" : "night";
  const sunUp = h >= 6 && h < 19;
  const t = sunUp ? (min - 360) / 780 : mod(min - 1140) / 660;
  const x = 40 + t * 920, y = 100 - Math.sin(t * Math.PI) * 66;
  const lit = phase === "night" || phase === "dusk";
  return (
    <svg viewBox="0 0 1000 120" preserveAspectRatio="xMidYMax slice" className={`desk__sky is-${phase}`} aria-hidden="true">
      <defs>
        <linearGradient id="desk-sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" className="desk__sky-top" />
          <stop offset="1" className="desk__sky-bottom" />
        </linearGradient>
      </defs>
      <rect width="1000" height="120" fill="url(#desk-sky)" />
      {phase === "night" && Array.from({ length: 34 }, (_, i) => (
        <circle key={i} cx={(i * 211) % 1000} cy={8 + ((i * 37) % 60)} r={i % 4 ? 0.9 : 1.6} className="desk__star" style={{ animationDelay: `${(i % 7) * 0.4}s` }} />
      ))}
      <path d={`M40 100 Q 500 ${100 - 132} 960 100`} className="desk__arc" />
      {sunUp ? (
        <g transform={`translate(${x} ${y})`}><circle r="22" className="desk__sun-glow" /><circle r="11" className="desk__sun" /></g>
      ) : (
        <g transform={`translate(${x} ${y})`}><circle r="10" className="desk__moon" /><circle r="10" cx="5" cy="-3" className="desk__moon-cut" /></g>
      )}
      <g className="desk__city">{SKYLINE.map((b) => <rect key={b.x} x={b.x} y={120 - b.h} width={b.w} height={b.h} />)}</g>
      {lit && (
        <g className="desk__windows">
          {SKYLINE.flatMap((b) => b.win).map(([wx, wy], i) => (
            <rect key={i} x={wx} y={wy} width="4" height="4" style={{ animationDelay: `${(i % 9) * 0.7}s` }} />
          ))}
        </g>
      )}
    </svg>
  );
}

function clock(d: Date, timeZone?: string) {
  const parts = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: true, timeZone }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return { h: get("hour"), m: get("minute"), ap: get("dayPeriod").toLowerCase() };
}

function visitorStatus(min: number) {
  const h = min / 60;
  if (h < 6) return "your night";
  if (h < 9) return "your morning";
  if (h < 18) return "your working day";
  if (h < 22) return "your evening";
  return "your night";
}

/* split [start, start+len) on a 24 h circle into one or two pieces */
const pieces = (start: number, len: number) => segments(start, len).map(([s, l]) => ({ s, l }));
function intersect(a: { s: number; l: number }[], b: { s: number; l: number }[]) {
  const out: { s: number; l: number }[] = [];
  a.forEach((x) => b.forEach((y) => {
    const s = Math.max(x.s, y.s), e = Math.min(x.s + x.l, y.s + y.l);
    if (e > s) out.push({ s, l: e - s });
  }));
  return out;
}

export function Desk() {
  const [now, setNow] = useState<number | null>(null);
  const [seen, setSeen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t0 = window.setTimeout(() => setNow(Date.now()), 0);
    const iv = window.setInterval(() => setNow(Date.now()), 1000);
    return () => { clearTimeout(t0); clearInterval(iv); };
  }, []);

  /* the timeline bars grow in the first time the card is seen */
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, [now, seen]);

  if (now === null) return <div className="desk desk--loading" aria-hidden="true" />;

  const d = new Date(now);
  const utcMin = d.getUTCHours() * 60 + d.getUTCMinutes();
  const vanshMin = mod(utcMin + desk.utcOffsetMin);
  const off = -d.getTimezoneOffset();
  const youMin = mod(utcMin + off);
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
  const city = tz.split("/").pop()?.replace(/_/g, " ") || "Your city";
  const same = off === desk.utcOffsetMin;

  /* everything on the timeline is in the visitor's own local time */
  const len = (desk.endHour - desk.startHour) * 60;
  const vansh = pieces(desk.startHour * 60 - desk.utcOffsetMin + off, len);
  const you = [{ s: 540, l: 540 }];
  const both = intersect(vansh, you);
  const shared = both.reduce((n, p) => n + p.l, 0);
  const st = status(vanshMin);
  const v = clock(d, desk.timeZone), y = clock(d);
  const pct = (m: number) => `${(m / DAY) * 100}%`;
  const hourLabel = (h: number) => `${((h + 11) % 12) + 1} ${h < 12 ? "am" : "pm"}`;

  return (
    <div ref={ref} className={`desk${seen ? " is-in" : ""}`}>
      <div className="desk__band">
        <Sky min={vanshMin} />
        <span className="desk__band-label mono">sky over {desk.city}, live</span>
      </div>

      <div className="desk__clocks">
        <div className="desk__clock">
          <p className="desk__who mono">{desk.city} · Vansh</p>
          <p className="desk__time">{v.h}<span className="desk__colon">:</span>{v.m}<small>{v.ap}</small></p>
          <p className={`desk__status is-${st.tone}`}><i aria-hidden="true" />{st.text}</p>
        </div>
        <div className="desk__shared">
          <b>{shared ? fmtHours(shared) : "No overlap"}</b>
          <span>{same ? "same time zone" : shared ? "of shared working time" : "I shift my hours for calls"}</span>
        </div>
        <div className="desk__clock desk__clock--you">
          <p className="desk__who mono">{same ? "You · also on IST" : `${city} · you`}</p>
          <p className="desk__time">{y.h}<span className="desk__colon">:</span>{y.m}<small>{y.ap}</small></p>
          <p className="desk__status is-you"><i aria-hidden="true" />{visitorStatus(youMin)}</p>
        </div>
      </div>

      <div className="desk__timeline" role="img" aria-label={`Timeline in your local time: Vansh works ${hourLabel(desk.startHour)} to ${hourLabel(desk.endHour)} IST, you work 9 to 6, overlapping ${shared ? fmtHours(shared) : "not at all"}.`}>
        <div className="desk__rows">
          <span className="desk__label mono">Vansh</span>
          <div className="desk__track">{vansh.map((p, i) => <span key={i} className="desk__seg is-vansh" style={{ left: pct(p.s), width: pct(p.l) }} />)}</div>
          <span className="desk__label mono">You</span>
          <div className="desk__track">{you.map((p, i) => <span key={i} className="desk__seg is-you" style={{ left: pct(p.s), width: pct(p.l) }} />)}</div>
          <span />
          <div className="desk__ticks mono">
            {[0, 6, 12, 18, 24].map((h) => <span key={h} style={{ left: pct(h * 60) }}>{hourLabel(h % 24)}</span>)}
          </div>
          <div className="desk__overlay" aria-hidden="true">
            {both.map((p, i) => <span key={i} className="desk__both" style={{ left: pct(p.s), width: pct(p.l) }} />)}
            <span className="desk__now" style={{ left: pct(youMin) }}><em className="mono">now</em></span>
          </div>
        </div>
      </div>

      <p className="desk__note">
        In your local time. My core hours are {hourLabel(desk.startHour)} to {hourLabel(desk.endHour)} IST
        {shared ? "." : ", so I move my day to meet yours."}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Rubber duck: click it and it quacks one of the real bugs back.
   ───────────────────────────────────────────────────────────── */
export function Duck() {
  const [i, setI] = useState(-1);
  const [quack, setQuack] = useState(0);
  const story = i >= 0 ? duckStories[i % duckStories.length] : null;

  const talk = () => {
    setI((n) => n + 1);
    setQuack((q) => q + 1);
    act("duck");
  };

  return (
    <div className="duck">
      {story && (
        <div key={i} className="duck__bubble" role="status">
          <p className="duck__title mono">quack #{(i % duckStories.length) + 1} · {story.title} <span>({story.where})</span></p>
          <p><b>Bug:</b> {story.bug}</p>
          <p><b>Fix:</b> {story.fix}</p>
          <button type="button" className="duck__close" onClick={() => setI(-1)} aria-label="Close the duck's story">×</button>
        </div>
      )}
      <button type="button" className="duck__btn" onClick={talk} aria-label="Rubber duck: hear a real debugging story" data-cursor="quack">
        <svg key={quack} viewBox="0 0 64 56" width="46" height="40" aria-hidden="true" className={quack ? "is-quack" : ""}>
          <ellipse cx="30" cy="38" rx="24" ry="14" className="duck__body" />
          <circle cx="42" cy="20" r="12" className="duck__body" />
          <path d="M52 21 L63 24 L52 27 Z" className="duck__beak" />
          <circle cx="45" cy="17" r="2" className="duck__eye" />
          <path d="M14 34 Q24 30 30 38" className="duck__wing" />
        </svg>
        <span className="duck__hint mono">{story ? "next bug" : "ask the duck"}</span>
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Your visit, as a git commit: built live from what you read and did.
   ───────────────────────────────────────────────────────────── */
export function VisitCommit() {
  const [start, setStart] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [paths, setPaths] = useState<string[]>([]);
  const [acts, setActs] = useState<Record<Act, number>>({ tamper: 0, xray: 0, duck: 0, theme: 0, sent: 0 });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const t0 = window.setTimeout(() => { setStart(Date.now()); setNow(Date.now()); }, 0);
    const iv = window.setInterval(() => setNow(Date.now()), 1000);
    const onAct = (e: Event) => {
      const type = (e as CustomEvent<Act>).detail;
      setActs((a) => ({ ...a, [type]: a[type] + 1 }));
    };
    window.addEventListener("vd:act", onAct);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        const p = (en.target as HTMLElement).dataset.path;
        if (en.isIntersecting && p) setPaths((ps) => (ps.includes(p) ? ps : [...ps, p]));
      }),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    document.querySelectorAll("[data-path]").forEach((s) => io.observe(s));
    return () => { clearTimeout(t0); clearInterval(iv); window.removeEventListener("vd:act", onAct); io.disconnect(); };
  }, []);

  if (start === null) return <p className="commit mono" aria-hidden="true">&nbsp;</p>;

  const cases = paths.filter((p) => /^\/work\/(?!more)/.test(p)).length;
  const parts: string[] = [];
  if (cases) parts.push(`read ${cases} case stud${cases === 1 ? "y" : "ies"}`);
  if (acts.xray) parts.push("opened X-ray");
  if (acts.tamper) parts.push(`broke the chain${acts.tamper > 1 ? ` ${acts.tamper}×` : ""}`);
  if (acts.duck) parts.push(`asked the duck${acts.duck > 1 ? ` ${acts.duck}×` : ""}`);
  if (acts.theme) parts.push("switched themes");
  if (acts.sent) parts.push("sent a request");
  const type = acts.sent ? "feat" : parts.length ? "docs" : "chore";
  const msg = `${type}(visitor): ${parts.length ? parts.join(", ") : "just looking around"}`;
  const secs = Math.max(0, Math.round((now - start) / 1000));
  const dur = secs >= 60 ? `${Math.floor(secs / 60)}m ${secs % 60}s` : `${secs}s`;
  const hash = fnv(`${start}${msg}`);

  const copy = async () => {
    try { await navigator.clipboard.writeText(`git commit -m "${msg}"`); setCopied(true); window.setTimeout(() => setCopied(false), 1600); }
    catch { /* clipboard blocked */ }
  };

  return (
    <div className="commit mono">
      <p className="commit__label">your visit, as a commit</p>
      <p className="commit__cmd"><span>$</span> git commit -m &quot;<b key={msg}>{msg}</b>&quot;</p>
      <p className="commit__out">[main {hash}] 1 visitor · {paths.length} section{paths.length === 1 ? "" : "s"} · {dur}</p>
      <button type="button" className="commit__copy" onClick={copy}>{copied ? "copied ✓" : "copy"}</button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   A hello for anyone who opens the browser console.
   ───────────────────────────────────────────────────────────── */
let greeted = false;
export function ConsoleHello() {
  const done = useRef(false);
  useEffect(() => {
    if (greeted || done.current) return;
    greeted = done.current = true;
    const art = [
      " __   __  ____  ",
      " \\ \\ / / |  _ \\ ",
      "  \\ V /  | | | |",
      "   \\_/   |____/ ",
    ].join("\n");
    console.log(`%c${art}`, "color:#ff6b3d;font:700 14px/1.1 monospace");
    console.log(
      "%cYou opened the console. You're my kind of person.%c\n\nLooking for a backend developer who reads the network tab too?\n→ %s\n→ %s\n\nTip: close this and press X on the page to see how it's built.",
      "color:#3ddc97;font:700 13px system-ui", "color:inherit;font:12px system-ui",
      profile.email, profile.github,
    );
  }, []);
  return null;
}
