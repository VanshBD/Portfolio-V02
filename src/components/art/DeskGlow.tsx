interface DeskGlowProps {
  monitors?: number;
  coffee?: boolean;
  className?: string;
}

export function DeskGlow({ monitors = 3, coffee = true, className = "" }: DeskGlowProps) {
  const monW = 180;
  const monH = 115;
  const gap = 22;
  const totalW = monitors * monW + (monitors - 1) * gap;
  const startX = (900 - totalW) / 2;

  return (
    <svg
      viewBox="0 0 900 600"
      preserveAspectRatio="xMidYMax meet"
      width="100%"
      height="100%"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="room-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0a0a" />
          <stop offset="100%" stopColor="#12100d" />
        </linearGradient>
        <linearGradient id="screen-1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d1821" />
          <stop offset="100%" stopColor="#091218" />
        </linearGradient>
        <linearGradient id="screen-mid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0b1620" />
          <stop offset="100%" stopColor="#070f18" />
        </linearGradient>
        <radialGradient id="mon-glow" cx="50%" cy="0%" r="80%">
          <stop offset="0%" stopColor="#4a8a99" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#4a8a99" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="desk-surf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1714" />
          <stop offset="100%" stopColor="#0f0d0b" />
        </linearGradient>
        <filter id="screen-bloom" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <rect width="900" height="600" fill="url(#room-bg)" />
      <ellipse cx="450" cy="330" rx={totalW / 1.4} ry="160" fill="url(#mon-glow)" />

      {Array.from({ length: monitors }).map((_, i) => {
        const mx = startX + i * (monW + gap);
        const isMid = i === Math.floor(monitors / 2);
        return (
          <g key={i}>
            <rect x={mx} y={228} width={monW} height={monH} fill={isMid ? "#4a8a99" : "#2a5a6a"} opacity={0.08} rx={4} filter="url(#screen-bloom)" />
            <rect x={mx - 3} y={225} width={monW + 6} height={monH + 10} rx={5} fill="#0f0d0b" />
            <rect x={mx} y={228} width={monW} height={monH} rx={3} fill={isMid ? "url(#screen-mid)" : "url(#screen-1)"} />
            {Array.from({ length: 7 }).map((_, li) => (
              <rect
                key={li}
                x={mx + 12}
                y={238 + li * 14}
                width={isMid ? 60 + (li % 4) * 28 : 40 + (li % 4) * 22}
                height={3.5}
                rx={1.5}
                fill={li === 2 ? "#4a8a99" : li === 4 ? "#c8902e" : "#6b8a9e"}
                opacity={0.55 + (li % 2) * 0.15}
              />
            ))}
            {isMid && (
              <rect x={mx + 76} y={238} width={6} height={11} fill="#4a8a99" opacity={0.9} style={{ animation: "blink-caret 1s steps(1) infinite" }} />
            )}
            <rect x={mx + monW / 2 - 6} y={335} width={12} height={22} fill="#0f0d0b" />
            <rect x={mx + monW / 2 - 22} y={357} width={44} height={6} rx={2} fill="#141210" />
          </g>
        );
      })}

      {/* Desk */}
      <rect x="60" y="363" width="780" height="22" rx="3" fill="url(#desk-surf)" />
      <rect x="60" y="385" width="780" height="140" fill="#0f0d0b" />
      <rect x="60" y="363" width="780" height="2" fill="#2a2520" opacity="0.5" />

      {/* Keyboard */}
      <rect x={450 - 110} y={368} width={220} height={52} rx={4} fill="#141210" />
      {Array.from({ length: 4 }).map((_, row) =>
        Array.from({ length: 10 }).map((_, col) => (
          <rect key={`${row}-${col}`} x={450 - 100 + col * 20} y={372 + row * 11} width={17} height={8} rx={1.5} fill="#1c1916" />
        ))
      )}

      {/* Coffee */}
      {coffee && (
        <g>
          <rect x={startX - 55} y={358} width={32} height={38} rx={3} fill="#1c1714" />
          <rect x={startX - 49} y={354} width={20} height={7} rx={2} fill="#1c1714" />
          <path d={`M${startX - 23} 366 Q${startX - 10} 366 ${startX - 10} 374 Q${startX - 10} 382 ${startX - 23} 382`} stroke="#1c1714" strokeWidth="5" fill="none" />
          <path d={`M${startX - 45} 350 Q${startX - 41} 342 ${startX - 45} 334`} stroke="#2a2520" strokeWidth="2" fill="none" opacity="0.5" />
          <path d={`M${startX - 37} 346 Q${startX - 33} 338 ${startX - 37} 330`} stroke="#2a2520" strokeWidth="2" fill="none" opacity="0.5" />
        </g>
      )}

      {/* Desk lamp */}
      <g>
        <line x1={startX + totalW + 60} y1="363" x2={startX + totalW + 45} y2="300" stroke="#1c1916" strokeWidth="5" />
        <line x1={startX + totalW + 45} y1="300" x2={startX + totalW + 80} y2="270" stroke="#1c1916" strokeWidth="5" />
        <ellipse cx={startX + totalW + 95} cy="262" rx="22" ry="10" fill="#1c1916" />
        <ellipse cx={startX + totalW + 80} cy="290" rx="50" ry="30" fill="#c8902e" opacity="0.04" />
      </g>
    </svg>
  );
}
