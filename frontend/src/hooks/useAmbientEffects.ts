import { useState, useEffect, useCallback } from 'react'

interface AmbientEffectsConfig {
  enableParticles?: boolean
  enableWireframes?: boolean
  enableMPCSignals?: boolean
  enableLightScan?: boolean
  enableRotatingRings?: boolean
  enableCryptoDust?: boolean
  enableNoiseGrain?: boolean
}

export function useAmbientEffects(config: AmbientEffectsConfig = {}) {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [scrollPosition, setScrollPosition] = useState(0)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detect reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Track cursor position with RAF throttling
  useEffect(() => {
    if (prefersReducedMotion || isMobile) return

    let rafId: number
    let lastTime = 0
    const throttleMs = 33 // ~30 FPS

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now()
      if (now - lastTime < throttleMs) return

      lastTime = now

      if (rafId) cancelAnimationFrame(rafId)

      rafId = requestAnimationFrame(() => {
        setCursorPosition({
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight
        })
      })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [prefersReducedMotion, isMobile])

  // Track scroll position with RAF throttling
  useEffect(() => {
    if (prefersReducedMotion || isMobile) return

    let rafId: number
    let lastTime = 0
    const throttleMs = 50 // ~20 FPS for scroll

    const handleScroll = () => {
      const now = Date.now()
      if (now - lastTime < throttleMs) return

      lastTime = now

      if (rafId) cancelAnimationFrame(rafId)

      rafId = requestAnimationFrame(() => {
        setScrollPosition(window.scrollY)
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [prefersReducedMotion, isMobile])

  const shouldEnableEffect = useCallback(
    (effectName: keyof AmbientEffectsConfig) => {
      if (prefersReducedMotion) return false
      if (isMobile && effectName !== 'enableNoiseGrain') return false
      return config[effectName] !== false
    },
    [config, prefersReducedMotion, isMobile]
  )

  return {
    cursorPosition,
    scrollPosition,
    prefersReducedMotion,
    isMobile,
    shouldEnableEffect,
    isActive: !prefersReducedMotion && !isMobile
  }
}
