import { Router, RequestHandler } from 'express';
import { OAuthController } from '../controllers/oauth.controller';
import { googleAuth, googleAuthCallback } from '../middleware/passport.middleware';
import { handleSessionSocket } from '../middleware/session.middleware';

const router = Router();

// Initiate Google OAuth flow
router.get('/google', handleSessionSocket, googleAuth as RequestHandler);

router.get('/google/callback',
    handleSessionSocket,
    googleAuthCallback as RequestHandler,
    OAuthController.googleAuthCallback as RequestHandler
);

// Get current OAuth user (for frontend to check auth status)
router.get('/user', OAuthController.getOAuthUser as RequestHandler);

export default router;