import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
// FORCE DEMO MODE - NEVER MAKE NETWORK REQUESTS
const DEMO_MODE = true // HARDCODED DEMO MODE - v3.0
const VERSION = '3.0.0'
const FORCE_DEMO = true // Extra safety

// Debug logging
console.log(`🔧 API Configuration v${VERSION}:`, {
  VERSION,
  API_BASE_URL,
  DEMO_MODE,
  FORCE_DEMO,
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_DEMO_MODE: import.meta.env.VITE_DEMO_MODE,
  NODE_ENV: import.meta.env.NODE_ENV,
  MODE: import.meta.env.MODE
})

// ALERT: Force demo mode
console.error('🚨 FORCED DEMO MODE v3.0 - NO NETWORK REQUESTS ALLOWED')
alert('🎭 CipherVault v3.0 - Demo Mode Active (No Backend Required)')

if (DEMO_MODE || FORCE_DEMO) {
  console.log('🎭 DEMO MODE ACTIVE - NO NETWORK REQUESTS WILL BE MADE')
} else {
  console.log('🌐 LIVE MODE - WILL ATTEMPT API CONNECTIONS')
}

if (DEMO_MODE) {
  console.log('🎭 Demo Mode is ENABLED - Using mock data')
} else {
  console.log('🌐 Live Mode - Connecting to API at:', API_BASE_URL)
}

// NEVER create axios instance in demo mode
const api = (DEMO_MODE || FORCE_DEMO) ? null : axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 second timeout
})

