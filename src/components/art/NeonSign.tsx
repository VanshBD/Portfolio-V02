interface NeonSignProps {
  text?: string;
  sub?: string;
  flicker?: boolean;
  className?: string;
}

export function NeonSign({ text = "SEGFAULT", sub, flicker = true, className = "" }: NeonSignProps) {
  const fc = flicker ? "flicker" : "";
  const mainY = sub ? 104 : 122;
  const mainSize = sub ? 58 : 68;
  return (
    <svg
      viewBox="0 0 600 200"
      preserveAspectRatio="xMidYMid meet"
      width="100%"
      height="100%"
      className={className}
      aria-hidden="true"
      style={{ pointerEvents: "none" }}
    >
      <defs>
        <filter id="neon-glow" x="-30%" y="-60%" width="160%" height="220%">
          <feGaussianBlur stdDeviation="6" result="o" />
          <feComposite in="SourceGraphic" in2="o" operator="over" />
        </filter>
        <filter id="neon-inner" x="-10%" y="-30%" width="120%" height="160%">
          <feGaussianBlur stdDeviation="2" result="ii" />
          <feComposite in="SourceGraphic" in2="ii" operator="over" />
        </filter>
        <linearGradient id="sign-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#181614" />
          <stop offset="100%" stopColor="#0e0c0a" />
        </linearGradient>
      </defs>

      <rect x="10" y="30" width="580" height="140" rx="8" fill="url(#sign-bg)" />
      <rect x="10" y="30" width="580" height="140" rx="8" fill="none" stroke="#2a2520" strokeWidth="2" />
      {[30, 80, 520, 570].map((rx) =>
        [52, 158].map((ry) => (
          <circle key={`${rx}-${ry}`} cx={rx} cy={ry} r="4" fill="#1c1814" stroke="#2a2520" strokeWidth="1" />
        ))
      )}

      <text x="300" y={mainY} textAnchor="middle" fontFamily="'Oswald','Arial Narrow',sans-serif" fontWeight="700" fontSize={mainSize} letterSpacing="4" fill="#4a8a99" opacity="0.35" filter="url(#neon-glow)" className={fc}>{text}</text>
      <text x="300" y={mainY} textAnchor="middle" fontFamily="'Oswald','Arial Narrow',sans-serif" fontWeight="700" fontSize={mainSize} letterSpacing="4" fill="#7dd4e8" filter="url(#neon-inner)" className={fc}>{text}</text>
      <text x="300" y={mainY} textAnchor="middle" fontFamily="'Oswald','Arial Narrow',sans-serif" fontWeight="700" fontSize={mainSize} letterSpacing="4" fill="#c8f0f8" opacity="0.8" className={fc}>{text}</text>

      {sub && (
        <text x="300" y="146" textAnchor="middle" fontFamily="'Special Elite','Courier New',monospace" fontSize="16" letterSpacing="6" fill="#c8902e" opacity="0.85" className={flicker ? "flicker" : ""}>
          {sub}
        </text>
      )}

      <rect x="40" y="172" width="520" height="3" fill="#4a8a99" opacity="0.08" rx="1" />
    </svg>
  );
}
