import { motion } from 'framer-motion'

export default function CinematicBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Security grid */}
      <div className="absolute inset-0 opacity-[0.015]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Drifting circuit paths */}
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          x: [0, 20, 0],
          y: [0, -15, 0]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear'
        }}
      >
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M10,20 L30,20 L30,40 L50,40" stroke="#3B82F6" strokeWidth="0.1" fill="none" />
          <path d="M90,30 L70,30 L70,60 L50,60" stroke="#3B82F6" strokeWidth="0.1" fill="none" />
          <path d="M10,80 L25,80 L25,50 L45,50" stroke="#D1A954" strokeWidth="0.1" fill="none" />
          <circle cx="30" cy="20" r="0.3" fill="#3B82F6" />
          <circle cx="50" cy="40" r="0.3" fill="#3B82F6" />
          <circle cx="25" cy="80" r="0.3" fill="#D1A954" />
        </svg>
      </motion.div>

      {/* Floating data nodes */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-[#3B82F6] rounded-full"
          style={{
            left: `${15 + i * 12}%`,
            top: `${20 + (i % 3) * 25}%`
          }}
          animate={{
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3
          }}
        />
      ))}

      {/* Floating 3D crypto icons */}
      <motion.div
        className="absolute top-1/4 left-1/4 opacity-5"
        animate={{
          y: [0, -30, 0],
          rotate: [0, 10, 0]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
          <path
            d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.548v-.002z"
            stroke="#3B82F6"
            strokeWidth="0.5"
          />
        </svg>
      </motion.div>

      <motion.div
        className="absolute top-2/3 right-1/4 opacity-5"
        animate={{
          y: [0, 25, 0],
          rotate: [0, -8, 0]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2
        }}
      >
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
            stroke="#D1A954"
            strokeWidth="0.5"
          />
        </svg>
      </motion.div>

      <motion.div
        className="absolute bottom-1/3 left-1/3 opacity-5"
        animate={{
          y: [0, -20, 0],
          x: [0, 15, 0]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 4
        }}
      >
        <svg width="70" height="70" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"
            stroke="#3B82F6"
            strokeWidth="0.5"
          />
        </svg>
      </motion.div>
    </div>
  )
}
