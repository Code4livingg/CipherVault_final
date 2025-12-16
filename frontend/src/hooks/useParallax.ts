import { useState, useEffect } from 'react'

export function useParallax() {
  const [offset, setOffset] = useState({ offsetX: 0, offsetY: 0 })
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)

    if (prefersReducedMotion) {
      return () => mediaQuery.removeEventListener('change', handler)
    }

    let rafId: number
    let lastTime = 0
    const throttleMs = 33 // ~30 FPS

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now()
      if (now - lastTime < throttleMs) return

      lastTime = now

      if (rafId) cancelAnimationFrame(rafId)

      rafId = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20
        const y = (e.clientY / window.innerHeight - 0.5) * 20
        setOffset({ offsetX: x, offsetY: y })
      })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (rafId) cancelAnimationFrame(rafId)
      mediaQuery.removeEventListener('change', handler)
    }
  }, [prefersReducedMotion])

  return offset
}
