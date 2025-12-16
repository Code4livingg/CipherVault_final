import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo } from 'react'
import { TeamAnalytics } from '../../types/organization'

interface TeamAnalyticsOverlayProps {
  orgId: string
  isVisible: boolean
  onClose: () => void
}

export default function TeamAnalyticsOverlay({ orgId, isVisible, onClose }: TeamAnalyticsOverlayProps) {
  const [activeChart, setActiveChart] = useState<'delay' | 'reliability' | 'proposals'>('delay')

  // Generate mock analytics
  const analytics = useMemo<TeamAnalytics>(() => ({
    signingDelayHeatmap: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      avgDelay: Math.random() * 60,
      maxDelay: Math.random() * 120
    })),
    reliabilityGraph: [
      { memberId: '1', memberName: 'Alice', reliability: 98, trend: 'up' },
      { memberId: '2', memberName: 'Bob', reliability: 92, trend: 'stable' },
      { memberId: '3', memberName: 'Charlie', reliability: 85, trend: 'down' }
    ],
    proposalTrends: Array.from({ length: 12 }, (_, i) => ({
      week: `W${i + 1}`,
      created: Math.floor(Math.random() * 10),
      approved: Math.floor(Math.random() * 8),
      rejected: Math.floor(Math.random() * 2),
      executed: Math.floor(Math.random() * 6)
    }))
  }), [orgId])

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        className="team-analytics-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <div className="team-analytics-overlay__backdrop" />

        <motion.div
          className="team-analytics-overlay__panel"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="team-analytics-overlay__header">
            <h2 className="team-analytics-overlay__title">Team Analytics</h2>
            <button className="team-analytics-overlay__close" onClick={onClose}>✕</button>
          </div>

          {/* Tabs */}
          <div className="team-analytics-overlay__tabs">
            {(['delay', 'reliability', 'proposals'] as const).map((chart) => (
              <button
                key={chart}
                className={`team-analytics-overlay__tab ${activeChart === chart ? 'team-analytics-overlay__tab--active' : ''}`}
                onClick={() => setActiveChart(chart)}
              >
                {chart.charAt(0).toUpperCase() + chart.slice(1)}
              </button>
            ))}
          </div>

          {/* Charts */}
          <div className="team-analytics-overlay__content">
            <AnimatePresence mode="wait">
              {activeChart === 'delay' && (
                <SigningDelayHeatmap key="delay" data={analytics.signingDelayHeatmap} />
              )}
              {activeChart === 'reliability' && (
                <ReliabilityGraph key="reliability" data={analytics.reliabilityGraph} />
              )}
              {activeChart === 'proposals' && (
                <ProposalTrends key="proposals" data={analytics.proposalTrends} />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Signing Delay Heatmap
function SigningDelayHeatmap({ data }: { data: TeamAnalytics['signingDelayHeatmap'] }) {
  const maxDelay = Math.max(...data.map(d => d.maxDelay))

  return (
    <motion.div
      className="analytics-chart"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      <h3 className="analytics-chart__title">Signing Delay Heatmap</h3>
      <p className="analytics-chart__subtitle">Last 30 days</p>

      <svg className="analytics-chart__svg" viewBox="0 0 800 300">
        {data.map((d, i) => {
          const x = 50 + (i / 29) * 700
          const intensity = d.avgDelay / maxDelay
          const color = intensity > 0.7 ? '#DC2626' : intensity > 0.4 ? '#D1A954' : '#10B981'

          return (
            <g key={i}>
              <motion.rect
                x={x - 10}
                y={50}
                width={20}
                height={200}
                fill={color}
                opacity={intensity * 0.8}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.5, delay: i * 0.02 }}
                style={{ transformOrigin: 'center bottom' }}
              />
            </g>
          )
        })}
      </svg>
    </motion.div>
  )
}

// Reliability Graph
function ReliabilityGraph({ data }: { data: TeamAnalytics['reliabilityGraph'] }) {
  return (
    <motion.div
      className="analytics-chart"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      <h3 className="analytics-chart__title">Keyholder Reliability</h3>
      <p className="analytics-chart__subtitle">Current scores</p>

      <div className="space-y-4 mt-6">
        {data.map((member, i) => (
          <motion.div
            key={member.memberId}
            className="p-4 bg-white/5 rounded-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-white">{member.memberName}</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-[#D1A954]">{member.reliability}%</span>
                <span className={`text-sm ${
                  member.trend === 'up' ? 'text-emerald-400' :
                  member.trend === 'down' ? 'text-red-400' : 'text-gray-400'
                }`}>
                  {member.trend === 'up' ? '↑' : member.trend === 'down' ? '↓' : '→'}
                </span>
              </div>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  backgroundColor: member.reliability >= 90 ? '#10B981' :
                                 member.reliability >= 70 ? '#D1A954' : '#DC2626'
                }}
                initial={{ width: 0 }}
                animate={{ width: `${member.reliability}%` }}
                transition={{ duration: 1, delay: i * 0.1 + 0.3 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// Proposal Trends
function ProposalTrends({ data }: { data: TeamAnalytics['proposalTrends'] }) {
  const maxValue = Math.max(...data.flatMap(d => [d.created, d.approved, d.rejected, d.executed]))

  return (
    <motion.div
      className="analytics-chart"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      <h3 className="analytics-chart__title">Unlock Proposal Trends</h3>
      <p className="analytics-chart__subtitle">Last 12 weeks</p>

      <svg className="analytics-chart__svg" viewBox="0 0 800 300">
        {data.map((d, i) => {
          const x = 50 + (i / 11) * 700
          const barWidth = 12

          return (
            <g key={i}>
              {/* Created */}
              <motion.rect
                x={x - barWidth * 2}
                y={250 - (d.created / maxValue) * 200}
                width={barWidth}
                height={(d.created / maxValue) * 200}
                fill="#3B82F6"
                initial={{ height: 0, y: 250 }}
                animate={{ height: (d.created / maxValue) * 200, y: 250 - (d.created / maxValue) * 200 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              />
              {/* Approved */}
              <motion.rect
                x={x - barWidth / 2}
                y={250 - (d.approved / maxValue) * 200}
                width={barWidth}
                height={(d.approved / maxValue) * 200}
                fill="#10B981"
                initial={{ height: 0, y: 250 }}
                animate={{ height: (d.approved / maxValue) * 200, y: 250 - (d.approved / maxValue) * 200 }}
                transition={{ duration: 0.5, delay: i * 0.05 + 0.1 }}
              />
              {/* Executed */}
              <motion.rect
                x={x + barWidth}
                y={250 - (d.executed / maxValue) * 200}
                width={barWidth}
                height={(d.executed / maxValue) * 200}
                fill="#D1A954"
                initial={{ height: 0, y: 250 }}
                animate={{ height: (d.executed / maxValue) * 200, y: 250 - (d.executed / maxValue) * 200 }}
                transition={{ duration: 0.5, delay: i * 0.05 + 0.2 }}
              />
            </g>
          )
        })}
      </svg>

      <div className="analytics-chart__legend">
        <div className="analytics-chart__legend-item">
          <div className="analytics-chart__legend-color" style={{ background: '#3B82F6' }} />
          <span>Created</span>
        </div>
        <div className="analytics-chart__legend-item">
          <div className="analytics-chart__legend-color" style={{ background: '#10B981' }} />
          <span>Approved</span>
        </div>
        <div className="analytics-chart__legend-item">
          <div className="analytics-chart__legend-color" style={{ background: '#D1A954' }} />
          <span>Executed</span>
        </div>
      </div>
    </motion.div>
  )
}
