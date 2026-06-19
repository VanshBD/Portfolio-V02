'use client'

import {
  useRef, useState, useEffect, useCallback
} from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { useOrganism } from '@/context/OrganismContext'
import {
  REGION_POSITIONS,
  PARTICLES,
} from '@/lib/constants'

// ─── NODE DATA — COMPLETE SKILL SET ─────────

type NodeTier = 1 | 2 | 3
type NodeType = 'standard' | 'ai'

interface SkillNode {
  id: string
  label: string
  tier: NodeTier
  type: NodeType
  position: THREE.Vector3 // set during layout
}

const SKILL_NODES: Omit<SkillNode, 'position'>[] = [
  // TIER 1 — always visible, largest:
  { id:'nodejs',     label:'Node.js',
    tier:1, type:'standard' },
  { id:'react',      label:'React',
    tier:1, type:'standard' },
  { id:'typescript', label:'TypeScript',
    tier:1, type:'standard' },
  { id:'nextjs',     label:'Next.js',
    tier:1, type:'standard' },
  { id:'mongodb',    label:'MongoDB',
    tier:1, type:'standard' },
  { id:'websockets', label:'WebSockets',
    tier:1, type:'standard' },

  // TIER 2 — visible at macro, medium size:
  { id:'express',    label:'Express.js',
    tier:2, type:'standard' },
  { id:'redis',      label:'Redis',
    tier:2, type:'standard' },
  { id:'jwt',        label:'JWT/OAuth',
    tier:2, type:'standard' },
  { id:'restapi',    label:'REST API',
    tier:2, type:'standard' },
  { id:'graphql',    label:'GraphQL',
    tier:2, type:'standard' },
  { id:'docker',     label:'Docker',
    tier:2, type:'standard' },
  { id:'rbac',       label:'RBAC',
    tier:2, type:'standard' },
  { id:'microservices', label:'Microservices',
    tier:2, type:'standard' },

  // TIER 3 — visible at meso/micro only:
  { id:'gsap',       label:'GSAP',
    tier:3, type:'standard' },
  { id:'webrtc',     label:'WebRTC',
    tier:3, type:'standard' },
  { id:'nginx',      label:'Nginx',
    tier:3, type:'standard' },
  { id:'pm2',        label:'PM2',
    tier:3, type:'standard' },
  { id:'gcp',        label:'GCP',
    tier:3, type:'standard' },
  { id:'cicd',       label:'CI/CD',
    tier:3, type:'standard' },
  { id:'zod',        label:'Zod',
    tier:3, type:'standard' },
  { id:'jest',       label:'Jest',
    tier:3, type:'standard' },
  { id:'mongoose',   label:'Mongoose',
    tier:3, type:'standard' },
  { id:'mysql',      label:'MySQL',
    tier:3, type:'standard' },

  // AI NODES — special BIOLUMEN color:
  { id:'claudeapi',  label:'Claude API',
    tier:1, type:'ai' },
  { id:'geminiapi',  label:'Gemini API',
    tier:1, type:'ai' },
  { id:'prompteng',  label:'Prompt Engineering',
    tier:2, type:'ai' },
  { id:'aiworkflows',label:'AI Workflows',
    tier:2, type:'ai' },
  { id:'twilio',     label:'Twilio',
    tier:3, type:'ai' },
  { id:'nodemailer', label:'Nodemailer',
    tier:3, type:'ai' },
]

