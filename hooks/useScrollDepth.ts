'use client'

import { useEffect, useCallback, useRef } from 'react'
import { useOrganism } from '@/context/OrganismContext'
import { gsap } from 'gsap'

// Controls the 3-level zoom system.
// Scroll wheel (desktop) and pinch (mobile)
// both call the same setZoomLevel logic.

import * as THREE from 'three' // Make sure to import THREE

const ZOOM_CONFIG = {
  macro: { z: 3.5 },
  meso:  { z: 1.8 },
  micro: { z: 0.6 },
}

export function useScrollDepth(
  cameraRef: React.RefObject<THREE.PerspectiveCamera | null>
) {
  const {
    setZoomLevel,
    setTargetRegion,
  } = useOrganism()

  const animateCamera = useCallback(
    (targetZ: number) => {
    if (!cameraRef.current) return
    gsap.to(cameraRef.current.position, {
      z: targetZ,
      duration: 1.2,
      ease: 'power3.inOut',
    })
  }, [cameraRef])

  const zoomIn = useCallback(() => {
    setZoomLevel(current => {
      if (current === 'macro') {
        animateCamera(ZOOM_CONFIG.meso.z)
        return 'meso'
      }
      if (current === 'meso') {
        animateCamera(ZOOM_CONFIG.micro.z)
        return 'micro'
      }
      return current // already at micro
    })
  }, [animateCamera, setZoomLevel])

  const zoomOut = useCallback(() => {
    setZoomLevel(current => {
      if (current === 'micro') {
        animateCamera(ZOOM_CONFIG.meso.z)
        setTargetRegion(null)
        return 'meso'
      }
      if (current === 'meso') {
        animateCamera(ZOOM_CONFIG.macro.z)
        setTargetRegion(null)
        return 'macro'
      }
      return current // already at macro
    })
  }, [animateCamera, setZoomLevel, setTargetRegion])

  // DESKTOP: scroll wheel
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    if (e.deltaY > 0) zoomIn()
    else zoomOut()
  }, [zoomIn, zoomOut])

  // MOBILE: pinch gesture
  const touchState = useRef({
    lastDistance: 0,
    isPinching: false
  })

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
    if (e.touches.length === 2) {
      touchState.current.isPinching = true
      touchState.current.lastDistance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      )
    }
  }, [])

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
    if (!touchState.current.isPinching) return
    if (e.touches.length !== 2) return

    const newDist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    )
    const delta = newDist - touchState.current.lastDistance

    if (Math.abs(delta) > 8) {
      if (delta > 0) zoomIn()
      else zoomOut()
      touchState.current.lastDistance = newDist
    }
  }, [zoomIn, zoomOut])

  const handleTouchEnd = useCallback(() => {
    touchState.current.isPinching = false
  }, [])

  useEffect(() => {
    // passive: false required to call preventDefault:
    window.addEventListener('wheel', handleWheel,
      { passive: false })
    window.addEventListener('touchstart',
      handleTouchStart, { passive: true })
    window.addEventListener('touchmove',
      handleTouchMove, { passive: true })
    window.addEventListener('touchend',
      handleTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart',
        handleTouchStart)
      window.removeEventListener('touchmove',
        handleTouchMove)
      window.removeEventListener('touchend',
        handleTouchEnd)
    }
  }, [handleWheel, handleTouchStart,
      handleTouchMove, handleTouchEnd])

  return { zoomIn, zoomOut }
}
