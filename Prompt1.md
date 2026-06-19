This is for THE ORGANISM portfolio project.
Next.js 14.2.5, Three.js 0.165.0, 
@react-three/fiber 8.16.8.
All @/* aliases map to project root.
OrganismContext exists at @/context/OrganismContext.
Build exactly what is specified — no simplifications.

I am building a portfolio called "THE ORGANISM" — 
a next-level creative developer portfolio that 
renders as a single living biological entity in 
the browser. Portfolio belongs to Vansh Dobariya, 
Full Stack Developer (MERN, Next.js, TypeScript, 
Node.js) based in Ahmedabad, India.

This is PROMPT 01 of 10 — complete project 
foundation. After this prompt the project must 
run with npm run dev with zero errors and zero 
TypeScript complaints.

═══════════════════════════════════════════════
STEP 01 — CREATE NEXT.JS PROJECT
═══════════════════════════════════════════════

Run this exact command:
npx create-next-app@14.2.5 organism-portfolio \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --no-src-dir \
  --import-alias "@/*"

This gives us:
- Next.js 14.2.5 (stable, App Router)
- TypeScript pre-configured
- Tailwind CSS pre-configured  
- ESLint pre-configured
- @/* import alias pre-configured in tsconfig

═══════════════════════════════════════════════
STEP 02 — INSTALL ALL DEPENDENCIES
═══════════════════════════════════════════════

Run this exact command (pinned versions 
prevent dependency conflicts):

npm install \
  three@0.165.0 \
  @react-three/fiber@8.16.8 \
  @react-three/drei@9.105.6 \
  @react-spring/three@9.7.3 \
  gsap@3.12.5 \
  @gsap/react@2.1.1 \
  framer-motion@11.2.10 \
  simplex-noise@4.0.1 \
  tone@15.0.4

Then install dev dependencies:
npm install -D \
  leva@0.9.35 \
  @types/three@0.165.0

CRITICAL: leva is DEV ONLY.
Never import leva in any component file.
It is only used in development for tweaking 
values. Before production build, ensure zero 
imports of 'leva' exist in your codebase.
Check with: grep -r "from 'leva'" ./components

WHY THESE VERSIONS:
- three@0.165.0: stable, full WebGL2 support
- @react-three/fiber@8.16.8: compatible with 
  three@0.165.0, NOT v9 which breaks with this three
- @react-three/drei@9.105.6: must match fiber v8
- @react-spring/three@9.7.3: compatible with fiber v8
- gsap@3.12.5: latest stable with ScrollTrigger
- framer-motion@11.2.10: latest stable Next.js 14 compat
- simplex-noise@4.0.1: ESM-only, needs config below
- tone@15.0.4: latest stable, Web Audio API wrapper
- leva: DEV ONLY — remove before production build

═══════════════════════════════════════════════
STEP 03 — next.config.js (CRITICAL — WITHOUT 
THIS THREE.JS BREAKS IN NEXT.JS 14)
═══════════════════════════════════════════════

Replace the existing next.config.mjs with 
a new file called next.config.js:

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Three.js must be transpiled in Next.js 14:
  transpilePackages: ['three', '@react-three/fiber', 
    '@react-three/drei', '@react-spring/three'],
  
  webpack: (config, { isServer }) => {
    // simplex-noise is ESM-only — webpack needs this:
    config.module.rules.push({
      test: /simplex-noise/,
      type: 'javascript/auto',
    })
    
    // Tone.js requires this to avoid 
    // "self is not defined" on server:
    if (isServer) {
      config.externals.push('tone')
    }
    
    // Prevent sharp from causing issues:
    config.externals.push({ 
      sharp: 'commonjs sharp' 
    })
    
    return config
  },
  
  // Required for Three.js WebGL performance:
  experimental: {
    optimizePackageImports: [
      '@react-three/drei',
      '@react-three/fiber'
    ]
  }
}

module.exports = nextConfig

═══════════════════════════════════════════════
STEP 04 — tsconfig.json COMPLETE
═══════════════════════════════════════════════

Replace entire tsconfig.json with:

{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "next-env.d.ts", 
    "**/*.ts", 
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}

