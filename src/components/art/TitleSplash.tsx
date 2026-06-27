import { radialLines } from "@/lib/svg";

interface TitleSplashProps {
  className?: string;
}

const CX = 600;
const CY = 400;
const INNER = 80;
const LINES = radialLines(CX, CY, INNER, 900, 26).map((l, i) => ({
  ...l,
  w: 0.8 + (i % 4) * 0.6,
  op: 0.15 + (i % 3) * 0.08,
}));

export function TitleSplash({ className = "" }: TitleSplashProps) {
  return (
    <svg
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      width="100%"
      height="100%"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ts-paper" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e6e1d3" />
          <stop offset="100%" stopColor="#d8d0bc" />
        </linearGradient>
        <radialGradient id="speed-fade" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0a0a0a" stopOpacity="0.85" />
          <stop offset="35%" stopColor="#0a0a0a" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0" />
        </radialGradient>
        <pattern id="ts-ht" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1" fill="#0a0a0a" opacity="0.12" />
        </pattern>
      </defs>

      <rect width="1200" height="800" fill="url(#ts-paper)" />
      <rect width="1200" height="800" fill="url(#ts-ht)" />

      {/* Speed lines */}
      <g opacity="0.7">
        {LINES.map((l) => (
          <line key={l.i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="#0a0a0a" strokeWidth={l.w} opacity={l.op} />
        ))}
      </g>

      <circle cx={CX} cy={CY} r="500" fill="url(#speed-fade)" opacity="0.12" />
      <circle cx={CX} cy={CY} r={INNER} fill="#f2eee2" />

      {/* Top/bottom registration bars */}
      <rect x="0" y="0" width="1200" height="8" fill="#0a0a0a" />
      <rect x="0" y="792" width="1200" height="8" fill="#0a0a0a" />

      {/* NULL CITY — CMYK misprint */}
      <text x={CX} y={CY - 10} textAnchor="middle" fontFamily="'Oswald','Arial Narrow',sans-serif" fontWeight="700" fontSize="148" letterSpacing="-3" fill="rgba(0,174,239,0.35)" transform="translate(-3,0)">NULL CITY</text>
      <text x={CX} y={CY - 10} textAnchor="middle" fontFamily="'Oswald','Arial Narrow',sans-serif" fontWeight="700" fontSize="148" letterSpacing="-3" fill="rgba(236,0,140,0.35)" transform="translate(3,0)">NULL CITY</text>
      <text x={CX} y={CY - 10} textAnchor="middle" fontFamily="'Oswald','Arial Narrow',sans-serif" fontWeight="700" fontSize="148" letterSpacing="-3" fill="#0a0a0a">NULL CITY</text>

      <rect x={CX - 200} y={CY + 18} width="400" height="4" fill="#0a0a0a" />

      <text x={CX} y={CY + 72} textAnchor="middle" fontFamily="'Oswald','Arial Narrow',sans-serif" fontWeight="400" fontSize="42" letterSpacing="12" fill="#0a0a0a">THE DEBUGGER</text>
      <text x={CX} y={CY + 150} textAnchor="middle" fontFamily="'Special Elite','Courier New',monospace" fontSize="18" letterSpacing="6" fill="#2b2722">A VANSH DOBARIYA STORY</text>

      {/* Frame */}
      <rect x="30" y="30" width="1140" height="740" fill="none" stroke="#0a0a0a" strokeWidth="6" />
      <rect x="40" y="40" width="1120" height="720" fill="none" stroke="#0a0a0a" strokeWidth="1.5" opacity="0.4" />
    </svg>
  );
}
