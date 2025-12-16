import { motion } from 'framer-motion'
import { useState } from 'react'
import { useToast } from '../../contexts/ToastContext'
import { OrgRole } from '../../types/organization'
import { getRoleColor, getRoleLabel, getRoleDescription } from '../../security/roles'

interface InviteMemberPanelProps {
  orgId: string
  onClose: () => void
  onInviteSent: () => void
}

export default function InviteMemberPanel({ onClose, onInviteSent }: InviteMemberPanelProps) {
  const { success, error } = useToast()
  const [email, setEmail] = useState('')
  const [walletAddress, setWalletAddress] = useState('')
  const [selectedRole, setSelectedRole] = useState<OrgRole>('SIGNER')
  const [sending, setSending] = useState(false)

  const roles: OrgRole[] = ['ADMIN', 'SIGNER', 'AUDITOR']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email && !walletAddress) {
      error('Please provide email or wallet address')
      return
    }

    setSending(true)
    try {
      // TODO: API call to send invite
      // await sendInvite({ orgId, email, walletAddress, role: selectedRole })
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      success('Invite sent successfully!')
      onInviteSent()
      onClose()
    } catch (err) {
      error('Failed to send invite')
    } finally {
      setSending(false)
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      
      <motion.div
        className="relative w-full max-w-lg bg-[rgba(17,22,28,0.98)] backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6 shadow-2xl"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Invite Member</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="member@example.com"
              className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition"
            />
          </div>

          {/* Wallet Address */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Wallet Address (optional)
            </label>
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="0x..."
              className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition"
            />
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Role
            </label>
            <div className="space-y-2">
              {roles.map((role) => (
                <motion.button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`w-full p-4 rounded-lg border-2 transition text-left ${
                    selectedRole === role
                      ? 'border-current bg-current/10'
                      : 'border-gray-700 bg-white/5 hover:border-gray-600'
                  }`}
                  style={{
                    borderColor: selectedRole === role ? getRoleColor(role) : undefined,
                    color: selectedRole === role ? getRoleColor(role) : '#9CA3AF'
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold">{getRoleLabel(role)}</span>
                    {selectedRole === role && <span>✓</span>}
                  </div>
                  <p className="text-xs text-gray-400">{getRoleDescription(role)}</p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-white/5 border border-gray-700 rounded-lg text-gray-300 font-semibold hover:bg-white/10 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={sending}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition disabled:opacity-50"
            >
              {sending ? 'Sending...' : 'Send Invite'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
