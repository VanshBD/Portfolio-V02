"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent as RPointerEvent } from "react";
import { scrollToTarget } from "./Motion";
import { act } from "./Playful";

/*
  "Sketch your system": pick the parts of what you want built, drag them
  around, and the wires draw themselves the way I'd connect them. A review
  points out what's missing, and the plan reads like how I'd build it,
  using what I've actually shipped. One click drops it into the contact form.
*/

type Id = "web" | "mobile" | "admin" | "api" | "auth" | "realtime" | "jobs" | "db" | "cache" | "files" | "payments" | "email" | "ai";
interface Block { label: string; layer: 0 | 1 | 2; plan: string }

const BLOCKS: Record<Id, Block> = {
  web: { label: "Website", layer: 0, plan: "A fast Next.js front end, server-rendered so search engines and slow phones both get a quick page." },
  mobile: { label: "Mobile app", layer: 0, plan: "A mobile app on the same API, so web and mobile never drift apart." },
  admin: { label: "Admin panel", layer: 0, plan: "An admin console where each role sees only its own areas, with two-factor sign-in (Pravasa's has 15 role areas)." },
  api: { label: "API", layer: 1, plan: "One typed Node.js and Express API behind everything: validation, permissions and audit logs live in one place." },
  auth: { label: "Sign-in & roles", layer: 1, plan: "Passwordless or JWT sign-in with role-based permissions, checked on the server for every request." },
  realtime: { label: "Real-time", layer: 1, plan: "Socket.io pushes every status change instantly, and only to the people allowed to see it." },
  jobs: { label: "Background jobs", layer: 1, plan: "Slow work like emails, reports and AI calls runs in background jobs, so requests stay fast." },
  db: { label: "Database", layer: 2, plan: "MongoDB with indexes planned around your real queries, and personal data encrypted at rest." },
  cache: { label: "Cache", layer: 2, plan: "Redis in front of the busiest reads; caching and index tuning made responses 48% faster at AUM." },
  files: { label: "File storage", layer: 2, plan: "Private file storage behind links that expire after an hour, never public URLs." },
  payments: { label: "Payments", layer: 2, plan: "Payments confirmed on the server, never trusted from the browser, with reminders before deadlines." },
  email: { label: "Email", layer: 2, plan: "Transactional email with sender checks at startup and proper DNS records, so mail never fails silently." },
  ai: { label: "AI", layer: 2, plan: "Claude or Gemini behind the API, limited to a fixed set of safe actions, with risky ones waiting for approval." },
};
const ORDER = Object.keys(BLOCKS) as Id[];
const LAYER_NAME = ["clients", "core", "data & services"];

const PRESETS: { name: string; ids: Id[] }[] = [
  { name: "Booking platform", ids: ["web", "admin", "api", "auth", "db", "payments", "email"] },
  { name: "Visa portal, like Pravasa", ids: ["web", "admin", "api", "auth", "realtime", "db", "files", "payments", "email"] },
  { name: "AI assistant", ids: ["web", "api", "auth", "jobs", "db", "ai"] },
];

function wires(ids: Id[]): [Id, Id][] {
  const has = (i: Id) => ids.includes(i);
  const clients = ids.filter((i) => BLOCKS[i].layer === 0);
  const core = ids.filter((i) => BLOCKS[i].layer === 1);
  const data = ids.filter((i) => BLOCKS[i].layer === 2);
  const out: [Id, Id][] = [];
  const hub: Id | undefined = has("api") ? "api" : core[0];
  clients.forEach((c) => (hub ? out.push([c, hub]) : data.forEach((d) => out.push([c, d]))));
  if (hub) {
    core.filter((c) => c !== hub).forEach((c) => out.push([hub, c]));
    data.forEach((d) => out.push([has("jobs") && (d === "email" || d === "ai") ? "jobs" : hub, d]));
  }
  return out;
}

