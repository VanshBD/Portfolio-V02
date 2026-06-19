This is for THE ORGANISM portfolio project.
Next.js 14.2.5, Three.js 0.165.0,
@react-three/fiber 8.16.8.
All @/* aliases map to project root.
OrganismContext exists at @/context/OrganismContext.
Build exactly what is specified — no simplifications.

THE ORGANISM portfolio.
PROMPT 02 complete — birth sequence runs, 
cells migrate to organism silhouette shape,
skip handler works, onComplete fires correctly.

This is PROMPT 03 — the main organism canvas,
breathing system, cursor thermal effect, 
zoom depth system, and the 90-second pulse.

This prompt also establishes the BASIC 
OrganismContext shell that all subsequent 
components will consume.

BUILD THESE FILES:
1. /context/OrganismContext.tsx (basic shell)
2. /components/organism/BreathClock.tsx
3. /components/organism/OrganismCanvas.tsx
4. /hooks/useCursorThermal.ts
5. /hooks/useScrollDepth.ts
6. /hooks/useOrganismPulse.ts
7. /lib/shaders.ts (complete GLSL code)

═══════════════════════════════════════════════
FILE 1 — BASIC OrganismContext.tsx SHELL
FILE: /context/OrganismContext.tsx
═══════════════════════════════════════════════

WHY BASIC SHELL NOW:
Prompts 04-08 all need to import from this 
context. If we wait for Prompt 10 to build it,
every component built between now and then 
will either throw import errors OR each 
builder will make their own incompatible version.

The BASIC shell provides what's needed now.
Prompt 10 EXPANDS it (adds more fields) 
without breaking anything built here.

'use client'

import { 
  createContext, useContext, useRef, 
  useState, useCallback, useEffect,
  type ReactNode 
} from 'react'

// ─── TYPES ─────────────────────────────────

export type ZoomLevel  = 'macro' | 'meso' | 'micro'
export type DeviceTier = 'high'  | 'mid'  | 'low'
export type ActiveEra  = 
  'SWIFT_RUT' | 'AUM' | 'FREELANCE' | null

export interface ThermalPoint {
  x:         number  // screen space X (px)
  y:         number  // screen space Y (px)
  intensity: number  // 0-1, decays over time
  timestamp: number  // Date.now() at creation
}

export interface AudioLevels {
  bass:    number  // 60-200Hz,   0-1
  mid:     number  // 200-2000Hz, 0-1
  treble:  number  // 2000Hz+,    0-1
  overall: number  // RMS,        0-1
}

export interface GitHubData {
  contributions:  number
  repos:          number
  recentActivity: 'high' | 'medium' | 'low'
  isLive:         boolean
}

export interface OrganismContextType {
  // ── BREATH SYSTEM ──────────────────────────
  // breathPhase is NOT in React state.
  // It is a ref value updated 60x/sec by BreathClock.
  // Components subscribe via subscribeToBreath().
  // This prevents 60 re-renders/sec on every consumer.
  subscribeToBreath: (
    id: string, 
    callback: (phase: number) => void
  ) => void
  unsubscribeFromBreath: (id: string) => void
  breathPhaseRef: React.RefObject<number>
  // pulseCount IS React state (fires every 90s only):
  pulseCount:  number
  lastPulseTime: number
  triggerManualPulse: () => void

  // ── ZOOM SYSTEM ────────────────────────────
  zoomLevel:        ZoomLevel
  setZoomLevel:     React.Dispatch<React.SetStateAction<ZoomLevel>>
  targetRegion:     string | null
  setTargetRegion:  (region: string | null) => void

  // ── REGION / ORGAN SYSTEM ──────────────────
  hoveredRegion:  string | null
  setHoveredRegion: (region: string | null) => void
  activeOrgan: 'teamoss' | 'billstack' | 
               'ghostdeck' | null
  setActiveOrgan: (
    organ: 'teamoss' | 'billstack' | 
           'ghostdeck' | null
  ) => void

  // ── CURSOR THERMAL ─────────────────────────
  thermalPointsRef: React.RefObject<ThermalPoint[]>
  addThermalPoint:  (x: number, y: number) => void

  // ── TIMELINE ERA ───────────────────────────
  activeEra:    ActiveEra
  setActiveEra: (era: ActiveEra) => void

  // ── AUDIO ──────────────────────────────────
  audioActive:    boolean
  setAudioActive: (active: boolean) => void
  audioLevels:    AudioLevels
  setAudioLevels: (levels: AudioLevels) => void

  // ── GITHUB DATA ────────────────────────────
  githubData: GitHubData

  // ── DEVICE ─────────────────────────────────
  deviceTier: DeviceTier

  // ── CONTACT ────────────────────────────────
  contactVisible:    boolean
  setContactVisible: (v: boolean) => void
}

// ─── CONTEXT CREATION ──────────────────────

const OrganismContext = createContext
  OrganismContextType | null>(null)

export const useOrganism = (): OrganismContextType => {
  const ctx = useContext(OrganismContext)
  if (!ctx) {
    throw new Error(
      'useOrganism must be used within OrganismProvider'
    )
  }
  return ctx
}

// ─── PROVIDER ──────────────────────────────

interface OrganismProviderProps {
  children: ReactNode
  deviceTier: DeviceTier
}

export function OrganismProvider({ 
  children, 
  deviceTier 
}: OrganismProviderProps) {
  
  // ── BREATH SYSTEM ─────────────────────────
  // breathPhaseRef: updated 60x/sec by BreathClock
  // NOT React state — prevents 60 re-renders/sec
  const breathPhaseRef = useRef<number>(0)
  
  // Subscriber map: id → callback
  // Components register here to receive breath updates
  const breathSubscribers = useRef
    Map<string, (phase: number) => void>
  >(new Map())
  
  const subscribeToBreath = useCallback((
    id: string,
    callback: (phase: number) => void
  ) => {
    breathSubscribers.current.set(id, callback)
  }, [])
  
  const unsubscribeFromBreath = useCallback((
    id: string
  ) => {
    breathSubscribers.current.delete(id)
  }, [])
  
  // This function is called by BreathClock 
  // every frame with the current breath phase:
  // (BreathClock is inside the R3F Canvas)
  // We expose it via window event to bridge 
  // the Canvas/DOM boundary:
  useEffect(() => {
    const handleBreathUpdate = (e: Event) => {
      const phase = (e as CustomEvent<number>).detail
      breathPhaseRef.current = phase
      // Notify all subscribers without re-render:
      breathSubscribers.current.forEach(cb => cb(phase))
    }
    window.addEventListener(
      'organism:breath', handleBreathUpdate)
    return () => window.removeEventListener(
      'organism:breath', handleBreathUpdate)
  }, [])
  
  // ── PULSE SYSTEM ─────────────────────────
  const [pulseCount, setPulseCount] = useState(0)
  const [lastPulseTime, setLastPulseTime] = 
    useState(Date.now())
  
  const firePulse = useCallback(() => {
    const now = Date.now()
    setLastPulseTime(now)
    setPulseCount(c => c + 1)
    window.dispatchEvent(
      new CustomEvent('organism:pulse', {
        detail: { timestamp: now }
      })
    )
  }, [])
  
  useEffect(() => {
    const interval = setInterval(firePulse, 90000)
    return () => clearInterval(interval)
  }, [firePulse])
  
  const triggerManualPulse = useCallback(() => {
    firePulse()
  }, [firePulse])
  
  // ── ZOOM SYSTEM ──────────────────────────
  const [zoomLevel, setZoomLevel] = 
    useState<ZoomLevel>('macro')
  const [targetRegion, setTargetRegion] = 
    useState<string | null>(null)
  
  // ── REGION/ORGAN SYSTEM ──────────────────
  const [hoveredRegion, setHoveredRegion] = 
    useState<string | null>(null)
  const [activeOrgan, setActiveOrgan] = 
    useState<OrganismContextType['activeOrgan']>(null)
  
  // ── CURSOR THERMAL ────────────────────────
  const thermalPointsRef = useRef<ThermalPoint[]>([])
  
  const addThermalPoint = useCallback(
    (x: number, y: number) => {
    const now = Date.now()
    // Decay existing:
    thermalPointsRef.current = 
      thermalPointsRef.current
        .filter(p => {
          const age = (now - p.timestamp) / 8000
          p.intensity = Math.exp(-age * 3)
          return p.intensity > 0.02
        })
    // Cap at 20:
    if (thermalPointsRef.current.length >= 20) {
      thermalPointsRef.current.shift()
    }
    thermalPointsRef.current.push({
      x, y, intensity: 1.0, timestamp: now
    })
  }, [])
  
  // ── TIMELINE ERA ─────────────────────────
  const [activeEra, setActiveEra] = 
    useState<ActiveEra>('FREELANCE')
  
  // ── AUDIO ────────────────────────────────
  const [audioActive, setAudioActive] = 
    useState(false)
  const [audioLevels, setAudioLevels] = 
    useState<AudioLevels>({
      bass: 0, mid: 0, treble: 0, overall: 0
    })
  
  // ── GITHUB DATA ──────────────────────────
  const [githubData, setGithubData] = 
    useState<GitHubData>({
      contributions:  16500,
      repos:          15,
      recentActivity: 'medium',
      isLive:         false,
    })
  
  useEffect(() => {
    const fetchGitHub = async () => {
      try {
        const [userRes, eventsRes] = 
          await Promise.all([
            fetch(
              'https://api.github.com/users/VanshBD'
            ),
            fetch(
              'https://api.github.com/' +
              'users/VanshBD/events?per_page=30'
            ),
          ])
        
        if (!userRes.ok) throw new Error('API fail')
        
        const user = await userRes.json()
        const events = await eventsRes.json()
        const recentPushes = Array.isArray(events)
          ? events.filter((e: any) => 
              e.type === 'PushEvent').length
          : 0
        
        const data: GitHubData = {
          contributions: 16500,
          repos: user.public_repos ?? 15,
          recentActivity: 
            recentPushes > 5 ? 'high' : 
            recentPushes > 2 ? 'medium' : 'low',
          isLive: true,
        }
        setGithubData(data)
        
        sessionStorage.setItem(
          'organism_github_cache',
          JSON.stringify({ 
            data, 
            timestamp: Date.now() 
          })
        )
      } catch {
        // Try cache:
        try {
          const cached = sessionStorage.getItem(
            'organism_github_cache')
          if (cached) {
            const { data, timestamp } = 
              JSON.parse(cached)
            if (Date.now() - timestamp < 300000) {
              setGithubData(data)
              return
            }
          }
        } catch {}
        // Use constants fallback — already set as default
      }
    }
    fetchGitHub()
  }, [])
  
  // ── CONTACT ──────────────────────────────
  const [contactVisible, setContactVisible] = 
    useState(false)
  
  const value: OrganismContextType = {
    subscribeToBreath,
    unsubscribeFromBreath,
    breathPhaseRef,
    pulseCount,
    lastPulseTime,
    triggerManualPulse,
    zoomLevel,
    setZoomLevel,
    targetRegion,
    setTargetRegion,
    hoveredRegion,
    setHoveredRegion,
    activeOrgan,
    setActiveOrgan,
    thermalPointsRef,
    addThermalPoint,
    activeEra,
    setActiveEra,
    audioActive,
    setAudioActive,
    audioLevels,
    setAudioLevels,
    githubData,
    deviceTier,
    contactVisible,
    setContactVisible,
  }
  
  return (
    <OrganismContext.Provider value={value}>
      {children}
    </OrganismContext.Provider>
  )
}

═══════════════════════════════════════════════
FILE 2 — /lib/shaders.ts COMPLETE GLSL CODE
═══════════════════════════════════════════════

// All GLSL shaders for THE ORGANISM.
// Exported as strings — used in 
// THREE.ShaderMaterial and custom materials.

// ─── ORGANISM BODY SHADERS ─────────────────

export const ORGANISM_VERTEX = `
  #ifdef GL_ES
  precision mediump float;
  #endif

  // Uniforms from application:
  uniform float uTime;          // elapsed time (seconds)
  uniform float uBreathPhase;   // 0-1 breath cycle
  uniform vec2  uMouse;         // mouse position (-1 to 1)
  uniform float uPulseIntensity;// 0-1 pulse flash

  // Varyings passed to fragment shader:
  varying vec3  vNormal;        // world normal
  varying vec3  vWorldPos;      // world position
  varying vec2  vUv;            // UV coordinates
  varying float vFresnel;       // edge detection
  varying float vNoise;         // surface variation
  varying float vThermal;       // cursor heat proximity

  // ── SIMPLEX NOISE (2D) ───────────────────
  // Embedded 2D simplex noise for vertex displacement.
  // This avoids needing a texture for noise.
  
  vec3 mod289(vec3 x) { 
    return x - floor(x * (1.0/289.0)) * 289.0; 
  }
  vec2 mod289(vec2 x) { 
    return x - floor(x * (1.0/289.0)) * 289.0; 
  }
  vec3 permute(vec3 x) { 
    return mod289(((x*34.0)+1.0)*x); 
  }
  
  float snoise(vec2 v) {
    const vec4 C = vec4(
       0.211324865405187,  // (3.0-sqrt(3.0))/6.0
       0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
      -0.577350269189626,  // -1.0 + 2.0 * C.x
       0.024390243902439   // 1.0/41.0
    );
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? 
      vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0)) 
      + i.x + vec3(0.0, i1.x, 1.0)
    );
    vec3 m = max(
      0.5 - vec3(
        dot(x0,  x0), 
        dot(x12.xy, x12.xy),
        dot(x12.zw, x12.zw)
      ), 0.0
    );
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 
         0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x  + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vUv = uv;
    // WORLD-SPACE normal (consistent with worldPos):
    vec3 worldNormal = normalize(mat3(transpose(inverse(modelMatrix))) * normal);
    vNormal = worldNormal; // now world-space
    
    // ── SURFACE NOISE DISPLACEMENT ──────────
    // Displace vertices using simplex noise 
    // for organic, non-uniform surface:
    float noiseVal = snoise(
      normal.xy * 0.8 + uTime * 0.04
    );
    // Secondary noise layer for fine detail:
    float noiseDetail = snoise(
      normal.xy * 2.2 + uTime * 0.08
    ) * 0.4;
    float combinedNoise = noiseVal + noiseDetail;
    vNoise = combinedNoise;
    
    // ── BREATH DISPLACEMENT ─────────────────
    // Scale organism based on breath phase:
    // smoothstep makes breathing feel biological
    float breathScale = 1.0 + 
      smoothstep(0.0, 1.0, uBreathPhase) * 0.03;
    
    // ── VERTEX DISPLACEMENT ─────────────────
    // Displace each vertex outward along normal:
    // noise: organic surface variation
    // breath: scale breathing
    vec3 displaced = position 
      + normal * combinedNoise * 0.14  // noise
      + normal * breathScale * 0.005;  // breath nudge
    
    // ── WORLD POSITION ─────────────────────
    vec4 worldPos4 = modelMatrix * 
      vec4(displaced, 1.0);
    vWorldPos = worldPos4.xyz;
    
    // ── FRESNEL (EDGE GLOW) ─────────────────
    // How much does this vertex face away from camera?
    // High fresnel = edge = glows brighter
    vec3 viewDir = normalize(cameraPosition - worldPos4.xyz);
    // Both worldNormal and viewDir are now world-space ✓
    vFresnel = 1.0 - max(dot(worldNormal, viewDir), 0.0);
    // Power 2 sharpens the edge effect:
    vFresnel = pow(vFresnel, 2.0);
    
    // ── THERMAL CURSOR ─────────────────────
    // Distance from vertex to mouse position.
    // uMouse is in normalized device coords (-1 to 1)
    // Convert world pos to comparable coords:
    vec2 worldXY = worldPos4.xy;
    vec2 mouseWorld = uMouse * 1.5; 
    // Rough scale: mouse at 1.0 = ~1.5 world units
    float mouseDist = length(worldXY - mouseWorld);
    // Thermal falloff: smooth within 0.4 world units:
    vThermal = smoothstep(0.4, 0.0, mouseDist);
    
    gl_Position = projectionMatrix * 
      modelViewMatrix * vec4(displaced, 1.0);
  }
`

export const ORGANISM_FRAGMENT = `
  #ifdef GL_ES
  precision mediump float;
  #endif

  // Uniforms:
  uniform float uPulseIntensity; // 0-1
  uniform float uBreathPhase;    // 0-1
  uniform float uSaturation;     // 0-1, for era scrubber
  uniform float uTime;           // seconds

  // Varyings from vertex shader:
  varying vec3  vNormal;
  varying vec3  vWorldPos;
  varying vec2  vUv;
  varying float vFresnel;
  varying float vNoise;
  varying float vThermal;

  // ── HELPER: APPLY SATURATION ─────────────
  vec3 applySaturation(vec3 color, float sat) {
    // Luminance weights (perceptual):
    float luminance = dot(color, 
      vec3(0.299, 0.587, 0.114));
    return mix(vec3(luminance), color, sat);
  }

  void main() {
    // ── BASE TISSUE COLOR ───────────────────
    // MEMBRANE: #0A1628 = vec3(0.039, 0.086, 0.157)
    vec3 baseColor = vec3(0.039, 0.086, 0.157);
    
    // ── SUBSURFACE SCATTERING APPROXIMATION ─
    // Tissue lit from inside: 
    // areas where normal faces camera 
    // (low fresnel) appear slightly lighter,
    // simulating light passing through tissue.
    // This gives the biological translucency feel.
    float sss = (1.0 - vFresnel) * 0.12;
    vec3 sssColor = vec3(0.0, 0.2, 0.4); 
    // Slightly blue interior light
    vec3 tissueColor = baseColor + sssColor * sss;
    
    // ── SURFACE NOISE VARIATION ─────────────
    // Subtle grain on tissue surface:
    float grain = (vNoise * 0.5 + 0.5) * 0.06;
    tissueColor += vec3(grain * 0.3, grain * 0.5, 
                        grain * 0.8);
    
    // ── FRESNEL EDGE GLOW ───────────────────
    // Edges glow NEURAL_CYAN: 
    // #00C8FF = vec3(0.0, 0.784, 1.0)
    vec3 edgeColor = vec3(0.0, 0.784, 1.0);
    float edgeGlow = vFresnel * 0.4;
    vec3 withEdge = mix(tissueColor, edgeColor, 
                        edgeGlow);
    
    // ── THERMAL CURSOR BRIGHTENING ──────────
    // Where cursor is close: brighten tissue.
    // Brightened tissue color: #1A3A5C
    // = vec3(0.102, 0.227, 0.361)
    vec3 thermalColor = vec3(0.102, 0.227, 0.361);
    vec3 withThermal = mix(withEdge, thermalColor, 
                           vThermal * 0.7);
    
    // ── PULSE FLASH ─────────────────────────
    // When pulse fires (uPulseIntensity 0→1):
    // Flash from tissue color to GROWTH green.
    // GROWTH: #00E87A = vec3(0.0, 0.91, 0.478)
    vec3 pulseColor = vec3(0.0, 0.91, 0.478);
    vec3 withPulse = mix(withThermal, pulseColor, 
                         uPulseIntensity * 0.6);
    
    // ── ERA SATURATION ──────────────────────
    // When Growth Axis scrubber is used:
    // past eras desaturate the organism
    vec3 finalColor = applySaturation(
      withPulse, uSaturation);
    
    // ── ALPHA ───────────────────────────────
    // Organism is NOT fully opaque —
    // slight translucency at edges:
    float alpha = 0.88 + 
      (1.0 - vFresnel) * 0.12; // core = 1.0, edges = 0.88
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`

// ─── SPINE TRAVELING HIGHLIGHT SHADER ──────

export const SPINE_VERTEX = `
  #ifdef GL_ES
  precision mediump float;
  #endif
  
  uniform float uProgress;  // 0-1, highlight position
  
  // vT: parametric position along tube (0=start, 1=end)
  // We derive it from UV.x since TubeGeometry maps 
  // UV.x to parametric position along the curve:
  varying float vT;
  varying float vHighlight;
  
  void main() {
    vT = uv.x;  
    // UV.x goes 0→1 along tube length
    
    // How close is this vertex to the highlight point?
    float dist = abs(vT - uProgress);
    // Smoothstep: 
    // within 0.05 of highlight = fully bright
    // beyond 0.08 = no highlight
    vHighlight = smoothstep(0.08, 0.0, dist);
    
    gl_Position = projectionMatrix * 
      modelViewMatrix * vec4(position, 1.0);
  }
`

export const SPINE_FRAGMENT = `
  #ifdef GL_ES
  precision mediump float;
  #endif
  
  uniform vec3  uBaseColor;  // spine color
  uniform float uOpacity;    // overall opacity
  
  varying float vT;
  varying float vHighlight;
  
  void main() {
    // Fade at top (spine extends beyond organism):
    // Fading section: vT > 0.7
    float fadeFactor = 1.0;
    if (vT > 0.7) {
      fadeFactor = 1.0 - ((vT - 0.7) / 0.3);
      fadeFactor = max(fadeFactor, 0.0);
    }
    
    // Mix base color with white highlight:
    vec3 highlightColor = vec3(1.0, 1.0, 1.0);
    vec3 finalColor = mix(uBaseColor, highlightColor, 
                          vHighlight * 0.85);
    
    gl_FragColor = vec4(
      finalColor, 
      uOpacity * fadeFactor
    );
  }
`

// ─── IRIDESCENT AI PATHWAY SHADER ──────────

export const IRIDESCENT_VERTEX = `
  #ifdef GL_ES
  precision mediump float;
  #endif
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * 
      modelViewMatrix * vec4(position, 1.0);
  }
`

export const IRIDESCENT_FRAGMENT = `
  #ifdef GL_ES
  precision mediump float;
  #endif
  
  uniform float uTime;
  varying vec2  vUv;
  
  void main() {
    // Cycle between NEURAL_CYAN and BIOLUMEN:
    // #00C8FF = vec3(0.0, 0.784, 1.0)
    // #6B2FEE = vec3(0.416, 0.184, 0.933)
    vec3 colorA = vec3(0.0,   0.784, 1.0);
    vec3 colorB = vec3(0.416, 0.184, 0.933);
    
    // Oscillate along UV.x (path direction)
    // and time:
    float wave = sin(
      vUv.x * 6.28 - uTime * 2.0
    ) * 0.5 + 0.5;
    
    vec3 color = mix(colorA, colorB, wave);
    float alpha = 0.7 + wave * 0.3;
    
    gl_FragColor = vec4(color, alpha);
  }
`

// ─── MEMBRANE CONSENSUS SHADER ─────────────

export const MEMBRANE_VERTEX = `
  #ifdef GL_ES
  precision mediump float;
  #endif
  
  // Per-vertex opacity attribute 
  // (updated per frame for consensus animation):
  attribute float aOpacity;
  varying   float vOpacity;
  
  void main() {
    vOpacity = aOpacity;
    gl_Position = projectionMatrix * 
      modelViewMatrix * vec4(position, 1.0);
  }
`

export const MEMBRANE_FRAGMENT = `
  #ifdef GL_ES
  precision mediump float;
  #endif
  
  uniform vec3  uColor;         // base color
  uniform float uGlobalOpacity; // overall membrane opacity
  uniform vec3  uConsensusColor;// flash color for consensus
  uniform float uConsensusFlash;// 0-1 flash intensity
  
  varying float vOpacity;
  
  void main() {
    // Mix base color with consensus flash:
    vec3 finalColor = mix(
      uColor, 
      uConsensusColor, 
      uConsensusFlash
    );
    
    gl_FragColor = vec4(
      finalColor, 
      vOpacity * uGlobalOpacity
    );
  }
`

═══════════════════════════════════════════════
FILE 3 — BreathClock.tsx
FILE: /components/organism/BreathClock.tsx
═══════════════════════════════════════════════

// BreathClock lives INSIDE the R3F Canvas.
// It uses useFrame (only available inside Canvas)
// to compute breath phase every frame and 
// emit it via a window CustomEvent.
// OrganismContext listens to this event and 
// notifies subscribers WITHOUT React re-renders.

'use client'

import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { BREATH } from '@/lib/constants'

export function BreathClock() {
  const lastPhaseRef = useRef(-1)
  
  useFrame(() => {
    const now = Date.now()
    const cyclePos = (now % BREATH.PERIOD_MS) / 
                      BREATH.PERIOD_MS  // 0-1
    
    let phase: number
    
    if (cyclePos < BREATH.INHALE_FRACTION) {
      // INHALE: 0→1 with smooth ease
      const t = cyclePos / BREATH.INHALE_FRACTION
      // Smoothstep (ease in-out):
      phase = t * t * (3.0 - 2.0 * t)
      
    } else if (cyclePos < 
      BREATH.INHALE_FRACTION + BREATH.HOLD_FRACTION) {
      // HOLD: sustained at 1.0
      phase = 1.0
      
    } else {
      // EXHALE: 1→0 with smooth ease
      const t = (cyclePos - BREATH.INHALE_FRACTION - 
                 BREATH.HOLD_FRACTION) / 
                 BREATH.EXHALE_FRACTION
      phase = 1.0 - t * t * (3.0 - 2.0 * t)
    }
    
    // Only emit when phase changes meaningfully
    // (threshold: 0.001 = 1000 steps per cycle)
    // Prevents flooding the event system:
    if (Math.abs(phase - lastPhaseRef.current) > 0.001) {
      lastPhaseRef.current = phase
      window.dispatchEvent(
        new CustomEvent<number>('organism:breath', { 
          detail: phase 
        })
      )
    }
  })
  
  // BreathClock renders nothing — 
  // it's a pure computation component:
  return null
}

═══════════════════════════════════════════════
FILE 4 — /hooks/useCursorThermal.ts
═══════════════════════════════════════════════

'use client'

import { useEffect, useCallback } from 'react'
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
      x:  (clientX / window.innerWidth)  * 2 - 1,
      y: -(clientY / window.innerHeight) * 2 + 1,
    }
  }, [])
  
  // Throttle: only process every 16ms (60fps max):
  const lastProcessTime = { current: 0 }
  
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

═══════════════════════════════════════════════
FILE 5 — /hooks/useScrollDepth.ts
═══════════════════════════════════════════════

'use client'

import { useEffect, useCallback } from 'react'
import { useOrganism } from '@/context/OrganismContext'
import { gsap } from 'gsap'

// Controls the 3-level zoom system.
// Scroll wheel (desktop) and pinch (mobile)
// both call the same setZoomLevel logic.

import * as THREE from 'three' // Make sure to import THREE

export function useScrollDepth(
  cameraRef: React.RefObject<THREE.PerspectiveCamera | null>
) {
  const { 
    zoomLevel, 
    setZoomLevel,
    setTargetRegion,
  } = useOrganism()
  
  const ZOOM_CONFIG = {
    macro: { z: 3.5 },
    meso:  { z: 1.8 },
    micro: { z: 0.6 },
  }
  
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
      return current  // already at micro
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
      return current  // already at macro
    })
  }, [animateCamera, setZoomLevel, setTargetRegion])
  
  // DESKTOP: scroll wheel
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    if (e.deltaY > 0) zoomIn()
    else zoomOut()
  }, [zoomIn, zoomOut])
  
  // MOBILE: pinch gesture
  const touchState = { 
    lastDistance: 0, 
    isPinching: false 
  }
  
  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
    if (e.touches.length === 2) {
      touchState.isPinching = true
      touchState.lastDistance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      )
    }
  }, [])
  
  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
    if (!touchState.isPinching) return
    if (e.touches.length !== 2) return
    
    const newDist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    )
    const delta = newDist - touchState.lastDistance
    
    if (Math.abs(delta) > 8) {
      if (delta > 0) zoomIn()
      else zoomOut()
      touchState.lastDistance = newDist
    }
  }, [zoomIn, zoomOut])
  
  const handleTouchEnd = useCallback(() => {
    touchState.isPinching = false
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

═══════════════════════════════════════════════
FILE 6 — /hooks/useOrganismPulse.ts
═══════════════════════════════════════════════

'use client'

import { useEffect, useCallback } from 'react'

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

═══════════════════════════════════════════════
FILE 7 — OrganismCanvas.tsx COMPLETE
FILE: /components/organism/OrganismCanvas.tsx
═══════════════════════════════════════════════

'use client'
import { useScrollDepth } from '@/hooks/useScrollDepth'
import { useCursorThermal } from '@/hooks/useCursorThermal'
import { useRef, useEffect, useState } from 'react'
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
import { COLORS_HEX } from '@/lib/colors'

// ─── ORGANISM MESH COMPONENT ───────────────
// Rendered inside Canvas

function OrganismMesh() {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const { gl, camera } = useThree()
  
  const { 
    breathPhaseRef,
    subscribeToBreath,
    unsubscribeFromBreath,
    thermalPointsRef,
    deviceTier,
  } = useOrganism()
  
  // Mouse NDC position for thermal shader:
  const mouseNDC = useRef({ x: 0, y: 0 })
  
  // Pulse animation state:
  const pulseIntensityRef = useRef(0)
  
  // Create organism geometry:
  const geometry = useRef<THREE.BufferGeometry>()
  
  useEffect(() => {
    // ── BASE ICOSAHEDRON ─────────────────────
    const detail = deviceTier === 'low' ? 3 : 
                   deviceTier === 'mid' ? 4 : 5
    const baseGeo = new THREE.IcosahedronGeometry(
      ORGANISM_GEO.BASE_RADIUS, detail
    )
    
    // ── VERTEX DISPLACEMENT ──────────────────
    // Pull vertices toward region bump positions
    // AND apply simplex noise displacement.
    // The shader handles noise (animated).
    // Here we handle the STATIC bump shaping.
    
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
    geometry.current = baseGeo
    
    return () => {
      baseGeo.dispose()
    }
  }, [deviceTier])
  
  // Create shader material:
  const shaderMaterial = useRef(
    new THREE.ShaderMaterial({
      vertexShader:   ORGANISM_VERTEX,
      fragmentShader: ORGANISM_FRAGMENT,
      uniforms: {
        uTime:          { value: 0 },
        uBreathPhase:   { value: 0 },
        uMouse:         { value: new THREE.Vector2(0, 0) },
        uPulseIntensity:{ value: 0 },
        uSaturation:    { value: 1.0 },
      },
      transparent: true,
      side: THREE.FrontSide,
      depthWrite: true,
    })
  )
  
  // Subscribe to breath updates (no re-renders):
  useEffect(() => {
    subscribeToBreath('organism-mesh', (phase) => {
      if (shaderMaterial.current) {
        shaderMaterial.current.uniforms
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
      const originalZ = cam.position.z
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
  
  // Cleanup shader material on unmount:
  useEffect(() => {
    return () => {
      shaderMaterial.current.dispose()
    }
  }, [])
  
  useFrame(({ clock }) => {
    if (!shaderMaterial.current) return
    
    const uniforms = shaderMaterial.current.uniforms
    
    // Update time uniform:
    uniforms.uTime.value = clock.getElapsedTime()
    
    // Update mouse uniform:
    uniforms.uMouse.value.set(
      mouseNDC.current.x, 
      mouseNDC.current.y
    )
    
    // Update pulse uniform:
    uniforms.uPulseIntensity.value = 
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
  
  if (!geometry.current) return null
  
  return (
    <mesh
      ref={meshRef}
      geometry={geometry.current}
    >
      <primitive 
        object={shaderMaterial.current} 
        attach="material" 
      />
    </mesh>
  )
}

// ─── MAIN ORGANISM CANVAS ──────────────────

export default function OrganismCanvas() {
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const { deviceTier } = useOrganism()
  
  // ADD: ACTIVATE ZOOM SYSTEM
  useScrollDepth(cameraRef)
  
  // ADD: ACTIVATE THERMAL CURSOR
  useCursorThermal()
  
  // Initialize scroll/zoom system after canvas mounts:
  // (useScrollDepth needs cameraRef)
  
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

═══════════════════════════════════════════════
VERIFICATION — AFTER PROMPT 03
═══════════════════════════════════════════════

npm run dev must show:
1. Birth sequence runs (from Prompt 02)
2. After sequence: organism mesh appears — 
   an irregular, living shape on void background
3. Organism breathes visibly (scale 1.0→1.03→1.0)
4. Edge glow (cyan fresnel) visible
5. Moving mouse darkens/brightens organism surface
6. Organism does NOT flicker or re-render 
   on every breath tick (check React DevTools —
   OrganismCanvas should NOT re-render every frame)
7. Console: no errors, no warnings

If organism mesh appears but does NOT breathe:
→ BreathClock is not mounted inside Canvas.
  Check that <BreathClock /> is inside <Canvas>.

If organism appears totally flat (no edge glow):
→ Fresnel calculation in shader is wrong.
  Check that vNormal is being passed correctly
  from vertex to fragment shader.

If console shows "ShaderMaterial: uniforms not found":
→ Uniform name typo. 
  Check ORGANISM_VERTEX uniform declarations 
  match shaderMaterial uniforms object exactly.