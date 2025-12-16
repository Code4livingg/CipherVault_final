import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface Recipient {
  id: string
  name: string
  address: string
  percentage: number
  targetAsset: string
}

interface SmartRoutingPreviewProps {
  recipients: Recipient[]
  sourceAsset: string
  totalAmount: string
  thresholdReached: boolean
}

export default function SmartRoutingPreview({
  recipients,
  sourceAsset,
  totalAmount,
  thresholdReached
}: SmartRoutingPreviewProps) {
  const [activeRoute, setActiveRoute] = useState<number>(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveRoute(prev => (prev + 1) % recipients.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [recipients.length])

  const getTokenPosition = (index: number, total: number) => {
    const angle = (index / total) * Math.PI * 2 - Math.PI / 2
    const radius = 120
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius
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

  const getTokenIcon = (asset: string) => {
    switch (asset) {
      case 'BTC': return '₿'
      case 'ETH': return 'Ξ'
      case 'USDT': return '₮'
      default: return '◆'
    }
  }

  return (
    <div className="smart-routing-preview">
      {/* Header */}
      <div className="routing-header">
        <div className="header-title">Smart Routing</div>
        <motion.div
          className="threshold-indicator"
          animate={{
            opacity: thresholdReached ? [0.5, 1, 0.5] : 0.3,
            boxShadow: thresholdReached
              ? [
                  '0 0 10px rgba(209, 169, 84, 0.3)',
                  '0 0 20px rgba(209, 169, 84, 0.6)',
                  '0 0 10px rgba(209, 169, 84, 0.3)'
                ]
              : '0 0 5px rgba(59, 130, 246, 0.2)'
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="threshold-dot" />
          <div className="threshold-text">
            {thresholdReached ? 'Threshold Reached' : 'Awaiting Threshold'}
          </div>
        </motion.div>
      </div>

      {/* Route Graph */}
      <div className="route-graph">
        <svg className="route-svg" viewBox="-200 -200 400 400">
          {/* Center Source Node */}
          <motion.g
            animate={{
              scale: thresholdReached ? [1, 1.1, 1] : 1
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <circle
              cx="0"
              cy="0"
              r="40"
              fill="rgba(59, 130, 246, 0.1)"
              stroke="#3B82F6"
              strokeWidth="2"
            />
            <text
              x="0"
              y="8"
              textAnchor="middle"
              fill="#3B82F6"
              fontSize="24"
              fontWeight="600"
            >
              {getTokenIcon(sourceAsset)}
            </text>
          </motion.g>

          {/* Routes to Recipients */}
          {recipients.map((recipient, index) => {
            const pos = getTokenPosition(index, recipients.length)
            const isActive = activeRoute === index
            const tokenColor = getTokenColor(recipient.targetAsset)
            const needsSwap = sourceAsset !== recipient.targetAsset

            return (
              <g key={recipient.id}>
                {/* Routing Line */}
                <motion.line
                  x1="0"
                  y1="0"
                  x2={pos.x}
                  y2={pos.y}
                  stroke={isActive ? '#D1A954' : '#1E293B'}
                  strokeWidth={isActive ? 3 : 1.5}
                  strokeDasharray={needsSwap ? '5 5' : 'none'}
                  initial={{ pathLength: 0 }}
                  animate={{
                    pathLength: 1,
                    stroke: isActive ? '#D1A954' : '#1E293B',
                    strokeWidth: isActive ? 3 : 1.5
                  }}
                  transition={{ duration: 0.5 }}
                />

                {/* Animated Particles on Route */}
                {isActive && (
                  <>
                    {[...Array(3)].map((_, i) => (
                      <motion.circle
                        key={i}
                        r="3"
                        fill="#D1A954"
                        initial={{ cx: 0, cy: 0, opacity: 0 }}
                        animate={{
                          cx: pos.x,
                          cy: pos.y,
                          opacity: [0, 1, 0]
                        }}
                        transition={{
                          duration: 1.5,
                          delay: i * 0.5,
                          repeat: Infinity
                        }}
                      />
                    ))}
                  </>
                )}

                {/* Swap Point (if needed) */}
                {needsSwap && (
                  <motion.g
                    animate={{
                      opacity: isActive ? 1 : 0.3,
                      scale: isActive ? [1, 1.2, 1] : 1
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <circle
                      cx={pos.x / 2}
                      cy={pos.y / 2}
                      r="15"
                      fill="rgba(209, 169, 84, 0.1)"
                      stroke="#D1A954"
                      strokeWidth="1.5"
                    />
                    <text
                      x={pos.x / 2}
                      y={pos.y / 2 + 5}
                      textAnchor="middle"
                      fill="#D1A954"
                      fontSize="12"
                    >
                      ⇄
                    </text>
                  </motion.g>
                )}

                {/* Recipient Node */}
                <motion.g
                  animate={{
                    scale: isActive ? 1.1 : 1
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="35"
                    fill={`${tokenColor}10`}
                    stroke={tokenColor}
                    strokeWidth="2"
                  />
                  <text
                    x={pos.x}
                    y={pos.y + 6}
                    textAnchor="middle"
                    fill={tokenColor}
                    fontSize="20"
                    fontWeight="600"
                  >
                    {getTokenIcon(recipient.targetAsset)}
                  </text>
                  
                  {/* Percentage Badge */}
                  <motion.g
                    animate={{
                      opacity: isActive ? 1 : 0.6
                    }}
                  >
                    <rect
                      x={pos.x - 20}
                      y={pos.y + 25}
                      width="40"
                      height="16"
                      rx="8"
                      fill="rgba(17, 22, 28, 0.9)"
                      stroke={tokenColor}
                      strokeWidth="1"
                    />
                    <text
                      x={pos.x}
                      y={pos.y + 36}
                      textAnchor="middle"
                      fill={tokenColor}
                      fontSize="10"
                      fontWeight="600"
                    >
                      {recipient.percentage.toFixed(0)}%
                    </text>
                  </motion.g>
                </motion.g>
              </g>
            )
          })}

          {/* Center Amount Label */}
          <text
            x="0"
            y="-55"
            textAnchor="middle"
            fill="#94A3B8"
            fontSize="10"
            fontWeight="500"
          >
            {totalAmount} {sourceAsset}
          </text>
        </svg>
      </div>

      {/* Route Legend */}
      <div className="route-legend">
        <div className="legend-item">
          <div className="legend-line solid" />
          <span className="legend-text">Direct Transfer</span>
        </div>
        <div className="legend-item">
          <div className="legend-line dashed" />
          <span className="legend-text">Auto-Swap via SideShift</span>
        </div>
        <div className="legend-item">
          <div className="legend-icon">⇄</div>
          <span className="legend-text">Swap Point</span>
        </div>
      </div>

      {/* Active Route Info */}
      <motion.div
        className="active-route-info"
        key={activeRoute}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
      >
        <div className="route-recipient">{recipients[activeRoute]?.name}</div>
        <div className="route-details">
          {sourceAsset !== recipients[activeRoute]?.targetAsset ? (
            <span className="route-swap">
              Swapping {sourceAsset} → {recipients[activeRoute]?.targetAsset}
            </span>
          ) : (
            <span className="route-direct">Direct transfer</span>
          )}
        </div>
      </motion.div>
    </div>
  )
}