NOTE: "@/*": ["./*"] maps to project root.
So @/components = /components,
@/lib = /lib, @/context = /context, etc.

═══════════════════════════════════════════════
STEP 05 — COMPLETE FOLDER STRUCTURE
═══════════════════════════════════════════════

Create every folder and file listed below.
Create them as EMPTY FILES with correct exports.
We'll fill them in subsequent prompts.

Run these commands:

mkdir -p components/organism/organs
mkdir -p components/ui
mkdir -p hooks
mkdir -p lib
mkdir -p context
mkdir -p public

Create empty placeholder files
(just export empty function for now):

ORGANISM COMPONENTS:
touch components/organism/OrganismCanvas.tsx
touch components/organism/Core.tsx
touch components/organism/NeuralCluster.tsx
touch components/organism/CirculatorySystem.tsx
touch components/organism/ProjectOrgans.tsx
touch components/organism/BlockchainMembrane.tsx
touch components/organism/RhythmOrgan.tsx
touch components/organism/GrowthAxis.tsx
touch components/organism/BreathClock.tsx
touch components/organism/organs/TeamOSOrgan.tsx
touch components/organism/organs/BillStackOrgan.tsx
touch components/organism/organs/GhostDeckOrgan.tsx

UI COMPONENTS:
touch components/ui/LoadingSequence.tsx
touch components/ui/FieldNote.tsx
touch components/ui/FieldNoteManager.tsx
touch components/ui/ContactReveal.tsx
touch components/ui/AudioController.tsx
touch components/ui/CustomCursor.tsx
touch components/ui/Fallback.tsx

HOOKS:
touch hooks/useGitHubData.ts
touch hooks/useCursorThermal.ts
touch hooks/useOrganismPulse.ts
touch hooks/useScrollDepth.ts
touch hooks/useAudioReactive.ts
touch hooks/useThreeDisposal.ts
touch hooks/useKeyboardShortcuts.ts

LIB:
touch lib/colors.ts
touch lib/shaders.ts
touch lib/constants.ts
touch lib/github.ts
touch lib/deviceTier.ts

CONTEXT:
touch context/OrganismContext.tsx
touch context/FieldNoteContext.tsx

Each placeholder file content (copy for each):
export default function Placeholder() { 
  return null 
}

═══════════════════════════════════════════════
STEP 06 — /lib/colors.ts COMPLETE
═══════════════════════════════════════════════

export const COLORS = {
  // BACKGROUNDS
  VOID:        '#04080F',  // deepest background
  MEMBRANE:    '#0A1628',  // organism body tissue
  DORMANT:     '#111D35',  // inactive regions

  // PRIMARY INTERACTIVE
  NEURAL_CYAN: '#00C8FF',  // synapses, data flow, hover
  BIOLUMEN:    '#6B2FEE',  // AI layer, blockchain, violet
  AMBER_PULSE: '#FF7A2F',  // circulatory, warmth, human

  // RARE / HIGH IMPACT
  GROWTH:      '#00E87A',  // heartbeat flash, achievements
                           // USE SPARINGLY — rarity = power

  // TEXT
  TEXT_PRIMARY: '#B8D4E8', // main readable text
  TEXT_DIM:     '#4A6B8A', // labels, annotations, secondary

  // DERIVED (computed from above, for convenience)
  NEURAL_CYAN_30:  'rgba(0, 200, 255, 0.3)',
  NEURAL_CYAN_15:  'rgba(0, 200, 255, 0.15)',
  BIOLUMEN_20:     'rgba(107, 47, 238, 0.2)',
  AMBER_PULSE_40:  'rgba(255, 122, 47, 0.4)',
  GROWTH_12:       'rgba(0, 232, 122, 0.12)',
} as const

// THREE.js compatible (hex numbers, not strings):
export const COLORS_HEX = {
  VOID:         0x04080F,
  MEMBRANE:     0x0A1628,
  DORMANT:      0x111D35,
  NEURAL_CYAN:  0x00C8FF,
  BIOLUMEN:     0x6B2FEE,
  AMBER_PULSE:  0xFF7A2F,
  GROWTH:       0x00E87A,
  TEXT_PRIMARY: 0xB8D4E8,
  TEXT_DIM:     0x4A6B8A,
} as const

