import { Request, Response } from 'express';
import { WalletService } from '../services/wallet.service';
import { CreateWalletRequest } from '../types/walletTypes';

export class WalletController {
    static async getAllWallets(req: Request, res: Response) {
        try {
            const app = (req as any).app;

            if (!app) {
                return res.status(401).json({ error: 'App authentication required' });
            }

            // Get query parameters for filtering and pagination
            const {
                page = 1,
                limit = 10,
                isActive,
                email,
                userId
            } = req.query;

            const pageNum = parseInt(page as string);
            const limitNum = parseInt(limit as string);

            // Build filter object
            const filter: any = { appId: app.appId };

            if (isActive !== undefined) {
                filter.isActive = isActive === 'true';
            }

            if (email) {
                filter.email = { $regex: email as string, $options: 'i' };
            }

            if (userId) {
                filter.userId = userId as string;
            }

            // Get all wallets for the authenticated app with filtering and pagination
            const wallets = await WalletService.getAllWalletsByAppWithPagination(
                app.appId,
                filter,
                pageNum,
                limitNum
            );

            res.status(200).json(wallets);
        } catch (error) {
            console.error('Error getting all wallets:', error);
            res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to get wallets' });
        }
    }

    static async getUserWallets(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const authenticatedUserId = (req.user as any)?.userId;

            if (!userId) {
                return res.status(400).json({ error: 'User ID is required' });
            }

            // Ensure user can only access their own wallets
            if (userId !== authenticatedUserId) {
                return res.status(403).json({ error: 'Access denied. You can only access your own wallets.' });
            }

            const wallets = await WalletService.getWalletsByUser(userId);
            res.status(200).json(wallets);
        } catch (error) {
            console.error('Error getting wallets:', error);
            res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to get wallets' });
        }
    }

    static async getWallet(req: Request, res: Response) {
        try {
            const { userId, walletId } = req.params;
            const authenticatedUserId = (req.user as any)?.userId;

            if (!userId || !walletId) {
                return res.status(400).json({ error: 'User ID and Wallet ID are required' });
            }

            // Ensure user can only access their own wallets
            if (userId !== authenticatedUserId) {
                return res.status(403).json({ error: 'Access denied. You can only access your own wallets.' });
            }

            const wallet = await WalletService.getWalletById(userId, walletId);
            if (!wallet) {
                return res.status(404).json({ error: 'Wallet not found' });
            }

            res.status(200).json(wallet);
        } catch (error) {
            console.error('Error getting wallet:', error);
            res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to get wallet' });
        }
    }

    static async createWallet(req: Request, res: Response) {
        try {
            const { email, name, appId } = req.body;
            const authenticatedUserId = (req.user as any)?.userId;

            if (!email || !name || !appId) {
                return res.status(400).json({ error: 'Email, name, and appId are required' });
            }

            const wallet = await WalletService.createWallet({
                userId: authenticatedUserId,
                email,
                name,
                isActive: true,
                otp: '',
                otpExpiry: new Date(),
                appId
            });

            res.status(201).json(wallet);
        } catch (error) {
            console.error('Error creating wallet:', error);
            res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to create wallet' });
        }
    }

    static async getWalletBalance(req: Request, res: Response) {
        try {
            const { userId, walletId } = req.params;
            const authenticatedUserId = (req.user as any)?.userId;

            if (!userId || !walletId) {
                return res.status(400).json({ error: 'User ID and Wallet ID are required' });
            }

            // Ensure user can only access their own wallets
            if (userId !== authenticatedUserId) {
                return res.status(403).json({ error: 'Access denied. You can only access your own wallets.' });
            }

            const wallet = await WalletService.getWalletById(userId, walletId);
            if (!wallet) {
                return res.status(404).json({ error: 'Wallet not found' });
            }

            const balance = await WalletService.getBalance(wallet.address);
            res.status(200).json({
                walletId,
                address: wallet.address,
                balance: balance.toString()
            });
        } catch (error) {
            console.error('Error getting wallet balance:', error);
            res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to get wallet balance' });
        }
    }
}