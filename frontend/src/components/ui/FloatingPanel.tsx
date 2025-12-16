import { motion } from 'framer-motion'
import { ReactNode, useEffect, useState, useRef } from 'react'
import { useParallax } from '../../hooks/useParallax'
import { use3DTilt } from '../../hooks/use3DTilt'

interface FloatingPanelProps {
  id?: string
  variant?: 'badge' | 'sticker' | 'chip'
  icon?: ReactNode
  label?: string
  x: number // percentage
  y: number // percentage
  size?: number // pixels
  orbit?: boolean
  zIndex?: number
}

export default function FloatingPanel({
  id,
  variant = 'badge',
  icon,
  label,
  x,
  y,
  size = 80,
  orbit = false,
  zIndex = 10
}: FloatingPanelProps) {
  const { offsetX, offsetY } = useParallax()
  const { tiltX, tiltY, handleMouseMove, handleMouseLeave } = use3DTilt()
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [flicker, setFlicker] = useState(1)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  // Random hover flicker effect
  useEffect(() => {
    if (!isHovered || prefersReducedMotion) return

    const flickerInterval = setInterval(() => {
      setFlicker(0.95 + Math.random() * 0.05)
    }, 100)

    return () => clearInterval(flickerInterval)
  }, [isHovered, prefersReducedMotion])

  const variantClasses = {
    badge: 'floating-panel--badge',
    sticker: 'floating-panel--sticker',
    chip: 'floating-panel--chip'
  }

  const parallaxTransform = prefersReducedMotion
    ? {}
    : {
        x: offsetX * 0.5,
        y: offsetY * 0.5
      }

  const orbitAnimation = orbit && !prefersReducedMotion
    ? {
        x: [0, 15, 0, -15, 0],
        y: [0, -10, -15, -10, 0]
      }
    : {}

  const tiltTransform = prefersReducedMotion
    ? {}
    : {
        rotateX: tiltY * 0.3,
        rotateY: tiltX * 0.3
      }

  return (
    <motion.div
      ref={panelRef}
      id={id}
      className={`floating-panel-3d ${variantClasses[variant]}`}
      role="img"
      aria-label={label || 'Decorative panel'}
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        zIndex,
        pointerEvents: 'auto',
        perspective: 1000,
        transformStyle: 'preserve-3d'
      }}
      animate={{
        ...parallaxTransform,
        ...orbitAnimation
      }}
      transition={
        orbit
          ? {
              duration: 20,
              repeat: Infinity,
              ease: 'linear'
            }
          : {
              type: 'spring',
              stiffness: 50,
              damping: 20
            }
      }
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        handleMouseLeave()
      }}
      onMouseMove={handleMouseMove}
    >
      {/* Force-field glow layer */}
      <motion.div
        className="force-field-glow"
        animate={{
          scale: isHovered ? 1.2 : 1,
          opacity: isHovered ? 0.6 : 0.3
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Layered depth shadows */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="depth-shadow"
          style={{
            transform: `translateZ(-${(i + 1) * 2}px)`,
            opacity: 0.1 - i * 0.015
          }}
        />
      ))}

      {/* Main panel with 3D tilt */}
      <motion.div
        className="floating-panel-3d__inner"
        style={{
          opacity: flicker,
          transformStyle: 'preserve-3d'
        }}
        animate={tiltTransform}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Neon hologram border loop */}
        <div className="hologram-border-loop" />

        {/* Shimmering light sweep */}
        <motion.div
          className="light-sweep"
          animate={{
            x: ['-100%', '200%']
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
            repeatDelay: 3
          }}
        />

        {/* Floating particle orbits */}
        {!prefersReducedMotion && (
          <>
            {[...Array(6)].map((_, i) => {
              const angle = (i / 6) * Math.PI * 2
              return (
                <motion.div
                  key={i}
                  className="orbit-particle"
                  animate={{
                    x: [
                      Math.cos(angle) * 40,
                      Math.cos(angle + Math.PI) * 40,
                      Math.cos(angle) * 40
                    ],
                    y: [
                      Math.sin(angle) * 40,
                      Math.sin(angle + Math.PI) * 40,
                      Math.sin(angle) * 40
                    ]
                  }}
                  transition={{
                    duration: 4 + i * 0.5,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                />
              )
            })}
          </>
        )}

        {/* Icon with core animation */}
        {icon && (
          <motion.div
            className="floating-panel-3d__icon"
            animate={
              !prefersReducedMotion
                ? {
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, 0, -5, 0]
                  }
                : {}
            }
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            {icon}
          </motion.div>
        )}

        {/* Label */}
        {label && variant === 'badge' && (
          <div className="floating-panel-3d__label">{label}</div>
        )}
      </motion.div>

      {/* Magnetic snap indicator */}
      {isHovered && !prefersReducedMotion && (
        <motion.div
          className="magnetic-snap-ring"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 0 }}
          transition={{ duration: 0.6, repeat: Infinity }}
        />
      )}
    </motion.div>
  )
}
