THE ORGANISM portfolio.
PROMPTS 01-04 complete. Organism breathes, 
Neural Cluster renders with signals, hover 
interactions work, zoom system active.

This is PROMPT 05 — the Circulatory System.
Live data veins running through the entire 
organism body carrying GitHub data as blood.

BUILD THESE FILES:
1. /hooks/useGitHubData.ts
2. /hooks/useThreeDisposal.ts  
3. /components/organism/CirculatorySystem.tsx

═══════════════════════════════════════════════
FILE 1 — /hooks/useGitHubData.ts
═══════════════════════════════════════════════

// This hook is a convenience wrapper around 
// the GitHub data already fetched in 
// OrganismContext. It adds computed values 
// that CirculatorySystem needs.

'use client'

import { useMemo } from 'react'
import { useOrganism } from '@/context/OrganismContext'
import { PARTICLES } from '@/lib/constants'

export interface GitHubComputedData {
  // From context:
  contributions:  number
  repos:          number
  recentActivity: 'high' | 'medium' | 'low'
  isLive:         boolean
  
  // Computed for CirculatorySystem:
  cellCount:         number  // based on tier + activity
  flowSpeedMultiplier: number // 0.7-1.3 based on activity
  veinOpacity:       number  // 0.6-1.0 based on activity
}

export function useGitHubData(): GitHubComputedData {
  const { githubData, deviceTier } = useOrganism()
  
  return useMemo(() => {
    // Cell count: device tier sets max,
    // recent activity scales within that max:
    const tierMax = PARTICLES[deviceTier].bloodCells
    const activityScale = {
      high:   1.00,
      medium: 0.67,
      low:    0.44,
    }[githubData.recentActivity]
    
    const cellCount = Math.floor(
      tierMax * activityScale
    )
    
    // Flow speed: active devs have faster blood flow:
    const flowSpeedMultiplier = {
      high:   1.30,
      medium: 1.00,
      low:    0.70,
    }[githubData.recentActivity]
    
    // Vein opacity: more active = more pressurized veins:
    const veinOpacity = {
      high:   1.00,
      medium: 0.75,
      low:    0.55,
    }[githubData.recentActivity]
    
    return {
      ...githubData,
      cellCount,
      flowSpeedMultiplier,
      veinOpacity,
    }
  }, [githubData, deviceTier])
}

═══════════════════════════════════════════════
FILE 2 — /hooks/useThreeDisposal.ts
═══════════════════════════════════════════════

// Utility hook: register Three.js objects for 
// automatic disposal on component unmount.
// Prevents GPU memory leaks.

'use client'

import { useRef, useEffect, useCallback } from 'react'
import * as THREE from 'three'

type Disposable = 
  | THREE.BufferGeometry
  | THREE.Material
  | THREE.Texture

export function useThreeDisposal() {
  const disposables = useRef<Disposable[]>([])
  
  // Register an object for disposal.
  // Returns the object itself for chaining:
  const register = useCallback(<T extends Disposable>(
    item: T
  ): T => {
    disposables.current.push(item)
    return item
  }, [])
  
  // Register multiple objects at once:
  const registerAll = useCallback(
    (items: Disposable[]) => {
    items.forEach(item => 
      disposables.current.push(item))
  }, [])
  
  // Manual dispose (for objects that need early 
  // cleanup, like when geometry changes):
  const disposeNow = useCallback(
    (item: Disposable) => {
    item.dispose()
    disposables.current = 
      disposables.current.filter(d => d !== item)
  }, [])
  
  // Auto-dispose all on unmount:
  useEffect(() => {
    return () => {
      disposables.current.forEach(item => {
        try { item.dispose() } catch {}
      })
      disposables.current = []
    }
  }, [])
  
  return { register, registerAll, disposeNow }
}

═══════════════════════════════════════════════
FILE 3 — VEIN PATH COORDINATES
(Define at top of CirculatorySystem.tsx)
═══════════════════════════════════════════════

// All 12 vein paths defined with exact 
// THREE.Vector3 control points.
// These coordinates are in organism local space
// (organism occupies roughly -1 to +1 on each axis).

// IMPORTANT: These curves were designed to:
// 1. Start/end at region positions from constants.ts
// 2. Never cross each other unnaturally
// 3. Follow organic curved paths (no straight lines)
// 4. Connect all 7 organism regions

import * as THREE from 'three'

