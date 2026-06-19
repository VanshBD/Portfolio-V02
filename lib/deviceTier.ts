export type DeviceTier = 'high' | 'mid' | 'low'

export const getDeviceTier = (): DeviceTier => {
  if (typeof window === 'undefined') return 'mid'

  const cores = navigator.hardwareConcurrency ?? 4
  const memory = (navigator as Navigator & { deviceMemory?: number })
    .deviceMemory ?? 4
  const isMobile = /iPhone|iPad|Android|Mobile/i
    .test(navigator.userAgent)
  const isTablet = /iPad|Tablet/i
    .test(navigator.userAgent)

  if (isMobile && !isTablet) return 'low'
  if (cores <= 2 || memory <= 2)  return 'low'
  if (cores <= 4 || memory <= 4)  return 'mid'
  return 'high'
}

// Sequence duration by tier:
export const SEQUENCE_DURATION = {
  high: 4200,   // full 4.2s experience
  mid:  3400,   // 3.4s — skip some subdivision steps
  low:  2600,   // 2.6s — compressed, still beautiful
} as const
