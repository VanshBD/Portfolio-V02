"use client";

import { useEffect, useRef, useState } from "react";
import { duckStories, profile } from "@/content/site";

/* ── a tiny event bus: components report what the visitor did ── */
export type Act = "tamper" | "xray" | "duck" | "theme" | "sent";
export const act = (type: Act) => window.dispatchEvent(new CustomEvent<Act>("vd:act", { detail: type }));

function fnv(s: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16).padStart(8, "0").slice(0, 7);
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
