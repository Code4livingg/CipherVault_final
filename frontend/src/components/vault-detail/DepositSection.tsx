import { motion } from 'framer-motion'
import { useState } from 'react'

interface DepositSectionProps {
  totalDeposits: string
  assetType: string
  depositAddress: string
  supportedChains: string[]
}

export default function DepositSection({
  totalDeposits,
  assetType,
  depositAddress,
  supportedChains
}: DepositSectionProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(depositAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Deposits</h2>

      <div className="space-y-6">
        {/* Total deposits */}
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <p className="text-slate-400 text-sm mb-1">Total Deposits</p>
          <p className="text-3xl font-bold text-white">
            {totalDeposits} <span className="text-xl text-slate-400">{assetType}</span>
          </p>
        </div>

        {/* QR Code placeholder */}
        <div className="flex justify-center">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="w-48 h-48 bg-white rounded-xl p-4 flex items-center justify-center"
          >
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <rect x="0" y="0" width="20" height="20" fill="#000" />
              <rect x="25" y="0" width="15" height="15" fill="#000" />
              <rect x="45" y="0" width="10" height="10" fill="#000" />
              <rect x="60" y="0" width="20" height="20" fill="#000" />
              <rect x="85" y="0" width="15" height="15" fill="#000" />
              <rect x="0" y="25" width="15" height="15" fill="#000" />
              <rect x="20" y="25" width="10" height="10" fill="#000" />
              <rect x="35" y="25" width="20" height="20" fill="#000" />
              <rect x="60" y="25" width="15" height="15" fill="#000" />
              <rect x="80" y="25" width="20" height="20" fill="#000" />
              <rect x="0" y="45" width="10" height="10" fill="#000" />
              <rect x="15" y="45" width="20" height="20" fill="#000" />
              <rect x="40" y="45" width="15" height="15" fill="#000" />
              <rect x="60" y="45" width="10" height="10" fill="#000" />
              <rect x="75" y="45" width="25" height="25" fill="#000" />
              <rect x="0" y="60" width="20" height="20" fill="#000" />
              <rect x="25" y="60" width="15" height="15" fill="#000" />
              <rect x="45" y="60" width="10" height="10" fill="#000" />
              <rect x="60" y="60" width="20" height="20" fill="#000" />
              <rect x="85" y="60" width="15" height="15" fill="#000" />
              <rect x="0" y="85" width="15" height="15" fill="#000" />
              <rect x="20" y="85" width="10" height="10" fill="#000" />
              <rect x="35" y="85" width="20" height="20" fill="#000" />
              <rect x="60" y="85" width="15" height="15" fill="#000" />
              <rect x="80" y="85" width="20" height="20" fill="#000" />
            </svg>
          </motion.div>
        </div>

        {/* Deposit address */}
        <div className="space-y-2">
          <p className="text-slate-400 text-sm">Deposit Address</p>
          <div className="flex gap-2">
            <div className="flex-1 bg-slate-800/50 rounded-lg px-4 py-3 border border-slate-700/50">
              <p className="text-white font-mono text-sm break-all">{depositAddress}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopy}
              className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                copied
                  ? 'bg-green-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {copied ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </motion.button>
          </div>
        </div>

        {/* Supported chains */}
        <div>
          <p className="text-slate-400 text-sm mb-2">Supported Chains</p>
          <div className="flex flex-wrap gap-2">
            {supportedChains.map((chain) => (
              <span
                key={chain}
                className="px-3 py-1 bg-slate-800/50 text-slate-300 rounded-full text-sm border border-slate-700/50"
              >
                {chain}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