// Helper: create CatmullRomCurve3 from array of 
// [x, y, z] tuples (cleaner than writing 
// new THREE.Vector3 for every point):
const vein = (
  points: [number, number, number][]
): THREE.CatmullRomCurve3 => {
  return new THREE.CatmullRomCurve3(
    points.map(([x, y, z]) => 
      new THREE.Vector3(x, y, z)),
    false,  // NOT closed loop
    'catmullrom',
    0.5     // tension
  )
}

// ─── VEIN DEFINITIONS ─────────────────────────

// VEIN_01 — AORTA (main vertical spine)
// Runs from Neural Cluster (top) through Core 
// (center) to Rhythm Organ (bottom).
// Thickest vein: radius 0.012
export const VEIN_01 = vein([
  [-0.38,  0.48,  0.20],  // Neural Cluster start
  [-0.20,  0.35,  0.15],
  [-0.05,  0.18,  0.12],
  [ 0.00,  0.00,  0.10],  // Core center
  [ 0.02, -0.18,  0.10],
  [ 0.01, -0.35,  0.11],
  [ 0.00, -0.50,  0.12],  // Rhythm Organ end
])

// VEIN_02 — LEFT MAIN BRANCH
// Forks from Aorta at Core, goes to TeamOS organ.
// Radius 0.008
export const VEIN_02 = vein([
  [ 0.00,  0.00,  0.10],  // Core (Aorta fork point)
  [-0.15,  0.05,  0.12],
  [-0.30,  0.02,  0.13],
  [-0.50,  0.00,  0.15],  // TeamOS Organ center
])

// VEIN_03 — RIGHT MAIN BRANCH
// Forks from Aorta at Core, goes to BillStack organ.
// Radius 0.008
export const VEIN_03 = vein([
  [ 0.00,  0.00,  0.10],  // Core (Aorta fork point)
  [ 0.15,  0.05,  0.12],
  [ 0.32,  0.02,  0.13],
  [ 0.50,  0.00,  0.15],  // BillStack Organ center
])

// VEIN_04 — UPPER LEFT BRANCH
// From Neural Cluster down-left to Blockchain Membrane.
// Radius 0.005
export const VEIN_04 = vein([
  [-0.38,  0.48,  0.20],  // Neural Cluster
  [-0.55,  0.42,  0.18],
  [-0.72,  0.30,  0.15],
  [-0.85,  0.12,  0.10],  // Membrane surface (left)
])

// VEIN_05 — UPPER RIGHT BRANCH
// From Neural Cluster to upper Blockchain Membrane.
// Radius 0.005
export const VEIN_05 = vein([
  [-0.38,  0.48,  0.20],  // Neural Cluster
  [-0.10,  0.60,  0.18],
  [ 0.20,  0.68,  0.14],
  [ 0.45,  0.60,  0.10],  // Membrane surface (upper right)
])

// VEIN_06 — LEFT ORGAN TO MEMBRANE
// TeamOS organ feeds into left membrane.
// Radius 0.005
export const VEIN_06 = vein([
  [-0.50,  0.00,  0.15],  // TeamOS center
  [-0.65, -0.05,  0.12],
  [-0.78, -0.10,  0.08],
  [-0.88, -0.15,  0.04],  // Membrane surface (left-center)
])

// VEIN_07 — RIGHT ORGAN TO MEMBRANE
// BillStack organ feeds into right membrane.
// Radius 0.005
export const VEIN_07 = vein([
  [ 0.50,  0.00,  0.15],  // BillStack center
  [ 0.65, -0.05,  0.12],
  [ 0.78, -0.10,  0.08],
  [ 0.88, -0.15,  0.04],  // Membrane surface (right-center)
])

// VEIN_08 — LOWER LEFT CAPILLARY
// From Aorta mid-point to lower-left surface.
// Radius 0.002
export const VEIN_08 = vein([
  [ 0.01, -0.18,  0.10],  // Aorta mid
  [-0.20, -0.25,  0.12],
  [-0.45, -0.35,  0.10],
  [-0.65, -0.45,  0.06],  // Lower-left surface
])

// VEIN_09 — LOWER RIGHT CAPILLARY
// From Aorta mid-point to lower-right surface.
// Radius 0.002
export const VEIN_09 = vein([
  [ 0.01, -0.18,  0.10],  // Aorta mid
  [ 0.22, -0.25,  0.12],
  [ 0.46, -0.38,  0.10],
  [ 0.65, -0.48,  0.06],  // Lower-right surface
])

