import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StepDetails from '../components/vault-steps/StepDetails'
import StepKeyHolders from '../components/vault-steps/StepKeyHolders'
import StepSettings from '../components/vault-steps/StepSettings'
import StepReview from '../components/vault-steps/StepReview'

type Step = 'details' | 'keys' | 'settings' | 'review'

interface VaultData {
  name: string
  description: string
  holders: string[]
  threshold: number
  expiry: string
  autoSwap: boolean
}

export default function CreateVault() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState<Step>('details')
  const [vaultData, setVaultData] = useState<VaultData>({
    name: '',
    description: '',
    holders: [''],
    threshold: 1,
    expiry: '7d',
    autoSwap: true
  })

  const steps: Step[] = ['details', 'keys', 'settings', 'review']
  const stepIndex = steps.indexOf(currentStep)

  const nextStep = () => {
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1])
    }
  }

  const prevStep = () => {
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1])
    }
  }

  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreate = async () => {
    setIsCreating(true)
    setError(null)

    try {
      const { createVault } = await import('../lib/api')
      
      const vault = await createVault({
        name: vaultData.name,
        description: vaultData.description,
        keyHolders: vaultData.holders
          .filter(h => h.trim().length > 0)
          .map(holder => ({
            name: holder,
            email: holder.includes('@') ? holder : undefined
          })),
        threshold: vaultData.threshold,
        sourceAsset: 'BTC',
        targetAsset: 'USDT',
        expiry: vaultData.expiry,
        autoSwap: vaultData.autoSwap
      })

      navigate(`/vault/${vault.id}`)
    } catch (err: any) {
      const { handleApiError } = await import('../lib/api')
      setError(handleApiError(err))
      setIsCreating(false)
    }
  }

  const updateVaultData = (updates: Partial<VaultData>) => {
    setVaultData(prev => ({ ...prev, ...updates }))
  }

  return (
    <main className="min-h-screen bg-[#0A0F14] relative">
      {/* <SecurityGridOverlay /> */}
      
      {/* Circuit overlay behind wizard */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M20,30 L40,30 L40,50 L60,50" stroke="#3B82F6" strokeWidth="0.1" fill="none" />
          <path d="M80,40 L60,40 L60,60 L40,60" stroke="#3B82F6" strokeWidth="0.1" fill="none" />
          <circle cx="40" cy="30" r="0.3" fill="#3B82F6" />
          <circle cx="60" cy="50" r="0.3" fill="#D1A954" />
        </svg>
      </div>
      
      <div className="max-w-3xl mx-auto pt-16 px-4 pb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#11161C] border border-[#1E293B] rounded-lg p-10 shadow-[0_0_20px_rgba(0,0,0,0.3)]"
        >
          {/* Progress indicator with mini vault rings */}
          <div className="mb-10">
            <div className="flex gap-6 justify-center items-center py-6">
              {steps.map((step, index) => {
                const isCompleted = index < stepIndex
                const isActive = index === stepIndex
                
                return (
                  <div key={step} className="flex items-center">
                    <div className="relative">
                      {/* Mini VaultRing behind circle */}
                      {(isActive || isCompleted) && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.svg
                            width="60"
                            height="60"
                            viewBox="0 0 60 60"
                            className="opacity-15"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                          >
                            <circle
                              cx="30"
                              cy="30"
                              r="25"
                              fill="none"
                              stroke={isCompleted ? '#D1A954' : '#3B82F6'}
                              strokeWidth="0.5"
                              strokeDasharray="2 4"
                            />
                          </motion.svg>
                        </div>
                      )}
                      
                      <motion.div
                        initial={false}
                        animate={{
                          scale: isActive ? 1.05 : 1
                        }}
                        transition={{ duration: 0.2 }}
                        className={`relative w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm border-2 font-mono ${
                          isCompleted
                            ? 'border-[#D1A954] text-[#D1A954] bg-transparent'
                            : isActive
                            ? 'border-[#3B82F6] text-white bg-transparent'
                            : 'border-[#1E293B] text-gray-400 bg-transparent'
                        }`}
                      >
                        {index + 1}
                      </motion.div>
                    </div>
                    
                    {index < steps.length - 1 && (
                      <motion.div
                        initial={false}
                        animate={{
                          backgroundColor: isCompleted ? '#D1A954' : '#1E293B',
                          boxShadow: isCompleted ? '0 0 4px rgba(209, 169, 84, 0.3)' : 'none'
                        }}
                        transition={{ duration: 0.3 }}
                        className="w-16 h-1 ml-6 rounded-full"
                      />
                    )}
                  </div>
                )
              })}
            </div>
            <div className="flex justify-center gap-[88px] text-xs text-[#94A3B8] font-body">
              <span>Details</span>
              <span>Key Holders</span>
              <span>Settings</span>
              <span>Review</span>
            </div>
          </div>

          {/* Step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {currentStep === 'details' && (
                <StepDetails
                  data={vaultData}
                  updateData={updateVaultData}
                  onNext={nextStep}
                />
              )}
              {currentStep === 'keys' && (
                <StepKeyHolders
                  data={vaultData}
                  updateData={updateVaultData}
                  onNext={nextStep}
                  onBack={prevStep}
                />
              )}
              {currentStep === 'settings' && (
                <StepSettings
                  data={vaultData}
                  updateData={updateVaultData}
                  onNext={nextStep}
                  onBack={prevStep}
                />
              )}
              {currentStep === 'review' && (
                <StepReview
                  data={vaultData}
                  onCreate={handleCreate}
                  onBack={prevStep}
                  isCreating={isCreating}
                  error={error}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  )
}
