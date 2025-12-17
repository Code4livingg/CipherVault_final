import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CinematicBackground from '../components/vault-steps/CinematicBackground'
import FloatingInput from '../components/vault-steps/FloatingInput'
import PageTransition from '../components/ui/PageTransition'
import FloatingPanel from '../components/ui/FloatingPanel'
import GlobalCinematicEnvironment from '../components/environment/GlobalCinematicEnvironment'

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
  const [direction, setDirection] = useState(1)
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
      setDirection(1)
      setCurrentStep(steps[currentIndex + 1])
    }
  }

  const prevStep = () => {
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex > 0) {
      setDirection(-1)
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

  const addHolder = () => {
    updateVaultData({ holders: [...vaultData.holders, ''] })
  }

  const removeHolder = (index: number) => {
    const newHolders = vaultData.holders.filter((_, i) => i !== index)
    updateVaultData({
      holders: newHolders,
      threshold: Math.min(vaultData.threshold, newHolders.length)
    })
  }

  const updateHolder = (index: number, value: string) => {
    const newHolders = [...vaultData.holders]
    newHolders[index] = value
    updateVaultData({ holders: newHolders })
  }

  const canProceed = () => {
    switch (currentStep) {
      case 'details':
        return vaultData.name.trim().length > 0
      case 'keys':
        return vaultData.holders.filter(h => h.trim().length > 0).length >= 1 && vaultData.threshold >= 1
      case 'settings':
        return true
      case 'review':
        return true
      default:
        return false
    }
  }

  const stepVariants = {
    enter: (direction: number) => ({
      y: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      y: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      y: direction > 0 ? -100 : 100,
      opacity: 0.85,
      scale: 0.95
    })
  }

  const validHolders = vaultData.holders.filter(h => h.trim().length > 0)

  return (
    <PageTransition direction="vertical">
      <main className="min-h-screen bg-[#0A0F14] relative overflow-hidden">
        <GlobalCinematicEnvironment />
        <CinematicBackground />

      {/* Demo Mode Banner */}
      {(import.meta.env.VITE_DEMO_MODE !== 'false') && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-[#D1A954]/20 border border-[#D1A954]/50 rounded-lg px-4 py-2 backdrop-blur-sm">
            <p className="text-[#D1A954] text-sm font-body font-medium">
              🎭 Demo Mode - Using Mock Data
            </p>
          </div>
        </div>
      )}

      {/* Full-screen wizard container */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-16">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="w-full max-w-2xl"
          >
            {/* STEP 1: VAULT DETAILS */}
            {currentStep === 'details' && (
              <div className="text-center">
                {/* Floating vault ring behind title */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-15 pointer-events-none">
                  <motion.svg
                    width="300"
                    height="300"
                    viewBox="0 0 300 300"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  >
                    <circle cx="150" cy="150" r="120" fill="none" stroke="#3B82F6" strokeWidth="1" strokeDasharray="4 8" />
                  </motion.svg>
                </div>

                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-5xl md:text-6xl font-bold text-white mb-4 font-heading"
                >
                  Initialize Your Vault
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-[#CBD5E1] mb-12 font-body"
                >
                  Create a secure multi-party crypto vault
                </motion.p>

                <div className="max-w-md mx-auto space-y-6">
                  <FloatingInput
                    label="Vault Name"
                    value={vaultData.name}
                    onChange={(value) => updateVaultData({ name: value })}
                    placeholder="e.g., Emergency Fund"
                  />

                  <FloatingInput
                    label="Description (Optional)"
                    value={vaultData.description}
                    onChange={(value) => updateVaultData({ description: value })}
                    placeholder="What is this vault for?"
                    multiline
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* STEP 2: KEY HOLDERS */}
            {currentStep === 'keys' && (
              <div className="text-center">
                {/* MPC node network background */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <line x1="20" y1="30" x2="50" y2="50" stroke="#3B82F6" strokeWidth="0.2" />
                    <line x1="80" y1="30" x2="50" y2="50" stroke="#3B82F6" strokeWidth="0.2" />
                    <line x1="50" y1="70" x2="50" y2="50" stroke="#3B82F6" strokeWidth="0.2" />
                    <circle cx="20" cy="30" r="1" fill="#3B82F6" />
                    <circle cx="80" cy="30" r="1" fill="#3B82F6" />
                    <circle cx="50" cy="50" r="1.5" fill="#D1A954" />
                    <circle cx="50" cy="70" r="1" fill="#3B82F6" />
                  </svg>
                </div>

                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-5xl md:text-6xl font-bold text-white mb-4 font-heading"
                >
                  Assign Key Holders
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-[#CBD5E1] mb-12 font-body"
                >
                  Each added address becomes a shard holder in the vault MPC
                </motion.p>

                <div className="max-w-md mx-auto space-y-4">
                  <AnimatePresence>
                    {vaultData.holders.map((holder, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="relative flex items-center gap-3 bg-[#0A0F14]/50 border border-[#3B82F6]/20 rounded-lg p-4"
                      >
                        <div className="w-2 h-2 bg-[#D1A954] rounded-full" />
                        <svg className="w-5 h-5 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                        <input
                          type="text"
                          value={holder}
                          onChange={(e) => updateHolder(index, e.target.value)}
                          placeholder="Email or wallet address"
                          className="flex-1 bg-transparent text-white border-none outline-none placeholder:text-[#64748B] font-body"
                        />
                        {vaultData.holders.length > 1 && (
                          <button
                            onClick={() => removeHolder(index)}
                            className="text-[#DC2626] hover:text-[#EF4444] transition"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  <button
                    onClick={addHolder}
                    className="w-full py-3 border border-[#3B82F6]/30 border-dashed text-[#3B82F6] rounded-lg hover:border-[#3B82F6] transition font-body"
                  >
                    + Add Key Holder
                  </button>

                  {/* Threshold slider */}
                  <div className="mt-8 p-6 bg-[#0A0F14]/50 border border-[#1E293B] rounded-lg">
                    <label className="block text-[#E2E8F0] mb-4 font-body text-sm">
                      Approval Threshold: <span className="text-[#3B82F6] font-mono font-bold">{vaultData.threshold}/{vaultData.holders.length}</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max={vaultData.holders.length}
                      value={vaultData.threshold}
                      onChange={(e) => updateVaultData({ threshold: parseInt(e.target.value) })}
                      className="w-full h-2 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#3B82F6]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: SETTINGS */}
            {currentStep === 'settings' && (
              <div className="text-center">
                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-5xl md:text-6xl font-bold text-white mb-4 font-heading"
                >
                  Configure Vault Logic
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-[#CBD5E1] mb-12 font-body"
                >
                  Set expiry time and auto-swap preferences
                </motion.p>

                <div className="max-w-md mx-auto space-y-6">
                  {/* Expiry options */}
                  <div>
                    <label className="block text-[#E2E8F0] mb-4 font-body text-sm">Expiry Time</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['24h', '7d', '30d', '90d'].map((option) => (
                        <button
                          key={option}
                          onClick={() => updateVaultData({ expiry: option })}
                          className={`py-3 px-4 rounded-lg border transition font-body ${
                            vaultData.expiry === option
                              ? 'border-[#3B82F6] text-white bg-[#3B82F6]/10'
                              : 'border-[#1E293B] text-[#94A3B8] hover:border-[#3B82F6]/50'
                          }`}
                        >
                          {option === '24h' ? '24 Hours' : option === '7d' ? '7 Days' : option === '30d' ? '30 Days' : '90 Days'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Auto-swap toggle */}
                  <div className="p-6 bg-[#0A0F14]/50 border border-[#1E293B] rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="text-left flex-1">
                        <label className="block text-[#E2E8F0] font-body font-medium mb-1">Auto-Swap on Unlock</label>
                        <p className="text-[#94A3B8] text-sm font-body">Convert to preferred currency automatically</p>
                      </div>
                      <button
                        onClick={() => updateVaultData({ autoSwap: !vaultData.autoSwap })}
                        className={`relative w-14 h-8 rounded-full transition-colors ${
                          vaultData.autoSwap ? 'bg-[#3B82F6]' : 'bg-[#1E293B]'
                        }`}
                      >
                        <motion.div
                          animate={{ x: vaultData.autoSwap ? 24 : 2 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          className="absolute top-1 w-6 h-6 bg-white rounded-full"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: REVIEW */}
            {currentStep === 'review' && (
              <div className="text-center">
                {/* Rotating vault ring */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
                  <motion.svg
                    width="400"
                    height="400"
                    viewBox="0 0 400 400"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                  >
                    <circle cx="200" cy="200" r="150" fill="none" stroke="#3B82F6" strokeWidth="1" strokeDasharray="6 12" />
                    <circle cx="200" cy="200" r="120" fill="none" stroke="#D1A954" strokeWidth="0.5" strokeDasharray="4 8" />
                  </motion.svg>
                </div>

                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-5xl md:text-6xl font-bold text-white mb-4 font-heading"
                >
                  Review Configuration
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-[#CBD5E1] mb-12 font-body"
                >
                  Confirm your vault initialization parameters
                </motion.p>

                <div className="max-w-md mx-auto space-y-4">
                  {/* Summary chips */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="p-4 bg-[#0A0F14]/50 border border-[#3B82F6]/30 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#D1A954] rounded-full" />
                      <div className="text-left flex-1">
                        <p className="text-[#94A3B8] text-xs font-body">Vault Name</p>
                        <p className="text-white font-heading font-semibold">{vaultData.name}</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="p-4 bg-[#0A0F14]/50 border border-[#3B82F6]/30 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#D1A954] rounded-full" />
                      <div className="text-left flex-1">
                        <p className="text-[#94A3B8] text-xs font-body">Key Holders</p>
                        <p className="text-white font-mono font-semibold">{validHolders.length} holders • {vaultData.threshold} required</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="p-4 bg-[#0A0F14]/50 border border-[#3B82F6]/30 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#D1A954] rounded-full" />
                      <div className="text-left flex-1">
                        <p className="text-[#94A3B8] text-xs font-body">Configuration</p>
                        <p className="text-white font-mono font-semibold">
                          {vaultData.expiry} expiry • Auto-swap {vaultData.autoSwap ? 'ON' : 'OFF'}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Initialization ready */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center justify-center gap-2 py-6"
                  >
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-2 h-2 bg-[#10B981] rounded-full"
                    />
                    <p className="text-[#10B981] text-sm font-mono">
                      Vault Initialization Sequence Ready
                    </p>
                  </motion.div>

                  {error && (
                    <div className="p-4 bg-[#DC2626]/10 border border-[#DC2626]/30 rounded-lg">
                      <p className="text-[#DC2626] text-sm font-body">{error}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons - fixed bottom */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-20"
        >
          {stepIndex > 0 && (
            <button
              onClick={prevStep}
              className="px-8 py-3 border border-[#1E293B] text-[#94A3B8] rounded-lg hover:border-[#3B82F6]/50 transition font-body"
            >
              Back
            </button>
          )}

          {currentStep !== 'review' ? (
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className={`px-8 py-3 border rounded-lg transition font-body ${
                canProceed()
                  ? 'border-[#3B82F6] text-white hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                  : 'border-[#1E293B] text-gray-600 cursor-not-allowed'
              }`}
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleCreate}
              disabled={isCreating}
              className="px-8 py-3 border border-[#D1A954] text-white rounded-lg hover:shadow-[0_0_20px_rgba(209,169,84,0.3)] transition font-body disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? 'Creating...' : 'Create Vault'}
            </button>
          )}
        </motion.div>
      </div>

      {/* Floating Crypto OS Panels */}
      <FloatingPanel
        variant="chip"
        icon="🔑"
        label="Shard"
        x={90}
        y={35}
        size={65}
        zIndex={50}
      />
      <FloatingPanel
        variant="badge"
        icon="⚙️"
        label="Settings"
        x={8}
        y={60}
        size={70}
        zIndex={50}
      />
      <FloatingPanel
        variant="sticker"
        icon="⏱️"
        label="Expiry"
        x={12}
        y={20}
        size={60}
        zIndex={50}
      />
    </main>
    </PageTransition>
  )
}
