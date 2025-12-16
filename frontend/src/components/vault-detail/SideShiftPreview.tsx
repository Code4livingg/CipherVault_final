import { motion } from 'framer-motion'

interface SideShiftPreviewProps {
  depositAsset: string
  targetAsset: string
}

export default function SideShiftPreview({ depositAsset, targetAsset }: SideShiftPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-blue-500/30 p-6 overflow-hidden"
    >
      {/* Glowing border animation */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl blur opacity-20 animate-pulse" />
      
      <div className="relative">
        <h2 className="text-xl font-bold text-white mb-4">Auto-Swap Preview</h2>
        
        <p className="text-slate-400 text-sm mb-6">
          On unlock, all funds will auto-swap into <span className="text-white font-semibold">{targetAsset}</span> via SideShift
        </p>

        {/* Asset swap visualization */}
        <div className="flex items-center justify-center gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex-1 bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 text-center"
          >
            <p className="text-slate-400 text-xs mb-1">From</p>
            <p className="text-white text-xl font-bold">{depositAsset}</p>
          </motion.div>

          <motion.div
            animate={{ x: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex-shrink-0"
          >
            <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex-1 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl p-4 border border-blue-500/50 text-center"
          >
            <p className="text-slate-400 text-xs mb-1">To</p>
            <p className="text-white text-xl font-bold">{targetAsset}</p>
          </motion.div>
        </div>

        <div className="mt-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
          <p className="text-blue-300 text-xs text-center">
            Powered by SideShift • Best rates guaranteed
          </p>
        </div>
      </div>
    </motion.div>
  )
}
