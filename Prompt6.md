This is for THE ORGANISM portfolio project.
Next.js 14.2.5, Three.js 0.165.0,
@react-three/fiber 8.16.8.
All @/* aliases map to project root.
OrganismContext exists at @/context/OrganismContext.
Build exactly what is specified — no simplifications.

THE ORGANISM portfolio.
PROMPTS 01-05 complete. Vein network running,
blood cells traveling, live GitHub data flowing.

This is PROMPT 06 — the Project Organs.
Three biological organs representing 
TeamOS, BillStack, and GhostDeck.

BUILD THESE FILES:
1. /components/organism/ProjectOrgans.tsx
2. /components/organism/organs/TeamOSOrgan.tsx
3. /components/organism/organs/BillStackOrgan.tsx
4. /components/organism/organs/GhostDeckOrgan.tsx

═══════════════════════════════════════════════
ORGAN TRANSPARENCY — CRITICAL SETUP
═══════════════════════════════════════════════

This must be understood before building 
ANY organ geometry or it breaks visually.

When an organ becomes semi-transparent to 
show architecture inside, Three.js has two 
render order issues that must be handled:

ISSUE 1 — Z-fighting between outer and inner:
The outer organ mesh and inner pathway meshes 
occupy nearly the same Z-depth.
Without correct setup: inner pathways invisible 
OR flickering through the outer surface.

FIX for outer organ mesh:
outerMesh.material.transparent = true
outerMesh.material.depthWrite  = false
// depthWrite: false means this mesh does NOT
// write to the depth buffer — inner objects 
// always render through it.
outerMesh.renderOrder = 1
// renderOrder: 1 means outer renders AFTER 
// inner (higher number = renders later)

FIX for inner pathway meshes:
innerMesh.renderOrder = 0  
// Renders first — writes to depth buffer
innerMesh.material.depthWrite = true

ISSUE 2 — Transparency sorting:
Three.js renders transparent objects back-to-front.
Multiple overlapping transparent objects 
require explicit render order control.

For the three organs:
TeamOS organ:    renderOrder = 1
BillStack organ: renderOrder = 1
GhostDeck organ: renderOrder = 1
All organ interiors: renderOrder = 0

ISSUE 3 — Side rendering:
The outer organ must render BOTH sides so 
visitor sees the interior surface when looking 
through it.

outerMesh.material.side = THREE.DoubleSide

Apply these three settings to EVERY outer organ 
mesh. Failing to do this = invisible interiors.

═══════════════════════════════════════════════
ORGAN STATE MANAGEMENT
═══════════════════════════════════════════════

When visitor clicks an organ:
1. OrganismContext.activeOrgan is set to that organ
2. Previous active organ deactivates
3. Camera moves toward clicked organ (MESO zoom)
4. Organ becomes transparent, interior reveals

This is managed through OrganismContext 
(already has activeOrgan + setActiveOrgan).

Each organ component reads activeOrgan from 
context. If it matches its own id, it activates.
If another organ becomes active, it deactivates.

ACTIVATION STATES per organ:

STATE: 'resting'
- Opaque outer surface
- Slow internal particle flow (0.5x speed)
- No labels visible
- Breathing in sync with organism (scale 1.0-1.03)

STATE: 'activating' (transition, ~600ms)
- Outer surface fading from 1.0 → 0.4 opacity
- Internal pathways fading from 0 → 0.8 opacity
- Camera gliding toward organ center
- depthWrite switches from true → false

STATE: 'active'
- Outer: opacity 0.35, depthWrite: false
- Interior: fully visible, pathways animated
- Labels visible (field notes + arch labels)
- Particle flow at normal speed (1.0x)
- MESO zoom panel slides in

STATE: 'deactivating' (transition, ~400ms)
- Reverse of activating
- Camera returns to macro position

Use useRef for animation state (not useState)
to avoid re-renders during transitions:

const organState = useRef
  'resting' | 'activating' | 
  'active'  | 'deactivating'
>('resting')

Use useEffect to watch activeOrgan from context:
useEffect(() => {
  if (activeOrgan === 'teamoss') {  
    // (change to this organ's id)
    organState.current = 'activating'
    // Start GSAP transition (see below)
  } else if (organState.current === 'active') {
    organState.current = 'deactivating'
    // Start reverse GSAP transition
  }
}, [activeOrgan])

═══════════════════════════════════════════════
ORGAN BASE GEOMETRY — EXACT APPROACH
═══════════════════════════════════════════════

Both TeamOS and BillStack use this same 
base approach with different parameters.
GhostDeck uses a different (incomplete) approach.

BASE ORGAN GEOMETRY FUNCTION:
Creates an irregular biological form using
IcosahedronGeometry + simplex noise displacement.

const createOrganGeometry = (
  baseRadius:     number,
  noiseScale:     number,  // how fine the texture is
  noiseStrength:  number,  // how much displacement
  elongateY:      number,  // Y-axis stretch (1.0 = sphere)
  elongateX:      number,  // X-axis stretch
): THREE.BufferGeometry => {
  
  // Start with icosahedron (detail 3 = 320 faces):
  const geo = new THREE.IcosahedronGeometry(
    baseRadius, 3)
  
  const pos = geo.attributes.position
  
  // Simple inline noise (no import needed):
  // Based on sin/cos hash — good enough for 
  // one-time geometry displacement:
  const hash = (n: number): number => {
    const x = Math.sin(n) * 43758.5453
    return x - Math.floor(x)
  }
  const noise3D = (
    x: number, y: number, z: number
  ): number => {
    const n = x * 1.0 + y * 57.0 + z * 113.0
    return (hash(n) + hash(n + 1.0) - 1.0)
  }
  
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const z = pos.getZ(i)
    
    // Noise displacement along normal direction:
    const n = noise3D(
      x * noiseScale, 
      y * noiseScale, 
      z * noiseScale
    )
    const displacement = n * noiseStrength
    const len = Math.sqrt(x*x + y*y + z*z)
    if (len === 0) continue
    
    pos.setXYZ(i,
      x * elongateX + (x/len) * displacement,
      y * elongateY + (y/len) * displacement,
      z             + (z/len) * displacement * 0.5,
    )
  }
  
  geo.computeVertexNormals()
  return geo
}

TEAMOSS ORGAN GEOMETRY:
createOrganGeometry(
  0.22,   // baseRadius
  2.8,    // noiseScale — fine texture (lung-like)
  0.028,  // noiseStrength — subtle bumps
  1.15,   // elongateY — slightly taller
  0.90,   // elongateX — slightly compressed X
)

BILLSTACK ORGAN GEOMETRY:
createOrganGeometry(
  0.20,   // baseRadius — slightly smaller
  1.8,    // noiseScale — coarser texture (liver-like)
  0.018,  // noiseStrength — more regular, crystalline
  0.90,   // elongateY — slightly flatter (dense)
  1.05,   // elongateX — slightly wider
)

═══════════════════════════════════════════════
MICRO ZOOM PANEL APPROACH
═══════════════════════════════════════════════

Use @react-three/drei <Html> with 
transform={false} for the three-panel layout.
This renders HTML OVER the canvas as a DOM 
element (not in 3D space).

Panel appears when zoomLevel === 'micro' AND 
this organ's activeOrgan === this organ's id.

PANEL POSITIONING:
position={[panelX, 0, 0]}  // in 3D for Html 
                             // anchor (ignored when
                             // transform={false})
style={{
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  // Centers on screen regardless of 3D position
  width: '80vw',
  maxWidth: '900px',
  display: 'grid',
  gridTemplateColumns: '1fr 1.5fr 1fr',
  gap: '24px',
}}

LEFT PANEL — Metrics:
style={{
  fontFamily:   'var(--font-mono)',
  fontSize:     13,
  color:        '#B8D4E8',
  background:   'rgba(10,22,40,0.96)',
  border:       '1px solid rgba(0,200,255,0.2)',
  borderTop:    '3px solid rgba(0,200,255,0.8)',
  padding:      '20px',
  borderRadius: '0 0 4px 4px',
}}

CENTER PANEL — Code snippet:
style={{
  fontFamily:   'var(--font-mono)',
  fontSize:     12,
  background:   'rgba(4,8,15,0.98)',
  border:       '1px solid rgba(0,200,255,0.12)',
  padding:      '20px',
  borderRadius: '4px',
  lineHeight:   1.7,
  overflowX:    'auto',
  whiteSpace:   'pre',
}}

RIGHT PANEL — Decision log:
style={{
  fontFamily:   'var(--font-mono)',
  fontSize:     12,
  color:        '#B8D4E8',
  background:   'rgba(10,22,40,0.96)',
  border:       '1px solid rgba(107,47,238,0.2)',
  borderTop:    '3px solid rgba(107,47,238,0.6)',
  padding:      '20px',
  borderRadius: '0 0 4px 4px',
  lineHeight:   1.7,
}}

Framer Motion entry for the whole panel:
<motion.div
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0  }}
  exit={{    opacity: 0, y:  8  }}
  transition={{ duration: 0.4, 
    ease: [0.16, 1, 0.3, 1] }}
>

═══════════════════════════════════════════════
TeamOSOrgan.tsx COMPLETE BUILD
═══════════════════════════════════════════════

'use client'

import { useRef, useEffect, useCallback } 
  from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { AnimatePresence, motion } from 'framer-motion'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { useOrganism } from '@/context/OrganismContext'
import { useThreeDisposal } from '@/hooks/useThreeDisposal'
import { useOrganismPulse } from '@/hooks/useOrganismPulse'
import { COLORS_HEX } from '@/lib/colors'
import { REGION_POSITIONS } from '@/lib/constants'

// ─── ARCHITECTURE PATHS INSIDE TEAMOSS ─────
// 5 paths representing actual architecture.
// All positions relative to organ center 
// (-0.5, 0, 0.15) in organism space.

// Helper for relative paths:
const c = (organ: [number,number,number]) => 
  (points: [number,number,number][]) => {
    return new THREE.CatmullRomCurve3(
      points.map(([x,y,z]) => new THREE.Vector3(
        organ[0] + x, organ[1] + y, organ[2] + z
      ))
    )
  }

const rel = c([-0.5, 0, 0.15])

const TEAMOSS_PATHS = {
  
  // PATH_CLERK: Auth surface → database
  // Color: BIOLUMEN (#6B2FEE) — external auth
  CLERK: {
    curve: rel([
      [-0.12,  0.08, 0.00],  // surface (auth entry)
      [-0.08,  0.05, 0.02],
      [-0.02,  0.02, 0.03],
      [ 0.04, -0.01, 0.02],
      [ 0.10, -0.04, 0.00],  // MongoDB destination
    ]),
    color:     COLORS_HEX.BIOLUMEN,
    label:     'Clerk JWT',
    speed:     0.6,
    count:     3,
  },
  
  // PATH_INNGEST: Event fan-out (splits into 3)
  // Color: NEURAL_CYAN — event pipeline
  INNGEST: {
    // Main trunk:
    trunk: rel([
      [-0.10,  0.05, 0.01],  // Inngest webhook entry
      [-0.04,  0.03, 0.02],
      [ 0.00,  0.00, 0.03],  // Fan-out junction
    ]),
    // Three branches from junction:
    branches: [
      rel([[ 0.00, 0.00, 0.03],
           [-0.02, 0.06, 0.03],
           [-0.04, 0.10, 0.02]]),
      rel([[ 0.00, 0.00, 0.03],
           [ 0.04, 0.02, 0.03],
           [ 0.08, 0.04, 0.02]]),
      rel([[ 0.00, 0.00, 0.03],
           [ 0.02,-0.04, 0.03],
           [ 0.04,-0.08, 0.02]]),
    ],
    color: COLORS_HEX.NEURAL_CYAN,
    label: 'Event Pipeline',
    speed: 0.8,
    count: 2,  // per branch
  },
  
  // PATH_WEBSOCKET: Bidirectional (highest density)
  // Color: GROWTH (#00E87A) — active, live
  WEBSOCKET: {
    forward: rel([
      [-0.14, -0.02, 0.01],
      [-0.06, -0.01, 0.02],
      [ 0.06, -0.01, 0.02],
      [ 0.14, -0.02, 0.01],
    ]),
    backward: rel([
      [ 0.14, -0.04, 0.01],
      [ 0.06, -0.03, 0.02],
      [-0.06, -0.03, 0.02],
      [-0.14, -0.04, 0.01],
    ]),
    color: COLORS_HEX.GROWTH,
    label: 'WS < 200ms',
    // 20 particles (visually represent 800 connections):
    count: 20,
    speed: 0.9,
  },
  
  // PATH_MONGODB: Slow, steady deep flow
  // Color: AMBER_PULSE — database warmth
  MONGODB: {
    curve: rel([
      [ 0.10, -0.06, 0.01],
      [ 0.04, -0.08, 0.02],
      [-0.04, -0.08, 0.02],
      [-0.10, -0.06, 0.01],
    ]),
    color: COLORS_HEX.AMBER_PULSE,
    label: 'MongoDB',
    speed: 0.3,  // slowest — DB is slower than memory
    count: 4,
  },
  
  // PATH_STREAM: Regular structured intervals
  // Color: NEURAL_CYAN at 50%
  STREAM: {
    curve: rel([
      [-0.08,  0.10, 0.01],
      [-0.02,  0.08, 0.02],
      [ 0.04,  0.08, 0.02],
      [ 0.10,  0.06, 0.01],
    ]),
    colorHex: 0x006477,  // NEURAL_CYAN dimmed 50%
    label: 'Stream Chat SDK',
    speed: 0.5,
    count: 3,
  },
}

// ─── TEAMOSS ORGAN COMPONENT ───────────────

export function TeamOSOrgan() {
  const { register, registerAll } = useThreeDisposal()
  const { 
    activeOrgan, 
    setActiveOrgan,
    zoomLevel,
    subscribeToBreath,
    unsubscribeFromBreath,
    pulseCount,
  } = useOrganism()
  
  const outerMeshRef    = useRef<THREE.Mesh | null>(null)
  const innerGroupRef   = useRef<THREE.Group | null>(null)
  const particleMeshRef = useRef<THREE.InstancedMesh | null>(null)
  const organState      = useRef
    'resting'|'activating'|'active'|'deactivating'
  >('resting')
  const outerOpacityRef = useRef(1.0)
  const dummy           = useRef(new THREE.Object3D())
  
  // Particle data:
  interface Particle { 
    curve: THREE.CatmullRomCurve3
    tParam: number
    speed: number
    color: THREE.Color
    index: number
  }
  const particles = useRef<Particle[]>([])
  
  // ── GEOMETRY SETUP ──────────────────────
  useEffect(() => {
    // OUTER ORGAN (lung-like):
    const outerGeo = register(
      createOrganGeometry(0.22, 2.8, 0.028, 1.15, 0.90)
    )
    
    const outerMat = register(
      new THREE.MeshPhongMaterial({
        color:       0x0D2040,
        emissive:    0x020810,
        transparent: true,
        opacity:     1.0,
        // CRITICAL settings for transparency:
        depthWrite:  true,   // starts opaque
        side:        THREE.DoubleSide,
        shininess:   15,
      })
    )
    
    if (outerMeshRef.current) {
      outerMeshRef.current.geometry = outerGeo
      outerMeshRef.current.material = outerMat
      outerMeshRef.current.renderOrder = 1
    }
    
    // INNER PATHWAY PARTICLES:
    // Collect all particle paths:
    const allParticles: Particle[] = []
    let idx = 0
    
    // WebSocket (highest count — 20):
    for (let i = 0; i < 20; i++) {
      const curve = i % 2 === 0
        ? TEAMOSS_PATHS.WEBSOCKET.forward
        : TEAMOSS_PATHS.WEBSOCKET.backward
      allParticles.push({
        curve,
        tParam: i / 20,
        speed:  TEAMOSS_PATHS.WEBSOCKET.speed *
                (0.85 + Math.random() * 0.3),
        color:  new THREE.Color(TEAMOSS_PATHS
                  .WEBSOCKET.color),
        index:  idx++,
      })
    }
    
    // Clerk (3 particles):
    for (let i = 0; i < 3; i++) {
      allParticles.push({
        curve:  TEAMOSS_PATHS.CLERK.curve,
        tParam: i / 3,
        speed:  TEAMOSS_PATHS.CLERK.speed,
        color:  new THREE.Color(TEAMOSS_PATHS
                  .CLERK.color),
        index:  idx++,
      })
    }
    
    // Inngest branches (2 per branch × 3 branches):
    TEAMOSS_PATHS.INNGEST.branches.forEach(branch => {
      for (let i = 0; i < 2; i++) {
        allParticles.push({
          curve:  branch,
          tParam: i / 2,
          speed:  TEAMOSS_PATHS.INNGEST.speed,
          color:  new THREE.Color(TEAMOSS_PATHS
                    .INNGEST.color),
          index:  idx++,
        })
      }
    })
    
    // MongoDB (4 particles):
    for (let i = 0; i < 4; i++) {
      allParticles.push({
        curve:  TEAMOSS_PATHS.MONGODB.curve,
        tParam: i / 4,
        speed:  TEAMOSS_PATHS.MONGODB.speed,
        color:  new THREE.Color(TEAMOSS_PATHS
                  .MONGODB.color),
        index:  idx++,
      })
    }
    
    // Stream (3 particles):
    for (let i = 0; i < 3; i++) {
      allParticles.push({
        curve:  TEAMOSS_PATHS.STREAM.curve,
        tParam: i / 3,
        speed:  TEAMOSS_PATHS.STREAM.speed,
        color:  new THREE.Color(
                  TEAMOSS_PATHS.STREAM.colorHex),
        index:  idx++,
      })
    }
    
    particles.current = allParticles
    
  }, [register])
  
  // ── BREATH SYNC ─────────────────────────
  // TeamOS breathes slightly faster 
  // (20 breaths/min) because it's a live 
  // communication system. Layer secondary 
  // rhythm on top of organism breath:
  const secondaryBreathRef = useRef(0)
  
  useEffect(() => {
    let frame: number
    const SECONDARY_PERIOD = 3000 // 20/min
    
    const tick = () => {
      const t = (Date.now() % SECONDARY_PERIOD) / 
                 SECONDARY_PERIOD
      secondaryBreathRef.current = 
        Math.sin(t * Math.PI * 2) * 0.5 + 0.5
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])
  
  // ── ACTIVE STATE MANAGEMENT ──────────────
  useEffect(() => {
    const isActive = activeOrgan === 'teamoss'
    
    if (isActive && organState.current === 'resting') {
      organState.current = 'activating'
      
      // Transition outer to transparent:
      if (outerMeshRef.current) {
        const mat = outerMeshRef.current
          .material as THREE.MeshPhongMaterial
        mat.depthWrite = false  
        // CRITICAL: switch before fading
        
        gsap.to(mat, {
          opacity: 0.35,
          duration: 0.6,
          ease: 'power2.out',
          onComplete: () => {
            organState.current = 'active'
          }
        })
      }
      
    } else if (!isActive && 
      organState.current === 'active') {
      organState.current = 'deactivating'
      
      if (outerMeshRef.current) {
        const mat = outerMeshRef.current
          .material as THREE.MeshPhongMaterial
        
        gsap.to(mat, {
          opacity: 1.0,
          duration: 0.4,
          ease: 'power2.in',
          onComplete: () => {
            mat.depthWrite = true  
            // Restore depthWrite when opaque again
            organState.current = 'resting'
          }
        })
      }
    }
  }, [activeOrgan])
  
  // ── CLICK HANDLER ───────────────────────
  const handleClick = useCallback(() => {
    if (activeOrgan === 'teamoss') {
      setActiveOrgan(null)  // deactivate
    } else {
      setActiveOrgan('teamoss')
    }
  }, [activeOrgan, setActiveOrgan])
  
  // ── PULSE RESPONSE ───────────────────────
  useOrganismPulse({
    onPulse: () => {
      // Flash organ's signature color:
      if (outerMeshRef.current) {
        const mat = outerMeshRef.current
          .material as THREE.MeshPhongMaterial
        const originalColor = mat.emissive.clone()
        mat.emissive.set(COLORS_HEX.NEURAL_CYAN)
        setTimeout(() => {
          mat.emissive.copy(originalColor)
        }, 100)
      }
    }
  })
  
  // ── PARTICLE ANIMATION ───────────────────
  useFrame((state, delta) => {
    if (!particleMeshRef.current) return
    if (!particles.current.length) return
    
    const safeDelta = Math.min(delta, 0.05)
    const d = dummy.current
    
    // Speed multiplier: higher when active:
    const speedMult = 
      organState.current === 'active'    ? 1.0 :
      organState.current === 'activating'? 0.7 :
      0.4  // resting: slow internal motion
    
    particles.current.forEach((p) => {
      p.tParam = (p.tParam + 
        p.speed * speedMult * safeDelta) % 1.0
      
      const pos = p.curve.getPoint(
        Math.max(0, Math.min(1, p.tParam)))
      d.position.copy(pos)
      d.scale.setScalar(0.006)
      d.updateMatrix()
      
      particleMeshRef.current!.setMatrixAt(
        p.index, d.matrix)
      particleMeshRef.current!.setColorAt(
        p.index, p.color)
    })
    
    particleMeshRef.current.instanceMatrix
      .needsUpdate = true
    if (particleMeshRef.current.instanceColor) {
      particleMeshRef.current.instanceColor
        .needsUpdate = true
    }
    
    // Secondary breath on outer mesh:
    if (outerMeshRef.current && 
        organState.current === 'resting') {
      const breathScale = 1.0 + 
        secondaryBreathRef.current * 0.015
      outerMeshRef.current.scale.setScalar(breathScale)
    }
  })
  
  const ORGAN_POS = REGION_POSITIONS.TEAMOSS_ORGAN as 
    [number, number, number]
  const totalParticles = 20 + 3 + 6 + 4 + 3  // = 36
  
  return (
    <group 
      position={ORGAN_POS}
      onClick={handleClick}
    >
      {/* Outer organ mesh: */}
      <mesh ref={outerMeshRef} renderOrder={1}>
        {/* geometry and material set in useEffect */}
      </mesh>
      
      {/* Inner architecture group: */}
      <group ref={innerGroupRef} renderOrder={0}>
        {/* Architecture path lines (static): */}
        <ArchitectureLines />
        
        {/* Animated particles: */}
        <instancedMesh
          ref={particleMeshRef}
          args={[
            new THREE.SphereGeometry(1, 4, 4),
            new THREE.MeshBasicMaterial({ 
              vertexColors: true }),
            totalParticles,
          ]}
          frustumCulled={false}
          renderOrder={0}
        />
      </group>
      
      {/* Hover/active label at MESO: */}
      {(activeOrgan === 'teamoss' && 
        zoomLevel === 'meso') && (
        <Html
          position={[0, 0.3, 0]}
          transform={false}
          style={{ pointerEvents: 'none' }}
        >
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              fontFamily:    'var(--font-mono)',
              fontSize:      11,
              color:         '#4A6B8A',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              whiteSpace:    'nowrap',
            }}
          >
            TEAMOSS
            <span style={{ 
              color: '#00E87A', 
              marginLeft: 12 
            }}>
              800 concurrent · sub-200ms
            </span>
          </motion.div>
        </Html>
      )}
      
      {/* Full micro panel: */}
      <AnimatePresence>
        {activeOrgan === 'teamoss' && 
         zoomLevel === 'micro' && (
          <Html
            transform={false}
            style={{
              position:        'fixed',
              top:             '50%',
              left:            '50%',
              transform:       'translate(-50%,-50%)',
              width:           '82vw',
              maxWidth:        '920px',
              pointerEvents:   'none',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{    opacity: 0, y:  8 }}
              transition={{ duration: 0.4, 
                ease: [0.16, 1, 0.3, 1] }}
              style={{
                display:             'grid',
                gridTemplateColumns: '1fr 1.6fr 1fr',
                gap:                 '20px',
              }}
            >
              {/* LEFT — METRICS */}
              <div style={{
                fontFamily:   'var(--font-mono)',
                fontSize:     12,
                color:        '#B8D4E8',
                background:   'rgba(10,22,40,0.96)',
                border:       '1px solid rgba(0,200,255,0.2)',
                borderTop:    '3px solid #00C8FF',
                padding:      '18px 20px',
                borderRadius: '0 0 4px 4px',
              }}>
                <div style={{ 
                  color:'#4A6B8A', 
                  fontSize:10, 
                  letterSpacing:'0.15em',
                  marginBottom:12 
                }}>
                  TEAMOSS
                </div>
                {[
                  ['WS Latency', '< 200ms', '#00E87A'],
                  ['Concurrency', '800',     '#00E87A'],
                  ['Features',   '10+',      '#B8D4E8'],
                  ['Consistency','100%',     '#B8D4E8'],
                  ['Auth',       'Clerk JWT','#6B2FEE'],
                ].map(([k, v, c]) => (
                  <div key={k} style={{ 
                    display:'flex', 
                    justifyContent:'space-between',
                    lineHeight: 2.0,
                  }}>
                    <span style={{ color:'#4A6B8A' }}>
                      {k}
                    </span>
                    <span style={{ 
                      color: c, fontWeight: 500 
                    }}>
                      {v}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* CENTER — CODE SNIPPET */}
              <div style={{
                fontFamily:   'var(--font-mono)',
                fontSize:     11,
                background:   'rgba(4,8,15,0.98)',
                border:       '1px solid rgba(0,200,255,0.1)',
                padding:      '18px 20px',
                borderRadius: '4px',
                lineHeight:   1.8,
                overflowX:    'auto',
                whiteSpace:   'pre',
                color:        '#B8D4E8',
              }}>
                <span style={{ color:'#4A6B8A' }}>
                  {`// Event-driven user sync\n`}
                  {`// Zero-latency across services\n`}
                </span>
                {`export const syncUser = \n`}
                {`  inngest.createFunction(\n`}
                {`  `}
                <span style={{ color:'#6B2FEE' }}>
                  {`{ id: "sync-user" }`}
                </span>
                {`,\n`}
                {`  `}
                <span style={{ color:'#00C8FF' }}>
                  {`{ event: "clerk/user.created" }`}
                </span>
                {`,\n`}
                {`  async ({ event, step }) => {\n`}
                {`    await step.run(\n`}
                {`      "create-user-db",\n`}
                {`      async () => {\n`}
                {`        return await `}
                <span style={{ color:'#FF7A2F' }}>
                  {`db.user`}
                </span>
                {`.create({\n`}
                {`          clerkId: event.data.id\n`}
                {`        })\n`}
                {`      }\n`}
                {`    )\n`}
                {`  }\n`}
                {`)`}
              </div>
              
              {/* RIGHT — DECISION LOG */}
              <div style={{
                fontFamily:   'var(--font-mono)',
                fontSize:     11,
                color:        '#B8D4E8',
                background:   'rgba(10,22,40,0.96)',
                border:       '1px solid rgba(107,47,238,0.2)',
                borderTop:    '3px solid rgba(107,47,238,0.6)',
                padding:      '18px 20px',
                borderRadius: '0 0 4px 4px',
                lineHeight:   1.7,
              }}>
                <div style={{ 
                  color:'#4A6B8A', 
                  fontSize:10,
                  letterSpacing:'0.15em',
                  marginBottom:12 
                }}>
                  DECISION LOG
                </div>
                {[
                  'Chose Inngest over BullMQ — event ' +
                  'replay capability was non-negotiable ' +
                  'for user sync reliability.',
                  
                  'Stream Chat SDK after evaluating ' +
                  'Socket.io limits at 500+ connections. ' +
                  'Latency dropped 40%.',
                  
                  'Clerk JWT verified at WebSocket ' +
                  'handshake — prevents unauthorized ' +
                  'room access without per-message overhead.',
                ].map((note, i) => (
                  <div key={i} style={{ 
                    marginBottom: i < 2 ? 14 : 0,
                    paddingBottom: i < 2 ? 14 : 0,
                    borderBottom: i < 2 
                      ? '1px solid rgba(107,47,238,0.15)'
                      : 'none',
                    color: '#B8D4E8',
                  }}>
                    <span style={{ 
                      color: '#4A6B8A',
                      marginRight: 6 
                    }}>
                      {`0${i+1}`}
                    </span>
                    {note}
                  </div>
                ))}
              </div>
            </motion.div>
          </Html>
        )}
      </AnimatePresence>
    </group>
  )
}

// ─── ARCHITECTURE LINES (static visual) ────
// Thin line paths showing architecture routes
// inside the organ, always visible when organ 
// is semi-transparent (active state).

function ArchitectureLines() {
  // Create static line for each path:
  const paths = [
    { curve: TEAMOSS_PATHS.CLERK.curve,   
      color: TEAMOSS_PATHS.CLERK.color   },
    { curve: TEAMOSS_PATHS.WEBSOCKET.forward,
      color: TEAMOSS_PATHS.WEBSOCKET.color },
    { curve: TEAMOSS_PATHS.MONGODB.curve,  
      color: TEAMOSS_PATHS.MONGODB.color  },
    { curve: TEAMOSS_PATHS.STREAM.curve,   
      color: TEAMOSS_PATHS.STREAM.colorHex},
  ]
  
  return (
    <group>
      {paths.map((path, i) => {
        const points = path.curve.getPoints(30)
        const geo    = new THREE.BufferGeometry()
          .setFromPoints(points)
        const mat    = new THREE.LineBasicMaterial({
          color:       path.color,
          transparent: true,
          opacity:     0.25,  // subtle background trace
        })
        return (
          <line key={i}>
            <primitive object={geo} attach="geometry"/>
            <primitive object={mat} attach="material"/>
          </line>
        )
      })}
    </group>
  )
}

═══════════════════════════════════════════════
BillStackOrgan.tsx — KEY DIFFERENCES FROM TEAMOSS
═══════════════════════════════════════════════

BillStack is the same pattern as TeamOS with 
these exact differences. Build it identically 
except for these parameters:

POSITION: REGION_POSITIONS.BILLSTACK_ORGAN 
= (0.5, 0.0, 0.15)

ORGAN GEOMETRY PARAMETERS:
createOrganGeometry(0.20, 1.8, 0.018, 0.90, 1.05)
// Liver-like: coarser, denser, slightly wider

OUTER COLOR: 0x0A1A30 (slightly warmer than TeamOS)

ARCHITECTURE PATHS (relative to 0.5, 0.0, 0.15):

const brel = c([0.5, 0.0, 0.15])

PATH_SCHEMA_FACTORY (THE STAR FEATURE):
// 1 input → 4 outputs (auto-discovery)
// Color: GROWTH (#00E87A) — the innovation
trunk: brel([
  [-0.10,  0.04, 0.01],  // Schema input
  [-0.04,  0.02, 0.02],
  [ 0.00,  0.00, 0.03],  // Factory junction
])
outputs: [  // 4 endpoints from junction
  brel([[ 0.00,0.00,0.03],[ 0.04, 0.06,0.02],
        [ 0.08, 0.10,0.01]]),  // GET endpoint
  brel([[ 0.00,0.00,0.03],[ 0.06, 0.02,0.02],
        [ 0.10, 0.04,0.01]]),  // POST endpoint
  brel([[ 0.00,0.00,0.03],[ 0.04,-0.04,0.02],
        [ 0.08,-0.08,0.01]]),  // PUT endpoint
  brel([[ 0.00,0.00,0.03],[-0.02,-0.06,0.02],
        [-0.04,-0.10,0.01]]),  // DELETE endpoint
]
// VISUAL: 1 input particle → at junction splits 
// into 4 simultaneously. 
// This must be visible. Show it clearly.
// Implementation: when factory particle reaches 
// tParam > 0.95 on trunk, spawn 4 new particles 
// one on each output curve at tParam = 0.0

PATH_MONGODB_ATOMIC (4 parallel branches):
// Color: AMBER_PULSE
// All 4 branches animate simultaneously
// representing parallel query execution
BRANCHES:
Invoice: brel([[-0.08,-0.04,0.01],
               [-0.02,-0.06,0.02],[0.06,-0.04,0.01]])
Inventory: brel([[-0.08,-0.02,0.01],
                 [-0.02,-0.02,0.02],[0.06,-0.02,0.01]])
Billing: brel([[-0.08, 0.00,0.01],
               [-0.02, 0.01,0.02],[0.06, 0.00,0.01]])
CRM: brel([[-0.08, 0.02,0.01],
           [-0.02, 0.03,0.02],[0.06, 0.02,0.01]])

PATH_PDF (sequential, methodical):
// Color: NEURAL_CYAN at 60%
brel([[-0.10, 0.08,0.01],[-0.04,0.06,0.02],
      [ 0.02, 0.06,0.02],[ 0.08,0.08,0.01]])

METRICS (left panel):
WS Latency → API Latency: '-48%'  color:'#00E87A'
Concurrency → Boilerplate: '0%'   color:'#00E87A'
Features → Systems: '6'           color:'#B8D4E8'
Consistency → Cache Hit: '87%'    color:'#B8D4E8'
Auth → PDF: 'GST/HSN'             color:'#6B2FEE'

CODE SNIPPET (center, BillStack's key code):
// Auto-generates full CRUD from schema
// Eliminates 100% of boilerplate
const createAPIFactory = (
  model: Model<any>,
  path: string
) => {
  router.get(path, auth, async (req, res) => {
    const data = await model
      .find().lean().exec()
    res.json({ success: true, data })
  })
  // POST, PUT, DELETE auto-generated
  // Zero manual route code required
}

DECISION LOG (right panel, 3 entries):
01. 'Redis caching added at week 3 post 
    load-testing. Bottleneck at 200+ 
    concurrent reads. Hit rate now 87%.'

02. 'Auto-discovery factory built after 
    writing identical CRUD blocks 3 times. 
    Repetition was the architecture signal.'

03. 'Atomic transactions for invoice + 
    inventory — data inconsistency risk found 
    during stress test at 500 concurrent ops.'

═══════════════════════════════════════════════
GhostDeckOrgan.tsx — INCOMPLETE FORMING ORGAN
═══════════════════════════════════════════════

'use client'

import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useOrganism } from '@/context/OrganismContext'
import { useThreeDisposal } from '@/hooks/useThreeDisposal'
import { REGION_POSITIONS } from '@/lib/constants'
import { COLORS_HEX } from '@/lib/colors'

// GhostDeck organ is deliberately INCOMPLETE.
// It is still forming — some membrane built,
// some still constructing.
// This incompleteness is the point.

export function GhostDeckOrgan() {
  const { register } = useThreeDisposal()
  const { activeOrgan, setActiveOrgan } = useOrganism()
  
  // The organ membrane is represented as a 
  // POINT CLOUD (not solid mesh) because it's 
  // not fully formed yet.
  // Points represent the membrane "being assembled."
  
  const pointsRef      = useRef<THREE.Points | null>(null)
  const glowRef        = useRef<THREE.Mesh | null>(null)
  const buildParticles = useRef<{
    targetIdx: number  // which membrane point is target
    tParam:    number  // 0-1 progress
    active:    boolean
  }[]>([])
  const builtCount = useRef(0)  
  // How many membrane points are "complete"
  
  // Total membrane points:
  const TOTAL_POINTS = 180
  // Points built so far (40% = forming):
  const BUILT_AT_START = Math.floor(TOTAL_POINTS * 0.40)
  
  // ── MEMBRANE GEOMETRY ───────────────────
  // Points distributed on irregular sphere surface
  // (like GhostDeck organ shape but as point cloud):
  useEffect(() => {
    const positions  = new Float32Array(TOTAL_POINTS * 3)
    const colors     = new Float32Array(TOTAL_POINTS * 3)
    const sizes      = new Float32Array(TOTAL_POINTS)
    
    // Generate point positions on sphere surface
    // with slight noise:
    for (let i = 0; i < TOTAL_POINTS; i++) {
      // Fibonacci sphere distribution 
      // (evenly distributed points on sphere):
      const phi    = Math.acos(1 - 
        2 * (i + 0.5) / TOTAL_POINTS)
      const theta  = Math.PI * (1 + Math.sqrt(5)) * i
      const radius = 0.18 + 
        (Math.random() - 0.5) * 0.03
      
      positions[i*3+0] = radius * 
        Math.sin(phi) * Math.cos(theta)
      positions[i*3+1] = radius * 
        Math.sin(phi) * Math.sin(theta)
      positions[i*3+2] = radius * Math.cos(phi)
      
      // First BUILT_AT_START points are "complete"
      // (full BIOLUMEN color):
      const isBuilt = i < BUILT_AT_START
      const intensity = isBuilt ? 1.0 : 0.0
      
      // BIOLUMEN: #6B2FEE = (0.416, 0.184, 0.933)
      colors[i*3+0] = 0.416 * intensity
      colors[i*3+1] = 0.184 * intensity
      colors[i*3+2] = 0.933 * intensity
      
      sizes[i] = isBuilt ? 0.008 : 0.003
    }
    
    const geo = register(new THREE.BufferGeometry())
    geo.setAttribute('position', 
      new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color',    
      new THREE.BufferAttribute(colors,    3))
    geo.setAttribute('size',     
      new THREE.BufferAttribute(sizes,     1))
    
    const mat = register(
      new THREE.PointsMaterial({
        size:          0.008,
        vertexColors:  true,
        transparent:   true,
        opacity:       0.85,
        sizeAttenuation: true,
      })
    )
    
    if (pointsRef.current) {
      pointsRef.current.geometry = geo
      pointsRef.current.material = mat
    }
    
    builtCount.current = BUILT_AT_START
    
    // Initialize build particles 
    // (one new point "assembles" every 2 seconds):
    buildParticles.current = [{
      targetIdx: BUILT_AT_START,
      tParam:    0,
      active:    true,
    }]
    
  }, [register])
  
  // ── OUTER GLOW ──────────────────────────
  // Pulsing glow sphere around the forming organ.
  useEffect(() => {
    const geo = register(
      new THREE.SphereGeometry(0.21, 16, 16))
    const mat = register(
      new THREE.MeshBasicMaterial({
        color:       COLORS_HEX.BIOLUMEN,
        transparent: true,
        opacity:     0.08,
        side:        THREE.BackSide,  
        // BackSide = renders inside of sphere
        // giving interior glow effect
        depthWrite:  false,
      })
    )
    if (glowRef.current) {
      glowRef.current.geometry = geo
      glowRef.current.material = mat
    }
  }, [register])
  
  // ── ANIMATION ───────────────────────────
  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime()
    
    // GLOW PULSE: opacity cycles 0.05→0.12→0.05
    if (glowRef.current) {
      const mat = glowRef.current.material as 
        THREE.MeshBasicMaterial
      mat.opacity = 0.05 + 
        (Math.sin(elapsed * Math.PI) * 0.5 + 0.5) * 0.07
    }
    
    // BUILD ANIMATION: 
    // A new membrane point "appears" every 2 seconds.
    // Simulate by slowly brightening unbuilt points:
    if (!pointsRef.current) return
    const colorAttr = pointsRef.current.geometry
      .attributes.color as THREE.BufferAttribute
    const sizeAttr  = pointsRef.current.geometry
      .attributes.size  as THREE.BufferAttribute
    
    // Current "building" point index:
    const buildIdx = Math.floor(
      (elapsed * 0.5) % 
      (TOTAL_POINTS - BUILT_AT_START)
    ) + BUILT_AT_START
    
    // Brighten that point progressively:
    const buildProgress = 
      (elapsed * 0.5) % 1.0  // 0-1 per point
    
    if (buildIdx < TOTAL_POINTS) {
      colorAttr.setXYZ(buildIdx,
        0.416 * buildProgress,
        0.184 * buildProgress,
        0.933 * buildProgress,
      )
      sizeAttr.setX(buildIdx, 
        0.003 + buildProgress * 0.005)
      
      colorAttr.needsUpdate = true
      sizeAttr.needsUpdate  = true
    }
    
    // Slow rotation: organ slowly spins
    // (still forming, not yet stable):
    if (pointsRef.current) {
      pointsRef.current.rotation.y = elapsed * 0.08
      pointsRef.current.rotation.x = 
        Math.sin(elapsed * 0.04) * 0.05
    }
  })
  
  const ORGAN_POS = [0.0, -0.3, 0.2] as 
    [number, number, number]
  
  return (
    <group 
      position={ORGAN_POS}
      onClick={() => {
        setActiveOrgan(
          activeOrgan === 'ghostdeck' 
            ? null 
            : 'ghostdeck'
        )
      }}
    >
      {/* Outer glow sphere: */}
      <mesh ref={glowRef} />
      
      {/* Membrane point cloud: */}
      <points ref={pointsRef} />
      
      {/* [BUILDING] badge — always visible: */}
      <Html
        position={[0, 0.25, 0]}
        transform={false}
        style={{ pointerEvents: 'none' }}
      >
        <div style={{
          fontFamily:    'var(--font-mono)',
          fontSize:      10,
          letterSpacing: '0.12em',
          display:       'flex',
          alignItems:    'center',
          gap:           8,
          whiteSpace:    'nowrap',
        }}>
          <span style={{ color: '#6B2FEE' }}>
            GHOSTDECK
          </span>
          <span style={{
            color:        '#4A6B8A',
            background:   'rgba(107,47,238,0.12)',
            border:       '1px solid rgba(107,47,238,0.3)',
            padding:      '2px 6px',
            borderRadius: 2,
          }}>
            FORMING
          </span>
        </div>
      </Html>
      
      {/* Active state: concept preview */}
      {activeOrgan === 'ghostdeck' && (
        <Html
          transform={false}
          style={{
            position:      'fixed',
            top:           '50%',
            left:          '50%',
            transform:     'translate(-50%,-50%)',
            pointerEvents: 'none',
          }}
        >
          <div style={{
            fontFamily:   'var(--font-mono)',
            fontSize:     13,
            color:        '#B8D4E8',
            background:   'rgba(10,22,40,0.96)',
            border:       '1px solid rgba(107,47,238,0.4)',
            borderTop:    '3px solid #6B2FEE',
            padding:      '28px 36px',
            borderRadius: '0 0 4px 4px',
            maxWidth:     380,
            lineHeight:   1.8,
          }}>
            <div style={{
              color:         '#4A6B8A',
              fontSize:      10,
              letterSpacing: '0.2em',
              marginBottom:  16,
            }}>
              GHOSTDECK // CONCEPT ARCHITECTURE
            </div>
            
            {[
              ['Input',       'MediaPipe Hands', '#6B2FEE'],
              ['Tracking',    'Laptop Camera',   '#B8D4E8'],
              ['Recognition', 'Gesture Engine',  '#6B2FEE'],
              ['Output',      'Tone.js Audio',   '#00C8FF'],
              ['Interface',   'Virtual Deck',    '#00C8FF'],
              ['Hardware',    'None Required',   '#00E87A'],
            ].map(([k, v, c]) => (
              <div key={k} style={{
                display:        'flex',
                justifyContent: 'space-between',
              }}>
                <span style={{ color: '#4A6B8A' }}>
                  {k}
                </span>
                <span style={{ 
                  color: c, fontWeight: 500 
                }}>
                  {v}
                </span>
              </div>
            ))}
            
            <div style={{
              marginTop:   20,
              paddingTop:  16,
              borderTop:   '1px solid rgba(107,47,238,0.2)',
              color:       '#4A6B8A',
              fontSize:    11,
              fontStyle:   'italic',
            }}>
              "The idea: eliminate the hardware entirely. 
              Your hands become the instrument. 
              Phase 1 in progress."
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}

═══════════════════════════════════════════════
ProjectOrgans.tsx — PARENT ORCHESTRATOR
═══════════════════════════════════════════════

'use client'

// Mounts all three organs.
// Handles the "only one active at a time" rule.

import { useEffect } from 'react'
import { useOrganism } from '@/context/OrganismContext'
import { TeamOSOrgan }    from './organs/TeamOSOrgan'
import { BillStackOrgan } from './organs/BillStackOrgan'
import { GhostDeckOrgan } from './organs/GhostDeckOrgan'

export function ProjectOrgans() {
  const { 
    activeOrgan, 
    setActiveOrgan,
    setZoomLevel,
    zoomLevel,
  } = useOrganism()
  
  // When an organ activates and we're at macro:
  // Auto-zoom to meso:
  useEffect(() => {
    if (activeOrgan && zoomLevel === 'macro') {
      setZoomLevel('meso')
    }
    // When no organ is active and we're at meso:
    // Return to macro:
    if (!activeOrgan && zoomLevel === 'meso') {
      setZoomLevel('macro')
    }
  }, [activeOrgan, zoomLevel, setZoomLevel])
  
  return (
    <group name="project-organs">
      <TeamOSOrgan />
      <BillStackOrgan />
      <GhostDeckOrgan />
    </group>
  )
}

═══════════════════════════════════════════════
ADD ProjectOrgans TO OrganismCanvas
═══════════════════════════════════════════════

In OrganismCanvas.tsx, inside Canvas, 
after <CirculatorySystem />:

import { ProjectOrgans } from './ProjectOrgans'

// Inside Canvas JSX:
<OrganismMesh />
<CirculatorySystem />
<ProjectOrgans />    // ← ADD THIS

═══════════════════════════════════════════════
VERIFICATION — AFTER PROMPT 06
═══════════════════════════════════════════════

npm run dev must show:
□ Three distinct organ forms visible on organism
□ TeamOS: lung-like, left-center position
□ BillStack: liver-like (denser), right-center
□ GhostDeck: point cloud rotating slowly, 
  lower-center, with FORMING badge

□ Clicking TeamOS: organism zooms to MESO,
  organ becomes semi-transparent,
  architecture particles visible inside

□ Clicking BillStack: TeamOS deactivates,
  BillStack activates (never two at once)

□ MICRO zoom on active organ:
  Three-panel layout appears 
  (metrics / code / decisions)

□ GhostDeck point cloud slowly assembles 
  (one new point brightening every 2 seconds)

□ GhostDeck click: concept architecture panel

□ No z-fighting (no flickering surfaces)

□ No TypeScript errors

If organ interior not visible when clicking:
→ depthWrite: false not being set before 
  opacity transition starts.
  Check the useEffect for activeOrgan —
  mat.depthWrite = false must be FIRST line,
  before gsap.to() call.

If three-panel overlaps organism instead of 
centering on screen:
→ Html transform={false} requires style with
  position: 'fixed' on the inner div,
  NOT on the Html component itself.
  The Html component just needs 
  transform={false}. Inner div positions itself.

If clicking organ does not zoom:
→ ProjectOrgans useEffect is not running.
  Check that activeOrgan and zoomLevel are 
  both reading from the SAME OrganismContext 
  instance. If two providers exist, they 
  won't share state. Only ONE OrganismProvider 
  should exist — in page.tsx at the root.
  while you not need to start npm run dev 