"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// models/Wallet.ts
const mongoose_1 = require("mongoose");
const WalletSchema = new mongoose_1.Schema({
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
exports.default = (0, mongoose_1.model)('Wallet', WalletSchema);
