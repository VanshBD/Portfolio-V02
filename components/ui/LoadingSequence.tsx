'use client'

import { useEffect, useRef, useState, useCallback }
  from 'react'
import { Canvas, useFrame }
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

// ─── ORGANISM SILHOUETTE TARGET GENERATOR ─────
// Returns exactly 196 THREE.Vector3 positions forming
// the organism silhouette. Cells migrate TO these.
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

// ─── INNER THREE.JS SCENE ─────────────────────
// (Rendered inside Canvas)

// Module-level constant so the geometry buffers can be
// memoized with stable empty deps (no exhaustive-deps churn).
const cellCount = 196

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

  // Each cell's start position — random spread around center.
  // Computed once on mount (lazy initializer).
  const [startPositions] = useState<THREE.Vector3[]>(() =>
    Array.from({ length: cellCount }, () =>
      new THREE.Vector3(
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.05
      )
    )
  )

  // Geometry buffers, created once with the start data baked in.
  // These are stable references handed to the bufferAttribute `args`.
  // They are NEVER reassigned in render — per-frame motion is written
  // through the THREE.BufferAttribute objects inside useFrame, so the
  // raw arrays here are not mutated after creation.
  const [positions] = useState<Float32Array>(() => {
    const a = new Float32Array(cellCount * 3)
    startPositions.forEach((pos, i) => {
      a[i * 3 + 0] = pos.x
      a[i * 3 + 1] = pos.y
      a[i * 3 + 2] = pos.z
    })
    return a
  })
  // Initialize colors — all NEURAL_CYAN to start:
  const [colors] = useState<Float32Array>(() => {
    const a = new Float32Array(cellCount * 3)
    for (let i = 0; i < cellCount; i++) {
      a[i * 3 + 0] = 0.0   // R
      a[i * 3 + 1] = 0.784 // G (200/255)
      a[i * 3 + 2] = 1.0   // B
    }
    return a
  })
  // tParam per cell: 0 = start position, 1 = target
  const [tParams] = useState<Float32Array>(
    () => new Float32Array(cellCount).fill(0)
  )

  // Track sequence start time:
  const startTimeRef = useRef<number | null>(null)

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
      const start = startPositions[i] ||
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

  useEffect(() => {
    startTimeRef.current = Date.now()
  }, [])

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
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
  // Generate the 196 targets once on mount. This component is only
  // ever rendered client-side (loaded with ssr:false), but the
  // window guard keeps the lazy initializer safe regardless.
  const [targets] = useState<THREE.Vector3[]>(
    () => (typeof window === 'undefined' ? [] : generateOrganismTargets())
  )
  const [showSkipHint, setShowSkipHint] = useState(false)
  const [canvasVisible, setCanvasVisible] = useState(false)
  const skipAvailableRef = useRef(false)
  const skippedRef = useRef(false)

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
    }, skipDelay)
    return () => clearTimeout(t)
  }, [deviceTier])

  // Birth sequence audio (BUG 02 fix).
  // Driven by plain timeouts here in LoadingSequence — BirthScene
  // lives inside the Canvas and can't reach this. The audio context
  // won't be running on first load (no user gesture yet), so this
  // silently does nothing then. It only plays if the visitor already
  // enabled audio on a previous visit (the context stays running).
  useEffect(() => {
    const attemptTones = async () => {
      try {
        // Only attempt if audio context already running
        // (won't be on first load — that's expected)
        if (Tone.getContext().state !== 'running') return

        // Frame 0.3s: single genesis tone
        setTimeout(async () => {
          const synth = new Tone.Synth({
            volume: -22
          }).toDestination()
          synth.triggerAttackRelease(80, '0.2s')
          setTimeout(() => synth.dispose(), 500)
        }, 300)

        // Frame 0.8s: division chord
        setTimeout(async () => {
          const synth = new Tone.PolySynth().toDestination()
          synth.volume.value = -24
          synth.triggerAttackRelease([80, 100], '0.25s')
          setTimeout(() => synth.dispose(), 600)
        }, 800)
      } catch {
        // Silent fail always — audio is enhancement only
      }
    }

    attemptTones()
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
