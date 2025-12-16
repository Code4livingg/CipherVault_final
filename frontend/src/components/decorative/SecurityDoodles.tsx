import { motion } from 'framer-motion'

// Floating animation variants
const floatVariants = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
}

const floatVariantsAlt = {
  animate: {
    y: [0, 8, 0],
    transition: {
      duration: 7,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
}

// Key Shard (MPC-style)
export function KeyShard({ className = '' }: { className?: string }) {
  return (
    <motion.svg
      variants={floatVariants}
      animate="animate"
      className={className}
      width="60"
      height="60"
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M30 10 L35 20 L30 30 L25 20 Z"
        stroke="#3B82F6"
        strokeWidth="1"
        opacity="0.1"
      />
      <circle cx="30" cy="20" r="3" fill="#D1A954" opacity="0.12" />
    </motion.svg>
  )
}

// Chain Link
export function ChainLink({ className = '' }: { className?: string }) {
  return (
    <motion.svg
      variants={floatVariantsAlt}
      animate="animate"
      className={className}
      width="80"
      height="40"
      viewBox="0 0 80 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="20" cy="20" rx="12" ry="16" stroke="#3B82F6" strokeWidth="1" opacity="0.08" />
      <ellipse cx="60" cy="20" rx="12" ry="16" stroke="#3B82F6" strokeWidth="1" opacity="0.08" />
      <line x1="32" y1="20" x2="48" y2="20" stroke="#3B82F6" strokeWidth="1" opacity="0.08" />
    </motion.svg>
  )
}

// Crypto Icon (BTC style)
export function BTCDoodle({ className = '' }: { className?: string }) {
  return (
    <motion.svg
      variants={floatVariants}
      animate="animate"
      className={className}
      width="50"
      height="50"
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="25" cy="25" r="20" stroke="#3B82F6" strokeWidth="1" opacity="0.1" />
      <path d="M20 18 L28 18 C30 18 31 19 31 21 C31 23 30 24 28 24 L20 24 Z" stroke="#3B82F6" strokeWidth="1" opacity="0.1" />
      <path d="M20 24 L29 24 C31 24 32 25 32 27 C32 29 31 30 29 30 L20 30 Z" stroke="#3B82F6" strokeWidth="1" opacity="0.1" />
    </motion.svg>
  )
}

// Approval Checkmark
export function ApprovalCheck({ className = '' }: { className?: string }) {
  return (
    <motion.svg
      variants={floatVariantsAlt}
      animate="animate"
      className={className}
      width="50"
      height="50"
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="25" cy="25" r="18" stroke="#D1A954" strokeWidth="1" opacity="0.12" />
      <path d="M15 25 L22 32 L35 18" stroke="#D1A954" strokeWidth="1.5" opacity="0.12" />
    </motion.svg>
  )
}

// Encryption Nodes
export function EncryptionNodes({ className = '' }: { className?: string }) {
  return (
    <motion.svg
      variants={floatVariants}
      animate="animate"
      className={className}
      width="100"
      height="100"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="20" cy="20" r="4" fill="#3B82F6" opacity="0.1" />
      <circle cx="80" cy="20" r="4" fill="#3B82F6" opacity="0.1" />
      <circle cx="50" cy="80" r="4" fill="#D1A954" opacity="0.12" />
      <line x1="20" y1="20" x2="80" y2="20" stroke="#3B82F6" strokeWidth="0.5" opacity="0.08" />
      <line x1="20" y1="20" x2="50" y2="80" stroke="#3B82F6" strokeWidth="0.5" opacity="0.08" />
      <line x1="80" y1="20" x2="50" y2="80" stroke="#3B82F6" strokeWidth="0.5" opacity="0.08" />
    </motion.svg>
  )
}

// Vault Mechanism Circular Lines
export function MechanismCircle({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      width="400"
      height="400"
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="200" cy="200" r="180" stroke="#3B82F6" strokeWidth="0.5" opacity="0.06" />
      <circle cx="200" cy="200" r="150" stroke="#3B82F6" strokeWidth="0.5" opacity="0.08" />
      <circle cx="200" cy="200" r="120" stroke="#3B82F6" strokeWidth="0.5" opacity="0.1" />
      {/* Radial lines */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        const rad = (angle * Math.PI) / 180
        const x1 = 200 + Math.cos(rad) * 120
        const y1 = 200 + Math.sin(rad) * 120
        const x2 = 200 + Math.cos(rad) * 180
        const y2 = 200 + Math.sin(rad) * 180
        return (
          <line
            key={angle}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#3B82F6"
            strokeWidth="0.5"
            opacity="0.06"
          />
        )
      })}
      {/* Gold accent dots */}
      {[0, 90, 180, 270].map((angle) => {
        const rad = (angle * Math.PI) / 180
        const x = 200 + Math.cos(rad) * 150
        const y = 200 + Math.sin(rad) * 150
        return <circle key={angle} cx={x} cy={y} r="3" fill="#D1A954" opacity="0.12" />
      })}
    </svg>
  )
}

// Arrow Flow
export function ArrowFlow({ className = '' }: { className?: string }) {
  return (
    <motion.svg
      variants={floatVariantsAlt}
      animate="animate"
      className={className}
      width="80"
      height="30"
      viewBox="0 0 80 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M5 15 L70 15" stroke="#3B82F6" strokeWidth="1" opacity="0.08" />
      <path d="M65 10 L75 15 L65 20" stroke="#3B82F6" strokeWidth="1" opacity="0.08" />
      <circle cx="20" cy="15" r="2" fill="#D1A954" opacity="0.12" />
      <circle cx="50" cy="15" r="2" fill="#D1A954" opacity="0.12" />
    </motion.svg>
  )
}

// Lock Icon
export function LockDoodle({ className = '' }: { className?: string }) {
  return (
    <motion.svg
      variants={floatVariants}
      animate="animate"
      className={className}
      width="40"
      height="50"
      viewBox="0 0 40 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="10" y="22" width="20" height="20" rx="2" stroke="#3B82F6" strokeWidth="1" opacity="0.1" />
      <path d="M13 22 V15 C13 11 15 8 20 8 C25 8 27 11 27 15 V22" stroke="#3B82F6" strokeWidth="1" opacity="0.1" />
      <circle cx="20" cy="32" r="2" fill="#D1A954" opacity="0.12" />
    </motion.svg>
  )
}
