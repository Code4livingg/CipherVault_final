import { motion, AnimatePresence } from 'framer-motion'
import HologramPanel from './HologramPanel'

interface StepKeyHoldersProps {
  data: { holders: string[]; threshold: number }
  updateData: (updates: any) => void
  onNext: () => void
  onBack: () => void
}

export default function StepKeyHolders({ data, updateData, onNext, onBack }: StepKeyHoldersProps) {
  const addHolder = () => {
    updateData({ holders: [...data.holders, ''] })
  }

  const removeHolder = (index: number) => {
    const newHolders = data.holders.filter((_, i) => i !== index)
    updateData({
      holders: newHolders,
      threshold: Math.min(data.threshold, newHolders.length)
    })
  }

  const updateHolder = (index: number, value: string) => {
    const newHolders = [...data.holders]
    newHolders[index] = value
    updateData({ holders: newHolders })
  }

  const canProceed = data.holders.filter(h => h.trim().length > 0).length >= 1 && data.threshold >= 1

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="inline-block mb-4"
        >
          <svg className="w-20 h-20 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </motion.div>
        <h2 className="text-3xl font-bold text-white mb-2 font-heading">Key Holders</h2>
        <p className="text-[#CBD5E1] font-body">Add people who can approve vault access</p>
      </div>

      <HologramPanel>
        <div className="space-y-3">
          <AnimatePresence>
            {data.holders.map((holder, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="relative flex gap-2 items-center bg-[#0A0F14]/50 border border-[#3B82F6]/20 rounded-md p-3"
              >
                {/* Gold node indicator */}
                <div className="w-2 h-2 bg-[#D1A954] rounded-full flex-shrink-0" />
                
                {/* MPC Shard icon */}
                <svg className="w-4 h-4 text-[#3B82F6] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                
                <input
                  type="text"
                  value={holder}
                  onChange={(e) => updateHolder(index, e.target.value)}
                  className="flex-1 bg-transparent text-white border-none focus:outline-none placeholder:text-[#64748B] font-body"
                  placeholder="Email or wallet address"
                />
                
                {data.holders.length > 1 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => removeHolder(index)}
                    className="px-3 py-1 bg-[#0F1317] border border-[#DC2626]/30 text-[#DC2626] rounded hover:border-[#DC2626] transition text-sm"
                  >
                    Remove
                  </motion.button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          <motion.button
            whileHover={{ borderColor: '#3B82F6' }}
            onClick={addHolder}
            className="w-full py-3 bg-[#0F1317] border border-[#1E293B] border-dashed text-[#94A3B8] rounded-md transition flex items-center justify-center gap-2 font-body"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Key Holder
          </motion.button>
        </div>
      </HologramPanel>

      <HologramPanel className="mt-6">
        <label className="block text-[#E2E8F0] mb-3 font-medium text-sm font-body">Approval Threshold</label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="1"
            max={data.holders.length}
            value={data.threshold}
            onChange={(e) => updateData({ threshold: parseInt(e.target.value) })}
            className="flex-1 h-2 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#3B82F6]"
          />
          <span className="text-white font-bold text-lg min-w-[3rem] text-center font-mono">
            {data.threshold} / {data.holders.length}
          </span>
        </div>
        <p className="text-[#94A3B8] text-sm mt-3 font-body">
          Requires <span className="text-[#3B82F6] font-semibold font-mono">{data.threshold}</span> of{' '}
          <span className="text-[#3B82F6] font-semibold font-mono">{data.holders.length}</span> approvals to unlock
        </p>
      </HologramPanel>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 bg-[#0F1317] border border-[#1E293B] text-white rounded-md hover:border-[#3B82F6] transition"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`flex-1 py-3 rounded-md transition ${
            canProceed
              ? 'bg-[#0F1317] border border-[#3B82F6] text-white hover:border-[#60A5FA]'
              : 'bg-[#11161C] border border-[#1E293B] text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
