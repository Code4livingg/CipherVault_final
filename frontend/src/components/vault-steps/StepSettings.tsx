import { motion } from 'framer-motion'
import { useState } from 'react'
import HologramPanel from './HologramPanel'

interface StepSettingsProps {
  data: { expiry: string; autoSwap: boolean }
  updateData: (updates: any) => void
  onNext: () => void
  onBack: () => void
}

const expiryOptions = [
  { value: '24h', label: '24 Hours' },
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: 'custom', label: 'Custom' }
]

export default function StepSettings({ data, updateData, onNext, onBack }: StepSettingsProps) {
  const [showCustom, setShowCustom] = useState(false)

  const handleExpiryChange = (value: string) => {
    if (value === 'custom') {
      setShowCustom(true)
    } else {
      setShowCustom(false)
      updateData({ expiry: value })
    }
  }

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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </motion.div>
        <h2 className="text-3xl font-bold text-white mb-2 font-heading">Vault Settings</h2>
        <p className="text-[#CBD5E1] font-body">Configure expiry and auto-swap options</p>
      </div>

      <HologramPanel>
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            {/* Mini VaultRing behind icon */}
            <div className="relative">
              <motion.svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                className="opacity-15 absolute"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              >
                <circle cx="20" cy="20" r="15" fill="none" stroke="#3B82F6" strokeWidth="0.5" strokeDasharray="1 2" />
              </motion.svg>
              <svg className="w-6 h-6 text-[#3B82F6] relative" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <label className="block text-[#E2E8F0] font-medium text-sm font-body">Expiry Time</label>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {expiryOptions.map((option) => (
              <motion.button
                key={option.value}
                whileHover={{ borderColor: '#3B82F6' }}
                onClick={() => handleExpiryChange(option.value)}
                className={`py-3 px-4 rounded-md font-medium transition font-body ${
                  data.expiry === option.value
                    ? 'bg-[#0F1317] border border-[#3B82F6] text-white'
                    : 'bg-[#0F1317] border border-[#1E293B] text-[#94A3B8]'
                }`}
              >
                {option.label}
              </motion.button>
            ))}
          </div>
          {showCustom && (
            <motion.input
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              type="text"
              placeholder="e.g., 14d, 90d"
              className="w-full bg-[#0F1317] text-white border border-[#1E293B] rounded-md px-4 py-3 placeholder:text-[#64748B] focus:border-[#3B82F6] focus:outline-none font-body"
              onChange={(e) => updateData({ expiry: e.target.value })}
            />
          )}
          <p className="text-[#94A3B8] text-sm font-body">
            Vault will self-destruct after this period if not accessed
          </p>
        </div>
      </HologramPanel>

      <HologramPanel>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <label className="block text-[#E2E8F0] font-medium mb-1 text-sm font-body">Auto-Swap on Unlock</label>
            <p className="text-[#94A3B8] text-sm font-body">
              Automatically convert funds to preferred currency when vault is unlocked
            </p>
          </div>
          <button
            onClick={() => updateData({ autoSwap: !data.autoSwap })}
            className={`relative w-14 h-8 rounded-full transition-colors ${
              data.autoSwap ? 'bg-[#3B82F6]' : 'bg-[#1E293B]'
            }`}
          >
            <motion.div
              animate={{ x: data.autoSwap ? 24 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm"
            />
          </button>
        </div>
      </HologramPanel>

      <div className="bg-[#0A0F14]/50 border border-[#3B82F6]/20 rounded-md p-4">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-[#3B82F6] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-[#94A3B8] text-sm font-body">
            These settings can be modified later by key holders with majority approval
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 bg-[#0F1317] border border-[#1E293B] text-white rounded-md hover:border-[#3B82F6] transition"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 py-3 bg-[#0F1317] border border-[#3B82F6] text-white rounded-md hover:border-[#60A5FA] transition"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
