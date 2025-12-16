import { Vault, UnlockProposal } from '../types/vault'

// In-memory storage (replace with database in production)
class VaultStore {
  private vaults: Map<string, Vault> = new Map()
  private proposals: Map<string, UnlockProposal> = new Map()

  // Vault operations
  saveVault(vault: Vault): void {
    this.vaults.set(vault.id, vault)
  }

  getVault(id: string): Vault | undefined {
    return this.vaults.get(id)
  }

  getAllVaults(): Vault[] {
    return Array.from(this.vaults.values())
  }

  updateVault(id: string, updates: Partial<Vault>): Vault | undefined {
    const vault = this.vaults.get(id)
    if (!vault) return undefined

    const updated = {
      ...vault,
      ...updates,
      updatedAt: new Date().toISOString()
    }
    this.vaults.set(id, updated)
    return updated
  }

  deleteVault(id: string): boolean {
    return this.vaults.delete(id)
  }

  // Proposal operations
  saveProposal(proposal: UnlockProposal): void {
    this.proposals.set(proposal.id, proposal)
  }

  getProposal(id: string): UnlockProposal | undefined {
    return this.proposals.get(id)
  }

  getProposalByVaultId(vaultId: string): UnlockProposal | undefined {
    return Array.from(this.proposals.values()).find(p => p.vaultId === vaultId)
  }

  updateProposal(id: string, updates: Partial<UnlockProposal>): UnlockProposal | undefined {
    const proposal = this.proposals.get(id)
    if (!proposal) return undefined

    const updated = { ...proposal, ...updates }
    this.proposals.set(id, updated)
    return updated
  }

  deleteProposal(id: string): boolean {
    return this.proposals.delete(id)
  }

  // Utility methods
  getExpiredVaults(): Vault[] {
    const now = new Date()
    return Array.from(this.vaults.values()).filter(vault => {
      const expiresAt = new Date(vault.expiresAt)
      return expiresAt < now && vault.status !== 'destroyed'
    })
  }

  getExpiredProposals(): UnlockProposal[] {
    const now = new Date()
    return Array.from(this.proposals.values()).filter(proposal => {
      const expiresAt = new Date(proposal.expiresAt)
      return expiresAt < now && !proposal.executed
    })
  }
}

export const vaultStore = new VaultStore()
