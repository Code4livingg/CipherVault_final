import { v4 as uuidv4 } from 'uuid'
import { UnlockProposal, CreateUnlockProposalRequest } from '../types/vault.js'
import { vaultStore } from '../storage/vaultStore.js'
import { vaultService } from './vaultService.js'

export class ProposalService {
  async createProposal(
    vaultId: string,
    request: CreateUnlockProposalRequest
  ): Promise<UnlockProposal | null> {
    const vault = await vaultService.getVault(vaultId)
    if (!vault) return null

    // Check if vault is ready for unlock
    if (vault.status !== 'ready' && vault.status !== 'funding') {
      throw new Error('Vault is not ready for unlock proposal')
    }

    // Check if proposal already exists
    const existing = vaultStore.getProposalByVaultId(vaultId)
    if (existing && !existing.executed) {
      throw new Error('Active proposal already exists for this vault')
    }

    const proposalId = `proposal-${uuidv4()}`
    const now = new Date()
    const expiresAt = new Date(now.getTime() + request.expiryHours * 60 * 60 * 1000)

    const proposal: UnlockProposal = {
      id: proposalId,
      vaultId,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      recipients: request.recipients,
      approvals: [],
      executed: false,
      status: 'pending'
    }

    vaultStore.saveProposal(proposal)
    
    // Update vault with proposal reference
    vaultStore.updateVault(vaultId, {
      unlockProposal: proposal
    })

    return proposal
  }

  async getProposal(id: string): Promise<UnlockProposal | null> {
    const proposal = vaultStore.getProposal(id)
    return proposal || null
  }

  async getProposalByVaultId(vaultId: string): Promise<UnlockProposal | null> {
    const proposal = vaultStore.getProposalByVaultId(vaultId)
    return proposal || null
  }

  async approveProposal(proposalId: string, holderId: string): Promise<UnlockProposal | null> {
    const proposal = vaultStore.getProposal(proposalId)
    if (!proposal) return null

    // Check if already approved by this holder
    const alreadyApproved = proposal.approvals.some(a => a.holderId === holderId)
    if (alreadyApproved) {
      throw new Error('Holder has already approved this proposal')
    }

    // Check if proposal has expired
    if (new Date(proposal.expiresAt) < new Date()) {
      throw new Error('Proposal has expired')
    }

    // Add approval
    const approvals = [
      ...proposal.approvals,
      {
        holderId,
        approvedAt: new Date().toISOString()
      }
    ]

    const updated = vaultStore.updateProposal(proposalId, { approvals })
    
    // Also update vault key holder approval
    if (updated) {
      await vaultService.approveUnlock(proposal.vaultId, holderId)
    }

    return updated || null
  }

  async executeProposal(proposalId: string): Promise<boolean> {
    const proposal = vaultStore.getProposal(proposalId)
    if (!proposal) return false

    const vault = await vaultService.getVault(proposal.vaultId)
    if (!vault) return false

    // Check if threshold is met
    const approvedCount = proposal.approvals.length
    if (approvedCount < vault.threshold) {
      throw new Error('Threshold not met')
    }

    // Check if proposal has expired
    if (new Date(proposal.expiresAt) < new Date()) {
      throw new Error('Proposal has expired')
    }

    // Check if already executed
    if (proposal.executed) {
      throw new Error('Proposal already executed')
    }

    // Mark proposal as executed and unlocking
    vaultStore.updateProposal(proposalId, {
      executed: true,
      executedAt: new Date().toISOString(),
      status: 'unlocking'
    })

    // Update vault status
    await vaultService.updateVaultStatus(proposal.vaultId, 'unlocking')

    // Trigger SideShift swaps for each recipient
    await this.orchestrateUnlock(proposal.vaultId, proposalId, vault, proposal)

    return true
  }

  private async orchestrateUnlock(
    vaultId: string,
    proposalId: string,
    vault: any,
    proposal: any
  ): Promise<void> {
    const { sideShiftService } = await import('./sideshift.js')
    const shifts: any[] = []

    try {
      // Create a shift for each recipient
      for (let i = 0; i < proposal.recipients.length; i++) {
        const recipient = proposal.recipients[i]
        const reference = `${vaultId}|${proposalId}|${i}`

        console.log(`Creating shift ${i + 1}/${proposal.recipients.length} for ${recipient.address}`)

        try {
          const shift = await sideShiftService.createShift(
            vault.sourceAsset,
            recipient.targetAsset,
            recipient.amount,
            recipient.address,
            reference
          )

          shifts.push({
            shiftId: shift.shiftId,
            recipientIndex: i,
            status: 'pending' as const,
            depositAddress: shift.depositAddress,
            settleAddress: shift.settleAddress,
            depositAmount: shift.depositAmount,
            settleAmount: shift.settleAmount
          })

          console.log(`Shift created: ${shift.shiftId}`)
        } catch (error: any) {
          console.error(`Failed to create shift for recipient ${i}:`, error.message)
          shifts.push({
            shiftId: `failed-${i}`,
            recipientIndex: i,
            status: 'failed' as const,
            settleAddress: recipient.address,
            depositAmount: recipient.amount,
            settleAmount: '0',
            error: error.message
          })
        }
      }

      // Update proposal with shift information
      vaultStore.updateProposal(proposalId, {
        shifts
      })

      console.log(`Created ${shifts.length} shifts for proposal ${proposalId}`)

      // If all shifts failed, mark proposal as failed
      const allFailed = shifts.every(s => s.status === 'failed')
      if (allFailed) {
        vaultStore.updateProposal(proposalId, {
          status: 'failed'
        })
        await vaultService.updateVaultStatus(vaultId, 'ready')
      }
    } catch (error) {
      console.error('Unlock orchestration error:', error)
      vaultStore.updateProposal(proposalId, {
        status: 'failed'
      })
      throw error
    }
  }

  async updateShiftStatus(
    proposalId: string,
    shiftId: string,
    status: string,
    txHash?: string
  ): Promise<void> {
    const proposal = vaultStore.getProposal(proposalId)
    if (!proposal || !proposal.shifts) return

    const shifts = proposal.shifts.map(shift =>
      shift.shiftId === shiftId
        ? { ...shift, status: status as 'pending' | 'processing' | 'completed' | 'failed', txHash, updatedAt: new Date().toISOString() }
        : shift
    )

    vaultStore.updateProposal(proposalId, { shifts })

    // Check if all shifts are completed
    const allCompleted = shifts.every(s => s.status === 'completed')
    if (allCompleted) {
      vaultStore.updateProposal(proposalId, {
        status: 'completed'
      })

      // Trigger vault destruction
      const { selfDestruct } = await import('../scripts/selfdestruct.js')
      await vaultService.destroyVault(proposal.vaultId)
      console.log(`All shifts completed for proposal ${proposalId}, vault destroyed`)
    }
  }

  async cancelProposal(proposalId: string): Promise<boolean> {
    return vaultStore.deleteProposal(proposalId)
  }
}

export const proposalService = new ProposalService()
