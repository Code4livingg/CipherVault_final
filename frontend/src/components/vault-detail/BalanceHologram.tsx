import { motion } from 'framer-motion'

interface BalanceHologramProps {
  amount: string
  asset: string
  autoSwap: boolean
  targetAsset?: string
}

export default function BalanceHologram({ amount, asset, autoSwap, targetAsset }: BalanceHologramProps) {
  return (
    <div className="relative">
      {/* 3D coin rotating behind */}
      <motion.div
        className="absolute -top-8 -right-8 opacity-10"
        animate={{ rotateY: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      >
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#3B82F6" strokeWidth="0.5" />
          <path d="M12 6v12M8 9h8M8 15h8" stroke="#3B82F6" strokeWidth="0.5" />
        </svg>
      </motion.div>

      {/* Hologram frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-[#0A0F14]/30 backdrop-blur-sm border border-[#3B82F6]/30 rounded-lg p-6"
      >
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#D1A954]" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#D1A954]" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#D1A954]" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#D1A954]" />

        {/* Scan line effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-[#3B82F6]/5 to-transparent"
          animate={{ y: ['-100%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />

        <div className="relative">
          <p className="text-[#94A3B8] text-xs font-body mb-2">VAULT BALANCE</p>
          
          <motion.div
            className="flex items-baseline gap-2 mb-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-4xl font-bold text-white font-mono">{amount}</span>
            <span className="text-xl text-[#3B82F6] font-mono">{asset}</span>
          </motion.div>

          {/* Auto-swap indicator */}
          {autoSwap && targetAsset && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 mt-3 text-sm"
            >
              <span className="text-[#94A3B8] font-body">Auto-swap to</span>
              <motion.svg
                className="w-4 h-4 text-[#3B82F6]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </motion.svg>
              <span className="text-[#D1A954] font-mono font-semibold">{targetAsset}</span>
            </motion.div>
          )}

          {/* Live update indicator */}
          <div className="flex items-center gap-2 mt-4">
            <motion.div
              className="w-2 h-2 bg-[#10B981] rounded-full"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-[#10B981] text-xs font-mono">LIVE</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
