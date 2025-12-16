import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface DemoStep {
  route: string
  narration: string
  duration: number
  action?: () => void
}

const DEMO_STEPS: DemoStep[] = [
  {
    route: '/',
    narration: 'Welcome to CipherVault - Enterprise MPC Vault Operating System',
    duration: 3000
  },
  {
    route: '/org/create',
    narration: 'Create your organization with role-based access control',
    duration: 4000
  },
  {
    route: '/org/dashboard',
    narration: 'Manage vaults with AI-powered risk assessment',
    duration: 4000
  },
  {
    route: '/create',
    narration: 'Set up multi-signature vaults with threshold security',
    duration: 4000
  },
  {
    route: '/dashboard',
    narration: 'Monitor all vaults with real-time analytics',
    duration: 4000
  }
]

interface AutoDemoModeProps {
  onComplete?: () => void
}

export default function AutoDemoMode({ onComplete }: AutoDemoModeProps) {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  useEffect(() => {
    if (!isPlaying || currentStep >= DEMO_STEPS.length) {
      if (currentStep >= DEMO_STEPS.length && onComplete) {
        onComplete()
      }
      return
    }

    const step = DEMO_STEPS[currentStep]
    
    // Navigate to route
    navigate(step.route)
    
    // Execute action if any
    if (step.action) {
      step.action()
    }

    // Move to next step after duration
    const timer = setTimeout(() => {
      setCurrentStep(prev => prev + 1)
    }, step.duration)

    return () => clearTimeout(timer)
  }, [currentStep, isPlaying, navigate, onComplete])

  const handleSkip = () => {
    setIsPlaying(false)
    if (onComplete) onComplete()
  }

  const handlePause = () => {
    setIsPlaying(!isPlaying)
  }

  if (currentStep >= DEMO_STEPS.length) return null

  const step = DEMO_STEPS[currentStep]

  return (
    <AnimatePresence>
      <motion.div
        className="auto-demo-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Narration */}
        <motion.div
          className="auto-demo-narration"
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="auto-demo-narration__text">{step.narration}</div>
          <div className="auto-demo-narration__progress">
            Step {currentStep + 1} of {DEMO_STEPS.length}
          </div>
        </motion.div>

        {/* Controls */}
        <div className="auto-demo-controls">
          <button onClick={handlePause} className="auto-demo-controls__btn">
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button onClick={handleSkip} className="auto-demo-controls__btn">
            Skip Demo
          </button>
        </div>

        {/* Progress bar */}
        <div className="auto-demo-progress-bar">
          <motion.div
            className="auto-demo-progress-bar__fill"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / DEMO_STEPS.length) * 100}%` }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
