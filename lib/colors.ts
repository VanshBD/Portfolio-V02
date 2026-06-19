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
