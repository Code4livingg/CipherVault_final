import { motion } from 'framer-motion'

interface StepReviewProps {
  data: {
    name: string
    description: string
    holders: string[]
    threshold: number
    expiry: string
    autoSwap: boolean
  }
  onCreate: () => void
  onBack: () => void
  isCreating?: boolean
  error?: string | null
}

export default function StepReview({ data, onCreate, onBack, isCreating, error }: StepReviewProps) {
  const expiryLabels: Record<string, string> = {
    '24h': '24 Hours',
    '7d': '7 Days',
    '30d': '30 Days'
  }

  const validHolders = data.holders.filter(h => h.trim().length > 0)

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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </motion.div>
        <h2 className="text-3xl font-bold text-white mb-2 font-heading">Review & Create</h2>
        <p className="text-[#CBD5E1] font-body">Confirm your vault configuration</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Vault Name */}
        <div className="bg-[#0F1317] rounded-md p-4 border border-[#1E293B]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[#94A3B8] text-sm mb-1">Vault Name</p>
              <p className="text-white text-lg font-semibold">{data.name}</p>
              {data.description && (
                <p className="text-[#94A3B8] text-sm mt-2">{data.description}</p>
              )}
            </div>
            <svg className="w-6 h-6 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>

        {/* Key Holders */}
        <div className="bg-[#0F1317] rounded-md p-4 border border-[#1E293B]">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-[#94A3B8] text-sm mb-1">Key Holders</p>
              <p className="text-white text-lg font-semibold">{validHolders.length} Holders</p>
            </div>
            <svg className="w-6 h-6 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="bg-[#0F1317] border border-[#3B82F6]/30 rounded px-3 py-2">
            <p className="text-[#94A3B8] text-sm">
              Requires <span className="font-bold text-white">{data.threshold} of {validHolders.length}</span> approvals
            </p>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-[#0F1317] rounded-md p-4 border border-[#1E293B]">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-[#94A3B8] text-sm mb-1">Settings</p>
            </div>
            <svg className="w-6 h-6 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[#94A3B8] text-sm">Expiry</span>
              <span className="text-white font-medium">{expiryLabels[data.expiry] || data.expiry}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#94A3B8] text-sm">Auto-Swap</span>
              <span className={`font-medium ${data.autoSwap ? 'text-[#10B981]' : 'text-[#94A3B8]'}`}>
                {data.autoSwap ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0F1317] border border-[#DC2626] rounded-md p-4 mb-4"
        >
          <p className="text-[#DC2626] text-sm">{error}</p>
        </motion.div>
      )}

      <div className="flex gap-3 pt-4">
        <button
          onClick={onBack}
          disabled={isCreating}
          className="flex-1 py-3 bg-[#0F1317] border border-[#1E293B] text-white rounded-md hover:border-[#3B82F6] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <button
          onClick={onCreate}
          disabled={isCreating}
          className="flex-1 py-3 bg-[#0F1317] border border-[#D1A954] text-white rounded-md hover:border-[#E5C16E] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreating ? 'Creating...' : 'Create Vault'}
        </button>
      </div>
    </div>
  )
}
