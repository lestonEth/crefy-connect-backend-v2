"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SMTPService = void 0;
// src/services/smtp.service.ts
const nodemailer_1 = __importDefault(require("nodemailer"));
class SMTPService {
    static async sendVerificationEmail(emailVerification) {
        console.log('SMTP_HOST', process.env.SMTP_HOST);
        console.log('SMTP_PORT', process.env.SMTP_PORT);
        console.log('SMTP_USER', process.env.SMTP_USER);
        console.log('SMTP_PASS', process.env.SMTP_PASS);
        console.log('SMTP_FROM', process.env.SMTP_FROM);
        console.log('Sending verification email to', emailVerification.email);
        try {
            let html = '';
            if (emailVerification.type === 'user_creation') {
                html = `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #4CAF50;">Welcome to Our Platform!</h2>
                    <p>Thank you for creating an account with us. To proceed with the activation of your account, we kindly ask you to verify your email address.</p>
                    <p>Please use the following OTP code to verify your email:</p>
                    <p style="font-size: 20px; font-weight: bold; color: #4CAF50;">${emailVerification.otp}</p>
                    <p><small>This OTP code will expire in 1 hour. If you did not request this, please ignore this email.</small></p>
                    <p>Best regards,<br>The Crefy-Connect Team</p>
                </div>
                `;
            }
            if (emailVerification.type === 'Wallet_creation') {
                html = `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #4CAF50;">Welcome to Our Platform!</h2>
                    <p>Thank you for registering with us. To proceed with the activation of your wallet, we kindly ask you to verify your email address.</p>
                    <p>Please use the following OTP code to verify your email:</p>
                    <p style="font-size: 20px; font-weight: bold; color: #4CAF50;">${emailVerification.otp}</p>
                    <p><small>This OTP code will expire in 1 hour. If you did not request this, please ignore this email.</small></p>
                    <p>Best regards,<br>The Crefy-Connect Team</p>
                </div>
                `;
            }
            const mailOptions = {
                to: emailVerification.email,
                subject: 'Email Verification Required for Wallet Activation',
                html: html,
                from: process.env.SMTP_FROM || `"Crefy Connect" <${process.env.SMTP_USER}>`
            };
            // Verify connection first
            await this.transporter.verify();
            console.log('SMTP Server is ready to take our messages');
            // Send email
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer_1.default.getTestMessageUrl(info));
        }
        catch (error) {
            console.error('Error sending verification email:', error);
            throw new Error('Failed to send verification email');
        }
    }
    static async verifyEmailToken(token, req) {
        try {
            const verification = req.session.emailVerification;
            console.log('verification', verification);
            if (!verification || verification.token !== token) {
                return false;
            }
            // Check if token is expired (1 hour)
            const now = new Date();
            const tokenAge = now.getTime() - new Date(verification.createdAt).getTime();
            const maxAge = 60 * 60 * 1000; // 1 hour in milliseconds
            if (tokenAge > maxAge) {
                return false;
            }
            // Mark as verified
            if (req.session.emailVerification) {
                req.session.emailVerification.verified = true;
            }
            return true;
        }
        catch (error) {
            console.error('Error verifying email token:', error);
            return false;
        }
    }
    static async sendWalletCreatedEmail(email) {
        try {
            const mailOptions = {
                to: email,
                subject: 'Your Wallet Has Been Created',
                html: `
                    <h1>Wallet Creation Successful!</h1>
                    <p>Your wallet has been successfully created and is now ready to use.</p>
                    <p>Thank you for joining our platform!</p>
                `,
                from: process.env.SMTP_FROM || `"Crefy Connect" <${process.env.SMTP_USER}>` // Add this line
            };
            await this.transporter.sendMail(mailOptions);
        }
        catch (error) {
            console.error('Error sending wallet created email:', error);
            throw new Error('Failed to send wallet creation notification');
        }
    }
}
exports.SMTPService = SMTPService;
SMTPService.transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