// Add interceptors only if not in demo mode
if (!DEMO_MODE && !FORCE_DEMO && api) {
  // Add request interceptor for debugging
  api.interceptors.request.use(
    (config) => {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`)
      return config
    },
    (error) => {
      console.error('API Request Error:', error)
      return Promise.reject(error)
    }
  )

  // Add response interceptor for error handling
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error('API Response Error:', error.response?.data || error.message)
      return Promise.reject(error)
    }
  )
}

// Types
export interface CreateVaultRequest {
  name: string
  description?: string
  keyHolders: Array<{
    name: string
    email?: string
    walletAddress?: string
  }>
  threshold: number
  sourceAsset: string
  targetAsset: string
  expiry: string
  autoSwap: boolean
}

export interface Vault {
  id: string
  name: string
  description?: string
  status: 'created' | 'funding' | 'ready' | 'unlocking' | 'destroyed'
  createdAt: string
  updatedAt: string
  keyHolders: Array<{
    id: string
    name: string
    email?: string
    walletAddress?: string
    approved: boolean
    approvedAt?: string
  }>
  threshold: number
  totalDeposits: string
  sourceAsset: string
  targetAsset: string
  depositAddress: string
  supportedChains: string[]
  expiresAt: string
  autoSwap: boolean
  unlockProposal?: UnlockProposal
}

export interface UnlockProposal {
  id: string
  vaultId: string
  createdAt: string
  expiresAt: string
  recipients: Array<{
    address: string
    name?: string
    amount: string
    percentage: number
    targetAsset: string
  }>
  approvals: Array<{
    holderId: string
    approvedAt: string
  }>
  executed: boolean
  executedAt?: string
  status?: 'pending' | 'unlocking' | 'completed' | 'failed'
  shifts?: Array<{
    shiftId: string
    recipientIndex: number
    status: 'pending' | 'processing' | 'completed' | 'failed'
    depositAddress?: string
    settleAddress: string
    depositAmount: string
    settleAmount: string
    txHash?: string
    error?: string
  }>
}

export interface CreateProposalRequest {
  recipients: Array<{
    address: string
    name?: string
    amount: string
    percentage: number
    targetAsset: string
  }>
  expiryHours: number
}

// Mock data for demo mode
const mockVault: Vault = {
  id: 'demo-vault-123',
  name: 'Demo Vault',
  description: 'This is a demonstration vault',
  status: 'ready',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  keyHolders: [
    {
      id: 'holder-1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      walletAddress: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
      approved: true,
      approvedAt: new Date().toISOString()
    },
    {
      id: 'holder-2', 
      name: 'Bob Smith',
      email: 'bob@example.com',
      walletAddress: '0x8D4C0532925a3b8D4C0532925a3b8D4C0532925a',
      approved: false
    }
  ],
  threshold: 2,
  totalDeposits: '1.5',
  sourceAsset: 'BTC',
  targetAsset: 'ETH',
  depositAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
  supportedChains: ['Bitcoin', 'Ethereum'],
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  autoSwap: true
}

// Health check function
export async function checkApiHealth(): Promise<{ status: string; url: string }> {
  if (DEMO_MODE || FORCE_DEMO) {
    return { status: 'demo', url: 'Demo Mode - No Backend Required' }
  }
  
  try {
    await axios.get(`${API_BASE_URL.replace('/api', '')}/health`, { timeout: 5000 })
    return { status: 'connected', url: API_BASE_URL }
  } catch (error) {
    console.warn('API health check failed:', error)
    return { status: 'disconnected', url: API_BASE_URL }
  }
}

// API Functions
export async function createVault(data: CreateVaultRequest): Promise<Vault> {
  console.log('createVault called with DEMO_MODE:', DEMO_MODE)
  
  if (DEMO_MODE || FORCE_DEMO) {
    console.log('Using demo mode for createVault')
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newVault: Vault = {
      ...mockVault,
      id: `vault-${Date.now()}`,
      name: data.name,
      description: data.description,
      keyHolders: data.keyHolders.map((holder, index) => ({
        id: `holder-${index + 1}`,
        name: holder.name,
        email: holder.email,
        walletAddress: holder.walletAddress || `0x${Math.random().toString(16).substr(2, 40)}`,
        approved: false
      })),
      threshold: data.threshold,
      sourceAsset: data.sourceAsset,
      targetAsset: data.targetAsset,
      autoSwap: data.autoSwap,
      status: 'created',
      totalDeposits: '0'
    }
    
    console.log('Demo: Created vault', newVault)
    return newVault
  }
  
  if (!api) throw new Error('API not available in demo mode')
  const response = await api.post('/vault/create', data)
  return response.data
}

export async function getVault(id: string): Promise<Vault> {
  if (DEMO_MODE || FORCE_DEMO) {
    await new Promise(resolve => setTimeout(resolve, 500))
    return { ...mockVault, id }
  }
  
  if (!api) throw new Error('API not available in demo mode')
  const response = await api.get(`/vault/${id}`)
  return response.data
}

export async function updateDeposits(id: string, amount: string): Promise<Vault> {
  if (DEMO_MODE || FORCE_DEMO) {
    await new Promise(resolve => setTimeout(resolve, 800))
    return { ...mockVault, id, totalDeposits: amount, status: 'ready' }
  }
  
  if (!api) throw new Error('API not available in demo mode')
  const response = await api.post(`/vault/${id}/deposits`, { amount })
  return response.data
}

export async function approveUnlock(id: string, holderId: string): Promise<Vault> {
  if (DEMO_MODE || FORCE_DEMO) {
    await new Promise(resolve => setTimeout(resolve, 600))
    const updatedVault = { ...mockVault, id }
    updatedVault.keyHolders = updatedVault.keyHolders.map(holder => 
      holder.id === holderId 
        ? { ...holder, approved: true, approvedAt: new Date().toISOString() }
        : holder
    )
    return updatedVault
  }
  
  if (!api) throw new Error('API not available in demo mode')
  const response = await api.post(`/vault/${id}/approve`, { holderId })
  return response.data
}

export async function createProposal(
  vaultId: string,
  data: CreateProposalRequest
): Promise<UnlockProposal> {
  if (DEMO_MODE || FORCE_DEMO) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const mockProposal: UnlockProposal = {
      id: `proposal-${Date.now()}`,
      vaultId,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + data.expiryHours * 60 * 60 * 1000).toISOString(),
      recipients: data.recipients,
      approvals: [],
      executed: false,
      status: 'pending'
    }
    
    return mockProposal
  }
  
  if (!api) throw new Error('API not available in demo mode')
  const response = await api.post(`/vault/${vaultId}/proposal`, data)
  return response.data
}

export async function getProposal(vaultId: string): Promise<UnlockProposal> {
  if (DEMO_MODE || FORCE_DEMO) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const mockProposal: UnlockProposal = {
      id: `proposal-${vaultId}`,
      vaultId,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(),
      recipients: [
        {
          address: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
          name: 'Treasury Wallet',
          amount: '0.75',
          percentage: 50,
          targetAsset: 'ETH'
        },
        {
          address: '0x8D4C0532925a3b8D4C0532925a3b8D4C0532925a',
          name: 'Operations Wallet', 
          amount: '0.75',
          percentage: 50,
          targetAsset: 'ETH'
        }
      ],
      approvals: [
        {
          holderId: 'holder-1',
          approvedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
        }
      ],
      executed: false,
      status: 'pending'
    }
    
    return mockProposal
  }
  
  if (!api) throw new Error('API not available in demo mode')
  const response = await api.get(`/vault/${vaultId}/proposal`)
  return response.data
}

export async function approveProposal(
  vaultId: string,
  holderId: string
): Promise<UnlockProposal> {
  if (DEMO_MODE || FORCE_DEMO) {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const proposal = await getProposal(vaultId)
    proposal.approvals.push({
      holderId,
      approvedAt: new Date().toISOString()
    })
    
    return proposal
  }
  
  if (!api) throw new Error('API not available in demo mode')
  const response = await api.post(`/vault/${vaultId}/proposal/approve`, { holderId })
  return response.data
}

export async function executeProposal(vaultId: string): Promise<{ success: boolean; message: string }> {
  if (DEMO_MODE || FORCE_DEMO) {
    await new Promise(resolve => setTimeout(resolve, 2000))
    return { 
      success: true, 
      message: 'Demo: Proposal execution initiated. Crypto swaps are being processed.' 
    }
  }
  
  if (!api) throw new Error('API not available in demo mode')
  const response = await api.post(`/vault/${vaultId}/proposal/execute`)
  return response.data
}

export async function destroyVault(id: string): Promise<{ success: boolean; message: string }> {
  if (DEMO_MODE || FORCE_DEMO) {
    await new Promise(resolve => setTimeout(resolve, 1500))
    return { 
      success: true, 
      message: 'Demo: Vault has been securely destroyed and all data wiped.' 
    }
  }
  
  if (!api) throw new Error('API not available in demo mode')
  const response = await api.delete(`/vault/${id}`)
  return response.data
}

// Error handler
export function handleApiError(error: any): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error || error.message || 'An error occurred'
  }
  return 'An unexpected error occurred'
}
