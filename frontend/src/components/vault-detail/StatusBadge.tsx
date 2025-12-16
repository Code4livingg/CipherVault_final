import { motion } from 'framer-motion'

type VaultStatus = 'created' | 'funding' | 'ready' | 'unlocking' | 'destroyed'

interface StatusBadgeProps {
  status: VaultStatus
}

const statusConfig = {
  created: {
    label: 'Created',
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    icon: '📝'
  },
  funding: {
    label: 'Funding',
    color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    icon: '💰'
  },
  ready: {
    label: 'Ready to Unlock',
    color: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
    icon: '🔓'
  },
  unlocking: {
    label: 'Unlocking',
    color: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
    icon: '⏳'
  },
  destroyed: {
    label: 'Destroyed',
    color: 'bg-red-500/20 text-red-400 border-red-500/50',
    icon: '💥'
  }
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${config.color} font-semibold`}
    >
      <span className="text-lg">{config.icon}</span>
      {config.label}
    </motion.div>
  )
}
