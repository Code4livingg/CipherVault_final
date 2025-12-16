import { Vault, UnlockProposal } from '../lib/api'
import { OrgMember } from '../types/organization'

export interface RiskScore {
  score: number // 0-100
  level: 'low' | 'medium' | 'high'
  factors: RiskFactor[]
  recommendations: string[]
}

export interface RiskFactor {
  name: string
  impact: 'positive' | 'negative' | 'neutral'
  weight: number
  description: string
}

export function calculateProposalRisk(
  proposal: UnlockProposal,
  vault: Vault,
  members?: OrgMember[]
): RiskScore {
  const factors: RiskFactor[] = []
  let totalScore = 50 // Start neutral

  // Factor 1: Amount risk (higher amounts = higher risk)
  const totalAmount = parseFloat(vault.totalDeposits)
  const proposalAmount = proposal.recipients.reduce((sum, r) => sum + parseFloat(r.amount), 0)
  const amountRatio = proposalAmount / totalAmount
  
  if (amountRatio > 0.9) {
    factors.push({
      name: 'High Amount',
      impact: 'negative',
      weight: 20,
      description: `Unlocking ${(amountRatio * 100).toFixed(0)}% of vault balance`
    })
    totalScore += 20
  } else if (amountRatio > 0.5) {
    factors.push({
      name: 'Moderate Amount',
      impact: 'negative',
      weight: 10,
      description: `Unlocking ${(amountRatio * 100).toFixed(0)}% of vault balance`
    })
    totalScore += 10
  } else {
    factors.push({
      name: 'Low Amount',
      impact: 'positive',
      weight: -10,
      description: `Only ${(amountRatio * 100).toFixed(0)}% of vault balance`
    })
    totalScore -= 10
  }

  // Factor 2: Recipient count (more recipients = higher complexity)
  if (proposal.recipients.length > 5) {
    factors.push({
      name: 'Many Recipients',
      impact: 'negative',
      weight: 10,
      description: `${proposal.recipients.length} recipients increases complexity`
    })
    totalScore += 10
  } else if (proposal.recipients.length === 1) {
    factors.push({
      name: 'Single Recipient',
      impact: 'positive',
      weight: -5,
      description: 'Simple single-recipient transfer'
    })
    totalScore -= 5
  }

  // Factor 3: Time pressure (expiring soon = higher risk)
  const now = new Date()
  const expiry = new Date(proposal.expiresAt)
  const hoursUntilExpiry = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60)
  
  if (hoursUntilExpiry < 24) {
    factors.push({
      name: 'Urgent Expiry',
      impact: 'negative',
      weight: 15,
      description: `Expires in ${Math.round(hoursUntilExpiry)} hours`
    })
    totalScore += 15
  } else if (hoursUntilExpiry > 168) {
    factors.push({
      name: 'Ample Time',
      impact: 'positive',
      weight: -10,
      description: `${Math.round(hoursUntilExpiry / 24)} days to review`
    })
    totalScore -= 10
  }

  // Factor 4: Keyholder availability
  if (members) {
    const onlineCount = members.filter(m => m.status === 'online').length
    const availabilityRatio = onlineCount / vault.keyHolders.length
    
    if (availabilityRatio < 0.5) {
      factors.push({
        name: 'Low Availability',
        impact: 'negative',
        weight: 15,
        description: `Only ${onlineCount}/${vault.keyHolders.length} keyholders online`
      })
      totalScore += 15
    } else if (availabilityRatio > 0.8) {
      factors.push({
        name: 'High Availability',
        impact: 'positive',
        weight: -10,
        description: `${onlineCount}/${vault.keyHolders.length} keyholders online`
      })
      totalScore -= 10
    }
  }

  // Factor 5: Approval progress
  const approvalRatio = proposal.approvals.length / vault.threshold
  if (approvalRatio >= 1) {
    factors.push({
      name: 'Threshold Met',
      impact: 'positive',
      weight: -15,
      description: 'All required approvals received'
    })
    totalScore -= 15
  } else if (approvalRatio < 0.5) {
    factors.push({
      name: 'Few Approvals',
      impact: 'negative',
      weight: 10,
      description: `Only ${proposal.approvals.length}/${vault.threshold} approvals`
    })
    totalScore += 10
  }

  // Factor 6: Cross-asset swaps
  const hasSwaps = proposal.recipients.some(r => r.targetAsset !== vault.sourceAsset)
  if (hasSwaps) {
    factors.push({
      name: 'Asset Swaps',
      impact: 'negative',
      weight: 10,
      description: 'Cross-asset transfers add complexity'
    })
    totalScore += 10
  }

  // Normalize score to 0-100
  totalScore = Math.max(0, Math.min(100, totalScore))

  // Determine risk level
  let level: 'low' | 'medium' | 'high'
  if (totalScore < 40) level = 'low'
  else if (totalScore < 70) level = 'medium'
  else level = 'high'

  // Generate recommendations
  const recommendations: string[] = []
  if (level === 'high') {
    recommendations.push('Consider reducing unlock amount')
    recommendations.push('Wait for more keyholders to come online')
    recommendations.push('Extend proposal expiry if possible')
  } else if (level === 'medium') {
    recommendations.push('Review recipient addresses carefully')
    recommendations.push('Ensure sufficient approvals before expiry')
  } else {
    recommendations.push('Proposal appears safe to proceed')
  }

  return {
    score: Math.round(totalScore),
    level,
    factors,
    recommendations
  }
}

export function getRiskColor(level: 'low' | 'medium' | 'high'): string {
  switch (level) {
    case 'low': return '#10B981'
    case 'medium': return '#D1A954'
    case 'high': return '#DC2626'
  }
}

export function getRiskLabel(level: 'low' | 'medium' | 'high'): string {
  switch (level) {
    case 'low': return 'Low Risk'
    case 'medium': return 'Medium Risk'
    case 'high': return 'High Risk'
  }
}
