import type { ComicScript } from "./types";

/* ============================================================
   THE STORY. Components render this — they never hard-code prose.
   Chapter 0 (cold open) is fully illustrated; chapters 1–7 scaffold
   the engine and carry real dossiers, with art filled in Phase 2–3.
   ============================================================ */

export const script: ComicScript = {
  series: "NULL CITY",
  issue: "Issue #1",
  chapters: [
    /* ─── CH 0 · COLD OPEN — the hero ───────────────────────────── */
    {
      id: "ch0",
      kicker: "COLD OPEN",
      title: "Null City",
      spot: "none",
      panels: [
        {
          id: "ch0-cover",
          layout: "splash",
          paper: true,
          layers: [{ kind: "cover", depth: "bg", props: {} }],
        },
        {
          id: "ch0-p1",
          layout: "splash",
          layers: [
            { kind: "skyline", depth: "bg", props: { variation: "downtown" } },
            { kind: "rain", depth: "mid", props: { density: "heavy" } },
            { kind: "neon-sign", depth: "fg", props: { text: "SEGFAULT", sub: "OPEN ALL NIGHT", flicker: true } },
          ],
          captions: [
            { text: "They said it couldn't be built.", at: { x: 0.06, y: 0.1 }, voice: "narration" },
            { text: "They were right about everything else.", at: { x: 0.06, y: 0.2 }, voice: "narration" },
          ],
        },
        {
          id: "ch0-p2",
          layout: "full",
          dark: true,
          layers: [
            { kind: "window-rain", depth: "bg", props: { time: "night" } },
            { kind: "desk-glow", depth: "mid", props: { monitors: 3, coffee: true } },
            { kind: "figure", depth: "fg", props: { pose: "typing" } },
          ],
          captions: [
            { text: "The city never sleeps.", at: { x: 0.05, y: 0.09 }, voice: "narration" },
            { text: "Neither do the servers.", at: { x: 0.05, y: 0.18 }, voice: "narration" },
            { text: "That's where I come in.", at: { x: 0.05, y: 0.27 }, voice: "narration" },
          ],
        },
      ],
    },

    /* ─── CH 1 · THE DEBUGGER — origin ──────────────────────────── */
    {
      id: "ch1",
      kicker: "CHAPTER ONE",
      title: "The Debugger",
      spot: "none",
      panels: [
        {
          id: "ch1-p1",
          layout: "full",
          dark: true,
          layers: [
            { kind: "desk-glow", depth: "bg", props: { monitors: 3, coffee: true } },
            { kind: "figure", depth: "fg", props: { pose: "thinking" } },
          ],
          captions: [
            { text: "Name: Vansh Dobariya.", at: { x: 0.05, y: 0.09 }, voice: "narration" },
            { text: "Occupation: freelance debugger.", at: { x: 0.05, y: 0.18 }, voice: "narration" },
            { text: "Hours: the kind no one else wants.", at: { x: 0.05, y: 0.27 }, voice: "narration" },
          ],
        },
        {
          id: "ch1-p2",
          layout: "full",
          layers: [{ kind: "rap-sheet", depth: "bg", props: {} }],
          captions: [
            { text: "The rap sheet:", at: { x: 0.05, y: 0.09 }, voice: "narration" },
            { text: "Frontend. Backend. AI. Blockchain. Known to ship under pressure.", at: { x: 0.05, y: 0.18 }, voice: "narration" },
          ],
        },
        {
          id: "ch1-p3",
          layout: "full",
          layers: [
            { kind: "typescript-figure", depth: "mid", props: {} },
            { kind: "figure", depth: "fg", props: { pose: "standing" } },
          ],
          captions: [
            { text: "Then she walked in.", at: { x: 0.05, y: 0.09 }, voice: "narration" },
            { text: "She wore strict types and a look that said: refactor.", at: { x: 0.05, y: 0.18 }, voice: "narration" },
          ],
          bubbles: [{ speaker: "TYPESCRIPT", text: "You've been any-ing again.", at: { x: 0.66, y: 0.42 }, tail: "left" }],
        },
        {
          id: "ch1-p4",
          layout: "full",
          dark: true,
          layers: [{ kind: "phone-ring", depth: "fg", props: {} }],
          captions: [
            { text: "Then the phone rang.", at: { x: 0.05, y: 0.09 }, voice: "narration" },
            { text: "It always does.", at: { x: 0.05, y: 0.18 }, voice: "narration" },
          ],
          sfx: [{ text: "RIIING", at: { x: 0.58, y: 0.34 }, rotate: -8 }],
        },
      ],
    },

    /* ─── CH 2 · CASE FILE 01: THE LONG CON → Pravasa ───────────── */
    {
      id: "ch2",
      kicker: "CASE FILE 01",
      title: "The Long Con",
      spot: "cyan",
      panels: [
        {
          id: "ch2-p1",
          layout: "full",
          layers: [{ kind: "map-wall", depth: "bg", props: {} }],
          captions: [{ text: "The case: a travel empire. Bookings across continents. Real-time. Always-on.", at: { x: 0.05, y: 0.09 }, voice: "narration" }],
          bubbles: [{ speaker: "CLIENT", text: "We need it to work everywhere. All at once.", at: { x: 0.66, y: 0.55 }, tail: "left" }],
        },
        {
          id: "ch2-p2",
          layout: "wide",
          layers: [{ kind: "journey-map", depth: "bg", props: {} }],
          captions: [
            { text: "Pravasa-Transworld. The long con: make the world small.", at: { x: 0.05, y: 0.09 }, voice: "narration" },
            { text: "JWT auth. Razorpay. An admin who sees everything.", at: { x: 0.05, y: 0.18 }, voice: "narration" },
          ],
        },
        {
          id: "ch2-p3",
          layout: "full",
          layers: [{ kind: "payment-cleared", depth: "bg", props: { spot: "cyan" } }],
          captions: [{ text: "The payment cleared. Case closed.", at: { x: 0.05, y: 0.09 }, voice: "narration" }],
          sfx: [{ text: "CLEARED", at: { x: 0.5, y: 0.5 }, rotate: -3 }],
        },
      ],
      dossier: {
        project: "Pravasa-Transworld",
        realStory: "Full-stack travel booking platform with real-time seat availability, Razorpay payments, JWT auth, and a role-based admin dashboard and user portal.",
        techStack: ["React", "Node.js", "Express", "MongoDB", "Razorpay", "JWT"],
        github: "https://github.com/VanshBD/Pravasa-Transworld",
      },
    },

    /* ─── CH 3 · CASE FILE 02: THE VILLAIN → BillStack ──────────── */
    {
      id: "ch3",
      kicker: "CASE FILE 02",
      title: "The Villain",
      spot: "danger",
      panels: [
        {
          id: "ch3-p1",
          layout: "full",
          dark: true,
          layers: [{ kind: "alarm-pager", depth: "bg", props: { time: "02:13" } }],
          captions: [
            { text: "2:13 a.m.", at: { x: 0.05, y: 0.09 }, voice: "narration" },
            { text: "The pager went off. Money on the line. Invoices bleeding.", at: { x: 0.05, y: 0.18 }, voice: "narration" },
          ],
          sfx: [{ text: "BZZZT", at: { x: 0.58, y: 0.42 }, rotate: -5 }],
        },
        {
          id: "ch3-p2",
          layout: "full",
          dark: true,
          layers: [{ kind: "war-room", depth: "bg", props: {} }],
          captions: [{ text: "The war room. Cold coffee. The bug: somewhere in the ledger.", at: { x: 0.05, y: 0.09 }, voice: "narration" }],
          bubbles: [{ speaker: "THE BUG", text: "You'll never trace me.", at: { x: 0.68, y: 0.45 }, tail: "left" }],
        },
        {
          id: "ch3-p3",
          layout: "splash",
          layers: [{ kind: "clock-fix", depth: "bg", props: { time: "02:47" } }],
          captions: [{ text: "02:47. The fix landed. Every invoice whole again.", at: { x: 0.05, y: 0.09 }, voice: "narration" }],
          sfx: [{ text: "FIXED", at: { x: 0.5, y: 0.55 }, rotate: 0 }],
        },
      ],
      dossier: {
        project: "BillStack",
        realStory: "Invoice management app with PDF generation, email delivery, and dashboard analytics. The villain: floating-point arithmetic in tax math drifting invoice totals by fractions.",
        techStack: ["React", "Express", "PDFKit", "MongoDB", "Nodemailer"],
        github: "https://github.com/VanshBD/BillStack",
      },
    },

    /* ─── CH 4 · CASE FILE 03: THE HEIST → TeamOS ───────────────── */
    {
      id: "ch4",
      kicker: "CASE FILE 03",
      title: "The Heist",
      spot: "green",
      panels: [
        {
          id: "ch4-p1",
          layout: "full",
          layers: [{ kind: "crew-grid", depth: "bg", props: { count: 6 } }],
          captions: [
            { text: "Every heist needs a crew.", at: { x: 0.05, y: 0.09 }, voice: "narration" },
            { text: "TeamOS: real-time. The whole room, even from across the planet.", at: { x: 0.05, y: 0.18 }, voice: "narration" },
          ],
        },
        {
          id: "ch4-p2",
          layout: "full",
          dark: true,
          layers: [{ kind: "deploy-countdown", depth: "bg", props: {} }],
          captions: [{ text: "The countdown. Prod at the end of the tunnel.", at: { x: 0.05, y: 0.09 }, voice: "narration" }],
          sfx: [{ text: "T-MINUS 10", at: { x: 0.5, y: 0.45 }, rotate: 0 }],
        },
        {
          id: "ch4-p3",
          layout: "splash",
          layers: [{ kind: "lock-open", depth: "bg", props: { spot: "green" } }],
          captions: [{ text: "Green build. The lock clicked open. Deployed.", at: { x: 0.05, y: 0.09 }, voice: "narration" }],
          sfx: [{ text: "CLICK", at: { x: 0.5, y: 0.55 }, rotate: -4 }],
        },
      ],
      dossier: {
        project: "TeamOS",
        realStory: "Real-time collaboration platform: Socket.io live presence, Redis session state, and a shared workspace keeping distributed teams in sync through deployments.",
        techStack: ["React", "Socket.io", "Node.js", "Redis", "MongoDB"],
        github: "https://github.com/VanshBD/TeamOS",
      },
    },

    /* ─── CH 5 · CASE FILE 04: THE DUEL → PromptWars ────────────── */
    {
      id: "ch5",
      kicker: "CASE FILE 04",
      title: "The Duel",
      spot: "violet",
      panels: [
        {
          id: "ch5-p1",
          layout: "splash",
          layers: [{ kind: "arena", depth: "bg", props: {} }],
          captions: [{ text: "The arena. Prompt against prompt. Live. Scored. Brutal.", at: { x: 0.05, y: 0.09 }, voice: "narration" }],
        },
        {
          id: "ch5-p2",
          layout: "full",
          layers: [{ kind: "prompt-duel", depth: "bg", props: { spot: "violet" } }],
          captions: [{ text: "She was at my side the whole time.", at: { x: 0.05, y: 0.09 }, voice: "narration" }],
          bubbles: [{ speaker: "TYPESCRIPT", text: "Type the response. Strictly.", at: { x: 0.64, y: 0.38 }, tail: "left" }],
        },
        {
          id: "ch5-p3",
          layout: "wide",
          layers: [{ kind: "leaderboard", depth: "bg", props: { spot: "violet" } }],
          captions: [{ text: "The leaderboard updated in real-time.", at: { x: 0.05, y: 0.09 }, voice: "narration" }],
          sfx: [{ text: "WINNER", at: { x: 0.5, y: 0.5 }, rotate: -2 }],
        },
        {
          id: "ch5-p4",
          layout: "full",
          layers: [{ kind: "typescript-reveal", depth: "fg", props: {} }],
          captions: [{ text: "She smiled. First time.", at: { x: 0.05, y: 0.09 }, voice: "narration" }],
          bubbles: [{ speaker: "TYPESCRIPT", text: "Told you. Complicated.", at: { x: 0.62, y: 0.42 }, tail: "left" }],
        },
      ],
      dossier: {
        project: "PromptWars",
        realStory: "AI prompt-battle platform: real-time competition, WebSocket-synced leaderboards, OpenAI evaluation, live scoring — TypeScript enforced end-to-end.",
        techStack: ["TypeScript", "Next.js", "WebSocket", "OpenAI API", "MongoDB"],
        github: "https://github.com/VanshBD/PromptWars",
      },
    },

    /* ─── CH 6 · CASE FILE 05: THE TWIST → PHANTOM-CARBON ───────── */
    {
      id: "ch6",
      kicker: "CASE FILE 05",
      title: "The Twist",
      spot: "emerald",
      panels: [
        {
          id: "ch6-p1",
          layout: "full",
          dark: true,
          layers: [{ kind: "ghost-protocol", depth: "bg", props: {} }],
          captions: [
            { text: "Ghost protocol. A ledger no one can forge.", at: { x: 0.05, y: 0.09 }, voice: "narration" },
            { text: "Ghosts made accountable.", at: { x: 0.05, y: 0.18 }, voice: "narration" },
          ],
        },
        {
          id: "ch6-p2",
          layout: "full",
          layers: [{ kind: "chain-lock", depth: "bg", props: { spot: "emerald" } }],
          captions: [{ text: "The chain. Block by block. Immutable.", at: { x: 0.05, y: 0.09 }, voice: "narration" }],
          sfx: [{ text: "LOCKED", at: { x: 0.56, y: 0.5 }, rotate: -5 }],
        },
        {
          id: "ch6-p3",
          layout: "splash",
          layers: [{ kind: "power-on", depth: "bg", props: { spot: "emerald" } }],
          captions: [
            { text: "A new power switched on.", at: { x: 0.05, y: 0.09 }, voice: "narration" },
            { text: "The twist: blockchain isn't the future. It's right now.", at: { x: 0.05, y: 0.18 }, voice: "narration" },
          ],
        },
      ],
      dossier: {
        project: "PHANTOM-CARBON",
        realStory: "Blockchain carbon-credit platform: Solidity smart contracts on Ethereum, Ethers.js Web3 integration, on-chain verification of carbon-offset transactions.",
        techStack: ["TypeScript", "Ethers.js", "Solidity", "React", "Web3.js"],
        github: "https://github.com/VanshBD/PHANTOM-CARBON",
      },
    },

    /* ─── CH 7 · FINALE — contact ───────────────────────────────── */
    {
      id: "ch7",
      kicker: "FINALE",
      title: "To Be Continued",
      spot: "none",
      panels: [
        {
          id: "ch7-p1",
          layout: "splash",
          layers: [
            { kind: "dawn", depth: "bg", props: {} },
            { kind: "figure", depth: "fg", props: { pose: "standing", facing: "reader" } },
          ],
          captions: [
            { text: "Five cases. One developer. The rain was easing.", at: { x: 0.05, y: 0.09 }, voice: "narration" },
            { text: "For the first time in weeks, I looked up.", at: { x: 0.05, y: 0.18 }, voice: "narration" },
          ],
        },
        {
          id: "ch7-p2",
          layout: "splash",
          layers: [{ kind: "finale-splash", depth: "bg", props: {} }],
        },
        {
          id: "ch7-p3",
          layout: "full",
          layers: [{ kind: "contact-tabs", depth: "bg", props: {} }],
        },
      ],
    },
  ],
};
