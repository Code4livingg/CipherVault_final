import { motion } from 'framer-motion'

interface KeyHolder {
  id: string
  name: string
  approved: boolean
}

interface MPCNodeNetworkProps {
  keyHolders: KeyHolder[]
  threshold: number
}

export default function MPCNodeNetwork({ keyHolders, threshold }: MPCNodeNetworkProps) {
  const approvedCount = keyHolders.filter(h => h.approved).length
  const isThresholdReached = approvedCount >= threshold

  // Position nodes in a circle
  const nodePositions = keyHolders.map((_, index) => {
    const angle = (index / keyHolders.length) * 2 * Math.PI - Math.PI / 2
    const radius = 140
    return {
      x: 200 + Math.cos(angle) * radius,
      y: 200 + Math.sin(angle) * radius
    }
  })

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <svg width="400" height="400" viewBox="0 0 400 400" className="opacity-40">
        {/* Connection lines */}
        {keyHolders.map((holder, index) => {
          const pos = nodePositions[index]
          return (
            <g key={`lines-${holder.id}`}>
              {/* Line to center */}
              <motion.line
                x1={pos.x}
                y1={pos.y}
                x2="200"
                y2="200"
                stroke={holder.approved ? '#D1A954' : '#3B82F6'}
                strokeWidth="0.5"
                strokeDasharray="2 4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: index * 0.1 }}
              />
              
              {/* Lines to adjacent nodes */}
              {index < keyHolders.length - 1 && (
                <motion.line
                  x1={pos.x}
                  y1={pos.y}
                  x2={nodePositions[index + 1].x}
                  y2={nodePositions[index + 1].y}
                  stroke="#3B82F6"
                  strokeWidth="0.3"
                  strokeOpacity="0.3"
                  strokeDasharray="1 2"
                />
              )}
            </g>
          )
        })}

        {/* Nodes */}
        {keyHolders.map((holder, index) => {
          const pos = nodePositions[index]
          return (
            <g key={holder.id}>
              {/* Outer pulse ring */}
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r="8"
                fill="none"
                stroke={holder.approved ? '#D1A954' : '#3B82F6'}
                strokeWidth="0.5"
                animate={{
                  r: [8, 12, 8],
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
                r="4"
                fill={holder.approved ? '#D1A954' : '#3B82F6'}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1, type: 'spring' }}
              />

              {/* Approval flash */}
              {holder.approved && (
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r="6"
                  fill="none"
                  stroke="#D1A954"
                  strokeWidth="1"
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.8 }}
                />
              )}
            </g>
          )
        })}

        {/* Center node */}
        <motion.circle
          cx="200"
          cy="200"
          r="6"
          fill={isThresholdReached ? '#D1A954' : '#3B82F6'}
          animate={{
            scale: isThresholdReached ? [1, 1.3, 1] : 1
          }}
          transition={{
            duration: 1.5,
            repeat: isThresholdReached ? Infinity : 0
          }}
        />

        {/* Threshold reached flash */}
        {isThresholdReached && (
          <motion.circle
            cx="200"
            cy="200"
            r="10"
            fill="none"
            stroke="#D1A954"
            strokeWidth="2"
            animate={{
              r: [10, 30, 10],
              opacity: [1, 0, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
          />
        )}

        {/* Data packets traveling */}
        {keyHolders.map((holder, index) => {
          if (!holder.approved) return null
          const pos = nodePositions[index]
          return (
            <motion.circle
              key={`packet-${holder.id}`}
              r="1.5"
              fill="#D1A954"
              animate={{
                cx: [pos.x, 200],
                cy: [pos.y, 200],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.5
              }}
            />
          )
        })}
      </svg>
    </div>
  )
}
