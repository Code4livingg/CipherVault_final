import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getVault, getProposal, handleApiError, type Vault, type UnlockProposal } from '../lib/api'
import PageTransition from '../components/ui/PageTransition'
import FloatingPanel from '../components/ui/FloatingPanel'
import GlobalCinematicEnvironment from '../components/environment/GlobalCinematicEnvironment'

export default function FinalProof() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [vaultData, setVaultData] = useState<Vault | null>(null)
  const [proposalData, setProposalData] = useState<UnlockProposal | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)
  const [showParticles, setShowParticles] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      // Check for demo mode data first
      const demoProof = localStorage.getItem('demo_proof')
      const demoVault = localStorage.getItem('demo_vault')
      const demoProposal = localStorage.getItem('demo_proposal')
      
      if (demoProof && demoVault) {
        // Demo mode - use localStorage data
        try {
          const vault = JSON.parse(demoVault)
          const proposal = demoProposal ? JSON.parse(demoProposal) : null
          
          setVaultData(vault)
          setProposalData(proposal)
          setLoading(false)
          return
        } catch (err) {
          console.error('Failed to parse demo data:', err)
        }
      }
      
      // Production mode - fetch from API
      if (!id) {
        setError('No vault ID provided')
        setLoading(false)
        return
      }

      try {
        const [vault, proposal] = await Promise.all([
          getVault(id),
          getProposal(id).catch(() => null)
        ])

        // Allow both unlocking and destroyed status
        if (vault.status !== 'destroyed' && vault.status !== 'unlocking') {
          navigate(`/vault/${id}`)
          return
        }

        setVaultData(vault)
        setProposalData(proposal)
      } catch (err) {
        setError(handleApiError(err))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    
    // Hide particles after animation
    const timer = setTimeout(() => setShowParticles(false), 3000)
    return () => clearTimeout(timer)
  }, [id, navigate])

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address)
    setCopiedAddress(address)
    setTimeout(() => setCopiedAddress(null), 2000)
  }

  const handleDownload = () => {
    if (!vaultData || !proposalData) return
    
    const proofData = {
      vaultId: vaultData.id,
      vaultName: vaultData.name,
      proposalId: proposalData.id,
      status: 'Unlock Executed Successfully',
      executedAt: proposalData.executedAt,
      totalAmount: vaultData.totalDeposits,
      sourceAsset: vaultData.sourceAsset,
      targetAsset: vaultData.targetAsset,
      recipients: proposalData.recipients,
      approvals: proposalData.approvals,
      shifts: proposalData.shifts
    }
    
    const blob = new Blob([JSON.stringify(proofData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `vault-proof-${vaultData.id}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0F14] flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-white text-xl font-heading"
        >
          Loading proof...
        </motion.div>
      </div>
    )
  }

  if (error || !vaultData) {
    return (
      <div className="min-h-screen bg-[#0A0F14] flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 max-w-md">
          <p className="text-red-300">{error || 'Vault not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-[#11161C] hover:bg-[#1E293B] text-white rounded-lg transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  const totalAmount = proposalData?.recipients.reduce((sum, r) => sum + parseFloat(r.amount), 0).toFixed(8) || vaultData.totalDeposits

  return (
    <PageTransition direction="horizontal">
      <div className="relative min-h-screen bg-[#0A0F14] overflow-hidden">
        {/* Global Cinematic Environment */}
        <GlobalCinematicEnvironment />
        
        {/* Security Grid Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(#3B82F6 1px, transparent 1px),
            linear-gradient(90deg, #3B82F6 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Drifting Nodes */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-[#3B82F6]"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0.2
          }}
          animate={{
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      ))}

      {/* Large Rotating Gold VaultRing */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        >
          <svg width="800" height="800" viewBox="0 0 800 800" className="opacity-10">
            <circle cx="400" cy="400" r="350" fill="none" stroke="#D1A954" strokeWidth="2" strokeDasharray="10 20" />
            <circle cx="400" cy="400" r="300" fill="none" stroke="#D1A954" strokeWidth="1" strokeDasharray="5 15" />
            <circle cx="400" cy="400" r="250" fill="none" stroke="#D1A954" strokeWidth="0.5" strokeDasharray="3 10" />
          </svg>
        </motion.div>
      </div>

      {/* Particle Burst Animation */}
      {showParticles && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          {[...Array(20)].map((_, i) => {
            const angle = (i / 20) * Math.PI * 2
            const distance = 200
            return (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-[#D1A954]"
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: Math.cos(angle) * distance,
                  y: Math.sin(angle) * distance,
                  opacity: 0,
                  scale: 0
                }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
            )
          })}
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-3xl"
        >
          {/* Hologram Receipt Panel */}
          <div className="relative">
            {/* Gold Shimmer Border Animation */}
            <motion.div
              className="absolute -inset-1 rounded-2xl opacity-50"
              style={{
                background: 'linear-gradient(90deg, transparent, #D1A954, transparent)',
                backgroundSize: '200% 100%'
              }}
              animate={{
                backgroundPosition: ['0% 0%', '200% 0%']
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear'
              }}
            />
            
            {/* Main Panel */}
            <div className="relative bg-[#11161C] border-2 border-[#D1A954] rounded-2xl p-8 md:p-12">
              {/* Success Glyph */}
              <motion.div
                className="flex justify-center mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              >
                <motion.div
                  className="w-20 h-20 rounded-full bg-[#10B981]/20 border-2 border-[#10B981] flex items-center justify-center"
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(16, 185, 129, 0.3)',
                      '0 0 40px rgba(16, 185, 129, 0.5)',
                      '0 0 20px rgba(16, 185, 129, 0.3)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <svg className="w-10 h-10 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              </motion.div>

              {/* Status Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-3xl md:text-4xl font-bold text-white text-center mb-2 font-heading"
              >
                Unlock Executed Successfully
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-[#94A3B8] text-center mb-8"
              >
                Transaction Receipt • Vault Destroyed
              </motion.p>

              {/* Receipt Details */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="space-y-4 mb-8"
              >
                {/* Vault ID */}
                <div className="flex justify-between items-start border-b border-[#1E293B] pb-3">
                  <span className="text-[#94A3B8] text-sm">Vault ID</span>
                  <span className="text-white font-mono text-sm text-right">{vaultData.id}</span>
                </div>

                {/* Proposal ID */}
                {proposalData && (
                  <div className="flex justify-between items-start border-b border-[#1E293B] pb-3">
                    <span className="text-[#94A3B8] text-sm">Proposal ID</span>
                    <span className="text-white font-mono text-sm text-right">{proposalData.id}</span>
                  </div>
                )}

                {/* Timestamp */}
                <div className="flex justify-between items-center border-b border-[#1E293B] pb-3">
                  <span className="text-[#94A3B8] text-sm">Executed At</span>
                  <span className="text-white font-mono text-sm">
                    {proposalData?.executedAt ? new Date(proposalData.executedAt).toLocaleString() : new Date(vaultData.updatedAt).toLocaleString()}
                  </span>
                </div>

                {/* Total Amount */}
                <div className="flex justify-between items-center border-b border-[#1E293B] pb-3">
                  <span className="text-[#94A3B8] text-sm">Total Amount Unlocked</span>
                  <span className="text-[#D1A954] font-bold font-mono text-lg">{totalAmount} {vaultData.sourceAsset}</span>
                </div>

                {/* Asset Swap Route */}
                <div className="flex justify-between items-center border-b border-[#1E293B] pb-3">
                  <span className="text-[#94A3B8] text-sm">Asset Swap Route</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">{vaultData.sourceAsset}</span>
                    <svg className="w-4 h-4 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <span className="text-white font-semibold">{vaultData.targetAsset}</span>
                  </div>
                </div>
              </motion.div>

              {/* Recipients List */}
              {proposalData && proposalData.recipients && proposalData.recipients.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="mb-8"
                >
                  <h3 className="text-[#94A3B8] text-sm mb-3 font-semibold">Recipients</h3>
                  <div className="space-y-3">
                    {proposalData.recipients.map((recipient, index) => (
                      <div key={index} className="bg-[#0A0F14] border border-[#1E293B] rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            {recipient.name && (
                              <p className="text-white font-semibold text-sm mb-1">{recipient.name}</p>
                            )}
                            <div className="flex items-center gap-2">
                              <p className="text-[#94A3B8] text-xs font-mono">
                                {recipient.address.slice(0, 12)}...{recipient.address.slice(-10)}
                              </p>
                              <button
                                onClick={() => handleCopy(recipient.address)}
                                className="text-[#3B82F6] hover:text-[#60A5FA] transition-colors"
                              >
                                {copiedAddress === recipient.address ? (
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                ) : (
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                )}
                              </button>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[#D1A954] font-bold font-mono">{recipient.amount}</p>
                            <p className="text-[#94A3B8] text-xs">{recipient.targetAsset}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Key Holders Who Approved */}
              {proposalData && proposalData.approvals && proposalData.approvals.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mb-8"
                >
                  <h3 className="text-[#94A3B8] text-sm mb-3 font-semibold">Approved By</h3>
                  <div className="flex flex-wrap gap-2">
                    {proposalData.approvals.map((approval, index) => {
                      const holder = vaultData.keyHolders.find(h => h.id === approval.holderId)
                      return (
                        <motion.div
                          key={approval.holderId}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.9 + index * 0.1 }}
                          className="px-4 py-2 bg-[#D1A954]/10 border border-[#D1A954] rounded-full flex items-center gap-2"
                        >
                          <svg className="w-4 h-4 text-[#D1A954]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-[#D1A954] font-semibold text-sm">{holder?.name || approval.holderId}</span>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* Auto-Swap Summary */}
              {vaultData.autoSwap && proposalData?.shifts && proposalData.shifts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0 }}
                  className="mb-8 bg-[#3B82F6]/5 border border-[#3B82F6]/30 rounded-lg p-4"
                >
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#3B82F6] mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-white font-semibold text-sm mb-1">Auto-Swap Executed</p>
                      <p className="text-[#94A3B8] text-xs">
                        {proposalData.shifts.length} swap{proposalData.shifts.length > 1 ? 's' : ''} processed via SideShift
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDownload}
                  className="flex-1 px-6 py-3 bg-[#D1A954] hover:bg-[#E5C068] text-[#0A0F14] font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Final Proof
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/')}
                  className="flex-1 px-6 py-3 bg-[#1E293B] hover:bg-[#334155] text-white font-semibold rounded-lg border border-[#3B82F6]/30 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Return to Home
                </motion.button>
              </motion.div>

              {/* Floating Bits Animation */}
              <div className="absolute -top-4 -right-4 pointer-events-none">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-[#D1A954] rounded-full"
                    style={{
                      left: `${i * 10}px`,
                      top: `${i * 8}px`
                    }}
                    animate={{
                      y: [-10, -30, -10],
                      opacity: [0.3, 0.7, 0.3]
                    }}
                    transition={{
                      duration: 2 + i * 0.3,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Crypto OS Panels */}
      <FloatingPanel
        variant="badge"
        icon="✓"
        label="Verified"
        x={10}
        y={12}
        size={75}
        zIndex={50}
      />
      <FloatingPanel
        variant="chip"
        icon="📥"
        label="Download"
        x={88}
        y={15}
        size={80}
        zIndex={50}
      />
    </div>
    </PageTransition>
  )
}