// Connection pairs: [fromId, toId, weight (1-5)]
const CONNECTIONS: [string, string, number][] = [
  ['nodejs',    'express',    5],
  ['nodejs',    'websockets', 5],
  ['nodejs',    'redis',      4],
  ['nodejs',    'mongodb',    5],
  ['nodejs',    'pm2',        3],
  ['nodejs',    'nginx',      3],
  ['typescript','react',      5],
  ['typescript','nextjs',     5],
  ['typescript','zod',        4],
  ['react',     'nextjs',     4],
  ['mongodb',   'mongoose',   5],
  ['mongodb',   'redis',      3],
  ['jwt',       'rbac',       4],
  ['jwt',       'nodejs',     3],
  ['jwt',       'express',    3],
  ['claudeapi', 'geminiapi',  5],
  ['claudeapi', 'nodejs',     4],
  ['claudeapi', 'prompteng',  5],
  ['geminiapi', 'aiworkflows',4],
  ['websockets','webrtc',     3],
  ['docker',    'nginx',      3],
  ['docker',    'cicd',       3],
  ['docker',    'gcp',        3],
  ['express',   'restapi',    5],
  ['graphql',   'nodejs',     3],
  ['rbac',      'jwt',        4],
  ['microservices','docker',  3],
  ['microservices','nodejs',  4],
  ['twilio',    'nodejs',     3],
  ['nodemailer','nodejs',     3],
  ['mysql',     'nodejs',     2],
  ['mysql',     'mongoose',   2],
  ['jest',      'typescript', 3],
]

// Context text shown when node is hovered:
const NODE_CONTEXT: Record<string, string> = {
  websockets: 'TeamOS: 800 concurrent connections ' +
    'at sub-200ms latency.',
  claudeapi: 'Integrated in production: 65% faster ' +
    'AI resume generation via pipeline.',
  geminiapi: 'AI workflows: reduced manual client ' +
    'processes by 60%+.',
  mongodb: 'Index tuning: -48% API response time ' +
    'across 6 enterprise systems.',
  redis: 'Caching layer: 87% cache hit rate, ' +
    'eliminates repeated DB reads.',
  rbac: 'JWT/OAuth RBAC: implemented across ' +
    '4 production apps.',
  microservices: 'Led 5-app backend architecture ' +
    'at Swift Rut Technologies.',
  typescript: '16,500+ GitHub contributions in 2026 ' +
    '— TypeScript in every project.',
  nodejs: 'The foundation. Every production system ' +
    'runs on Node.js.',
}

// ─── SIGNAL DATA STRUCTURE ──────────────────

interface Signal {
  connectionIndex: number // which connection
  tParam: number          // 0-1, position on curve
  speed: number           // units/second
  meshIndex: number       // which instancedMesh slot
}

// ─── NODE LAYOUT ALGORITHM ──────────────────
// Force-directed layout. Run once at module load (uses
// Math.random — must not run during React render).

const generateNodePositions = (
  nodes: typeof SKILL_NODES
): Map<string, THREE.Vector3> => {

  const regionCenter = new THREE.Vector3(
    -0.38, 0.48, 0.20)
  const positions = new Map<string, THREE.Vector3>()

  // Initial positions: random cluster around center
  nodes.forEach((node) => {
    const radius = node.tier === 1 ? 0.08 :
      node.tier === 2 ? 0.18 : 0.28
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    positions.set(node.id, new THREE.Vector3(
      regionCenter.x + radius * Math.sin(phi) *
        Math.cos(theta),
      regionCenter.y + radius * Math.sin(phi) *
        Math.sin(theta),
      regionCenter.z + radius * Math.cos(phi) * 0.3,
    ))
  })

  // Force-directed refinement: 50 iterations
  // (runs synchronously — only 30 nodes, very fast)
  for (let iter = 0; iter < 50; iter++) {
    const forces = new Map<string, THREE.Vector3>()
    nodes.forEach(n =>
      forces.set(n.id, new THREE.Vector3()))

    // REPULSION: push all nodes apart
    nodes.forEach((a, i) => {
      nodes.forEach((b, j) => {
        if (i >= j) return
        const posA = positions.get(a.id)!
        const posB = positions.get(b.id)!
        const diff = posA.clone().sub(posB)
        const dist = Math.max(diff.length(), 0.001)
        const repulsion = 0.0015 / (dist * dist)
        const force = diff.normalize()
          .multiplyScalar(repulsion)
        forces.get(a.id)!.add(force)
        forces.get(b.id)!.sub(force)
      })
    })

    // ATTRACTION: pull connected nodes together
    CONNECTIONS.forEach(([fromId, toId, weight]) => {
      const posA = positions.get(fromId)
      const posB = positions.get(toId)
      if (!posA || !posB) return
      const diff = posB.clone().sub(posA)
      const dist = diff.length()
      // Target distance: inversely proportional to weight
      const targetDist = 0.12 - weight * 0.01
      const attraction = (dist - targetDist) * 0.08
      const force = diff.normalize()
        .multiplyScalar(attraction)
      forces.get(fromId)!.add(force)
      forces.get(toId)!.sub(force)
    })

    // CENTERING: pull all nodes back to region center
    nodes.forEach((node) => {
      const pos = positions.get(node.id)!
      const toCenter = regionCenter.clone().sub(pos)
      forces.get(node.id)!.add(
        toCenter.multiplyScalar(0.05))
    })

    // Apply forces with damping:
    const damping = 0.85
    nodes.forEach((node) => {
      const pos = positions.get(node.id)!
      const force = forces.get(node.id)!
      pos.add(force.multiplyScalar(damping))
    })
  }

  return positions
}

