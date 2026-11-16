"use client";

import { useEffect, useRef, useState } from "react";
import type { Contributions } from "@/lib/github";

const fmt = (n: number) => n.toLocaleString("en-US");
const dayName = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

/* the year as a heatmap that sweeps in column by column, with live stats */
export function GitHubPulse({ data }: { data: Contributions }) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* columns are weeks, rows are weekdays (Sunday first, like GitHub) */
  const first = new Date(`${data.days[0].date}T00:00:00Z`).getUTCDay();
  const cells = data.days.map((d, i) => ({ ...d, i, col: Math.floor((i + first) / 7), row: (i + first) % 7 }));
  const cols = cells[cells.length - 1].col + 1;
  const h = hover !== null ? cells[hover] : null;

  return (
    <div ref={ref} className={`pulse${seen ? " is-in" : ""}`}>
      <div className="pulse__head">
        <p className="pulse__live mono"><i aria-hidden="true" />live from GitHub · updated hourly</p>
        <a className="pulse__user mono" href={`https://github.com/${data.user}`} target="_blank" rel="noopener noreferrer">@{data.user} ↗</a>
      </div>
      <div className="pulse__stats">
        <div><b>{fmt(data.streak)}</b><span>day streak, still going</span></div>
        <div><b>{fmt(data.total)}</b><span>contributions in the last year</span></div>
        <div><b>{fmt(data.last30)}</b><span>in the last 30 days</span></div>
        <div><b>{fmt(data.best.count)}</b><span>best day · {dayName(data.best.date)}</span></div>
      </div>
      <div className="pulse__grid-wrap">
        <svg
          className="pulse__grid" viewBox={`0 0 ${cols * 14} ${7 * 14}`} role="img"
          aria-label={`${fmt(data.total)} contributions in the last year, a ${data.streak}-day streak`}
          onMouseLeave={() => setHover(null)}
        >
          {cells.map((c) => (
            <rect
              key={c.date} x={c.col * 14} y={c.row * 14} width="11" height="11" rx="2.5"
              className={`pulse__cell l${c.level}${c.i === cells.length - 1 ? " is-today" : ""}`}
              style={{ transitionDelay: `${c.col * 18}ms` }}
              onMouseEnter={() => setHover(c.i)}
            />
          ))}
        </svg>
        <span className="pulse__scan" aria-hidden="true" />
      </div>
      <p className="pulse__tip mono" aria-live="polite">
        {h ? <><b>{h.count} contribution{h.count === 1 ? "" : "s"}</b> on {dayName(h.date)}</> : <>Today so far: <b>{data.today}</b>. Hover any day.</>}
      </p>
    </div>
  );
}

/* a small pill for the hero */
export function StreakPill({ streak }: { streak: number }) {
  return (
    <a href="#awards" className="streak-pill mono">
      <i aria-hidden="true" />{streak}-day GitHub streak
    </a>
  );
}
