# NULL CITY — *The Debugger*
### A scroll-driven noir comic book portfolio for Vansh Dobariya

> "They said it couldn't be built."

This is the end-to-end build plan. Nothing gets coded until this is approved. Every
section below is a decision already made — the build phase just executes it.

---

## 1. THE BIG IDEA

The portfolio is a **noir detective comic book**. You don't read a résumé — you read
*Issue #1* of a graphic novel where **Vansh is the protagonist**: a freelance "debugger"
working the night shift in a rain-soaked city where code goes to break.

- **Scrolling = turning the page.** Each scroll beat advances panels, assembles art,
  and inks-in the next frame.
- **His real projects become noir story beats** — not bullet points, *cases*.
- **Everything is hand-coded illustration** — no photos, no 3D, no stock art. Raw ink:
  halftone dots, speed lines, speech bubbles, registration misprint, ink-bleed.
- The last page is a **full splash panel** with his contact info:
  **"TO BE CONTINUED — IF YOU CALL."**

The four required story beats are the emotional spine:

| Beat | Noir meaning | Mapped to |
|------|-------------|-----------|
| **The Villain** | a bug in production at 2 a.m. | BillStack (money on the line) |
| **The Heist** | deploying to prod | TeamOS (the crew, real-time) |
| **The Twist** | blockchain unlocking a new power | PHANTOM-CARBON (ghost protocol) |
| **The Love Interest** | TypeScript — *she's complicated* | PromptWars (the AI arena) |

---

## 2. THE CAST & THE CITY

- **NULL CITY** — perpetual rain, dead neon, the place null pointers go to die.
- **THE DEBUGGER** — Vansh. Part architect, part detective. Drinks coffee, hunts bugs,
  never sleeps because the servers don't either.
- **TYPESCRIPT** — the femme fatale. Strict, demanding, always right in the end.
  Recurring character, not a case.
- **THE BUG** — the antagonist. Shape-shifts: a race condition, a memory leak, a
  null at 2 a.m.

**Narration voice:** terse, first-person, typewriter captions.
*"The city never sleeps. Neither do the servers. That's where I come in."*

---

## 3. THE SCRIPT (scroll order = reading order)

Each **CHAPTER** is a sequence of **PANELS**. Each panel is a coded SVG illustration with
caption boxes, speech bubbles, FX, and (for cases) a "dossier" reveal carrying the real
tech + GitHub link.

### CH 0 — COLD OPEN  *(the splash / hero)*
- **0.1** Establishing shot: rain over the NULL CITY skyline, one neon sign flickering.
  *Caption: "They said it couldn't be built."*
- **0.2** Push in on a high window — a silhouette at a keyboard, monitor glow cutting the dark.
- **0.3** Title splash: **NULL CITY** / *The Debugger* / "A VANSH DOBARIYA STORY" /
  **"SCROLL TO ENTER ↓"**

### CH 1 — THE DEBUGGER  *(about / origin)*
- **1.1** Hero reveal at the desk: three monitors, cold coffee, the rain on the glass.
- **1.2** The dossier — his abilities as a noir "rap sheet": *Frontend. Backend.
  AI integration. Blockchain. Known to ship under pressure.*
- **1.3** TYPESCRIPT walks in. *"She wore strict types and a look that said: refactor."*
- **1.4** The phone rings. The first case. *(hook → ink-bleed transition)*

### CH 2 — CASE FILE 01: "THE LONG CON"  → **Pravasa-Transworld**
A case that spans the globe. Travel booking as a cross-continent investigation —
real-time availability, payments that have to clear, an admin who sees everything.
- Panels: the map wall with red string, the journey, the payment that *must* go through.
- **Dossier:** React · Node · Express · MongoDB · Razorpay · JWT — *github.com/VanshBD/Pravasa-Transworld*
- **Spot color:** cold cyan.

### CH 3 — CASE FILE 02: "THE VILLAIN"  → **BillStack**
The 2 a.m. production bug. Money on the line, invoices bleeding, the clock against him.
- Panels: the pager goes off, the war room, tracing the ledger, the fix lands at 02:47.
- **Dossier:** React · Express · PDFKit · MongoDB · Nodemailer — *github.com/VanshBD/BillStack*
- **Spot color:** danger amber.

### CH 4 — CASE FILE 03: "THE HEIST"  → **TeamOS**
Deploying to prod, told as a heist. The crew, the plan, the countdown, the green build.
- Panels: assembling the crew (real-time avatars), the deploy countdown, the lock clicks open.
- **Dossier:** React · Socket.io · Node · Redis · MongoDB — *github.com/VanshBD/TeamOS*
- **Spot color:** vault green.

### CH 5 — CASE FILE 04: "THE DUEL"  → **PromptWars**  *(the love interest pays off)*
The AI arena. Prompt against prompt, live scoring, TypeScript at his side the whole time.
- Panels: the arena, the duel, the leaderboard, TYPESCRIPT — *"Told you. Complicated."*
- **Dossier:** TypeScript · Next.js · WebSocket · OpenAI · MongoDB — *github.com/VanshBD/PromptWars*
- **Spot color:** electric violet.

