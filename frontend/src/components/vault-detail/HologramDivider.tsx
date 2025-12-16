import { motion } from 'framer-motion'

export default function HologramDivider() {
  return (
    <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 pointer-events-none">
      {/* Main divider line */}
      <motion.div
        className="absolute inset-0 bg-[#3B82F6]"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Flicker effect */}
      <motion.div
        className="absolute inset-0 bg-[#3B82F6]"
        animate={{ opacity: [0, 0.8, 0] }}
        transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 2 }}
      />

      {/* Data packets moving up */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`up-${i}`}
          className="absolute left-1/2 w-1 h-3 bg-[#3B82F6] -translate-x-1/2"
          style={{ filter: 'blur(1px)' }}
          animate={{
            y: ['100%', '-100%'],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 1.3,
            ease: 'linear'
          }}
        />
      ))}

      {/* Data packets moving down */}
      {[...Array(2)].map((_, i) => (
        <motion.div
          key={`down-${i}`}
          className="absolute left-1/2 w-1 h-3 bg-[#D1A954] -translate-x-1/2"
          style={{ filter: 'blur(1px)' }}
          animate={{
            y: ['-100%', '100%'],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            delay: i * 2,
            ease: 'linear'
          }}
        />
      ))}

      {/* Node markers */}
      {[20, 40, 60, 80].map((percent) => (
        <motion.div
          key={percent}
          className="absolute left-1/2 w-2 h-2 bg-[#3B82F6] rounded-full -translate-x-1/2"
          style={{ top: `${percent}%` }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: percent / 100
          }}
        />
      ))}
    </div>
  )
}
