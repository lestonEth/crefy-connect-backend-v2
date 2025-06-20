"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletController = void 0;
const wallet_service_1 = require("../services/wallet.service");
class WalletController {
    static async getAllWallets(req, res) {
        try {
            const app = req.app;
            if (!app) {
                return res.status(401).json({ error: 'App authentication required' });
            }
            // Get query parameters for filtering and pagination
            const { page = 1, limit = 10, isActive, email, userId } = req.query;
            const pageNum = parseInt(page);
            const limitNum = parseInt(limit);
            // Build filter object
            const filter = { appId: app.appId };
            if (isActive !== undefined) {
                filter.isActive = isActive === 'true';
            }
            if (email) {
                filter.email = { $regex: email, $options: 'i' };
            }
            if (userId) {
                filter.userId = userId;
            }
            // Get all wallets for the authenticated app with filtering and pagination
            const wallets = await wallet_service_1.WalletService.getAllWalletsByAppWithPagination(app.appId, filter, pageNum, limitNum);
            res.status(200).json(wallets);
        }
        catch (error) {
            console.error('Error getting all wallets:', error);
            res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to get wallets' });
        }
    }
    static async getUserWallets(req, res) {
        try {
            const { userId } = req.params;
            const authenticatedUserId = req.user?.userId;
            if (!userId) {
                return res.status(400).json({ error: 'User ID is required' });
            }
            // Ensure user can only access their own wallets
            if (userId !== authenticatedUserId) {
                return res.status(403).json({ error: 'Access denied. You can only access your own wallets.' });
            }
            const wallets = await wallet_service_1.WalletService.getWalletsByUser(userId);
            res.status(200).json(wallets);
        }
        catch (error) {
            console.error('Error getting wallets:', error);
            res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to get wallets' });
        }
    }
    static async getWallet(req, res) {
        try {
            const { userId, walletId } = req.params;
            const authenticatedUserId = req.user?.userId;
            if (!userId || !walletId) {
                return res.status(400).json({ error: 'User ID and Wallet ID are required' });
            }
            // Ensure user can only access their own wallets
            if (userId !== authenticatedUserId) {
                return res.status(403).json({ error: 'Access denied. You can only access your own wallets.' });
            }
            const wallet = await wallet_service_1.WalletService.getWalletById(userId, walletId);
            if (!wallet) {
                return res.status(404).json({ error: 'Wallet not found' });
            }
            res.status(200).json(wallet);
        }
        catch (error) {
            console.error('Error getting wallet:', error);
            res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to get wallet' });
        }
    }
    static async createWallet(req, res) {
        try {
            const { email, name, appId } = req.body;
            const authenticatedUserId = req.user?.userId;
            if (!email || !name || !appId) {
                return res.status(400).json({ error: 'Email, name, and appId are required' });
            }
            const wallet = await wallet_service_1.WalletService.createWallet({
                userId: authenticatedUserId,
                email,
                name,
                isActive: true,
                otp: '',
                otpExpiry: new Date(),
                appId
            });
            res.status(201).json(wallet);
        }
        catch (error) {
            console.error('Error creating wallet:', error);
            res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to create wallet' });
        }
    }
    static async getWalletBalance(req, res) {
        try {
            const { userId, walletId } = req.params;
            const authenticatedUserId = req.user?.userId;
            if (!userId || !walletId) {
                return res.status(400).json({ error: 'User ID and Wallet ID are required' });
            }
            // Ensure user can only access their own wallets
            if (userId !== authenticatedUserId) {
                return res.status(403).json({ error: 'Access denied. You can only access your own wallets.' });
            }
            const wallet = await wallet_service_1.WalletService.getWalletById(userId, walletId);
            if (!wallet) {
                return res.status(404).json({ error: 'Wallet not found' });
            }
            const balance = await wallet_service_1.WalletService.getBalance(wallet.address);
            res.status(200).json({
                walletId,
                address: wallet.address,
                balance: balance.toString()
            });
        }
        catch (error) {
            console.error('Error getting wallet balance:', error);
            res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to get wallet balance' });
        }
    }
}
exports.WalletController = WalletController;