// CSS custom properties (use in globals.css):
export const CSS_VARS = `
  --color-void: ${COLORS.VOID};
  --color-membrane: ${COLORS.MEMBRANE};
  --color-neural: ${COLORS.NEURAL_CYAN};
  --color-biolumen: ${COLORS.BIOLUMEN};
  --color-amber: ${COLORS.AMBER_PULSE};
  --color-growth: ${COLORS.GROWTH};
  --color-text: ${COLORS.TEXT_PRIMARY};
  --color-text-dim: ${COLORS.TEXT_DIM};
`

═══════════════════════════════════════════════
STEP 07 — /lib/constants.ts COMPLETE
═══════════════════════════════════════════════

// ─── ORGANISM PHYSICS ─────────────────────────

export const BREATH = {
  RATE_PER_MINUTE: 16,
  PERIOD_MS: 3750,       // 60000 / 16
  INHALE_FRACTION: 0.48,
  HOLD_FRACTION:   0.08,
  EXHALE_FRACTION: 0.44,
  SCALE_MIN: 1.000,
  SCALE_MAX: 1.030,
  FLOAT_AMOUNT: 0.008,   // Y-axis float on inhale (units)
} as const

export const PULSE = {
  INTERVAL_MS: 90000,    // 90 seconds
  FLASH_DURATION_MS: 800,
  DECAY_DURATION_MS: 1500,
  CAMERA_SHAKE_AMOUNT: 0.02,
  CAMERA_SHAKE_DURATION_MS: 400,
} as const

export const CURSOR = {
  THERMAL_RADIUS_PX: 120,
  THERMAL_DECAY_MS:  8000,
  THERMAL_MAX_POINTS: 20,
  THERMAL_MIN_INTENSITY: 0.02, // remove below this
} as const

export const ZOOM = {
  MACRO:  { cameraZ: 3.5, label: 'macro' },
  MESO:   { cameraZ: 1.8, label: 'meso' },
  MICRO:  { cameraZ: 0.6, label: 'micro' },
  TRANSITION_DURATION: 1.2,  // seconds
  TRANSITION_EASE: 'power3.inOut',
} as const

// ─── ORGANISM GEOMETRY ────────────────────────

// The 7 regional bump positions on the organism.
// These are LOCAL positions on a unit sphere,
// used as attraction points for vertex displacement.
// Each region pulls nearby vertices toward itself.
export const REGION_POSITIONS = {
  CORE:                { x:  0.00, y:  0.00, z: 0.10 },
  NEURAL_CLUSTER:      { x: -0.38, y:  0.48, z: 0.20 },
  TEAMOSS_ORGAN:       { x: -0.50, y:  0.00, z: 0.15 },
  BILLSTACK_ORGAN:     { x:  0.50, y:  0.00, z: 0.15 },
  BLOCKCHAIN_MEMBRANE: { x:  0.00, y:  0.00, z: 0.00 }, // outer surface
  RHYTHM_ORGAN:        { x:  0.00, y: -0.50, z: 0.12 },
  GROWTH_AXIS:         { x:  0.00, y:  0.00, z: 0.00 }, // vertical spine
} as const

// Organism base geometry settings:
export const ORGANISM_GEO = {
  BASE_RADIUS: 1.0,
  ICOSAHEDRON_DETAIL: 5,    // ~2562 vertices
  NOISE_SCALE: 0.8,
  NOISE_STRENGTH: 0.14,
  BUMP_STRENGTH: 0.09,      // how much bumps protrude
  BUMP_FALLOFF: 0.35,       // radius of influence per bump
} as const

// ─── GITHUB ───────────────────────────────────

export const GITHUB = {
  USERNAME: 'VanshBD',
  BASE_URL: 'https://api.github.com',
  CACHE_KEY: 'organism_github_cache',
  CACHE_DURATION_MS: 300000,  // 5 minutes
  FALLBACK: {
    contributions: 16500,
    repos: 15,
    recentActivity: 'medium' as const,
    isLive: false,
  }
} as const

