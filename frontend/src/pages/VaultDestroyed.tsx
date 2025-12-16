import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import GlowOrb from '../components/GlowOrb'

export default function VaultDestroyed() {
  const navigate = useNavigate()

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0A0A0F] via-[#0F0F14] to-[#14141A] overflow-hidden flex items-center justify-center">
      {/* Ambient orbs */}
      <GlowOrb className="top-1/4 left-1/4" color="purple" />
      <GlowOrb className="bottom-1/3 right-1/4" color="blue" delay={1.5} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 text-center px-4 max-w-2xl"
      >
        {/* Animated icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="mb-8"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-block text-8xl"
          >
            💥
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-5xl font-bold text-white mb-4"
        >
          Vault Destroyed
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg md:text-xl text-slate-300 mb-8"
        >
          The vault has been successfully unlocked and destroyed. All funds have been distributed to the recipients.
        </motion.p>

        {/* Success indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 mb-8"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3 text-green-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold">Funds Swapped</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-green-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold">Distributed to Recipients</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-green-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold">Vault Data Erased</span>
            </div>
          </div>
        </motion.div>

        {/* Action button */}
        <div className="flex gap-4 justify-center">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-lg font-semibold rounded-xl shadow-lg shadow-blue-500/30 transition-all"
          >
            Create New Vault
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
