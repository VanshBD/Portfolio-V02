'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// LoadingSequence uses Three.js + Tone.js — client-only.
// Loaded with ssr:false so those modules never evaluate on the server.
const LoadingSequence = dynamic(
  () => import('@/components/ui/LoadingSequence'),
  { ssr: false }
)

// ─── TEMPORARY PROMPT-02 TEST HARNESS ─────────
// The full phase machine + OrganismCanvas wiring is built in
// Prompt 10. For now this just drives the birth sequence so it
// can be seen running, and logs onComplete.
export default function HomePage() {
  const [phase, setPhase] = useState<'black' | 'birth' | 'alive'>('black')

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
        <p style={{
          color: '#00C8FF',
          fontFamily: 'monospace',
          padding: 24
        }}>
          THE ORGANISM — birth complete (Prompt 02). Phase: alive.
        </p>
      )}
    </main>
  )
}