// ─── PARTICLE COUNTS BY DEVICE TIER ──────────

export const PARTICLES = {
  high: {
    bloodCells:      180,
    neuralSignals:    45,
    trebleParticles:   8,
    membraneNodes:   320,
  },
  mid: {
    bloodCells:      100,
    neuralSignals:    25,
    trebleParticles:   4,
    membraneNodes:   160,
  },
  low: {
    bloodCells:       60,
    neuralSignals:    15,
    trebleParticles:   2,
    membraneNodes:    80,
  },
} as const

// ─── ANIMATION TIMING ─────────────────────────

export const TIMING = {
  FIELD_NOTE_ENTER_MS:  300,
  FIELD_NOTE_EXIT_MS:   150,
  ORGAN_ACTIVATE_MS:    600,
  ORGAN_DEACTIVATE_MS:  400,
  CONTACT_HOVER_MS:    3000,  // hover duration to reveal
  AUDIO_SUGGEST_APPEAR_MS: 30000,
  AUDIO_SUGGEST_HIDE_MS:   40000,
  TAB_TITLE_RESTORE_MS:  2000,
} as const

// ─── CAREER DATA ──────────────────────────────

export const CAREER = [
  {
    id: 'swift_rut',
    company: 'Swift Rut Technologies',
    role: 'Full Stack Developer / Backend Lead',
    period: 'Mar 2024 – Feb 2025',
    spineT: 0.18,   // position on spine curve (0-1)
    nodeSize: 0.018,
    ringSize: 0.032,
    opacityFraction: 0.50,
    detail: 'Backend Lead · 5 enterprise apps · ' +
            '6-person team · WebSocket + AI integration',
    era: 'SWIFT_RUT',
  },
  {
    id: 'aum',
    company: 'Aum Industries',
    role: 'Full Stack Developer',
    period: 'Apr 2025 – Jan 2026',
    spineT: 0.50,
    nodeSize: 0.025,
    ringSize: 0.042,
    opacityFraction: 0.75,
    detail: '-48% API response · Redis + MongoDB · ' +
            '6 enterprise systems · RBAC across 4 apps',
    era: 'AUM',
  },
  {
    id: 'freelance',
    company: 'Freelance',
    role: 'Full Stack Developer',
    period: 'Feb 2026 – Present',
    spineT: 0.75,
    nodeSize: 0.035,
    ringSize: 0.055,
    opacityFraction: 1.00,
    detail: 'Full ownership · 3+ clients · ' +
            '60%+ automation via Claude + Gemini',
    era: 'FREELANCE',
  },
] as const

export const EDUCATION = {
  id: 'bca',
  institution: 'Swarnim Startup & Innovation University',
  degree: 'Bachelor of Computer Applications',
  period: 'Jun 2023 – Jul 2026',
  spineT: 0.28,
  spineOffsetX: 0.18,  // floats to the right of spine
} as const

// ─── FIELD NOTES ──────────────────────────────

export const FIELD_NOTES = [
  {
    id: 'core',
    region: 'CORE',
    triggerDelayMs: 500,
    text: 'The system runs at its own rate. ' +
          'High-commit weeks, the heart beats faster. ' +
          'Rest days, it slows. This is not affectation' +
          ' — it is live GitHub data.',
    positionHint: 'right' as const,
  },
  {
    id: 'neural',
    region: 'NEURAL_CLUSTER',
    triggerDelayMs: 0,
    text: '162 problems solved. 33 of them hard. ' +
          'The number matters less than the habit — ' +
          'every day, a new constraint to think through.',
    positionHint: 'right' as const,
  },
  {
    id: 'teamoss',
    region: 'TEAMOSS',
    triggerDelayMs: 0,
    text: '800 concurrent WebSocket connections at ' +
          'sub-120ms latency. The architecture was ' +
          'designed to never feel crowded.',
    positionHint: 'left' as const,
  },
  {
    id: 'billstack',
    region: 'BILLSTACK',
    triggerDelayMs: 0,
    text: 'The API factory was not planned. It appeared' +
          ' after writing the same CRUD block for the ' +
          'third time. Repetition is an architecture signal.',
    positionHint: 'right' as const,
  },
  {
    id: 'ghostdeck',
    region: 'GHOSTDECK',
    triggerDelayMs: 0,
    text: 'Still forming. The idea: eliminate the hardware' +
          ' entirely. Your hands become the instrument. ' +
          'Phase 1 in progress.',
    positionHint: 'left' as const,
  },
  {
    id: 'membrane',
    region: 'BLOCKCHAIN_MEMBRANE',
    triggerDelayMs: 800,
    text: 'The infrastructure question is not how to build' +
          ' on top of the chain. It is how to redesign ' +
          'what the chain is.',
    positionHint: 'right' as const,
  },
  {
    id: 'axis',
    region: 'GROWTH_AXIS',
    triggerDelayMs: 0,
    text: 'The axis has no endpoint. The most interesting' +
          ' region is always the one being built right now.',
    positionHint: 'right' as const,
  },
  {
    id: 'rhythm',
    region: 'RHYTHM_ORGAN',
    triggerDelayMs: 0,
    text: 'Not everything connects to output. ' +
          'Some things just need to exist.',
    positionHint: 'left' as const,
  },
] as const

