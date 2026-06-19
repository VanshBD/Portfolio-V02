This is for THE ORGANISM portfolio project.
Next.js 14.2.5, Three.js 0.165.0,
@react-three/fiber 8.16.8.
All @/* aliases map to project root.
OrganismContext exists at @/context/OrganismContext.
Build exactly what is specified — no simplifications.

THE ORGANISM portfolio.
PROMPT 01 complete — project runs with zero errors.
Next.js 14.2.5, Three.js 0.165.0, React Three Fiber
8.16.8, GSAP 3.12.5, Framer Motion 11.2.10 installed.
@/* aliases configured. Colors, constants, folder
structure all in place.

This is PROMPT 02 — the cell division birth sequence.
The first thing every visitor sees. It runs for
4.2 seconds (desktop) or 2.6 seconds (low-end/mobile)
then calls onComplete() to reveal the organism.

BUILD: /components/ui/LoadingSequence.tsx

═══════════════════════════════════════════════
THE ORGANISM SILHOUETTE — EXACT COORDINATES
═══════════════════════════════════════════════

During the birth sequence (frame 2.6s-3.4s),
the cell cluster morphs toward the organism shape.
The target silhouette is defined by these
196 destination positions.

Do NOT generate random positions — cells must
migrate TO these specific coordinates to form
the organism shape correctly.

Generate the 196 target positions using this
exact algorithm (run once on component mount):

const generateOrganismTargets = (): THREE.Vector3[] => {
  const targets: THREE.Vector3[] = []
  const width = window.innerWidth
  const height = window.innerHeight
 
  // Organism fills ~70% of viewport
  // Center at (0,0), width ~0.7 of view
  const orgW = Math.min(width, height) * 0.35
  const orgH = orgW * 0.8
 
  // The organism silhouette formula:
  // A modified superellipse with 7 bump perturbations
  // This creates an irregular biological oval
 
  const isInsideOrganism = (x: number, y: number) => {
    // Base superellipse check:
    const nx = x / orgW
    const ny = y / orgH
    const base = Math.pow(Math.abs(nx), 2.2) +
                 Math.pow(Math.abs(ny), 2.2)
 
    // 7 radial bump perturbations
    // (one per organism region):
    const angle = Math.atan2(ny, nx)
    const bumpAngles = [
      0,              // Core (right)
      -Math.PI * 0.5, // Neural (top)
      Math.PI,        // Left
      Math.PI * 0.5,  // Bottom
      -Math.PI * 0.3, // TeamOS area (upper-left)
       Math.PI * 0.3, // BillStack area (lower-right)
      -Math.PI * 0.7, // Rhythm (lower-left)
    ]
 
    let bumpFactor = 0
    bumpAngles.forEach((ba) => {
      const diff = Math.abs(angle - ba)
      const wrap = Math.min(diff,
        Math.PI * 2 - diff)  // handle angle wrap
      if (wrap < 0.6) {
        bumpFactor += 0.08 *
          (1 - wrap / 0.6)  // smooth bump
      }
    })
 
    return base < (0.85 + bumpFactor)
  }
 
  // Sample 196 valid positions:
  // Use a grid sampling approach for even distribution
  const gridSize = 28  // 28x28 = 784 grid,
                        // ~196 inside the shape
  let count = 0
  for (let gy = 0; gy < gridSize && count < 196; gy++) {
    for (let gx = 0; gx < gridSize && count < 196; gx++) {
      // Map grid to organism space:
      const x = ((gx / (gridSize - 1)) - 0.5) *
                orgW * 2.2
      const y = ((gy / (gridSize - 1)) - 0.5) *
                orgH * 2.2
 
      if (isInsideOrganism(x, y)) {
        // Add slight random jitter for organic feel:
        const jitter = orgW * 0.03
        targets.push(new THREE.Vector3(
          x + (Math.random() - 0.5) * jitter,
          y + (Math.random() - 0.5) * jitter,
          (Math.random() - 0.5) * 0.1
        ))
        count++
      }
    }
  }
 
  // If we got fewer than 196, fill with random
  // interior points (fallback):
  while (targets.length < 196) {
    const x = (Math.random() - 0.5) * orgW * 1.8
    const y = (Math.random() - 0.5) * orgH * 1.8
    if (isInsideOrganism(x, y)) {
      targets.push(new THREE.Vector3(x, y, 0))
    }
  }
 
  return targets.slice(0, 196)
}

This function returns exactly 196 THREE.Vector3
positions forming the organism silhouette.
Store result in a ref on component mount:
const targetsRef = useRef<THREE.Vector3[]>([])
useEffect(() => {
  targetsRef.current = generateOrganismTargets()
}, [])

═══════════════════════════════════════════════
DEVICE TIER DETECTION
═══════════════════════════════════════════════

Import from /lib/deviceTier.ts.
(Build this file as part of this prompt:)

// /lib/deviceTier.ts
export type DeviceTier = 'high' | 'mid' | 'low'

export const getDeviceTier = (): DeviceTier => {
  if (typeof window === 'undefined') return 'mid'
 
  const cores = navigator.hardwareConcurrency ?? 4
  const memory = (navigator as any).deviceMemory ?? 4
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

═══════════════════════════════════════════════
SKIP HANDLER — EXACT IMPLEMENTATION
═══════════════════════════════════════════════

Skip becomes available after 1500ms.
Any key press OR click after 1500ms skips.
Before 1500ms: input is completely ignored.

const skipAvailableRef = useRef(false)
const skippedRef = useRef(false)

// Enable skip after 1500ms:
useEffect(() => {
  const timer = setTimeout(() => {
    skipAvailableRef.current = true
  }, 1500)
  return () => clearTimeout(timer)
}, [])

const handleSkip = useCallback(() => {
  if (!skipAvailableRef.current) return
  if (skippedRef.current) return  // prevent double-fire
  skippedRef.current = true
 
  // Kill all running GSAP animations:
  gsap.killTweensOf('*')
 
  // Instantly move all cells to target positions:
  if (pointsRef.current && targetsRef.current.length) {
    const positions = pointsRef.current.geometry
      .attributes.position
    targetsRef.current.forEach((target, i) => {
      if (i < positions.count) {
        positions.setXYZ(i, target.x, target.y, target.z)
      }
    })
    positions.needsUpdate = true
  }
 
  // Fade out overlay and call onComplete:
  gsap.to(overlayRef.current, {
    opacity: 0,
    duration: 0.4,
    onComplete: onComplete,
  })
}, [onComplete])

// Attach skip listeners:
useEffect(() => {
  window.addEventListener('keydown', handleSkip)
  window.addEventListener('click', handleSkip)
  return () => {
    window.removeEventListener('keydown', handleSkip)
    window.removeEventListener('click', handleSkip)
  }
}, [handleSkip])

// Show skip hint after 1500ms:
const [showSkipHint, setShowSkipHint] = useState(false)
useEffect(() => {
  const t = setTimeout(() => setShowSkipHint(true), 1500)
  return () => clearTimeout(t)
}, [])

Skip hint UI (fixed bottom-right):
{showSkipHint && !skippedRef.current && (
  <div style={{
    position: 'fixed',
    bottom: 24, right: 24,
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: '#4A6B8A',
    letterSpacing: '0.08em',
    pointerEvents: 'none',
    opacity: 0.6,
  }}>
    click or press any key to skip
  </div>
)}

═══════════════════════════════════════════════
COMPLETE COMPONENT BUILD
═══════════════════════════════════════════════

'use client'

import { useEffect, useRef, useState, useCallback }
  from 'react'
import { Canvas, useFrame, useThree }
  from '@react-three/fiber'
import * as THREE from 'three'
import { gsap } from 'gsap'
import * as Tone from 'tone'
import { getDeviceTier, SEQUENCE_DURATION }
  from '@/lib/deviceTier'
import { COLORS_HEX } from '@/lib/colors'

interface LoadingSequenceProps {
  onComplete: () => void
}

// ─── INNER THREE.JS SCENE ─────────────────────
// (Rendered inside Canvas)

interface BirthSceneProps {
  targets: THREE.Vector3[]
  deviceTier: ReturnType<typeof getDeviceTier>
  onSequenceComplete: () => void
}

function BirthScene({
  targets,
  deviceTier,
  onSequenceComplete
}: BirthSceneProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const hasCompletedRef = useRef(false)
 
  const duration = SEQUENCE_DURATION[deviceTier]
 
  // Cell data: position + migration progress per cell
  const cellCount = 196
  const positionsRef = useRef(
    new Float32Array(cellCount * 3)
  )
  const colorsRef = useRef(
    new Float32Array(cellCount * 3)
  )
  // tParam per cell: 0 = start position, 1 = target
  const tParamsRef = useRef(
    new Float32Array(cellCount).fill(0)
  )
  // Each cell's start position (random spread):
  const startPositionsRef = useRef<THREE.Vector3[]>([])
 
  useEffect(() => {
    // Initialize: all cells start at center
    // with slight random spread:
    startPositionsRef.current = Array.from(
      { length: cellCount }, (_, i) =>
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.05
        )
    )
 
    // Initialize positions at start:
    startPositionsRef.current.forEach((pos, i) => {
      positionsRef.current[i * 3 + 0] = pos.x
      positionsRef.current[i * 3 + 1] = pos.y
      positionsRef.current[i * 3 + 2] = pos.z
    })
 
    // Initialize colors — all NEURAL_CYAN to start:
    for (let i = 0; i < cellCount; i++) {
      colorsRef.current[i * 3 + 0] = 0.0   // R
      colorsRef.current[i * 3 + 1] = 0.784 // G (200/255)
      colorsRef.current[i * 3 + 2] = 1.0   // B
    }
  }, [])
 
  useFrame(() => {
    if (!pointsRef.current) return
    if (!targets.length) return
 
    const now = Date.now()
    // Use a ref to track sequence start:
    // (set in useEffect below)
    if (!startTimeRef.current) return
 
    const elapsed = now - startTimeRef.current
    const totalDuration = duration
    const progress = Math.min(elapsed / totalDuration, 1)
 
    // Migration phase: cells move to targets
    // Migration starts at 62% of sequence:
    const migrationStart = 0.62
    const migrationEnd = 0.92
    const migrationProgress = Math.max(0,
      (progress - migrationStart) /
      (migrationEnd - migrationStart)
    )
 
    const positions = pointsRef.current.geometry
      .attributes.position as THREE.BufferAttribute
    const colors = pointsRef.current.geometry
      .attributes.color as THREE.BufferAttribute
 
    targets.forEach((target, i) => {
      if (i >= cellCount) return
      const start = startPositionsRef.current[i] ||
        new THREE.Vector3()
 
      // Smooth step easing for migration:
      const t = migrationProgress
      const eased = t * t * (3 - 2 * t)
 
      // Lerp from start position to target:
      const x = start.x + (target.x - start.x) * eased
      const y = start.y + (target.y - start.y) * eased
      const z = start.z + (target.z - start.z) * eased
 
      positions.setXYZ(i, x, y, z)
 
      // Color shift during migration:
      // Mix between CYAN, BIOLUMEN, AMBER based on
      // cell index group and migration progress:
      const group = i % 3
      if (group === 0) {
        // CYAN — stays cyan
        colors.setXYZ(i, 0.0, 0.784, 1.0)
      } else if (group === 1) {
        // Shifts toward BIOLUMEN (#6B2FEE):
        const r = 0.0 + 0.416 * eased
        const g = 0.784 - 0.597 * eased
        const b = 1.0 - 0.067 * eased
        colors.setXYZ(i, r, g, b)
      } else {
        // Shifts toward AMBER (#FF7A2F):
        const r = 0.0 + 1.0 * eased
        const g = 0.784 - 0.304 * eased
        const b = 1.0 - 0.812 * eased
        colors.setXYZ(i, r, g, b)
      }
    })
 
    positions.needsUpdate = true
    colors.needsUpdate = true
 
    // Sequence complete:
    if (progress >= 1.0 && !hasCompletedRef.current) {
      hasCompletedRef.current = true
      onSequenceComplete()
    }
  })
 
  // Track sequence start time:
  const startTimeRef = useRef<number | null>(null)
  useEffect(() => {
    startTimeRef.current = Date.now()
  }, [])
 
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={cellCount}
          array={positionsRef.current}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={cellCount}
          array={colorsRef.current}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={deviceTier === 'low' ? 0.008 : 0.006}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
      />
    </points>
  )
}

// ─── MAIN LOADING SEQUENCE COMPONENT ─────────

export default function LoadingSequence({
  onComplete
}: LoadingSequenceProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const [deviceTier] = useState(getDeviceTier)
  const [targets, setTargets] = useState
    THREE.Vector3[]>([])
  const [showSkipHint, setShowSkipHint] = useState(false)
  const [canvasVisible, setCanvasVisible] = useState(false)
  const skipAvailableRef = useRef(false)
  const skippedRef = useRef(false)

  // Generate targets after mount
  // (needs window dimensions):
  useEffect(() => {
    setTargets(generateOrganismTargets())
  }, [])
 
  // Black screen phase: 300ms before canvas appears
  useEffect(() => {
    const t = setTimeout(() => {
      setCanvasVisible(true)
    }, 300)
    return () => clearTimeout(t)
  }, [])
 
  // Skip availability:
  useEffect(() => {
    // Skip enables faster on mobile — sessions are shorter
// and 1.5s feels like an eternity on a phone:
const skipDelay = deviceTier === 'low' ? 800 : 1500

const t = setTimeout(() => {
  skipAvailableRef.current = true
  setShowSkipHint(true)
}, skipDelay)    return () => clearTimeout(t)
  }, [])
 
  // Skip sound (brief tone):
  const playBirthTone = useCallback(
    async (frequency: number, duration: number) => {
    try {
      // Tone.js requires user gesture first.
      // Birth sequence starts from page load
      // so we attempt but don't force:
      if (Tone.getContext().state === 'running') {
        const synth = new Tone.Synth({
          oscillator: { type: 'sine' },
          envelope: {
            attack: 0.01, decay: 0.1,
            sustain: 0.5, release: 0.3
          },
          volume: -20,
        }).toDestination()
        synth.triggerAttackRelease(
          frequency, duration + 's')
        setTimeout(() => synth.dispose(),
          (duration + 0.5) * 1000)
      }
    } catch {
      // Silent fail — audio is enhancement only
    }
  }, [])
 
  const handleSkip = useCallback(() => {
    if (!skipAvailableRef.current) return
    if (skippedRef.current) return
    skippedRef.current = true
 
    if (overlayRef.current) {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.out',
        onComplete: onComplete,
      })
    } else {
      onComplete()
    }
  }, [onComplete])
 
  useEffect(() => {
    window.addEventListener('keydown', handleSkip)
    window.addEventListener('click', handleSkip)
    return () => {
      window.removeEventListener('keydown', handleSkip)
      window.removeEventListener('click', handleSkip)
    }
  }, [handleSkip])
 
  // When Three.js scene signals complete:
  const handleSceneComplete = useCallback(() => {
    if (skippedRef.current) return
    skippedRef.current = true
 
    if (overlayRef.current) {
      // Fade out overlay:
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut',
        delay: 0.2,  // brief hold at full form
        onComplete: onComplete,
      })
    } else {
      onComplete()
    }
  }, [onComplete])
 
  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9000,
        background: '#04080F',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Three.js birth scene */}
      {canvasVisible && targets.length > 0 && (
        <Canvas
          style={{
            position: 'absolute',
            inset: 0
          }}
          camera={{
            fov: 60,
            near: 0.01,
            far: 100,
            position: [0, 0, 2.0]
          }}
          gl={{
            antialias: deviceTier !== 'low',
            alpha: false,
          }}
        >
          <BirthScene
            targets={targets}
            deviceTier={deviceTier}
            onSequenceComplete={handleSceneComplete}
          />
        </Canvas>
      )}
 
      {/* Organism name — fades in at 50% progress */}
      <div style={{
        position: 'absolute',
        bottom: 40,
        left: '50%',
        transform: 'translateX(-50%)',
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        letterSpacing: '0.3em',
        color: '#4A6B8A',
        textTransform: 'uppercase',
        pointerEvents: 'none',
        animation: `fadeIn 1s ease ${
          SEQUENCE_DURATION[deviceTier] * 0.5
        }ms both`,
      }}>
        VANSH DOBARIYA
      </div>
 
      {/* Skip hint */}
      {showSkipHint && (
        <div style={{
          position: 'absolute',
          bottom: 24,
          right: 24,
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: '#4A6B8A',
          letterSpacing: '0.06em',
          opacity: 0.5,
          pointerEvents: 'none',
        }}>
          click or press any key to skip
        </div>
      )}
 
      {/* CSS for fadeIn keyframe */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  )
}

