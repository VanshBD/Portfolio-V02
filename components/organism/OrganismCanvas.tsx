'use client'
import { useScrollDepth } from '@/hooks/useScrollDepth'
import { useCursorThermal } from '@/hooks/useCursorThermal'
import { useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree }
  from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { useOrganism } from '@/context/OrganismContext'
import { BreathClock } from './BreathClock'
import {
  ORGANISM_VERTEX,
  ORGANISM_FRAGMENT
} from '@/lib/shaders'
import {
  ORGANISM_GEO,
  REGION_POSITIONS,
  PULSE,
} from '@/lib/constants'

// ─── ORGANISM MESH COMPONENT ───────────────
// Rendered inside Canvas

function OrganismMesh() {
  const meshRef = useRef<THREE.Mesh>(null)
  // materialRef points at the declarative <shaderMaterial>.
  // Mutating it in useFrame/callbacks is allowed (refs are
  // exempt from the React-19 immutability/ref-in-render rules);
  // we never read .current during render.
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const { camera } = useThree()

  const {
    breathPhaseRef,
    subscribeToBreath,
    unsubscribeFromBreath,
    deviceTier,
  } = useOrganism()

  // Mouse NDC position for thermal shader:
  const mouseNDC = useRef({ x: 0, y: 0 })

  // Pulse animation state:
  const pulseIntensityRef = useRef(0)

  // ── ORGANISM GEOMETRY ──────────────────────
  // Built with useMemo so it is available immediately in
  // render (a ref set in an effect would never trigger the
  // mesh to appear). The shader handles animated noise; here
  // we bake the STATIC region-bump shaping.
  const geometry = useMemo(() => {
    // ── BASE ICOSAHEDRON ─────────────────────
    const detail = deviceTier === 'low' ? 3 :
      deviceTier === 'mid' ? 4 : 5
    const baseGeo = new THREE.IcosahedronGeometry(
      ORGANISM_GEO.BASE_RADIUS, detail
    )

    // ── VERTEX DISPLACEMENT ──────────────────
    // Pull vertices toward region bump positions.
    const posAttr = baseGeo.attributes.position
    const count = posAttr.count

    for (let i = 0; i < count; i++) {
      const x = posAttr.getX(i)
      const y = posAttr.getY(i)
      const z = posAttr.getZ(i)
      const vertex = new THREE.Vector3(x, y, z)
      const normal = vertex.clone().normalize()

      // For each region bump, check if this vertex
      // is near that region's position.
      // If yes: displace vertex outward along normal.

      let totalBump = 0

      Object.values(REGION_POSITIONS).forEach(
        regionPos => {
        // Skip BLOCKCHAIN_MEMBRANE and GROWTH_AXIS
        // (they don't create surface bumps):
        if (!('x' in regionPos)) return

        const regionVec = new THREE.Vector3(
          regionPos.x, regionPos.y, regionPos.z
        ).normalize()

        // Dot product: how aligned is this vertex
        // normal with the region direction?
        // 1.0 = exactly facing region
        // 0.0 = perpendicular
        // -1.0 = opposite side
        const alignment = normal.dot(regionVec)

        // Only bump vertices within
        // BUMP_FALLOFF angle (dot > threshold):
        const threshold = 1.0 -
          ORGANISM_GEO.BUMP_FALLOFF
        if (alignment > threshold) {
          // Smooth falloff using smoothstep:
          const t = (alignment - threshold) /
                    ORGANISM_GEO.BUMP_FALLOFF
          const bump = t * t * (3 - 2 * t)
          // smoothstep easing
          totalBump += bump * ORGANISM_GEO.BUMP_STRENGTH
        }
      })

      // Apply total bump displacement outward:
      posAttr.setXYZ(i,
        x + normal.x * totalBump,
        y + normal.y * totalBump,
        z + normal.z * totalBump
      )
    }

    baseGeo.computeVertexNormals()
    return baseGeo
  }, [deviceTier])

  // Dispose geometry when it changes or on unmount:
  useEffect(() => {
    return () => {
      geometry.dispose()
    }
  }, [geometry])

  // ── SHADER MATERIAL UNIFORMS ───────────────
  // Stable object created once — handed to the declarative
  // <shaderMaterial> and mutated per-frame via materialRef.
  const uniforms = useMemo(() => ({
    uTime:           { value: 0 },
    uBreathPhase:    { value: 0 },
    uMouse:          { value: new THREE.Vector2(0, 0) },
    uPulseIntensity: { value: 0 },
    uSaturation:     { value: 1.0 },
  }), [])

  // Subscribe to breath updates (no re-renders):
  useEffect(() => {
    subscribeToBreath('organism-mesh', (phase) => {
      if (materialRef.current) {
        materialRef.current.uniforms
          .uBreathPhase.value = phase
      }
    })
    return () => unsubscribeFromBreath('organism-mesh')
  }, [subscribeToBreath, unsubscribeFromBreath])

  // Listen to mouse position updates:
  useEffect(() => {
    const handler = (e: Event) => {
      const { x, y } = (e as CustomEvent).detail
      mouseNDC.current = { x, y }
    }
    window.addEventListener(
      'organism:mousemove', handler)
    return () => window.removeEventListener(
      'organism:mousemove', handler)
  }, [])

  // Listen to pulse events:
  useEffect(() => {
    const handler = () => {
      // Pulse intensity: 0 → 1 → 0
      // over PULSE.FLASH_DURATION_MS:
      gsap.to(pulseIntensityRef, {
        current: 1,
        duration: 0.1,
        ease: 'power2.out',
        onComplete: () => {
          gsap.to(pulseIntensityRef, {
            current: 0,
            duration: PULSE.DECAY_DURATION_MS / 1000,
            ease: 'power2.out',
          })
        }
      })

      // Camera micro-shake:
      const cam = camera
      gsap.to(cam.position, {
        x: (Math.random() - 0.5) *
          PULSE.CAMERA_SHAKE_AMOUNT * 2,
        duration: PULSE.CAMERA_SHAKE_DURATION_MS /
          4000,
        yoyo: true,
        repeat: 3,
        ease: 'power1.inOut',
        onComplete: () => {
          cam.position.x = 0
        }
      })
    }
    window.addEventListener('organism:pulse', handler)
    return () => window.removeEventListener(
      'organism:pulse', handler)
  }, [camera])

  useFrame(({ clock }) => {
    if (!materialRef.current) return

    const uni = materialRef.current.uniforms

    // Update time uniform:
    uni.uTime.value = clock.getElapsedTime()

    // Update mouse uniform:
    uni.uMouse.value.set(
      mouseNDC.current.x,
      mouseNDC.current.y
    )

    // Update pulse uniform:
    uni.uPulseIntensity.value =
      pulseIntensityRef.current

    // Breathing scale applied to mesh:
    const phase = breathPhaseRef.current
    const scale = 1.0 + phase * 0.03
    if (meshRef.current) {
      meshRef.current.scale.setScalar(scale)
      // Y-float: slight upward movement on inhale
      meshRef.current.position.y =
        phase * 0.008
    }
  })

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
    >
      <shaderMaterial
        ref={materialRef}
        vertexShader={ORGANISM_VERTEX}
        fragmentShader={ORGANISM_FRAGMENT}
        uniforms={uniforms}
        transparent
        side={THREE.FrontSide}
        depthWrite
      />
    </mesh>
  )
}

