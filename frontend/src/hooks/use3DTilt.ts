import { useState, useCallback, useEffect } from 'react'

export function use3DTilt() {
  const [tilt, setTilt] = useState({ tiltX: 0, tiltY: 0 })
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion) return

      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2

      // Calculate tilt angles (-20 to 20 degrees)
      const tiltX = ((x - centerX) / centerX) * 20
      const tiltY = ((centerY - y) / centerY) * 20

      setTilt({ tiltX, tiltY })
    },
    [prefersReducedMotion]
  )

  const handleMouseLeave = useCallback(() => {
    setTilt({ tiltX: 0, tiltY: 0 })
  }, [])

  return {
    tiltX: tilt.tiltX,
    tiltY: tilt.tiltY,
    handleMouseMove,
    handleMouseLeave
  }
}
