---
name: stack-adaptation
description: THE ORGANISM prompts target Next 14/React 18/Tailwind v3, but the repo runs Next 16/React 19/Tailwind v4 — user chose to adapt, not downgrade.
metadata:
  type: project
---

The "THE ORGANISM" portfolio is built via a 10-prompt sequence (Prompt1.md = Prompt 01). Those prompts were written for **Next.js 14.2.5 / React 18 / Tailwind v3**, but this repo is scaffolded as **Next.js 16.2.9 / React 19.2.4 / Tailwind v4**. On 2026-06-19 the user chose **"Adapt to modern stack"** (keep Next 16/React 19/Tailwind v4) rather than downgrade. AGENTS.md reinforces this ("This is NOT the Next.js you know — read node_modules/next/dist/docs/ before coding").

**Why:** `@react-three/fiber@8` (the prompt's pinned version) cannot run on React 19 — it needs the React 18 renderer.

**How to apply when running later prompts (02–10):**
- Three.js stack installed React-19-compatible: `@react-three/fiber@9.6.1`, `@react-three/drei@10.7.7`, `@react-spring/three@10.1.1`, `three@0.184`, `@types/three@0.184`, `framer-motion@12.40`. Use v9 fiber / v10 drei APIs, not the v8 APIs the prompts assume.
- **No `tailwind.config.ts`** (Tailwind v4). Theme tokens live in `@theme` inside `app/globals.css`. Use `@import "tailwindcss";` not `@tailwind base/...`. Available utilities: `bg-void`/`text-neural`/etc., `animate-breath`, `animate-pulse-growth`, `ease-organism`, `font-display`, `font-mono`.
- `next.config.ts` (not `.js`): Next 16 defaults to **Turbopack**, so no `webpack` block. `tone` kept off the server via `serverExternalPackages`. simplex-noise@4 / sharp need no special handling.
- next/font sets `--font-display` / `--font-mono` on `<html>`; raw CSS and Tailwind `@theme inline` both read them.
- `tsconfig.json` left at Next 16 scaffold defaults (`target ES2017`, `jsx: react-jsx`); `@/*` already maps to `./*`. Did NOT apply the prompt's ES2020/`jsx: preserve` changes — unnecessary and builds clean.
- `leva` is a dev dependency — never import it in source (`components`/`hooks`/`context`/`lib`/`app`).
