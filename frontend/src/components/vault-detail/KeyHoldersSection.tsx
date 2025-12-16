import { motion, AnimatePresence } from 'framer-motion'

interface KeyHolder {
  id: string
  name: string
  approved: boolean
}

interface KeyHoldersSectionProps {
  keyHolders: KeyHolder[]
  threshold: number
  approvedCount: number
}

export default function KeyHoldersSection({
  keyHolders,
  threshold,
  approvedCount
}: KeyHoldersSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Key Holders</h2>

      <div className="space-y-4">
        {/* Summary */}
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <p className="text-slate-400 text-sm mb-1">Approval Progress</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-white">
              {approvedCount} / {threshold}
            </p>
            <div className="flex-1 mx-4">
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(approvedCount / threshold) * 100}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                />
              </div>
            </div>
            <p className="text-slate-400 text-sm">
              {Math.round((approvedCount / threshold) * 100)}%
            </p>
          </div>
        </div>

        {/* Holders list */}
        <div className="space-y-2">
          <AnimatePresence>
            {keyHolders.map((holder, index) => (
              <motion.div
                key={holder.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between bg-slate-800/30 rounded-lg p-4 border border-slate-700/30"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {holder.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-medium">{holder.name}</p>
                    <p className="text-slate-400 text-xs">Key Holder</p>
                  </div>
                </div>
                
                {holder.approved ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    className="flex items-center gap-2 text-green-400"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium">Approved</span>
                  </motion.div>
                ) : (
                  <div className="flex items-center gap-2 text-slate-500">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium">Pending</span>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
