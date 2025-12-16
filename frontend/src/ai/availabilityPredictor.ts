import { OrgMember } from '../types/organization'

export interface AvailabilityPrediction {
  memberId: string
  memberName: string
  likelihood: number // 0-100
  confidence: 'low' | 'medium' | 'high'
  factors: string[]
  estimatedResponseTime: number // minutes
}

export function predictKeyholderAvailability(
  member: OrgMember,
  historicalData?: {
    avgResponseTime: number
    signatureCount: number
    missedCount: number
  }
): AvailabilityPrediction {
  const factors: string[] = []
  let likelihood = 50 // Start neutral

  // Factor 1: Current status
  if (member.status === 'online') {
    likelihood += 30
    factors.push('Currently online')
  } else if (member.status === 'away') {
    likelihood += 10
    factors.push('Status: Away')
  } else {
    likelihood -= 20
    factors.push('Currently offline')
  }

  // Factor 2: Recent activity
  const lastActive = new Date(member.lastActive)
  const hoursSinceActive = (Date.now() - lastActive.getTime()) / (1000 * 60 * 60)
  
  if (hoursSinceActive < 1) {
    likelihood += 20
    factors.push('Active within last hour')
  } else if (hoursSinceActive < 24) {
    likelihood += 10
    factors.push('Active today')
  } else if (hoursSinceActive > 168) {
    likelihood -= 20
    factors.push('Inactive for over a week')
  }

  // Factor 3: Signing reliability
  if (member.signingReliability > 90) {
    likelihood += 15
    factors.push(`High reliability (${member.signingReliability}%)`)
  } else if (member.signingReliability < 70) {
    likelihood -= 15
    factors.push(`Low reliability (${member.signingReliability}%)`)
  }

  // Factor 4: Average signing time
  if (member.avgSigningTime < 15) {
    likelihood += 10
    factors.push('Fast signer (avg < 15min)')
  } else if (member.avgSigningTime > 60) {
    likelihood -= 10
    factors.push('Slow signer (avg > 1hr)')
  }

  // Factor 5: Timezone prediction (simplified)
  const currentHour = new Date().getHours()
  if (currentHour >= 9 && currentHour <= 17) {
    likelihood += 10
    factors.push('Business hours')
  } else if (currentHour >= 22 || currentHour <= 6) {
    likelihood -= 15
    factors.push('Outside business hours')
  }

  // Factor 6: Historical data
  if (historicalData) {
    const successRate = historicalData.signatureCount / 
      (historicalData.signatureCount + historicalData.missedCount)
    
    if (successRate > 0.9) {
      likelihood += 10
      factors.push('Excellent track record')
    } else if (successRate < 0.7) {
      likelihood -= 10
      factors.push('Inconsistent history')
    }
  }

  // Normalize likelihood
  likelihood = Math.max(0, Math.min(100, likelihood))

  // Determine confidence
  let confidence: 'low' | 'medium' | 'high'
  if (member.totalSigns < 5) {
    confidence = 'low'
  } else if (member.totalSigns < 20) {
    confidence = 'medium'
  } else {
    confidence = 'high'
  }

  // Estimate response time
  let estimatedResponseTime = member.avgSigningTime
  if (member.status === 'online') {
    estimatedResponseTime *= 0.7 // Faster when online
  } else if (member.status === 'offline') {
    estimatedResponseTime *= 2 // Slower when offline
  }

  return {
    memberId: member.id,
    memberName: member.name,
    likelihood: Math.round(likelihood),
    confidence,
    factors,
    estimatedResponseTime: Math.round(estimatedResponseTime)
  }
}

export function predictGroupAvailability(
  members: OrgMember[],
  threshold: number
): {
  overallLikelihood: number
  estimatedTime: number
  predictions: AvailabilityPrediction[]
  warning?: string
} {
  const predictions = members.map(m => predictKeyholderAvailability(m))
  
  // Sort by likelihood
  const sortedPredictions = [...predictions].sort((a, b) => b.likelihood - a.likelihood)
  
  // Take top N predictions where N = threshold
  const topPredictions = sortedPredictions.slice(0, threshold)
  
  // Calculate overall likelihood (average of top N)
  const overallLikelihood = Math.round(
    topPredictions.reduce((sum, p) => sum + p.likelihood, 0) / threshold
  )
  
  // Estimate time (max of top N)
  const estimatedTime = Math.max(...topPredictions.map(p => p.estimatedResponseTime))
  
  // Generate warning if needed
  let warning: string | undefined
  if (overallLikelihood < 50) {
    warning = 'Low signature probability - consider waiting for more keyholders'
  } else if (estimatedTime > 120) {
    warning = 'Estimated signing time exceeds 2 hours'
  }
  
  return {
    overallLikelihood,
    estimatedTime,
    predictions,
    warning
  }
}

export function getLikelihoodColor(likelihood: number): string {
  if (likelihood >= 70) return '#10B981'
  if (likelihood >= 40) return '#D1A954'
  return '#DC2626'
}

export function getConfidenceLabel(confidence: 'low' | 'medium' | 'high'): string {
  return confidence.charAt(0).toUpperCase() + confidence.slice(1) + ' Confidence'
}
