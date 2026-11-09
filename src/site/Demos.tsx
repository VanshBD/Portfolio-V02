"use client";

import { useEffect, useState, type FormEvent } from "react";

/* ── Pravasa: an application moving through the real status pipeline ── */
const STAGES = [
  { name: "Applied", note: "Form and passport submitted from a phone" },
  { name: "Paid", note: "UPI payment verified by transaction reference" },
  { name: "Docs verified", note: "Staff approved every document" },
  { name: "At embassy", note: "Sent with one click by embassy mail" },
  { name: "Visa approved", note: "Approved visa uploaded by staff" },
  { name: "Sent on WhatsApp", note: "Visa PDF delivered to the traveller" },
];

export function PravasaDemo() {
  const [stage, setStage] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const last = STAGES.length - 1;
  const advance = () => {
    const n = stage >= last ? 0 : stage + 1;
    setStage(n);
    setToast(n === 0 ? null : `Status changed: ${STAGES[n].name}`);
  };

  /* autoplay: one step per tick until the visa is delivered */
  useEffect(() => {
    if (!playing) return;
    const t = window.setTimeout(() => {
      if (stage >= last) { setPlaying(false); return; }
      setStage(stage + 1);
      setToast(`Status changed: ${STAGES[stage + 1].name}`);
    }, 1300);
    return () => clearTimeout(t);
  }, [playing, stage, last]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 1800);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <div className="demo">
      <div className="demo__bar"><i /><i /><i /><span>demo · application PRS-UNI-00142</span></div>
      <div className="demo__body pravasa-demo">
        <p className="demo__label mono">e-Visa · Dubai · 30 days</p>
        <ol className="pipeline">
          {STAGES.map((st, i) => (
            <li key={st.name} className={i < stage ? "is-done" : i === stage ? "is-now" : ""}>
              <span className="pipeline__dot" aria-hidden="true">{i < stage ? "✓" : ""}</span>
              <span className="pipeline__name">{st.name}</span>
              <span className="pipeline__note">{st.note}</span>
            </li>
          ))}
        </ol>
        <div className="demo__actions">
          <button type="button" className="btn btn--primary btn--sm" onClick={() => { setPlaying(false); advance(); }}>
            {stage >= STAGES.length - 1 ? "Start over" : "Advance status"}
          </button>
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => { setStage(0); setPlaying(true); }} disabled={playing}>
            Play the whole journey
          </button>
        </div>
        <div className={`toast${toast ? " is-on" : ""}`} role="status" aria-live="polite">
          <span className="live-dot" aria-hidden="true" /> {toast ?? ""}
          <small>real-time alert · traveller + staff</small>
        </div>
      </div>
    </div>
  );
}

/* ── La Europa: publish from the admin panel, see it on the site ── */
const COUNTRIES = ["United Kingdom", "Ireland", "Germany", "France", "Italy", "Netherlands", "Spain", "Poland"];
interface Post { id: number; title: string; country: string; when: string; fresh?: boolean }
type Msg = { kind: "ok" | "err" | "warn"; text: string } | null;

export function LaEuropaDemo() {
  const [title, setTitle] = useState("");
  const [country, setCountry] = useState(COUNTRIES[2]);
  const [msg, setMsg] = useState<Msg>(null);
  const [posts, setPosts] = useState<Post[]>([
    { id: 2, title: "Student Visa Documents: A General Checklist", country: "All destinations", when: "Sample post" },
    { id: 1, title: "How to Choose the Right Country in Europe for Your Studies", country: "All destinations", when: "Sample post" },
  ]);

  const publish = (e: FormEvent) => {
    e.preventDefault();
    const raw = title.trim();
    if (!raw) { setMsg({ kind: "err", text: "Add a title to publish." }); return; }
    const clean = raw.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
    if (!clean) { setMsg({ kind: "err", text: "That title was only HTML, which the site removes. Add some words." }); return; }
    setPosts((p) => [{ id: Date.now(), title: clean, country, when: "Just now", fresh: true }, ...p.map((x) => ({ ...x, fresh: false }))].slice(0, 3));
    setTitle("");
    setMsg(clean !== raw
      ? { kind: "warn", text: "Published. The HTML tags were removed: the site cleans everything staff type." }
      : { kind: "ok", text: "Published. It's on the website now." });
  };

  return (
    <div className="demo">
      <div className="demo__bar"><i /><i /><i /><span>demo · runs only in your browser</span></div>
      <div className="demo__panes">
        <form className="demo__pane" onSubmit={publish}>
          <p className="demo__label mono">Admin · new update</p>
          <label className="field">Title
            <input value={title} maxLength={90} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. March intake is open" />
          </label>
          <label className="field">Destination
            <select value={country} onChange={(e) => setCountry(e.target.value)}>
              {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <button type="submit" className="btn btn--primary btn--sm btn--block">Publish</button>
          <p className={`demo__msg${msg ? ` is-${msg.kind}` : ""}`} role="status">{msg?.text}</p>
        </form>
        <div className="demo__pane demo__pane--site" aria-label="Website preview">
          <p className="demo__label mono">Website · latest updates</p>
          <p className="demo__brand">LA Europa</p>
          <div className="demo__posts">
            {posts.map((p) => (
              <div key={p.id} className={`demo__post${p.fresh ? " is-new" : ""}`}>
                <small>{p.country} · {p.when}</small>
                {p.title}
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="demo__hint">Try it: publish an update, or type some &lt;b&gt;HTML&lt;/b&gt; and watch it get cleaned. Nothing reaches the real La Europa site; it resets when you reload.</p>
    </div>
  );
}
