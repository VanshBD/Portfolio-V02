'use client'

import { useEffect } from 'react'

// Subscribes any component to the organism pulse.
// Cleaner than consuming OrganismContext directly
// for pulse-only needs.

interface PulseOptions {
  onPulse: (count: number, isManual: boolean) => void
}

export function useOrganismPulse({ onPulse }: PulseOptions) {
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail
      onPulse(detail.count ?? 0, detail.manual ?? false)
    }
    window.addEventListener('organism:pulse', handler)
    return () => window.removeEventListener(
      'organism:pulse', handler)
  }, [onPulse])
}
