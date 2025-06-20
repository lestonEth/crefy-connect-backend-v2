import { Request, Response } from 'express';
import SwyptService from '../services/swypt.service';
import { GetQuoteDto, OnRampDto } from '../dto/swypt.dto';

class SwyptController {
    private swyptService: SwyptService;

    constructor() {
        this.swyptService = new SwyptService();
    }

    getSupportedAssets = async (req: Request, res: Response) => {
        try {
            const assets = await this.swyptService.getSupportedAssets();
            res.status(200).json(assets);
        } catch (error: any) {
            res.status(500).json({
                message: 'Failed to fetch supported assets',
                error: error.message,
            });
        }
    };

    getQuote = async (req: Request, res: Response) => {
        try {

            const quoteDto: any = req.body;
            console.log('quoteDto', quoteDto);
            const quote = await this.swyptService.getQuote(quoteDto);
            res.status(200).json(quote);
        } catch (error: any) {
            res.status(500).json({
                message: 'Failed to get quote',
                error: error.message,
            });
        }
    };

    initiateOnRamp = async (req: Request, res: Response) => {
        try {
            const onRampDto: OnRampDto = req.body;
            const crefyId = '7177c4db-d72e-42c6-89eb-b9bdff953457';
            const result = await this.swyptService.initiateOnRamp(onRampDto, crefyId);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({
                message: 'Failed to initiate on-ramp',
                error: error.message,
            });
        }
    };

    getOnRampStatus = async (req: Request, res: Response) => {
        try {
            const { orderId } = req.params;
            const status = await this.swyptService.getOnRampStatus(orderId);
            res.status(200).json(status);
        } catch (error: any) {
            res.status(500).json({
                message: 'Failed to get on-ramp status',
                error: error.message,
            });
        }
    };

    createOnRampTicket = async (req: Request, res: Response) => {
        try {
            const ticketDto = req.body;
            const ticket = await this.swyptService.createOnRampTicket(ticketDto);
            res.status(201).json(ticket);
        } catch (error: any) {
            res.status(500).json({
                message: 'Failed to create on-ramp ticket',
                error: error.message,
            });
        }
    };

    getTransaction = async (req: Request, res: Response) => {
        try {
            const { orderId } = req.params;
            const transaction = await this.swyptService.getTransactionByOrderId(orderId);
            if (!transaction) {
                return res.status(404).json({ message: 'Transaction not found' });
            }
            res.status(200).json(transaction);
        } catch (error: any) {
            res.status(500).json({
                message: 'Failed to fetch transaction',
                error: error.message,
            });
        }
    };

    getUserTransactions = async (req: Request, res: Response) => {
        try {
            const { userAddress } = req.params;
            const transactions = await this.swyptService.getTransactionsByUser(userAddress);
            res.status(200).json(transactions);
        } catch (error: any) {
            res.status(500).json({
                message: 'Failed to fetch user transactions',
                error: error.message,
            });
        }
    };
}

export default SwyptController;