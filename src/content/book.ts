/* ============================================================
   THE BOOK THAT WRITES ITSELF — Vansh Dobariya
   All content lives here. Components render; they don't write prose.
   ============================================================ */

export const book = {
  meta: {
    name: "Vansh Dobariya",
    tagline: "Full Stack Developer",
    subtitle: "Ahmedabad, India · est. 2020",
    publisherMark: "VD",
    bio: "Five years in the trenches. Frontend. Backend. AI. Blockchain. The kind of developer who shows up at 2 am when the invoice system breaks — and goes home only when the fix lands.",
    bioLines: [
      "Five years in the trenches.",
      "Frontend. Backend. AI. Blockchain.",
      "The kind of developer who shows up at 2 am when the invoice system breaks",
      "— and goes home only when the fix lands.",
    ],
    skills: [
      "React", "Next.js", "Node.js", "TypeScript",
      "MongoDB", "Socket.io", "Solidity", "Python",
      "Express", "Redis", "Ethers.js", "REST APIs",
    ],
    contact: {
      email: "vanshbdobariya1312@gmail.com",
      github: "https://github.com/VanshBD",
      githubLabel: "VanshBD",
    },
  },

  chapters: [
    {
      id: "pravasa",
      number: "01",
      title: "The Long Con",
      project: "Pravasa-Transworld",
      tagline: "A travel empire. Bookings across continents. Real-time. Always-on.",
      description:
        "Full-stack travel booking platform with real-time seat availability, Razorpay payments, JWT authentication, and a role-based admin dashboard and user portal. Made the world small.",
      techStack: ["React", "Node.js", "Express", "MongoDB", "Razorpay", "JWT"],
      github: "https://github.com/VanshBD/Pravasa-Transworld",
      artKind: "pravasa",
      marginNote: "The payment cleared.\nCase closed.",
      annotation: "→ live · 3 roles · 12 routes",
    },
    {
      id: "billstack",
      number: "02",
      title: "The Villain",
      project: "BillStack",
      tagline: "2 am. Pager goes off. Money on the line.",
      description:
        "Invoice management with PDF generation, email delivery, and dashboard analytics. The villain was floating-point arithmetic in tax calculations — drifting totals by fractions of a cent, silently, for weeks.",
      techStack: ["React", "Express", "PDFKit", "MongoDB", "Nodemailer"],
      github: "https://github.com/VanshBD/BillStack",
      artKind: "billstack",
      marginNote: "02:47 —\nFixed. Every invoice\nwhole again.",
      annotation: "→ PDF · email · analytics",
    },
    {
      id: "teamos",
      number: "03",
      title: "The Heist",
      project: "TeamOS",
      tagline: "Every heist needs a crew. And a war room.",
      description:
        "Real-time collaboration platform with Socket.io live presence, Redis session state, and a shared workspace keeping distributed teams in sync through every deployment. Green build. Lock clicked open.",
      techStack: ["React", "Socket.io", "Node.js", "Redis", "MongoDB"],
      github: "https://github.com/VanshBD/TeamOS",
      artKind: "teamos",
      marginNote: "Green build.\nDeployed.",
      annotation: "→ live sync · Redis · WebSocket",
    },
    {
      id: "promptwars",
      number: "04",
      title: "The Duel",
      project: "PromptWars",
      tagline: "Prompt against prompt. Live. Scored. Brutal.",
      description:
        "AI prompt-battle platform with real-time competition, WebSocket-synced leaderboards, and OpenAI evaluation. TypeScript enforced end-to-end. The leaderboard updated while you watched.",
      techStack: ["TypeScript", "Next.js", "WebSocket", "OpenAI API", "MongoDB"],
      github: "https://github.com/VanshBD/PromptWars",
      artKind: "promptwars",
      marginNote: "Winner.",
      annotation: "→ real-time · AI-scored · TS",
    },
    {
      id: "phantom",
      number: "05",
      title: "The Twist",
      project: "PHANTOM-CARBON",
      tagline: "A ledger no one can forge. Ghosts made accountable.",
      description:
        "Blockchain carbon-credit platform with Solidity smart contracts on Ethereum, Ethers.js Web3 integration, and on-chain verification of carbon-offset transactions. The twist: it was never about the tech.",
      techStack: ["TypeScript", "Ethers.js", "Solidity", "React", "Web3.js"],
      github: "https://github.com/VanshBD/PHANTOM-CARBON",
      artKind: "phantom",
      marginNote: "Immutable.\nLocked.\nDone.",
      annotation: "→ Ethereum · on-chain · Solidity",
    },
  ],
} as const;

export type Chapter = (typeof book.chapters)[number];
