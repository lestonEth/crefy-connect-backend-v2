import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

export interface IUser extends Document {
    _id: string;
    email: string;
    password: string;
    crefyId: string;
    createdAt: Date;
    updatedAt: Date;
    isVerified: boolean; // Add verification status
    otp?: string; // Add OTP field
    otpExpiry?: Date; // Add OTP expiry
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
    _id: {
        type: String,
        required: true,
        unique: true,
        default: () => randomUUID()
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
    crefyId: {
        type: String,
        required: true,
        unique: true,
        default: () => randomUUID()
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
userSchema.pre<IUser>('save', async function (next) {
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
userSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

export default model<IUser>('User', userSchema);