// ─── ORGANIC CONNECTION CURVE ───────────────
// Creates a naturally curved connection between
// two node positions. Never straight.

const createOrganicConnection = (
  startPos: THREE.Vector3,
  endPos: THREE.Vector3
): THREE.CatmullRomCurve3 => {

  // Midpoint with random perpendicular offset:
  const mid = startPos.clone().lerp(endPos, 0.5)

  // Perpendicular direction in XY plane:
  const dir = endPos.clone().sub(startPos)
  const perp = new THREE.Vector3(
    -dir.y, dir.x, 0 // 90-degree rotation in XY
  ).normalize()

  // Random offset magnitude: 10-20% of length
  const length = dir.length()
  const offsetMag = length *
    (0.10 + Math.random() * 0.10)
  const side = Math.random() > 0.5 ? 1 : -1

  mid.add(perp.multiplyScalar(offsetMag * side))
  mid.z += (Math.random() - 0.5) * 0.03

  // 4-point curve: start → near-start bend →
  // near-end bend → end
  const nearStart = startPos.clone()
    .lerp(mid, 0.25)
  const nearEnd = mid.clone()
    .lerp(endPos, 0.75)

  return new THREE.CatmullRomCurve3([
    startPos, nearStart, mid, nearEnd, endPos
  ])
}

// ─── SIGNAL POOL INITIALIZER ────────────────

const initSignals = (
  connections: [string, string, number][],
  maxSignals: number
): Signal[] => {
  const signals: Signal[] = []

  for (let i = 0; i < maxSignals; i++) {
    const connIdx = i % connections.length
    const weight = connections[connIdx][2]

    // Speed: higher weight = faster signal
    const traversalTime = 1.4 - (weight - 3) * 0.15
    const speed = 1.0 / traversalTime

    signals.push({
      connectionIndex: connIdx,
      tParam: (i / maxSignals),  // staggered starts
      speed,
      meshIndex: i,
    })
  }

  return signals
}

// ─── HOVER MATH ─────────────────────────────

const moveNodeCloser = (
  hoveredPos: THREE.Vector3,
  currentPos: THREE.Vector3,
  fraction: number = 0.15 // 15% closer
): THREE.Vector3 => {
  // Vector from connected node toward hovered node:
  const toHovered = hoveredPos.clone()
    .sub(currentPos)
  // Move fraction of the way toward hovered:
  return currentPos.clone()
    .add(toHovered.multiplyScalar(fraction))
}

