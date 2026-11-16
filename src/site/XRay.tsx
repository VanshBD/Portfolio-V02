"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { achievements, cases, journey, principles, projectIndex, skillLayers, work } from "@/content/site";
import { scrollToTarget } from "./Motion";

/*
  X-ray mode: press X (or the scan button in the top bar) and the page shows
  how it's built. Every real component gets a blueprint box with its name,
  source file, where it renders, its data and what it does. Hover anything to
  inspect the component under the pointer. The HUD numbers are measured live
  in the visitor's browser; nothing here is made up.
*/

type Kind = "server" | "client" | "svg" | "canvas" | "fixed";
interface Spec {
  sel: string;
  level: 1 | 2;
  name: string | ((el: Element) => string);
  file: string;
  kind: Kind;
  data?: string;
  does: string;
}

const skillCount = skillLayers.reduce((n, l) => n + l.skills.length, 0);

const SPECS: Spec[] = [
  { sel: ".topbar", level: 2, name: "<TopBar />", file: "src/site/TopBar.tsx", kind: "client", does: "IntersectionObserver marks the section you're reading" },
  { sel: "#top", level: 1, name: "<Hero />", file: "src/site/Hero.tsx", kind: "client", data: "profile", does: "headline splits into words, then lifts away on scroll" },
  { sel: ".hero__net", level: 2, name: "<HeroNetwork />", file: "src/site/HeroNetwork.tsx", kind: "canvas", does: "2D canvas: nodes drift, your cursor pulls them, packets hop links" },
  { sel: ".marquee", level: 1, name: "<Marquee />", file: "src/site/Marquee.tsx", kind: "client", does: "rows skew with your scroll speed (Lenis velocity)" },
  { sel: "#how", level: 1, name: "<HowIBuild />", file: "src/site/Sections.tsx", kind: "server", data: `principles[${principles.length}]`, does: "rendered on the server; only the graphics hydrate" },
  { sel: ".how__graph", level: 2, name: "<HowGraphic />", file: "src/site/Interactive.tsx", kind: "svg", does: "draws itself once it's half in view" },
  { sel: ".check-pills, .how__checks", level: 2, name: "<CheckPills />", file: "src/site/CheckPills.tsx", kind: "client", does: "ticks each check in turn; replays on hover" },
  { sel: "#journey", level: 1, name: "<Journey />", file: "src/site/Journey.tsx", kind: "client", data: `journey[${journey.length}]`, does: "pinned; scroll moves HEAD through the commit graph" },
  { sel: ".gitlog", level: 2, name: "<GitLog />", file: "src/site/Journey.tsx", kind: "client", does: "re-renders only when HEAD reaches a new commit" },
  { sel: ".jgraph", level: 2, name: "<CommitGraph />", file: "src/site/Journey.tsx", kind: "svg", does: "a clipPath follows HEAD to colour the walked history" },
  { sel: "#work", level: 1, name: "<WorkIntro />", file: "src/app/page.tsx", kind: "server", data: `cases[${cases.length}]`, does: "static HTML, no JavaScript" },
  {
    sel: ".case", level: 1, file: "src/site/CaseStudy.tsx", kind: "client",
    name: (el) => `<CaseStudy id="${el.id.replace("case-", "")}" />`,
    data: "cases[i]", does: "pinned for its steps; the step comes from scroll progress",
  },
  { sel: ".diagram", level: 2, name: "<Diagram />", file: "src/site/Diagram.tsx", kind: "svg", does: "SVG animateMotion packets ride the active edges" },
  {
    sel: ".demo", level: 2, file: "src/site/Demos.tsx", kind: "client",
    name: (el) => (el.classList.contains("pilot-demo") ? "<PilotDemo />" : el.querySelector(".pravasa-demo") ? "<PravasaDemo />" : "<LaEuropaDemo />"),
    does: "state machine in your browser; nothing reaches a real server",
  },
  { sel: "#more", level: 1, name: "<WorkGrid />", file: "src/site/WorkGrid.tsx", kind: "client", data: `work[${work.length}]`, does: "cards tilt toward your pointer" },
  { sel: "#skills", level: 1, name: "<SkillsMap />", file: "src/site/SkillsMap.tsx", kind: "client", data: `${skillCount} skills × ${projectIndex.length} projects`, does: "wires are measured with getBoundingClientRect" },
  { sel: "#awards", level: 1, name: "<Achievements />", file: "src/site/Sections.tsx", kind: "server", data: `achievements[${achievements.length}]`, does: "server HTML; counters tick up when seen" },
  { sel: "#learning", level: 1, name: "<Learning />", file: "src/site/Sections.tsx", kind: "server", does: "server HTML around one client island" },
  { sel: ".chain", level: 2, name: "<BlockToy />", file: "src/site/Interactive.tsx", kind: "client", does: "FNV-1a hashes, proof of work mined in your browser" },
  { sel: "#contact", level: 1, name: "<Contact />", file: "src/site/Contact.tsx", kind: "client", does: "the closing section; email, links and the composer" },
  { sel: ".compose", level: 2, name: "<ComposeRequest />", file: "src/site/Interactive.tsx", kind: "client", does: "builds the JSON as you type; sends through mailto" },
  { sel: ".footer", level: 1, name: "<Footer />", file: "src/site/Sections.tsx", kind: "server", does: "static HTML" },
  { sel: ".rlog", level: 2, name: "<RequestLog />", file: "src/site/RequestLog.tsx", kind: "fixed", does: "logs each section you visit as a GET with real dwell time" },
];