### CH 6 — CASE FILE 05: "THE TWIST"  → **PHANTOM-CARBON**
Blockchain unlocks a new power. A ledger no one can forge, ghosts made accountable.
- Panels: the ghost protocol, the chain locking block by block, the new power switched on.
- **Dossier:** TypeScript · Ethers.js · Solidity · React · Web3.js — *github.com/VanshBD/PHANTOM-CARBON*
- **Spot color:** spectral emerald.

### CH 7 — SPLASH FINALE  *(contact)*
- Full-bleed splash: the Debugger turns to the reader, rain easing, dawn cracking.
- **"TO BE CONTINUED — IF YOU CALL."**
- Contact as case-file tabs: **GitHub · LinkedIn · Email · Location**.
- Tiny teaser: *"Issue #2 — coming when the next bug does."*

> All script content lives in **one data file** (`src/content/script.ts`) so the story can
> be re-written without touching a single component.

---

## 4. VISUAL DESIGN SYSTEM

**Palette — noir + single spot color**
- Ink black `#0A0A0A`, newsprint paper `#E6E1D3` / aged `#D8D0BC`, halftone greys.
- Classic noir rule: the world is monochrome, **one spot color** carries danger/energy.
  Each case gets its own *muted* spot color (cyan/amber/green/violet/emerald) — desaturated
  to stay noir, never neon-bright.

**Texture — the print look**
- Halftone dot shading (SVG / CSS radial-gradient engine, dot size driven by "value").
- Paper grain + subtle vignette.
- **Registration misprint** — slight CMYK channel offset on key moments (the comic
  "printed slightly wrong" feel), intensified on hover/impact.

**Typography**
- **Titles / SFX:** heavy condensed display (Oswald/Anton) + a hand-lettered face for
  shouts (Bangers/Permanent Marker), used sparingly.
- **Narration captions:** typewriter (Special Elite / Courier Prime) in yellowed boxes.
- **Dialogue:** clean comic lettering inside SVG speech bubbles.
- Loaded via `<link>` (Google Fonts) — proven path from the last build.

**Panel grammar**
- Black borders, paper gutters, irregular layouts: full-bleed establishing shots, tight
  grids for tension, skewed/diagonal panels for action.
- SVG speech bubbles with tails; rectangular caption boxes for narration; onomatopoeia
  (RING, CLACK, BAM) as drawn type with impact bursts.

---

## 5. THE COMIC ENGINE (architecture)

Data-driven. Components render the **script**, they don't hard-code it.

```
src/
  app/
    layout.tsx            # fonts, metadata, global chrome
    page.tsx              # mounts <Comic/>
    globals.css           # ink, halftone, grain, paper tokens
  content/
    script.ts             # THE STORY: chapters → panels → layers → captions → dossiers
    characters.ts         # cast metadata, spot colors
  store/
    comic.ts              # zustand: chapter, audioOn, rainOn, mode, reducedMotion
  components/
    Comic.tsx             # orchestrates ScrollTrigger timeline over all chapters
    Chapter.tsx           # one pinned chapter, owns its panel sub-timeline
    Panel.tsx             # renders a panel's SVG layers + captions + bubbles + FX
    transitions/
      InkBleed.tsx        # SVG turbulence/displacement page-turn wipe
    art/                  # CODED ILLUSTRATION LIBRARY (the "assets")
      Skyline.tsx         # parametric city silhouette generator
      RainLayer.tsx       # SVG/canvas rain, parallax-aware
      Figure.tsx          # the Debugger, posable silhouette
      Props.tsx           # keyboard, coffee, phone, server rack, neon sign…
      Halftone.tsx        # halftone shading overlay
      SpeechBubble.tsx    # bubble + tail
      CaptionBox.tsx      # typewriter narration box
      SpeedLines.tsx      # motion/impact lines
    ui/
      Controls.tsx        # audio / rain / reading-mode / transcript toggles
      ChapterMenu.tsx     # jump-to-case index ("case files")
      Transcript.tsx      # accessible plain-text version of the whole story
    fx/
      FlashlightCursor.tsx# torch-beam mask for dark panels (reveals hidden ink)
      Registration.tsx    # CMYK misprint glitch controller
    audio/
      useNoirAudio.ts     # procedural Web Audio: rain, thunder, typewriter, ring, sax sting
```

**State (zustand):** `currentChapter`, `audioOn`, `rainOn`, `readingMode` (`cinematic` |
`reader`), `reducedMotion`, `transcriptOpen`.

---

## 6. SCROLL & ANIMATION (GSAP ScrollTrigger)

- The page is one tall scroll track. A master ScrollTrigger maps scroll → a GSAP timeline.
- **Cinematic mode (default, desktop):** each chapter *pins*; within the pin a sub-timeline
  inks-in panels, runs parallax layers, types captions, pops bubbles, wipes speed lines —
  then an **ink-bleed transition** hands off to the next chapter.
- **Reader mode (mobile / fallback):** classic webtoon — panels stack and scroll vertically,
  light parallax, reveals on enter. Toggleable; auto-selected on small screens.
