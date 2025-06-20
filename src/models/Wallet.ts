// models/Wallet.ts
import { Schema, model, Document } from 'mongoose';

export interface IWallet extends Document {
    walletId: string;
    appId: string;
    userId: string;
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
        index: true
    },
    userId: {
        type: String,
        required: true,
        index: true
    },
    address: { type: String, required: true, unique: true },
    privateKey: { type: String, required: true },
    mnemonic: { type: String, required: true },
    publicKey: { type: String, required: true },
    email: { type: String, trim: true, lowercase: true },
    name: { type: String },
    isActive: { type: Boolean, default: false },
    otp: String,
    otpExpiry: Date,
    socialProvider: {
        type: String,
        enum: ['google', 'facebook', 'twitter', 'github']
    },
    socialId: String
}, {
    timestamps: true
});

// Indexes for fast lookup
WalletSchema.index({ appId: 1, userId: 1 }, { unique: true });
WalletSchema.index({ appId: 1, socialId: 1 }, { unique: true, sparse: true });
WalletSchema.index({ appId: 1, email: 1 }, { unique: true, sparse: true });

export default model<IWallet>('Wallet', WalletSchema);