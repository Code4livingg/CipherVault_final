export type OrgRole = 'ADMIN' | 'SIGNER' | 'AUDITOR'

export type InviteStatus = 'pending' | 'accepted' | 'rejected' | 'expired'

export type MemberStatus = 'online' | 'offline' | 'away'

export interface Organization {
  id: string
  name: string
  logo?: string
  description?: string
  createdAt: string
  updatedAt: string
  members: OrgMember[]
  vaults: string[] // Vault IDs
  settings: OrgSettings
}

export interface OrgMember {
  id: string
  userId: string
  name: string
  email?: string
  walletAddress?: string
  role: OrgRole
  status: MemberStatus
  joinedAt: string
  lastActive: string
  signingReliability: number // 0-100
  avgSigningTime: number // minutes
  totalSigns: number
  avatar?: string
}

export interface OrgInvite {
  id: string
  orgId: string
  orgName: string
  invitedBy: string
  invitedByName: string
  email?: string
  walletAddress?: string
  role: OrgRole
  status: InviteStatus
  createdAt: string
  expiresAt: string
  acceptedAt?: string
}

export interface OrgSettings {
  requireApprovalForVaults: boolean
  minSigners: number
  maxSigners: number
  defaultVaultExpiry: number // days
  allowAuditorExport: boolean
  twoFactorRequired: boolean
}

export interface OrgVaultStats {
  vaultId: string
  memberParticipation: number // percentage
  avgSigningLatency: number // minutes
  proposalCount: number
  lastActivity: string
  riskLevel: 'low' | 'medium' | 'high'
  signerAvailability: number // percentage
}

export interface TeamAnalytics {
  signingDelayHeatmap: {
    date: string
    avgDelay: number
    maxDelay: number
  }[]
  reliabilityGraph: {
    memberId: string
    memberName: string
    reliability: number
    trend: 'up' | 'down' | 'stable'
  }[]
  proposalTrends: {
    week: string
    created: number
    approved: number
    rejected: number
    executed: number
  }[]
}
