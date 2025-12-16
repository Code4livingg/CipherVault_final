import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getVault, getProposal, executeProposal, type Vault, type UnlockProposal } from '../lib/api'
import CinematicBackground from '../components/vault-steps/CinematicBackground'
import UnlockRing from '../components/unlock/UnlockRing'
import HologramKeyChip from '../components/unlock/HologramKeyChip'
import UnlockSequence from '../components/unlock/UnlockSequence'
import PageTransition from '../components/ui/PageTransition'
import FloatingPanel from '../components/ui/FloatingPanel'
import GlobalCinematicEnvironment from '../components/environment/GlobalCinematicEnvironment'

export default function UnlockProposal() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [vaultData, setVaultData] = useState<Vault | null>(null)
  const [proposalData, setProposalData] = useState<UnlockProposal | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [approving, setApproving] = useState(false)
  
  // Mock current user - in production, get from auth
  const currentUserId = 'holder-3'

  const fetchVault = async () => {
    if (!id) return

    try {
      const [vault, proposal] = await Promise.all([
        getVault(id),
        getProposal(id).catch(() => null)
      ])
      setVaultData(vault)
      setProposalData(proposal)
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Failed to load vault')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVault()
    
    // Poll for updates every 5 seconds
    const interval = setInterval(fetchVault, 5000)
    
    return () => clearInterval(interval)
  }, [id])

  const handleApprove = async () => {
    if (!id || !vaultData) return

    setApproving(true)
    try {
      // Call API endpoint
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/vault/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approverId: currentUserId })
      })

      if (!response.ok) throw new Error('Approval failed')

      // Optimistic update
      setVaultData(prev => {
        if (!prev) return prev
        return {
          ...prev,
          keyHolders: prev.keyHolders.map(h =>
            h.id === currentUserId ? { ...h, approved: true } : h
          )
        }
      })

      // Refresh data
      await fetchVault()
    } catch (err: any) {
      setError(err.message || 'Failed to approve')
    } finally {
      setApproving(false)
    }
  }

  const handleExecute = async () => {
    if (!id || !vaultData) return

    try {
      // Call the execute proposal API
      await executeProposal(id)
      
      // Start the cinematic unlock sequence
      setIsExecuting(true)
      
      // The UnlockSequence component will handle navigation after animation
    } catch (err: any) {
      setError(err.message || 'Execution failed')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0F14] flex items-center justify-center">
        <div className="text-white text-xl font-body">Loading proposal...</div>
      </div>
    )
  }

  if (error && !vaultData) {
    return (
      <div className="min-h-screen bg-[#0A0F14] flex items-center justify-center p-4">
        <div className="bg-[#0F1317] border border-[#DC2626] rounded-md p-6 max-w-md">
          <p className="text-[#DC2626] font-body">{error}</p>
          <button
            onClick={() => navigate(`/vault/${id}`)}
            className="mt-4 px-4 py-2 bg-[#0F1317] border border-[#1E293B] text-white rounded-md hover:border-[#3B82F6] transition font-body"
          >
            Back to Vault
          </button>
        </div>
      </div>
    )
  }

  if (!vaultData) return null

  const approvedCount = proposalData?.approvals.length || vaultData.keyHolders.filter(h => h.approved).length
  const isThresholdReached = approvedCount >= vaultData.threshold

  // Use real proposal data or fallback to mock
  const displayProposal = proposalData ? {
    recipients: proposalData.recipients,
    sourceAsset: vaultData.sourceAsset,
    targetAsset: vaultData.targetAsset,
    totalAmount: vaultData.totalDeposits
  } : {
    recipients: [
      { address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', amount: '0.5', asset: 'BTC' }
    ],
    sourceAsset: vaultData.sourceAsset,
    targetAsset: vaultData.targetAsset,
    totalAmount: vaultData.totalDeposits
  }

  return (
    <PageTransition direction="horizontal">
      <main className="min-h-screen bg-[#0A0F14] relative overflow-hidden">
        <GlobalCinematicEnvironment />
        <CinematicBackground />

      {/* Unlock Sequence Overlay */}
      <UnlockSequence
        isActive={isExecuting}
        vaultId={id!}
        proposalId={proposalData?.id}
        onError={(err) => {
          setError(err)
          setIsExecuting(false)
        }}
      />

      <div className="relative z-10 min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
        {/* LEFT: Unlock Ring */}
        <div className="flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-md"
          >
            <UnlockRing
              vaultId={id!}
              approvals={vaultData.keyHolders.map(h => ({
                approverId: h.id,
                approved: h.approved,
                timestamp: new Date().toISOString()
              }))}
              threshold={vaultData.threshold}
              totalHolders={vaultData.keyHolders.length}
              isExecuting={isExecuting}
            />
          </motion.div>
        </div>

        {/* RIGHT: Info Column */}
        <div className="flex flex-col justify-center space-y-6 max-w-2xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 font-heading">
              Initiate Unlock Sequence
            </h1>
            <p className="text-[#CBD5E1] font-body">
              This action requires {vaultData.threshold} of {vaultData.keyHolders.length} approvals
            </p>
          </motion.div>

          {/* Proposal Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="relative bg-white/[0.02] border border-[#1E293B] rounded-lg p-6"
          >
            <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-[#D1A954] rounded-full" />
            
            <p className="text-[#94A3B8] text-xs font-body mb-4">PROPOSAL SUMMARY</p>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[#94A3B8] text-sm font-body">Total Amount</span>
                <span className="text-white font-mono font-semibold">
                  {displayProposal.totalAmount} {displayProposal.sourceAsset}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-[#94A3B8] text-sm font-body">Swap Target</span>
                <div className="flex items-center gap-2">
                  <span className="text-white font-mono">{displayProposal.sourceAsset}</span>
                  <svg className="w-4 h-4 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  <span className="text-[#D1A954] font-mono">{displayProposal.targetAsset}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1E293B]">
                <p className="text-[#94A3B8] text-xs font-body mb-2">Recipients</p>
                {displayProposal.recipients.map((recipient, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-[#3B82F6] rounded-full" />
                    <span className="text-white font-mono text-xs">
                      {recipient.address.slice(0, 12)}...
                    </span>
                    <span className="text-[#94A3B8] font-mono text-xs">
                      {recipient.amount} {'targetAsset' in recipient ? recipient.targetAsset : recipient.asset}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Approvals List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-[#94A3B8] text-xs font-body">LIVE APPROVALS</p>
              <span className="text-[#3B82F6] text-xs font-mono">
                {approvedCount} / {vaultData.threshold}
              </span>
            </div>

            {vaultData.keyHolders.map((holder) => (
              <HologramKeyChip
                key={holder.id}
                holder={{
                  id: holder.id,
                  name: holder.name,
                  address: holder.email,
                  status: holder.approved ? 'approved' : 'pending',
                  timestamp: new Date().toISOString()
                }}
                isCurrentUser={holder.id === currentUserId}
                onApprove={holder.id === currentUserId && !holder.approved ? handleApprove : undefined}
                isLoading={approving}
              />
            ))}
          </motion.div>

          {/* Action Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-6"
          >
            {isThresholdReached ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExecute}
                disabled={isExecuting}
                className="w-full py-4 border-2 border-[#D1A954] text-white rounded-lg font-body text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                animate={{
                  boxShadow: [
                    '0 0 0 rgba(209, 169, 84, 0)',
                    '0 0 20px rgba(209, 169, 84, 0.4)',
                    '0 0 0 rgba(209, 169, 84, 0)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {isExecuting ? 'Executing...' : 'Execute Unlock'}
              </motion.button>
            ) : (
              <div className="text-center">
                <p className="text-[#94A3B8] text-sm font-body">
                  Awaiting {vaultData.threshold - approvedCount} more approval{vaultData.threshold - approvedCount !== 1 ? 's' : ''}
                </p>
              </div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-[#DC2626]/10 border border-[#DC2626]/30 rounded-lg"
              >
                <p className="text-[#DC2626] text-sm font-body">{error}</p>
              </motion.div>
            )}
          </motion.div>

          {/* Back button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            onClick={() => navigate(`/vault/${id}`)}
            className="flex items-center gap-2 text-[#3B82F6] hover:text-white transition font-body text-sm justify-center lg:justify-start"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Vault
          </motion.button>
        </div>
      </div>

      {/* Floating Crypto OS Panels - Orbit Mode */}
      <FloatingPanel
        variant="chip"
        icon="🔑"
        label="Key"
        x={15}
        y={25}
        size={55}
        orbit={true}
        zIndex={50}
      />
      <FloatingPanel
        variant="sticker"
        icon="🔐"
        label="Lock"
        x={85}
        y={30}
        size={60}
        orbit={true}
        zIndex={50}
      />
      <FloatingPanel
        variant="badge"
        icon="🧩"
        label="Shard"
        x={12}
        y={70}
        size={58}
        orbit={true}
        zIndex={50}
      />
    </main>
    </PageTransition>
  )
}
