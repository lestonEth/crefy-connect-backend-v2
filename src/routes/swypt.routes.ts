import { Router, RequestHandler } from 'express';
import SwyptController from '../controllers/swypt.controller';
import { validateRequest } from '../middleware/validation.middleware';
import { GetQuoteDto, OnRampDto } from '../dto/swypt.dto';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();
const swyptController = new SwyptController();

// Get supported assets
router.get('/supported-assets', swyptController.getSupportedAssets);

// Get quote for transaction
router.post('/quotes',
    swyptController.getQuote
);

// Initiate on-ramp transaction
router.post('/onramp',
    swyptController.initiateOnRamp
);

// Get on-ramp transaction status
router.get('/onramp-status/:orderId',
    swyptController.getOnRampStatus
);

// Create on-ramp ticket
router.post('/onramp-ticket',
    swyptController.createOnRampTicket
);

// Get transaction by order ID
router.get('/transactions/:orderId',
    swyptController.getTransaction as RequestHandler
);

// Get all transactions for a user
router.get('/transactions/user/:userAddress',
    swyptController.getUserTransactions
);

export default router;