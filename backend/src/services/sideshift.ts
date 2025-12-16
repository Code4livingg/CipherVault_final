// SideShift API integration
// Documentation: https://sideshift.ai/api

import axios from 'axios'

interface SideShiftQuote {
  id: string
  depositCoin: string
  settleCoin: string
  depositAmount: string
  settleAmount: string
  expiresAt: string
  rate: string
}

interface SideShiftShift {
  id: string
  depositAddress: string
  depositCoin: string
  settleCoin: string
  depositAmount: string
  settleAmount: string
  settleAddress: string
  status: string
  createdAt: string
}

interface CreateShiftRequest {
  settleAddress: string
  settleAsset: string
  depositAsset: string
  depositAmount: string
  type: 'direct'
  affiliateId: string
  metadata?: {
    reference: string
  }
}

interface CreateShiftResponse {
  shiftId: string
  depositAddress: string
  settleAddress: string
  status: string
  depositAsset: string
  settleAsset: string
  depositAmount: string
  settleAmount: string
}

export class SideShiftService {
  private apiUrl = 'https://sideshift.ai/api/v2'
  private apiKey: string
  private hasApiKey: boolean

  constructor() {
    this.apiKey = process.env.SIDESHIFT_API_KEY || ''
    this.hasApiKey = this.apiKey.length > 0
  }

  async createShift(
    fromAsset: string,
    toAsset: string,
    amount: string,
    destination: string,
    reference: string
  ): Promise<CreateShiftResponse> {
    if (!this.hasApiKey) {
      console.warn('SIDESHIFT_API_KEY not set, using mock shift')
      return this.createMockShift(fromAsset, toAsset, amount, destination, reference)
    }

    try {
      const request: CreateShiftRequest = {
        settleAddress: destination,
        settleAsset: toAsset,
        depositAsset: fromAsset,
        depositAmount: amount,
        type: 'direct',
        affiliateId: 'ciphervault',
        metadata: {
          reference
        }
      }

      const response = await axios.post(`${this.apiUrl}/shifts`, request, {
        headers: {
          'x-api-key': this.apiKey,
          'content-type': 'application/json'
        }
      })

      return {
        shiftId: response.data.id,
        depositAddress: response.data.depositAddress,
        settleAddress: response.data.settleAddress,
        status: response.data.status || 'pending',
        depositAsset: response.data.depositCoin,
        settleAsset: response.data.settleCoin,
        depositAmount: response.data.depositAmount,
        settleAmount: response.data.settleAmount
      }
    } catch (error: any) {
      console.error('SideShift API error:', error.response?.data || error.message)
      throw new Error(`Failed to create shift: ${error.response?.data?.error || error.message}`)
    }
  }

  async getShiftStatus(shiftId: string): Promise<SideShiftShift | null> {
    if (!this.hasApiKey) {
      return this.getMockShiftStatus(shiftId)
    }

    try {
      const response = await axios.get(`${this.apiUrl}/shifts/${shiftId}`, {
        headers: {
          'x-api-key': this.apiKey
        }
      })

      return {
        id: response.data.id,
        depositAddress: response.data.depositAddress,
        depositCoin: response.data.depositCoin,
        settleCoin: response.data.settleCoin,
        depositAmount: response.data.depositAmount,
        settleAmount: response.data.settleAmount,
        settleAddress: response.data.settleAddress,
        status: response.data.status,
        createdAt: response.data.createdAt
      }
    } catch (error: any) {
      console.error('Failed to get shift status:', error.response?.data || error.message)
      return null
    }
  }

  private createMockShift(
    fromAsset: string,
    toAsset: string,
    amount: string,
    destination: string,
    reference: string
  ): CreateShiftResponse {
    const rate = this.getMockRate(fromAsset, toAsset)
    const settleAmount = (parseFloat(amount) * rate).toFixed(8)

    return {
      shiftId: `shift-mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      depositAddress: this.generateMockAddress(fromAsset),
      settleAddress: destination,
      status: 'pending',
      depositAsset: fromAsset,
      settleAsset: toAsset,
      depositAmount: amount,
      settleAmount
    }
  }

  private getMockShiftStatus(shiftId: string): SideShiftShift {
    return {
      id: shiftId,
      depositAddress: 'bc1qmock...',
      depositCoin: 'BTC',
      settleCoin: 'USDT',
      depositAmount: '0.001',
      settleAmount: '43',
      settleAddress: '0xmock...',
      status: 'completed',
      createdAt: new Date().toISOString()
    }
  }

  private getMockRate(depositCoin: string, settleCoin: string): number {
    const rates: Record<string, Record<string, number>> = {
      BTC: {
        USDT: 43000,
        ETH: 17.5,
        USDC: 43000
      },
      ETH: {
        USDT: 2450,
        BTC: 0.057,
        USDC: 2450
      },
      USDT: {
        BTC: 0.000023,
        ETH: 0.00041,
        USDC: 1.0
      }
    }

    return rates[depositCoin]?.[settleCoin] || 1
  }

  private generateMockAddress(coin: string): string {
    if (coin === 'BTC') {
      return 'bc1q' + this.randomHex(40)
    }
    return '0x' + this.randomHex(40)
  }

  private randomHex(length: number): string {
    const chars = '0123456789abcdef'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)]
    }
    return result
  }
}

export const sideShiftService = new SideShiftService()