interface Item { id: string; el: Element; level: 1 | 2; name: string; file: string; kind: Kind; data?: string; does: string; nodes: number }

function collect(): Item[] {
  const out: Item[] = [];
  SPECS.forEach((s, si) => {
    document.querySelectorAll(s.sel).forEach((el, k) => {
      if (el.closest(".xray, .xray-hud")) return;
      out.push({
        id: `${si}-${k}`, el, level: s.level, file: s.file, kind: s.kind, data: s.data, does: s.does,
        name: typeof s.name === "function" ? s.name(el) : s.name,
        nodes: el.getElementsByTagName("*").length,
      });
    });
  });
  return out;
}

const fmt = (n: number) => n.toLocaleString("en-US");
const SCAN_MS = 750;

export function XRay() {
  const [phase, setPhase] = useState<"off" | "in" | "on" | "out">("off");
  const [items, setItems] = useState<Item[]>([]);
  const boxes = useRef<(HTMLDivElement | null)[]>([]);
  const labels = useRef<(HTMLDivElement | null)[]>([]);
  const tree = useRef<(HTMLButtonElement | null)[]>([]);
  const hud = useRef<Record<string, HTMLElement | null>>({});
  const focus = useRef(-1);
  const timer = useRef(0);

  const announce = (on: boolean) => window.dispatchEvent(new CustomEvent("xray:change", { detail: on }));

  const open = useCallback(() => {
    clearTimeout(timer.current);
    setItems(collect());
    document.documentElement.dataset.xray = "on";
    setPhase("in");
    announce(true);
    timer.current = window.setTimeout(() => setPhase("on"), SCAN_MS);
  }, []);

  const close = useCallback(() => {
    clearTimeout(timer.current);
    setPhase("out");
    announce(false);
    timer.current = window.setTimeout(() => {
      delete document.documentElement.dataset.xray;
      setPhase("off");
      setItems([]);
    }, SCAN_MS);
  }, []);

  /* X toggles, Esc closes; the top bar button sends "xray:toggle" */
  useEffect(() => {
    const isOn = () => document.documentElement.dataset.xray === "on";
    const toggle = () => (isOn() ? close() : open());
    const onKey = (e: KeyboardEvent) => {
      const t = e.target instanceof Element ? e.target : null;
      if (e.ctrlKey || e.metaKey || e.altKey || t?.closest("input, textarea, select, [contenteditable='true']")) return;
      if (e.key === "x" || e.key === "X") { e.preventDefault(); toggle(); }
      else if (e.key === "Escape" && isOn()) close();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("xray:toggle", toggle);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("xray:toggle", toggle);
      clearTimeout(timer.current);
      delete document.documentElement.dataset.xray;
    };
  }, [open, close]);

  /* live loop: place every box on its element, keep section labels in view,
     follow the pointer for inspection, and measure frames per second */
  useEffect(() => {
    if (!items.length) return;
    let raf = 0, frames = 0, last = performance.now();
    let px = -1, py = -1;
    const onMove = (e: PointerEvent) => { px = e.clientX; py = e.clientY; };
    window.addEventListener("pointermove", onMove, { passive: true });

    /* web vitals from the browser's own performance timeline */
    let lcp = 0, cls = 0;
    const observers: PerformanceObserver[] = [];
    const watch = (type: string, fn: (e: PerformanceEntry) => void) => {
      try {
        const o = new PerformanceObserver((list) => list.getEntries().forEach(fn));
        o.observe({ type, buffered: true });
        observers.push(o);
      } catch { /* not supported in this browser */ }
    };
    watch("largest-contentful-paint", (e) => { lcp = e.startTime; });
    /* CLS the way browsers score it: the worst "session window" of shifts
       (each under 1 s apart, at most 5 s long), not the sum of every shift */
    let win = 0, winStart = 0, prev = 0;
    watch("layout-shift", (e) => {
      const s = e as PerformanceEntry & { value: number; hadRecentInput: boolean };
      if (s.hadRecentInput) return;
      if (win && s.startTime - prev < 1000 && s.startTime - winStart < 5000) win += s.value;
      else { win = s.value; winStart = s.startTime; }
      prev = s.startTime;
      cls = Math.max(cls, win);
    });

    const set = (k: string, v: string) => { const el = hud.current[k]; if (el && el.textContent !== v) el.textContent = v; };
    const page = () => {
      const res = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
      const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
      const bytes = res.reduce((n, r) => n + (r.transferSize || 0), nav?.transferSize ?? 0);
      set("lcp", lcp ? `${(lcp / 1000).toFixed(2)} s` : "n/a");
      set("cls", cls.toFixed(3));
      set("dom", fmt(document.getElementsByTagName("*").length));
      const kb = bytes / 1024;
      set("req", `${res.length + 1} · ${kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.round(kb)} KB`}`);
    };
    page();
    const slow = window.setInterval(page, 1000);

    const tick = () => {
      const vh = window.innerHeight, vw = window.innerWidth;
      /* read everything first, then write, so layout is computed once */
      const rects = items.map((it) => it.el.getBoundingClientRect());
      let hit = -1, hitArea = Infinity, current = -1;
      rects.forEach((r, i) => {
        if (px >= 0 && px >= r.left && px <= r.right && py >= r.top && py <= r.bottom) {
          const area = r.width * r.height;
          if (area < hitArea) { hit = i; hitArea = area; }
        }
        if (items[i].level === 1 && r.top <= vh * 0.45 && r.bottom >= vh * 0.45 && !items[i].el.matches(".topbar")) current = i;
      });

      rects.forEach((r, i) => {
        const box = boxes.current[i], label = labels.current[i];
        if (!box) return;
        const visible = r.bottom > 0 && r.top < vh && r.width > 0 && r.right > 0 && r.left < vw;
        box.style.display = visible ? "" : "none";
        if (!visible) return;
        box.style.transform = `translate3d(${r.left}px, ${r.top}px, 0)`;
        box.style.width = `${r.width}px`;
        box.style.height = `${r.height}px`;
        if (label) {
          if (r.height < 130) {
            /* short boxes: label sits outside, below or above */
            box.dataset.place = r.bottom + 70 > vh ? "above" : "below";
            label.style.transform = "";
          } else {
            box.dataset.place = "inside";
            const lh = label.offsetHeight;
            const y = Math.min(Math.max((vw <= 700 ? 112 : 84) - r.top, 0), Math.max(0, r.height - lh - 10));
            label.style.transform = `translate3d(0, ${y}px, 0)`;
          }
        }
      });

      if (hit !== focus.current) {
        boxes.current[focus.current]?.classList.remove("is-focus");
        boxes.current[hit]?.classList.add("is-focus");
        focus.current = hit;
        set("hover", hit >= 0 ? items[hit].name : "nothing yet");
      }
      tree.current.forEach((b) => b?.classList.toggle("is-current", b.dataset.i === String(current)));

      frames++;
      const now = performance.now();
      if (now - last >= 500) { set("fps", String(Math.round((frames * 1000) / (now - last)))); frames = 0; last = now; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(slow);
      observers.forEach((o) => o.disconnect());
      window.removeEventListener("pointermove", onMove);
      focus.current = -1;
    };
  }, [items]);

  if (phase === "off") return null;

  const sections = items.map((it, i) => ({ it, i })).filter(({ it }) => it.level === 1 && it.kind !== "fixed" && !it.el.matches(".topbar"));

  return (
    <>
      <div className={`xray-scan is-${phase === "out" ? "out" : "in"}`} aria-hidden="true" key={phase === "out" ? "out" : "in"} />

      <div className={`xray is-${phase}`} aria-hidden="true">
        {items.map((it, i) => (
          <div key={it.id} ref={(el) => { boxes.current[i] = el; }} className={`xray-box xray-box--l${it.level} xray-box--${it.kind}${it.el.matches(".topbar") ? " xray-box--bar" : ""}`}>
            <div ref={(el) => { labels.current[i] = el; }} className="xray-label mono">
              <p className="xray-label__name">{it.name}<span className="xray-tag">{it.kind}</span></p>
              {it.level === 1 && <p className="xray-label__file">{it.file}</p>}
              <p className="xray-label__does">{it.does}</p>
              <p className="xray-label__meta">{it.data ? `${it.data} · ` : ""}{fmt(it.nodes)} nodes</p>
            </div>
          </div>
        ))}
      </div>

      <aside className={`xray-hud mono is-${phase}`} aria-label="X-ray mode: live page measurements">
        <div className="xray-hud__head">
          <span className="xray-hud__live" aria-hidden="true" />
          <strong>X-RAY</strong>
          <span className="xray-hud__sub">live, in your browser</span>
          <button type="button" className="xray-hud__close" onClick={close} aria-label="Exit X-ray mode">esc</button>
        </div>
        <dl className="xray-hud__vitals">
          <div><dt>fps</dt><dd ref={(el) => { hud.current.fps = el; }}>…</dd></div>
          <div><dt>LCP</dt><dd ref={(el) => { hud.current.lcp = el; }}>…</dd></div>
          <div><dt>CLS</dt><dd ref={(el) => { hud.current.cls = el; }}>…</dd></div>
          <div><dt>DOM nodes</dt><dd ref={(el) => { hud.current.dom = el; }}>…</dd></div>
          <div><dt>requests</dt><dd ref={(el) => { hud.current.req = el; }}>…</dd></div>
          <div><dt>components</dt><dd>{items.length}</dd></div>
        </dl>
        <p className="xray-hud__hover"><span>inspecting</span> <b ref={(el) => { hud.current.hover = el; }}>nothing yet</b></p>
        <p className="xray-hud__label">component tree</p>
        <ol className="xray-hud__tree">
          <li className="xray-hud__root">&lt;Home /&gt; <span>src/app/page.tsx</span></li>
          {sections.map(({ it, i }, k) => (
            <li key={it.id}>
              <button
                type="button"
                data-i={i}
                ref={(el) => { tree.current[k] = el; }}
                onClick={() => scrollToTarget(it.el as HTMLElement)}
              >
                <span className="xray-hud__dot" data-kind={it.kind} />{it.name}
              </button>
            </li>
          ))}
        </ol>
        <p className="xray-hud__foot">Hover anything to inspect it. Press <kbd>X</kbd> or <kbd>Esc</kbd> to exit.</p>
      </aside>
    </>
  );
}
