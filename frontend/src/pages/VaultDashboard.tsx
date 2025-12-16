import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import VaultMiniHologram from '../components/vault/VaultMiniHologram'
import { Vault } from '../lib/api'
import { useToast } from '../contexts/ToastContext'

export default function VaultDashboard() {
  const navigate = useNavigate()
  const { info, error } = useToast()
  const [vaults, setVaults] = useState<Vault[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'funding' | 'ready'>('all')

  useEffect(() => {
    fetchVaults()
  }, [])

  const fetchVaults = async () => {
    try {
      setLoading(true)
      // TODO: Replace with actual API call when endpoint is available
      // const response = await api.get('/vaults')
      // setVaults(response.data)
      
      // Mock data for now
      const mockVaults: Vault[] = [
        {
          id: '1',
          name: 'Emergency Fund',
          description: 'Family emergency vault',
          status: 'ready',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          keyHolders: [
            { id: '1', name: 'Alice', approved: true, approvedAt: new Date().toISOString() },
            { id: '2', name: 'Bob', approved: true, approvedAt: new Date().toISOString() },
            { id: '3', name: 'Charlie', approved: false }
          ],
          threshold: 2,
          totalDeposits: '0.5',
          sourceAsset: 'BTC',
          targetAsset: 'BTC',
          depositAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
          supportedChains: ['bitcoin'],
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          autoSwap: false
        },
        {
          id: '2',
          name: 'Business Vault',
          description: 'Company treasury',
          status: 'funding',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          keyHolders: [
            { id: '1', name: 'CEO', approved: false },
            { id: '2', name: 'CFO', approved: false },
            { id: '3', name: 'CTO', approved: false }
          ],
          threshold: 2,
          totalDeposits: '0',
          sourceAsset: 'BTC',
          targetAsset: 'USDT',
          depositAddress: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
          supportedChains: ['bitcoin'],
          expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          autoSwap: true
        },
        {
          id: '3',
          name: 'Inheritance Vault',
          description: 'Long-term storage',
          status: 'ready',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          keyHolders: [
            { id: '1', name: 'Trustee 1', approved: true, approvedAt: new Date().toISOString() },
            { id: '2', name: 'Trustee 2', approved: true, approvedAt: new Date().toISOString() },
            { id: '3', name: 'Trustee 3', approved: true, approvedAt: new Date().toISOString() },
            { id: '4', name: 'Trustee 4', approved: false }
          ],
          threshold: 3,
          totalDeposits: '1.25',
          sourceAsset: 'BTC',
          targetAsset: 'BTC',
          depositAddress: 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4',
          supportedChains: ['bitcoin'],
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          autoSwap: false
        },
        {
          id: '4',
          name: 'Trading Pool',
          description: 'Multi-sig trading',
          status: 'unlocking',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          keyHolders: [
            { id: '1', name: 'Trader 1', approved: true, approvedAt: new Date().toISOString() },
            { id: '2', name: 'Trader 2', approved: true, approvedAt: new Date().toISOString() }
          ],
          threshold: 2,
          totalDeposits: '0.75',
          sourceAsset: 'BTC',
          targetAsset: 'ETH',
          depositAddress: 'bc1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3qccfmv3',
          supportedChains: ['bitcoin'],
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          autoSwap: true
        }
      ]
      
      setVaults(mockVaults)
      info('Vaults loaded successfully')
    } catch (err) {
      error('Failed to load vaults')
      console.error('Error fetching vaults:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredVaults = vaults.filter(vault => {
    if (filter === 'all') return true
    if (filter === 'active') return vault.status !== 'destroyed'
    if (filter === 'funding') return vault.status === 'funding'
    if (filter === 'ready') return vault.status === 'ready'
    return true
  })

  const stats = {
    total: vaults.length,
    active: vaults.filter(v => v.status !== 'destroyed').length,
    funding: vaults.filter(v => v.status === 'funding').length,
    ready: vaults.filter(v => v.status === 'ready').length,
    totalBalance: vaults.reduce((sum, v) => sum + parseFloat(v.totalDeposits), 0)
  }

  return (
    <div className="vault-dashboard">
      {/* Background */}
      <div className="vault-dashboard__background" />

      {/* Header */}
      <motion.div
        className="vault-dashboard__header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="vault-dashboard__header-content">
          <div>
            <h1 className="vault-dashboard__title">Vault Dashboard</h1>
            <p className="vault-dashboard__subtitle">Manage your multi-signature vaults</p>
          </div>
          
          <motion.button
            className="vault-dashboard__create-btn"
            onClick={() => navigate('/create')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            + Create Vault
          </motion.button>
        </div>

        {/* Stats */}
        <div className="vault-dashboard__stats">
          <motion.div
            className="vault-dashboard__stat"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="vault-dashboard__stat-value">{stats.total}</div>
            <div className="vault-dashboard__stat-label">Total Vaults</div>
          </motion.div>

          <motion.div
            className="vault-dashboard__stat"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
          >
            <div className="vault-dashboard__stat-value">{stats.active}</div>
            <div className="vault-dashboard__stat-label">Active</div>
          </motion.div>

          <motion.div
            className="vault-dashboard__stat"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="vault-dashboard__stat-value">{stats.ready}</div>
            <div className="vault-dashboard__stat-label">Ready</div>
          </motion.div>

          <motion.div
            className="vault-dashboard__stat vault-dashboard__stat--highlight"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
          >
            <div className="vault-dashboard__stat-value">{stats.totalBalance.toFixed(4)} BTC</div>
            <div className="vault-dashboard__stat-label">Total Balance</div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="vault-dashboard__filters">
          {(['all', 'active', 'funding', 'ready'] as const).map((f) => (
            <motion.button
              key={f}
              className={`vault-dashboard__filter ${filter === f ? 'vault-dashboard__filter--active' : ''}`}
              onClick={() => setFilter(f)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Vault Grid */}
      {loading ? (
        <div className="vault-dashboard__loading">
          <motion.div
            className="vault-dashboard__loading-spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p>Loading vaults...</p>
        </div>
      ) : filteredVaults.length === 0 ? (
        <motion.div
          className="vault-dashboard__empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="vault-dashboard__empty-icon">🔐</div>
          <h3 className="vault-dashboard__empty-title">No vaults found</h3>
          <p className="vault-dashboard__empty-text">
            {filter === 'all' 
              ? 'Create your first vault to get started'
              : `No ${filter} vaults available`
            }
          </p>
          {filter === 'all' && (
            <motion.button
              className="vault-dashboard__empty-btn"
              onClick={() => navigate('/create')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Create Vault
            </motion.button>
          )}
        </motion.div>
      ) : (
        <div className="vault-dashboard__grid">
          {filteredVaults.map((vault, index) => (
            <VaultMiniHologram key={vault.id} vault={vault} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}
