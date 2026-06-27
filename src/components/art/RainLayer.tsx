import { seeded, r } from "@/lib/svg";

interface RainLayerProps {
  density?: "light" | "medium" | "heavy";
  className?: string;
}

/* Pre-computed deterministic drops — no Math.random, SSR-safe. */
const DROPS = Array.from({ length: 90 }, (_, i) => ({
  x: r(seeded(i * 2 + 1) * 1240 - 20),
  y: r(seeded(i * 3 + 2) * 800),
  len: r(16 + seeded(i * 5) * 26),
  w: r(0.7 + seeded(i * 7) * 0.9),
  op: r(0.1 + seeded(i * 11) * 0.18),
  dur: r(0.35 + seeded(i * 13) * 0.35),
  delay: r(-seeded(i * 17) * 1.2),
}));

export function RainLayer({ density = "heavy", className = "" }: RainLayerProps) {
  const count = density === "light" ? 32 : density === "medium" ? 58 : 90;
  const mult = density === "light" ? 0.6 : density === "medium" ? 0.82 : 1;

  return (
    <svg
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      width="100%"
      height="100%"
      className={className}
      aria-hidden="true"
      style={{ pointerEvents: "none" }}
    >
      <defs>
        <style>{`
          .rd { animation: rd-fall linear infinite; }
          @keyframes rd-fall {
            from { transform: translate(0,-130px); }
            to   { transform: translate(-34px, 940px); }
          }
        `}</style>
      </defs>
      {DROPS.slice(0, count).map((d, i) => (
        <line
          key={i}
          className="rd"
          x1={d.x}
          y1={d.y}
          x2={r(d.x - 6)}
          y2={r(d.y + d.len)}
          stroke="#7a98ac"
          strokeWidth={d.w}
          opacity={r(d.op * mult)}
          style={{ animationDuration: `${d.dur}s`, animationDelay: `${d.delay}s` }}
        />
      ))}
    </svg>
  );
}
