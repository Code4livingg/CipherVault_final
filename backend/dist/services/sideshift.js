"use strict";
// SideShift API integration
// Documentation: https://sideshift.ai/api
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sideShiftService = exports.SideShiftService = void 0;
const axios_1 = __importDefault(require("axios"));
class SideShiftService {
    constructor() {
        this.apiUrl = 'https://sideshift.ai/api/v2';
        this.apiKey = process.env.SIDESHIFT_API_KEY || '';
        this.hasApiKey = this.apiKey.length > 0;
    }
    async createShift(fromAsset, toAsset, amount, destination, reference) {
        if (!this.hasApiKey) {
            console.warn('SIDESHIFT_API_KEY not set, using mock shift');
            return this.createMockShift(fromAsset, toAsset, amount, destination, reference);
        }
        try {
            const request = {
                settleAddress: destination,
                settleAsset: toAsset,
                depositAsset: fromAsset,
                depositAmount: amount,
                type: 'direct',
                affiliateId: 'ciphervault',
                metadata: {
                    reference
                }
            };
            const response = await axios_1.default.post(`${this.apiUrl}/shifts`, request, {
                headers: {
                    'x-api-key': this.apiKey,
                    'content-type': 'application/json'
                }
            });
            return {
                shiftId: response.data.id,
                depositAddress: response.data.depositAddress,
                settleAddress: response.data.settleAddress,
                status: response.data.status || 'pending',
                depositAsset: response.data.depositCoin,
                settleAsset: response.data.settleCoin,
                depositAmount: response.data.depositAmount,
                settleAmount: response.data.settleAmount
            };
        }
        catch (error) {
            console.error('SideShift API error:', error.response?.data || error.message);
            throw new Error(`Failed to create shift: ${error.response?.data?.error || error.message}`);
        }
    }
    async getShiftStatus(shiftId) {
        if (!this.hasApiKey) {
            return this.getMockShiftStatus(shiftId);
        }
        try {
            const response = await axios_1.default.get(`${this.apiUrl}/shifts/${shiftId}`, {
                headers: {
                    'x-api-key': this.apiKey
                }
            });
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
            };
        }
        catch (error) {
            console.error('Failed to get shift status:', error.response?.data || error.message);
            return null;
        }
    }
    createMockShift(fromAsset, toAsset, amount, destination, reference) {
        const rate = this.getMockRate(fromAsset, toAsset);
        const settleAmount = (parseFloat(amount) * rate).toFixed(8);
        return {
            shiftId: `shift-mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            depositAddress: this.generateMockAddress(fromAsset),
            settleAddress: destination,
            status: 'pending',
            depositAsset: fromAsset,
            settleAsset: toAsset,
            depositAmount: amount,
            settleAmount
        };
    }
    getMockShiftStatus(shiftId) {
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
        };
    }
    getMockRate(depositCoin, settleCoin) {
        const rates = {
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
        };
        return rates[depositCoin]?.[settleCoin] || 1;
    }
    generateMockAddress(coin) {
        if (coin === 'BTC') {
            return 'bc1q' + this.randomHex(40);
        }
        return '0x' + this.randomHex(40);
    }
    randomHex(length) {
        const chars = '0123456789abcdef';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    }
}
exports.SideShiftService = SideShiftService;
exports.sideShiftService = new SideShiftService();
