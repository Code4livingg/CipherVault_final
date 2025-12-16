"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.proposalService = exports.ProposalService = void 0;
const uuid_1 = require("uuid");
const vaultStore_1 = require("../storage/vaultStore");
const vaultService_1 = require("./vaultService");
class ProposalService {
    async createProposal(vaultId, request) {
        const vault = await vaultService_1.vaultService.getVault(vaultId);
        if (!vault)
            return null;
        // Check if vault is ready for unlock
        if (vault.status !== 'ready' && vault.status !== 'funding') {
            throw new Error('Vault is not ready for unlock proposal');
        }
        // Check if proposal already exists
        const existing = vaultStore_1.vaultStore.getProposalByVaultId(vaultId);
        if (existing && !existing.executed) {
            throw new Error('Active proposal already exists for this vault');
        }
        const proposalId = `proposal-${(0, uuid_1.v4)()}`;
        const now = new Date();
        const expiresAt = new Date(now.getTime() + request.expiryHours * 60 * 60 * 1000);
        const proposal = {
            id: proposalId,
            vaultId,
            createdAt: now.toISOString(),
            expiresAt: expiresAt.toISOString(),
            recipients: request.recipients,
            approvals: [],
            executed: false,
            status: 'pending'
        };
        vaultStore_1.vaultStore.saveProposal(proposal);
        // Update vault with proposal reference
        vaultStore_1.vaultStore.updateVault(vaultId, {
            unlockProposal: proposal
        });
        return proposal;
    }
    async getProposal(id) {
        const proposal = vaultStore_1.vaultStore.getProposal(id);
        return proposal || null;
    }
    async getProposalByVaultId(vaultId) {
        const proposal = vaultStore_1.vaultStore.getProposalByVaultId(vaultId);
        return proposal || null;
    }
    async approveProposal(proposalId, holderId) {
        const proposal = vaultStore_1.vaultStore.getProposal(proposalId);
        if (!proposal)
            return null;
        // Check if already approved by this holder
        const alreadyApproved = proposal.approvals.some(a => a.holderId === holderId);
        if (alreadyApproved) {
            throw new Error('Holder has already approved this proposal');
        }
        // Check if proposal has expired
        if (new Date(proposal.expiresAt) < new Date()) {
            throw new Error('Proposal has expired');
        }
        // Add approval
        const approvals = [
            ...proposal.approvals,
            {
                holderId,
                approvedAt: new Date().toISOString()
            }
        ];
        const updated = vaultStore_1.vaultStore.updateProposal(proposalId, { approvals });
        // Also update vault key holder approval
        if (updated) {
            await vaultService_1.vaultService.approveUnlock(proposal.vaultId, holderId);
        }
        return updated || null;
    }
    async executeProposal(proposalId) {
        const proposal = vaultStore_1.vaultStore.getProposal(proposalId);
        if (!proposal)
            return false;
        const vault = await vaultService_1.vaultService.getVault(proposal.vaultId);
        if (!vault)
            return false;
        // Check if threshold is met
        const approvedCount = proposal.approvals.length;
        if (approvedCount < vault.threshold) {
            throw new Error('Threshold not met');
        }
        // Check if proposal has expired
        if (new Date(proposal.expiresAt) < new Date()) {
            throw new Error('Proposal has expired');
        }
        // Check if already executed
        if (proposal.executed) {
            throw new Error('Proposal already executed');
        }
        // Mark proposal as executed and unlocking
        vaultStore_1.vaultStore.updateProposal(proposalId, {
            executed: true,
            executedAt: new Date().toISOString(),
            status: 'unlocking'
        });
        // Update vault status
        await vaultService_1.vaultService.updateVaultStatus(proposal.vaultId, 'unlocking');
        // Trigger SideShift swaps for each recipient
        await this.orchestrateUnlock(proposal.vaultId, proposalId, vault, proposal);
        return true;
    }
    async orchestrateUnlock(vaultId, proposalId, vault, proposal) {
        const { sideShiftService } = await Promise.resolve().then(() => __importStar(require('./sideshift')));
        const shifts = [];
        try {
            // Create a shift for each recipient
            for (let i = 0; i < proposal.recipients.length; i++) {
                const recipient = proposal.recipients[i];
                const reference = `${vaultId}|${proposalId}|${i}`;
                console.log(`Creating shift ${i + 1}/${proposal.recipients.length} for ${recipient.address}`);
                try {
                    const shift = await sideShiftService.createShift(vault.sourceAsset, recipient.targetAsset, recipient.amount, recipient.address, reference);
                    shifts.push({
                        shiftId: shift.shiftId,
                        recipientIndex: i,
                        status: 'pending',
                        depositAddress: shift.depositAddress,
                        settleAddress: shift.settleAddress,
                        depositAmount: shift.depositAmount,
                        settleAmount: shift.settleAmount
                    });
                    console.log(`Shift created: ${shift.shiftId}`);
                }
                catch (error) {
                    console.error(`Failed to create shift for recipient ${i}:`, error.message);
                    shifts.push({
                        shiftId: `failed-${i}`,
                        recipientIndex: i,
                        status: 'failed',
                        settleAddress: recipient.address,
                        depositAmount: recipient.amount,
                        settleAmount: '0',
                        error: error.message
                    });
                }
            }
            // Update proposal with shift information
            vaultStore_1.vaultStore.updateProposal(proposalId, {
                shifts
            });
            console.log(`Created ${shifts.length} shifts for proposal ${proposalId}`);
            // If all shifts failed, mark proposal as failed
            const allFailed = shifts.every(s => s.status === 'failed');
            if (allFailed) {
                vaultStore_1.vaultStore.updateProposal(proposalId, {
                    status: 'failed'
                });
                await vaultService_1.vaultService.updateVaultStatus(vaultId, 'ready');
            }
        }
        catch (error) {
            console.error('Unlock orchestration error:', error);
            vaultStore_1.vaultStore.updateProposal(proposalId, {
                status: 'failed'
            });
            throw error;
        }
    }
    async updateShiftStatus(proposalId, shiftId, status, txHash) {
        const proposal = vaultStore_1.vaultStore.getProposal(proposalId);
        if (!proposal || !proposal.shifts)
            return;
        const shifts = proposal.shifts.map(shift => shift.shiftId === shiftId
            ? { ...shift, status: status, txHash, updatedAt: new Date().toISOString() }
            : shift);
        vaultStore_1.vaultStore.updateProposal(proposalId, { shifts });
        // Check if all shifts are completed
        const allCompleted = shifts.every(s => s.status === 'completed');
        if (allCompleted) {
            vaultStore_1.vaultStore.updateProposal(proposalId, {
                status: 'completed'
            });
            // Trigger vault destruction
            const { selfDestruct } = await Promise.resolve().then(() => __importStar(require('../scripts/selfdestruct')));
            await vaultService_1.vaultService.destroyVault(proposal.vaultId);
            console.log(`All shifts completed for proposal ${proposalId}, vault destroyed`);
        }
    }
    async cancelProposal(proposalId) {
        return vaultStore_1.vaultStore.deleteProposal(proposalId);
    }
}
exports.ProposalService = ProposalService;
exports.proposalService = new ProposalService();
