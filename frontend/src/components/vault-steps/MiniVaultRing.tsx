import { motion } from 'framer-motion'

interface MiniVaultRingProps {
  active?: boolean
  completed?: boolean
}

export default function MiniVaultRing({ active, completed }: MiniVaultRingProps) {
  const color = completed ? '#D1A954' : active ? '#3B82F6' : '#1E293B'
  
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <motion.svg
        width="60"
        height="60"
        viewBox="0 0 60 60"
        className="opacity-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      >
        <circle
          cx="30"
          cy="30"
          r="25"
          fill="none"
          stroke={color}
          strokeWidth="0.5"
          strokeDasharray="2 4"
        />
      </motion.svg>
    </div>
  )
}
