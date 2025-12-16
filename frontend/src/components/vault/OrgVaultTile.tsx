import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Vault } from '../../lib/api'
import { OrgVaultStats, OrgRole } from '../../types/organization'
import { use3DTilt } from '../../hooks/use3DTilt'

interface OrgVaultTileProps {
  vault: Vault
  stats?: OrgVaultStats
  index: number
  userRole: OrgRole | null
}

export default function OrgVaultTile({ vault, stats, index }: OrgVaultTileProps) {
  const navigate = useNavigate()
  const { tiltX, tiltY, handleMouseMove, handleMouseLeave } = use3DTilt()

  const riskColors = {
    low: { border: '#10B981', glow: 'rgba(16, 185, 129, 0.3)', label: 'Low Risk' },
    medium: { border: '#D1A954', glow: 'rgba(209, 169, 84, 0.3)', label: 'Medium Risk' },
    high: { border: '#DC2626', glow: 'rgba(220, 38, 38, 0.3)', label: 'High Risk' }
  }

  const riskColor = stats ? riskColors[stats.riskLevel] : riskColors.low

  return (
    <motion.div
      className="org-vault-tile"
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
    >
      <motion.div
        className="org-vault-tile__inner"
        animate={{
          rotateX: tiltY * 0.3,
          rotateY: tiltX * 0.3
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          borderColor: riskColor.border,
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Risk indicator */}
        <div className="org-vault-tile__risk" style={{ backgroundColor: `${riskColor.border}20`, color: riskColor.border }}>
          {riskColor.label}
        </div>

        {/* Vault name */}
        <h3 className="org-vault-tile__name">{vault.name}</h3>

        {/* Balance */}
        <div className="org-vault-tile__balance">
          <div className="text-2xl font-bold text-[#D1A954]">
            {parseFloat(vault.totalDeposits).toFixed(4)} {vault.sourceAsset}
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="org-vault-tile__stats">
            <div className="org-vault-tile__stat">
              <div className="org-vault-tile__stat-label">Participation</div>
              <div className="org-vault-tile__stat-bar">
                <motion.div
                  className="org-vault-tile__stat-fill"
                  style={{ backgroundColor: '#3B82F6' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.memberParticipation}%` }}
                  transition={{ duration: 1, delay: index * 0.05 + 0.3 }}
                />
              </div>
              <div className="org-vault-tile__stat-value">{stats.memberParticipation}%</div>
            </div>

            <div className="org-vault-tile__stat">
              <div className="org-vault-tile__stat-label">Signer Availability</div>
              <div className="org-vault-tile__stat-bar">
                <motion.div
                  className="org-vault-tile__stat-fill"
                  style={{ backgroundColor: stats.signerAvailability > 70 ? '#10B981' : '#D1A954' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.signerAvailability}%` }}
                  transition={{ duration: 1, delay: index * 0.05 + 0.4 }}
                />
              </div>
              <div className="org-vault-tile__stat-value">{stats.signerAvailability}%</div>
            </div>

            <div className="org-vault-tile__info-grid">
              <div>
                <div className="text-xs text-gray-500">Avg Signing</div>
                <div className="text-sm font-semibold text-white">{stats.avgSigningLatency}m</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Proposals</div>
                <div className="text-sm font-semibold text-white">{stats.proposalCount}</div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="org-vault-tile__actions">
          <motion.button
            onClick={() => navigate(`/vault/${vault.id}`)}
            className="org-vault-tile__action-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Details
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}
