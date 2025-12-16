import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../contexts/ToastContext'
import { useRoleGuard } from '../../security/useRoleGuard'
import OrgVaultTile from '../../components/vault/OrgVaultTile'
import InviteMemberPanel from '../../components/org/InviteMemberPanel'
import { Vault } from '../../lib/api'
import { OrgVaultStats } from '../../types/organization'

export default function OrgVaultDashboard() {
  const navigate = useNavigate()
  const { info, error } = useToast()
  const { can, role } = useRoleGuard('ADMIN') // Mock role
  
  const [vaults, setVaults] = useState<Vault[]>([])
  const [vaultStats, setVaultStats] = useState<Map<string, OrgVaultStats>>(new Map())
  const [loading, setLoading] = useState(true)
  const [showInvitePanel, setShowInvitePanel] = useState(false)

  useEffect(() => {
    fetchOrgVaults()
  }, [])

  const fetchOrgVaults = async () => {
    try {
      setLoading(true)
      // TODO: API call
      // const data = await getOrgVaults(orgId)
      
      // Mock data
      const mockVaults: Vault[] = [
        {
          id: '1',
          name: 'Treasury Vault',
          status: 'ready',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          keyHolders: [
            { id: '1', name: 'Alice', approved: true, approvedAt: new Date().toISOString() },
            { id: '2', name: 'Bob', approved: true, approvedAt: new Date().toISOString() },
            { id: '3', name: 'Charlie', approved: false }
          ],
          threshold: 2,
          totalDeposits: '2.5',
          sourceAsset: 'BTC',
          targetAsset: 'BTC',
          depositAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
          supportedChains: ['bitcoin'],
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          autoSwap: false
        }
      ]
      
      const mockStats = new Map<string, OrgVaultStats>([
        ['1', {
          vaultId: '1',
          memberParticipation: 85,
          avgSigningLatency: 12,
          proposalCount: 5,
          lastActivity: new Date().toISOString(),
          riskLevel: 'low',
          signerAvailability: 90
        }]
      ])
      
      setVaults(mockVaults)
      setVaultStats(mockStats)
      info('Organization vaults loaded')
    } catch (err) {
      error('Failed to load vaults')
    } finally {
      setLoading(false)
    }
  }

  const stats = {
    total: vaults.length,
    active: vaults.filter(v => v.status !== 'destroyed').length,
    risky: Array.from(vaultStats.values()).filter(s => s.riskLevel === 'high').length,
    totalValue: vaults.reduce((sum, v) => sum + parseFloat(v.totalDeposits), 0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0E1A] via-[#11161C] to-[#0A0E1A] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Organization Vaults
              </h1>
              <p className="text-gray-400">Manage your team's multi-signature vaults</p>
            </div>
            
            <div className="flex gap-3">
              {can('canInviteMembers') && (
                <motion.button
                  onClick={() => setShowInvitePanel(true)}
                  className="px-6 py-3 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 font-semibold hover:bg-purple-500/30 transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  + Invite Member
                </motion.button>
              )}
              
              {can('canCreateVaults') && (
                <motion.button
                  onClick={() => navigate('/create')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  + Create Vault
                </motion.button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <motion.div
              className="bg-[rgba(17,22,28,0.6)] backdrop-blur-xl border border-blue-500/20 rounded-xl p-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-3xl font-bold text-blue-400 mb-1">{stats.total}</div>
              <div className="text-sm text-gray-400">Total Vaults</div>
            </motion.div>

            <motion.div
              className="bg-[rgba(17,22,28,0.6)] backdrop-blur-xl border border-emerald-500/20 rounded-xl p-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
            >
              <div className="text-3xl font-bold text-emerald-400 mb-1">{stats.active}</div>
              <div className="text-sm text-gray-400">Active</div>
            </motion.div>

            <motion.div
              className="bg-[rgba(17,22,28,0.6)] backdrop-blur-xl border border-red-500/20 rounded-xl p-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-3xl font-bold text-red-400 mb-1">{stats.risky}</div>
              <div className="text-sm text-gray-400">Risky</div>
            </motion.div>

            <motion.div
              className="bg-[rgba(17,22,28,0.6)] backdrop-blur-xl border border-gold-500/20 rounded-xl p-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 }}
            >
              <div className="text-3xl font-bold text-[#D1A954] mb-1">{stats.totalValue.toFixed(2)} BTC</div>
              <div className="text-sm text-gray-400">Total Value</div>
            </motion.div>
          </div>
        </motion.div>

        {/* Vaults Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-white">Loading vaults...</div>
          </div>
        ) : vaults.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-6xl mb-4">🔐</div>
            <h3 className="text-xl font-semibold text-white mb-2">No vaults yet</h3>
            <p className="text-gray-400 mb-6">Create your first organization vault</p>
            {can('canCreateVaults') && (
              <button
                onClick={() => navigate('/create')}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Create Vault
              </button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vaults.map((vault, index) => (
              <OrgVaultTile
                key={vault.id}
                vault={vault}
                stats={vaultStats.get(vault.id)}
                index={index}
                userRole={role}
              />
            ))}
          </div>
        )}
      </div>

      {/* Invite Panel */}
      {showInvitePanel && (
        <InviteMemberPanel
          orgId="org-1"
          onClose={() => setShowInvitePanel(false)}
          onInviteSent={() => {}}
        />
      )}
    </div>
  )
}
