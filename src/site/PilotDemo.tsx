"use client";

import { useEffect, useRef, useState } from "react";

/*
  A playable model of ObscurPilot's real flow:
  hold to talk → transcribe → plan with fixed tools → safety checks →
  ask first when it's risky → run on OBS / Twitch → log it.
  Runs entirely in the browser; nothing touches OBS or Twitch.
*/

type Phase = "idle" | "listening" | "thinking" | "checking" | "asking" | "working" | "done" | "cancelled";

interface Command {
  id: string;
  label: string;
  say: string;
  plan: string[];
  ask?: string;
  log: string[];
}

const COMMANDS: Command[] = [
  { id: "scene", label: "Switch scene", say: "Switch to the gaming scene", plan: ['obs.setScene({ scene: "Gaming" })'], log: ["OBS · scene switched to Gaming"] },
  { id: "live", label: "Go live", say: "Go live with the title Ranked grind", plan: ['twitch.updateStream({ title: "Ranked grind" })', "obs.startStream()"], ask: "Start streaming to Twitch now?", log: ["Twitch · title set to Ranked grind", "OBS · stream started"] },
  { id: "ban", label: "Ban a spammer", say: "Ban the account spamming links", plan: ['twitch.chat.find({ pattern: "links" })', 'twitch.moderation.ban({ user: "spam_bot_92" })'], ask: "Permanently ban spam_bot_92? Bans always need your approval.", log: ["Twitch · spam_bot_92 banned"] },
];

const CHECKS = ["Schema valid", "Permission granted", "Not a duplicate", "Timeout set", "Audit logged"];

const STATUS: Record<Phase, string> = {
  idle: "Hold Alt + X, or pick a command",
  listening: "Listening…",
  thinking: "Planning with fixed tools…",
  checking: "Running safety checks…",
  asking: "Waiting for your approval",
  working: "Working…",
  done: "Done",
  cancelled: "Cancelled · nothing was sent",
};

/* Pilot: a glass robot whose LED visor shows what it's doing. */
function Pilot({ phase }: { phase: Phase }) {
  const eyes = () => {
    switch (phase) {
      case "listening":
        return (
          <g className="pilot__meter">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <rect key={i} x={66 + i * 10} y={92} width="5" height="20" rx="2.5" style={{ animationDelay: `${i * 0.08}s` }} />
            ))}
          </g>
        );
      case "thinking":
      case "checking":
        return (<g className="pilot__led"><circle cx="82" cy="96" r="7" /><circle cx="118" cy="96" r="7" /></g>);
      case "asking":
        return (
          <g className="pilot__led">
            <circle cx="82" cy="104" r="8" /><circle cx="118" cy="104" r="8" />
            <path d="M108 86 L128 81" className="pilot__brow" />
          </g>
        );
      case "working":
        return (<g className="pilot__led"><rect x="72" y="100" width="20" height="5" rx="2.5" /><rect x="108" y="100" width="20" height="5" rx="2.5" /></g>);
      case "done":
        return (<g className="pilot__happy"><path d="M73 108 L82 98 L91 108" /><path d="M109 108 L118 98 L127 108" /></g>);
      case "cancelled":
        return (<g className="pilot__happy"><path d="M74 104 H90" /><path d="M110 104 H126" /></g>);
      default:
        return (<g className="pilot__led pilot__blink"><circle cx="82" cy="102" r="9" /><circle cx="118" cy="102" r="9" /></g>);
    }
  };

  return (
    <svg viewBox="0 0 200 200" className={`pilot pilot--${phase}`} role="img" aria-label={`Pilot is ${STATUS[phase].toLowerCase()}`}>
      <ellipse cx="100" cy="182" rx="46" ry="7" className="pilot__shadow" />
      <g className="pilot__body">
        {phase === "asking" && <circle cx="100" cy="104" r="78" className="pilot__ring" />}
        {(phase === "thinking" || phase === "checking") && (
          <g className="pilot__orbit"><circle cx="100" cy="26" r="4" /><circle cx="168" cy="132" r="3.5" /><circle cx="32" cy="132" r="3" /></g>
        )}
        <line x1="100" y1="40" x2="100" y2="60" className="pilot__stem" />
        <circle cx="100" cy="34" r="7" className="pilot__tally" />
        <circle cx="36" cy="112" r="10" className="pilot__ear" />
        <circle cx="164" cy="112" r="10" className="pilot__ear" />
        <rect x="42" y="58" width="116" height="96" rx="32" className="pilot__head" />
        <path d="M58 70 Q100 60 142 70" className="pilot__shine" />
        <rect x="56" y="78" width="88" height="54" rx="17" className="pilot__visor" />
        {eyes()}
        {phase === "working" && (
          <g className="pilot__sparks"><path d="M150 52 l6 -8" /><path d="M158 64 l9 -2" /><path d="M44 50 l-6 -8" /></g>
        )}
        {phase === "asking" && <text x="152" y="62" className="pilot__q">?</text>}
      </g>
    </svg>
  );
}