// VEIN_10 — RHYTHM ORGAN FEED
// From Aorta base into Rhythm Organ, 
// spreading into two sub-branches inside it.
// Radius 0.004
export const VEIN_10 = vein([
  [ 0.00, -0.35,  0.11],  // Lower Aorta
  [-0.08, -0.42,  0.12],
  [-0.15, -0.48,  0.13],
  [-0.20, -0.55,  0.12],  // Rhythm Organ left
])

export const VEIN_10B = vein([
  [ 0.00, -0.35,  0.11],
  [ 0.08, -0.42,  0.12],
  [ 0.15, -0.48,  0.13],
  [ 0.20, -0.55,  0.12],  // Rhythm Organ right
])

// VEIN_11 — TOP CAPILLARY
// From Neural Cluster to top of organism.
// Radius 0.002
export const VEIN_11 = vein([
  [-0.38,  0.48,  0.20],  // Neural Cluster
  [-0.20,  0.62,  0.18],
  [ 0.00,  0.75,  0.14],
  [ 0.15,  0.82,  0.08],  // Top surface
])

// VEIN_12 — CROSS CAPILLARY
// Connects TeamOS to BillStack directly 
// (horizontal cross-link through Core).
// Radius 0.002
export const VEIN_12 = vein([
  [-0.50,  0.00,  0.15],  // TeamOS
  [-0.25,  0.08,  0.14],
  [ 0.00,  0.05,  0.13],
  [ 0.25,  0.08,  0.14],
  [ 0.50,  0.00,  0.15],  // BillStack
])

// All veins in ordered array for iteration:
// Index matches vein number (VEIN_01 = index 0, etc.)
export const ALL_VEINS = [
  VEIN_01, VEIN_02, VEIN_03, VEIN_04,
  VEIN_05, VEIN_06, VEIN_07, VEIN_08,
  VEIN_09, VEIN_10, VEIN_10B, VEIN_11, VEIN_12,
]

// Vein properties matching the definitions above:
export const VEIN_PROPERTIES = [
  { name: 'AORTA',           radius: 0.012, 
    opacity: 1.00, type: 'aorta'     as const },
  { name: 'LEFT_BRANCH',     radius: 0.008, 
    opacity: 0.90, type: 'branch'    as const },
  { name: 'RIGHT_BRANCH',    radius: 0.008, 
    opacity: 0.90, type: 'branch'    as const },
  { name: 'UPPER_LEFT',      radius: 0.005, 
    opacity: 0.70, type: 'secondary' as const },
  { name: 'UPPER_RIGHT',     radius: 0.005, 
    opacity: 0.70, type: 'secondary' as const },
  { name: 'LEFT_MEMBRANE',   radius: 0.005, 
    opacity: 0.65, type: 'secondary' as const },
  { name: 'RIGHT_MEMBRANE',  radius: 0.005, 
    opacity: 0.65, type: 'secondary' as const },
  { name: 'LOWER_LEFT_CAP',  radius: 0.002, 
    opacity: 0.45, type: 'capillary' as const },
  { name: 'LOWER_RIGHT_CAP', radius: 0.002, 
    opacity: 0.45, type: 'capillary' as const },
  { name: 'RHYTHM_LEFT',     radius: 0.004, 
    opacity: 0.60, type: 'secondary' as const },
  { name: 'RHYTHM_RIGHT',    radius: 0.004, 
    opacity: 0.60, type: 'secondary' as const },
  { name: 'TOP_CAP',         radius: 0.002, 
    opacity: 0.40, type: 'capillary' as const },
  { name: 'CROSS_CAP',       radius: 0.002, 
    opacity: 0.35, type: 'capillary' as const },
]

═══════════════════════════════════════════════
FILE 3 — CirculatorySystem.tsx COMPLETE BUILD
═══════════════════════════════════════════════

'use client'

import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useOrganism } from '@/context/OrganismContext'
import { useGitHubData } from '@/hooks/useGitHubData'
import { useThreeDisposal } from '@/hooks/useThreeDisposal'
import { useOrganismPulse } from '@/hooks/useOrganismPulse'
import { COLORS_HEX } from '@/lib/colors'
import { PARTICLES } from '@/lib/constants'
import {
  ALL_VEINS,
  VEIN_PROPERTIES,
} from './CirculatorySystem'  
// (move vein definitions to this file directly)

