import { motion } from 'framer-motion'

const nodes = [
  { id: 1, x: 20, y: 30, delay: 0 },
  { id: 2, x: 80, y: 25, delay: 0.3 },
  { id: 3, x: 15, y: 70, delay: 0.6 },
  { id: 4, x: 85, y: 75, delay: 0.9 },
  { id: 5, x: 50, y: 50, delay: 1.2 }
]

const connections = [
  { from: 1, to: 2 },
  { from: 1, to: 5 },
  { from: 2, to: 4 },
  { from: 3, to: 5 },
  { from: 4, to: 5 },
  { from: 3, to: 1 }
]

export default function ApprovalNetwork() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-30 hidden xl:block" style={{ zIndex: 0 }}>
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Connection lines */}
        {connections.map((conn, idx) => {
          const fromNode = nodes.find(n => n.id === conn.from)
          const toNode = nodes.find(n => n.id === conn.to)
          if (!fromNode || !toNode) return null

          return (
            <motion.line
              key={`line-${idx}`}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke="#3B82F6"
              strokeWidth="0.1"
              strokeDasharray="1 2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.4 }}
              transition={{
                duration: 2,
                delay: idx * 0.2,
                ease: 'easeInOut'
              }}
            />
          )
        })}

        {/* Animated data packets */}
        {connections.map((conn, idx) => {
          const fromNode = nodes.find(n => n.id === conn.from)
          const toNode = nodes.find(n => n.id === conn.to)
          if (!fromNode || !toNode) return null

          return (
            <motion.circle
              key={`packet-${idx}`}
              r="0.3"
              fill="#D1A954"
              initial={{ cx: fromNode.x, cy: fromNode.y, opacity: 0 }}
              animate={{
                cx: [fromNode.x, toNode.x],
                cy: [fromNode.y, toNode.y],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 3,
                delay: idx * 0.5,
                repeat: Infinity,
                ease: 'linear'
              }}
            />
          )
        })}

        {/* Network nodes */}
        {nodes.map((node) => (
          <g key={node.id}>
            {/* Outer pulse ring */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="1.5"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="0.1"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [1, 2, 1],
                opacity: [0.6, 0, 0.6]
              }}
              transition={{
                duration: 2,
                delay: node.delay,
                repeat: Infinity,
                ease: 'easeOut'
              }}
            />
            
            {/* Node core */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="0.5"
              fill="#3B82F6"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.5,
                delay: node.delay,
                ease: 'easeOut'
              }}
            />
            
            {/* Inner glow */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="0.8"
              fill="rgba(59, 130, 246, 0.3)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{
                duration: 2,
                delay: node.delay + 0.5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          </g>
        ))}
      </svg>

      {/* Corner network indicators */}
      <div className="absolute top-8 right-8">
        <motion.div
          className="flex items-center gap-2 bg-[#0A0F14]/60 backdrop-blur-sm border border-[#3B82F6]/20 rounded px-3 py-1.5"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <motion.div
            className="w-2 h-2 rounded-full bg-[#10B981]"
            animate={{
              opacity: [1, 0.3, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
          <span className="text-[#CBD5E1] text-xs font-mono">MPC Network Active</span>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-8">
        <motion.div
          className="flex items-center gap-2 bg-[#0A0F14]/60 backdrop-blur-sm border border-[#D1A954]/20 rounded px-3 py-1.5"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
        >
          <motion.div
            className="w-2 h-2 rounded-full bg-[#D1A954]"
            animate={{
              opacity: [1, 0.3, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.5
            }}
          />
          <span className="text-[#CBD5E1] text-xs font-mono">5 Nodes Connected</span>
        </motion.div>
      </div>
    </div>
  )
}
