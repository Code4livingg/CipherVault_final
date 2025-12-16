import { motion } from 'framer-motion'
import { useState } from 'react'

interface Recipient {
  id: string
  name: string
  address: string
  percentage: number
  targetAsset: string
}

interface RecipientSplitPanelProps {
  recipients: Recipient[]
  totalAmount: string
  sourceAsset: string
  onUpdateRecipients: (recipients: Recipient[]) => void
  thresholdReached: boolean
}

export default function RecipientSplitPanel({
  recipients,
  totalAmount,
  sourceAsset,
  onUpdateRecipients,
  thresholdReached
}: RecipientSplitPanelProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const handlePercentageChange = (id: string, newPercentage: number) => {
    const updated = recipients.map(r =>
      r.id === id ? { ...r, percentage: Math.max(0, Math.min(100, newPercentage)) } : r
    )
    
    // Normalize to 100%
    const total = updated.reduce((sum, r) => sum + r.percentage, 0)
    if (total > 0) {
      const normalized = updated.map(r => ({
        ...r,
        percentage: (r.percentage / total) * 100
      }))
      onUpdateRecipients(normalized)
    } else {
      onUpdateRecipients(updated)
    }
  }

  const getTokenIcon = (asset: string) => {
    switch (asset) {
      case 'BTC': return '₿'
      case 'ETH': return 'Ξ'
      case 'USDT': return '₮'
      default: return '◆'
    }
  }

  const getTokenColor = (asset: string) => {
    switch (asset) {
      case 'BTC': return '#D1A954'
      case 'ETH': return '#627EEA'
      case 'USDT': return '#26A17B'
      default: return '#8B8B8B'
    }
  }

  const calculateAmount = (percentage: number) => {
    return ((parseFloat(totalAmount) * percentage) / 100).toFixed(8)
  }

  return (
    <div className="recipient-split-panel">
      {/* Header */}
      <div className="split-header">
        <div className="header-title">Recipient Allocation</div>
        <div className="header-total">
          <span className="total-label">Total:</span>
          <span className="total-amount">{totalAmount} {sourceAsset}</span>
        </div>
      </div>

      {/* Recipients List */}
      <div className="recipients-list">
        {recipients.map((recipient, index) => {
          const isHovered = hoveredId === recipient.id
          const tokenColor = getTokenColor(recipient.targetAsset)
          
          return (
            <motion.div
              key={recipient.id}
              className="recipient-item"
              onMouseEnter={() => setHoveredId(recipient.id)}
              onMouseLeave={() => setHoveredId(null)}
              animate={{
                scale: isHovered ? 1.02 : 1,
                boxShadow: isHovered
                  ? `0 0 20px ${tokenColor}40`
                  : '0 0 0px transparent'
              }}
              transition={{ duration: 0.2 }}
            >
              {/* Recipient Info */}
              <div className="recipient-info">
                <div className="recipient-header">
                  <div className="recipient-name">{recipient.name}</div>
                  <motion.div
                    className="token-badge"
                    style={{ borderColor: tokenColor }}
                    animate={{
                      boxShadow: isHovered
                        ? `0 0 15px ${tokenColor}60`
                        : `0 0 5px ${tokenColor}20`
                    }}
                  >
                    <span className="token-icon" style={{ color: tokenColor }}>
                      {getTokenIcon(recipient.targetAsset)}
                    </span>
                    <span className="token-symbol">{recipient.targetAsset}</span>
                  </motion.div>
                </div>
                <div className="recipient-address">
                  {recipient.address.slice(0, 12)}...{recipient.address.slice(-10)}
                </div>
              </div>

              {/* Percentage Slider */}
              <div className="percentage-control">
                <div className="percentage-header">
                  <span className="percentage-label">Allocation</span>
                  <motion.span
                    className="percentage-value"
                    animate={{
                      color: thresholdReached ? '#D1A954' : '#94A3B8'
                    }}
                  >
                    {recipient.percentage.toFixed(1)}%
                  </motion.span>
                </div>

                {/* Hologram Slider */}
                <div className="hologram-slider">
                  <motion.div
                    className="slider-track"
                    animate={{
                      boxShadow: thresholdReached
                        ? '0 0 10px rgba(209, 169, 84, 0.3)'
                        : '0 0 5px rgba(59, 130, 246, 0.2)'
                    }}
                  />
                  <motion.div
                    className="slider-fill"
                    style={{
                      width: `${recipient.percentage}%`,
                      background: thresholdReached
                        ? 'linear-gradient(90deg, #D1A954, #E5C068)'
                        : 'linear-gradient(90deg, #3B82F6, #60A5FA)'
                    }}
                    animate={{
                      boxShadow: thresholdReached
                        ? '0 0 15px rgba(209, 169, 84, 0.5)'
                        : '0 0 10px rgba(59, 130, 246, 0.3)'
                    }}
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="0.1"
                    value={recipient.percentage}
                    onChange={(e) => handlePercentageChange(recipient.id, parseFloat(e.target.value))}
                    className="slider-input"
                  />
                </div>
              </div>

              {/* Amount Display */}
              <div className="amount-display">
                <div className="amount-label">Receives</div>
                <div className="amount-value">
                  <span className="amount-number">
                    {calculateAmount(recipient.percentage)}
                  </span>
                  <span className="amount-asset" style={{ color: tokenColor }}>
                    {recipient.targetAsset}
                  </span>
                </div>
              </div>

              {/* Swap Indicator */}
              {sourceAsset !== recipient.targetAsset && (
                <motion.div
                  className="swap-indicator"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="swap-icon">⇄</div>
                  <div className="swap-text">
                    {sourceAsset} → {recipient.targetAsset}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Total Validation */}
      <motion.div
        className="allocation-total"
        animate={{
          borderColor: Math.abs(recipients.reduce((sum, r) => sum + r.percentage, 0) - 100) < 0.1
            ? '#10B981'
            : '#DC2626'
        }}
      >
        <span className="total-label">Total Allocation:</span>
        <span className="total-percentage">
          {recipients.reduce((sum, r) => sum + r.percentage, 0).toFixed(1)}%
        </span>
      </motion.div>
    </div>
  )
}