// ─── TYPES ─────────────────────────────────

interface BloodCell {
  veinIndex:   number         // which vein
  tParam:      number         // 0-1 position on curve
  speed:       number         // units/sec
  cellType:    'commit' | 'repo' | 'leetcode' | 'hard'
  meshIndex:   number         // InstancedMesh slot index
}

// ─── CELL COLORS ───────────────────────────

const CELL_COLORS = {
  commit:   new THREE.Color(COLORS_HEX.AMBER_PULSE),
  repo:     new THREE.Color(COLORS_HEX.NEURAL_CYAN)
              .multiplyScalar(0.6),
  leetcode: new THREE.Color(COLORS_HEX.TEXT_PRIMARY),
  hard:     new THREE.Color(1, 1, 1),  // pure white
} as const

// ─── CELL SIZES (used for InstancedMesh scale) ─

const CELL_SCALES = {
  commit:   { x: 1.0, y: 0.6, z: 1.0 }, // flat disc
  repo:     { x: 0.7, y: 0.7, z: 0.7 }, // small sphere
  leetcode: { x: 0.8, y: 1.4, z: 0.8 }, // capsule-ish
  hard:     { x: 1.0, y: 1.8, z: 1.0 }, // elongated
} as const

// ─── MAIN COMPONENT ────────────────────────

