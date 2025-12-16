import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface UnlockSequenceProps {
  isActive: boolean
  vaultId: string
  proposalId?: string
  onComplete?: () => void
  onError?: (error: string) => void
}

const stages = [
  { id: 1, message: 'Verifying approvals...', duration: 1500 },
  { id: 2, message: 'Initiating swap protocol...', duration: 2000 },
  { id: 3, message: 'Executing SideShift...', duration: 2500 },
  { id: 4, message: 'Dispatching funds...', duration: 2000 }
]

export default function UnlockSequence({
  isActive,
  vaultId,
  onComplete,
  onError
}: UnlockSequenceProps) {
  const navigate = useNavigate()
  const [currentStage, setCurrentStage] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isActive) {
      setCurrentStage(0)
      setProgress(0)
      setIsSuccess(false)
      setError(null)
      return
    }

    let stageTimer: number
    let progressInterval: number

    const runStage = (stageIndex: number) => {
      if (stageIndex >= stages.length) {
        setIsSuccess(true)
        setTimeout(() => {
          // Navigate to FinalProof page
          navigate(`/vault/${vaultId}/proof`)
          // Call onComplete callback if provided
          onComplete?.()
        }, 2000)
        return
      }

      setCurrentStage(stageIndex)
      setProgress(0)

      const stage = stages[stageIndex]
      const progressStep = 100 / (stage.duration / 50)

      progressInterval = setInterval(() => {
        setProgress(prev => {
          const next = prev + progressStep
          return next >= 100 ? 100 : next
        })
      }, 50)

      stageTimer = setTimeout(() => {
        clearInterval(progressInterval)
        runStage(stageIndex + 1)
      }, stage.duration)
    }

    runStage(0)

    return () => {
      clearTimeout(stageTimer)
      clearInterval(progressInterval)
    }
  }, [isActive, vaultId, navigate, onComplete])

  if (!isActive && !isSuccess) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0F14]/95 backdrop-blur-sm"
      >
        {/* Background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#D1A954] rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.1
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-2xl w-full px-8">
          {!isSuccess && !error && (
            <>
              {/* Pulsing lock core */}
              <motion.div
                className="flex justify-center mb-12"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                <div className="relative w-32 h-32">
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        'radial-gradient(circle, rgba(209, 169, 84, 0.4) 0%, transparent 70%)'
                    }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <svg
                    width="128"
                    height="128"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="relative"
                  >
                    <path
                      d="M12 2C9.243 2 7 4.243 7 7v3H6c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2h-1V7c0-2.757-2.243-5-5-5z"
                      stroke="#D1A954"
                      strokeWidth="0.5"
                      fill="rgba(209, 169, 84, 0.2)"
                    />
                  </svg>
                </div>
              </motion.div>

              {/* Beam of light */}
              <motion.div
                className="absolute top-0 left-1/2 w-1 h-full bg-gradient-to-b from-[#D1A954] to-transparent -translate-x-1/2"
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 0.6 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                style={{ transformOrigin: 'top' }}
              />

              {/* Stage message */}
              <motion.div
                key={currentStage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center mb-8"
              >
                <h2 className="text-3xl font-bold text-white mb-2 font-heading">
                  Decrypting Vault
                </h2>
                <p className="text-[#D1A954] font-mono text-lg">
                  {stages[currentStage]?.message}
                </p>
              </motion.div>

              {/* Progress bar */}
              <div className="relative h-2 bg-[#1E293B] rounded-full overflow-hidden mb-8">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-[#D1A954] rounded-full"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
                <motion.div
                  className="absolute inset-y-0 left-0 bg-[#D1A954]"
                  style={{
                    width: `${progress}%`,
                    filter: 'blur(8px)',
                    opacity: 0.6
                  }}
                />
              </div>

              {/* HUD messages */}
              <div className="space-y-2">
                {stages.slice(0, currentStage + 1).map((stage, index) => (
                  <motion.div
                    key={stage.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: index === currentStage ? 1 : 0.5, x: 0 }}
                    className="flex items-center gap-3 text-sm font-mono"
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        index < currentStage ? 'bg-[#10B981]' : 'bg-[#D1A954]'
                      }`}
                    />
                    <span
                      className={
                        index < currentStage ? 'text-[#10B981]' : 'text-[#D1A954]'
                      }
                    >
                      {stage.message}
                    </span>
                    {index < currentStage && (
                      <svg
                        className="w-4 h-4 text-[#10B981]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {/* Success state */}
          {isSuccess && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-center"
            >
              {/* Golden flash */}
              <motion.div
                className="absolute inset-0 bg-[#D1A954]"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.3, 0] }}
                transition={{ duration: 0.5 }}
              />

              {/* Particle burst */}
              {[...Array(30)].map((_, i) => {
                const angle = (i / 30) * 2 * Math.PI
                const distance = 100 + Math.random() * 100
                return (
                  <motion.div
                    key={i}
                    className="absolute top-1/2 left-1/2 w-2 h-2 bg-[#D1A954] rounded-full"
                    initial={{ x: 0, y: 0, opacity: 1 }}
                    animate={{
                      x: Math.cos(angle) * distance,
                      y: Math.sin(angle) * distance,
                      opacity: 0,
                      scale: [1, 0]
                    }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                )
              })}

              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <svg
                  className="w-32 h-32 mx-auto mb-6 text-[#D1A954]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </motion.div>

              <h2 className="text-4xl font-bold text-white mb-4 font-heading">
                Vault Unlocked
              </h2>
              <p className="text-[#D1A954] font-mono">
                Redirecting to execution proof...
              </p>
            </motion.div>
          )}

          {/* Error state */}
          {error && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: [0, -5, 5, -5, 5, 0] }}
                transition={{ duration: 0.5 }}
              >
                <svg
                  className="w-32 h-32 mx-auto mb-6 text-[#DC2626]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </motion.div>

              <h2 className="text-4xl font-bold text-white mb-4 font-heading">
                Unlock Failed
              </h2>
              <p className="text-[#DC2626] font-mono mb-6">{error}</p>

              <button
                onClick={() => {
                  setError(null)
                  onError?.(error)
                }}
                className="px-6 py-3 border border-[#DC2626] text-white rounded hover:bg-[#DC2626]/10 transition font-body"
              >
                Close
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
