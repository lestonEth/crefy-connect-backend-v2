"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailController = void 0;
const smtp_service_1 = require("../services/smtp.service");
const socket_service_1 = require("../services/socket.service");
const Wallet_1 = __importDefault(require("../models/Wallet"));
const wallet_service_1 = require("../services/wallet.service");
class EmailController {
    static async initiateEmailWallet(req, res) {
        console.log('initiateEmailWallet', req.body);
        try {
            const { email } = req.body;
            if (typeof email !== 'string') {
                return res.status(400).json({ error: 'Email is required' });
            }
            const wallet = await Wallet_1.default.findOne({ email });
            console.log('wallet', wallet);
            if (wallet) {
                console.log('wallet exists');
                if (wallet.isActive) {
                    return res.status(200).json({ success: true, message: 'Wallet already exists', wallet, isActive: wallet.isActive, user: { email: wallet.email, name: wallet.name } });
                }
                else {
                    return res.status(200).json({ success: true, message: 'Wallet exists but is not active', isActive: wallet.isActive, user: { email: wallet.email, name: wallet.name } });
                }
            }
            else {
                console.log("creating wallet");
                const userId = Math.random().toString(36).substring(2, 21);
                const otp = Math.floor(100000 + Math.random() * 900000).toString();
                const otpExpiry = new Date(Date.now() + 600000);
                await smtp_service_1.SMTPService.sendVerificationEmail({ email, otp, type: 'Wallet_creation' });
                const newWallet = await wallet_service_1.WalletService.createWallet({ userId: userId, email, name: '', isActive: false, otp, otpExpiry, appId: req.crefyId });
                // const socketId = req.session.socketId;
                // if (socketId) {
                //     const socket = getSocket(socketId);
                //     if (socket) {
                //         socket.emit('email-verification-sent', { success: true, email });
                //     }
                // }
                res.json({ success: true, message: 'Verification email sent' });
            }
        }
        catch (error) {
            console.error('Error initiating email wallet:', error);
            const socketId = req.session.socketId;
            if (socketId) {
                const socket = (0, socket_service_1.getSocket)(socketId);
                if (socket) {
                    socket.emit('email-error', {
                        success: false,
                        error: error.message || 'Failed to initiate email wallet'
                    });
                }
            }
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to initiate email wallet'
            });
        }
    }
    static async verifyEmail(req, res) {
        try {
            const { token, address } = req.body;
            console.log('verifyEmail', req.body);
            if (!token) {
                console.log('Token is required');
                return res.status(400).json({ error: 'Token is required' });
            }
            const wallet = await Wallet_1.default.findOne({ email: address });
            if (!wallet) {
                console.log('Wallet not found');
                return res.status(400).json({ error: 'Wallet not found' });
            }
            console.log('wallet', wallet);
            // compare token with otp
            if (wallet.otp !== token) {
                console.log('Invalid token');
                return res.status(400).json({ error: 'Invalid token' });
            }
            // update wallet isActive to true
            wallet.isActive = true;
            await wallet.save();
            res.json({ success: true, message: 'Email verified', wallet, isActive: wallet.isActive, user: { email: wallet.email, name: wallet.name } });
        }
        catch (error) {
            console.error('Error verifying email:', error);
            const socketId = req.session.socketId;
            if (socketId) {
                const socket = (0, socket_service_1.getSocket)(socketId);
                if (socket) {
                    socket.emit('email-error', {
                        success: false,
                        error: error.message || 'Failed to verify email'
                    });
                }
            }
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to verify email'
            });
        }
    }
    static async checkEmailVerification(req, res) {
        try {
            const verification = req.session.emailVerification;
            if (!verification) {
                return res.status(404).json({ error: 'No email verification in progress' });
            }
            res.json({
                email: verification.email,
                verified: verification.verified,
                createdAt: verification.createdAt
            });
        }
        catch (error) {
            console.error('Error checking email verification:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to check email verification status'
            });
        }
    }
}
exports.EmailController = EmailController;