// ─── BLOCKCHAIN CONCEPTS ──────────────────────

export const BLOCKCHAIN_CONCEPTS = [
  {
    id: 'zerolaw',
    name: 'ZEROLAW',
    brief: 'Decentralized autonomous legal arbitration ' +
           'protocol — dispute resolution without courts.',
    membranePosition: { x: 0.6,  y: 0.7,  z: 0.5 },
    geometryType: 'tetrahedron' as const,
  },
  {
    id: 'chronostate',
    name: 'CHRONOSTATE',
    brief: 'Temporal state management for blockchain — ' +
           'historical state guaranteed provably.',
    membranePosition: { x: -0.7, y: 0.6,  z: 0.4 },
    geometryType: 'chamfered-box' as const,
  },
  {
    id: 'nexus',
    name: 'NEXUS',
    brief: 'Real-world credential mirroring on-chain — ' +
           'verified identity infrastructure.',
    membranePosition: { x: 0.9,  y: 0.1,  z: 0.4 },
    geometryType: 'sphere-cluster' as const,
  },
  {
    id: 'darkpool',
    name: 'DARKPOOL PROTOCOL',
    brief: 'Zero-knowledge trade execution — ' +
           'privacy-preserving DeFi liquidity.',
    membranePosition: { x: 0.5,  y: -0.7, z: 0.5 },
    geometryType: 'hollow-sphere' as const,
  },
  {
    id: 'consensus_immune',
    name: 'CONSENSUS IMMUNE',
    brief: 'Self-healing blockchain consensus — ' +
           'AI-powered attack resistance.',
    membranePosition: { x: -0.6, y: -0.6, z: 0.5 },
    geometryType: 'irregular-icosahedron' as const,
  },
  {
    id: 'nervemesh',
    name: 'NERVEMESH',
    brief: 'Distributed sensor network protocol — ' +
           'physical world to blockchain bridge.',
    membranePosition: { x: 0.0,  y: 0.9,  z: 0.4 },
    geometryType: 'spiky-sphere' as const,
  },
] as const

═══════════════════════════════════════════════
STEP 08 — tailwind.config.ts WITH ORGANISM COLORS
═══════════════════════════════════════════════

Replace tailwind.config.ts with:

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        void:     '#04080F',
        membrane: '#0A1628',
        dormant:  '#111D35',
        neural:   '#00C8FF',
        biolumen: '#6B2FEE',
        amber:    '#FF7A2F',
        growth:   '#00E87A',
        'text-primary': '#B8D4E8',
        'text-dim':     '#4A6B8A',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        mono:    ['var(--font-mono)', 'monospace'],
      },
      animation: {
        'breath': 'breath 3.75s ease-in-out infinite',
        'pulse-growth': 'pulseGrowth 0.8s ease-out',
      },
      keyframes: {
        breath: {
          '0%, 100%': { transform: 'scale(1.000)' },
          '56%':      { transform: 'scale(1.030)' },
          '64%':      { transform: 'scale(1.030)' },
        },
        pulseGrowth: {
          '0%':   { opacity: '0', transform: 'scale(0.9)' },
          '50%':  { opacity: '1', transform: 'scale(1.05)' },
          '100%': { opacity: '1', transform: 'scale(1.0)' },
        },
      },
      transitionTimingFunction: {
        'organism': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}

