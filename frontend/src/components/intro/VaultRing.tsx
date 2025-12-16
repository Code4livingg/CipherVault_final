import { motion } from 'framer-motion'

export default function VaultRing() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ zIndex: 1 }}>
      {/* Outer ring */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      >
        <svg width="700" height="700" viewBox="0 0 700 700" className="opacity-20">
          <circle
            cx="350"
            cy="350"
            r="320"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="1"
            strokeDasharray="8 12"
          />
        </svg>
      </motion.div>

      {/* Middle ring */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{ rotate: -360 }}
        transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
      >
        <svg width="600" height="600" viewBox="0 0 600 600" className="opacity-15">
          <circle
            cx="300"
            cy="300"
            r="270"
            fill="none"
            stroke="#D1A954"
            strokeWidth="0.5"
            strokeDasharray="4 8"
          />
        </svg>
      </motion.div>

      {/* Inner ring */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        <svg width="500" height="500" viewBox="0 0 500 500" className="opacity-25">
          <circle
            cx="250"
            cy="250"
            r="220"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="0.5"
            strokeDasharray="2 6"
          />
        </svg>
      </motion.div>

      {/* Hexagon pattern */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{ rotate: -360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      >
        <svg width="400" height="400" viewBox="0 0 400 400" className="opacity-10">
          <path
            d="M200,50 L300,125 L300,275 L200,350 L100,275 L100,125 Z"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="1"
          />
        </svg>
      </motion.div>

      {/* Pulsing center glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)'
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    </div>
  )
}
