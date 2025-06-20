import { Router, RequestHandler } from 'express';
import { EmailController } from '../controllers/email.controller';
import { handleSessionSocket } from '../middleware/session.middleware';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.post('/initiate',
    handleSessionSocket,
    requireAuth as RequestHandler,
    EmailController.initiateEmailWallet as RequestHandler
);

router.post('/verify',
    handleSessionSocket,
    requireAuth as RequestHandler,
    EmailController.verifyEmail as RequestHandler
);

router.get('/status',
    handleSessionSocket,
    requireAuth as RequestHandler,
    EmailController.checkEmailVerification as RequestHandler
);

export default router;