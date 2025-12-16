import { motion } from 'framer-motion'
import { useState } from 'react'

interface Holder {
  id: string
  name: string
  address?: string
  status: 'pending' | 'approved' | 'rejected'
  timestamp?: string
}

interface HologramKeyChipProps {
  holder: Holder
  isCurrentUser: boolean
  onApprove?: () => void
  onReject?: () => void
  isLoading?: boolean
}

export default function HologramKeyChip({
  holder,
  isCurrentUser,
  onApprove,
  onReject,
  isLoading = false
}: HologramKeyChipProps) {
  const [isHovered, setIsHovered] = useState(false)

  const statusConfig = {
    pending: { color: '#3B82F6', label: 'Pending', glow: false },
    approved: { color: '#D1A954', label: 'Approved', glow: true },
    rejected: { color: '#DC2626', label: 'Rejected', glow: true }
  }

  const config = statusConfig[holder.status]

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative bg-white/[0.02] border border-[#1E293B] rounded-lg p-4 hover:border-[#3B82F6]/30 transition"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.01 }}
    >
      {/* Corner accent */}
      <div
        className="absolute top-0 left-0 w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: config.color }}
      />

      {/* Shimmer effect on hover */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-[#3B82F6]/5 to-transparent rounded-lg"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 0.8 }}
        />
      )}

      <div className="relative flex items-center gap-4">
        {/* Avatar circle */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm border-2"
          style={{
            borderColor: config.color,
            backgroundColor: `${config.color}20`
          }}
        >
          {holder.name.charAt(0).toUpperCase()}
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-white font-body font-medium">{holder.name}</p>
            {isCurrentUser && (
              <span className="text-xs text-[#3B82F6] font-mono bg-[#3B82F6]/10 px-2 py-0.5 rounded">
                YOU
              </span>
            )}
          </div>
          {holder.address && (
            <p className="text-[#94A3B8] text-xs font-mono mt-1">
              {holder.address.slice(0, 16)}...
            </p>
          )}
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2">
          <motion.div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: config.color }}
            animate={
              config.glow
                ? {
                    boxShadow: [
                      `0 0 0 rgba(${config.color}, 0)`,
                      `0 0 8px ${config.color}`,
                      `0 0 0 rgba(${config.color}, 0)`
                    ]
                  }
                : {}
            }
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-sm font-mono" style={{ color: config.color }}>
            {config.label}
          </span>
        </div>
      </div>

      {/* Action buttons for current user */}
      {isCurrentUser && holder.status === 'pending' && (onApprove || onReject) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 pt-4 border-t border-[#1E293B] flex gap-3"
        >
          {onApprove && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onApprove}
              disabled={isLoading}
              className="flex-1 py-2 border border-[#3B82F6] text-white rounded hover:shadow-[0_0_12px_rgba(59,130,246,0.3)] transition font-body text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Approving...' : 'Approve'}
            </motion.button>
          )}
          {onReject && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onReject}
              disabled={isLoading}
              className="px-4 py-2 border border-[#DC2626]/50 text-[#DC2626] rounded hover:border-[#DC2626] transition font-body text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reject
            </motion.button>
          )}
        </motion.div>
      )}

      {/* Approval animation */}
      {holder.status === 'approved' && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div
            className="absolute inset-0 rounded-lg border-2"
            style={{ borderColor: config.color }}
          />
        </motion.div>
      )}

      {/* Rejection shake */}
      {holder.status === 'rejected' && (
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-lg"
          animate={{
            x: [0, -2, 2, -2, 2, 0],
            borderColor: ['#DC2626', '#DC2626', '#DC2626']
          }}
          transition={{ duration: 0.5 }}
        />
      )}
    </motion.div>
  )
}