// GSAP animation for node drift:
const driftNodeToward = (
  mesh: THREE.Object3D,
  targetPos: THREE.Vector3,
  duration: number = 0.6
) => {
  gsap.to(mesh.position, {
    x: targetPos.x,
    y: targetPos.y,
    z: targetPos.z,
    duration,
    // elastic ease = slight spring overshoot
    ease: 'elastic.out(1, 0.8)',
  })
}

// Restore to original position:
const driftNodeBack = (
  mesh: THREE.Object3D,
  originalPos: THREE.Vector3,
  duration: number = 0.8
) => {
  gsap.to(mesh.position, {
    x: originalPos.x,
    y: originalPos.y,
    z: originalPos.z,
    duration,
    ease: 'power2.out',
  })
}

// ─── MODULE-SCOPE COMPUTED LAYOUT ───────────
// Computed once per page load (uses Math.random — kept out
// of React render so it stays pure / lint-clean).

const NODE_POSITIONS = generateNodePositions(SKILL_NODES)
const CONNECTION_CURVES: THREE.CatmullRomCurve3[] =
  CONNECTIONS.map(([fromId, toId]) =>
    createOrganicConnection(
      NODE_POSITIONS.get(fromId)!,
      NODE_POSITIONS.get(toId)!
    )
  )
// node id → instance index
const NODE_INDEX_MAP = new Map<string, number>(
  SKILL_NODES.map((n, i) => [n.id, i])
)

// Visual radius per tier:
const tierSize = (tier: NodeTier): number =>
  tier === 1 ? 0.020 : tier === 2 ? 0.014 : 0.009

// Base color per node type:
const nodeBaseColor = (type: NodeType): number =>
  type === 'ai' ? 0x6B2FEE : 0x00C8FF

// Resting opacity for a connection given its weight:
const connectionRestOpacity = (weight: number): number =>
  0.1 + weight * 0.04

// ─── COMPONENT ──────────────────────────────

