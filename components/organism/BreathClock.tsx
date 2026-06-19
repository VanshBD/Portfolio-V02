// BreathClock lives INSIDE the R3F Canvas.
// It uses useFrame (only available inside Canvas)
// to compute breath phase every frame and
// emit it via a window CustomEvent.
// OrganismContext listens to this event and
// notifies subscribers WITHOUT React re-renders.

'use client'

import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { BREATH } from '@/lib/constants'

export function BreathClock() {
  const lastPhaseRef = useRef(-1)

  useFrame(() => {
    const now = Date.now()
    const cyclePos = (now % BREATH.PERIOD_MS) /
      BREATH.PERIOD_MS // 0-1

    let phase: number

    if (cyclePos < BREATH.INHALE_FRACTION) {
      // INHALE: 0→1 with smooth ease
      const t = cyclePos / BREATH.INHALE_FRACTION
      // Smoothstep (ease in-out):
      phase = t * t * (3.0 - 2.0 * t)

    } else if (cyclePos <
      BREATH.INHALE_FRACTION + BREATH.HOLD_FRACTION) {
      // HOLD: sustained at 1.0
      phase = 1.0

    } else {
      // EXHALE: 1→0 with smooth ease
      const t = (cyclePos - BREATH.INHALE_FRACTION -
                 BREATH.HOLD_FRACTION) /
                 BREATH.EXHALE_FRACTION
      phase = 1.0 - t * t * (3.0 - 2.0 * t)
    }

    // Only emit when phase changes meaningfully
    // (threshold: 0.001 = 1000 steps per cycle)
    // Prevents flooding the event system:
    if (Math.abs(phase - lastPhaseRef.current) > 0.001) {
      lastPhaseRef.current = phase
      window.dispatchEvent(
        new CustomEvent<number>('organism:breath', {
          detail: phase
        })
      )
    }
  })

  // BreathClock renders nothing —
  // it's a pure computation component:
  return null
}
