// models/Wallet.ts
import { Schema, model, Document } from 'mongoose';

export interface IWallet extends Document {
    walletId: string;
    appId: string;          // Not unique - many wallets per app
    userId: string;         // Not unique - user may have multiple wallets
    address: string;
    privateKey: string;
    mnemonic: string;
    publicKey: string;
    email?: string;
    name?: string;
    isActive: boolean;
    otp?: string;
    otpExpiry?: Date;
    socialProvider?: 'google' | 'facebook' | 'twitter' | 'github';
    socialId?: string;
    createdAt: Date;
    updatedAt: Date;
}

const WalletSchema = new Schema<IWallet>({
    walletId: {
        type: String,
        required: true,
        unique: true,
        default: () => `wlt_${require('crypto').randomUUID()}`
    },
    appId: {
        type: String,
        required: true,
        index: true         // Indexed but NOT unique
    },
    userId: {
        type: String,
        required: true,
        index: true         // Indexed but NOT unique
    },
    address: {
        type: String,
        required: true,
        unique: true
    },
    privateKey: {
        type: String,
        required: true
    },
    mnemonic: {
        type: String,
        required: true
    },
    publicKey: {
        type: String,
        required: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    name: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String
    },
    otpExpiry: {
        type: Date
    },
    socialProvider: {
        type: String,
        enum: ['google', 'facebook', 'twitter', 'github']
    },
    socialId: {
        type: String
    }
}, {
    timestamps: true
});

// Indexes
WalletSchema.index({ appId: 1, userId: 1 }, { unique: false });  // Non-unique compound index
WalletSchema.index({ appId: 1, socialId: 1 }, { unique: false, sparse: true });  // Unique only when socialId exists
WalletSchema.index({ appId: 1, email: 1 }, { unique: false, sparse: true });     // Unique only when email exists

export default model<IWallet>('Wallet', WalletSchema);