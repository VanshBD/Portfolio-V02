"use client";

import { useEffect, useRef } from "react";

interface CaptionBoxProps {
  text: string;
  voice?: "narration" | "thought";
  animate?: boolean;
  visible?: boolean;
  className?: string;
}

export function CaptionBox({
  text,
  voice = "narration",
  animate = true,
  visible = true,
  className = "",
}: CaptionBoxProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!animate || !visible || !ref.current) {
      if (ref.current && !animate) ref.current.textContent = text;
      return;
    }
    const el = ref.current;
    el.textContent = "";
    let i = 0;
    const id = setInterval(() => {
      el.textContent = text.slice(0, i + 1);
      i++;
      if (i >= text.length) clearInterval(id);
    }, 26);
    return () => clearInterval(id);
  }, [text, animate, visible]);

  if (voice === "thought") {
    return (
      <div
        className={`inline-block border-2 border-ink rounded-2xl px-4 py-2 font-caption text-ink text-sm italic leading-snug ${className}`}
        style={{ background: "#f2eee2", boxShadow: "2px 2px 0 rgba(10,10,10,0.3)" }}
      >
        <span ref={ref}>{animate ? "" : text}</span>
        <span className="block text-center text-[6px] leading-none mt-1 tracking-widest opacity-60">···</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-block border-2 border-ink px-3 py-2 font-caption text-ink text-sm leading-snug ${className}`}
      style={{ background: "#e6e1d3", boxShadow: "2px 2px 0 rgba(10,10,10,0.35)", maxWidth: "30ch" }}
    >
      <span ref={ref}>{animate ? "" : text}</span>
    </div>
  );
}
