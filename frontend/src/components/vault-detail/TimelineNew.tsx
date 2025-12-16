import { motion } from 'framer-motion'

type VaultStatus = 'created' | 'funding' | 'ready' | 'unlocking' | 'destroyed'

interface TimelineProps {
  status: VaultStatus
}

const steps = [
  { id: 'created', label: 'Vault Created', statuses: ['created', 'funding', 'ready', 'unlocking', 'destroyed'] },
  { id: 'funding', label: 'Funding', statuses: ['funding', 'ready', 'unlocking', 'destroyed'] },
  { id: 'unlock', label: 'Unlock Requested', statuses: ['ready', 'unlocking', 'destroyed'] },
  { id: 'executed', label: 'Executed', statuses: ['destroyed'] },
]

export default function TimelineNew({ status }: TimelineProps) {
  return (
    <div className="bg-[#11161C] border border-[#1E293B] rounded-lg p-6">
      <h3 className="text-white font-semibold mb-6">Timeline</h3>
      
      {/* Desktop: Horizontal */}
      <div className="hidden md:flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = step.statuses.includes(status)
          const isCurrent = index === steps.findIndex(s => s.statuses.includes(status))
          
          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                    isCompleted
                      ? step.id === 'executed'
                        ? 'border-[#D1A954] bg-[#D1A954]/10'
                        : 'border-[#D1A954] bg-[#D1A954]/10'
                      : isCurrent
                      ? 'border-[#3B82F6] bg-[#3B82F6]/10'
                      : 'border-[#1E293B] bg-[#0F1317]'
                  }`}
                >
                  {isCompleted && (
                    <svg className="w-5 h-5 text-[#D1A954]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {!isCompleted && isCurrent && (
                    <div className="w-3 h-3 rounded-full bg-[#3B82F6]" />
                  )}
                </motion.div>
                <p className={`mt-2 text-xs font-medium ${
                  isCompleted ? 'text-[#D1A954]' : isCurrent ? 'text-[#3B82F6]' : 'text-[#64748B]'
                }`}>
                  {step.label}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${
                  isCompleted ? 'bg-[#D1A954]' : 'bg-[#1E293B]'
                }`} />
              )}
            </div>
          )
        })}
      </div>

      {/* Mobile: Vertical */}
      <div className="md:hidden space-y-4">
        {steps.map((step, index) => {
          const isCompleted = step.statuses.includes(status)
          const isCurrent = index === steps.findIndex(s => s.statuses.includes(status))
          
          return (
            <div key={step.id} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                    isCompleted
                      ? 'border-[#D1A954] bg-[#D1A954]/10'
                      : isCurrent
                      ? 'border-[#3B82F6] bg-[#3B82F6]/10'
                      : 'border-[#1E293B] bg-[#0F1317]'
                  }`}
                >
                  {isCompleted && (
                    <svg className="w-4 h-4 text-[#D1A954]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {!isCompleted && isCurrent && (
                    <div className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-0.5 h-8 mt-1 ${
                    isCompleted ? 'bg-[#D1A954]' : 'bg-[#1E293B]'
                  }`} />
                )}
              </div>
              <div className="flex-1 pt-1">
                <p className={`text-sm font-medium ${
                  isCompleted ? 'text-[#D1A954]' : isCurrent ? 'text-[#3B82F6]' : 'text-[#64748B]'
                }`}>
                  {step.label}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
