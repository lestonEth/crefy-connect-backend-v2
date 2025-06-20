// models/Developer.ts
import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IDeveloper extends Document {
    _id: string;
    email: string;
    password: string;
    developerId: string;
    createdAt: Date;
    updatedAt: Date;
    isVerified: boolean;
    otp?: string;
    otpExpiry?: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const developerSchema = new Schema<IDeveloper>({
    _id: {
        type: String,
        required: true,
        unique: true,
        default: () => `dev_${require('crypto').randomUUID()}`
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    developerId: {
        type: String,
        required: true,
        unique: true,
        default: () => `dev_${require('crypto').randomUUID()}`
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: String,
    otpExpiry: Date
}, {
    timestamps: true
});

// Password hashing middleware
developerSchema.pre<IDeveloper>('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error as Error);
    }
});

// Password comparison method
developerSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

export default model<IDeveloper>('Developer', developerSchema);