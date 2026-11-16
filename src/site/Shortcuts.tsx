"use client";

import { useEffect, useRef, useState } from "react";
import { scrollToTarget } from "./Motion";

/*
  Keyboard shortcuts for people who like driving with the keyboard.
  "?" opens the list. Typing in a field never triggers anything.
*/

const KEYS: { k: string; label: string }[] = [
  { k: "J", label: "Next section" },
  { k: "K", label: "Previous section" },
  { k: "H", label: "Back to the top" },
  { k: "W", label: "The work" },
  { k: "S", label: "Sketch your system" },
  { k: "C", label: "Contact" },
  { k: "T", label: "Switch theme" },
  { k: "X", label: "X-ray: see how the page is built" },
  { k: "R", label: "Open the résumé" },
  { k: "?", label: "Show or hide this list" },
];

const sections = () => Array.from(document.querySelectorAll<HTMLElement>("main > section[data-path]"));
const nameOf = (el: HTMLElement) =>
  el.querySelector(".eyebrow")?.textContent?.split("·")[0].trim() || el.dataset.path || "section";

export function Shortcuts() {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<{ key: string; text: string; n: number } | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const toastTimer = useRef(0);

  useEffect(() => {
    const say = (key: string, text: string) => {
      clearTimeout(toastTimer.current);
      setToast((t) => ({ key, text, n: (t?.n ?? 0) + 1 }));
      toastTimer.current = window.setTimeout(() => setToast(null), 1400);
    };
    const go = (el: Element | null, key: string, text?: string) => {
      if (!el) return;
      scrollToTarget(el as HTMLElement);
      say(key, text ?? nameOf(el as HTMLElement));
    };
    const step = (dir: 1 | -1, key: string) => {
      const list = sections();
      const y = 140;
      const idx = list.reduce((cur, s, i) => (s.getBoundingClientRect().top <= y ? i : cur), 0);
      const next = list[Math.max(0, Math.min(list.length - 1, idx + dir))];
      go(next, key);
    };

    const onKey = (e: KeyboardEvent) => {
      const t = e.target instanceof Element ? e.target : null;
      if (e.ctrlKey || e.metaKey || e.altKey || t?.closest("input, textarea, select, [contenteditable='true']")) return;
      if (e.key === "?") { e.preventDefault(); setOpen((o) => !o); return; }
      if (e.key === "Escape") { setOpen(false); return; }
      if (document.documentElement.dataset.xray === "on" && e.key.toLowerCase() !== "x") return;
      switch (e.key.toLowerCase()) {
        case "j": step(1, "J"); break;
        case "k": step(-1, "K"); break;
        case "h": scrollToTarget(0); say("H", "Top"); break;
        case "w": go(document.querySelector("#work"), "W", "The work"); break;
        case "s": go(document.querySelector("#sketch"), "S", "Sketch your system"); break;
        case "c": go(document.querySelector("#contact"), "C", "Contact"); break;
        case "t": (document.querySelector(".topbar .icon-btn[aria-label^='Switch to']") as HTMLButtonElement | null)?.click(); say("T", "Theme switched"); break;
        case "r": say("R", "Opening the résumé"); window.location.href = "/resume"; break;
        default: return;
      }
      setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); clearTimeout(toastTimer.current); };
  }, []);

  /* move focus into the panel while it's open, and back afterwards */
  useEffect(() => {
    if (open) {
      lastFocus.current = document.activeElement as HTMLElement | null;
      closeBtn.current?.focus();
    } else {
      lastFocus.current?.focus?.();
    }
  }, [open]);

  return (
    <>
      {open && (
        <div className="keys" role="dialog" aria-modal="true" aria-label="Keyboard shortcuts" onClick={() => setOpen(false)}>
          <div className="keys__panel" onClick={(e) => e.stopPropagation()}>
            <div className="keys__head">
              <p className="keys__title">Keyboard shortcuts</p>
              <button ref={closeBtn} type="button" className="keys__close mono" onClick={() => setOpen(false)}>esc</button>
            </div>
            <ul className="keys__list">
              {KEYS.map((s, i) => (
                <li key={s.k} style={{ animationDelay: `${i * 30}ms` }}>
                  <kbd className="keys__cap mono">{s.k}</kbd><span>{s.label}</span>
                </li>
              ))}
            </ul>
            <p className="keys__foot mono">Shortcuts pause while you type in a field.</p>
          </div>
        </div>
      )}
      {toast && (
        <div key={toast.n} className="keys-toast mono" role="status">
          <kbd className="keys__cap">{toast.key}</kbd>{toast.text}
        </div>
      )}
    </>
  );
}
