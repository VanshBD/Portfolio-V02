interface FigureProps {
  pose?: "typing" | "thinking" | "standing";
  facing?: "default" | "reader";
  className?: string;
}

function Typing() {
  return (
    <g>
      <rect x="178" y="310" width="16" height="90" rx="3" fill="#0f0d0b" />
      <rect x="165" y="300" width="42" height="14" rx="3" fill="#0f0d0b" />
      <rect x="152" y="400" width="68" height="12" rx="4" fill="#0f0d0b" />
      <line x1="165" y1="412" x2="158" y2="440" stroke="#0f0d0b" strokeWidth="5" strokeLinecap="round" />
      <line x1="207" y1="412" x2="214" y2="440" stroke="#0f0d0b" strokeWidth="5" strokeLinecap="round" />
      <path d="M158 360 Q152 400 155 408 L217 408 Q220 400 214 360 Z" fill="#0a0a0a" />
      <rect x="182" y="322" width="18" height="22" rx="3" fill="#0a0a0a" />
      <ellipse cx="191" cy="305" rx="28" ry="32" fill="#0a0a0a" />
      <path d="M163 310 Q163 270 191 268 Q219 270 219 310" stroke="#0a0a0a" strokeWidth="2" fill="none" />
      <path d="M158 378 Q130 388 108 412 Q118 418 128 414 Q148 398 168 390 Z" fill="#0a0a0a" />
      <path d="M214 378 Q242 388 264 412 Q254 418 244 414 Q224 398 204 390 Z" fill="#0a0a0a" />
      <ellipse cx="112" cy="414" rx="14" ry="8" fill="#0a0a0a" />
      <ellipse cx="260" cy="414" rx="14" ry="8" fill="#0a0a0a" />
    </g>
  );
}

function Thinking() {
  return (
    <g>
      <rect x="178" y="295" width="16" height="105" rx="3" fill="#0f0d0b" />
      <rect x="165" y="285" width="42" height="14" rx="3" fill="#0f0d0b" />
      <rect x="152" y="400" width="68" height="12" rx="4" fill="#0f0d0b" />
      <line x1="165" y1="412" x2="158" y2="440" stroke="#0f0d0b" strokeWidth="5" strokeLinecap="round" />
      <line x1="207" y1="412" x2="214" y2="440" stroke="#0f0d0b" strokeWidth="5" strokeLinecap="round" />
      <path d="M158 355 Q150 400 153 408 L219 408 Q222 400 214 355 Z" fill="#0a0a0a" />
      <rect x="182" y="318" width="18" height="22" rx="3" fill="#0a0a0a" />
      <ellipse cx="195" cy="300" rx="28" ry="32" fill="#0a0a0a" />
      <path d="M214 370 Q248 390 262 418 Q250 424 240 420 Q228 400 212 382 Z" fill="#0a0a0a" />
      <ellipse cx="264" cy="420" rx="12" ry="7" fill="#0a0a0a" />
      <path d="M158 370 Q136 386 120 408 Q130 415 140 411 Q155 392 166 378 Z" fill="#0a0a0a" />
    </g>
  );
}

function Standing({ facing }: { facing: string }) {
  const flip = facing === "reader" ? "scale(-1,1) translate(-372,0)" : undefined;
  return (
    <g transform={flip}>
      <rect x="176" y="430" width="22" height="90" rx="4" fill="#0a0a0a" />
      <rect x="204" y="430" width="22" height="90" rx="4" fill="#0a0a0a" />
      <ellipse cx="187" cy="522" rx="18" ry="8" fill="#0a0a0a" />
      <ellipse cx="215" cy="522" rx="18" ry="8" fill="#0a0a0a" />
      <path d="M162 330 Q156 430 160 432 L242 432 Q246 430 240 330 Z" fill="#0a0a0a" />
      <path d="M186 330 L196 365 L206 330" stroke="#141210" strokeWidth="1.5" fill="none" opacity="0.6" />
      <rect x="183" y="302" width="18" height="28" rx="3" fill="#0a0a0a" />
      <ellipse cx="192" cy="285" rx="30" ry="34" fill="#0a0a0a" />
      <path d="M162 350 Q138 370 125 410 Q135 418 144 413 Q158 374 170 360 Z" fill="#0a0a0a" />
      <path d="M240 350 Q264 380 270 420 Q260 425 250 420 Q246 378 232 358 Z" fill="#0a0a0a" />
    </g>
  );
}

export function Figure({ pose = "typing", facing = "default", className = "" }: FigureProps) {
  return (
    <svg
      viewBox="0 0 372 540"
      preserveAspectRatio="xMidYMax meet"
      width="100%"
      height="100%"
      className={className}
      aria-hidden="true"
      style={{ pointerEvents: "none" }}
    >
      {(pose === "typing" || pose === "thinking") && (
        <ellipse cx="186" cy="340" rx="160" ry="100" fill="rgba(74,138,153,0.06)" />
      )}
      {pose === "typing" && <Typing />}
      {pose === "thinking" && <Thinking />}
      {pose === "standing" && <Standing facing={facing} />}
    </svg>
  );
}
