import { motion } from 'framer-motion'
import HologramPanel from './HologramPanel'

interface StepDetailsProps {
  data: { name: string; description: string }
  updateData: (updates: any) => void
  onNext: () => void
}

export default function StepDetails({ data, updateData, onNext }: StepDetailsProps) {
  const canProceed = data.name.trim().length > 0

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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </motion.div>
        <h2 className="text-3xl font-bold text-white mb-2 font-heading">Vault Details</h2>
        <p className="text-[#CBD5E1] font-body">Give your vault a name and description</p>
      </div>

      <HologramPanel>
        <div className="space-y-4">
          <div>
            <label className="block text-[#E2E8F0] mb-2 font-medium text-sm font-body">Vault Name *</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => updateData({ name: e.target.value })}
              className="w-full bg-[#0F1317] text-white border border-[#1E293B] rounded-md px-4 py-3 placeholder:text-[#64748B] focus:border-[#3B82F6] focus:outline-none transition-colors font-body"
              placeholder="e.g., Emergency Fund, Team Treasury"
            />
          </div>

          <div>
            <label className="block text-[#E2E8F0] mb-2 font-medium text-sm font-body">Description (Optional)</label>
            <textarea
              value={data.description}
              onChange={(e) => updateData({ description: e.target.value })}
              className="w-full bg-[#0F1317] text-white border border-[#1E293B] rounded-md px-4 py-3 placeholder:text-[#64748B] focus:border-[#3B82F6] focus:outline-none resize-none transition-colors font-body"
              placeholder="What is this vault for?"
              rows={3}
            />
          </div>
        </div>
      </HologramPanel>

      <button
        onClick={onNext}
        disabled={!canProceed}
        className={`w-full py-3 rounded-md transition ${
          canProceed
            ? 'bg-[#0F1317] border border-[#3B82F6] text-white hover:border-[#60A5FA]'
            : 'bg-[#11161C] border border-[#1E293B] text-gray-500 cursor-not-allowed'
        }`}
      >
        Continue
      </button>
    </div>
  )
}
