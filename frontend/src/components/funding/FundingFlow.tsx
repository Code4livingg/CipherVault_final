import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import LightningDeposit from './LightningDeposit'

interface FundingFlowProps {
  vaultId: string
  depositAddress: string
  onClose: () => void
  onFundingComplete: (amount: string) => void
}

export default function FundingFlow({
  vaultId,
  depositAddress,
  onClose,
  onFundingComplete
}: FundingFlowProps) {
  const [step, setStep] = useState<'deposit' | 'confirming' | 'complete'>('deposit')
  const [detectedAmount, setDetectedAmount] = useState('0')

  const handlePaymentDetected = (amount: string) => {
    setDetectedAmount(amount)
    setStep('confirming')
    
    // Simulate blockchain confirmation
    setTimeout(() => {
      setStep('complete')
      setTimeout(() => {
        onFundingComplete(amount)
        onClose()
      }, 2000)
    }, 2000)
  }

  return (
    <AnimatePresence>
      <motion.div
        className="funding-flow-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="funding-flow-modal"
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 50 }}
          transition={{ type: 'spring', damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Hologram border effect */}
          <div className="modal-border-glow" />

          {/* Header */}
          <div className="modal-header">
            <div className="header-icon">⚡</div>
            <div className="header-content">
              <h2 className="header-title">Fund Vault</h2>
              <p className="header-subtitle">Lightning Network Deposit</p>
            </div>
            <button className="close-button" onClick={onClose}>
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="modal-content">
            <AnimatePresence mode="wait">
              {step === 'deposit' && (
                <motion.div
                  key="deposit"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <LightningDeposit
                    address={depositAddress}
                    vaultId={vaultId}
                    onPaymentDetected={handlePaymentDetected}
                  />
                </motion.div>
              )}

              {step === 'confirming' && (
                <motion.div
                  key="confirming"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="confirming-state"
                >
                  <motion.div
                    className="confirming-spinner"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  >
                    <svg width="80" height="80" viewBox="0 0 80 80">
                      <circle
                        cx="40"
                        cy="40"
                        r="35"
                        fill="none"
                        stroke="#D1A954"
                        strokeWidth="2"
                        strokeDasharray="180 40"
                      />
                    </svg>
                  </motion.div>
                  <div className="confirming-text">
                    <div className="confirming-title">Confirming Transaction</div>
                    <div className="confirming-subtitle">Waiting for blockchain confirmation...</div>
                  </div>
                </motion.div>
              )}

              {step === 'complete' && (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="complete-state"
                >
                  <motion.div
                    className="complete-icon"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    ✓
                  </motion.div>
                  <div className="complete-text">
                    <div className="complete-title">Funding Complete</div>
                    <div className="complete-amount">{detectedAmount} BTC</div>
                    <div className="complete-subtitle">Vault balance updated</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <div className="footer-info">
              <span className="info-icon">ℹ</span>
              <span className="info-text">Lightning Network for instant deposits</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
