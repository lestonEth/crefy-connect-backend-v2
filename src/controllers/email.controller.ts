// src/controllers/email.controller.ts
import { Request, Response } from 'express';
import { SMTPService } from '../services/smtp.service';
import { getSocket } from '../services/socket.service';
import { CustomSession } from '../types/express-session';
import Wallet from '../models/Wallet';
import { WalletService } from '../services/wallet.service';

export class EmailController {
    static async initiateEmailWallet(req: Request & { session: CustomSession }, res: Response) {
        console.log('initiateEmailWallet', req.body);
        try {
            const { email } = req.body;

            if (typeof email !== 'string') {
                return res.status(400).json({ error: 'Email is required' });
            }

            const wallet = await Wallet.findOne({ email });
            console.log('wallet', wallet);

            if (wallet) {
                console.log('wallet exists');
                if (wallet.isActive) {
                    return res.status(200).json({ success: true, message: 'Wallet already exists', wallet, isActive: wallet.isActive, user: { email: wallet.email, name: wallet.name } });
                } else {
                    return res.status(200).json({ success: true, message: 'Wallet exists but is not active', isActive: wallet.isActive, user: { email: wallet.email, name: wallet.name } });
                }
            } else {
                console.log("creating wallet");
                const userId = Math.random().toString(36).substring(2, 21);
                const otp = Math.floor(100000 + Math.random() * 900000).toString();
                const otpExpiry = new Date(Date.now() + 600000);

                await SMTPService.sendVerificationEmail({ email, otp, type: 'Wallet_creation' });

                const newWallet = await WalletService.createWallet({ userId: userId, email, name: '', isActive: false, otp, otpExpiry, appId: (req as any).crefyId });

                // const socketId = req.session.socketId;
                // if (socketId) {
                //     const socket = getSocket(socketId);
                //     if (socket) {
                //         socket.emit('email-verification-sent', { success: true, email });
                //     }
                // }

                res.json({ success: true, message: 'Verification email sent' });
            }
        } catch (error: any) {
            console.error('Error initiating email wallet:', error);

            const socketId = req.session.socketId;
            if (socketId) {
                const socket = getSocket(socketId);
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

    static async verifyEmail(req: Request & { session: CustomSession }, res: Response) {
        try {
            const { token, address } = req.body;
            console.log('verifyEmail', req.body);

            if (!token) {
                console.log('Token is required');
                return res.status(400).json({ error: 'Token is required' });
            }

            const wallet: any = await Wallet.findOne({ email: address });

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
        } catch (error: any) {
            console.error('Error verifying email:', error);

            const socketId = req.session.socketId;
            if (socketId) {
                const socket = getSocket(socketId);
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

    static async checkEmailVerification(req: Request & { session: CustomSession }, res: Response) {
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
        } catch (error: any) {
            console.error('Error checking email verification:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to check email verification status'
            });
        }
    }
}