export default config

═══════════════════════════════════════════════
STEP 09 — app/globals.css COMPLETE
═══════════════════════════════════════════════

Replace globals.css entirely with:

@tailwind base;
@tailwind components;
@tailwind utilities;

/* ─── CSS CUSTOM PROPERTIES ──────────────── */
:root {
  --color-void:      #04080F;
  --color-membrane:  #0A1628;
  --color-neural:    #00C8FF;
  --color-biolumen:  #6B2FEE;
  --color-amber:     #FF7A2F;
  --color-growth:    #00E87A;
  --color-text:      #B8D4E8;
  --color-text-dim:  #4A6B8A;
  --transition-organism: cubic-bezier(0.16, 1, 0.3, 1);
}

/* ─── RESET & BASE ───────────────────────── */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  width: 100%;
  height: 100%;
  /* No scroll — organism fills viewport */
  overflow: hidden;
  background-color: var(--color-void);
  color: var(--color-text);
  
  /* Apply fonts via CSS vars set by next/font */
  font-family: var(--font-mono), monospace;
}

/* ─── HIDE SCROLLBAR COMPLETELY ─────────── */
/* Chrome, Safari, Edge */
::-webkit-scrollbar { display: none; }
/* Firefox */
html { scrollbar-width: none; }
/* IE */
html { -ms-overflow-style: none; }

/* ─── CUSTOM CURSOR ──────────────────────── */
/* Hide system cursor — replaced by CustomCursor.tsx */
* { cursor: none !important; }
/* Re-enable on mobile (no hover available): */
@media (hover: none) {
  * { cursor: auto !important; }
}

/* ─── TEXT SELECTION ─────────────────────── */
::selection {
  background: rgba(0, 200, 255, 0.25);
  color: var(--color-text);
}

/* ─── SEMANTIC SEO LAYER ─────────────────── */
/* Invisible to humans, readable by crawlers */
.sr-layer {
  position: absolute;
  inset: 0;
  z-index: 0;
  opacity: 0;
  pointer-events: none;
  overflow: hidden;
  /* aria-hidden: false is set in JSX — 
     screen readers CAN read this */
}

/* ─── THREE.JS CANVAS ────────────────────── */
canvas {
  display: block;
  outline: none;
}

/* ─── ORGANISM UI OVERLAYS ───────────────── */
.organism-ui {
  position: fixed;
  inset: 0;
  z-index: 100;
  pointer-events: none;
}
/* Children that need interaction re-enable it: */
.organism-ui .interactive {
  pointer-events: auto;
}

/* ─── FIELD NOTE ─────────────────────────── */
.field-note {
  position: fixed;
  background: rgba(10, 22, 40, 0.92);
  border: 1px solid rgba(0, 200, 255, 0.25);
  border-left: 3px solid rgba(0, 200, 255, 0.8);
  border-radius: 0 4px 4px 4px;
  padding: 12px 16px;
  max-width: 280px;
  font-family: var(--font-mono), monospace;
  font-size: 13px;
  line-height: 1.6;
  color: var(--color-text);
  pointer-events: none;
  z-index: 1000;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 0 20px rgba(0, 200, 255, 0.06);
}

/* ─── GLOBAL TRANSITION DEFAULT ─────────── */
/* Any element with data-organism-transition 
   gets the organism easing by default */
[data-organism-transition] {
  transition-timing-function: 
    var(--transition-organism);
}

═══════════════════════════════════════════════
STEP 10 — app/layout.tsx COMPLETE
═══════════════════════════════════════════════

import type { Metadata } from 'next'
import { Space_Grotesk, JetBrains_Mono } 
  from 'next/font/google'
import './globals.css'

// Space Grotesk — display font
// Character: geometric, engineered, slight personality
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  preload: true,
  weight: ['300', '400', '500', '600', '700'],
})

