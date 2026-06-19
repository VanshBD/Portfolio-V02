'use client'

import { useEffect, useCallback, useRef } from 'react'
import { useOrganism } from '@/context/OrganismContext'

// Tracks cursor position and adds thermal points
// to OrganismContext for the shader to consume.

interface UseCursorThermalOptions {
  // Only track when cursor is near the organism.
  // Pass the canvas ref to check bounds:
  canvasRef?: React.RefObject<HTMLElement>
}

export function useCursorThermal(
  options: UseCursorThermalOptions = {}
) {
  const { addThermalPoint } = useOrganism()

  // Convert mouse event to normalized device coords
  // for the organism shader's uMouse uniform:
  const toNDC = useCallback((
    clientX: number,
    clientY: number
  ): { x: number, y: number } => {
    return {
      x: (clientX / window.innerWidth) * 2 - 1,
      y: -(clientY / window.innerHeight) * 2 + 1,
    }
  }, [])

  // Throttle: only process every 16ms (60fps max):
  const lastProcessTime = useRef(0)

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
    const now = Date.now()
    if (now - lastProcessTime.current < 16) return
    lastProcessTime.current = now

    // Add thermal point in screen space:
    addThermalPoint(e.clientX, e.clientY)

    // Also dispatch NDC mouse position for shader:
    const ndc = toNDC(e.clientX, e.clientY)
    window.dispatchEvent(
      new CustomEvent('organism:mousemove', {
        detail: ndc
      })
    )
  }, [addThermalPoint, toNDC])

  useEffect(() => {
    window.addEventListener(
      'mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener(
      'mousemove', handleMouseMove)
  }, [handleMouseMove])
}
