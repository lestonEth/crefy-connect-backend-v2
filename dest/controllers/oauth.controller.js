"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuthController = void 0;
const socket_service_1 = require("../services/socket.service");
const wallet_service_1 = require("../services/wallet.service");
class OAuthController {
    static async googleAuthCallback(req, res) {
        try {
            if (!req.user)
                throw new Error('Google authentication failed');
            const profile = req.user;
            const userInfo = {
                id: profile.id,
                email: profile.emails?.[0]?.value,
                name: profile.displayName,
                avatar: profile.photos?.[0]?.value
            };
            let wallet = await wallet_service_1.WalletService.getWalletByUserEmail(userInfo.email);
            if (!wallet) {
                wallet = await wallet_service_1.WalletService.createWallet({ userId: userInfo.id, email: userInfo.email, name: userInfo.name, isActive: true, otp: '', otpExpiry: new Date(), appId: req.crefyId });
            }
            const socketId = req.session.socketId;
            console.log("socketId in the test oauth controller", socketId);
            if (socketId) {
                console.log('socketId in the test', socketId);
                const socket = (0, socket_service_1.getSocket)(socketId);
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
                }
                else {
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
        }
        catch (error) {
            const socketId = req.session.socketId;
            if (socketId) {
                const socket = (0, socket_service_1.getSocket)(socketId);
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
    static async getOAuthUser(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Not authenticated' });
            }
            const profile = req.user;
            res.json({
                id: profile.id,
                email: profile.emails?.[0]?.value,
                name: profile.displayName,
                avatar: profile.photos?.[0]?.value
            });
        }
        catch (error) {
            console.error('Error getting OAuth user:', error);
            res.status(500).json({ error: 'Failed to get user info' });
        }
    }
}
exports.OAuthController = OAuthController;
