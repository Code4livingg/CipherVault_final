import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import GlowOrb from '../components/GlowOrb'
import ApprovalStatus from '../components/unlock-proposal/ApprovalStatus'
import PayoutSummary from '../components/unlock-proposal/PayoutSummary'
import { getVault, getProposal, approveProposal, executeProposal, handleApiError, type Vault, type UnlockProposal as ProposalType } from '../lib/api'

export default function UnlockProposal() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [vaultData, setVaultData] = useState<Vault | null>(null)
  const [proposalData, setProposalData] = useState<ProposalType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [approving, setApproving] = useState(false)
  const [executing, setExecuting] = useState(false)
  
  // Mock current user ID - in production, get from auth
  const currentUserId = 'holder-3'

  const fetchData = async () => {
    if (!id) return

    try {
      const [vault, proposal] = await Promise.all([
        getVault(id),
        getProposal(id).catch(() => null) // Proposal might not exist yet
      ])
      
      setVaultData(vault)
      setProposalData(proposal)
      setError(null)
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    
    // Poll every 7 seconds for updates
    const interval = setInterval(fetchData, 7000)
    
    return () => clearInterval(interval)
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0F] via-[#0F0F14] to-[#14141A] flex items-center justify-center">
        <div className="text-white text-xl">Loading proposal...</div>
      </div>
    )
  }

  if (error || !vaultData || !proposalData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0F] via-[#0F0F14] to-[#14141A] flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 max-w-md">
          <p className="text-red-300">{error || 'Proposal not found'}</p>
          <button
            onClick={() => navigate(`/vault/${id}`)}
            className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all"
          >
            Back to Vault
          </button>
        </div>
      </div>
    )
  }

  // Map proposal approvals to key holders
  const keyHoldersWithApprovals = vaultData.keyHolders.map(holder => {
    const approval = proposalData.approvals.find(a => a.holderId === holder.id)
    return {
      id: holder.id,
      name: holder.name,
      approved: !!approval,
      timestamp: approval?.approvedAt
    }
  })

  const approvedCount = proposalData.approvals.length
  const isThresholdReached = approvedCount >= vaultData.threshold
  const currentUserHolder = vaultData.keyHolders.find(h => h.id === currentUserId)
  const hasCurrentUserApproved = proposalData.approvals.some(a => a.holderId === currentUserId)

  const handleApprove = () => {
    setShowConfirmation(true)
  }

  const confirmApproval = async () => {
    if (!id) return
    
    setApproving(true)
    setShowConfirmation(false)
    
    try {
      const updated = await approveProposal(id, currentUserId)
      setProposalData(updated)
      
      // Refresh vault data to get updated status
      const vault = await getVault(id)
      setVaultData(vault)
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setApproving(false)
    }
  }

  const handleExecute = async () => {
    if (!id) return
    
    setExecuting(true)
    
    try {
      await executeProposal(id)
      
      // Show unlocking animation then navigate to proof
      setTimeout(() => {
        navigate(`/vault/${id}/proof`)
      }, 2000)
    } catch (err) {
      setError(handleApiError(err))
      setExecuting(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0A0A0F] via-[#0F0F14] to-[#14141A] overflow-hidden">
      {/* Ambient orbs */}
      <GlowOrb className="top-1/4 left-1/4" color="blue" />
      <GlowOrb className="bottom-1/3 right-1/4" color="purple" delay={1.5} />
      <GlowOrb className="top-2/3 left-1/2" color="cyan" delay={3} />

      <div className="relative z-10 min-h-screen px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Back button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/vault/${id}`)}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Vault
          </motion.button>

          {/* Main card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            {/* Floating gradient border */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl blur opacity-30 animate-pulse" />
            
            {/* Glassmorphic card */}
            <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl p-6 md:p-8">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="inline-block mb-4"
                >
                  <svg className="w-20 h-20 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                </motion.div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 font-heading">Unlock Proposal</h1>
                <p className="text-[#CBD5E1] mb-4 font-body">Review the final payout and approve to unlock the vault</p>
                <div className="inline-flex flex-col items-center gap-1">
                  <p className="text-white font-semibold">{vaultData.name}</p>
                  <p className="text-slate-500 text-sm font-mono">ID: {id}</p>
                </div>
              </motion.div>

              {/* Payout Summary */}
              <PayoutSummary
                totalBalance={vaultData.totalDeposits}
                sourceAsset={vaultData.sourceAsset}
                targetAsset={vaultData.targetAsset}
                recipients={proposalData.recipients}
              />

              {/* Approval Status */}
              <ApprovalStatus
                keyHolders={keyHoldersWithApprovals}
                threshold={vaultData.threshold}
                approvedCount={approvedCount}
                expiresAt={proposalData.expiresAt}
              />

              {/* Action buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8 space-y-4"
              >
                {!hasCurrentUserApproved && currentUserHolder && (
                  <motion.button
                    whileHover={{ scale: approving ? 1 : 1.02, boxShadow: approving ? undefined : '0 0 30px rgba(139, 92, 246, 0.5)' }}
                    whileTap={{ scale: approving ? 1 : 0.98 }}
                    onClick={handleApprove}
                    disabled={approving}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-lg font-semibold rounded-xl shadow-lg shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {approving ? 'Approving...' : 'Approve Unlock Proposal'}
                  </motion.button>
                )}

                {hasCurrentUserApproved && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-500/10 border border-green-500/30 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-green-300 font-medium">You have approved this proposal</p>
                    </div>
                  </motion.div>
                )}

                {isThresholdReached && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: executing ? 1 : 1.02, boxShadow: executing ? undefined : '0 0 30px rgba(34, 197, 94, 0.5)' }}
                    whileTap={{ scale: executing ? 1 : 0.98 }}
                    onClick={handleExecute}
                    disabled={executing}
                    className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white text-lg font-semibold rounded-xl shadow-lg shadow-green-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {executing ? 'Executing...' : 'Execute Unlock'}
                  </motion.button>
                )}
                
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/30 rounded-lg p-4"
                  >
                    <p className="text-red-300 text-sm">{error}</p>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowConfirmation(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 rounded-2xl border border-slate-700 p-6 max-w-md w-full"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 font-heading">Confirm Approval</h3>
                <p className="text-[#CBD5E1] font-body">
                  Are you sure you want to approve this unlock proposal? This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition-all"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={confirmApproval}
                  className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all"
                >
                  Confirm
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
