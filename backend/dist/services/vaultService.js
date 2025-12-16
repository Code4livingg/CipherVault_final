"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vaultService = exports.VaultService = void 0;
const uuid_1 = require("uuid");
const vaultStore_1 = require("../storage/vaultStore");
const cryptoService_1 = require("./cryptoService");
class VaultService {
    async createVault(request) {
        const vaultId = `vault-${(0, uuid_1.v4)()}`;
        // Set defaults
        const sourceAsset = request.sourceAsset || 'BTC';
        const targetAsset = request.targetAsset || 'BTC';
        const autoSwap = request.autoSwap ?? true;
        // Generate deposit address
        const depositAddress = await (0, cryptoService_1.generateDepositAddress)(sourceAsset);
        // Calculate expiry
        const expiresAt = this.calculateExpiry(request.expiry);
        // Create key holders
        const keyHolders = request.keyHolders.map((holder, index) => ({
            id: `holder-${index + 1}`,
            name: holder.name,
            email: holder.email,
            walletAddress: holder.walletAddress,
            approved: false
        }));
        const vault = {
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
        };
        vaultStore_1.vaultStore.saveVault(vault);
        return vault;
    }
    async getVault(id) {
        const vault = vaultStore_1.vaultStore.getVault(id);
        return vault || null;
    }
    async updateVaultStatus(id, status) {
        const updated = vaultStore_1.vaultStore.updateVault(id, { status });
        return updated || null;
    }
    async updateDeposits(id, amount) {
        const vault = vaultStore_1.vaultStore.getVault(id);
        if (!vault)
            return null;
        const updated = vaultStore_1.vaultStore.updateVault(id, {
            totalDeposits: amount,
            status: parseFloat(amount) > 0 ? 'funding' : 'created'
        });
        return updated || null;
    }
    async approveUnlock(vaultId, holderId) {
        const vault = vaultStore_1.vaultStore.getVault(vaultId);
        if (!vault)
            return null;
        const keyHolders = vault.keyHolders.map(holder => holder.id === holderId
            ? { ...holder, approved: true, approvedAt: new Date().toISOString() }
            : holder);
        const approvedCount = keyHolders.filter(h => h.approved).length;
        const status = approvedCount >= vault.threshold ? 'ready' : vault.status;
        const updated = vaultStore_1.vaultStore.updateVault(vaultId, {
            keyHolders,
            status
        });
        return updated || null;
    }
    async destroyVault(id) {
        const vault = vaultStore_1.vaultStore.getVault(id);
        if (!vault)
            return false;
        vaultStore_1.vaultStore.updateVault(id, {
            status: 'destroyed',
            totalDeposits: '0'
        });
        return true;
    }
    calculateExpiry(expiry) {
        const now = new Date();
        if (!expiry) {
            // Default to 7 days if not provided
            now.setDate(now.getDate() + 7);
            return now.toISOString();
        }
        if (expiry === '24h') {
            now.setHours(now.getHours() + 24);
        }
        else if (expiry === '7d') {
            now.setDate(now.getDate() + 7);
        }
        else if (expiry === '30d') {
            now.setDate(now.getDate() + 30);
        }
        else {
            // Parse custom format like "14d", "90d"
            const match = expiry.match(/^(\d+)d$/);
            if (match) {
                now.setDate(now.getDate() + parseInt(match[1]));
            }
            else {
                // Default to 7 days
                now.setDate(now.getDate() + 7);
            }
        }
        return now.toISOString();
    }
    getSupportedChains(asset) {
        const chainMap = {
            BTC: ['Bitcoin', 'Lightning'],
            ETH: ['Ethereum', 'Polygon', 'Arbitrum'],
            USDT: ['Ethereum', 'Tron', 'Polygon', 'Arbitrum'],
            USDC: ['Ethereum', 'Polygon', 'Arbitrum', 'Solana']
        };
        return chainMap[asset] || ['Ethereum'];
    }
}
exports.VaultService = VaultService;
exports.vaultService = new VaultService();
