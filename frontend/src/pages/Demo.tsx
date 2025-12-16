import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

interface MockVault {
  id: string
  name: string
  balance: string
  threshold: string
  keyholders: string[]
  status: 'active' | 'pending' | 'executed'
}

interface MockProposal {
  id: string
  amount: string
  recipient: string
  approvals: number
  required: number
  status: 'pending' | 'approved' | 'executed'
}

export default function Demo() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [mockVault, setMockVault] = useState<MockVault | null>(null)
  const [mockProposal, setMockProposal] = useState<MockProposal | null>(null)

  const steps = [
    {
      title: 'Welcome to CipherVault Demo',
      description: 'Experience the full flow of creating a vault, proposing an unlock, and executing with proof',
      action: 'Start Demo'
    },
    {
      title: 'Creating Mock Vault',
      description: 'Setting up a 3-of-5 multi-signature vault with AI risk assessment...',
      action: 'Creating...'
    },
    {
      title: 'Vault Created Successfully',
      description: 'Your demo vault is ready with $50,000 BTC balance',
      action: 'View Dashboard'
    },
    {
      title: 'Creating Unlock Proposal',
      description: 'Proposing to unlock $10,000 BTC with AI risk analysis...',
      action: 'Creating Proposal...'
    },
    {
      title: 'Simulating Approvals',
      description: 'Keyholders are approving the proposal (3 of 5 required)...',
      action: 'Approving...'
    },
    {
      title: 'Executing Transaction',
      description: 'Broadcasting transaction to network with MPC signatures...',
      action: 'Executing...'
    },
    {
      title: 'Transaction Complete!',
      description: 'View the cryptographic proof and audit trail',
      action: 'View Final Proof'
    }
  ]

  useEffect(() => {
    if (step === 1) {
      // Create mock vault
      setTimeout(() => {
        const vault: MockVault = {
          id: 'demo-vault-' + Date.now(),
          name: 'Demo Treasury Vault',
          balance: '50000',
          threshold: '3-of-5',
          keyholders: ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'],
          status: 'active'
        }
        setMockVault(vault)
        localStorage.setItem('demo_vault', JSON.stringify(vault))
        setStep(2)
      }, 2000)
    } else if (step === 3) {
      // Create mock proposal
      setTimeout(() => {
        const proposal: MockProposal = {
          id: 'demo-proposal-' + Date.now(),
          amount: '10000',
          recipient: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
          approvals: 0,
          required: 3,
          status: 'pending'
        }
        setMockProposal(proposal)
        localStorage.setItem('demo_proposal', JSON.stringify(proposal))
        setStep(4)
      }, 2000)
    } else if (step === 4) {
      // Simulate approvals
      let approvalCount = 0
      const approvalInterval = setInterval(() => {
        approvalCount++
        if (mockProposal) {
          const updated = { ...mockProposal, approvals: approvalCount }
          setMockProposal(updated)
          localStorage.setItem('demo_proposal', JSON.stringify(updated))
        }
        if (approvalCount >= 3) {
          clearInterval(approvalInterval)
          setTimeout(() => setStep(5), 1000)
        }
      }, 800)
      return () => clearInterval(approvalInterval)
    } else if (step === 5) {
      // Execute transaction
      setTimeout(() => {
        if (mockProposal) {
          const executed = { ...mockProposal, status: 'executed' as const }
          setMockProposal(executed)
          localStorage.setItem('demo_proposal', JSON.stringify(executed))
          
          // Create mock proof data
          const proofData = {
            transactionId: 'demo-tx-' + Date.now(),
            timestamp: new Date().toISOString(),
            amount: mockProposal.amount,
            recipient: mockProposal.recipient,
            signatures: [
              { keyholder: 'Alice', signature: '0x' + 'a'.repeat(130) },
              { keyholder: 'Bob', signature: '0x' + 'b'.repeat(130) },
              { keyholder: 'Charlie', signature: '0x' + 'c'.repeat(130) }
            ],
            mpcProof: {
              commitment: '0x' + 'd'.repeat(64),
              challenge: '0x' + 'e'.repeat(64),
              response: '0x' + 'f'.repeat(64)
            },
            auditTrail: {
              proposalCreated: new Date(Date.now() - 300000).toISOString(),
              approvalsReceived: [
                { keyholder: 'Alice', timestamp: new Date(Date.now() - 240000).toISOString() },
                { keyholder: 'Bob', timestamp: new Date(Date.now() - 180000).toISOString() },
                { keyholder: 'Charlie', timestamp: new Date(Date.now() - 120000).toISOString() }
              ],
              executionTime: new Date().toISOString()
            },
            riskScore: 42,
            feeOptimization: {
              estimatedFee: '0.0001 BTC',
              savedAmount: '0.00003 BTC',
              savingsPercentage: '30%'
            }
          }
          localStorage.setItem('demo_proof', JSON.stringify(proofData))
        }
        setStep(6)
      }, 3000)
    }
  }, [step, mockProposal])

  const handleAction = () => {
    if (step === 0) {
      setIsAnimating(true)
      setTimeout(() => {
        setStep(1)
        setIsAnimating(false)
      }, 500)
    } else if (step === 2) {
      navigate('/dashboard')
    } else if (step === 6) {
      navigate('/final-proof')
    }
  }

  const handleSkip = () => {
    // Set up all mock data and go straight to final proof
    const vault: MockVault = {
      id: 'demo-vault-' + Date.now(),
      name: 'Demo Treasury Vault',
      balance: '50000',
      threshold: '3-of-5',
      keyholders: ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'],
      status: 'active'
    }
    
    const proposal: MockProposal = {
      id: 'demo-proposal-' + Date.now(),
      amount: '10000',
      recipient: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      approvals: 3,
      required: 3,
      status: 'executed'
    }
    
    const proofData = {
      transactionId: 'demo-tx-' + Date.now(),
      timestamp: new Date().toISOString(),
      amount: proposal.amount,
      recipient: proposal.recipient,
      signatures: [
        { keyholder: 'Alice', signature: '0x' + 'a'.repeat(130) },
        { keyholder: 'Bob', signature: '0x' + 'b'.repeat(130) },
        { keyholder: 'Charlie', signature: '0x' + 'c'.repeat(130) }
      ],
      mpcProof: {
        commitment: '0x' + 'd'.repeat(64),
        challenge: '0x' + 'e'.repeat(64),
        response: '0x' + 'f'.repeat(64)
      },
      auditTrail: {
        proposalCreated: new Date(Date.now() - 300000).toISOString(),
        approvalsReceived: [
          { keyholder: 'Alice', timestamp: new Date(Date.now() - 240000).toISOString() },
          { keyholder: 'Bob', timestamp: new Date(Date.now() - 180000).toISOString() },
          { keyholder: 'Charlie', timestamp: new Date(Date.now() - 120000).toISOString() }
        ],
        executionTime: new Date().toISOString()
      },
      riskScore: 42,
      feeOptimization: {
        estimatedFee: '0.0001 BTC',
        savedAmount: '0.00003 BTC',
        savingsPercentage: '30%'
      }
    }
    
    localStorage.setItem('demo_vault', JSON.stringify(vault))
    localStorage.setItem('demo_proposal', JSON.stringify(proposal))
    localStorage.setItem('demo_proof', JSON.stringify(proofData))
    
    navigate('/final-proof')
  }

  const currentStep = steps[step]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-8">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-2xl w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-slate-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-12 shadow-2xl"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-block mb-4"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-3xl">🔐</span>
                </div>
              </motion.div>
              
              <h1 className="text-4xl font-bold text-white mb-2">
                {currentStep.title}
              </h1>
              
              <p className="text-lg text-slate-300">
                {currentStep.description}
              </p>
            </div>

            {/* Progress indicator */}
            {step > 0 && step < 6 && (
              <div className="mb-8">
                <div className="flex justify-between text-sm text-slate-400 mb-2">
                  <span>Progress</span>
                  <span>{step} of 6</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${(step / 6) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            )}

            {/* Mock data display */}
            {mockVault && step >= 2 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-cyan-500/20"
              >
                <div className="text-sm text-slate-400 mb-2">Mock Vault</div>
                <div className="text-white font-mono text-sm">
                  <div>Name: {mockVault.name}</div>
                  <div>Balance: ${mockVault.balance} BTC</div>
                  <div>Threshold: {mockVault.threshold}</div>
                </div>
              </motion.div>
            )}

            {mockProposal && step >= 3 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-purple-500/20"
              >
                <div className="text-sm text-slate-400 mb-2">Unlock Proposal</div>
                <div className="text-white font-mono text-sm">
                  <div>Amount: ${mockProposal.amount} BTC</div>
                  <div>Approvals: {mockProposal.approvals} / {mockProposal.required}</div>
                  <div>Status: {mockProposal.status}</div>
                </div>
              </motion.div>
            )}

            {/* Action buttons */}
            <div className="flex gap-4">
              {(step === 0 || step === 2 || step === 6) && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAction}
                  disabled={isAnimating}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold py-4 px-8 rounded-lg shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50"
                >
                  {currentStep.action}
                </motion.button>
              )}
              
              {step < 6 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSkip}
                  className="px-6 py-4 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-800 transition-all"
                >
                  Skip to Proof
                </motion.button>
              )}
            </div>

            {/* Back to home */}
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/')}
                className="text-slate-400 hover:text-white transition-colors text-sm"
              >
                ← Back to Home
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
