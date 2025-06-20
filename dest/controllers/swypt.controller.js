"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swypt_service_1 = __importDefault(require("../services/swypt.service"));
class SwyptController {
    constructor() {
        this.getSupportedAssets = async (req, res) => {
            try {
                const assets = await this.swyptService.getSupportedAssets();
                res.status(200).json(assets);
            }
            catch (error) {
                res.status(500).json({
                    message: 'Failed to fetch supported assets',
                    error: error.message,
                });
            }
        };
        this.getQuote = async (req, res) => {
            try {
                const quoteDto = req.body;
                console.log('quoteDto', quoteDto);
                const quote = await this.swyptService.getQuote(quoteDto);
                res.status(200).json(quote);
            }
            catch (error) {
                res.status(500).json({
                    message: 'Failed to get quote',
                    error: error.message,
                });
            }
        };
        this.initiateOnRamp = async (req, res) => {
            try {
                const onRampDto = req.body;
                const crefyId = '7177c4db-d72e-42c6-89eb-b9bdff953457';
                const result = await this.swyptService.initiateOnRamp(onRampDto, crefyId);
                res.status(200).json(result);
            }
            catch (error) {
                res.status(500).json({
                    message: 'Failed to initiate on-ramp',
                    error: error.message,
                });
            }
        };
        this.getOnRampStatus = async (req, res) => {
            try {
                const { orderId } = req.params;
                const status = await this.swyptService.getOnRampStatus(orderId);
                res.status(200).json(status);
            }
            catch (error) {
                res.status(500).json({
                    message: 'Failed to get on-ramp status',
                    error: error.message,
                });
            }
        };
        this.createOnRampTicket = async (req, res) => {
            try {
                const ticketDto = req.body;
                const ticket = await this.swyptService.createOnRampTicket(ticketDto);
                res.status(201).json(ticket);
            }
            catch (error) {
                res.status(500).json({
                    message: 'Failed to create on-ramp ticket',
                    error: error.message,
                });
            }
        };
        this.getTransaction = async (req, res) => {
            try {
                const { orderId } = req.params;
                const transaction = await this.swyptService.getTransactionByOrderId(orderId);
                if (!transaction) {
                    return res.status(404).json({ message: 'Transaction not found' });
                }
                res.status(200).json(transaction);
            }
            catch (error) {
                res.status(500).json({
                    message: 'Failed to fetch transaction',
                    error: error.message,
                });
            }
        };
        this.getUserTransactions = async (req, res) => {
            try {
                const { userAddress } = req.params;
                const transactions = await this.swyptService.getTransactionsByUser(userAddress);
                res.status(200).json(transactions);
            }
            catch (error) {
                res.status(500).json({
                    message: 'Failed to fetch user transactions',
                    error: error.message,
                });
            }
        };
        this.swyptService = new swypt_service_1.default();
    }
}
exports.default = SwyptController;