export function PilotDemo() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [cmd, setCmd] = useState<Command | null>(null);
  const [typed, setTyped] = useState(0);
  const [planN, setPlanN] = useState(0);
  const [checkN, setCheckN] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const run = useRef(0);
  const decide = useRef<((ok: boolean) => void) | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const nextCmd = useRef(0);

  const start = async (c: Command) => {
    const id = ++run.current;
    decide.current?.(false);
    decide.current = null;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const k = reduced ? 0.25 : 1;
    const wait = (ms: number) => new Promise<boolean>((r) => window.setTimeout(() => r(run.current === id), ms * k));
    const stamp = () => new Date().toLocaleTimeString("en-GB", { hour12: false });

    setCmd(c); setTyped(0); setPlanN(0); setCheckN(0); setPhase("listening");
    for (let i = 1; i <= c.say.length; i++) { if (!(await wait(32))) return; setTyped(i); }
    if (!(await wait(350))) return;

    setPhase("thinking");
    for (let i = 1; i <= c.plan.length; i++) { if (!(await wait(520))) return; setPlanN(i); }
    if (!(await wait(300))) return;

    setPhase("checking");
    for (let i = 1; i <= CHECKS.length; i++) { if (!(await wait(240))) return; setCheckN(i); }
    if (!(await wait(250))) return;

    if (c.ask) {
      setPhase("asking");
      const ok = await new Promise<boolean>((r) => { decide.current = r; });
      decide.current = null;
      if (run.current !== id) return;
      if (!ok) {
        setPhase("cancelled");
        setLog((l) => [`${stamp()}  audit · declined by creator: "${c.say}"`, ...l].slice(0, 6));
        return;
      }
    }

    setPhase("working");
    for (const line of c.log) {
      if (!(await wait(600))) return;
      setLog((l) => [`${stamp()}  ${line}`, ...l].slice(0, 6));
    }
    if (!(await wait(300))) return;
    setLog((l) => [`${stamp()}  audit · "${c.say}" completed`, ...l].slice(0, 6));
    setPhase("done");
  };

  /* Alt + X runs the next command while the demo is on screen, like the real app. */
  useEffect(() => {
    let visible = false;
    const el = box.current;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.4 });
    if (el) io.observe(el);
    const onKey = (e: KeyboardEvent) => {
      if (!visible || !e.altKey || e.key.toLowerCase() !== "x") return;
      e.preventDefault();
      const c = COMMANDS[nextCmd.current % COMMANDS.length];
      nextCmd.current += 1;
      void start(c);
    };
    window.addEventListener("keydown", onKey);
    const runRef = run;
    return () => { io.disconnect(); window.removeEventListener("keydown", onKey); runRef.current += 1; };
  }, []);

  const busy = phase !== "idle" && phase !== "done" && phase !== "cancelled" && phase !== "asking";

  return (
    <div className="demo pilot-demo" ref={box}>
      <div className="demo__bar"><i /><i /><i /><span>demo · runs only in your browser</span></div>
      <div className="pilot-demo__grid">
        <div className="pilot-demo__stage">
          <Pilot phase={phase} />
          <p className={`pilot-demo__status mono is-${phase}`} role="status" aria-live="polite">{STATUS[phase]}</p>
          <p className="pilot-demo__keys"><kbd>Alt</kbd> + <kbd>X</kbd> to talk</p>
        </div>

        <div className="pilot-demo__console">
          <div className="pilot-demo__cmds" role="group" aria-label="Voice commands">
            {COMMANDS.map((c) => (
              <button key={c.id} type="button" className={`chip-btn${cmd?.id === c.id ? " is-on" : ""}`} onClick={() => start(c)} disabled={busy}>
                <span aria-hidden="true">🎙</span> {c.label}
              </button>
            ))}
          </div>

          <div className="pc-block">
            <p className="pc-label mono">You said</p>
            <p className="pc-say">{cmd ? <>“{cmd.say.slice(0, typed)}{phase === "listening" && <i className="pc-caret" />}”</> : <span className="pc-empty">Nothing yet. Pick a command above.</span>}</p>
          </div>

          <div className="pc-block">
            <p className="pc-label mono">Plan · fixed tools only</p>
            <ol className="pc-plan mono">
              {cmd?.plan.slice(0, planN).map((p) => <li key={p}>{p}</li>)}
              {!cmd && <li className="pc-empty">waiting for a request</li>}
            </ol>
          </div>

          <div className="pc-block">
            <p className="pc-label mono">Safety gate</p>
            <ul className="pc-checks">
              {CHECKS.map((c, i) => (
                <li key={c} className={cmd && i < checkN ? "is-ok" : ""}><span aria-hidden="true">{cmd && i < checkN ? "✓" : "·"}</span>{c}</li>
              ))}
            </ul>
          </div>

          {phase === "asking" && cmd?.ask && (
            <div className="pc-ask" role="alertdialog" aria-label="Pilot asks for approval">
              <p>{cmd.ask}</p>
              <div>
                <button type="button" className="btn btn--primary btn--sm" onClick={() => decide.current?.(true)}>Approve</button>
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => decide.current?.(false)}>Deny</button>
              </div>
            </div>
          )}

          <div className="pc-block">
            <p className="pc-label mono">Activity log</p>
            <ul className="pc-log mono">
              {log.length ? log.map((l, i) => <li key={l + i}>{l}</li>) : <li className="pc-empty">empty</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
