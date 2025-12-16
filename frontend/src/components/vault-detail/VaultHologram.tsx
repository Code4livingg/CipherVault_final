import { motion } from 'framer-motion'

interface VaultHologramProps {
  status: string
}

export default function VaultHologram({ status }: VaultHologramProps) {
  const isUnlocked = status === 'destroyed'
  const isReady = status === 'ready' || status === 'unlocking'

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Outer rotating ring */}
      <motion.svg
        width="400"
        height="400"
        viewBox="0 0 400 400"
        className="absolute opacity-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      >
        <circle
          cx="200"
          cy="200"
          r="180"
          fill="none"
          stroke="#3B82F6"
          strokeWidth="1"
          strokeDasharray="8 16"
        />
      </motion.svg>

      {/* Middle ring */}
      <motion.svg
        width="350"
        height="350"
        viewBox="0 0 350 350"
        className="absolute opacity-25"
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        <circle
          cx="175"
          cy="175"
          r="150"
          fill="none"
          stroke="#D1A954"
          strokeWidth="0.5"
          strokeDasharray="4 8"
        />
      </motion.svg>

      {/* Inner vault door */}
      <motion.svg
        width="300"
        height="300"
        viewBox="0 0 300 300"
        className="absolute opacity-30"
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
      >
        {/* Vault door segments */}
        <path
          d="M150,50 L180,80 L180,120 L150,150 L120,120 L120,80 Z"
          fill="none"
          stroke="#3B82F6"
          strokeWidth="1"
        />
        <path
          d="M150,150 L180,180 L180,220 L150,250 L120,220 L120,180 Z"
          fill="none"
          stroke="#3B82F6"
          strokeWidth="1"
        />
        <path
          d="M50,150 L80,120 L120,120 L150,150 L120,180 L80,180 Z"
          fill="none"
          stroke="#3B82F6"
          strokeWidth="1"
        />
        <path
          d="M250,150 L220,120 L180,120 L150,150 L180,180 L220,180 Z"
          fill="none"
          stroke="#3B82F6"
          strokeWidth="1"
        />
      </motion.svg>

      {/* Center lock core - pulses based on status */}
      <motion.div
        className="absolute w-16 h-16 rounded-full"
        animate={{
          scale: isReady ? [1, 1.2, 1] : [1, 1.05, 1],
          opacity: isUnlocked ? [0.3, 0.1, 0.3] : [0.5, 0.8, 0.5]
        }}
        transition={{
          duration: isReady ? 1.5 : 3,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        style={{
          background: `radial-gradient(circle, ${
            isUnlocked ? 'rgba(220, 38, 38, 0.3)' : 
            isReady ? 'rgba(209, 169, 84, 0.3)' : 
            'rgba(59, 130, 246, 0.3)'
          } 0%, transparent 70%)`
        }}
      />

      {/* Lock icon in center */}
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        className="absolute"
        style={{
          opacity: isUnlocked ? 0.2 : 0.4
        }}
      >
        {isUnlocked ? (
          <path
            d="M12 2C9.243 2 7 4.243 7 7v1H6c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2h-1V7c0-2.757-2.243-5-5-5zm0 2c1.654 0 3 1.346 3 3v1H9V7c0-1.654 1.346-3 3-3z"
            stroke="#DC2626"
            strokeWidth="0.5"
          />
        ) : (
          <path
            d="M12 2C9.243 2 7 4.243 7 7v3H6c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2h-1V7c0-2.757-2.243-5-5-5zm0 2c1.654 0 3 1.346 3 3v3H9V7c0-1.654 1.346-3 3-3zm0 9c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"
            stroke={isReady ? '#D1A954' : '#3B82F6'}
            strokeWidth="0.5"
          />
        )}
      </svg>

      {/* Hexagon frame */}
      <motion.svg
        width="250"
        height="250"
        viewBox="0 0 250 250"
        className="absolute opacity-15"
        animate={{ rotate: -360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      >
        <path
          d="M125,25 L200,75 L200,175 L125,225 L50,175 L50,75 Z"
          fill="none"
          stroke="#3B82F6"
          strokeWidth="1"
        />
      </motion.svg>
    </div>
  )
}
