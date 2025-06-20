import { generateAddress } from '../walletgen/generate';
import Wallet, { IWallet } from '../models/Wallet';
import { encrypt } from '../utils/encryption';
import { WalletInfo, WalletResponse } from '../types/walletTypes';
import { baseClient } from '../config/web3';

interface CreateWalletParams {
    userId: string;
    email: string;
    name: string;
    isActive: boolean;
    otp: string;
    otpExpiry: Date;
    appId: string;
}

export class WalletService {
    static async createWallet({ userId, email, name, isActive, otp = '', otpExpiry = new Date(), appId }: CreateWalletParams): Promise<WalletResponse> {
        try {
            console.log('createWallet', userId, email, name, isActive);
            // Generate new wallet
            const walletInfo = generateAddress();

            // Encrypt sensitive data before storing
            const encryptedWallet = {
                ...walletInfo,
                email: email,
                name: name,
                isActive: isActive,
                otp: otp,
                appId: Math.random().toString(36).substring(2, 18),
                otpExpiry: otpExpiry,
                privateKey: encrypt(walletInfo.privateKey),
                mnemonic: encrypt(walletInfo.mnemonic),
                userId
            };

            console.log('encryptedWallet', encryptedWallet);

            // Save to database
            const wallet = new Wallet(encryptedWallet);
            await wallet.save();

            return {
                id: wallet._id ? wallet._id.toString() : '',
                userId: wallet.userId,
                email: email,
                name: name,
                isActive: isActive,
                otp: otp,
                otpExpiry: otpExpiry,
                address: wallet.address,
                publicKey: wallet.publicKey,
                privateKey: walletInfo.privateKey, // Return decrypted private key only once
                mnemonic: walletInfo.mnemonic, // Return decrypted mnemonic only once
                createdAt: wallet.createdAt,
                updatedAt: wallet.updatedAt
            };
        } catch (error) {
            throw new Error(`Failed to create wallet: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    static async getWalletByUserEmail(email: string): Promise<WalletResponse | null> {
        try {
            const wallet = await Wallet.findOne({ email });
            if (!wallet) return null;
            return wallet as unknown as WalletResponse;
        } catch (error) {
            throw new Error(`Failed to get wallet by user email: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    static async getWalletsByUser(userId: string): Promise<Omit<WalletResponse, 'privateKey' | 'mnemonic'>[]> {
        try {
            const wallets = await Wallet.find({ userId }).sort({ createdAt: -1 });
            return wallets.map(wallet => ({
                id: wallet._id ? wallet._id.toString() : '',
                userId: wallet.userId,
                address: wallet.address,
                publicKey: wallet.publicKey,
                email: wallet.email || '',
                name: wallet.name || '',
                isActive: wallet.isActive || false,
                otp: wallet.otp || '',
                otpExpiry: wallet.otpExpiry || new Date(),
                createdAt: wallet.createdAt,
                updatedAt: wallet.updatedAt
            }));
        } catch (error) {
            throw new Error(`Failed to get wallets: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    static async getWalletById(userId: string, walletId: string): Promise<WalletResponse | null> {
        try {
            const wallet = await Wallet.findOne({ _id: walletId, userId });
            if (!wallet) return null;

            return {
                id: wallet._id ? wallet._id.toString() : '',
                userId: wallet.userId,
                address: wallet.address,
                publicKey: wallet.publicKey,
                privateKey: wallet.privateKey, // Note: This is still encrypted in DB
                mnemonic: wallet.mnemonic, // Note: This is still encrypted in DB
                email: wallet.email || '',
                name: wallet.name || '',
                isActive: wallet.isActive || false,
                otp: wallet.otp || '',
                otpExpiry: wallet.otpExpiry || new Date(),
                createdAt: wallet.createdAt,
                updatedAt: wallet.updatedAt
            };
        } catch (error) {
            throw new Error(`Failed to get wallet: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    static async getBalance(address: string): Promise<string> {
        const balance = await baseClient.getBalance({ address: address as `0x${string}` });
        return balance.toString();
    }

    static async getAllWalletsByApp(appId: string): Promise<Omit<WalletResponse, 'privateKey' | 'mnemonic'>[]> {
        try {
            const wallets = await Wallet.find({ appId }).sort({ createdAt: -1 });
            return wallets.map(wallet => ({
                id: wallet._id ? wallet._id.toString() : '',
                userId: wallet.userId,
                address: wallet.address,
                publicKey: wallet.publicKey,
                email: wallet.email || '',
                name: wallet.name || '',
                isActive: wallet.isActive || false,
                otp: wallet.otp || '',
                otpExpiry: wallet.otpExpiry || new Date(),
                createdAt: wallet.createdAt,
                updatedAt: wallet.updatedAt
            }));
        } catch (error) {
            throw new Error(`Failed to get wallets by app: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    static async getAllWalletsByAppWithPagination(
        appId: string,
        filter: any,
        page: number,
        limit: number
    ): Promise<{
        wallets: Omit<WalletResponse, 'privateKey' | 'mnemonic'>[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }> {
        try {
            const skip = (page - 1) * limit;

            // Get total count for pagination
            const total = await Wallet.countDocuments(filter);

            // Get wallets with pagination
            const wallets = await Wallet.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            const walletResponses = wallets.map(wallet => ({
                id: wallet._id ? wallet._id.toString() : '',
                userId: wallet.userId,
                address: wallet.address,
                publicKey: wallet.publicKey,
                email: wallet.email || '',
                name: wallet.name || '',
                isActive: wallet.isActive || false,
                otp: wallet.otp || '',
                otpExpiry: wallet.otpExpiry || new Date(),
                createdAt: wallet.createdAt,
                updatedAt: wallet.updatedAt
            }));

            return {
                wallets: walletResponses,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            throw new Error(`Failed to get wallets by app with pagination: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

}