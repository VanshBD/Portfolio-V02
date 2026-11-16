"use client";

import { useEffect, useRef, useState } from "react";
import { scrollToTarget } from "./Motion";

interface Entry { path: string; el: HTMLElement; at: number; dwell?: number }

const fmt = (ms: number) => (ms < 10000 ? `${(ms / 1000).toFixed(1)}s` : `${Math.round(ms / 1000)}s`);

/*
  The visitor's own journey, logged like a network tab: every section they
  reach becomes a request, with the real time they spent there. Click an
  entry to jump back. Reaching the contact section returns 200 OK.
*/
export function RequestLog() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [open, setOpen] = useState(true);
  const [now, setNow] = useState(0);
  const current = useRef<string>("");

  useEffect(() => {
    const t = window.setTimeout(() => setOpen(window.innerWidth >= 1100), 0);
    const io = new IntersectionObserver(
      (list) => list.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target as HTMLElement;
        const path = el.dataset.path ?? "/";
        if (path === current.current) return;
        current.current = path;
        const at = performance.now();
        setEntries((prev) => {
          const done = prev.length ? [{ ...prev[0], dwell: at - prev[0].at }, ...prev.slice(1)] : prev;
          return [{ path, el, at }, ...done].slice(0, 4);
        });
      }),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    document.querySelectorAll<HTMLElement>("[data-path]").forEach((s) => io.observe(s));
    const tick = window.setInterval(() => setNow(performance.now()), 500);
    /* fold into the pill at the footer, so the visit commit there stays readable */
    const foot = document.querySelector(".footer");
    const fio = new IntersectionObserver(([e]) => { if (e.isIntersecting) setOpen(false); }, { threshold: 0.2 });
    if (foot) fio.observe(foot);
    return () => { clearTimeout(t); io.disconnect(); fio.disconnect(); clearInterval(tick); };
  }, []);

  const head = entries[0];
  const ok = head?.path === "/contact";

  return (
    <aside className={`rlog${open ? " is-open" : ""}${ok ? " is-ok" : ""}`} aria-label="Your visit, as a request log">
      <button type="button" className="rlog__head" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className={`rlog__led${ok ? " is-ok" : ""}`} aria-hidden="true" />
        <span className="mono rlog__title">{open ? "request log · your visit" : `GET ${head?.path ?? "/"}`}</span>
        <span className="mono rlog__code">{ok ? "200 OK" : "200"}</span>
        <span className="rlog__chev" aria-hidden="true">{open ? "–" : "+"}</span>
      </button>
      {open && (
        <ol className="rlog__list mono">
          {entries.map((e, i) => (
            <li key={`${e.path}-${e.at}`} className={i === 0 ? "is-live" : ""}>
              <button type="button" onClick={() => scrollToTarget(e.el)} title={`Jump back to ${e.path}`}>
                <span className="rlog__m">GET</span>
                <span className="rlog__p">{e.path}</span>
                <span className="rlog__s">200</span>
                <span className="rlog__t">{i === 0 ? fmt(Math.max(0, now - e.at)) : fmt(e.dwell ?? 0)}</span>
              </button>
            </li>
          ))}
          {!entries.length && <li className="rlog__empty">waiting for your first request…</li>}
        </ol>
      )}
      {open && <p className="rlog__foot mono">{ok ? "Response complete. Thanks for reading." : "time = how long you spent there · click to jump back"}</p>}
    </aside>
  );
}
