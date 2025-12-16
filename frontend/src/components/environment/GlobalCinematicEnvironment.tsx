import { motion } from 'framer-motion'
import { useAmbientEffects } from '../../hooks/useAmbientEffects'

interface GlobalCinematicEnvironmentProps {
  enableParticles?: boolean
  enableWireframes?: boolean
  enableMPCSignals?: boolean
  enableLightScan?: boolean
  enableRotatingRings?: boolean
  enableCryptoDust?: boolean
  enableNoiseGrain?: boolean
}

export default function GlobalCinematicEnvironment({
  enableParticles = true,
  enableWireframes = true,
  enableMPCSignals = true,
  enableLightScan = true,
  enableRotatingRings = true,
  enableCryptoDust = true,
  enableNoiseGrain = true
}: GlobalCinematicEnvironmentProps) {
  const {
    cursorPosition,
    scrollPosition,
    shouldEnableEffect,
    isActive
  } = useAmbientEffects({
    enableParticles,
    enableWireframes,
    enableMPCSignals,
    enableLightScan,
    enableRotatingRings,
    enableCryptoDust,
    enableNoiseGrain
  })

  return (
    <div className="cinematic-environment" aria-hidden="true">
      {/* Ambient Noise Grain Overlay */}
      {shouldEnableEffect('enableNoiseGrain') && (
        <div className="noise-grain-overlay" />
      )}

      {/* Drifting Particles */}
      {shouldEnableEffect('enableParticles') && (
        <div className="drifting-particles">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="ambient-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: Math.random() * 3 + 1,
                height: Math.random() * 3 + 1
              }}
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{
                duration: 20 + Math.random() * 20,
                repeat: Infinity,
                ease: 'linear',
                delay: Math.random() * 10
              }}
            />
          ))}
        </div>
      )}

      {/* Crypto Symbol Dust */}
      {shouldEnableEffect('enableCryptoDust') && (
        <div className="crypto-dust">
          {['₿', 'Ξ', '◆', '🔑', '🧩'].map((symbol, i) => (
            <motion.div
              key={`dust-${i}`}
              className="dust-symbol"
              style={{
                left: `${(i * 20 + Math.random() * 15)}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                y: [0, -100, -200],
                opacity: [0, 0.02, 0],
                rotate: [0, 360]
              }}
              transition={{
                duration: 30 + i * 5,
                repeat: Infinity,
                ease: 'linear',
                delay: i * 3
              }}
            >
              {symbol}
            </motion.div>
          ))}
        </div>
      )}

      {/* Blueprint Wireframe Layers */}
      {shouldEnableEffect('enableWireframes') && (
        <div className="wireframe-layers">
          <motion.svg
            className="wireframe-layer"
            viewBox="0 0 1000 1000"
            style={{
              transform: `translateY(${scrollPosition * 0.1}px)`
            }}
          >
            {/* Grid lines */}
            {[...Array(10)].map((_, i) => (
              <g key={`grid-${i}`} opacity={0.03}>
                <line
                  x1={i * 100}
                  y1="0"
                  x2={i * 100}
                  y2="1000"
                  stroke="#3B82F6"
                  strokeWidth="0.5"
                />
                <line
                  x1="0"
                  y1={i * 100}
                  x2="1000"
                  y2={i * 100}
                  stroke="#3B82F6"
                  strokeWidth="0.5"
                />
              </g>
            ))}
            
            {/* Diagonal lines */}
            <line
              x1="0"
              y1="0"
              x2="1000"
              y2="1000"
              stroke="#D1A954"
              strokeWidth="0.5"
              opacity="0.02"
              strokeDasharray="10 20"
            />
            <line
              x1="1000"
              y1="0"
              x2="0"
              y2="1000"
              stroke="#D1A954"
              strokeWidth="0.5"
              opacity="0.02"
              strokeDasharray="10 20"
            />
          </motion.svg>
        </div>
      )}

      {/* Ambient MPC Signals */}
      {shouldEnableEffect('enableMPCSignals') && (
        <div className="mpc-signals">
          {[...Array(8)].map((_, i) => {
            const startX = Math.random() * 100
            const startY = Math.random() * 100
            const endX = Math.random() * 100
            const endY = Math.random() * 100
            
            return (
              <motion.svg
                key={`signal-${i}`}
                className="mpc-signal-line"
                viewBox="0 0 100 100"
                style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none'
                }}
              >
                <motion.line
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke="#3B82F6"
                  strokeWidth="0.1"
                  opacity="0"
                  animate={{
                    opacity: [0, 0.3, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: 'easeInOut'
                  }}
                />
              </motion.svg>
            )
          })}
        </div>
      )}

      {/* Dynamic Light Scan Effect */}
      {shouldEnableEffect('enableLightScan') && isActive && (
        <motion.div
          className="light-scan-cursor"
          style={{
            left: `${cursorPosition.x * 100}%`,
            top: `${cursorPosition.y * 100}%`
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      )}

      {/* Low-Opacity Rotating Rings */}
      {shouldEnableEffect('enableRotatingRings') && (
        <div className="rotating-rings">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`ring-${i}`}
              className="ambient-ring"
              style={{
                width: 300 + i * 200,
                height: 300 + i * 200
              }}
              animate={{
                rotate: 360
              }}
              transition={{
                duration: 40 + i * 20,
                repeat: Infinity,
                ease: 'linear'
              }}
            >
              <svg viewBox="0 0 100 100" className="ring-svg">
                <circle
                  cx="50"
                  cy="50"
                  r="48"
                  fill="none"
                  stroke={i % 2 === 0 ? '#3B82F6' : '#D1A954'}
                  strokeWidth="0.2"
                  strokeDasharray="5 10"
                  opacity="0.05"
                />
              </svg>
            </motion.div>
          ))}
        </div>
      )}

      {/* Micro Crypto Glyphs */}
      {shouldEnableEffect('enableParticles') && (
        <div className="micro-glyphs">
          {['0x', '1', '0', 'Ξ', '₿', '#'].map((glyph, i) => (
            <motion.div
              key={`glyph-${i}`}
              className="micro-glyph"
              style={{
                left: `${(i * 15 + Math.random() * 10)}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                y: [0, -50, -100],
                opacity: [0, 0.05, 0],
                x: [0, Math.random() * 20 - 10]
              }}
              transition={{
                duration: 15 + i * 2,
                repeat: Infinity,
                ease: 'linear',
                delay: i * 2
              }}
            >
              {glyph}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
