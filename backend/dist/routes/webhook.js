"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const express_1 = require("express");
const proposalService_1 = require("../services/proposalService");
const router = (0, express_1.Router)();
// SideShift webhook endpoint
router.post('/sideshift', async (req, res) => {
    try {
        // Validate webhook secret
        const webhookSecret = req.headers['x-webhook-secret'];
        const expectedSecret = process.env.WEBHOOK_SECRET;
        if (expectedSecret && webhookSecret !== expectedSecret) {
            console.warn('Invalid webhook secret');
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const payload = req.body;
        if (!payload.shiftId || !payload.status) {
            return res.status(400).json({ error: 'Invalid payload' });
        }
        console.log(`Webhook received for shift ${payload.shiftId}: ${payload.status}`);
        // Parse reference to get proposal ID
        const reference = payload.metadata?.reference;
        if (!reference) {
            console.warn('No reference in webhook payload');
            return res.status(200).json({ received: true });
        }
        const [vaultId, proposalId, recipientIndex] = reference.split('|');
        if (!proposalId) {
            console.warn('Invalid reference format');
            return res.status(200).json({ received: true });
        }
        // Update shift status in proposal
        await proposalService_1.proposalService.updateShiftStatus(proposalId, payload.shiftId, payload.status, payload.settleTxHash || payload.depositTxHash);
        console.log(`Updated shift ${payload.shiftId} status to ${payload.status}`);
        res.status(200).json({ received: true });
    }
    catch (error) {
        console.error('Webhook processing error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Manual shift status update (for testing)
router.post('/shift-status', async (req, res) => {
    try {
        const { proposalId, shiftId, status, txHash } = req.body;
        if (!proposalId || !shiftId || !status) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        await proposalService_1.proposalService.updateShiftStatus(proposalId, shiftId, status, txHash);
        res.json({ success: true, message: 'Shift status updated' });
    }
    catch (error) {
        console.error('Shift status update error:', error);
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
