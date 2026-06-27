import { spotVar } from "@/content/characters";
import type { SpotColor } from "@/content/types";
import { radialLines, seeded, r } from "@/lib/svg";

interface CaseSceneProps {
  kind?: string;
  spot?: SpotColor;
  caseTitle?: string;
  className?: string;
  [key: string]: unknown;
}

/* A symbolic inked emblem chosen by keyword in the layer `kind`. Each returns
   a centered glyph drawn in the noir-print line style. */
function Emblem({ kind, color }: { kind: string; color: string }) {
  const k = kind.toLowerCase();
  const stroke = { stroke: "#e6e1d3", strokeWidth: 5, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  if (k.includes("map") || k.includes("journey")) {
    return (
      <g {...stroke}>
        <circle cx="0" cy="0" r="70" />
        <ellipse cx="0" cy="0" rx="30" ry="70" />
        <line x1="-70" y1="0" x2="70" y2="0" />
        <line x1="-60" y1="-36" x2="60" y2="-36" />
        <line x1="-60" y1="36" x2="60" y2="36" />
        <path d="M-50 -20 Q0 -60 55 10" stroke={color} strokeWidth="4" strokeDasharray="8 8" />
        <circle cx="-50" cy="-20" r="6" fill={color} stroke="none" />
        <circle cx="55" cy="10" r="6" fill={color} stroke="none" />
      </g>
    );
  }
  if (k.includes("payment") || k.includes("cleared") || k.includes("fix") || k.includes("clock")) {
    return (
      <g {...stroke}>
        <circle cx="0" cy="0" r="68" />
        <line x1="0" y1="0" x2="0" y2="-44" />
        <line x1="0" y1="0" x2="32" y2="16" />
        <path d="M-26 4 L-6 26 L34 -22" stroke={color} strokeWidth="8" />
      </g>
    );
  }
  if (k.includes("alarm") || k.includes("pager") || k.includes("war") || k.includes("villain") || k.includes("ghost")) {
    return (
      <g {...stroke}>
        <path d="M0 -68 L72 60 L-72 60 Z" />
        <line x1="0" y1="-18" x2="0" y2="28" stroke={color} strokeWidth="8" />
        <circle cx="0" cy="46" r="5" fill={color} stroke="none" />
      </g>
    );
  }
  if (k.includes("crew") || k.includes("contact")) {
    return (
      <g {...stroke}>
        {[-46, 0, 46].map((x, i) => (
          <g key={i} transform={`translate(${x},0)`}>
            <circle cx="0" cy="-22" r="18" />
            <path d="M-24 44 Q0 6 24 44" />
          </g>
        ))}
        <circle cx="46" cy="-40" r="6" fill={color} stroke="none" />
      </g>
    );
  }
  if (k.includes("deploy") || k.includes("countdown") || k.includes("lock") || k.includes("power")) {
    return (
      <g {...stroke}>
        <circle cx="0" cy="0" r="66" />
        <circle cx="0" cy="0" r="30" />
        {radialLines(0, 0, 30, 66, 8).map((l) => (
          <line key={l.i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
        ))}
        <circle cx="0" cy="-66" r="7" fill={color} stroke="none" />
      </g>
    );
  }
  if (k.includes("arena") || k.includes("duel") || k.includes("prompt") || k.includes("leaderboard")) {
    return (
      <g {...stroke}>
        <line x1="-58" y1="-58" x2="40" y2="48" />
        <line x1="-58" y1="-44" x2="-44" y2="-58" />
        <line x1="58" y1="-58" x2="-40" y2="48" />
        <line x1="58" y1="-44" x2="44" y2="-58" />
        <circle cx="0" cy="-2" r="12" fill={color} stroke="none" />
      </g>
    );
  }
  if (k.includes("chain") || k.includes("twist")) {
    return (
      <g {...stroke}>
        {[-40, 40].map((x, i) => (
          <rect key={i} x={x - 28} y="-28" width="56" height="56" rx="10" transform={`rotate(${i ? -8 : 8} ${x} 0)`} />
        ))}
        <line x1="-12" y1="0" x2="12" y2="0" stroke={color} strokeWidth="8" />
      </g>
    );
  }
  if (k.includes("typescript")) {
    return (
      <g {...stroke}>
        <rect x="-58" y="-58" width="116" height="116" rx="12" />
        <text x="0" y="34" textAnchor="middle" fontFamily="'Oswald',sans-serif" fontWeight="700" fontSize="78" fill={color} stroke="none">TS</text>
      </g>
    );
  }
  if (k.includes("phone")) {
    return (
      <g {...stroke}>
        <path d="M-38 -52 Q-58 -52 -52 -28 Q-36 36 28 52 Q52 58 52 38 L52 18 L18 6 L4 24 Q-22 12 -34 -14 L-14 -28 L-26 -54 Z" />
        <path d="M40 -54 Q64 -52 66 -28" stroke={color} strokeWidth="4" />
        <path d="M34 -42 Q50 -40 52 -24" stroke={color} strokeWidth="4" />
      </g>
    );
  }
  if (k.includes("rap") || k.includes("sheet") || k.includes("finale") || k.includes("dawn")) {
    return (
      <g {...stroke}>
        <rect x="-50" y="-64" width="100" height="128" rx="4" />
        <line x1="-32" y1="-36" x2="32" y2="-36" />
        <line x1="-32" y1="-12" x2="32" y2="-12" />
        <line x1="-32" y1="12" x2="14" y2="12" stroke={color} strokeWidth="5" />
        <line x1="-32" y1="36" x2="32" y2="36" />
      </g>
    );
  }
  /* default: case-file folder */
  return (
    <g {...stroke}>
      <path d="M-64 -34 L-10 -34 L2 -48 L64 -48 L64 50 L-64 50 Z" />
      <line x1="-64" y1="-10" x2="64" y2="-10" stroke={color} strokeWidth="4" />
    </g>
  );
}

/* Deterministic halftone dot field for the spot burst. */
const BURST_DOTS = Array.from({ length: 220 }, (_, i) => {
  const a = seeded(i) * Math.PI * 2;
  const rad = seeded(i * 3 + 1) ** 0.5 * 420;
  return { x: r(Math.cos(a) * rad), y: r(Math.sin(a) * rad), s: r(1 + seeded(i * 7) * 3.5) };
});

export function CaseScene({ kind = "case", spot = "none", caseTitle = "", className = "" }: CaseSceneProps) {
  const color = spot !== "none" ? spotVar[spot] : "#6b8a9e";
  const uid = kind.replace(/[^a-z0-9]/gi, "");
  return (
    <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={`cs-vig-${uid}`} cx="50%" cy="42%" r="62%">
          <stop offset="0%" stopColor="#161208" />
          <stop offset="100%" stopColor="#080807" />
        </radialGradient>
        <radialGradient id={`cs-burst-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.5" />
          <stop offset="60%" stopColor={color} stopOpacity="0.12" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <clipPath id={`cs-clip-${uid}`}><rect x="0" y="0" width="1200" height="800" /></clipPath>
      </defs>

      <rect width="1200" height="800" fill={`url(#cs-vig-${uid})`} />

      {/* Spot-color glow + halftone burst, off-center */}
      <g clipPath={`url(#cs-clip-${uid})`}>
        <ellipse cx="760" cy="360" rx="430" ry="430" fill={`url(#cs-burst-${uid})`} />
        <g transform="translate(760,360)" fill={color} opacity="0.35">
          {BURST_DOTS.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r={d.s} />
          ))}
        </g>
      </g>

      {/* Ghosted case title behind the emblem */}
      {caseTitle && (
        <text x="600" y="470" textAnchor="middle" fontFamily="'Oswald',sans-serif" fontWeight="700" fontSize="150" letterSpacing="-4" fill="#e6e1d3" opacity="0.05">
          {caseTitle.toUpperCase()}
        </text>
      )}

      {/* Light-beam — film-noir spotlight */}
      <polygon points="120,0 360,0 720,800 200,800" fill="#e6e1d3" opacity="0.03" />

      {/* The emblem */}
      <g transform="translate(600,360)">
        <Emblem kind={kind} color={color} />
      </g>

      {/* Speed lines from the emblem */}
      <g opacity="0.12">
        {radialLines(600, 360, 130, 1000, 30).map((l, i) => (
          <line key={l.i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="#e6e1d3" strokeWidth={0.6 + (i % 3) * 0.4} />
        ))}
      </g>
    </svg>
  );
}
