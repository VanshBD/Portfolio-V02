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

/* minutes of overlap between two daily windows given in UTC minutes */
function overlap(a1: number, a2: number, b1: number, b2: number) {
  let total = 0;
  for (const k of [-DAY, 0, DAY]) total += Math.max(0, Math.min(a2, b2 + k) - Math.max(a1, b1 + k));
  return total;
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

function Sky({ min }: { min: number }) {
  const h = min / 60;
  const phase = h >= 6 && h < 8 ? "dawn" : h >= 8 && h < 17.5 ? "day" : h >= 17.5 && h < 19.5 ? "dusk" : "night";
  const sunUp = h >= 6 && h < 19;
  const t = sunUp ? (min - 360) / 780 : mod(min - 1140) / 660;
  const x = 12 + t * 136, y = 72 - Math.sin(t * Math.PI) * 54;
  const lit = phase === "night" || phase === "dusk";
  return (
    <svg viewBox="0 0 160 96" className={`desk__sky is-${phase}`} aria-hidden="true">
      <defs>
        <linearGradient id="desk-sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" className="desk__sky-top" />
          <stop offset="1" className="desk__sky-bottom" />
        </linearGradient>
      </defs>
      <rect width="160" height="96" rx="12" fill="url(#desk-sky)" />
      {phase === "night" && [[18, 14], [44, 26], [70, 10], [96, 22], [128, 14], [146, 32], [30, 40], [112, 40]].map(([sx, sy], i) => (
        <circle key={i} cx={sx} cy={sy} r={i % 3 ? 0.9 : 1.3} className="desk__star" style={{ animationDelay: `${i * 0.37}s` }} />
      ))}
      {sunUp ? (
        <g transform={`translate(${x} ${y})`}><circle r="11" className="desk__sun-glow" /><circle r="6.5" className="desk__sun" /></g>
      ) : (
        <g transform={`translate(${x} ${y})`}><circle r="6.5" className="desk__moon" /><circle r="6.5" cx="3" cy="-2" className="desk__moon-cut" /></g>
      )}
      {/* a small skyline; windows light up after dark */}
      <g className="desk__city">
        <rect x="6" y="66" width="18" height="30" /><rect x="26" y="56" width="14" height="40" /><rect x="42" y="72" width="20" height="24" />
        <rect x="64" y="50" width="12" height="46" /><rect x="78" y="62" width="22" height="34" /><rect x="102" y="70" width="14" height="26" />
        <rect x="118" y="58" width="18" height="38" /><rect x="138" y="68" width="16" height="28" />
      </g>
      {lit && (
        <g className="desk__windows">
          {[[10, 72], [16, 80], [29, 62], [33, 74], [67, 56], [67, 70], [82, 68], [92, 76], [122, 64], [128, 76], [142, 74]].map(([wx, wy], i) => (
            <rect key={i} x={wx} y={wy} width="3" height="3" style={{ animationDelay: `${i * 0.6}s` }} />
          ))}
        </g>
      )}
    </svg>
  );
}

export function Desk() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const t0 = window.setTimeout(() => setNow(Date.now()), 0);
    const iv = window.setInterval(() => setNow(Date.now()), 1000);
    return () => { clearTimeout(t0); clearInterval(iv); };
  }, []);

  if (now === null) return <div className="desk desk--loading" aria-hidden="true" />;

  const d = new Date(now);
  const utcMin = d.getUTCHours() * 60 + d.getUTCMinutes();
  const vanshMin = mod(utcMin + desk.utcOffsetMin);
  const visitorOff = -d.getTimezoneOffset();
  const visitorMin = mod(utcMin + visitorOff);
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
  const visitorCity = tz.split("/").pop()?.replace(/_/g, " ") || "your city";
  const same = visitorOff === desk.utcOffsetMin;
  const time = (zone?: string) => new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: zone }).format(d);

  /* Vansh's core hours and the visitor's 9 to 6, both in UTC minutes */
  const len = (desk.endHour - desk.startHour) * 60;
  const vStart = desk.startHour * 60 - desk.utcOffsetMin;
  const yStart = 9 * 60 - visitorOff;
  const shared = overlap(vStart, vStart + len, yStart, yStart + 540);
  const st = status(vanshMin);
  const working = st.tone === "work";

  /* the bar is the visitor's local day, midnight to midnight */
  const vanshLocal = segments(vStart + visitorOff, len);
  const bar = (m: number) => (m / DAY) * 100;
  const hourLabel = (h: number) => `${((h + 11) % 12) + 1} ${h < 12 ? "am" : "pm"}`;

  return (
    <div className="desk" data-spotlight>
      <Sky min={vanshMin} />
      <div className="desk__info">
        <p className="desk__where mono">{desk.city} · {time(desk.timeZone)} IST</p>
        <p className={`desk__status is-${st.tone}`}><i aria-hidden="true" />{st.text}</p>
        <p className="desk__overlap">
          {same
            ? <>You&rsquo;re on Indian time too, so our days line up completely.</>
            : shared > 0
              ? <>You&rsquo;re in <b>{visitorCity}</b> ({time()}). Your 9 to 6 overlaps <b>{fmtHours(shared)}</b> with my core hours.</>
              : <>You&rsquo;re in <b>{visitorCity}</b> ({time()}). Our 9 to 6 days don&rsquo;t overlap, so I shift my hours for calls.</>}
        </p>
        <div className="desk__bar" role="img" aria-label={`Your day, with Vansh's core hours (${hourLabel(desk.startHour)} to ${hourLabel(desk.endHour)} IST) and your 9 to 6 marked`}>
          <span className="desk__you" style={{ left: `${bar(540)}%`, width: `${bar(540)}%` }} />
          {vanshLocal.map(([s, l], i) => <span key={i} className="desk__vansh" style={{ left: `${bar(s)}%`, width: `${bar(l)}%` }} />)}
          <span className="desk__now" style={{ left: `${bar(visitorMin)}%` }} />
        </div>
        <p className="desk__legend mono">
          <span><i className="is-you" />your 9 to 6</span>
          <span><i className="is-vansh" />my {hourLabel(desk.startHour)} to {hourLabel(desk.endHour)} IST</span>
          {working && <span className="desk__online">● online hours now</span>}
        </p>
      </div>
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
