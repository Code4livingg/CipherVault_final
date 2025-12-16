export interface FeeRoute {
  path: string[]
  estimatedFee: number
  estimatedTime: number // minutes
  savings: number // compared to baseline
  confidence: 'low' | 'medium' | 'high'
  description: string
}

export interface FeeOptimization {
  recommendedRoute: FeeRoute
  alternativeRoutes: FeeRoute[]
  totalSavings: number
  optimizationFactors: string[]
}

export function optimizeUnlockFees(
  sourceAsset: string,
  targetAssets: { asset: string; amount: number }[],
  urgency: 'low' | 'medium' | 'high' = 'medium'
): FeeOptimization {
  const routes: FeeRoute[] = []
  const optimizationFactors: string[] = []

  // Mock fee data (in reality, would query real-time rates)
  const baseFees = {
    BTC: 0.0001,
    ETH: 0.002,
    USDT: 1.5
  }

  const swapFees = {
    'BTC-ETH': 0.003,
    'BTC-USDT': 0.002,
    'ETH-BTC': 0.003,
    'ETH-USDT': 0.001,
    'USDT-BTC': 0.002,
    'USDT-ETH': 0.001
  }

  // Calculate baseline (direct transfers)
  let baselineFee = 0
  targetAssets.forEach(target => {
    if (target.asset === sourceAsset) {
      baselineFee += baseFees[sourceAsset as keyof typeof baseFees] || 0.001
    } else {
      const swapKey = `${sourceAsset}-${target.asset}` as keyof typeof swapFees
      baselineFee += (swapFees[swapKey] || 0.005) * target.amount
    }
  })

  // Route 1: Direct transfers (baseline)
  routes.push({
    path: targetAssets.map(t => `${sourceAsset} → ${t.asset}`),
    estimatedFee: baselineFee,
    estimatedTime: urgency === 'high' ? 30 : urgency === 'medium' ? 60 : 120,
    savings: 0,
    confidence: 'high',
    description: 'Direct transfers with standard fees'
  })

  // Route 2: Batch optimization
  const uniqueAssets = [...new Set(targetAssets.map(t => t.asset))]
  if (uniqueAssets.length < targetAssets.length) {
    const batchFee = baselineFee * 0.85 // 15% savings from batching
    routes.push({
      path: [`Batch ${sourceAsset} → ${uniqueAssets.join(', ')}`],
      estimatedFee: batchFee,
      estimatedTime: urgency === 'high' ? 45 : urgency === 'medium' ? 90 : 180,
      savings: baselineFee - batchFee,
      confidence: 'high',
      description: 'Batch similar transfers to save on fees'
    })
    optimizationFactors.push('Batching similar transfers')
  }

  // Route 3: Low-fee timing (if not urgent)
  if (urgency === 'low') {
    const lowFeeFee = baselineFee * 0.7 // 30% savings with low-fee timing
    routes.push({
      path: targetAssets.map(t => `${sourceAsset} → ${t.asset} (off-peak)`),
      estimatedFee: lowFeeFee,
      estimatedTime: 240, // 4 hours
      savings: baselineFee - lowFeeFee,
      confidence: 'medium',
      description: 'Wait for off-peak hours for lower fees'
    })
    optimizationFactors.push('Off-peak timing')
  }

  // Route 4: Alternative swap paths
  if (targetAssets.some(t => t.asset !== sourceAsset)) {
    // Check if routing through intermediate asset is cheaper
    const intermediateAsset = 'USDT'
    let intermediateFee = 0
    
    targetAssets.forEach(target => {
      if (target.asset !== sourceAsset) {
        const toIntermediate = swapFees[`${sourceAsset}-${intermediateAsset}` as keyof typeof swapFees] || 0.003
        const toTarget = swapFees[`${intermediateAsset}-${target.asset}` as keyof typeof swapFees] || 0.003
        intermediateFee += (toIntermediate + toTarget) * target.amount * 0.9 // Slight savings
      } else {
        intermediateFee += baseFees[sourceAsset as keyof typeof baseFees] || 0.001
      }
    })

    if (intermediateFee < baselineFee) {
      routes.push({
        path: [`${sourceAsset} → ${intermediateAsset} → targets`],
        estimatedFee: intermediateFee,
        estimatedTime: urgency === 'high' ? 60 : urgency === 'medium' ? 120 : 240,
        savings: baselineFee - intermediateFee,
        confidence: 'medium',
        description: `Route through ${intermediateAsset} for better rates`
      })
      optimizationFactors.push('Alternative routing')
    }
  }

  // Sort routes by fee (lowest first)
  routes.sort((a, b) => a.estimatedFee - b.estimatedFee)

  // Recommended route is the cheapest with acceptable time
  const maxAcceptableTime = urgency === 'high' ? 60 : urgency === 'medium' ? 120 : 300
  const recommendedRoute = routes.find(r => r.estimatedTime <= maxAcceptableTime) || routes[0]

  return {
    recommendedRoute,
    alternativeRoutes: routes.filter(r => r !== recommendedRoute),
    totalSavings: recommendedRoute.savings,
    optimizationFactors: optimizationFactors.length > 0 
      ? optimizationFactors 
      : ['Standard routing - no optimizations available']
  }
}

export function formatFee(fee: number, asset: string = 'BTC'): string {
  if (asset === 'USDT') {
    return `$${fee.toFixed(2)}`
  }
  return `${fee.toFixed(6)} ${asset}`
}

export function formatTime(minutes: number): string {
  if (minutes < 60) {
    return `~${minutes}min`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `~${hours}h ${mins}min` : `~${hours}h`
}

export function getSavingsColor(savings: number): string {
  if (savings > 0.001) return '#10B981'
  if (savings > 0) return '#D1A954'
  return '#6B7280'
}
