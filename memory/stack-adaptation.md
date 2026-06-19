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

**R3F v9 / React 19 gotchas (confirmed building LoadingSequence in Prompt 02 — these recur for every Three.js component):**
- `<bufferAttribute>` requires `args={[array, itemSize]}` (constructor args). The v8 `count`/`array`/`itemSize` prop form is a **TypeScript build error** in fiber v9. `attach="attributes-position"` still required.
- ESLint (`eslint-config-next/typescript` + react-hooks v6) treats several React-19 rules as **hard errors** (fail `npm run lint`, though `next build` with Turbopack does NOT run ESLint so it still builds):
  - `react-hooks/refs`: reading `ref.current` **during render** (e.g. `array={someRef.current}` in JSX) is an error. Use lazy `useState`/stable values for things read in render.
  - `react-hooks/immutability`: mutating a value **returned from a hook** (`useMemo`/`useState` array) is an error. Bake initial data into the lazy initializer (mutating a local before `return` is fine), then mutate only the THREE object (e.g. `geometry.attributes.position.setXYZ(...)`) in `useFrame` — the rule is syntactic and won't flag method calls on a different expression.
  - `react-hooks/set-state-in-effect`: synchronous `setState` in an effect body is an error. For client-only-derived state (needs `window`), use a guarded lazy initializer: `useState(() => typeof window === 'undefined' ? fallback : compute())`.
  - `@typescript-eslint/no-explicit-any` is an error; `no-unused-vars` is a **warning** (so prompt-specified-but-unused symbols can stay).
- Client-only Three.js/Tone components must be imported with `next/dynamic` + `{ ssr: false }` from the page (Tone.js references `self`/`window` at module load → would crash SSR/static-gen otherwise).
- Per-frame buffer updates: set `attribute.needsUpdate = true` in `useFrame` (done in LoadingSequence).
