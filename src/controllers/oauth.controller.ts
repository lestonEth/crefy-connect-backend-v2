import { Request, Response } from 'express';
import { getSocket } from '../services/socket.service';
import { WalletService } from '../services/wallet.service';

export class OAuthController {
    static async googleAuthCallback(req: Request, res: Response) {
        try {
            if (!req.user) throw new Error('Google authentication failed');

            const profile = req.user as any;
            const userInfo = {
                id: profile.id,
                email: profile.emails?.[0]?.value,
                name: profile.displayName,
                avatar: profile.photos?.[0]?.value
            };

            let wallet = await WalletService.getWalletByUserEmail(userInfo.email);
            if (!wallet) {
                wallet = await WalletService.createWallet({ userId: userInfo.id, email: userInfo.email, name: userInfo.name, isActive: true, otp: '', otpExpiry: new Date(), appId: (req as any).crefyId });
            }

            const socketId = req.session.socketId as string;
            console.log("socketId in the test oauth controller", socketId);

            if (socketId) {
                console.log('socketId in the test', socketId);
                const socket = getSocket(socketId);
                console.log('socket after test', socket);
                if (socket) {
                    socket.emit('google-auth-success', { success: true, user: userInfo, wallet: wallet });

                    res.send(`
                        <!DOCTYPE html>
                        <html>
                        <body>
                            <p>Authentication successful. You may close this window.</p>
                            <script>
                                setTimeout(() => window.close(), 1000);
                            </script>
                        </body>
                        </html>
                    `);
                } else {
                    res.send(`
                        <!DOCTYPE html>
                        <html>
                        <body>
                            <p>Authentication failed. You may close this window.</p>
                            <script>
                                setTimeout(() => window.close(), 1000);
                            </script>
                        </body>
                        </html>
                    `);
                }
            }

        } catch (error: any) {
            const socketId = req.session.socketId as string;
            if (socketId) {
                const socket = getSocket(socketId);
                if (socket) {
                    socket.emit('oauth-error', {
                        success: false,
                        error: error.message
                    });
                }
            }
            res.send(`
            <!DOCTYPE html>
            <html>
            <body>
                <p>Authentication failed. You may close this window.</p>
                <script>
                    setTimeout(() => window.close(), 1000);
                </script>
            </body>
            </html>
            `);
        }
    }

    static async getOAuthUser(req: Request, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Not authenticated' });
            }

            const profile = req.user as any;
            res.json({
                id: profile.id,
                email: profile.emails?.[0]?.value,
                name: profile.displayName,
                avatar: profile.photos?.[0]?.value
            });
        } catch (error) {
            console.error('Error getting OAuth user:', error);
            res.status(500).json({ error: 'Failed to get user info' });
        }
    }
}