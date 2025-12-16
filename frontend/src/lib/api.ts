import axios from 'axios'

const API_BASE_URL = 'http://localhost:3001/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

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
