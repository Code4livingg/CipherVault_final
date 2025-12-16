import { motion } from 'framer-motion'

const holograms = [
  {
    id: 1,
    label: 'Multi-Party Approval',
    position: { top: '15%', left: '8%' },
    delay: 0.2
  },
  {
    id: 2,
    label: 'Auto-Swaps via SideShift',
    position: { top: '25%', right: '10%' },
    delay: 0.4
  },
  {
    id: 3,
    label: 'Self-Destructing Vault',
    position: { bottom: '20%', left: '12%' },
    delay: 0.6
  },
  {
    id: 4,
    label: 'Encrypted Architecture',
    position: { bottom: '30%', right: '8%' },
    delay: 0.8
  },
  {
    id: 5,
    label: 'Distributed Keyholders',
    position: { top: '45%', left: '5%' },
    delay: 1.0
  }
]

export default function FloatingHolograms() {
  return (
    <div className="absolute inset-0 pointer-events-none hidden lg:block" style={{ zIndex: 3 }}>
      {holograms.map((hologram) => (
        <motion.div
          key={hologram.id}
          className="absolute"
          style={hologram.position}
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            y: [0, -8, 0]
          }}
          transition={{
            opacity: { duration: 0.8, delay: hologram.delay },
            y: {
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: hologram.delay
            }
          }}
        >
          <div className="relative w-48 h-20 bg-[#0A0F14]/40 backdrop-blur-sm border border-[#3B82F6]/30 rounded-md">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#3B82F6]" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#3B82F6]" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#3B82F6]" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#3B82F6]" />
            
            {/* Glowing corner dots */}
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-[#3B82F6] rounded-full opacity-60 blur-[2px]" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#3B82F6] rounded-full opacity-60 blur-[2px]" />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#3B82F6] rounded-full opacity-60 blur-[2px]" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#3B82F6] rounded-full opacity-60 blur-[2px]" />
            
            {/* Content */}
            <div className="flex items-center justify-center h-full px-4">
              <p className="text-[#CBD5E1] text-xs font-body text-center leading-tight">
                {hologram.label}
              </p>
            </div>
            
            {/* Scan line effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-[#3B82F6]/10 to-transparent"
              animate={{
                y: ['-100%', '100%']
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
                delay: hologram.delay
              }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  )
}
