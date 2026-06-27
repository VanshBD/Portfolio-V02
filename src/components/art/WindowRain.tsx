import { seeded, r } from "@/lib/svg";

interface WindowRainProps {
  time?: "night" | "dusk";
  className?: string;
}

/* Streaks on glass — deterministic columns. */
const COLS = Array.from({ length: 13 }, (_, c) => ({
  x: r(110 + c * 72),
  drops: Array.from({ length: 5 }, (_, d) => {
    const seed = c * 17 + d * 3;
    return {
      y: r(seeded(seed) * 760),
      len: r(16 + seeded(seed * 2) * 50),
      w: r(0.9 + seeded(seed * 3) * 0.8),
      op: r(0.14 + seeded(seed * 5) * 0.18),
      dur: r(1.1 + seeded(seed * 7) * 1.4),
      delay: r(-seeded(seed * 11) * 2.4),
    };
  }),
}));

export function WindowRain({ className = "" }: WindowRainProps) {
  return (
    <svg
      viewBox="0 0 1060 800"
      preserveAspectRatio="xMidYMid slice"
      width="100%"
      height="100%"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="wnd-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0a0a" />
          <stop offset="65%" stopColor="#12100d" />
          <stop offset="100%" stopColor="#1c1812" />
        </linearGradient>
        <linearGradient id="glass-sheen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.03" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.01" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.03" />
        </linearGradient>
        <linearGradient id="fog-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c8c0b0" stopOpacity="0" />
          <stop offset="100%" stopColor="#c8c0b0" stopOpacity="0.07" />
        </linearGradient>
        <style>{`
          .ws { animation: ws-fall linear infinite; }
          @keyframes ws-fall {
            0% { transform: translateY(-80px); opacity: 0; }
            12% { opacity: 1; }
            88% { opacity: 0.55; }
            100% { transform: translateY(860px); opacity: 0; }
          }
        `}</style>
      </defs>

      <rect width="1060" height="800" fill="url(#wnd-sky)" />
      {/* Blurred city lights through glass */}
      <ellipse cx="200" cy="620" rx="90" ry="14" fill="#c8902e" opacity="0.04" />
      <ellipse cx="500" cy="650" rx="70" ry="12" fill="#4a8a99" opacity="0.05" />
      <ellipse cx="800" cy="610" rx="85" ry="14" fill="#c8902e" opacity="0.04" />
      <rect width="1060" height="800" fill="url(#glass-sheen)" />

      {/* Streaks */}
      {COLS.map((col, ci) =>
        col.drops.map((d, di) => (
          <line
            key={`${ci}-${di}`}
            className="ws"
            x1={col.x}
            y1={d.y}
            x2={r(col.x + 2)}
            y2={r(d.y + d.len)}
            stroke="#8aabbf"
            strokeWidth={d.w}
            opacity={d.op}
            style={{ animationDuration: `${d.dur}s`, animationDelay: `${d.delay}s` }}
          />
        ))
      )}

      <rect x="0" y="680" width="1060" height="120" fill="url(#fog-grad)" />

      {/* Window frame */}
      <rect x="0" y="0" width="1060" height="800" fill="none" stroke="#0a0a0a" strokeWidth="40" />
      <rect x="0" y="390" width="1060" height="20" fill="#0a0a0a" />
      <rect x="520" y="0" width="20" height="800" fill="#0a0a0a" />
    </svg>
  );
}