export function CirculatorySystem() {
  const { register } = useThreeDisposal()
  const githubData   = useGitHubData()
  const {
    zoomLevel,
    pulseCount,
    subscribeToBreath,
    unsubscribeFromBreath,
    deviceTier,
  } = useOrganism()
  
  // Refs — no state, all updated in useFrame:
  const cellMeshRef = useRef<THREE.InstancedMesh | null>(
    null)
  const veinMeshesRef = useRef<THREE.Mesh[]>([])
  const cells         = useRef<BloodCell[]>([])
  const flowSpeedRef  = useRef(1.0)  
  // Multiplied into all cell speeds
  const pulseActiveRef = useRef(false)
  const dummy = useRef(new THREE.Object3D())
  
  // ─── CELL INITIALIZATION ─────────────────
  
  const totalCells = githubData.cellCount
  
  // Distribute cells across veins and types:
  const initCells = (): BloodCell[] => {
    const result: BloodCell[] = []
    
    // Calculate how many of each type to create:
    // commit cells:   40% of total
    // repo cells:     30% of total
    // leetcode cells: 21% of total (129/162 regular)
    // hard cells:      9% of total (33/162 hard)
    const commitCount   = Math.floor(totalCells * 0.40)
    const repoCount     = Math.floor(totalCells * 0.30)
    const leetcodeCount = Math.floor(totalCells * 0.21)
    const hardCount     = Math.floor(totalCells * 0.09)
    
    const addCells = (
      count: number,
      type: BloodCell['cellType'],
      preferredVeins: number[],  // vein indices
      baseSpeed: number
    ) => {
      for (let i = 0; i < count; i++) {
        // Assign to preferred veins in rotation:
        const veinIdx = preferredVeins[
          i % preferredVeins.length]
        
        result.push({
          veinIndex:  veinIdx,
          // Stagger starting positions evenly:
          tParam:     (i / count) + 
                      (Math.random() * 0.1),
          speed:      baseSpeed * 
                      (0.9 + Math.random() * 0.2),
          cellType:   type,
          meshIndex:  result.length,
        })
      }
    }
    
    // Commit cells: travel AORTA and main branches
    addCells(commitCount, 'commit', 
      [0, 1, 2, 9, 10], 0.35)
    
    // Repo cells: travel secondary veins
    addCells(repoCount, 'repo',    
      [3, 4, 5, 6, 11], 0.22)
    
    // LeetCode regular: travel AORTA specifically
    addCells(leetcodeCount, 'leetcode', 
      [0], 0.28)
    
    // Hard problems: also travel AORTA, 
    // brighter and larger
    addCells(hardCount, 'hard',     
      [0], 0.32)
    
    return result
  }
  
  // ─── VEIN GEOMETRY CREATION ──────────────
  
  const veinGeometries = useRef
    THREE.TubeGeometry[]>([])
  const veinMaterials  = useRef
    THREE.MeshBasicMaterial[]>([])
  
  useEffect(() => {
    // Create tube geometry for each vein:
    ALL_VEINS.forEach((curve, i) => {
      const props = VEIN_PROPERTIES[i]
      
      const tubeSegments = 
        deviceTier === 'low' ? 20 : 40
      
      const geo = register(
        new THREE.TubeGeometry(
          curve,
          tubeSegments,
          props.radius,
          deviceTier === 'low' ? 4 : 8,  // radial segs
          false
        )
      )
      veinGeometries.current[i] = geo
      
      // AMBER_PULSE for aorta/branches,
      // dimmer for capillaries:
      const mat = register(
        new THREE.MeshBasicMaterial({
          color: COLORS_HEX.AMBER_PULSE,
          transparent: true,
          opacity: props.opacity * 
                   githubData.veinOpacity,
        })
      )
      veinMaterials.current[i] = mat
      
      const mesh = new THREE.Mesh(geo, mat)
      veinMeshesRef.current[i] = mesh
    })
    
    // Initialize cells:
    cells.current = initCells()
    
    // Set initial flow speed from GitHub data:
    flowSpeedRef.current = 
      githubData.flowSpeedMultiplier
      
  }, [deviceTier, githubData.veinOpacity,
      githubData.flowSpeedMultiplier])
  
  // ─── INSTANCED MESH FOR CELLS ────────────
  
  // Single sphere geometry, scaled per cell type
  // via dummy Object3D scale in useFrame:
  const cellGeometry = register(
    new THREE.SphereGeometry(0.005, 
      deviceTier === 'low' ? 4 : 6, 
      deviceTier === 'low' ? 4 : 6)
  )
  const cellMaterial = register(
    new THREE.MeshBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
    })
  )
  
  // ─── BREATH SYNC ─────────────────────────
  
  useEffect(() => {
    subscribeToBreath('circulatory', (phase) => {
      // Flow speeds up on inhale (organism pumps):
      // phase 0 = exhaled, phase 1 = fully inhaled
      // Pump effect: inhale speeds up flow 15%,
      // exhale slows it 10%:
      const breathMultiplier = 1.0 + 
        (phase - 0.5) * 0.25
      flowSpeedRef.current = 
        githubData.flowSpeedMultiplier * 
        breathMultiplier
    })
    return () => unsubscribeFromBreath('circulatory')
  }, [subscribeToBreath, unsubscribeFromBreath,
      githubData.flowSpeedMultiplier])
  
  // ─── PULSE RESPONSE ──────────────────────
  
  useOrganismPulse({
    onPulse: () => {
      pulseActiveRef.current = true
      // Reset after 2 seconds:
      setTimeout(() => {
        pulseActiveRef.current = false
      }, 2000)
    }
  })
  
  // ─── MAIN ANIMATION — useFrame ───────────
  // THIS IS THE EXACT INSTANCED MESH UPDATE PATTERN:
  
  useFrame((state, delta) => {
    if (!cellMeshRef.current) return
    if (!cells.current.length) return
    
    const d = dummy.current
    
    cells.current.forEach((cell, i) => {
      // ── ADVANCE POSITION ─────────────────
      const speedMultiplier = pulseActiveRef.current 
        ? 2.0  // double speed during pulse
        : flowSpeedRef.current
      
      cell.tParam = (cell.tParam + 
        cell.speed * speedMultiplier * delta
      ) % 1.0
      
      // ── GET WORLD POSITION ───────────────
      const curve = ALL_VEINS[cell.veinIndex]
      if (!curve) return
      
      // getPoint: returns THREE.Vector3 at tParam:
      const pos = curve.getPoint(
        Math.min(Math.max(cell.tParam, 0), 1)
      )
      d.position.copy(pos)
      
      // ── BOB MOTION ───────────────────────
      // Slight perpendicular bob for organic feel.
      // Use different phase per cell:
      const bobPhase = 
        cell.tParam * Math.PI * 4 + i * 0.3
      d.position.y += Math.sin(bobPhase) * 0.001
      d.position.x += Math.cos(bobPhase) * 0.0005
      
      // ── SCALE BY CELL TYPE ───────────────
      const scale = CELL_SCALES[cell.cellType]
      d.scale.set(scale.x, scale.y, scale.z)
      
      // ── DURING PULSE: flash white ─────────
      if (pulseActiveRef.current) {
        cellMeshRef.current!.setColorAt(
          i, new THREE.Color(1, 1, 1))
      } else {
        cellMeshRef.current!.setColorAt(
          i, CELL_COLORS[cell.cellType])
      }
      
      // ── UPDATE MATRIX ────────────────────
      // CRITICAL: must call updateMatrix() before
      // setMatrixAt — otherwise position not applied:
      d.updateMatrix()
      cellMeshRef.current!.setMatrixAt(i, d.matrix)
    })
    
    // CRITICAL: both of these needsUpdate flags must
    // be set every frame for changes to render:
    cellMeshRef.current.instanceMatrix.needsUpdate = true
    if (cellMeshRef.current.instanceColor) {
      cellMeshRef.current.instanceColor.needsUpdate = true
    }
  })
  
  // ─── AORTA PUMP FLASH ────────────────────
  // Every 3.75s (one breath), the aorta midpoint
  // briefly brightens all cells at that location.
  // This is handled via the breath subscriber above —
  // when breathPhase hits 0.48 (peak inhale):
  
  useEffect(() => {
    subscribeToBreath('aorta-pump', (phase) => {
      // At peak inhale (phase > 0.98): 
      // flash aorta vein material briefly:
      if (phase > 0.98 && veinMaterials.current[0]) {
        veinMaterials.current[0].opacity = 1.0
      } else if (veinMaterials.current[0]) {
        // Decay back to base opacity:
        veinMaterials.current[0].opacity = 
          Math.max(
            VEIN_PROPERTIES[0].opacity * 
            githubData.veinOpacity,
            veinMaterials.current[0].opacity - 0.02
          )
      }
    })
    return () => unsubscribeFromBreath('aorta-pump')
  }, [subscribeToBreath, unsubscribeFromBreath,
      githubData.veinOpacity])
  
  // ─── ZOOM RESPONSE ───────────────────────
  
  // At MESO zoom: show vein labels on aorta
  // At MICRO zoom: show full metrics panel
  
  // ─── RENDER ──────────────────────────────
  
  return (
    <group name="circulatory-system">
      
      {/* Vein tubes: */}
      {veinMeshesRef.current.map((mesh, i) => (
        <primitive key={i} object={mesh} />
      ))}
      
      {/* Blood cell InstancedMesh: */}
      <instancedMesh
        ref={cellMeshRef}
        args={[cellGeometry, cellMaterial, totalCells]}
        frustumCulled={false}
        // frustumCulled: false because cells move 
        // and Three.js bounding box check would 
        // incorrectly cull visible cells
      />
      
      {/* Junction nodes where veins meet: */}
      <JunctionNodes />
      
      {/* Zoom-responsive labels and metrics: */}
      {zoomLevel !== 'macro' && (
        <CirculatoryLabels 
          zoomLevel={zoomLevel}
          githubData={githubData}
        />
      )}
      
    </group>
  )
}

