"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/content/site";

/* ── a tiny event bus: components report what the visitor did ── */
export type Act = "tamper" | "xray" | "theme" | "sent" | "sketch";
export const act = (type: Act) => window.dispatchEvent(new CustomEvent<Act>("vd:act", { detail: type }));

function fnv(s: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16).padStart(8, "0").slice(0, 7);
}

/* ─────────────────────────────────────────────────────────────
   Your visit, as a git commit: built live from what you read and did.
   ───────────────────────────────────────────────────────────── */
export function VisitCommit() {
  const [start, setStart] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [paths, setPaths] = useState<string[]>([]);
  const [acts, setActs] = useState<Record<Act, number>>({ tamper: 0, xray: 0, theme: 0, sent: 0, sketch: 0 });
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
  if (acts.theme) parts.push("switched themes");
  if (acts.sketch) parts.push("sketched a system");
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
