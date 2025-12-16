import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { use3DTilt } from '../../hooks/use3DTilt'
import { Vault } from '../../lib/api'

interface VaultMiniHologramProps {
  vault: Vault
  index: number
}

export default function VaultMiniHologram({ vault, index }: VaultMiniHologramProps) {
  const navigate = useNavigate()
  const { tiltX, tiltY, handleMouseMove, handleMouseLeave } = use3DTilt()
  const [isHovered, setIsHovered] = useState(false)

  // Calculate time until expiry
  const expiryInfo = useMemo(() => {
    const now = new Date()
    const expiry = new Date(vault.expiresAt)
    const diff = expiry.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)
    
    const isExpiringSoon = hours < 48 && hours > 0
    const isExpired = diff < 0
    
    return {
      hours,
      days,
      isExpiringSoon,
      isExpired,
      label: isExpired 
        ? 'Expired' 
        : days > 0 
          ? `${days}d` 
          : `${hours}h`
    }
  }, [vault.expiresAt])

  // Status colors
  const statusColors = {
    created: { border: '#6B7280', glow: 'rgba(107, 116, 128, 0.3)', label: 'Created' },
    funding: { border: '#D1A954', glow: 'rgba(209, 169, 84, 0.3)', label: 'Funding' },
    ready: { border: '#10B981', glow: 'rgba(16, 185, 129, 0.3)', label: 'Ready' },
    unlocking: { border: '#3B82F6', glow: 'rgba(59, 130, 246, 0.3)', label: 'Unlocking' },
    destroyed: { border: '#DC2626', glow: 'rgba(220, 38, 38, 0.3)', label: 'Destroyed' }
  }

  const statusColor = statusColors[vault.status]

  // MPC node positions (mini version)
  const nodeCount = vault.keyHolders.length
  const approvedCount = vault.keyHolders.filter(kh => kh.approved).length

  const handleOpen = () => {
    navigate(`/vault/${vault.id}`)
  }

  const handleUnlock = () => {
    navigate(`/vault/${vault.id}/unlock`)
  }

  const handleStats = () => {
    navigate(`/vault/${vault.id}`)
  }

  return (
    <motion.div
      className="vault-mini-hologram"
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        delay: index * 0.05,
        type: 'spring',
        stiffness: 300,
        damping: 30
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        handleMouseLeave()
      }}
      onMouseMove={handleMouseMove}
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d'
      }}
    >
      <motion.div
        className="vault-mini-hologram__inner"
        animate={{
          rotateX: tiltY * 0.5,
          rotateY: tiltX * 0.5,
          boxShadow: isHovered
            ? `0 20px 40px ${statusColor.glow}, 0 0 20px ${statusColor.glow}`
            : `0 10px 20px rgba(0, 0, 0, 0.3)`
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          borderColor: statusColor.border,
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Hologram border glow */}
        <motion.div
          className="vault-mini-hologram__border-glow"
          style={{
            background: `linear-gradient(90deg, transparent, ${statusColor.border}, transparent)`
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

        {/* Expiry ring (pulsing if close to expiration) */}
        {expiryInfo.isExpiringSoon && !expiryInfo.isExpired && (
          <motion.div
            className="vault-mini-hologram__expiry-ring"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            style={{
              borderColor: '#D1A954',
              boxShadow: '0 0 20px rgba(209, 169, 84, 0.5)'
            }}
          />
        )}

        {/* Floating particles */}
        {isHovered && (
          <>
            {[...Array(6)].map((_, i) => {
              const angle = (i / 6) * Math.PI * 2
              return (
                <motion.div
                  key={i}
                  className="vault-mini-hologram__particle"
                  style={{
                    background: statusColor.border
                  }}
                  animate={{
                    x: [
                      Math.cos(angle) * 60,
                      Math.cos(angle + Math.PI) * 60,
                      Math.cos(angle) * 60
                    ],
                    y: [
                      Math.sin(angle) * 60,
                      Math.sin(angle + Math.PI) * 60,
                      Math.sin(angle) * 60
                    ],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{
                    duration: 3 + i * 0.3,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                />
              )
            })}
          </>
        )}

        {/* Header */}
        <div className="vault-mini-hologram__header">
          <div className="vault-mini-hologram__status-badge" style={{ borderColor: statusColor.border, color: statusColor.border }}>
            {statusColor.label}
          </div>
          <div className="vault-mini-hologram__expiry" style={{ color: expiryInfo.isExpiringSoon ? '#D1A954' : '#6B7280' }}>
            {expiryInfo.label}
          </div>
        </div>

        {/* Vault name */}
        <h3 className="vault-mini-hologram__name">{vault.name}</h3>

        {/* Mini MPC Network */}
        <div className="vault-mini-hologram__mpc-network">
          <svg width="100" height="100" viewBox="0 0 100 100">
            {/* Center node */}
            <motion.circle
              cx="50"
              cy="50"
              r="8"
              fill={statusColor.border}
              opacity="0.3"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />

            {/* Rotating nodes */}
            {[...Array(nodeCount)].map((_, i) => {
              const angle = (i / nodeCount) * Math.PI * 2 - Math.PI / 2
              const x = 50 + Math.cos(angle) * 30
              const y = 50 + Math.sin(angle) * 30
              const isApproved = i < approvedCount

              return (
                <g key={i}>
                  {/* Connection line */}
                  <motion.line
                    x1="50"
                    y1="50"
                    x2={x}
                    y2={y}
                    stroke={isApproved ? statusColor.border : '#6B7280'}
                    strokeWidth="1"
                    opacity="0.3"
                    animate={{
                      opacity: isApproved ? [0.3, 0.6, 0.3] : 0.2
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.2
                    }}
                  />

                  {/* Node */}
                  <motion.circle
                    cx={x}
                    cy={y}
                    r="4"
                    fill={isApproved ? statusColor.border : '#6B7280'}
                    animate={{
                      scale: isApproved ? [1, 1.3, 1] : 1,
                      rotate: [0, 360]
                    }}
                    transition={{
                      scale: {
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: i * 0.2
                      },
                      rotate: {
                        duration: 20,
                        repeat: Infinity,
                        ease: 'linear'
                      }
                    }}
                    style={{ transformOrigin: '50px 50px' }}
                  />
                </g>
              )
            })}
          </svg>
        </div>

        {/* Balance ticker */}
        <div className="vault-mini-hologram__balance">
          <div className="vault-mini-hologram__balance-label">Balance</div>
          <motion.div
            className="vault-mini-hologram__balance-value"
            animate={{
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            {parseFloat(vault.totalDeposits) > 0 
              ? `${parseFloat(vault.totalDeposits).toFixed(8)} ${vault.sourceAsset}`
              : `0 ${vault.sourceAsset}`
            }
          </motion.div>
        </div>

        {/* Key holders info */}
        <div className="vault-mini-hologram__info">
          <div className="vault-mini-hologram__info-item">
            <span className="vault-mini-hologram__info-label">Threshold</span>
            <span className="vault-mini-hologram__info-value">{approvedCount}/{vault.threshold}</span>
          </div>
          <div className="vault-mini-hologram__info-item">
            <span className="vault-mini-hologram__info-label">Holders</span>
            <span className="vault-mini-hologram__info-value">{nodeCount}</span>
          </div>
        </div>

        {/* Quick actions */}
        <div className="vault-mini-hologram__actions">
          <motion.button
            className="vault-mini-hologram__action-btn vault-mini-hologram__action-btn--primary"
            onClick={handleOpen}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ borderColor: statusColor.border, color: statusColor.border }}
          >
            OPEN
          </motion.button>
          
          {vault.status === 'ready' && (
            <motion.button
              className="vault-mini-hologram__action-btn vault-mini-hologram__action-btn--secondary"
              onClick={handleUnlock}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              UNLOCK
            </motion.button>
          )}
          
          <motion.button
            className="vault-mini-hologram__action-btn vault-mini-hologram__action-btn--tertiary"
            onClick={handleStats}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            STATS
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}
