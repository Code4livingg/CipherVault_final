"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vaultStore = void 0;
// In-memory storage (replace with database in production)
class VaultStore {
    constructor() {
        this.vaults = new Map();
        this.proposals = new Map();
    }
    // Vault operations
    saveVault(vault) {
        this.vaults.set(vault.id, vault);
    }
    getVault(id) {
        return this.vaults.get(id);
    }
    getAllVaults() {
        return Array.from(this.vaults.values());
    }
    updateVault(id, updates) {
        const vault = this.vaults.get(id);
        if (!vault)
            return undefined;
        const updated = {
            ...vault,
            ...updates,
            updatedAt: new Date().toISOString()
        };
        this.vaults.set(id, updated);
        return updated;
    }
    deleteVault(id) {
        return this.vaults.delete(id);
    }
    // Proposal operations
    saveProposal(proposal) {
        this.proposals.set(proposal.id, proposal);
    }
    getProposal(id) {
        return this.proposals.get(id);
    }
    getProposalByVaultId(vaultId) {
        return Array.from(this.proposals.values()).find(p => p.vaultId === vaultId);
    }
    updateProposal(id, updates) {
        const proposal = this.proposals.get(id);
        if (!proposal)
            return undefined;
        const updated = { ...proposal, ...updates };
        this.proposals.set(id, updated);
        return updated;
    }
    deleteProposal(id) {
        return this.proposals.delete(id);
    }
    // Utility methods
    getExpiredVaults() {
        const now = new Date();
        return Array.from(this.vaults.values()).filter(vault => {
            const expiresAt = new Date(vault.expiresAt);
            return expiresAt < now && vault.status !== 'destroyed';
        });
    }
    getExpiredProposals() {
        const now = new Date();
        return Array.from(this.proposals.values()).filter(proposal => {
            const expiresAt = new Date(proposal.expiresAt);
            return expiresAt < now && !proposal.executed;
        });
    }
}
exports.vaultStore = new VaultStore();
