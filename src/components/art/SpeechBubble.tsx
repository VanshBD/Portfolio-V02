import type { Bubble } from "@/content/types";

type SpeechBubbleProps = Bubble & { className?: string };

const TAIL_OUTER: Record<string, React.CSSProperties> = {
  left: { borderRight: "14px solid #0a0a0a", borderTop: "8px solid transparent", borderBottom: "8px solid transparent", left: "-14px", top: "50%", transform: "translateY(-50%)" },
  right: { borderLeft: "14px solid #0a0a0a", borderTop: "8px solid transparent", borderBottom: "8px solid transparent", right: "-14px", top: "50%", transform: "translateY(-50%)" },
  down: { borderTop: "14px solid #0a0a0a", borderLeft: "8px solid transparent", borderRight: "8px solid transparent", bottom: "-14px", left: "50%", transform: "translateX(-50%)" },
  up: { borderBottom: "14px solid #0a0a0a", borderLeft: "8px solid transparent", borderRight: "8px solid transparent", top: "-14px", left: "50%", transform: "translateX(-50%)" },
};
const TAIL_INNER: Record<string, React.CSSProperties> = {
  left: { borderRight: "12px solid #f2eee2", borderTop: "7px solid transparent", borderBottom: "7px solid transparent", left: "-11px", top: "50%", transform: "translateY(-50%)" },
  right: { borderLeft: "12px solid #f2eee2", borderTop: "7px solid transparent", borderBottom: "7px solid transparent", right: "-11px", top: "50%", transform: "translateY(-50%)" },
  down: { borderTop: "12px solid #f2eee2", borderLeft: "7px solid transparent", borderRight: "7px solid transparent", bottom: "-11px", left: "50%", transform: "translateX(-50%)" },
  up: { borderBottom: "12px solid #f2eee2", borderLeft: "7px solid transparent", borderRight: "7px solid transparent", top: "-11px", left: "50%", transform: "translateX(-50%)" },
};

export function SpeechBubble({ speaker, text, tail = "left", shout = false, className = "" }: SpeechBubbleProps) {
  if (shout) {
    return (
      <div className={`relative inline-block px-4 py-3 ${className}`} style={{ filter: "drop-shadow(3px 3px 0 rgba(10,10,10,0.35))" }}>
        <svg viewBox="0 0 200 100" className="absolute inset-0 w-full h-full" aria-hidden="true">
          <polygon points="5,50 20,15 40,35 60,5 80,30 100,5 120,30 140,5 160,35 175,15 195,50 175,65 190,85 160,70 140,90 120,72 100,95 80,72 60,90 40,70 10,85 25,65" fill="#f2eee2" stroke="#0a0a0a" strokeWidth="2.5" />
        </svg>
        <div className="relative z-10 text-center">
          <p className="font-shout text-ink text-lg leading-tight uppercase">{text}</p>
          {speaker && <p className="font-caption text-ash text-[8px] tracking-widest mt-1 uppercase">{speaker}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative inline-block ${className}`} style={{ filter: "drop-shadow(2px 2px 0 rgba(10,10,10,0.3))" }}>
      <div className="relative border-2 border-ink rounded-2xl px-4 py-3" style={{ background: "#f2eee2", minWidth: "100px", maxWidth: "210px" }}>
        <span className="absolute" style={{ width: 0, height: 0, ...TAIL_OUTER[tail] }} />
        <span className="absolute" style={{ width: 0, height: 0, ...TAIL_INNER[tail] }} />
        {speaker && (
          <p className="font-display font-bold text-ink text-[9px] tracking-widest uppercase mb-1 border-b border-ash pb-1">{speaker}</p>
        )}
        <p className="font-dialogue text-ink text-sm leading-snug">{text}</p>
      </div>
    </div>
  );
}
