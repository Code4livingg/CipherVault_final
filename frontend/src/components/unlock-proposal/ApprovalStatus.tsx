import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface KeyHolder {
  id: string
  name: string
  approved: boolean
  timestamp?: string
}

interface ApprovalStatusProps {
  keyHolders: KeyHolder[]
  threshold: number
  approvedCount: number
  expiresAt: string
}

export default function ApprovalStatus({
  keyHolders,
  threshold,
  approvedCount,
  expiresAt
}: ApprovalStatusProps) {
  const [timeRemaining, setTimeRemaining] = useState('')

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime()
      const expiry = new Date(expiresAt).getTime()
      const distance = expiry - now

      if (distance < 0) {
        setTimeRemaining('Expired')
        return
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))

      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h`)
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m`)
      } else {
        setTimeRemaining(`${minutes}m`)
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [expiresAt])

  const isThresholdReached = approvedCount >= threshold

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mb-8"
    >
      <h2 className="text-2xl font-bold text-white mb-4">Approval Status</h2>

      {/* Progress summary */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-slate-400 text-sm mb-1">Approvals Collected</p>
            <p className="text-3xl font-bold text-white">
              {approvedCount} / {threshold}
            </p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-sm mb-1">Expires In</p>
            <p className="text-xl font-bold text-white">{timeRemaining}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative">
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(approvedCount / threshold) * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-full ${
                isThresholdReached
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                  : 'bg-gradient-to-r from-purple-500 to-blue-500'
              }`}
            />
          </div>
          {isThresholdReached && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 right-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
            >
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          )}
        </div>

        {isThresholdReached && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-green-500/10 border border-green-500/30 rounded-lg p-3"
          >
            <p className="text-green-300 text-sm text-center font-medium">
              ✓ Threshold reached! Proposal can be executed
            </p>
          </motion.div>
        )}
      </div>

      {/* Key holders list */}
      <div className="space-y-2">
        {keyHolders.map((holder, index) => (
          <motion.div
            key={holder.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="flex items-center justify-between bg-slate-800/30 rounded-lg p-4 border border-slate-700/30"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                holder.approved
                  ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                  : 'bg-gradient-to-br from-slate-600 to-slate-700'
              }`}>
                {holder.approved ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  holder.name.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <p className="text-white font-medium">{holder.name}</p>
                {holder.timestamp && (
                  <p className="text-slate-500 text-xs">
                    {new Date(holder.timestamp).toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            {holder.approved ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                className="flex items-center gap-2 text-green-400"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium">Approved</span>
              </motion.div>
            ) : (
              <div className="flex items-center gap-2 text-slate-500">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium">Pending</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
