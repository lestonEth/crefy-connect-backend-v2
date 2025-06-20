// services/auth.service.ts
import Developer from '../models/Developer';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { generateOTP } from '../utils/otp';
import { SMTPService } from './smtp.service';

dotenv.config();
const env = process.env;

export class AuthService {
    static async createUser(data: { email: string; password: string }) {
        // Check if user exists
        const existingUser = await Developer.findOne({ email: data.email });
        if (existingUser) {
            throw new Error('User already exists');
        }

        // Generate OTP
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

        // Create user
        const user = await Developer.create({
            email: data.email,
            password: data.password,
            otp,
            otpExpiry,
            isVerified: false
        });

        // Send OTP to user's email
        await SMTPService.sendVerificationEmail({
            email: data.email,
            otp,
            type: 'user_creation'
        });

        return {
            message: 'Registration successful. Please check your email for OTP',
            userId: user._id.toString()
        };
    }

    static async verifyEmail(email: string, otp: string) {
        // Find user by email
        const user = await Developer.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }

        // Check if OTP matches and is not expired
        if (user.otp !== otp || new Date() > (user.otpExpiry as Date)) {
            throw new Error('Invalid or expired OTP');
        }

        // Update user as verified
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        // Generate auth token
        const token = jwt.sign(
            { userId: user._id.toString() },
            env.JWT_SECRET as string,
            { expiresIn: '30d' }
        );

        return {
            token,
            user: {
                id: user._id,
                email: user.email,
                isVerified: user.isVerified
            }
        };
    }

    static async login(data: { email: string; password: string }) {
        // Find user by email
        const user = await Developer.findOne({ email: data.email });
        if (!user) {
            throw new Error('Invalid credentials');
        }

        // Check if password matches
        const isMatch = await user.comparePassword(data.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        // Check if user is verified
        if (!user.isVerified) {
            throw new Error('Account not verified. Please verify your email first');
        }

        // Generate auth token
        const token = jwt.sign(
            { userId: user._id.toString() },
            env.JWT_SECRET as string,
            { expiresIn: '30d' }
        );

        return {
            token,
            user: {
                id: user._id,
                email: user.email,
                isVerified: user.isVerified
            }
        };
    }

    static async getDeveloperById(developerId: string) {
        return await Developer.findById(developerId);
    }
}