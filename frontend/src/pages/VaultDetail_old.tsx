import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getVault, approveUnlock, handleApiError, type Vault } from '../lib/api'

function SecurityGridOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-[0.015]">
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
      }} />
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { label: string; className: string }> = {
    created: { label: 'Created', className: 'bg-[#0F1317] border-[#94A3B8] text-[#94A3B8]' },
    funding: { label: 'Funding', className: 'bg-[#0F1317] border-[#3B82F6] text-[#3B82F6]' },
    ready: { label: 'Ready', className: 'bg-[#0F1317] border-[#D1A954] text-[#D1A954]' },
    unlocking: { label: 'Unlocking', className: 'bg-[#0F1317] border-[#D1A954] text-[#D1A954]' },
    destroyed: { label: 'Destroyed', className: 'bg-[#0F1317] border-[#DC2626] text-[#DC2626]' }
  }

  const config = statusConfig[status] || statusConfig.created

  return (
    <span className={`px-4 py-2 rounded-md border text-sm font-medium ${config.className}`}>
      {config.label}
    </span>
  )
}

export default function VaultDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [vaultData, setVaultData] = useState<Vault | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [approving, setApproving] = useState(false)
  
  // Mock current user ID - in production, get from auth
  const currentUserId = 'holder-3'

  const fetchVault = async () => {
    if (!id) return

    try {
      const vault = await getVault(id)
      setVaultData(vault)
      setError(null)
      
      // Navigate to proof page if vault is destroyed
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
    
    // Poll every 7 seconds for updates
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
        <div className="text-white text-xl">Loading vault...</div>
      </div>
    )
  }

  if (error || !vaultData) {
    return (
      <div className="min-h-screen bg-[#0A0F14] flex items-center justify-center p-4">
        <div className="bg-[#0F1317] border border-[#DC2626] rounded-md p-6 max-w-md">
          <p className="text-[#DC2626]">{error || 'Vault not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-[#0F1317] border border-[#1E293B] text-white rounded-md hover:border-[#3B82F6] transition"
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

  return (
    <main className="min-h-screen bg-[#0A0F14] relative">
      <SecurityGridOverlay />
      
      <div className="relative z-10 min-h-screen px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-[#94A3B8] hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-sm">Back</span>
            </button>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <h1 className="text-xl font-bold text-white font-heading">{vaultData.name}</h1>
                <p className="text-xs text-gray-400 font-mono">ID: {id?.slice(0, 8)}...</p>
              </div>
              <StatusBadge status={vaultData.status} />
            </div>
          </div>

          {/* Execution banner */}
          {(vaultData.status === 'ready' || vaultData.status === 'unlocking') && (
            <div className="bg-[#D1A954]/8 border border-[#D1A954]/30 rounded-md p-4">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-[#D1A954]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <p className="text-[#D1A954] text-sm font-medium">
                  {vaultData.status === 'ready' 
                    ? 'Vault ready for multi-party unlock' 
                    : 'Unlock in progress… awaiting shift completion'}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left column */}
            <div className="space-y-6">
              {/* Deposit Panel */}
              <div className="bg-[#11161C] border border-[#1E293B] rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <svg className="w-6 h-6 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h2 className="text-xl font-bold text-white font-heading">Vault Balance</h2>
                </div>

                <div className="mb-6">
                  <p className="text-4xl font-bold text-white mb-1 font-mono">{vaultData.totalDeposits}</p>
                  <p className="text-[#94A3B8] text-sm font-body">{vaultData.sourceAsset}</p>
                </div>

                {/* Deposit address */}
                <div className="mb-6">
                  <p className="text-[#94A3B8] text-sm mb-2">Deposit Address</p>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-[#0F1317] border border-[#1E293B] rounded-md px-3 py-2">
                      <p className="text-white font-mono text-xs break-all">{vaultData.depositAddress}</p>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(vaultData.depositAddress)
                      }}
                      className="px-3 bg-[#0F1317] border border-[#3B82F6] text-[#3B82F6] rounded-md hover:border-[#60A5FA] transition"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* QR placeholder */}
                <div className="flex justify-center mb-6">
                  <div className="w-40 h-40 bg-white rounded-md p-3 border-2 border-[#3B82F6]">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <rect x="0" y="0" width="20" height="20" fill="#000" />
                      <rect x="25" y="0" width="15" height="15" fill="#000" />
                      <rect x="80" y="0" width="20" height="20" fill="#000" />
                      <rect x="0" y="25" width="15" height="15" fill="#000" />
                      <rect x="35" y="25" width="20" height="20" fill="#000" />
                      <rect x="80" y="25" width="20" height="20" fill="#000" />
                      <rect x="0" y="80" width="20" height="20" fill="#000" />
                      <rect x="25" y="80" width="15" height="15" fill="#000" />
                      <rect x="80" y="80" width="20" height="20" fill="#000" />
                    </svg>
                  </div>
                </div>

                {/* Supported assets */}
                <div>
                  <p className="text-[#94A3B8] text-sm mb-2">Supported Assets</p>
                  <div className="flex gap-2">
                    {vaultData.supportedChains.map((chain) => (
                      <span
                        key={chain}
                        className="px-3 py-1 bg-[#0F1317] border border-[#1E293B] text-[#94A3B8] rounded-md text-xs"
                      >
                        {chain}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Swap Preview */}
              <div className="bg-[#11161C] border border-[#1E293B] rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4 font-heading">Auto-Swap Preview</h3>
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <p className="text-[#94A3B8] text-sm mb-1 font-body">From</p>
                    <p className="text-white font-bold font-mono">{vaultData.sourceAsset}</p>
                  </div>
                  <svg className="w-6 h-6 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  <div className="text-center">
                    <p className="text-[#94A3B8] text-sm mb-1 font-body">To</p>
                    <p className="text-white font-bold font-mono">{vaultData.targetAsset}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Key Holders Panel */}
              <div className="bg-[#11161C] border border-[#1E293B] rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-6 font-heading">Key Holders</h2>

                {/* Progress */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[#94A3B8] text-sm font-body">Approval Progress</p>
                    <p className="text-white font-bold font-mono">{approvedCount} of {vaultData.threshold}</p>
                  </div>
                  <div className="h-2 bg-[#1E293B] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#3B82F6] transition-all duration-500"
                      style={{ width: `${(approvedCount / vaultData.threshold) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Holders list */}
                <div className="space-y-3">
                  {vaultData.keyHolders.map((holder) => (
                    <div
                      key={holder.id}
                      className="flex items-center justify-between bg-[#0F1317] border border-[#1E293B] rounded-md p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#3B82F6] rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {holder.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium font-body">{holder.name}</p>
                          <p className="text-[#94A3B8] text-xs font-body">Key Holder</p>
                        </div>
                      </div>
                      
                      {holder.approved ? (
                        <svg className="w-5 h-5 text-[#D1A954]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Unlock Proposal Panel */}
              {isThresholdReached ? (
                <div className="bg-[#11161C] border border-[#1E293B] rounded-lg p-6">
                  <h3 className="text-lg font-bold text-white mb-4 font-heading">Unlock Proposal</h3>
                  <button
                    onClick={() => navigate(`/vault/${id}/unlock`)}
                    className="w-full py-3 bg-[#0F1317] border border-[#3B82F6] text-white rounded-md hover:border-[#60A5FA] transition"
                  >
                    View Proposal Details
                  </button>
                </div>
              ) : isCurrentUserHolder && !hasCurrentUserApproved ? (
                <div className="bg-[#11161C] border border-[#1E293B] rounded-lg p-6">
                  <h3 className="text-lg font-bold text-white mb-4 font-heading">Your Action Required</h3>
                  <button
                    onClick={handleApprove}
                    disabled={approving}
                    className="w-full py-3 bg-[#0F1317] border border-[#3B82F6] text-white rounded-md hover:border-[#60A5FA] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {approving ? 'Approving...' : 'Approve Unlock Request'}
                  </button>
                </div>
              ) : hasCurrentUserApproved ? (
                <div className="bg-[#0F1317] border border-[#10B981]/30 rounded-md p-4">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-[#10B981] text-sm font-medium">You have approved this unlock request</p>
                  </div>
                </div>
              ) : (
                <div className="bg-[#11161C] border border-[#1E293B] rounded-lg p-6">
                  <button
                    onClick={() => navigate(`/vault/${id}/unlock`)}
                    className="w-full py-3 bg-transparent border border-[#3B82F6] text-[#3B82F6] rounded-md hover:bg-[#0F1317] transition"
                  >
                    Create Unlock Proposal
                  </button>
                </div>
              )}

              {/* Timeline */}
              <div className="bg-[#11161C] border border-[#1E293B] rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-6 font-heading">Timeline</h2>
                
                <div className="space-y-4">
                  {[
                    { label: 'Vault Created', status: ['created', 'funding', 'ready', 'unlocking', 'destroyed'] },
                    { label: 'Funding', status: ['funding', 'ready', 'unlocking', 'destroyed'] },
                    { label: 'Unlock Requested', status: ['ready', 'unlocking', 'destroyed'] },
                    { label: 'Executed', status: ['destroyed'] }
                  ].map((step, index, arr) => {
                    const isCompleted = step.status.includes(vaultData.status)
                    const isLast = index === arr.length - 1
                    
                    return (
                      <div key={step.label} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                            isCompleted ? 'border-[#D1A954] bg-transparent' : 'border-[#1E293B] bg-transparent'
                          }`}>
                            <div className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-[#D1A954]' : 'bg-[#1E293B]'}`} />
                          </div>
                          {!isLast && (
                            <div className={`w-0.5 h-8 ${isCompleted ? 'bg-[#D1A954]' : 'bg-[#1E293B]'}`} />
                          )}
                        </div>
                        <div className="flex-1 pb-2">
                          <p className={`text-sm font-medium ${isCompleted ? 'text-white' : 'text-[#94A3B8]'}`}>
                            {step.label}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
