"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
// services/auth.service.ts
const Developer_1 = __importDefault(require("../models/Developer"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const otp_1 = require("../utils/otp");
const smtp_service_1 = require("./smtp.service");
dotenv_1.default.config();
const env = process.env;
class AuthService {
    static async createUser(data) {
        // Check if user exists
        const existingUser = await Developer_1.default.findOne({ email: data.email });
        if (existingUser) {
            throw new Error('User already exists');
        }
        // Generate OTP
        const otp = (0, otp_1.generateOTP)();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
        // Create user
        const user = await Developer_1.default.create({
            email: data.email,
            password: data.password,
            otp,
            otpExpiry,
            isVerified: false
        });
        // Send OTP to user's email
        await smtp_service_1.SMTPService.sendVerificationEmail({
            email: data.email,
            otp,
            type: 'user_creation'
        });
        return {
            message: 'Registration successful. Please check your email for OTP',
            userId: user._id.toString()
        };
    }
    static async verifyEmail(email, otp) {
        // Find user by email
        const user = await Developer_1.default.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }
        // Check if OTP matches and is not expired
        if (user.otp !== otp || new Date() > user.otpExpiry) {
            throw new Error('Invalid or expired OTP');
        }
        // Update user as verified
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();
        // Generate auth token
        const token = jsonwebtoken_1.default.sign({ userId: user._id.toString() }, env.JWT_SECRET, { expiresIn: '30d' });
        return {
            token,
            user: {
                id: user._id,
                email: user.email,
                isVerified: user.isVerified
            }
        };
    }
    static async login(data) {
        // Find user by email
        const user = await Developer_1.default.findOne({ email: data.email });
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
        const token = jsonwebtoken_1.default.sign({ userId: user._id.toString() }, env.JWT_SECRET, { expiresIn: '30d' });
        return {
            token,
            user: {
                id: user._id,
                email: user.email,
                isVerified: user.isVerified
            }
        };
    }
    static async getDeveloperById(developerId) {
        return await Developer_1.default.findById(developerId);
    }
}
exports.AuthService = AuthService;
