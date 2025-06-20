import axios from 'axios';
import { GetQuoteDto, OnRampDto, OffRampDto, OnRampStatusDto } from '../dto/swypt.dto';
import Transaction from '../models/transaction.model';

class SwyptService {
    apiUrl: any;
    apiKey: any;
    apiSecret: any;

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
            const response = await axios.get(`${this.apiUrl}/api/swypt-supported-assets`, {
                headers: this.getHeaders(),
            });
            return response.data;
        } catch (error: any) {
            console.error('Error fetching supported assets:', error);
            throw error;
        }
    }

    async getQuote(quoteDto: GetQuoteDto) {
        try {
            console.log('quoteDto', quoteDto);
            const response = await axios.post(`${this.apiUrl}/api/swypt-quotes`, quoteDto, {
                headers: this.getHeaders(),
            });
            console.log('response', response);
            return response.data;
        } catch (error) {
            console.error('Error fetching quote:', error);
            throw error;
        }
    }

    async initiateOnRamp(onRampDto: OnRampDto, crefyId: string) {
        try {
            console.log('onRampDto', onRampDto);
            const response = await axios.post(`${this.apiUrl}/api/swypt-onramp`, onRampDto, {
                headers: this.getHeaders(),
            });
            
            const transaction = new Transaction({
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
        } catch (error) {
            console.error('Error initiating onramp:', error);
            throw error;
        }
    }


    async getOnRampStatus(orderId: string) {
        try {
            const response = await axios.get(`${this.apiUrl}/api/order-onramp-status/${orderId}`, {
                headers: this.getHeaders(),
            });

            // Update transaction in database
            if (response.data.status === 'success') {
                await Transaction.findOneAndUpdate(
                    { orderId },
                    {
                        status: response.data.data.status,
                        mpesaReceipt: response.data.data.details?.mpesaReceipt,
                        transactionDate: response.data.data.details?.transactionDate,
                        resultDescription: response.data.data.details?.resultDescription,
                    }
                );
            }

            return response.data;
        } catch (error) {
            console.error('Error getting onramp status:', error);
            throw error;
        }
    }

    async createOnRampTicket(ticketDto: any) {
        try {
            const response = await axios.post(`${this.apiUrl}/api/user-onramp-ticket`, ticketDto, {
                headers: this.getHeaders(),
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error, 'Failed to create on-ramp ticket');
        }
    }

    async getTransactionByOrderId(orderId: string) {
        try {
            return await Transaction.findOne({ orderId });
        } catch (error: any) {
            throw this.handleError(error, 'Failed to fetch transaction');
        }
    }

    async getTransactionsByUser(userAddress: string) {
        try {
            return await Transaction.find({ userAddress }).sort({ createdAt: -1 });
        } catch (error: any) {
            throw this.handleError(error, 'Failed to fetch user transactions');
        }
    }

    handleError(error: any, defaultMessage: string) {
        if (error.response) {
            return {
                status: error.response.status,
                message: error.response.data?.message || defaultMessage,
                data: error.response.data,
            };
        } else if (error.request) {
            return {
                status: 503,
                message: 'Service unavailable',
                details: 'The request was made but no response was received',
            };
        } else {
            return {
                status: 500,
                message: defaultMessage,
                details: error.message,
            };
        }
    }
}

export default SwyptService;