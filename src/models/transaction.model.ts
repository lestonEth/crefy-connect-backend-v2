import { Schema, model, Document } from 'mongoose';

export interface ITransaction extends Document {
    orderId: string;
    partyA: string; // phone number
    amount: number;
    side: 'onramp' | 'offramp';
    userAddress: string;
    tokenAddress: string;
    status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'PROCESSING';
    mpesaReceipt?: string;
    transactionDate?: Date;
    resultDescription?: string;
    crefyId: string; // Add crefyId
    createdAt: Date;
    updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
    {
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
    },
    { timestamps: true }
);

export default model<ITransaction>('Transaction', TransactionSchema);