MOBILE SPECIFIC BEHAVIOR:
DeviceTier 'low' (mobile):
- Canvas renders but at reduced quality
  (antialias: false, pointSize: 0.008 instead of 0.006)
- Duration compressed to 2600ms (feels intentional,
  not laggy)
- Migration math same — just faster
- Skip becomes available at 1000ms (not 1500ms)
  because mobile sessions are shorter:

// Adjust skip timing by tier:
const skipEnableDelay = deviceTier === 'low' ?
  1000 : 1500

═══════════════════════════════════════════════
HOW THIS CONNECTS TO PAGE.TSX
═══════════════════════════════════════════════

In app/page.tsx (which you'll build fully
in Prompt 10), the LoadingSequence mounts
during the 'birth' phase and its onComplete
callback transitions to the 'alive' phase:

// Simplified page.tsx structure:
// (Full version built in Prompt 10)

const [phase, setPhase] = useState
  'black' | 'birth' | 'alive'>('black')

// After 300ms black screen:
useEffect(() => {
  const t = setTimeout(() => setPhase('birth'), 300)
  return () => clearTimeout(t)
}, [])

// In JSX:
{phase === 'birth' && (
  <LoadingSequence
    onComplete={() => setPhase('alive')}
  />
)}

// OrganismCanvas mounts DURING birth phase
// (hidden) so it's loaded when sequence ends:
{(phase === 'birth' || phase === 'alive') && (
  <div style={{
    opacity: phase === 'alive' ? 1 : 0,
    transition: 'opacity 600ms ease',
    position: 'fixed', inset: 0
  }}>
    <OrganismCanvas />
  </div>
)}

After PROMPT 02 is built:
- npm run dev must show the birth sequence
- Cells appear and migrate toward organism shape
- Skip works after 1.5s
- onComplete fires (console.log it for now)
- No TypeScript errors