import { motion } from 'framer-motion'
import { RiskScore, getRiskColor, getRiskLabel } from '../../ai/riskEngine'

interface AIRiskPanelProps {
  riskScore: RiskScore
  compact?: boolean
}

export default function AIRiskPanel({ riskScore, compact = false }: AIRiskPanelProps) {
  const color = getRiskColor(riskScore.level)

  if (compact) {
    return (
      <motion.div
        className="ai-risk-panel-compact"
        style={{ borderColor: color }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="ai-risk-panel-compact__score" style={{ color }}>
          {riskScore.score}
        </div>
        <div className="ai-risk-panel-compact__label" style={{ color }}>
          {getRiskLabel(riskScore.level)}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="ai-risk-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="ai-risk-panel__header">
        <div className="ai-risk-panel__icon">🤖</div>
        <div>
          <h3 className="ai-risk-panel__title">AI Risk Analysis</h3>
          <p className="ai-risk-panel__subtitle">Automated safety assessment</p>
        </div>
      </div>

      {/* Score */}
      <div className="ai-risk-panel__score-section">
        <motion.div
          className="ai-risk-panel__score-circle"
          style={{ borderColor: color }}
          animate={{
            boxShadow: [
              `0 0 20px ${color}40`,
              `0 0 30px ${color}60`,
              `0 0 20px ${color}40`
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="ai-risk-panel__score-value" style={{ color }}>
            {riskScore.score}
          </div>
          <div className="ai-risk-panel__score-label">Risk Score</div>
        </motion.div>

        <div className="ai-risk-panel__score-bar">
          <div className="ai-risk-panel__score-bar-track">
            <motion.div
              className="ai-risk-panel__score-bar-fill"
              style={{ backgroundColor: color }}
              initial={{ width: 0 }}
              animate={{ width: `${riskScore.score}%` }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
          <div className="ai-risk-panel__score-bar-label" style={{ color }}>
            {getRiskLabel(riskScore.level)}
          </div>
        </div>
      </div>

      {/* Factors */}
      <div className="ai-risk-panel__factors">
        <h4 className="ai-risk-panel__section-title">Risk Factors</h4>
        <div className="ai-risk-panel__factors-list">
          {riskScore.factors.map((factor, i) => (
            <motion.div
              key={i}
              className="ai-risk-panel__factor"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className={`ai-risk-panel__factor-icon ai-risk-panel__factor-icon--${factor.impact}`}>
                {factor.impact === 'positive' ? '✓' : factor.impact === 'negative' ? '⚠' : '•'}
              </div>
              <div className="ai-risk-panel__factor-content">
                <div className="ai-risk-panel__factor-name">{factor.name}</div>
                <div className="ai-risk-panel__factor-desc">{factor.description}</div>
              </div>
              <div className="ai-risk-panel__factor-weight">
                {factor.weight > 0 ? '+' : ''}{factor.weight}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      {riskScore.recommendations.length > 0 && (
        <div className="ai-risk-panel__recommendations">
          <h4 className="ai-risk-panel__section-title">AI Recommendations</h4>
          <div className="ai-risk-panel__recommendations-list">
            {riskScore.recommendations.map((rec, i) => (
              <motion.div
                key={i}
                className="ai-risk-panel__recommendation"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                <span className="ai-risk-panel__recommendation-icon">💡</span>
                {rec}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
