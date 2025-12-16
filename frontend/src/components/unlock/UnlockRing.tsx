import { motion } from 'framer-motion'

interface Approval {
  approverId: string
  approved: boolean
  timestamp: string
}

interface UnlockRingProps {
  vaultId: string
  approvals: Approval[]
  threshold: number
  totalHolders: number
  onExecute?: () => void
  isExecuting?: boolean
}

export default function UnlockRing({
  approvals,
  threshold,
  totalHolders,
  isExecuting = false
}: UnlockRingProps) {
  const approvedCount = approvals.filter(a => a.approved).length
  const isThresholdReached = approvedCount >= threshold

  // Position nodes around the ring
  const nodePositions = Array.from({ length: totalHolders }, (_, i) => {
    const angle = (i / totalHolders) * 2 * Math.PI - Math.PI / 2
    const radius = 140
    return {
      x: 200 + Math.cos(angle) * radius,
      y: 200 + Math.sin(angle) * radius
    }
  })

  return (
    <div 
      className="relative w-full h-full flex items-center justify-center"
      role="status"
      aria-label={`${approvedCount} of ${threshold} approvals received. ${isThresholdReached ? 'Threshold reached.' : 'Awaiting approvals.'}`}
    >
      {/* Outer ring */}
      <motion.svg
        width="400"
        height="400"
        viewBox="0 0 400 400"
        className="absolute"
        animate={isExecuting ? { rotate: 360 } : { rotate: 360 }}
        transition={
          isExecuting
            ? { duration: 0.6, ease: 'easeOut' }
            : { duration: 10, repeat: Infinity, ease: 'linear' }
        }
      >
        <circle
          cx="200"
          cy="200"
          r="160"
          fill="none"
          stroke={isThresholdReached ? '#D1A954' : '#3B82F6'}
          strokeWidth="1"
          strokeDasharray="8 16"
          opacity="0.3"
        />
      </motion.svg>

      {/* Middle ring */}
      <motion.svg
        width="350"
        height="350"
        viewBox="0 0 350 350"
        className="absolute"
        animate={{ rotate: -360 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      >
        <circle
          cx="175"
          cy="175"
          r="130"
          fill="none"
          stroke={isThresholdReached ? '#D1A954' : '#3B82F6'}
          strokeWidth="0.5"
          strokeDasharray="4 8"
          opacity="0.2"
        />
      </motion.svg>

      {/* Approval nodes */}
      <svg width="400" height="400" viewBox="0 0 400 400" className="absolute">
        {approvals.map((approval, index) => {
          const pos = nodePositions[index]
          const isApproved = approval.approved

          return (
            <g key={index}>
              {/* Pulse ring */}
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r="8"
                fill="none"
                stroke={isApproved ? '#D1A954' : '#3B82F6'}
                strokeWidth="0.5"
                animate={{
                  r: [8, 14, 8],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.2
                }}
              />

              {/* Node core */}
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r="5"
                fill={isApproved ? '#D1A954' : '#3B82F6'}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1, type: 'spring' }}
                style={{
                  filter: isApproved ? 'drop-shadow(0 0 4px rgba(209, 169, 84, 0.6))' : 'none'
                }}
              />

              {/* Approval flash */}
              {isApproved && (
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r="8"
                  fill="none"
                  stroke="#D1A954"
                  strokeWidth="2"
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.8 }}
                />
              )}

              {/* Connection line to center */}
              <motion.line
                x1={pos.x}
                y1={pos.y}
                x2="200"
                y2="200"
                stroke={isApproved ? '#D1A954' : '#3B82F6'}
                strokeWidth="0.5"
                strokeDasharray="2 4"
                opacity={isApproved ? 0.6 : 0.2}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: index * 0.1 }}
              />
            </g>
          )
        })}
      </svg>

      {/* Center lock icon */}
      <motion.div
        className="absolute w-20 h-20 rounded-full flex items-center justify-center"
        animate={
          isExecuting
            ? {
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1]
              }
            : isThresholdReached
            ? {
                scale: [1, 1.2, 1],
                opacity: [0.8, 1, 0.8]
              }
            : {
                scale: [1, 1.05, 1],
                opacity: [0.6, 0.8, 0.6]
              }
        }
        transition={{
          duration: isExecuting ? 0.6 : isThresholdReached ? 1.5 : 3,
          repeat: isExecuting ? 0 : Infinity,
          ease: 'easeInOut'
        }}
        style={{
          background: `radial-gradient(circle, ${
            isThresholdReached
              ? 'rgba(209, 169, 84, 0.3)'
              : 'rgba(59, 130, 246, 0.3)'
          } 0%, transparent 70%)`
        }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          className="relative"
        >
          <path
            d="M12 2C9.243 2 7 4.243 7 7v3H6c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2h-1V7c0-2.757-2.243-5-5-5zm0 2c1.654 0 3 1.346 3 3v3H9V7c0-1.654 1.346-3 3-3zm0 9c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"
            stroke={isThresholdReached ? '#D1A954' : '#3B82F6'}
            strokeWidth="0.5"
            fill={isThresholdReached ? 'rgba(209, 169, 84, 0.2)' : 'rgba(59, 130, 246, 0.2)'}
          />
        </svg>
      </motion.div>

      {/* Radial burst on execute */}
      {isExecuting && (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.6 }}
        >
          {[...Array(12)].map((_, i) => {
            const angle = (i / 12) * 2 * Math.PI
            return (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 w-1 h-20 bg-[#D1A954]"
                style={{
                  transformOrigin: 'top center',
                  transform: `rotate(${angle}rad) translateY(-50%)`
                }}
                initial={{ scaleY: 0, opacity: 1 }}
                animate={{ scaleY: 1, opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            )
          })}
        </motion.div>
      )}

      {/* Threshold reached indicator */}
      {isThresholdReached && !isExecuting && (
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-16"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 bg-[#D1A954]/10 border border-[#D1A954]/30 rounded-full px-4 py-2">
            <motion.div
              className="w-2 h-2 bg-[#D1A954] rounded-full"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-[#D1A954] text-sm font-mono">THRESHOLD REACHED</span>
          </div>
        </motion.div>
      )}
    </div>
  )
}
