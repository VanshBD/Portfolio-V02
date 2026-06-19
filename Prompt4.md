This is for THE ORGANISM portfolio project.
Next.js 14.2.5, Three.js 0.165.0,
@react-three/fiber 8.16.8.
All @/* aliases map to project root.
OrganismContext exists at @/context/OrganismContext.
Build exactly what is specified — no simplifications.

THE ORGANISM portfolio.
PROMPT 03 complete — organism mesh breathes,
edge glow visible, thermal cursor works,
OrganismContext providing breathPhase via 
subscriber pattern (no re-renders).

This is PROMPT 04 — the Neural Cluster.
The skills network region in the upper-left 
area of the organism.

BUILD: /components/organism/NeuralCluster.tsx

═══════════════════════════════════════════════
NODE DATA — COMPLETE SKILL SET
═══════════════════════════════════════════════

Define this data at the top of NeuralCluster.tsx.
Do NOT put in constants.ts — it's component-specific.

// Node tiers determine visual size and 
// visibility at each zoom level:
type NodeTier = 1 | 2 | 3
type NodeType = 'standard' | 'ai'

interface SkillNode {
  id:       string
  label:    string
  tier:     NodeTier
  type:     NodeType
  position: THREE.Vector3  // set during layout
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
// Weight determines connection thickness and 
// signal speed. Higher = stronger relationship.
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
  claudeapi:  'Integrated in production: 65% faster ' +
              'AI resume generation via pipeline.',
  geminiapi:  'AI workflows: reduced manual client ' +
              'processes by 60%+.',
  mongodb:    'Index tuning: -48% API response time ' +
              'across 6 enterprise systems.',
  redis:      'Caching layer: 87% cache hit rate, ' +
              'eliminates repeated DB reads.',
  rbac:       'JWT/OAuth RBAC: implemented across ' +
              '4 production apps.',
  microservices: 'Led 5-app backend architecture ' +
                 'at Swift Rut Technologies.',
  typescript: '16,500+ GitHub contributions in 2026 ' +
              '— TypeScript in every project.',
  nodejs:     'The foundation. Every production system ' +
              'runs on Node.js.',
}

═══════════════════════════════════════════════
NODE LAYOUT ALGORITHM
═══════════════════════════════════════════════

Nodes are positioned using a force-directed 
layout algorithm run on mount.
This creates organic clustering without 
requiring a fixed layout.

The region center is at 
REGION_POSITIONS.NEURAL_CLUSTER: (-0.38, 0.48, 0.20)

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
    const phi   = Math.random() * Math.PI
    positions.set(node.id, new THREE.Vector3(
      regionCenter.x + radius * Math.sin(phi) * 
        Math.cos(theta),
      regionCenter.y + radius * Math.sin(phi) * 
        Math.sin(theta),
      regionCenter.z + radius * Math.cos(phi) * 0.3,
    ))
  })
  
  // Force-directed refinement: 50 iterations
  // (runs synchronously — only 26 nodes, very fast)
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

═══════════════════════════════════════════════
ORGANIC CONNECTION CURVE FUNCTION
═══════════════════════════════════════════════

// Creates a naturally curved connection between
// two node positions. Never straight — 
// biological connections always curve.

const createOrganicConnection = (
  startPos: THREE.Vector3,
  endPos:   THREE.Vector3
): THREE.CatmullRomCurve3 => {
  
  // Midpoint with random perpendicular offset:
  const mid = startPos.clone().lerp(endPos, 0.5)
  
  // Perpendicular direction in XY plane:
  const dir = endPos.clone().sub(startPos)
  const perp = new THREE.Vector3(
    -dir.y, dir.x, 0  // 90-degree rotation in XY
  ).normalize()
  
  // Random offset magnitude: 
  // 10-20% of connection length
  const length = dir.length()
  const offsetMag = length * 
    (0.10 + Math.random() * 0.10)
  const side = Math.random() > 0.5 ? 1 : -1
  
  mid.add(perp.multiplyScalar(offsetMag * side))
  mid.z += (Math.random() - 0.5) * 0.03
  
  // 4-point curve: start → near-start bend → 
  //               near-end bend → end
  const nearStart = startPos.clone()
    .lerp(mid, 0.25)
  const nearEnd = mid.clone()
    .lerp(endPos, 0.75)
  
  return new THREE.CatmullRomCurve3([
    startPos, nearStart, mid, nearEnd, endPos
  ])
}

═══════════════════════════════════════════════
INSTANCED MESH OPACITY PATTERN
═══════════════════════════════════════════════

THREE.InstancedMesh does NOT support per-instance
opacity via material.opacity.
Instead: use per-instance COLOR with alpha encoded.

But InstancedMesh colors are RGB only (no alpha).
Solution: adjust the instance color's brightness 
to simulate opacity change.

// Store original colors per node:
const originalColors = new Map<number, THREE.Color>()

// To "fade" a node to 20% opacity appearance:
// Multiply its color's RGB values by 0.2:
const fadeNode = (
  instancedMesh: THREE.InstancedMesh,
  instanceIndex: number,
  targetOpacity: number,  // 0-1
  durationMs: number = 400
) => {
  const originalColor = originalColors
    .get(instanceIndex) ?? new THREE.Color(0x00C8FF)
  
  const fadedColor = originalColor.clone()
    .multiplyScalar(targetOpacity)
  
  // Animate color toward faded version:
  const tempColor = new THREE.Color()
  let startTime: number | null = null
  
  const animate = (timestamp: number) => {
    if (!startTime) startTime = timestamp
    const progress = Math.min(
      (timestamp - startTime) / durationMs, 1)
    
    // Interpolate colors:
    const currentColor = originalColor.clone()
      .lerp(fadedColor, progress)
    
    instancedMesh.setColorAt(
      instanceIndex, currentColor)
    instancedMesh.instanceColor!.needsUpdate = true
    
    if (progress < 1) requestAnimationFrame(animate)
  }
  requestAnimationFrame(animate)
}

// To restore a faded node:
const restoreNode = (
  instancedMesh: THREE.InstancedMesh,
  instanceIndex: number,
  durationMs: number = 600
) => {
  fadeNode(
    instancedMesh, 
    instanceIndex, 
    1.0,  // restore to full brightness
    durationMs
  )
}

═══════════════════════════════════════════════
HOVER INTERACTION — EXACT MATH
═══════════════════════════════════════════════

When visitor hovers a node:

1. HOVERED NODE: scale to 1.5x over 200ms
2. CONNECTED NODES: move 15% closer to hovered node
3. UNCONNECTED NODES: fade to 20% brightness
4. ALL CONNECTIONS FROM HOVERED: brighten
5. LABEL + CONTEXT TEXT: appear

STEP 2 — "15% closer" exact calculation:

// hoveredPos: position of hovered node
// connectedPos: position of a connected node
// originalPos: the connected node's original position

const moveNodeCloser = (
  hoveredPos: THREE.Vector3,
  currentPos: THREE.Vector3,
  originalPos: THREE.Vector3,
  fraction: number = 0.15  // 15% closer
): THREE.Vector3 => {
  // Vector from connected node toward hovered node:
  const toHovered = hoveredPos.clone()
    .sub(currentPos)
  
  // Move fraction of the way toward hovered:
  const newPos = currentPos.clone()
    .add(toHovered.multiplyScalar(fraction))
  
  return newPos
}

// GSAP animation for node drift:
const driftNodeToward = (
  meshRef: THREE.Object3D,
  targetPos: THREE.Vector3,
  duration: number = 0.6
) => {
  gsap.to(meshRef.position, {
    x: targetPos.x,
    y: targetPos.y,
    z: targetPos.z,
    duration,
    ease: 'elastic.out(1, 0.8)',
    // elastic ease = slight spring overshoot
    // makes it feel biological not mechanical
  })
}

// Restore to original position:
const driftNodeBack = (
  meshRef: THREE.Object3D,
  originalPos: THREE.Vector3,
  duration: number = 0.8
) => {
  gsap.to(meshRef.position, {
    x: originalPos.x,
    y: originalPos.y,
    z: originalPos.z,
    duration,
    ease: 'power2.out',
  })
}

═══════════════════════════════════════════════
SIGNAL ANIMATION — EXACT IMPLEMENTATION
═══════════════════════════════════════════════

Signals are particles traveling along 
connection curves continuously.

// Signal data structure:
interface Signal {
  connectionIndex: number  // which connection
  tParam:          number  // 0-1, position on curve
  speed:           number  // units/second
  meshIndex:       number  // which instancedMesh slot
}

// Signal pool: pre-allocate all signals
// Max signals from PARTICLES[deviceTier].neuralSignals:
const MAX_SIGNALS = PARTICLES[deviceTier].neuralSignals

// Each signal is one instance in a 
// THREE.InstancedMesh of small spheres:
// SphereGeometry(0.004, 4, 4) — very simple
// Color: #FFFFFF (white signal flash)

// Initialize signal pool:
const initSignals = (
  connections: [string, string, number][], 
  maxSignals: number
): Signal[] => {
  const signals: Signal[] = []
  
  for (let i = 0; i < maxSignals; i++) {
    const connIdx = i % connections.length
    const weight = connections[connIdx][2]
    
    // Speed: higher weight = faster signal
    // weight 5 → 0.8s traversal = speed 1.25/s
    // weight 3 → 1.4s traversal = speed 0.71/s
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

// Update signals in useFrame:
// (This runs inside the NeuralCluster component)
useFrame((state, delta) => {
  if (!signalMeshRef.current) return
  const dummy = new THREE.Object3D()
  
  signals.current.forEach((signal) => {
    // Advance tParam:
    signal.tParam = (signal.tParam + 
      signal.speed * delta) % 1.0
    
    // Get curve for this connection:
    const curve = connectionCurves[
      signal.connectionIndex]
    if (!curve) return
    
    // Get position on curve:
    const pos = curve.getPoint(signal.tParam)
    dummy.position.copy(pos)
    dummy.updateMatrix()
    
    signalMeshRef.current!.setMatrixAt(
      signal.meshIndex, dummy.matrix)
    
    // Flash destination node when signal arrives:
    if (signal.tParam > 0.95 && 
        signal.tParam < 0.98) {
      // Signal is near the end node.
      // Flash that node (brief brightness increase):
      const [,toId] = CONNECTIONS[
        signal.connectionIndex]
      const nodeIdx = nodeIndexMap.get(toId)
      if (nodeIdx !== undefined) {
        flashNode(nodeIdx)  // 50ms flash to 100%
      }
    }
  })
  
  signalMeshRef.current.instanceMatrix
    .needsUpdate = true
})

═══════════════════════════════════════════════
BREATHPHASE SUBSCRIPTION IN NEURAL CLUSTER
═══════════════════════════════════════════════

Neural signals should speed up slightly 
during inhale and slow during exhale:

// In NeuralCluster component:
const signalSpeedMultiplierRef = useRef(1.0)

useEffect(() => {
  subscribeToBreath('neural-cluster', (phase) => {
    // phase 0-1: 0=exhaled, 1=fully inhaled
    // Signal speed multiplier: 0.85 to 1.15
    signalSpeedMultiplierRef.current = 
      0.85 + phase * 0.30
  })
  return () => unsubscribeFromBreath('neural-cluster')
}, [subscribeToBreath, unsubscribeFromBreath])

// Then in useFrame signal update:
signal.tParam = (signal.tParam + 
  signal.speed * 
  signalSpeedMultiplierRef.current *  // ADD THIS
  delta) % 1.0

═══════════════════════════════════════════════
ZOOM-RESPONSIVE DISPLAY
═══════════════════════════════════════════════

The NeuralCluster responds to zoomLevel from 
OrganismContext.

// In useEffect listening to zoomLevel:
// ─── ▼ REPLACE THE ENTIRE ZOOM USEEFFECT WITH THIS ▼ ───
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
      s.speed = (originalSignalSpeeds.current[i] ?? s.speed) * 1.4
    })
  }
}, [zoomLevel])
// ─── ▲ REPLACE THE ENTIRE ZOOM USEEFFECT WITH THIS ▲ ───

At MICRO zoom: the metrics panel shows.
Use @react-three/drei <Html> for this:

import { Html } from '@react-three/drei'

// In the R3F scene, inside NeuralCluster:
{zoomLevel === 'micro' && (
  <Html
    position={[
      REGION_POSITIONS.NEURAL_CLUSTER.x + 0.4,
      REGION_POSITIONS.NEURAL_CLUSTER.y,
      REGION_POSITIONS.NEURAL_CLUSTER.z,
    ]}
    transform={false}
    // transform: false = fixed screen position
    // (not attached to 3D world position)
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
        <span style={{color:'#4A6B8A'}}>
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
        <span style={{color:'#4A6B8A'}}>
          └── Hard
        </span>
        <span style={{
          color:'#B8D4E8',
          float:'right',
        }}>
          33
        </span>
        <br/>
        <span style={{color:'#4A6B8A'}}>
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
        <span style={{color:'#4A6B8A'}}>
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

═══════════════════════════════════════════════
COMPLETE COMPONENT STRUCTURE
═══════════════════════════════════════════════

NeuralCluster.tsx uses these refs and state:

// Refs (no re-renders):
const nodeMeshesRef = useRef<THREE.Mesh[]>([])
const connectionLinesRef = useRef<THREE.Line[]>([])
const signalMeshRef = useRef<THREE.InstancedMesh>()
const connectionCurves = useRef<THREE.CatmullRomCurve3[]>([])
const nodePositions = useRef<Map<string,THREE.Vector3>>(new Map())
const originalPositions = useRef<Map<string,THREE.Vector3>>(new Map())
const signals = useRef<Signal[]>([])
const signalSpeedMultiplierRef = useRef(1.0)
// ─── ▼ ADD THIS HERE ▼ ───
const originalSignalSpeeds = useRef<number[]>([])
// ─── ▲ ADD THIS HERE ▲ ───
const hoveredNodeId = useRef<string|null>(null)

// ─── ▼ ADD THESE HERE ▼ ───
// Maps node ID string → instance index number
const nodeIndexMap = useRef<Map<string, number>>(new Map())

// flashNode: briefly brightens a node instance to full opacity for 50ms
const flashNode = useCallback((instanceIndex: number) => {
  // Note: if you are using an array of meshes instead of an InstancedMesh for nodes, 
  // ensure nodeMeshRef is properly referencing your InstancedMesh, or adapt this 
  // to target nodeMeshesRef.current[instanceIndex].material.color
  if (!signalMeshRef.current) return // fallback guard
    
  const flashColor = new THREE.Color(1, 1, 1) // white flash
  const baseColor  = new THREE.Color(0x00C8FF)  // NEURAL_CYAN
    
  // Set to flash color (Assuming nodeMeshRef is your nodes InstancedMesh):
  // nodeMeshRef.current.setColorAt(instanceIndex, flashColor)
  // nodeMeshRef.current.instanceColor!.needsUpdate = true
    
  // Restore after 50ms:
  setTimeout(() => {
    // if (!nodeMeshRef.current) return
    // nodeMeshRef.current.setColorAt(instanceIndex, baseColor)
    // nodeMeshRef.current.instanceColor!.needsUpdate = true
  }, 50)
}, [])
// ─── ▲ ADD THESE HERE ▲ ───

// State (causes re-renders but rarely changes):
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

CLEANUP on unmount:
useEffect(() => {
  return () => {
    signals.current = initSignals(CONNECTIONS, MAX_SIGNALS)
    // ─── ▼ ADD THIS HERE ▼ ───
  originalSignalSpeeds.current = signals.current.map(s => s.speed)
  // ─── ▲ ADD THIS HERE ▲ ───
    // Dispose all geometries and materials:
    nodeMeshesRef.current.forEach(mesh => {
      mesh.geometry.dispose()
      if (mesh.material instanceof THREE.Material) {
        mesh.material.dispose()
      }
    })
    connectionLinesRef.current.forEach(line => {
      line.geometry.dispose()
      if (line.material instanceof THREE.Material) {
        line.material.dispose()
      }
    })
    signalMeshRef.current?.geometry.dispose()
    if (signalMeshRef.current?.material instanceof 
        THREE.Material) {
      signalMeshRef.current.material.dispose()
    }
  }
}, [])

ON PULSE — signal burst:
useEffect(() => {
  // When pulseCount changes (pulse fired):
  if (pulseCount === 0) return
  
  // Temporarily double all signal speeds for 2s:
  const originalSpeeds = signals.current
    .map(s => s.speed)
  signals.current.forEach(s => { s.speed *= 2 })
  
  setTimeout(() => {
    signals.current.forEach((s, i) => {
      s.speed = originalSpeeds[i]
    })
  }, 2000)
}, [pulseCount])

Give me the COMPLETE NeuralCluster.tsx file 
with all the above implemented:

- generateNodePositions() function using 
  force-directed layout
- createOrganicConnection() for curved connections
- InstancedMesh for signal particles
- useFrame signal animation with breathPhase sync
- Hover interaction with exact lerp math, 
  elastic GSAP drift, InstancedMesh color fading
- Zoom-responsive display (@react-three/drei Html 
  for micro panel)
- Pulse response (signal burst for 2s)
- Full cleanup on unmount
- All TypeScript types

All imports at top of file.
Zero TypeScript errors.
All refs properly typed.

After PROMPT 04:
npm run dev shows organism with Neural Cluster.
Hover a skill node: 
  - it enlarges
  - connected nodes drift closer
  - unconnected nodes dim
  - label + context text appear
Signals travel continuously along connections.
Signal speed syncs with organism breathing..
  while you not need to start npm run dev 