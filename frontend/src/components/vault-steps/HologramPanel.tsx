import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface HologramPanelProps {
  children: ReactNode
  className?: string
}

export default function HologramPanel({ children, className = '' }: HologramPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative bg-[#11161C]/75 border border-[#1E293B] rounded-lg p-6 ${className}`}
      whileHover={{ 
        borderColor: 'rgba(59, 130, 246, 0.3)',
        transition: { duration: 0.2 }
      }}
    >
      {/* Corner dots */}
      <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-[#D1A954] rounded-full opacity-60" />
      <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#D1A954] rounded-full opacity-60" />
      <div className="absolute bottom-0 left-0 w-1.5 h-1.5 bg-[#D1A954] rounded-full opacity-60" />
      <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-[#D1A954] rounded-full opacity-60" />
      
      {/* Subtle shimmer on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-[#3B82F6]/5 to-transparent rounded-lg"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.8 }}
      />
      
      {children}
    </motion.div>
  )
}
