import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 second timeout
})

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

// Health check function
export async function checkApiHealth(): Promise<{ status: string; url: string }> {
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
  const response = await api.post('/vault/create', data)
  return response.data
}

export async function getVault(id: string): Promise<Vault> {
  const response = await api.get(`/vault/${id}`)
  return response.data
}

export async function updateDeposits(id: string, amount: string): Promise<Vault> {
  const response = await api.post(`/vault/${id}/deposits`, { amount })
  return response.data
}

export async function approveUnlock(id: string, holderId: string): Promise<Vault> {
  const response = await api.post(`/vault/${id}/approve`, { holderId })
  return response.data
}

export async function createProposal(
  vaultId: string,
  data: CreateProposalRequest
): Promise<UnlockProposal> {
  const response = await api.post(`/vault/${vaultId}/proposal`, data)
  return response.data
}

export async function getProposal(vaultId: string): Promise<UnlockProposal> {
  const response = await api.get(`/vault/${vaultId}/proposal`)
  return response.data
}

export async function approveProposal(
  vaultId: string,
  holderId: string
): Promise<UnlockProposal> {
  const response = await api.post(`/vault/${vaultId}/proposal/approve`, { holderId })
  return response.data
}

export async function executeProposal(vaultId: string): Promise<{ success: boolean; message: string }> {
  const response = await api.post(`/vault/${vaultId}/proposal/execute`)
  return response.data
}

export async function destroyVault(id: string): Promise<{ success: boolean; message: string }> {
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
