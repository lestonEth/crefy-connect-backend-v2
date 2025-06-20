"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const swypt_controller_1 = __importDefault(require("../controllers/swypt.controller"));
const router = (0, express_1.Router)();
const swyptController = new swypt_controller_1.default();
// Get supported assets
router.get('/supported-assets', swyptController.getSupportedAssets);
// Get quote for transaction
router.post('/quotes', swyptController.getQuote);
// Initiate on-ramp transaction
router.post('/onramp', swyptController.initiateOnRamp);
// Get on-ramp transaction status
router.get('/onramp-status/:orderId', swyptController.getOnRampStatus);
// Create on-ramp ticket
router.post('/onramp-ticket', swyptController.createOnRampTicket);
// Get transaction by order ID
router.get('/transactions/:orderId', swyptController.getTransaction);
// Get all transactions for a user
router.get('/transactions/user/:userAddress', swyptController.getUserTransactions);
exports.default = router;