// JetBrains Mono — body/code font  
// Used for: annotations, metrics, code, all body text
// Keeps "code" and "thought" visually unified
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  preload: true,
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://vanshdobariya.dev'),
  title: {
    default: 'Vansh Dobariya | Full Stack Developer',
    template: '%s | Vansh Dobariya',
  },
  description:
    'Full Stack Developer with 2+ years building 15+ ' +
    'production applications. MERN, Next.js, TypeScript, ' +
    'Node.js, WebSockets, Redis. Claude API and Gemini AI ' +
    'integration. 16,500+ GitHub contributions. Available ' +
    'for remote opportunities.',
  keywords: [
    'Full Stack Developer India',
    'MERN Stack Developer Ahmedabad',
    'Next.js TypeScript Developer',
    'Node.js WebSocket Developer',
    'Remote Full Stack Developer',
    'Claude API Integration Developer',
    'Gemini API Developer',
    'React Node.js MongoDB Developer',
    'WebSocket WebRTC Developer',
    'AI Integration Full Stack',
    'Express.js Redis Developer',
    'Freelance Full Stack Developer',
  ],
  authors: [{ name: 'Vansh Dobariya' }],
  creator: 'Vansh Dobariya',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://vanshdobariya.dev',
    siteName: 'Vansh Dobariya — The Organism',
    title: 'Vansh Dobariya | Full Stack Developer',
    description:
      'A living system. 15+ production apps. ' +
      'MERN · Next.js · AI Integration.',
    images: [{
      url: '/og',
      width: 1200,
      height: 630,
      alt: 'The Organism — Vansh Dobariya Portfolio',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vansh Dobariya | Full Stack Developer',
    description:
      'MERN · Next.js · AI Integration · WebSockets · ' +
      '15+ production apps.',
    images: ['/og'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

// JSON-LD structured data for Google:
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Vansh Dobariya',
  jobTitle: 'Full Stack Developer',
  url: 'https://vanshdobariya.dev',
  email: 'vanshbdobariya1312@gmail.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Ahmedabad',
    addressRegion: 'Gujarat',
    addressCountry: 'IN',
  },
  sameAs: [
    'https://github.com/VanshBD',
    'https://linkedin.com/in/vanshdobariya',
  ],
  knowsAbout: [
    'JavaScript', 'TypeScript', 'Node.js',
    'React', 'Next.js', 'MongoDB', 'Redis',
    'WebSockets', 'REST API', 'GraphQL',
    'Claude API', 'Gemini API', 'Docker',
    'Nginx', 'PM2', 'GCP', 'Microservices',
  ],
  hasOccupation: {
    '@type': 'Occupation',
    name: 'Full Stack Developer',
    skills: 'MERN, Next.js, TypeScript, Node.js, ' +
            'WebSockets, AI Integration',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html 
      lang="en"
      className={`
        ${spaceGrotesk.variable} 
        ${jetbrainsMono.variable}
      `}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}

═══════════════════════════════════════════════
STEP 11 — app/page.tsx SHELL (grows in Prompt 10)
═══════════════════════════════════════════════

'use client'

export default function HomePage() {
  return (
    <main>
      <p style={{ 
        color: '#00C8FF', 
        fontFamily: 'monospace',
        padding: 24 
      }}>
        THE ORGANISM — Foundation ready.
        Prompt 01 complete.
      </p>
    </main>
  )
}

═══════════════════════════════════════════════
STEP 12 — VERIFY EVERYTHING WORKS
═══════════════════════════════════════════════

Run: npm run dev

Expected result:
- Compiles with zero errors
- Zero TypeScript errors  
- Page shows "THE ORGANISM — Foundation ready"
- No console errors

Run: npm run build

Expected result:
- Builds successfully
- No type errors
- No missing module errors

If you see "Cannot find module 'three'":
→ You missed Step 02. Re-run the install command.

If you see "Module not found: @/*":
→ Check tsconfig.json paths matches Step 04 exactly.

If you see "transpilePackages error":
→ Ensure next.config.js (not .mjs) per Step 03.

After all checks pass — 
foundation is 100% complete.
Move to PROMPT 02.