- Within a panel: 3 parallax depths (background skyline → midground ink → foreground props),
  caption typewriter reveal, bubble pop with overshoot, draw-on SVG paths.

---

## 7. SIGNATURE EFFECTS

1. **Ink-bleed page transitions** — SVG `feTurbulence` + `feDisplacementMap` drive a growing
   ink-blot mask that swallows the screen and reveals the next chapter (a page dipped in ink).
2. **Flashlight cursor** — on the darkest panels the pointer becomes a torch beam (radial
   mask). Hidden ink / easter-egg messages exist only in the dark.
3. **Halftone engine** — value-driven dot shading; dots breathe on scroll for a living print.
4. **Registration glitch** — occasional CMYK channel offset, punched up on impact frames.
5. **Rain** — canvas particle rain, **toggleable**; thunder flashes briefly strobe/invert a panel.
6. **Typewriter narration** — captions type out with a clack.
7. **Panel camera** — slow zoom/pan (Ken-Burns-on-ink) on select establishing shots.

---

## 8. AUDIO (procedural, off by default)

Muted until the visitor flips the switch (a vinyl/record toggle). Built with **Web Audio**,
mostly **procedural** to avoid heavy files:
- Rain = filtered noise loop · Thunder = noise burst + lowpass sweep · Typewriter = short clack
  per character · Phone ring at "the case begins" · a brief noir **sax sting** on the title.
- Everything respects the toggle and `prefers-reduced-motion`/low-power.

---

## 9. THE ART PIPELINE (how "illustrations" get made)

No external image files. **Every illustration is a React component composing inline SVG**
(paths, shapes, filters) styled with the halftone/ink CSS. This is what makes the assets
"custom" *and* animatable (parallax, draw-on, posing).

- A reusable **ink primitives library** (`components/art/`): skyline generator, rain layer,
  posable figure, props, bubbles, caption boxes, speed lines, halftone overlay.
- Panels compose these primitives by reading the script — so new panels are *authored data*,
  not new artwork.

---

## 10. RESPONSIVE · ACCESSIBILITY · PERFORMANCE

- **Responsive:** desktop = cinematic pinned panels; mobile = webtoon vertical scroll,
  simplified parallax, big tap targets, corner toggles.
- **Reduced motion:** `prefers-reduced-motion` → no parallax/ink-bleed, static panels,
  instant reveals.
- **A11y:** full **Transcript mode** — the entire story as semantic, screen-reader-readable
  text; keyboard nav (←/→/Space advance, `M` mute, `R` rain); focus styles on all controls.
- **Performance:** lazy-render off-screen chapters; pause rain canvas off-screen; throttle on
  low-power; `will-change` budgeting; SVG over canvas where cheaper.

---

## 11. "BEYOND" — the futuristic layer

- **Director's commentary** — hover a panel to flip the noir metaphor into the *real*
  engineering note (the "villain" becomes the actual stack trace; the "heist" becomes the
  real deploy pipeline). The portfolio reads as story *and* as substance.
- **Flashlight easter eggs** — hidden frames only the torch cursor reveals.
- **Living time-of-day** — rain density and sky tone subtly shift to the visitor's local time.
- **Clip-a-panel** — render any panel to a shareable PNG via canvas ("rip this page").
- **Hidden alt-ending** — a Konami-code noir epilogue.
- **Issue #2 teaser** — the finale seeds the next chapter of his career.

---

## 12. BUILD PHASES (the order of work)

> Build continuously, verify in-browser each phase. **Do not commit** until told.
> ⚠️ Per `AGENTS.md`, this is a modified Next.js — read `node_modules/next/dist/docs/`
> before writing framework code. Strip unused Three.js deps early.

- **Phase 0 — Foundation:** scaffold, fonts, design tokens, global ink/halftone/grain CSS,
  zustand store, remove R3F/Three deps.
- **Phase 1 — Engine:** `script.ts` data model + `Comic`/`Chapter`/`Panel` + ScrollTrigger
  scaffold proven on one demo chapter.
- **Phase 2 — Ink library:** the `art/` primitives (skyline, rain, figure, props, bubbles,
  captions, speed lines, halftone).
- **Phase 3 — The story:** author all chapters 0→7 from the script.
- **Phase 4 — Signature FX:** ink-bleed transitions, flashlight cursor, registration glitch.
- **Phase 5 — Atmosphere:** rain canvas + procedural audio + toggles.
- **Phase 6 — Reach:** webtoon/reader mode, reduced-motion, transcript, keyboard nav.
- **Phase 7 — Polish:** "beyond" features, perf pass, `next build`.

---

## 13. STACK (already installed)

Next.js 15.5.19 (App Router, React 19) · GSAP 3 + `@gsap/react` (ScrollTrigger) ·
Framer Motion (UI chrome only) · Zustand · Tailwind 4 + custom ink CSS · inline SVG + filters ·
Web Audio (procedural). **Removing:** three / @react-three/* / postprocessing (unused here).

---

*Awaiting the go-ahead. On your command I start at Phase 0 and build straight through.*
