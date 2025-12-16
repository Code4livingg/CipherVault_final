import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo } from 'react'
import { Vault } from '../../lib/api'

interface VaultAnalyticsOverlayProps {
  vault: Vault
  isVisible: boolean
  onClose: () => void
}

interface ActivityDataPoint {
  date: string
  value: number
  holder?: string
}

interface ProposalDataPoint {
  date: string
  count: number
  type: 'created' | 'approved' | 'executed'
}

export default function VaultAnalyticsOverlay({ vault, isVisible, onClose }: VaultAnalyticsOverlayProps) {
  const [activeChart, setActiveChart] = useState<'activity' | 'proposals' | 'routing' | 'expiry'>('activity')

  // Generate mock analytics data
  const analyticsData = useMemo(() => {
    const now = new Date()
    
    // Keyholder activity (last 30 days)
    const activity: ActivityDataPoint[] = vault.keyHolders.flatMap(holder => {
      return Array.from({ length: 30 }, (_, i) => ({
        date: new Date(now.getTime() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        value: Math.random() * 10,
        holder: holder.name
      }))
    })

    // Proposal frequency (last 12 weeks)
    const proposals: ProposalDataPoint[] = Array.from({ length: 12 }, (_, i) => ({
      date: new Date(now.getTime() - (11 - i) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      count: Math.floor(Math.random() * 5),
      type: ['created', 'approved', 'executed'][Math.floor(Math.random() * 3)] as any
    }))

    // Unlock routing history
    const routing = vault.keyHolders.map((holder, i) => ({
      holder: holder.name,
      unlocks: Math.floor(Math.random() * 20),
      avgTime: Math.floor(Math.random() * 48) + 1,
      angle: (i / vault.keyHolders.length) * Math.PI * 2
    }))

    // Expiry heatmap (calendar view)
    const expiryDate = new Date(vault.expiresAt)
    const daysUntilExpiry = Math.floor((expiryDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
    const heatmap = Array.from({ length: 365 }, (_, i) => ({
      day: i,
      intensity: Math.max(0, 1 - Math.abs(i - daysUntilExpiry) / 30)
    }))

    return { activity, proposals, routing, heatmap, daysUntilExpiry }
  }, [vault])

  // Don't render if not visible
  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        className="vault-analytics-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
      >
        {/* Background blur */}
        <div className="vault-analytics-overlay__backdrop" />

        {/* Analytics panel */}
        <motion.div
          className="vault-analytics-overlay__panel"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="vault-analytics-overlay__header">
            <h2 className="vault-analytics-overlay__title">Vault Analytics</h2>
            <motion.button
              className="vault-analytics-overlay__close"
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ✕
            </motion.button>
          </div>

          {/* Chart selector */}
          <div className="vault-analytics-overlay__tabs">
            {(['activity', 'proposals', 'routing', 'expiry'] as const).map((chart) => (
              <motion.button
                key={chart}
                className={`vault-analytics-overlay__tab ${activeChart === chart ? 'vault-analytics-overlay__tab--active' : ''}`}
                onClick={() => setActiveChart(chart)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {chart.charAt(0).toUpperCase() + chart.slice(1)}
              </motion.button>
            ))}
          </div>

          {/* Charts */}
          <div className="vault-analytics-overlay__content">
            <AnimatePresence mode="wait">
              {activeChart === 'activity' && (
                <KeyholderActivityChart key="activity" data={analyticsData.activity} holders={vault.keyHolders} />
              )}
              {activeChart === 'proposals' && (
                <ProposalFrequencyChart key="proposals" data={analyticsData.proposals} />
              )}
              {activeChart === 'routing' && (
                <UnlockRoutingChart key="routing" data={analyticsData.routing} />
              )}
              {activeChart === 'expiry' && (
                <ExpiryHeatmapChart key="expiry" data={analyticsData.heatmap} daysUntil={analyticsData.daysUntilExpiry} />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Keyholder Activity Chart
function KeyholderActivityChart({ data, holders }: { data: ActivityDataPoint[], holders: any[] }) {
  const maxValue = Math.max(...data.map(d => d.value), 1)
  const holderColors = ['#3B82F6', '#D1A954', '#10B981', '#8B5CF6', '#EC4899', '#F59E0B']

  return (
    <motion.div
      className="analytics-chart"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      <h3 className="analytics-chart__title">Keyholder Participation Activity</h3>
      <p className="analytics-chart__subtitle">Last 30 days</p>

      <svg className="analytics-chart__svg" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid meet">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((y) => (
          <motion.line
            key={y}
            x1="50"
            y1={250 - y * 200}
            x2="750"
            y2={250 - y * 200}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: y * 0.1 }}
          />
        ))}

        {/* Activity lines per holder */}
        {holders.map((holder, holderIndex) => {
          const holderData = data.filter(d => d.holder === holder.name)
          const points = holderData.map((d, i) => {
            const x = 50 + (i / 29) * 700
            const y = 250 - (d.value / maxValue) * 200
            return `${x},${y}`
          }).join(' ')

          return (
            <g key={holder.id}>
              {/* Glow effect */}
              <motion.polyline
                points={points}
                fill="none"
                stroke={holderColors[holderIndex % holderColors.length]}
                strokeWidth="3"
                opacity="0.3"
                filter="blur(4px)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: holderIndex * 0.2 }}
              />

              {/* Main line */}
              <motion.polyline
                points={points}
                fill="none"
                stroke={holderColors[holderIndex % holderColors.length]}
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: holderIndex * 0.2 }}
              />

              {/* Particle traces */}
              {holderData.map((d, i) => {
                if (i % 5 !== 0) return null
                const x = 50 + (i / 29) * 700
                const y = 250 - (d.value / maxValue) * 200
                
                return (
                  <motion.circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="3"
                    fill={holderColors[holderIndex % holderColors.length]}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: [0, 1.5, 1],
                      opacity: [0, 1, 0.8]
                    }}
                    transition={{ 
                      duration: 0.5,
                      delay: holderIndex * 0.2 + i * 0.05
                    }}
                  />
                )
              })}
            </g>
          )
        })}

        {/* Axis labels */}
        <text x="25" y="55" fill="rgba(255, 255, 255, 0.5)" fontSize="12" textAnchor="end">High</text>
        <text x="25" y="255" fill="rgba(255, 255, 255, 0.5)" fontSize="12" textAnchor="end">Low</text>
      </svg>

      {/* Legend */}
      <div className="analytics-chart__legend">
        {holders.map((holder, i) => (
          <div key={holder.id} className="analytics-chart__legend-item">
            <div 
              className="analytics-chart__legend-color" 
              style={{ background: holderColors[i % holderColors.length] }}
            />
            <span>{holder.name}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// Proposal Frequency Chart
function ProposalFrequencyChart({ data }: { data: ProposalDataPoint[] }) {
  const maxCount = Math.max(...data.map(d => d.count), 1)

  return (
    <motion.div
      className="analytics-chart"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      <h3 className="analytics-chart__title">Proposal Frequency</h3>
      <p className="analytics-chart__subtitle">Last 12 weeks</p>

      <svg className="analytics-chart__svg" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid meet">
        {/* Bars */}
        {data.map((d, i) => {
          const x = 50 + (i / 11) * 700
          const barWidth = 50
          const height = (d.count / maxCount) * 200
          const y = 250 - height

          return (
            <g key={i}>
              {/* Glow */}
              <motion.rect
                x={x - barWidth / 2}
                y={y}
                width={barWidth}
                height={height}
                fill="#3B82F6"
                opacity="0.3"
                filter="blur(8px)"
                initial={{ height: 0, y: 250 }}
                animate={{ height, y }}
                transition={{ duration: 0.8, delay: i * 0.05 }}
              />

              {/* Bar */}
              <motion.rect
                x={x - barWidth / 2}
                y={y}
                width={barWidth}
                height={height}
                fill="url(#barGradient)"
                initial={{ height: 0, y: 250 }}
                animate={{ height, y }}
                transition={{ duration: 0.8, delay: i * 0.05 }}
              />

              {/* Particle burst */}
              {d.count > 0 && (
                <>
                  {[...Array(3)].map((_, pi) => {
                    const angle = (pi / 3) * Math.PI * 2
                    return (
                      <motion.circle
                        key={pi}
                        cx={x}
                        cy={y}
                        r="2"
                        fill="#D1A954"
                        initial={{ cx: x, cy: y, opacity: 1 }}
                        animate={{
                          cx: x + Math.cos(angle) * 20,
                          cy: y + Math.sin(angle) * 20,
                          opacity: 0
                        }}
                        transition={{
                          duration: 1,
                          delay: i * 0.05 + 0.8,
                          repeat: Infinity,
                          repeatDelay: 2
                        }}
                      />
                    )
                  })}
                </>
              )}
            </g>
          )
        })}

        {/* Gradient definition */}
        <defs>
          <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.3" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  )
}

// Unlock Routing Chart
function UnlockRoutingChart({ data }: { data: any[] }) {
  return (
    <motion.div
      className="analytics-chart"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      <h3 className="analytics-chart__title">Unlock Routing History</h3>
      <p className="analytics-chart__subtitle">Node pulse clusters</p>

      <svg className="analytics-chart__svg" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
        {/* Center node */}
        <motion.circle
          cx="400"
          cy="200"
          r="20"
          fill="#D1A954"
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
        <circle cx="400" cy="200" r="15" fill="#D1A954" opacity="0.8" />

        {/* Holder nodes */}
        {data.map((holder, i) => {
          const x = 400 + Math.cos(holder.angle) * 150
          const y = 200 + Math.sin(holder.angle) * 150
          const pulseSize = (holder.unlocks / 20) * 30 + 10

          return (
            <g key={i}>
              {/* Connection line */}
              <motion.line
                x1="400"
                y1="200"
                x2={x}
                y2={y}
                stroke="#3B82F6"
                strokeWidth="2"
                opacity="0.3"
                initial={{ pathLength: 0 }}
                animate={{ 
                  pathLength: 1,
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  pathLength: { duration: 1, delay: i * 0.2 },
                  opacity: { duration: 2, repeat: Infinity, delay: i * 0.3 }
                }}
              />

              {/* Pulse cluster */}
              <motion.circle
                cx={x}
                cy={y}
                r={pulseSize}
                fill="#3B82F6"
                opacity="0.2"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3
                }}
              />

              {/* Node */}
              <motion.circle
                cx={x}
                cy={y}
                r="12"
                fill="#3B82F6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
              />

              {/* Label */}
              <text
                x={x}
                y={y + 35}
                fill="rgba(255, 255, 255, 0.8)"
                fontSize="12"
                textAnchor="middle"
              >
                {holder.holder}
              </text>
              <text
                x={x}
                y={y + 50}
                fill="rgba(255, 255, 255, 0.5)"
                fontSize="10"
                textAnchor="middle"
              >
                {holder.unlocks} unlocks
              </text>

              {/* Particle traces */}
              {[...Array(3)].map((_, pi) => (
                <motion.circle
                  key={pi}
                  r="2"
                  fill="#D1A954"
                  initial={{ cx: 400, cy: 200, opacity: 0 }}
                  animate={{
                    cx: [400, x],
                    cy: [200, y],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.3 + pi * 0.5,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                />
              ))}
            </g>
          )
        })}
      </svg>
    </motion.div>
  )
}

// Expiry Heatmap Chart
function ExpiryHeatmapChart({ data, daysUntil }: { data: any[], daysUntil: number }) {
  const weeks = 52
  const daysPerWeek = 7

  return (
    <motion.div
      className="analytics-chart"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      <h3 className="analytics-chart__title">Expiry Heatmap</h3>
      <p className="analytics-chart__subtitle">
        {daysUntil > 0 ? `${daysUntil} days until expiry` : 'Expired'}
      </p>

      <svg className="analytics-chart__svg" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid meet">
        {/* Heatmap grid */}
        {Array.from({ length: weeks }, (_, week) => {
          return Array.from({ length: daysPerWeek }, (_, day) => {
            const dayIndex = week * daysPerWeek + day
            if (dayIndex >= 365) return null

            const dataPoint = data[dayIndex]
            const x = 50 + week * 14
            const y = 50 + day * 14
            const intensity = dataPoint.intensity

            return (
              <motion.rect
                key={dayIndex}
                x={x}
                y={y}
                width="12"
                height="12"
                rx="2"
                fill={intensity > 0.7 ? '#DC2626' : intensity > 0.4 ? '#D1A954' : '#3B82F6'}
                opacity={intensity * 0.8}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: intensity * 0.8 }}
                transition={{ duration: 0.3, delay: dayIndex * 0.001 }}
              />
            )
          })
        })}

        {/* Heat ring around expiry date */}
        {daysUntil >= 0 && daysUntil < 365 && (
          <motion.circle
            cx={50 + Math.floor(daysUntil / 7) * 14 + 6}
            cy={50 + (daysUntil % 7) * 14 + 6}
            r="20"
            fill="none"
            stroke="#D1A954"
            strokeWidth="2"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.8, 0.3, 0.8]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        )}
      </svg>

      {/* Legend */}
      <div className="analytics-chart__legend">
        <div className="analytics-chart__legend-item">
          <div className="analytics-chart__legend-color" style={{ background: '#3B82F6' }} />
          <span>Low activity</span>
        </div>
        <div className="analytics-chart__legend-item">
          <div className="analytics-chart__legend-color" style={{ background: '#D1A954' }} />
          <span>Medium activity</span>
        </div>
        <div className="analytics-chart__legend-item">
          <div className="analytics-chart__legend-color" style={{ background: '#DC2626' }} />
          <span>High activity</span>
        </div>
      </div>
    </motion.div>
  )
}
