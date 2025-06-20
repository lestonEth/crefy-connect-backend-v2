"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TransactionSchema = new mongoose_1.Schema({
    orderId: { type: String, required: true, unique: true },
    partyA: { type: String, required: true },
    amount: { type: Number, required: true },
    side: { type: String, enum: ['onramp', 'offramp'], required: true },
    userAddress: { type: String, required: true },
    tokenAddress: { type: String, required: true },
    status: {
        type: String,
        enum: ['PENDING', 'SUCCESS', 'FAILED', 'PROCESSING'],
        default: 'PENDING',
    },
    mpesaReceipt: { type: String },
    transactionDate: { type: Date },
    resultDescription: { type: String },
    crefyId: { type: String, required: true } // Add crefyId field
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Transaction', TransactionSchema);
