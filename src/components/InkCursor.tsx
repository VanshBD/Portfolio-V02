"use client";

import { useEffect, useRef, useState } from "react";

interface Drop { id: number; x: number; y: number; }

export function InkCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef    = useRef<HTMLDivElement>(null);
  const [drops, setDrops] = useState<Drop[]>([]);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    /* Bail on touch-only devices */
    if (window.matchMedia("(hover: none)").matches) return;

    const cursor = cursorRef.current;
    const dot    = dotRef.current;
    if (!cursor || !dot) return;

    let rafId = 0;
    let mx = -200, my = -200;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        cursor.style.transform = `translate(${mx}px, ${my}px)`;
      });

      const target = e.target as HTMLElement;
      setHovering(!!target.closest("a, button, [role='button'], [data-magnetic]"));
    };

    const onClick = (e: MouseEvent) => {
      const id = Date.now();
      setDrops((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => setDrops((prev) => prev.filter((d) => d.id !== id)), 800);
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("click", onClick, { passive: true });
    document.documentElement.style.cursor = "none";

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("click", onClick);
      document.documentElement.style.cursor = "";
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* Main cursor: pen nib */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 99999,
          pointerEvents: "none",
          transform: "translate(-200px, -200px)",
          willChange: "transform",
        }}
      >
        <svg
          width="22"
          height="32"
          viewBox="0 0 22 32"
          fill="none"
          style={{
            display: "block",
            transform: "translate(-4px, -4px)",
            transition: "transform 0.15s ease",
          }}
        >
          {/* Nib body */}
          <path d="M 11 1 L 21 14 L 11 31 L 1 14 Z" fill="var(--color-ink)" opacity="0.92" />
          <path d="M 11 1 L 21 14 L 11 22" fill="var(--color-pencil)" opacity="0.4" />
          {/* Nib slit */}
          <line x1="11" y1="18" x2="11" y2="31" stroke="var(--color-paper)" strokeWidth="1.2" opacity="0.6" />
        </svg>

        {/* Ink blob below nib — expands on hover */}
        <div
          ref={dotRef}
          style={{
            position: "absolute",
            bottom: "-4px",
            left: "50%",
            transform: "translateX(-50%)",
            width: hovering ? "14px" : "5px",
            height: hovering ? "14px" : "5px",
            borderRadius: "50%",
            background: "var(--color-ink)",
            opacity: hovering ? 0.25 : 0.7,
            transition: "width 0.25s ease, height 0.25s ease, opacity 0.25s ease",
          }}
        />
      </div>

      {/* Click ink drops */}
      {drops.map(({ id, x, y }) => (
        <div
          key={id}
          aria-hidden="true"
          style={{
            position: "fixed",
            zIndex: 99998,
            pointerEvents: "none",
            left: x,
            top: y,
            transform: "translate(-50%, -50%)",
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "var(--color-ink)",
            animation: "ink-drop-click 0.75s cubic-bezier(0.23, 1, 0.32, 1) forwards",
          }}
        />
      ))}
    </>
  );
}
