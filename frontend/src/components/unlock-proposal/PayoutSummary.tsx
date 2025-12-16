import { motion } from 'framer-motion'
import { useState } from 'react'

interface Recipient {
  address: string
  name?: string
  amount: string
  percentage: number
  targetAsset: string
}

interface PayoutSummaryProps {
  totalBalance: string
  sourceAsset: string
  targetAsset: string
  recipients: Recipient[]
}

export default function PayoutSummary({
  totalBalance,
  sourceAsset,
  targetAsset,
  recipients
}: PayoutSummaryProps) {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address)
    setCopiedAddress(address)
    setTimeout(() => setCopiedAddress(null), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-8"
    >
      <h2 className="text-2xl font-bold text-white mb-4">Payout Summary</h2>

      {/* Total balance */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 mb-6">
        <p className="text-slate-400 text-sm mb-2">Total Vault Balance</p>
        <p className="text-4xl font-bold text-white mb-4">
          {totalBalance} <span className="text-2xl text-slate-400">{sourceAsset}</span>
        </p>

        {/* Asset swap visualization */}
        <div className="flex items-center justify-center gap-4 bg-slate-900/50 rounded-lg p-4">
          <div className="text-center">
            <p className="text-slate-400 text-xs mb-1">From</p>
            <p className="text-white text-lg font-bold">{sourceAsset}</p>
          </div>

          <motion.div
            animate={{ x: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </motion.div>

          <div className="text-center">
            <p className="text-slate-400 text-xs mb-1">To</p>
            <p className="text-white text-lg font-bold">{targetAsset}</p>
          </div>
        </div>

        <div className="mt-3 bg-purple-500/10 border border-purple-500/30 rounded-lg p-2">
          <p className="text-purple-300 text-xs text-center">
            Auto-swap via SideShift on unlock
          </p>
        </div>
      </div>

      {/* Recipients */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white mb-3">Recipients</h3>
        {recipients.map((recipient, index) => (
          <motion.div
            key={recipient.address}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="relative bg-slate-800/30 rounded-xl p-4 border border-slate-700/50"
          >
            {/* Subtle glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl blur opacity-50" />
            
            <div className="relative">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  {recipient.name && (
                    <p className="text-white font-semibold mb-1">{recipient.name}</p>
                  )}
                  <div className="flex items-center gap-2">
                    <p className="text-slate-400 text-sm font-mono break-all">
                      {recipient.address.slice(0, 10)}...{recipient.address.slice(-8)}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleCopy(recipient.address)}
                      className="text-slate-500 hover:text-white transition-colors"
                    >
                      {copiedAddress === recipient.address ? (
                        <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </motion.button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white text-xl font-bold">
                    {recipient.amount} <span className="text-sm text-slate-400">{recipient.targetAsset}</span>
                  </p>
                  <p className="text-slate-500 text-sm">{recipient.percentage}%</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${recipient.percentage}%` }}
                  transition={{ duration: 1, delay: 0.3 + index * 0.1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