// ─── MAIN ORGANISM CANVAS ──────────────────

export default function OrganismCanvas() {
  const cameraRef =
    useRef<THREE.PerspectiveCamera | null>(null)
  const { deviceTier } = useOrganism()

  // ADD: ACTIVATE ZOOM SYSTEM
  useScrollDepth(cameraRef)

  // ADD: ACTIVATE THERMAL CURSOR
  useCursorThermal()

  return (
    <Canvas
      style={{ position: 'fixed', inset: 0 }}
      gl={{
        antialias: deviceTier !== 'low',
        powerPreference: 'high-performance',
        alpha: false,
      }}
      dpr={[1, deviceTier === 'high' ? 2 : 1.5]}
      performance={{ min: 0.5 }}
      camera={{
        fov: 50,
        near: 0.1,
        far: 100,
        position: [0, 0, 3.5],
      }}
      onCreated={({ camera }) => {
        cameraRef.current =
          camera as THREE.PerspectiveCamera
      }}
    >
      {/* BreathClock: inside Canvas for useFrame */}
      <BreathClock />

      {/* Ambient light for basic illumination: */}
      <ambientLight
        color={0x0A1628}
        intensity={0.5}
      />

      {/* Directional light from front-top: */}
      <directionalLight
        position={[0.5, 1.0, 2.0]}
        color={0x00C8FF}
        intensity={0.3}
      />

      {/* The organism body: */}
      <OrganismMesh />

      {/* Preload all assets during birth sequence: */}
      <Preload all />
    </Canvas>
  )
}
