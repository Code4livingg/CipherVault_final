// @ts-nocheck
import { Router } from 'express'
import { vaultService } from '../services/vaultService'
import { proposalService } from '../services/proposalService'
import { CreateVaultRequest, CreateUnlockProposalRequest, ApproveProposalRequest } from '../types/vault'

const router = Router()

// Create new vault
router.post('/create', async (req: any, res: any) => {
  try {
    const request: CreateVaultRequest = req.body
    
    // Validation
    if (!request.name || !request.keyHolders || request.keyHolders.length === 0) {
      return res.status(400).json({ error: 'Invalid vault data' })
    }

    if (request.threshold < 1 || request.threshold > request.keyHolders.length) {
      return res.status(400).json({ error: 'Invalid threshold' })
    }

    const vault = await vaultService.createVault(request)
    res.status(201).json(vault)
  } catch (error) {
    console.error('Create vault error:', error)
    res.status(500).json({ error: 'Failed to create vault' })
  }
})

// Get vault by ID
router.get('/:id', async (req: any, res: any) => {
  try {
    const vault = await vaultService.getVault(req.params.id)
    
    if (!vault) {
      return res.status(404).json({ error: 'Vault not found' })
    }

    res.json(vault)
  } catch (error) {
    console.error('Get vault error:', error)
    res.status(500).json({ error: 'Failed to retrieve vault' })
  }
})

// Update vault deposits (webhook endpoint for monitoring deposits)
router.post('/:id/deposits', async (req: any, res: any) => {
  try {
    const { amount } = req.body
    
    if (!amount || parseFloat(amount) <= 0) {
      return res.status(400).json({ error: 'Invalid amount' })
    }

    const vault = await vaultService.updateDeposits(req.params.id, amount)
    
    if (!vault) {
      return res.status(404).json({ error: 'Vault not found' })
    }

    res.json(vault)
  } catch (error) {
    console.error('Update deposits error:', error)
    res.status(500).json({ error: 'Failed to update deposits' })
  }
})

// Approve unlock (key holder approval)
router.post('/:id/approve', async (req: any, res: any) => {
  try {
    const { holderId } = req.body
    
    if (!holderId) {
      return res.status(400).json({ error: 'Holder ID required' })
    }

    const vault = await vaultService.approveUnlock(req.params.id, holderId)
    
    if (!vault) {
      return res.status(404).json({ error: 'Vault not found' })
    }

    res.json(vault)
  } catch (error) {
    console.error('Approve unlock error:', error)
    res.status(500).json({ error: 'Failed to approve unlock' })
  }
})

// Create unlock proposal
router.post('/:id/proposal', async (req: any, res: any) => {
  try {
    const request: CreateUnlockProposalRequest = req.body
    
    if (!request.recipients || request.recipients.length === 0) {
      return res.status(400).json({ error: 'Recipients required' })
    }

    const proposal = await proposalService.createProposal(req.params.id, request)
    
    if (!proposal) {
      return res.status(404).json({ error: 'Vault not found' })
    }

    res.status(201).json(proposal)
  } catch (error: any) {
    console.error('Create proposal error:', error)
    res.status(400).json({ error: error.message || 'Failed to create proposal' })
  }
})

// Get unlock proposal
router.get('/:id/proposal', async (req: any, res: any) => {
  try {
    const proposal = await proposalService.getProposalByVaultId(req.params.id)
    
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' })
    }

    res.json(proposal)
  } catch (error) {
    console.error('Get proposal error:', error)
    res.status(500).json({ error: 'Failed to retrieve proposal' })
  }
})

// Approve proposal
router.post('/:id/proposal/approve', async (req: any, res: any) => {
  try {
    const { holderId } = req.body
    
    if (!holderId) {
      return res.status(400).json({ error: 'Holder ID required' })
    }

    const proposal = await proposalService.getProposalByVaultId(req.params.id)
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' })
    }

    const updated = await proposalService.approveProposal(proposal.id, holderId)
    res.json(updated)
  } catch (error: any) {
    console.error('Approve proposal error:', error)
    res.status(400).json({ error: error.message || 'Failed to approve proposal' })
  }
})

// Execute proposal
router.post('/:id/proposal/execute', async (req: any, res: any) => {
  try {
    const proposal = await proposalService.getProposalByVaultId(req.params.id)
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' })
    }

    const success = await proposalService.executeProposal(proposal.id)
    
    if (!success) {
      return res.status(400).json({ error: 'Failed to execute proposal' })
    }

    res.json({ success: true, message: 'Proposal executed successfully' })
  } catch (error: any) {
    console.error('Execute proposal error:', error)
    res.status(400).json({ error: error.message || 'Failed to execute proposal' })
  }
})

// Destroy vault (self-destruct)
router.delete('/:id', async (req: any, res: any) => {
  try {
    const success = await vaultService.destroyVault(req.params.id)
    
    if (!success) {
      return res.status(404).json({ error: 'Vault not found' })
    }

    res.json({ success: true, message: 'Vault destroyed' })
  } catch (error) {
    console.error('Destroy vault error:', error)
    res.status(500).json({ error: 'Failed to destroy vault' })
  }
})

export default router
