import { Router } from 'express';
import authRoutes from './auth.routes';
import appRoutes from './app.routes';
import oauthRoutes from './oauth.routes';
import emailRoutes from './email.route';
import walletRoutes from './wallet.route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/apps', appRoutes);
router.use('/oauth', oauthRoutes);
router.use('/email', emailRoutes);
router.use('/wallets', walletRoutes);

export default router;