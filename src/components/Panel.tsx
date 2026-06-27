"use client";

import { motion } from "framer-motion";
import type { Panel as PanelData, SpotColor } from "@/content/types";
import { CaptionBox } from "./art/CaptionBox";
import { SpeechBubble } from "./art/SpeechBubble";
import { resolveArt } from "./art/registry";
import { ComicFrame } from "./ComicFrame";

interface PanelProps {
  panel: PanelData;
  spot?: string;
  spotKey?: SpotColor;
  kicker?: string;
  caseTitle?: string;
  active?: boolean;
  panelProgress?: number;
  reducedMotion?: boolean;
}

export function Panel({
  panel,
  spot,
  spotKey,
  kicker,
  caseTitle,
  active = false,
  panelProgress = 0,
  reducedMotion = false,
}: PanelProps) {
  const show = active || reducedMotion;

  return (
    <ComicFrame dark={panel.dark} paper={panel.paper} spot={spot} kicker={kicker}>
      {/* Art layers w/ depth parallax */}
      {panel.layers.map((layer, i) => {
        const Art = resolveArt(layer.kind);
        const py = reducedMotion
          ? 0
          : layer.depth === "bg"
          ? panelProgress * -22
          : layer.depth === "fg"
          ? panelProgress * 14
          : panelProgress * -5;
        const scale = layer.depth === "bg" ? 1.1 : layer.depth === "fg" ? 1 : 1.04;
        const z = layer.depth === "bg" ? 1 : layer.depth === "mid" ? 2 : 3;
        return (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              transform: `translateY(${py}px) scale(${scale})`,
              zIndex: z,
              willChange: reducedMotion ? undefined : "transform",
            }}
          >
            <Art {...(layer.props ?? {})} kind={layer.kind} spot={spotKey} caseTitle={caseTitle} />
          </div>
        );
      })}

      {/* Captions — stagger slide-in (Framer) + typewriter (CaptionBox) */}
      {panel.captions?.map((cap, i) => (
        <motion.div
          key={i}
          className="absolute z-20 max-w-[82%]"
          style={{
            left: `${(cap.at?.x ?? 0.06) * 100}%`,
            top: `${(cap.at?.y ?? 0.06 + i * 0.09) * 100}%`,
          }}
          initial={false}
          animate={show ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: -24, y: 0 }}
          transition={{ duration: 0.45, delay: show ? i * 0.18 : 0, ease: [0.22, 1, 0.36, 1] }}
        >
          <CaptionBox text={cap.text} voice={cap.voice} animate={active && !reducedMotion} visible={active} />
        </motion.div>
      ))}

      {/* Speech bubbles — spring pop */}
      {panel.bubbles?.map((bubble, i) => (
        <motion.div
          key={i}
          className="absolute z-20"
          style={{ left: `${bubble.at.x * 100}%`, top: `${bubble.at.y * 100}%` }}
          initial={false}
          animate={show ? { opacity: 1, scale: 1, x: "-50%", y: "-50%" } : { opacity: 0, scale: 0.6, x: "-50%", y: "-50%" }}
          transition={{ type: "spring", stiffness: 420, damping: 18, delay: show ? 0.35 + i * 0.15 : 0 }}
        >
          <SpeechBubble {...bubble} />
        </motion.div>
      ))}

      {/* SFX — punch in with rotation */}
      {panel.sfx?.map((s, i) => (
        <motion.p
          key={i}
          className="absolute z-20 select-none font-shout"
          style={{
            left: `${s.at.x * 100}%`,
            top: `${s.at.y * 100}%`,
            fontSize: "clamp(2rem, 5.5vw, 4.5rem)",
            color: "#f2eee2",
            WebkitTextStroke: "1.5px #0a0a0a",
            textShadow: "4px 4px 0 rgba(200,144,46,0.55), 0 0 1px #0a0a0a",
            letterSpacing: "0.04em",
          }}
          initial={false}
          animate={
            show
              ? { opacity: 1, scale: 1, rotate: s.rotate ?? 0, x: "-50%", y: "-50%" }
              : { opacity: 0, scale: 0.3, rotate: (s.rotate ?? 0) - 35, x: "-50%", y: "-50%" }
          }
          transition={{ type: "spring", stiffness: 360, damping: 14, delay: show ? 0.25 : 0 }}
        >
          {s.text}
        </motion.p>
      ))}
    </ComicFrame>
  );
}
