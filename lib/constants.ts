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
