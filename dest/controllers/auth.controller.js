"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const env = process.env;
class AuthController {
    /**
     * Register new user
     */
    static async register(req, res) {
        try {
            console.log('register', req.body);
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(422).json({ error: 'Email and password are required' });
            }
            const { message } = await auth_service_1.AuthService.createUser({ email, password });
            res.status(202).json({
                message
                // OTP will be sent to the user's email
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Registration failed';
            const status = message.includes('already exists') ? 409 : 400;
            res.status(status).json({ error: message });
        }
    }
    /**
     * Verify OTP and activate account
     */
    static async verifyOTP(req, res) {
        try {
            const { email, otp } = req.body;
            if (!email || !otp) {
                return res.status(422).json({ error: 'Email and OTP are required' });
            }
            // Verify OTP against database
            const { token, user } = await auth_service_1.AuthService.verifyEmail(email, otp);
            res.status(200).json({
                message: 'Email verified successfully',
                token, // Long-lived auth token
                user
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Verification failed';
            const status = message.includes('expired') || message.includes('Invalid') ? 401 : 400;
            res.status(status).json({ error: message });
        }
    }
    /**
     * Login existing user
     */
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(422).json({ error: 'Email and password are required' });
            }
            const { token, user } = await auth_service_1.AuthService.login({ email, password });
            res.status(200).json({
                token,
                user
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Login failed';
            const status = message.includes('Invalid') ? 401 :
                message.includes('verified') ? 403 : 400;
            res.status(status).json({ error: message });
        }
    }
    /**
     * Get public profile
     */
    static async getProfile(req, res) {
        try {
            const developerId = req.params.developerId;
            if (!developerId)
                return res.status(422).json({ error: 'Developer ID is required' });
            const developer = await auth_service_1.AuthService.getDeveloperById(developerId);
            if (!developer)
                return res.status(404).json({ error: 'Developer not found' });
            // Only return public profile
            const { _id, password, otp, otpExpiry, ...publicProfile } = developer.toObject();
            res.status(200).json(publicProfile);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to get profile';
            res.status(500).json({ error: message });
        }
    }
}
exports.AuthController = AuthController;
