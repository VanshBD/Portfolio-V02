"use client";

import { useEffect, useRef } from "react";
import { profile } from "@/content/site";

interface N { x: number; y: number; vx: number; vy: number; label: string }
interface Packet { a: number; b: number; t: number; speed: number }

const LINK = 0.2;          // link distance, as a fraction of the larger side
const CURSOR_PULL = 0.14;  // how far the cursor attracts nodes

function css(name: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

/*
  A quiet, living network of the stack behind the hero text. Nodes drift,
  link to their neighbours, lean toward the cursor, and packets of light
  travel along the links. Pauses off screen; static for reduced motion.
*/
export function HeroNetwork() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0, h = 0, dpr = 1, raf = 0, visible = true, lastSpawn = 0;
    const mouse = { x: -1, y: -1, on: false };
    let colors = { line: "", node: "", text: "", signal: "" };
    const readColors = () => {
      colors = {
        line: css("--net-line", "rgba(125,139,163,0.22)"),
        node: css("--steel", "#7D8BA3"),
        text: css("--net-text", "rgba(238,241,246,0.5)"),
        signal: css("--signal", "#FF6B3D"),
      };
    };
    readColors();

    const words = profile.heroStack;
    const nodes: N[] = words.map((label, i) => {
      /* golden-angle spread so the start layout is even, then drift */
      const a = i * 2.39996, r = Math.sqrt((i + 0.5) / words.length);
      return { x: 0.5 + Math.cos(a) * r * 0.5, y: 0.5 + Math.sin(a) * r * 0.5, vx: (Math.random() - 0.5) * 0.00012, vy: (Math.random() - 0.5) * 0.00012, label };
    });
    const packets: Packet[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width; h = rect.height;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const pos = (n: N) => {
      let x = n.x * w, y = n.y * h;
      if (mouse.on) {
        const dx = mouse.x - x, dy = mouse.y - y, d = Math.hypot(dx, dy), reach = Math.max(w, h) * 0.22;
        if (d < reach) { const k = (1 - d / reach) * CURSOR_PULL; x += dx * k; y += dy * k; }
      }
      return [x, y] as const;
    };

    const frame = (t: number) => {
      raf = 0;
      ctx.clearRect(0, 0, w, h);
      const span = Math.max(w, h), linkD = span * LINK;
      const P = nodes.map(pos);
      const links: [number, number][] = [];

      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const d = Math.hypot(P[i][0] - P[j][0], P[i][1] - P[j][1]);
          if (d < linkD) {
            links.push([i, j]);
            ctx.globalAlpha = 1 - d / linkD;
            ctx.strokeStyle = colors.line;
            ctx.beginPath(); ctx.moveTo(P[i][0], P[i][1]); ctx.lineTo(P[j][0], P[j][1]); ctx.stroke();
          }
        }
      }
      /* the cursor joins the network */
      if (mouse.on) {
        P.forEach(([x, y]) => {
          const d = Math.hypot(mouse.x - x, mouse.y - y);
          if (d < linkD * 0.9) {
            ctx.globalAlpha = (1 - d / (linkD * 0.9)) * 0.9;
            ctx.strokeStyle = colors.signal;
            ctx.beginPath(); ctx.moveTo(mouse.x, mouse.y); ctx.lineTo(x, y); ctx.stroke();
          }
        });
      }
      ctx.globalAlpha = 1;

      /* packets travel along links */
      if (!reduced && links.length && t - lastSpawn > 380 && packets.length < 14) {
        const [a, b] = links[Math.floor(Math.random() * links.length)];
        packets.push(Math.random() > 0.5 ? { a, b, t: 0, speed: 0.008 + Math.random() * 0.01 } : { a: b, b: a, t: 0, speed: 0.008 + Math.random() * 0.01 });
        lastSpawn = t;
      }
      for (let k = packets.length - 1; k >= 0; k--) {
        const p = packets[k];
        p.t += p.speed;
        if (p.t >= 1) { packets.splice(k, 1); continue; }
        const x = P[p.a][0] + (P[p.b][0] - P[p.a][0]) * p.t;
        const y = P[p.a][1] + (P[p.b][1] - P[p.a][1]) * p.t;
        const g = ctx.createRadialGradient(x, y, 0, x, y, 9);
        g.addColorStop(0, colors.signal); g.addColorStop(1, "transparent");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 9, 0, Math.PI * 2); ctx.fill();
      }

      /* nodes and labels */
      ctx.font = `500 11px ${css("--font-mono", "monospace")}, monospace`;
      ctx.textAlign = "center";
      P.forEach(([x, y], i) => {
        ctx.fillStyle = colors.node;
        ctx.beginPath(); ctx.arc(x, y, 2.2, 0, Math.PI * 2); ctx.fill();
        /* on narrow screens the labels would fight the headline, so draw dots only */
        if (w >= 760) {
          ctx.fillStyle = colors.text;
          ctx.fillText(nodes[i].label, x, y - 8);
        }
      });

      /* drift, bouncing softly off the edges */
      if (!reduced) {
        nodes.forEach((n) => {
          n.x += n.vx * 16; n.y += n.vy * 16;
          if (n.x < 0.03 || n.x > 0.97) n.vx *= -1;
          if (n.y < 0.05 || n.y > 0.95) n.vy *= -1;
        });
      }
      if (!reduced && visible) raf = requestAnimationFrame(frame);
    };

    const start = () => { if (!raf) raf = requestAnimationFrame(frame); };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); });
    io.observe(canvas);
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.on = mouse.y > 0 && mouse.y < r.height;
      if (reduced) start();
    };
    const onLeave = () => { mouse.on = false; };
    const mo = new MutationObserver(() => { readColors(); start(); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", resize);
    start();
    return () => {
      cancelAnimationFrame(raf); io.disconnect(); mo.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="hero__net" aria-hidden="true" />;
}