function review(ids: Id[]): string[] {
  const has = (i: Id) => ids.includes(i);
  const notes: string[] = [];
  const clients = ids.some((i) => BLOCKS[i].layer === 0);
  if (clients && !has("api")) notes.push("Add an API: apps shouldn't talk to the database directly.");
  if ((has("payments") || has("admin") || has("files")) && !has("auth")) notes.push("Add sign-in & roles: payments, admin and private files need to know who's asking.");
  if (has("api") && !has("db")) notes.push("Where does the data live? Add a database.");
  if (has("ai") && !has("jobs")) notes.push("Consider background jobs so AI calls don't slow every request.");
  if (ids.filter((i) => BLOCKS[i].layer === 0).length >= 2 && has("db") && !has("cache")) notes.push("Several apps on one database: a cache will keep it fast as you grow.");
  return notes;
}

type Pos = Record<string, { x: number; y: number }>;

export function SketchPad() {
  const [ids, setIds] = useState<Id[]>(["web", "api", "db"]);
  const [moved, setMoved] = useState<Pos>({});
  const [narrow, setNarrow] = useState(false);
  const [sent, setSent] = useState(false);
  const canvas = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: Id; pid: number } | null>(null);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setNarrow(e.contentRect.width < 560));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* automatic layout: three columns (or rows on phones), unless dragged */
  const pos = useMemo(() => {
    const p: Pos = {};
    [0, 1, 2].forEach((layer) => {
      const inLayer = ids.filter((i) => BLOCKS[i].layer === layer);
      inLayer.forEach((id, k) => {
        const spread = (k + 1) / (inLayer.length + 1);
        const auto = narrow ? { x: 8 + spread * 84, y: 16 + layer * 34 } : { x: 14 + layer * 36, y: 8 + spread * 84 };
        p[id] = moved[id] ?? auto;
      });
    });
    return p;
  }, [ids, moved, narrow]);

  const toggle = (id: Id) => {
    setSent(false);
    setIds((cur) => (cur.includes(id) ? cur.filter((i) => i !== id) : ORDER.filter((i) => cur.includes(i) || i === id)));
  };
  const preset = (list: Id[]) => { setSent(false); setMoved({}); setIds(ORDER.filter((i) => list.includes(i))); };

  const onDown = (e: RPointerEvent<HTMLDivElement>, id: Id) => {
    if ((e.target as HTMLElement).closest("button")) return;
    drag.current = { id, pid: e.pointerId };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e: RPointerEvent<HTMLDivElement>) => {
    const d = drag.current, el = canvas.current;
    if (!d || !el || d.pid !== e.pointerId) return;
    const r = el.getBoundingClientRect();
    const x = Math.min(94, Math.max(6, ((e.clientX - r.left) / r.width) * 100));
    const y = Math.min(92, Math.max(8, ((e.clientY - r.top) / r.height) * 100));
    setMoved((m) => ({ ...m, [d.id]: { x, y } }));
  };
  const onUp = () => { drag.current = null; };

  const links = wires(ids);
  const notes = review(ids);
  const planIds = [...ids].sort((a, b) => BLOCKS[a].layer - BLOCKS[b].layer);
  const curve = (a: Id, b: Id) => {
    const p = pos[a], q = pos[b];
    if (!p || !q) return "";
    const ax = p.x * 10, ay = p.y * 4.2, bx = q.x * 10, by = q.y * 4.2;
    return narrow
      ? `M${ax} ${ay} C${ax} ${(ay + by) / 2} ${bx} ${(ay + by) / 2} ${bx} ${by}`
      : `M${ax} ${ay} C${(ax + bx) / 2} ${ay} ${(ax + bx) / 2} ${by} ${bx} ${by}`;
  };

  const send = () => {
    const names = planIds.map((i) => BLOCKS[i].label);
    const idea = `A system with ${names.join(", ")}`;
    const plan = planIds.map((i) => `${BLOCKS[i].label}: ${BLOCKS[i].plan}`);
    window.dispatchEvent(new CustomEvent("vd:sketch", { detail: { idea, plan } }));
    act("sketch");
    setSent(true);
    const target = document.querySelector("#contact .compose");
    if (target) scrollToTarget(target as HTMLElement);
  };

  return (
    <section id="sketch" className="section sketch" data-section="sketch" data-path="/sketch">
      <div className="container">
        <p className="eyebrow" data-reveal>Sketch your system</p>
        <h2 className="h2" data-split>Tell me what you need. I&rsquo;ll show you how I&rsquo;d wire it.</h2>
        <p className="lede" data-reveal>Pick the parts, drag them around, and watch the connections draw themselves. Then read the plan, built from things I&rsquo;ve actually shipped.</p>

        <div className="sk" data-reveal>
          <div className="sk__side">
            <p className="sk__label mono">Start from</p>
            <div className="sk__presets">
              {PRESETS.map((p) => <button key={p.name} type="button" className="sk__preset" onClick={() => preset(p.ids)}>{p.name}</button>)}
              <button type="button" className="sk__preset is-clear" onClick={() => preset([])}>Clear</button>
            </div>
            {[0, 1, 2].map((layer) => (
              <div key={layer}>
                <p className="sk__label mono">{LAYER_NAME[layer]}</p>
                <div className="sk__palette">
                  {ORDER.filter((i) => BLOCKS[i].layer === layer).map((i) => (
                    <button key={i} type="button" className={`sk__chip l${layer}${ids.includes(i) ? " is-on" : ""}`} aria-pressed={ids.includes(i)} onClick={() => toggle(i)}>
                      {ids.includes(i) ? "✓ " : "+ "}{BLOCKS[i].label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="sk__main">
            <div ref={canvas} className="sk__canvas" onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
              <svg className="sk__wires" viewBox="0 0 1000 420" preserveAspectRatio="none" aria-hidden="true">
                {links.map(([a, b], i) => {
                  const d = curve(a, b);
                  return (
                    <g key={`${a}-${b}`}>
                      <path d={d} className="sk__wire" vectorEffect="non-scaling-stroke" />
                      <circle r="5" className={`sk__packet l${BLOCKS[a].layer}`}>
                        <animateMotion dur={`${1.6 + (i % 4) * 0.3}s`} repeatCount="indefinite" path={d} />
                      </circle>
                    </g>
                  );
                })}
              </svg>
              {ids.map((id) => (
                <div
                  key={id}
                  className={`sk__node l${BLOCKS[id].layer}`}
                  style={{ left: `${pos[id]?.x}%`, top: `${pos[id]?.y}%` }}
                  onPointerDown={(e) => onDown(e, id)}
                >
                  <span className="sk__dot" aria-hidden="true" />{BLOCKS[id].label}
                  <button type="button" className="sk__x" onClick={() => toggle(id)} aria-label={`Remove ${BLOCKS[id].label}`}>×</button>
                </div>
              ))}
              {!ids.length && <p className="sk__empty mono">Pick a preset or add parts on the left.</p>}
              <p className="sk__count mono">{ids.length} parts · {links.length} connections{ids.length ? " · drag to rearrange" : ""}</p>
            </div>

            <div className="sk__out">
              <div className="sk__plan">
                <p className="sk__label mono">How I&rsquo;d build it</p>
                {planIds.length ? (
                  <ol>{planIds.map((i) => <li key={i}><b>{BLOCKS[i].label}.</b> {BLOCKS[i].plan}</li>)}</ol>
                ) : <p className="sk__muted">Nothing to build yet.</p>}
              </div>
              <div className="sk__review">
                <p className="sk__label mono">Review</p>
                {notes.length ? (
                  <ul>{notes.map((n) => <li key={n}><span aria-hidden="true">⚠</span> {n}</li>)}</ul>
                ) : ids.length ? <p className="sk__ok"><span aria-hidden="true">✓</span> Looks solid. Approved.</p> : <p className="sk__muted">Waiting for a sketch.</p>}
                <button type="button" className="btn btn--primary btn--sm" disabled={!ids.length} onClick={send} data-magnetic>
                  {sent ? "Added to your message ✓" : "Send this plan to Vansh ↓"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