// ─── JUNCTION NODES ────────────────────────
// Small spheres at vein branch points.
// Makes vascular structure feel anatomical.

function JunctionNodes() {
  const { register } = useThreeDisposal()
  
  // Junction positions: where veins fork/meet:
  const junctions = [
    { pos: [0.00,  0.00, 0.10], r: 0.016 }, // Core
    { pos: [-0.38, 0.48, 0.20], r: 0.012 }, // Neural
    { pos: [-0.50, 0.00, 0.15], r: 0.010 }, // TeamOS
    { pos: [ 0.50, 0.00, 0.15], r: 0.010 }, // BillStack
    { pos: [ 0.00,-0.35, 0.11], r: 0.008 }, // Lower fork
    { pos: [ 0.01,-0.18, 0.10], r: 0.007 }, // Aorta mid
  ] as const
  
  const geo = register(
    new THREE.SphereGeometry(1, 8, 8))
  const mat = register(
    new THREE.MeshBasicMaterial({
      color: COLORS_HEX.AMBER_PULSE,
      transparent: true,
      opacity: 0.8,
    })
  )
  
  return (
    <group>
      {junctions.map((j, i) => (
        <mesh 
          key={i}
          geometry={geo}
          material={mat}
          position={j.pos as [number, number, number]}
          scale={j.r}
        />
      ))}
    </group>
  )
}

// ─── CIRCULATORY LABELS ────────────────────
// Shows at MESO and MICRO zoom levels.

interface CirculatoryLabelsProps {
  zoomLevel: 'meso' | 'micro'
  githubData: ReturnType<typeof useGitHubData>
}

