"use strict";
// Self-destruct mechanism for expired vaults
// Run this as a cron job or scheduled task
Object.defineProperty(exports, "__esModule", { value: true });
exports.selfDestruct = selfDestruct;
exports.checkExpiredVaults = checkExpiredVaults;
exports.checkExpiredProposals = checkExpiredProposals;
const vaultStore_1 = require("../storage/vaultStore");
const vaultService_1 = require("../services/vaultService");
async function checkExpiredVaults() {
    console.log('Checking for expired vaults...');
    const expiredVaults = vaultStore_1.vaultStore.getExpiredVaults();
    if (expiredVaults.length === 0) {
        console.log('No expired vaults found');
        return;
    }
    console.log(`Found ${expiredVaults.length} expired vault(s)`);
    for (const vault of expiredVaults) {
        try {
            console.log(`Processing expired vault: ${vault.id}`);
            // Check if vault has any deposits
            const hasDeposits = parseFloat(vault.totalDeposits) > 0;
            if (hasDeposits) {
                console.log(`Vault ${vault.id} has deposits: ${vault.totalDeposits} ${vault.sourceAsset}`);
                // TODO: Return funds to original depositor or configured fallback address
                // This would require storing the original depositor address
                console.log('TODO: Return funds to original depositor');
            }
            // Destroy the vault
            await vaultService_1.vaultService.destroyVault(vault.id);
            console.log(`Vault ${vault.id} destroyed successfully`);
            // Log destruction event
            logDestructionEvent(vault.id, hasDeposits, vault.totalDeposits, vault.sourceAsset);
        }
        catch (error) {
            console.error(`Error destroying vault ${vault.id}:`, error);
        }
    }
}
async function checkExpiredProposals() {
    console.log('Checking for expired proposals...');
    const expiredProposals = vaultStore_1.vaultStore.getExpiredProposals();
    if (expiredProposals.length === 0) {
        console.log('No expired proposals found');
        return;
    }
    console.log(`Found ${expiredProposals.length} expired proposal(s)`);
    for (const proposal of expiredProposals) {
        try {
            console.log(`Canceling expired proposal: ${proposal.id}`);
            // Delete the expired proposal
            vaultStore_1.vaultStore.deleteProposal(proposal.id);
            // Reset vault status if needed
            const vault = vaultStore_1.vaultStore.getVault(proposal.vaultId);
            if (vault && vault.status === 'ready') {
                vaultStore_1.vaultStore.updateVault(proposal.vaultId, {
                    status: 'funding',
                    unlockProposal: undefined
                });
            }
            console.log(`Proposal ${proposal.id} canceled successfully`);
        }
        catch (error) {
            console.error(`Error canceling proposal ${proposal.id}:`, error);
        }
    }
}
function logDestructionEvent(vaultId, hadDeposits, amount, asset) {
    const event = {
        timestamp: new Date().toISOString(),
        vaultId,
        hadDeposits,
        amount,
        asset,
        action: 'self_destruct'
    };
    // TODO: Store in proper logging system or database
    console.log('Destruction event:', JSON.stringify(event, null, 2));
}
async function selfDestruct() {
    try {
        console.log('=== Self-Destruct Check Started ===');
        console.log(`Time: ${new Date().toISOString()}`);
        await checkExpiredVaults();
        await checkExpiredProposals();
        console.log('=== Self-Destruct Check Complete ===\n');
    }
    catch (error) {
        console.error('Self-destruct error:', error);
    }
}
// Run if executed directly
if (require.main === module) {
    selfDestruct();
}