export default function NeuralCluster() {
  // Refs (no re-renders):
  const nodeMeshesRef = useRef<THREE.Mesh[]>([])
  const connectionsGroupRef = useRef<THREE.Group>(null)
  const connectionLinesRef = useRef<THREE.Line[]>([])
  const signalMeshRef = useRef<THREE.InstancedMesh>(null)
  const signals = useRef<Signal[]>([])
  const originalSignalSpeeds = useRef<number[]>([])
  const signalSpeedMultiplierRef = useRef(1.0)
  const hoveredNodeId = useRef<string | null>(null)
  const dummyRef = useRef(new THREE.Object3D())
  const lastTimeRef = useRef(0)

  // State (rarely changes):
  const [labelData, setLabelData] = useState<{
    id: string
    position: THREE.Vector3
    label: string
    context: string
  } | null>(null)

  // From context:
  const {
    subscribeToBreath,
    unsubscribeFromBreath,
    zoomLevel,
    pulseCount,
    deviceTier,
  } = useOrganism()

  const MAX_SIGNALS = PARTICLES[deviceTier].neuralSignals

  // Signal instance geometry + material (stable):
  const [signalGeo] = useState(
    () => new THREE.SphereGeometry(0.004, 4, 4)
  )
  const [signalMat] = useState(
    () => new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
    })
  )

  // Briefly brighten a node to full white (signal arrival):
  const flashNode = useCallback((instanceIndex: number) => {
    const mesh = nodeMeshesRef.current[instanceIndex]
    if (!mesh) return
    const mat = mesh.material as THREE.MeshBasicMaterial
    mat.color.setRGB(1, 1, 1)
    setTimeout(() => {
      const node = SKILL_NODES[instanceIndex]
      if (!node) return
      mat.color.setHex(nodeBaseColor(node.type))
    }, 50)
  }, [])

  // ── BUILD CONNECTION LINES (imperative) ────
  useEffect(() => {
    const group = connectionsGroupRef.current
    if (!group) return

    const lines: THREE.Line[] = CONNECTION_CURVES.map(
      (curve, i) => {
        const points = curve.getPoints(24)
        const geom = new THREE.BufferGeometry()
          .setFromPoints(points)
        const weight = CONNECTIONS[i][2]
        const mat = new THREE.LineBasicMaterial({
          color: 0x00C8FF,
          transparent: true,
          opacity: connectionRestOpacity(weight),
        })
        return new THREE.Line(geom, mat)
      }
    )
    lines.forEach(line => group.add(line))
    connectionLinesRef.current = lines

    return () => {
      lines.forEach(line => {
        group.remove(line)
        line.geometry.dispose()
        if (line.material instanceof THREE.Material) {
          line.material.dispose()
        }
      })
      connectionLinesRef.current = []
    }
  }, [])

  // ── INIT SIGNAL POOL ───────────────────────
  useEffect(() => {
    signals.current = initSignals(CONNECTIONS, MAX_SIGNALS)
    originalSignalSpeeds.current =
      signals.current.map(s => s.speed)
  }, [MAX_SIGNALS])

  // Dispose signal geo/material on unmount:
  useEffect(() => {
    return () => {
      signalGeo.dispose()
      signalMat.dispose()
    }
  }, [signalGeo, signalMat])

  // ── BREATH SYNC ────────────────────────────
  useEffect(() => {
    subscribeToBreath('neural-cluster', (phase) => {
      // phase 0-1: signal speed multiplier 0.85 → 1.15
      signalSpeedMultiplierRef.current =
        0.85 + phase * 0.30
    })
    return () => unsubscribeFromBreath('neural-cluster')
  }, [subscribeToBreath, unsubscribeFromBreath])

  // ── ZOOM-RESPONSIVE DISPLAY ────────────────
  useEffect(() => {
    if (zoomLevel === 'macro') {
      // Hide tier 3 nodes:
      SKILL_NODES.forEach((node, i) => {
        const mesh = nodeMeshesRef.current[i]
        if (!mesh) return
        const visible = node.tier <= 2
        gsap.to(mesh.scale, {
          x: visible ? 1 : 0,
          y: visible ? 1 : 0,
          z: visible ? 1 : 0,
          duration: 0.4,
          ease: 'power2.out',
        })
      })

      // RESTORE original signal speeds:
      signals.current.forEach((s, i) => {
        s.speed = originalSignalSpeeds.current[i] ?? s.speed
      })
    }

    if (zoomLevel === 'meso' || zoomLevel === 'micro') {
      // Show all tier nodes:
      SKILL_NODES.forEach((node, i) => {
        const mesh = nodeMeshesRef.current[i]
        if (!mesh) return
        gsap.to(mesh.scale, {
          x: 1, y: 1, z: 1,
          duration: 0.6,
          ease: 'power2.out',
          delay: node.tier * 0.05,
        })
      })

      // Set speeds to 1.4× ORIGINAL (not current):
      signals.current.forEach((s, i) => {
        s.speed =
          (originalSignalSpeeds.current[i] ?? s.speed) * 1.4
      })
    }
  }, [zoomLevel])

  // ── PULSE — signal burst for 2s ────────────
  useEffect(() => {
    if (pulseCount === 0) return

    // Temporarily double all signal speeds for 2s:
    const originalSpeeds = signals.current
      .map(s => s.speed)
    signals.current.forEach(s => { s.speed *= 2 })

    const t = setTimeout(() => {
      signals.current.forEach((s, i) => {
        s.speed = originalSpeeds[i]
      })
    }, 2000)
    return () => clearTimeout(t)
  }, [pulseCount])

  // ── HOVER INTERACTION ──────────────────────
  const handleNodeHover = useCallback((nodeId: string) => {
    hoveredNodeId.current = nodeId
    const hoveredIdx = NODE_INDEX_MAP.get(nodeId)
    if (hoveredIdx === undefined) return
    const hoveredMesh = nodeMeshesRef.current[hoveredIdx]
    const hoveredPos = NODE_POSITIONS.get(nodeId)!

    // 1. HOVERED NODE: scale to 1.5x over 200ms
    if (hoveredMesh) {
      gsap.to(hoveredMesh.scale, {
        x: 1.5, y: 1.5, z: 1.5,
        duration: 0.2, ease: 'power2.out',
      })
    }

    // Determine connected node ids:
    const connectedIds = new Set<string>()
    CONNECTIONS.forEach(([from, to]) => {
      if (from === nodeId) connectedIds.add(to)
      if (to === nodeId) connectedIds.add(from)
    })

    // 2 & 3: connected drift closer, unconnected dim:
    SKILL_NODES.forEach((node, i) => {
      const mesh = nodeMeshesRef.current[i]
      if (!mesh || node.id === nodeId) return
      const origPos = NODE_POSITIONS.get(node.id)!
      const mat = mesh.material as THREE.Material
      if (connectedIds.has(node.id)) {
        const target = moveNodeCloser(hoveredPos, origPos)
        driftNodeToward(mesh, target)
        gsap.to(mat, { opacity: 1, duration: 0.3 })
      } else {
        gsap.to(mat, { opacity: 0.2, duration: 0.4 })
      }
    })

    // 4: brighten connections from hovered node:
    connectionLinesRef.current.forEach((line, i) => {
      const [from, to] = CONNECTIONS[i]
      const involved = from === nodeId || to === nodeId
      gsap.to(line.material, {
        opacity: involved ? 0.85 : 0.04,
        duration: 0.3,
      })
    })

    // 5: LABEL + CONTEXT TEXT appear:
    setLabelData({
      id: nodeId,
      position: hoveredPos,
      label: SKILL_NODES[hoveredIdx].label,
      context: NODE_CONTEXT[nodeId] ?? '',
    })
  }, [])

  const handleNodeUnhover = useCallback(() => {
    hoveredNodeId.current = null

    SKILL_NODES.forEach((node, i) => {
      const mesh = nodeMeshesRef.current[i]
      if (!mesh) return
      const origPos = NODE_POSITIONS.get(node.id)!
      const mat = mesh.material as THREE.Material
      gsap.to(mesh.scale, {
        x: 1, y: 1, z: 1, duration: 0.3,
      })
      driftNodeBack(mesh, origPos)
      gsap.to(mat, { opacity: 1, duration: 0.6 })
    })

    connectionLinesRef.current.forEach((line, i) => {
      const weight = CONNECTIONS[i][2]
      gsap.to(line.material, {
        opacity: connectionRestOpacity(weight),
        duration: 0.5,
      })
    })

    setLabelData(null)
  }, [])

  // ── SIGNAL ANIMATION (per frame) ───────────
  useFrame((state) => {
    const mesh = signalMeshRef.current
    if (!mesh) return
    if (!signals.current.length) return

    // Derive delta from the clock (avoids an unused param):
    const t = state.clock.elapsedTime
    const delta = Math.min(t - lastTimeRef.current, 0.1)
    lastTimeRef.current = t

    const dummy = dummyRef.current

    signals.current.forEach((signal) => {
      // Advance tParam (breath-synced speed):
      signal.tParam = (signal.tParam +
        signal.speed *
        signalSpeedMultiplierRef.current *
        delta) % 1.0

      const curve = CONNECTION_CURVES[signal.connectionIndex]
      if (!curve) return

      const pos = curve.getPoint(signal.tParam)
      dummy.position.copy(pos)
      dummy.updateMatrix()
      mesh.setMatrixAt(signal.meshIndex, dummy.matrix)

      // Flash destination node when signal arrives:
      if (signal.tParam > 0.95 && signal.tParam < 0.98) {
        const toId = CONNECTIONS[signal.connectionIndex][1]
        const nodeIdx = NODE_INDEX_MAP.get(toId)
        if (nodeIdx !== undefined) flashNode(nodeIdx)
      }
    })

    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <group>
      {/* Connection lines (imperative, added in effect) */}
      <group ref={connectionsGroupRef} />

      {/* Skill nodes */}
      {SKILL_NODES.map((node, i) => {
        const pos = NODE_POSITIONS.get(node.id)!
        return (
          <mesh
            key={node.id}
            ref={(el) => {
              if (el) nodeMeshesRef.current[i] = el
            }}
            position={[pos.x, pos.y, pos.z]}
            onPointerOver={(e) => {
              e.stopPropagation()
              handleNodeHover(node.id)
            }}
            onPointerOut={() => handleNodeUnhover()}
          >
            <sphereGeometry args={[tierSize(node.tier), 12, 12]} />
            <meshBasicMaterial
              color={nodeBaseColor(node.type)}
              transparent
              opacity={1}
            />
          </mesh>
        )
      })}

      {/* Signal particles */}
      <instancedMesh
        ref={signalMeshRef}
        args={[signalGeo, signalMat, MAX_SIGNALS]}
        frustumCulled={false}
      />

      {/* Hover label + context */}
      {labelData && (
        <Html
          position={[
            labelData.position.x,
            labelData.position.y + 0.05,
            labelData.position.z,
          ]}
          transform={false}
          style={{ pointerEvents: 'none' }}
        >
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            color: '#B8D4E8',
            background: 'rgba(10,22,40,0.92)',
            border: '1px solid rgba(0,200,255,0.3)',
            borderLeft: '3px solid rgba(0,200,255,0.8)',
            padding: '8px 12px',
            maxWidth: 240,
            backdropFilter: 'blur(8px)',
            whiteSpace: 'nowrap',
          }}>
            <div style={{
              color: '#00C8FF',
              fontWeight: 500,
              letterSpacing: '0.04em',
            }}>
              {labelData.label}
            </div>
            {labelData.context && (
              <div style={{
                color: '#4A6B8A',
                fontSize: 11,
                marginTop: 4,
                whiteSpace: 'normal',
                lineHeight: 1.5,
              }}>
                {labelData.context}
              </div>
            )}
          </div>
        </Html>
      )}

      {/* MICRO metrics panel */}
      {zoomLevel === 'micro' && (
        <Html
          position={[
            REGION_POSITIONS.NEURAL_CLUSTER.x + 0.4,
            REGION_POSITIONS.NEURAL_CLUSTER.y,
            REGION_POSITIONS.NEURAL_CLUSTER.z,
          ]}
          transform={false}
          style={{ pointerEvents: 'none' }}
        >
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            color: '#B8D4E8',
            background: 'rgba(10,22,40,0.92)',
            border: '1px solid rgba(0,200,255,0.3)',
            padding: '16px 20px',
            minWidth: 200,
            backdropFilter: 'blur(8px)',
          }}>
            <div style={{
              color: '#4A6B8A',
              fontSize: 10,
              letterSpacing: '0.15em',
              marginBottom: 12,
            }}>
              NEURAL CLUSTER
            </div>
            <div style={{ lineHeight: 1.9 }}>
              <span style={{ color:'#4A6B8A' }}>
                Problems Solved
              </span>
              <span style={{
                color:'#00E87A',
                float:'right',
                fontWeight:500,
              }}>
                162
              </span>
              <br/>
              <span style={{ color:'#4A6B8A' }}>
                └── Hard
              </span>
              <span style={{
                color:'#B8D4E8',
                float:'right',
              }}>
                33
              </span>
              <br/>
              <span style={{ color:'#4A6B8A' }}>
                GitHub 2026
              </span>
              <span style={{
                color:'#00E87A',
                float:'right',
                fontWeight:500,
              }}>
                16,500+
              </span>
              <br/>
              <span style={{ color:'#4A6B8A' }}>
                Skills
              </span>
              <span style={{
                color:'#B8D4E8',
                float:'right',
              }}>
                {SKILL_NODES.length}
              </span>
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}
