'use client'

import {
  createContext, useContext, useRef,
  useState, useCallback, useEffect,
  type ReactNode
} from 'react'

// ─── TYPES ─────────────────────────────────

export type ZoomLevel = 'macro' | 'meso' | 'micro'
export type DeviceTier = 'high' | 'mid' | 'low'
export type ActiveEra =
  'SWIFT_RUT' | 'AUM' | 'FREELANCE' | null

export interface ThermalPoint {
  x: number          // screen space X (px)
  y: number          // screen space Y (px)
  intensity: number  // 0-1, decays over time
  timestamp: number  // Date.now() at creation
}

export interface AudioLevels {
  bass: number     // 60-200Hz, 0-1
  mid: number      // 200-2000Hz, 0-1
  treble: number   // 2000Hz+, 0-1
  overall: number  // RMS, 0-1
}

export interface GitHubData {
  contributions: number
  repos: number
  recentActivity: 'high' | 'medium' | 'low'
  isLive: boolean
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
  pulseCount: number
  lastPulseTime: number
  triggerManualPulse: () => void

  // ── ZOOM SYSTEM ────────────────────────────
  zoomLevel: ZoomLevel
  setZoomLevel: React.Dispatch<React.SetStateAction<ZoomLevel>>
  targetRegion: string | null
  setTargetRegion: (region: string | null) => void

  // ── REGION / ORGAN SYSTEM ──────────────────
  hoveredRegion: string | null
  setHoveredRegion: (region: string | null) => void
  activeOrgan: 'teamoss' | 'billstack' |
    'ghostdeck' | null
  setActiveOrgan: (
    organ: 'teamoss' | 'billstack' |
      'ghostdeck' | null
  ) => void

  // ── CURSOR THERMAL ─────────────────────────
  thermalPointsRef: React.RefObject<ThermalPoint[]>
  addThermalPoint: (x: number, y: number) => void

  // ── TIMELINE ERA ───────────────────────────
  activeEra: ActiveEra
  setActiveEra: (era: ActiveEra) => void

  // ── AUDIO ──────────────────────────────────
  audioActive: boolean
  setAudioActive: (active: boolean) => void
  audioLevels: AudioLevels
  setAudioLevels: (levels: AudioLevels) => void

  // ── GITHUB DATA ────────────────────────────
  githubData: GitHubData

  // ── DEVICE ─────────────────────────────────
  deviceTier: DeviceTier

  // ── CONTACT ────────────────────────────────
  contactVisible: boolean
  setContactVisible: (v: boolean) => void
}

// ─── CONTEXT CREATION ──────────────────────

const OrganismContext =
  createContext<OrganismContextType | null>(null)

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
  const breathSubscribers = useRef<
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
    useState(() => Date.now())

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
      contributions: 16500,
      repos: 15,
      recentActivity: 'medium',
      isLive: false,
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
          ? events.filter((e: { type?: string }) =>
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
