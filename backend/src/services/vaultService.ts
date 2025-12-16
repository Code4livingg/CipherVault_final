import { v4 as uuidv4 } from 'uuid'
import { Vault, CreateVaultRequest, VaultStatus, KeyHolder } from '../types/vault'
import { vaultStore } from '../storage/vaultStore'
import { generateDepositAddress } from './cryptoService'

export class VaultService {
  async createVault(request: CreateVaultRequest): Promise<Vault> {
    const vaultId = `vault-${uuidv4()}`
    
    // Set defaults
    const sourceAsset = request.sourceAsset || 'BTC'
    const targetAsset = request.targetAsset || 'BTC'
    const autoSwap = request.autoSwap ?? true
    
    // Generate deposit address
    const depositAddress = await generateDepositAddress(sourceAsset)
    
    // Calculate expiry
    const expiresAt = this.calculateExpiry(request.expiry)
    
    // Create key holders
    const keyHolders: KeyHolder[] = request.keyHolders.map((holder, index) => ({
      id: `holder-${index + 1}`,
      name: holder.name,
      email: holder.email,
      walletAddress: holder.walletAddress,
      approved: false
    }))

    const vault: Vault = {
      id: vaultId,
      name: request.name,
      description: request.description,
      status: 'created',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      keyHolders,
      threshold: request.threshold,
      totalDeposits: '0',
      sourceAsset,
      targetAsset,
      depositAddress,
      supportedChains: this.getSupportedChains(sourceAsset),
      expiresAt,
      autoSwap
    }

    vaultStore.saveVault(vault)
    return vault
  }

  async getVault(id: string): Promise<Vault | null> {
    const vault = vaultStore.getVault(id)
    return vault || null
  }

  async updateVaultStatus(id: string, status: VaultStatus): Promise<Vault | null> {
    const updated = vaultStore.updateVault(id, { status })
    return updated || null
  }

  async updateDeposits(id: string, amount: string): Promise<Vault | null> {
    const vault = vaultStore.getVault(id)
    if (!vault) return null

    const updated = vaultStore.updateVault(id, {
      totalDeposits: amount,
      status: parseFloat(amount) > 0 ? 'funding' : 'created'
    })

    return updated || null
  }

  async approveUnlock(vaultId: string, holderId: string): Promise<Vault | null> {
    const vault = vaultStore.getVault(vaultId)
    if (!vault) return null

    const keyHolders = vault.keyHolders.map(holder =>
      holder.id === holderId
        ? { ...holder, approved: true, approvedAt: new Date().toISOString() }
        : holder
    )

    const approvedCount = keyHolders.filter(h => h.approved).length
    const status: VaultStatus = approvedCount >= vault.threshold ? 'ready' : vault.status

    const updated = vaultStore.updateVault(vaultId, {
      keyHolders,
      status
    })

    return updated || null
  }

  async destroyVault(id: string): Promise<boolean> {
    const vault = vaultStore.getVault(id)
    if (!vault) return false

    vaultStore.updateVault(id, {
      status: 'destroyed',
      totalDeposits: '0'
    })

    return true
  }

  private calculateExpiry(expiry?: string): string {
    const now = new Date()
    
    if (!expiry) {
      // Default to 7 days if not provided
      now.setDate(now.getDate() + 7)
      return now.toISOString()
    }
    
    if (expiry === '24h') {
      now.setHours(now.getHours() + 24)
    } else if (expiry === '7d') {
      now.setDate(now.getDate() + 7)
    } else if (expiry === '30d') {
      now.setDate(now.getDate() + 30)
    } else {
      // Parse custom format like "14d", "90d"
      const match = expiry.match(/^(\d+)d$/)
      if (match) {
        now.setDate(now.getDate() + parseInt(match[1]))
      } else {
        // Default to 7 days
        now.setDate(now.getDate() + 7)
      }
    }

    return now.toISOString()
  }

  private getSupportedChains(asset: string): string[] {
    const chainMap: Record<string, string[]> = {
      BTC: ['Bitcoin', 'Lightning'],
      ETH: ['Ethereum', 'Polygon', 'Arbitrum'],
      USDT: ['Ethereum', 'Tron', 'Polygon', 'Arbitrum'],
      USDC: ['Ethereum', 'Polygon', 'Arbitrum', 'Solana']
    }

    return chainMap[asset] || ['Ethereum']
  }
}

export const vaultService = new VaultService()
