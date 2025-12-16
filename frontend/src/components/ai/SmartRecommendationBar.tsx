import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { FeeOptimization, formatFee, formatTime } from '../../ai/feeOptimizer'
import { getLikelihoodColor } from '../../ai/availabilityPredictor'

interface SmartRecommendationBarProps {
  feeOptimization?: FeeOptimization
  availabilityPredictions?: { overallLikelihood: number; estimatedTime: number; warning?: string }
  onApplyOptimization?: () => void
}

export default function SmartRecommendationBar({
  feeOptimization,
  availabilityPredictions,
  onApplyOptimization
}: SmartRecommendationBarProps) {
  const [expanded, setExpanded] = useState(false)

  if (!feeOptimization && !availabilityPredictions) return null

  const hasSavings = feeOptimization && feeOptimization.totalSavings > 0
  const hasWarning = availabilityPredictions?.warning

  return (
    <motion.div
      className="smart-recommendation-bar"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="smart-recommendation-bar__main" onClick={() => setExpanded(!expanded)}>
        <div className="smart-recommendation-bar__icon">🤖</div>
        
        <div className="smart-recommendation-bar__content">
          <div className="smart-recommendation-bar__title">AI Assistant</div>
          <div className="smart-recommendation-bar__summary">
            {hasSavings && `Save ${formatFee(feeOptimization.totalSavings)} with optimized routing`}
            {hasSavings && hasWarning && ' • '}
            {hasWarning && availabilityPredictions.warning}
            {!hasSavings && !hasWarning && 'No optimizations available'}
          </div>
        </div>

        <button className="smart-recommendation-bar__toggle">
          {expanded ? '▼' : '▶'}
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            className="smart-recommendation-bar__details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            {/* Fee Optimization */}
            {feeOptimization && (
              <div className="smart-recommendation-bar__section">
                <h4>Fee Optimization</h4>
                <div className="smart-recommendation-bar__route">
                  <div className="smart-recommendation-bar__route-label">Recommended:</div>
                  <div className="smart-recommendation-bar__route-value">
                    {feeOptimization.recommendedRoute.description}
                  </div>
                  <div className="smart-recommendation-bar__route-stats">
                    <span>{formatFee(feeOptimization.recommendedRoute.estimatedFee)}</span>
                    <span>•</span>
                    <span>{formatTime(feeOptimization.recommendedRoute.estimatedTime)}</span>
                    {feeOptimization.recommendedRoute.savings > 0 && (
                      <>
                        <span>•</span>
                        <span className="text-emerald-400">
                          Save {formatFee(feeOptimization.recommendedRoute.savings)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                {onApplyOptimization && hasSavings && (
                  <button
                    className="smart-recommendation-bar__apply-btn"
                    onClick={onApplyOptimization}
                  >
                    Apply Optimization
                  </button>
                )}
              </div>
            )}

            {/* Availability Prediction */}
            {availabilityPredictions && (
              <div className="smart-recommendation-bar__section">
                <h4>Keyholder Availability</h4>
                <div className="smart-recommendation-bar__availability">
                  <div className="smart-recommendation-bar__availability-score">
                    <div
                      className="smart-recommendation-bar__availability-value"
                      style={{ color: getLikelihoodColor(availabilityPredictions.overallLikelihood) }}
                    >
                      {availabilityPredictions.overallLikelihood}%
                    </div>
                    <div className="smart-recommendation-bar__availability-label">
                      Signature Likelihood
                    </div>
                  </div>
                  <div className="smart-recommendation-bar__availability-time">
                    Est. {formatTime(availabilityPredictions.estimatedTime)}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