function CirculatoryLabels({ 
  zoomLevel, 
  githubData 
}: CirculatoryLabelsProps) {
  return (
    <>
      {/* MESO: single floating label at aorta mid */}
      {zoomLevel === 'meso' && (
        <Html
          position={[0.25, 0.0, 0.15]}
          transform={false}
          style={{ pointerEvents: 'none' }}
        >
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize:   10,
            color:      '#4A6B8A',
            letterSpacing: '0.12em',
            whiteSpace: 'nowrap',
          }}>
            {githubData.isLive 
              ? '◉ LIVE' 
              : '○ CACHED'
            } &nbsp; 
            16,500+ SIGNALS / 2026
          </div>
        </Html>
      )}
      
      {/* MICRO: full metrics panel, right side */}
      {zoomLevel === 'micro' && (
        <Html
          position={[0.65, 0.0, 0.10]}
          transform={false}
          style={{ pointerEvents: 'none' }}
        >
          <div style={{
            fontFamily:   'var(--font-mono)',
            fontSize:     12,
            color:        '#B8D4E8',
            background:   'rgba(10, 22, 40, 0.94)',
            border:       '1px solid rgba(255,122,47,0.3)',
            borderLeft:   '3px solid rgba(255,122,47,0.8)',
            borderRadius: '0 4px 4px 4px',
            padding:      '16px 20px',
            minWidth:     210,
            backdropFilter: 'blur(8px)',
          }}>
            <div style={{
              color:         '#4A6B8A',
              fontSize:      10,
              letterSpacing: '0.15em',
              marginBottom:  12,
            }}>
              CIRCULATORY REPORT
            </div>
            
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse' 
            }}>
              {[
                ['Contributions', 
                 '16,500+', '#00E87A'],
                ['Repositories', 
                 String(githubData.repos), '#B8D4E8'],
                ['Problems Solved', 
                 '162', '#B8D4E8'],
                ['└── Hard', 
                 '33', '#00C8FF'],
                ['Flow Status', 
                  githubData.isLive 
                    ? '◉ LIVE' 
                    : '○ CACHED',
                  githubData.isLive 
                    ? '#00E87A' 
                    : '#4A6B8A'],
                ['Activity', 
                  githubData.recentActivity
                    .toUpperCase(),
                  githubData.recentActivity === 'high'
                    ? '#00E87A'
                    : githubData.recentActivity === 
                      'medium'
                    ? '#FF7A2F'
                    : '#4A6B8A'],
              ].map(([label, value, color]) => (
                <tr key={label} style={{ 
                  lineHeight: '2.0' 
                }}>
                  <td style={{ color: '#4A6B8A' }}>
                    {label}
                  </td>
                  <td style={{ 
                    color,
                    textAlign: 'right',
                    fontWeight: 500,
                  }}>
                    {value}
                  </td>
                </tr>
              ))}
            </table>
          </div>
        </Html>
      )}
    </>
  )
}

═══════════════════════════════════════════════
HOW TO ADD CirculatorySystem TO OrganismCanvas
═══════════════════════════════════════════════

In OrganismCanvas.tsx, inside the <Canvas>, 
after <OrganismMesh />:

import { CirculatorySystem } 
  from './CirculatorySystem'

// Inside the Canvas JSX:
<OrganismMesh />
<CirculatorySystem />   // ← ADD THIS

═══════════════════════════════════════════════
VERIFICATION — AFTER PROMPT 05
═══════════════════════════════════════════════

npm run dev must show:
□ 13 vein tubes running through the organism body
□ Blood cells traveling continuously on vein paths
□ Cells pulse white during 90-second organism pulse
□ Flow speeds up during organism inhale
□ Junction nodes visible at vein branch points
□ MESO zoom: "LIVE / CACHED + signal count" label
□ MICRO zoom: full metrics panel on right side
□ No TypeScript errors
□ No "instanceColor is null" console errors
   (fixed by checking cellMeshRef.current.instanceColor
   before calling .needsUpdate = true)

If cells appear but don't move:
→ Check useFrame is inside a component that is
  rendered INSIDE <Canvas>. CirculatorySystem 
  renders inside OrganismCanvas which is inside 
  Canvas — this is correct.
  
If cells flicker or teleport:
→ The tParam % 1.0 wrapping is correct.
  Check that delta is not abnormally large 
  (first frame delta can be huge).
  Add: const safeDelta = Math.min(delta, 0.05)
  Use safeDelta instead of delta everywhere.