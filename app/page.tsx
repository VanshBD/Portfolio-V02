'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { OrganismProvider } from '@/context/OrganismContext'
import { getDeviceTier } from '@/lib/deviceTier'

// LoadingSequence uses Three.js + Tone.js — client-only.
// Loaded with ssr:false so those modules never evaluate on the server.
const LoadingSequence = dynamic(
  () => import('@/components/ui/LoadingSequence'),
  { ssr: false }
)

// OrganismCanvas renders a WebGL <Canvas> — client-only as well.
const OrganismCanvas = dynamic(
  () => import('@/components/organism/OrganismCanvas'),
  { ssr: false }
)

// ─── TEMPORARY HARNESS (Prompts 02–03) ────────
// The full phase machine lives in Prompt 10. For now this drives
// the birth sequence, then mounts the living organism inside the
// OrganismProvider so the breath / pulse / zoom / thermal systems
// are wired and verifiable.
export default function HomePage() {
  const [phase, setPhase] = useState<'black' | 'birth' | 'alive'>('black')
  const [deviceTier] = useState(getDeviceTier)

  // After 300ms black screen → birth:
  useEffect(() => {
    const t = setTimeout(() => setPhase('birth'), 300)
    return () => clearTimeout(t)
  }, [])

  return (
    <main>
      {phase === 'birth' && (
        <LoadingSequence
          onComplete={() => {
            console.log('[ORGANISM] birth sequence complete → phase: alive')
            setPhase('alive')
          }}
        />
      )}

      {phase === 'alive' && (
        <OrganismProvider deviceTier={deviceTier}>
          <OrganismCanvas />
        </OrganismProvider>
      )}
    </main>
  )
}
