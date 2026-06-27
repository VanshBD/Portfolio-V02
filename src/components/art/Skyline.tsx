import { seeded, r } from "@/lib/svg";

interface SkylineProps {
  variation?: "downtown" | "midtown";
  className?: string;
}

/* Deterministic lit windows, pre-computed so SSR === client. */
const WINDOWS = Array.from({ length: 130 }, (_, i) => {
  const col = seeded(i * 3 + 1);
  const row = seeded(i * 7 + 2);
  const lit = seeded(i * 11 + 5) > 0.45;
  return {
    x: r(40 + col * 1120),
    y: r(40 + row * 600),
    w: 5 + Math.floor(seeded(i) * 3),
    h: 7 + Math.floor(seeded(i * 2) * 4),
    lit,
    warm: seeded(i * 13) > 0.3,
    op: r(0.4 + seeded(i * 17) * 0.45),
  };
});

export function Skyline({ className = "" }: SkylineProps) {
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
        <linearGradient id="sky-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0a0a" />
          <stop offset="55%" stopColor="#100d0b" />
          <stop offset="100%" stopColor="#241d15" />
        </linearGradient>
        <radialGradient id="moon-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#d8d0bc" stopOpacity="0.65" />
          <stop offset="55%" stopColor="#b8b0a0" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#b8b0a0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="street-reflect" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1c1813" />
          <stop offset="100%" stopColor="#0a0a0a" />
        </linearGradient>
        <filter id="win-bloom" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="1" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="neon-puddle"><feGaussianBlur stdDeviation="4" /></filter>
      </defs>

      {/* Sky */}
      <rect width="1200" height="800" fill="url(#sky-grad)" />

      {/* Moon */}
      <circle cx="945" cy="92" r="62" fill="url(#moon-glow)" />
      <circle cx="945" cy="92" r="27" fill="#cec8b8" opacity="0.5" />
      <circle cx="935" cy="86" r="6" fill="#b5ad9c" opacity="0.25" />
      <circle cx="956" cy="100" r="4" fill="#b5ad9c" opacity="0.2" />

      {/* Far building row */}
      <g fill="#0d0c0a">
        <rect x="0" y="160" width="100" height="640" />
        <rect x="110" y="40" width="55" height="760" />
        <rect x="118" y="20" width="40" height="22" />
        <rect x="130" y="2" width="15" height="20" />
        <rect x="175" y="220" width="145" height="580" />
        <rect x="330" y="90" width="65" height="710" />
        <rect x="338" y="72" width="48" height="20" />
        <rect x="405" y="310" width="185" height="490" />
        <rect x="600" y="130" width="48" height="670" />
        <rect x="608" y="112" width="32" height="20" />
        <rect x="658" y="250" width="130" height="550" />
        <rect x="798" y="170" width="70" height="630" />
        <rect x="878" y="280" width="165" height="520" />
        <rect x="1053" y="110" width="55" height="690" />
        <rect x="1062" y="92" width="36" height="20" />
        <rect x="1118" y="230" width="82" height="570" />
      </g>

      {/* Mid building row */}
      <g fill="#080807">
        <rect x="0" y="380" width="55" height="420" />
        <rect x="62" y="460" width="88" height="340" />
        <rect x="200" y="440" width="110" height="360" />
        <rect x="318" y="390" width="75" height="410" />
        <rect x="400" y="470" width="95" height="330" />
        <rect x="680" y="420" width="130" height="380" />
        <rect x="820" y="460" width="85" height="340" />
        <rect x="915" y="400" width="100" height="400" />
        <rect x="1025" y="450" width="75" height="350" />
        <rect x="1108" y="480" width="92" height="320" />
      </g>

      {/* Water tower */}
      <g fill="#0a0a0a">
        <rect x="350" y="54" width="24" height="38" />
        <ellipse cx="362" cy="54" rx="22" ry="8" />
        <path d="M340 50 L362 30 L384 50 Z" />
        <line x1="352" y1="92" x2="345" y2="108" stroke="#0a0a0a" strokeWidth="3" />
        <line x1="362" y1="92" x2="362" y2="108" stroke="#0a0a0a" strokeWidth="3" />
        <line x1="372" y1="92" x2="379" y2="108" stroke="#0a0a0a" strokeWidth="3" />
      </g>

      {/* Antenna w/ aircraft light */}
      <g stroke="#141210" strokeWidth="1.5" fill="none">
        <line x1="624" y1="130" x2="624" y2="80" />
        <line x1="619" y1="102" x2="629" y2="102" />
        <circle cx="624" cy="79" r="3" fill="#b23a2e" opacity="0.7" className="flicker" />
      </g>

      {/* Lit windows */}
      <g filter="url(#win-bloom)">
        {WINDOWS.filter((w) => w.lit).map((w, i) => (
          <rect
            key={i}
            x={w.x}
            y={w.y}
            width={w.w}
            height={w.h}
            fill={w.warm ? "#c8902e" : "#4a8a99"}
            opacity={w.op * 0.7}
          />
        ))}
      </g>

      {/* Street + reflections */}
      <rect x="0" y="730" width="1200" height="70" fill="url(#street-reflect)" />
      <line x1="0" y1="732" x2="1200" y2="732" stroke="#141210" strokeWidth="1" opacity="0.6" />
      <ellipse cx="300" cy="755" rx="120" ry="8" fill="#4a8a99" opacity="0.08" filter="url(#neon-puddle)" />
      <ellipse cx="900" cy="760" rx="80" ry="6" fill="#c8902e" opacity="0.07" filter="url(#neon-puddle)" />
      <ellipse cx="620" cy="748" rx="60" ry="5" fill="#4a8a99" opacity="0.1" filter="url(#neon-puddle)" />
    </svg>
  );
}
