export type VaultStatus = 'created' | 'funding' | 'ready' | 'unlocking' | 'destroyed'

export interface KeyHolder {
  id: string
  name: string
  email?: string
  walletAddress?: string
  approved: boolean
  approvedAt?: string
}

export interface Recipient {
  address: string
  name?: string
  amount: string
  percentage: number
  targetAsset: string
}

export interface Vault {
  id: string
  name: string
  description?: string
  status: VaultStatus
  createdAt: string
  updatedAt: string
  
  // Key holders
  keyHolders: KeyHolder[]
  threshold: number
  
  // Deposits
  totalDeposits: string
  sourceAsset: string
  targetAsset: string
  depositAddress: string
  supportedChains: string[]
  
  // Settings
  expiresAt: string
  autoSwap: boolean
  
  // Unlock proposal
  unlockProposal?: UnlockProposal
}

export interface ShiftInfo {
  shiftId: string
  recipientIndex: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  depositAddress?: string
  settleAddress: string
  depositAmount: string
  settleAmount: string
  txHash?: string
  error?: string
}

export interface UnlockProposal {
  id: string
  vaultId: string
  createdAt: string
  expiresAt: string
  recipients: Recipient[]
  approvals: {
    holderId: string
    approvedAt: string
  }[]
  executed: boolean
  executedAt?: string
  status: 'pending' | 'unlocking' | 'completed' | 'failed'
  shifts?: ShiftInfo[]
}

export interface CreateVaultRequest {
  name: string
  description?: string
  keyHolders: Array<{
    name: string
    email?: string
    walletAddress?: string
  }>
  threshold: number
  sourceAsset?: string
  targetAsset?: string
  expiry?: string
  autoSwap?: boolean
}

export interface CreateUnlockProposalRequest {
  recipients: Recipient[]
  expiryHours: number
}

export interface ApproveProposalRequest {
  holderId: string
}
