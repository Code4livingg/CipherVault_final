import { motion } from 'framer-motion'

type VaultStatus = 'created' | 'funding' | 'ready' | 'unlocking' | 'destroyed'

interface TimelineSectionProps {
  status: VaultStatus
}

interface TimelineStep {
  id: string
  label: string
  icon: string
  activeStatuses: VaultStatus[]
}

const timelineSteps: TimelineStep[] = [
  {
    id: 'created',
    label: 'Vault Created',
    icon: '📝',
    activeStatuses: ['created', 'funding', 'ready', 'unlocking', 'destroyed']
  },
  {
    id: 'funded',
    label: 'Funded',
    icon: '💰',
    activeStatuses: ['funding', 'ready', 'unlocking', 'destroyed']
  },
  {
    id: 'unlock-requested',
    label: 'Unlock Requested',
    icon: '🔓',
    activeStatuses: ['ready', 'unlocking', 'destroyed']
  },
  {
    id: 'destroyed',
    label: 'Vault Destroyed',
    icon: '💥',
    activeStatuses: ['destroyed']
  }
]

export default function TimelineSection({ status }: TimelineSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Timeline</h2>

      <div className="space-y-4">
        {timelineSteps.map((step, index) => {
          const isActive = step.activeStatuses.includes(status)
          const isLast = index === timelineSteps.length - 1

          return (
            <div key={step.id} className="flex gap-4">
              {/* Icon and line */}
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all ${
                    isActive
                      ? 'bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg shadow-blue-500/50'
                      : 'bg-slate-800 border border-slate-700'
                  }`}
                >
                  {step.icon}
                </motion.div>
                {!isLast && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: '100%' }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    className={`w-0.5 flex-1 mt-2 ${
                      isActive ? 'bg-gradient-to-b from-blue-500 to-purple-500' : 'bg-slate-700'
                    }`}
                    style={{ minHeight: '2rem' }}
                  />
                )}
              </div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.1 }}
                className="flex-1 pb-8"
              >
                <p className={`font-semibold ${isActive ? 'text-white' : 'text-slate-500'}`}>
                  {step.label}
                </p>
                {isActive && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                    className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2"
                  />
                )}
              </motion.div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
