// models/App.ts
import { Schema, model, Document } from 'mongoose';

export interface IApp extends Document {
    name: string;
    appId: string;
    developer: string;  // Changed to string to match Developer's _id type
    apiKey: string;
    allowedDomains: string[];
    createdAt: Date;
    updatedAt: Date;
}

const appSchema = new Schema<IApp>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    appId: {
        type: String,
        required: true,
        unique: true
    },
    developer: {
        type: String,
        ref: 'Developer',
        required: true
    },
    apiKey: {
        type: String,
        required: true,
        unique: true
    },
    allowedDomains: [{
        type: String,
        trim: true
    }]
}, {
    timestamps: true
});

export default model<IApp>('App', appSchema);