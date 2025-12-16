import { motion } from 'framer-motion'

interface GlowOrbProps {
  className?: string
  color?: 'blue' | 'purple' | 'cyan'
  delay?: number
}

export default function GlowOrb({ className = '', color = 'blue', delay = 0 }: GlowOrbProps) {
  const colors = {
    blue: 'bg-blue-500/20',
    purple: 'bg-purple-500/20',
    cyan: 'bg-cyan-500/20'
  }

  return (
    <motion.div
      className={`absolute w-96 h-96 rounded-full blur-3xl ${colors[color]} ${className}`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
        delay
      }}
    />
  )
}
