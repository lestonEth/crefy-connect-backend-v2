"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const transaction_model_1 = __importDefault(require("../models/transaction.model"));
class SwyptService {
    constructor() {
        this.apiUrl = process.env.SWYPT_API_URL || '';
        this.apiKey = process.env.SWYPT_API_KEY || '';
        this.apiSecret = process.env.SWYPT_API_SECRET || '';
    }
    getHeaders() {
        return {
            'x-api-key': this.apiKey,
            'x-api-secret': this.apiSecret,
        };
    }
    async getSupportedAssets() {
        try {
            const response = await axios_1.default.get(`${this.apiUrl}/api/swypt-supported-assets`, {
                headers: this.getHeaders(),
            });
            return response.data;
        }
        catch (error) {
            console.error('Error fetching supported assets:', error);
            throw error;
        }
    }
    async getQuote(quoteDto) {
        try {
            console.log('quoteDto', quoteDto);
            const response = await axios_1.default.post(`${this.apiUrl}/api/swypt-quotes`, quoteDto, {
                headers: this.getHeaders(),
            });
            console.log('response', response);
            return response.data;
        }
        catch (error) {
            console.error('Error fetching quote:', error);
            throw error;
        }
    }
    async initiateOnRamp(onRampDto, crefyId) {
        try {
            console.log('onRampDto', onRampDto);
            const response = await axios_1.default.post(`${this.apiUrl}/api/swypt-onramp`, onRampDto, {
                headers: this.getHeaders(),
            });
            const transaction = new transaction_model_1.default({
                orderId: response.data.orderID,
                partyA: onRampDto.partyA,
                amount: parseFloat(onRampDto.amount),
                side: 'onramp',
                userAddress: onRampDto.userAddress,
                tokenAddress: onRampDto.tokenAddress,
                status: 'PENDING',
                crefyId: crefyId // Add crefyId
            });
            await transaction.save();
            return response.data;
        }
        catch (error) {
            console.error('Error initiating onramp:', error);
            throw error;
        }
    }
    async getOnRampStatus(orderId) {
        try {
            const response = await axios_1.default.get(`${this.apiUrl}/api/order-onramp-status/${orderId}`, {
                headers: this.getHeaders(),
            });
            // Update transaction in database
            if (response.data.status === 'success') {
                await transaction_model_1.default.findOneAndUpdate({ orderId }, {
                    status: response.data.data.status,
                    mpesaReceipt: response.data.data.details?.mpesaReceipt,
                    transactionDate: response.data.data.details?.transactionDate,
                    resultDescription: response.data.data.details?.resultDescription,
                });
            }
            return response.data;
        }
        catch (error) {
            console.error('Error getting onramp status:', error);
            throw error;
        }
    }
    async createOnRampTicket(ticketDto) {
        try {
            const response = await axios_1.default.post(`${this.apiUrl}/api/user-onramp-ticket`, ticketDto, {
                headers: this.getHeaders(),
            });
            return response.data;
        }
        catch (error) {
            throw this.handleError(error, 'Failed to create on-ramp ticket');
        }
    }
    async getTransactionByOrderId(orderId) {
        try {
            return await transaction_model_1.default.findOne({ orderId });
        }
        catch (error) {
            throw this.handleError(error, 'Failed to fetch transaction');
        }
    }
    async getTransactionsByUser(userAddress) {
        try {
            return await transaction_model_1.default.find({ userAddress }).sort({ createdAt: -1 });
        }
        catch (error) {
            throw this.handleError(error, 'Failed to fetch user transactions');
        }
    }
    handleError(error, defaultMessage) {
        if (error.response) {
            return {
                status: error.response.status,
                message: error.response.data?.message || defaultMessage,
                data: error.response.data,
            };
        }
        else if (error.request) {
            return {
                status: 503,
                message: 'Service unavailable',
                details: 'The request was made but no response was received',
            };
        }
        else {
            return {
                status: 500,
                message: defaultMessage,
                details: error.message,
            };
        }
    }
}
exports.default = SwyptService;
