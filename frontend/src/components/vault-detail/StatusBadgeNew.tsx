type VaultStatus = 'created' | 'funding' | 'ready' | 'unlocking' | 'destroyed'

interface StatusBadgeProps {
  status: VaultStatus
}

const statusConfig = {
  created: {
    label: 'Created',
    bg: 'bg-[#0F1317]',
    border: 'border-[#4A90E2]',
    text: 'text-[#4A90E2]',
  },
  funding: {
    label: 'Funding',
    bg: 'bg-[#0F1317]',
    border: 'border-[#3B82F6]',
    text: 'text-[#3B82F6]',
  },
  ready: {
    label: 'Ready',
    bg: 'bg-[#0F1317]',
    border: 'border-[#D1A954]',
    text: 'text-[#D1A954]',
  },
  unlocking: {
    label: 'Unlocking',
    bg: 'bg-[#0F1317]',
    border: 'border-[#F59E0B]',
    text: 'text-[#F59E0B]',
  },
  destroyed: {
    label: 'Destroyed',
    bg: 'bg-[#0F1317]',
    border: 'border-[#EF4444]',
    text: 'text-[#EF4444]',
  },
}

export default function StatusBadgeNew({ status }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${config.bg} ${config.border} ${config.text} font-semibold text-sm`}
    >
      <div className={`w-2 h-2 rounded-full ${config.text.replace('text-', 'bg-')}`} />
      {config.label}
    </div>
  )
}
