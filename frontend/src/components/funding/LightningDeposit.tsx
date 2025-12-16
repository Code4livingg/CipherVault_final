import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'

interface LightningDepositProps {
  address: string
  amount?: string
  vaultId: string
  onPaymentDetected?: (amount: string) => void
}

export default function LightningDeposit({
  address,
  amount,
  vaultId,
  onPaymentDetected
}: LightningDepositProps) {
  const [copied, setCopied] = useState(false)
  const [paymentDetected, setPaymentDetected] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pollingRef = useRef<number>()

  // Generate QR code using canvas (no third-party library)
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Simple QR code generation (placeholder pattern)
    // In production, implement full QR encoding algorithm
    const size = 300
    const moduleSize = 10
    const modules = size / moduleSize

    canvas.width = size
    canvas.height = size

    // Background
    ctx.fillStyle = '#0A0F14'
    ctx.fillRect(0, 0, size, size)

    // Generate pattern (simplified - use proper QR algorithm in production)
    ctx.fillStyle = '#D1A954'
    for (let y = 0; y < modules; y++) {
      for (let x = 0; x < modules; x++) {
        // Create a pseudo-random pattern based on address
        const hash = address.charCodeAt(x % address.length) + 
                     address.charCodeAt(y % address.length)
        if (hash % 3 === 0) {
          ctx.fillRect(x * moduleSize, y * moduleSize, moduleSize, moduleSize)
        }
      }
    }

    // Add corner markers (QR code finder patterns)
    const drawFinderPattern = (x: number, y: number) => {
      ctx.fillStyle = '#D1A954'
      ctx.fillRect(x, y, moduleSize * 7, moduleSize * 7)
      ctx.fillStyle = '#0A0F14'
      ctx.fillRect(x + moduleSize, y + moduleSize, moduleSize * 5, moduleSize * 5)
      ctx.fillStyle = '#D1A954'
      ctx.fillRect(x + moduleSize * 2, y + moduleSize * 2, moduleSize * 3, moduleSize * 3)
    }

    drawFinderPattern(0, 0) // Top-left
    drawFinderPattern(size - moduleSize * 7, 0) // Top-right
    drawFinderPattern(0, size - moduleSize * 7) // Bottom-left
  }, [address])

  // Poll backend for deposit every 5 seconds
  useEffect(() => {
    const pollForDeposit = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/vault/${vaultId}/deposits`)
        const data = await response.json()
        
        // Check if new deposit detected
        if (data.totalDeposits && parseFloat(data.totalDeposits) > 0) {
          setPaymentDetected(true)
          if (pollingRef.current) {
            clearInterval(pollingRef.current)
          }
          onPaymentDetected?.(data.totalDeposits)
        }
      } catch (error) {
        console.error('Polling error:', error)
      }
    }

    // Start polling
    pollingRef.current = setInterval(pollForDeposit, 5000)

    // Initial check
    pollForDeposit()

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
      }
    }
  }, [vaultId, onPaymentDetected])

  const handleCopy = () => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const simulatePayment = () => {
    setPaymentDetected(true)
    setTimeout(() => {
      onPaymentDetected?.('1.0')
    }, 3000)
  }

  return (
    <div className="lightning-deposit">
      {/* Lightning Strike Animation */}
      <AnimatePresence>
        {paymentDetected && (
          <motion.div
            className="lightning-strike-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Lightning bolt */}
            <motion.svg
              className="lightning-bolt"
              viewBox="0 0 100 200"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 1, 0] }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <path
                d="M50 0 L30 80 L50 80 L35 200 L70 70 L50 70 Z"
                fill="none"
                stroke="#D1A954"
                strokeWidth="2"
                filter="url(#glow)"
              />
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
            </motion.svg>

            {/* Gold particle burst */}
            <div className="particle-burst">
              {[...Array(30)].map((_, i) => {
                const angle = (i / 30) * Math.PI * 2
                const distance = 100 + Math.random() * 100
                return (
                  <motion.div
                    key={i}
                    className="burst-particle"
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{
                      x: Math.cos(angle) * distance,
                      y: Math.sin(angle) * distance,
                      opacity: 0,
                      scale: 0
                    }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  />
                )
              })}
            </div>

            {/* Confirmation message */}
            <motion.div
              className="payment-confirmed"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
            >
              <div className="confirm-icon">⚡</div>
              <div className="confirm-text">Payment Detected</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Code Hologram */}
      <motion.div
        className="qr-hologram"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="qr-container">
          <motion.canvas
            ref={canvasRef}
            className="qr-canvas"
            animate={{
              boxShadow: [
                '0 0 20px rgba(209, 169, 84, 0.3)',
                '0 0 40px rgba(209, 169, 84, 0.5)',
                '0 0 20px rgba(209, 169, 84, 0.3)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div className="qr-corners">
            <div className="corner top-left" />
            <div className="corner top-right" />
            <div className="corner bottom-left" />
            <div className="corner bottom-right" />
          </div>
        </div>
      </motion.div>

      {/* Address Display */}
      <div className="address-display">
        <div className="address-label">Lightning Address</div>
        <div className="address-value">
          <code>{address.slice(0, 20)}...{address.slice(-20)}</code>
          <motion.button
            className="copy-button"
            onClick={handleCopy}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {copied ? '✓' : '📋'}
          </motion.button>
        </div>
      </div>

      {/* Amount Display */}
      {amount && (
        <div className="amount-display">
          <div className="amount-label">Expected Amount</div>
          <div className="amount-value">{amount} BTC</div>
        </div>
      )}

      {/* Status Indicator */}
      <motion.div
        className="status-indicator"
        animate={{
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="status-dot" />
        <div className="status-text">Waiting for payment...</div>
      </motion.div>

      {/* Demo Button */}
      <button
        className="demo-payment-button"
        onClick={simulatePayment}
        style={{ marginTop: '1rem', opacity: 0.5, fontSize: '0.75rem' }}
      >
        [Demo: Simulate Payment]
      </button>
    </div>
  )
}
