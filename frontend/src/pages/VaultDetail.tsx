import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getVault, approveUnlock, handleApiError, type Vault } from '../lib/api'
import CinematicBackground from '../components/vault-steps/CinematicBackground'
import VaultHologram from '../components/vault-detail/VaultHologram'
import MPCNodeNetwork from '../components/vault-detail/MPCNodeNetwork'
import BalanceHologram from '../components/vault-detail/BalanceHologram'
import HologramDivider from '../components/vault-detail/HologramDivider'
import PageTransition from '../components/ui/PageTransition'
import FloatingPanel from '../components/ui/FloatingPanel'
import GlobalCinematicEnvironment from '../components/environment/GlobalCinematicEnvironment'
import VaultAnalyticsOverlay from '../components/analytics/VaultAnalyticsOverlay'

export default function VaultDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [vaultData, setVaultData] = useState<Vault | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [approving, setApproving] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  
  const currentUserId = 'holder-3'

  const fetchVault = async () => {
    if (!id) return

    try {
      const vault = await getVault(id)
      setVaultData(vault)
      setError(null)
      
      if (vault.status === 'destroyed') {
        navigate(`/vault/${id}/proof`)
      }
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVault()
    const interval = setInterval(fetchVault, 7000)
    return () => clearInterval(interval)
  }, [id])

  const handleApprove = async () => {
    if (!id || !vaultData) return

    setApproving(true)
    try {
      const updated = await approveUnlock(id, currentUserId)
      setVaultData(updated)
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setApproving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0F14] flex items-center justify-center">
        <div className="text-white text-xl font-body">Loading vault...</div>
      </div>
    )
  }

  if (error || !vaultData) {
    return (
      <div className="min-h-screen bg-[#0A0F14] flex items-center justify-center p-4">
        <div className="bg-[#0F1317] border border-[#DC2626] rounded-md p-6 max-w-md">
          <p className="text-[#DC2626] font-body">{error || 'Vault not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-[#0F1317] border border-[#1E293B] text-white rounded-md hover:border-[#3B82F6] transition font-body"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  const approvedCount = vaultData.keyHolders.filter(h => h.approved).length
  const isThresholdReached = approvedCount >= vaultData.threshold
  const isCurrentUserHolder = vaultData.keyHolders.some(h => h.id === currentUserId)
  const hasCurrentUserApproved = vaultData.keyHolders.find(h => h.id === currentUserId)?.approved

  const statusConfig: Record<string, { label: string; color: string }> = {
    created: { label: 'CREATED', color: '#94A3B8' },
    funding: { label: 'FUNDING', color: '#3B82F6' },
    ready: { label: 'READY', color: '#D1A954' },
    unlocking: { label: 'UNLOCKING', color: '#D1A954' },
    destroyed: { label: 'DESTROYED', color: '#DC2626' }
  }

  const currentStatus = statusConfig[vaultData.status] || statusConfig.created

  const timelineSteps = [
    { label: 'Created', active: ['created', 'funding', 'ready', 'unlocking', 'destroyed'].includes(vaultData.status) },
    { label: 'Funded', active: ['funding', 'ready', 'unlocking', 'destroyed'].includes(vaultData.status) },
    { label: 'Unlock Requested', active: ['ready', 'unlocking', 'destroyed'].includes(vaultData.status) },
    { label: 'Executed', active: ['destroyed'].includes(vaultData.status) }
  ]

  return (
    <PageTransition direction="horizontal">
      <main className="min-h-screen bg-[#0A0F14] relative overflow-hidden">
        <GlobalCinematicEnvironment />
        <CinematicBackground />

      {/* Split screen layout */}
      <div className="relative z-10 min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* LEFT SIDE: Cinematic Visualization Zone */}
        <div className="relative flex items-center justify-center p-8 min-h-screen">
          {/* Layer 1: Vault Hologram */}
          <div className="absolute inset-0">
            <VaultHologram status={vaultData.status} />
          </div>

          {/* Layer 2: MPC Node Network */}
          <div className="absolute inset-0">
            <MPCNodeNetwork
              keyHolders={vaultData.keyHolders}
              threshold={vaultData.threshold}
            />
          </div>

          {/* Layer 3: Balance Hologram */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative z-10 mt-auto mb-16"
          >
            <BalanceHologram
              amount={vaultData.totalDeposits}
              asset={vaultData.sourceAsset}
              autoSwap={true}
              targetAsset={vaultData.targetAsset}
            />
          </motion.div>
        </div>

        {/* Hologram Divider */}
        <HologramDivider />

        {/* RIGHT SIDE: Operational Info Zone */}
        <div className="relative flex flex-col p-8 min-h-screen">
          {/* Back button */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/')}
            className="absolute top-8 right-8 flex items-center gap-2 text-[#3B82F6] hover:text-white transition font-body text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </motion.button>

          <div className="flex-1 flex flex-col justify-center space-y-6 max-w-xl">
            {/* Vault Header Hologram */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="relative bg-white/[0.02] border border-[#1E293B] rounded-lg p-6"
            >
              <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-[#D1A954] rounded-full" />
              <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#D1A954] rounded-full" />
              
              <h1 className="text-3xl font-bold text-white mb-2 font-heading">{vaultData.name}</h1>
              <p className="text-[#94A3B8] text-sm font-mono mb-3">ID: {id?.slice(0, 16)}...</p>
              
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: currentStatus.color }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span
                  className="text-sm font-mono font-semibold"
                  style={{ color: currentStatus.color }}
                >
                  {currentStatus.label}
                </span>
              </div>
            </motion.div>

            {/* Deposit Address Hologram */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative bg-white/[0.02] border border-[#1E293B] rounded-lg p-6 hover:border-[#3B82F6]/30 transition"
            >
              <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-[#D1A954] rounded-full" />
              
              <p className="text-[#94A3B8] text-xs font-body mb-2">DEPOSIT ADDRESS</p>
              <div className="flex items-center gap-2">
                <p className="text-white font-mono text-sm flex-1 break-all">{vaultData.depositAddress}</p>
                <button
                  onClick={() => navigator.clipboard.writeText(vaultData.depositAddress)}
                  className="text-[#3B82F6] hover:text-white transition"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </motion.div>

            {/* Key Holders Hologram */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative bg-white/[0.02] border border-[#1E293B] rounded-lg p-6"
            >
              <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-[#D1A954] rounded-full" />
              
              <p className="text-[#94A3B8] text-xs font-body mb-4">KEY HOLDERS</p>
              
              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-mono text-sm">{approvedCount} / {vaultData.threshold}</span>
                  <span className="text-[#94A3B8] text-xs font-body">
                    {Math.round((approvedCount / vaultData.threshold) * 100)}%
                  </span>
                </div>
                <div className="h-1 bg-[#1E293B] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: isThresholdReached ? '#D1A954' : '#3B82F6',
                      boxShadow: isThresholdReached ? '0 0 8px rgba(209, 169, 84, 0.5)' : 'none'
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(approvedCount / vaultData.threshold) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Holder chips */}
              <div className="space-y-2">
                {vaultData.keyHolders.map((holder) => (
                  <div
                    key={holder.id}
                    className="flex items-center gap-3 p-2 bg-[#0A0F14]/50 border border-[#1E293B] rounded"
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        holder.approved ? 'bg-[#D1A954]' : 'bg-[#3B82F6]'
                      }`}
                    />
                    <span className="text-white text-sm font-body flex-1">{holder.name}</span>
                    {holder.approved ? (
                      <svg className="w-4 h-4 text-[#D1A954]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Timeline Hologram */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="relative bg-white/[0.02] border border-[#1E293B] rounded-lg p-6"
            >
              <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-[#D1A954] rounded-full" />
              
              <p className="text-[#94A3B8] text-xs font-body mb-4">TIMELINE</p>
              
              <div className="relative">
                {/* Vertical spine */}
                <div className="absolute left-2 top-0 bottom-0 w-px bg-[#1E293B]" />
                
                <div className="space-y-4">
                  {timelineSteps.map((step, index) => (
                    <div key={step.label} className="relative flex items-center gap-4">
                      {/* Node */}
                      <motion.div
                        className={`relative z-10 w-4 h-4 rounded-full border-2 ${
                          step.active ? 'border-[#D1A954] bg-[#D1A954]' : 'border-[#1E293B] bg-transparent'
                        }`}
                        animate={step.active ? {
                          boxShadow: ['0 0 0 rgba(209, 169, 84, 0)', '0 0 8px rgba(209, 169, 84, 0.5)', '0 0 0 rgba(209, 169, 84, 0)']
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      
                      <span className={`text-sm font-body ${step.active ? 'text-white' : 'text-[#94A3B8]'}`}>
                        {step.label}
                      </span>

                      {/* Data packet */}
                      {step.active && index < timelineSteps.length - 1 && (
                        <motion.div
                          className="absolute left-2 w-1 h-2 bg-[#D1A954] rounded-full"
                          animate={{ y: [0, 30] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Action buttons */}
            {isCurrentUserHolder && !hasCurrentUserApproved && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={handleApprove}
                disabled={approving}
                className="w-full py-4 border border-[#3B82F6] text-white rounded-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition font-body disabled:opacity-50"
              >
                {approving ? 'Approving...' : 'Approve Unlock Request'}
              </motion.button>
            )}

            {isThresholdReached && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                onClick={() => navigate(`/vault/${id}/unlock`)}
                className="w-full py-4 border border-[#D1A954] text-white rounded-lg hover:shadow-[0_0_20px_rgba(209,169,84,0.3)] transition font-body"
              >
                View Unlock Proposal
              </motion.button>
            )}

            {/* Analytics button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              onClick={() => setShowAnalytics(true)}
              className="w-full py-4 border border-[#8B5CF6] text-white rounded-lg hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition font-body flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              View Analytics
            </motion.button>
          </div>
        </div>
      </div>

      {/* Floating Crypto OS Panels */}
      <FloatingPanel
        variant="chip"
        icon="💰"
        label="Balance"
        x={92}
        y={25}
        size={60}
        zIndex={50}
      />
      <FloatingPanel
        variant="badge"
        icon="⛓️"
        label="Chain"
        x={8}
        y={30}
        size={65}
        zIndex={50}
      />
      <FloatingPanel
        variant="sticker"
        icon="🔐"
        label="Secure"
        x={90}
        y={70}
        size={70}
        zIndex={50}
      />
      <FloatingPanel
        variant="chip"
        icon="📊"
        label="Status"
        x={10}
        y={75}
        size={65}
        zIndex={50}
      />
      <FloatingPanel
        variant="badge"
        icon="⚡"
        label="Swap"
        x={50}
        y={8}
        size={60}
        zIndex={50}
      />

      {/* Analytics Overlay */}
      <VaultAnalyticsOverlay
        vault={vaultData}
        isVisible={showAnalytics}
        onClose={() => setShowAnalytics(false)}
      />
    </main>
    </PageTransition>
  )
}
