"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const generate_1 = require("../walletgen/generate");
const Wallet_1 = __importDefault(require("../models/Wallet"));
const encryption_1 = require("../utils/encryption");
const web3_1 = require("../config/web3");
class WalletService {
    static async createWallet({ userId, email, name, isActive, otp = '', otpExpiry = new Date(), appId }) {
        try {
            console.log('createWallet', userId, email, name, isActive);
            // Generate new wallet
            const walletInfo = (0, generate_1.generateAddress)();
            // Encrypt sensitive data before storing
            const encryptedWallet = {
                ...walletInfo,
                email: email,
                name: name,
                isActive: isActive,
                otp: otp,
                appId: appId,
                otpExpiry: otpExpiry,
                privateKey: (0, encryption_1.encrypt)(walletInfo.privateKey),
                mnemonic: (0, encryption_1.encrypt)(walletInfo.mnemonic),
                userId
            };
            console.log('encryptedWallet', encryptedWallet);
            // Save to database
            const wallet = new Wallet_1.default(encryptedWallet);
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
        }
        catch (error) {
            throw new Error(`Failed to create wallet: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    static async getWalletByUserEmail(email) {
        try {
            const wallet = await Wallet_1.default.findOne({ email });
            if (!wallet)
                return null;
            return wallet;
        }
        catch (error) {
            throw new Error(`Failed to get wallet by user email: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    static async getWalletsByUser(userId) {
        try {
            const wallets = await Wallet_1.default.find({ userId }).sort({ createdAt: -1 });
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
        }
        catch (error) {
            throw new Error(`Failed to get wallets: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    static async getWalletById(userId, walletId) {
        try {
            const wallet = await Wallet_1.default.findOne({ _id: walletId, userId });
            if (!wallet)
                return null;
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
        }
        catch (error) {
            throw new Error(`Failed to get wallet: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    static async getBalance(address) {
        const balance = await web3_1.baseClient.getBalance({ address: address });
        return balance.toString();
    }
    static async getAllWalletsByApp(appId) {
        try {
            const wallets = await Wallet_1.default.find({ appId }).sort({ createdAt: -1 });
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
        }
        catch (error) {
            throw new Error(`Failed to get wallets by app: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    static async getAllWalletsByAppWithPagination(appId, filter, page, limit) {
        try {
            const skip = (page - 1) * limit;
            // Get total count for pagination
            const total = await Wallet_1.default.countDocuments(filter);
            // Get wallets with pagination
            const wallets = await Wallet_1.default.find(filter)
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
        }
        catch (error) {
            throw new Error(`Failed to get wallets by app with pagination: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}
exports.WalletService = WalletService;
