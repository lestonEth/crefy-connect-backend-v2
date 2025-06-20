"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const wallet_controller_1 = require("../controllers/wallet.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * components:
 *   schemas:
 *     Wallet:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         userId:
 *           type: string
 *           example: "user_507f1f77bcf86cd799439011"
 *         address:
 *           type: string
 *           example: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
 *         publicKey:
 *           type: string
 *           example: "0x04..."
 *         email:
 *           type: string
 *           format: email
 *           example: "user@example.com"
 *         name:
 *           type: string
 *           example: "My Wallet"
 *         isActive:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2023-01-01T00:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2023-01-01T00:00:00.000Z"
 *     WalletWithSecrets:
 *       allOf:
 *         - $ref: '#/components/schemas/Wallet'
 *         - type: object
 *           properties:
 *             privateKey:
 *               type: string
 *               description: Wallet private key (only returned during creation)
 *               example: "0x1234567890abcdef..."
 *             mnemonic:
 *               type: string
 *               description: Wallet mnemonic phrase (only returned during creation)
 *               example: "word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12"
 *     WalletBalance:
 *       type: object
 *       properties:
 *         walletId:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         address:
 *           type: string
 *           example: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
 *         balance:
 *           type: string
 *           description: Balance in wei
 *           example: "1000000000000000000"
 *     CreateWalletRequest:
 *       type: object
 *       required:
 *         - email
 *         - name
 *         - appId
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "user@example.com"
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *           example: "My New Wallet"
 *         appId:
 *           type: string
 *           example: "app_507f1f77bcf86cd799439011"
 */
/**
 * @swagger
 * /wallets:
 *   get:
 *     summary: Get all wallets (API key authentication)
 *     tags: [Wallets]
 *     security:
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         schema:
 *           type: string
 *         required: true
 *         description: API key for app authentication
 *         example: "ak_507f1f77bcf86cd799439011"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of wallets per page
 *         example: 10
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by wallet active status
 *         example: true
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filter by email (case-insensitive search)
 *         example: "user@example.com"
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter by user ID
 *         example: "user_507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: List of all wallets retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 wallets:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Wallet'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 25
 *                     totalPages:
 *                       type: integer
 *                       example: 3
 *       401:
 *         description: Unauthorized - Missing or invalid API key
 *       500:
 *         description: Internal Server Error
 */
router.get('/', auth_middleware_1.validateApiKey, wallet_controller_1.WalletController.getAllWallets);
/**
 * @swagger
 * /wallets/user/{userId}:
 *   get:
 *     summary: Get all wallets for a user
 *     tags: [Wallets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *         example: "user_507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: List of wallets retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Wallet'
 *       400:
 *         description: Bad request - User ID is required
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - Access denied
 *       500:
 *         description: Internal Server Error
 */
router.get('/user/:userId', auth_middleware_1.authenticate, wallet_controller_1.WalletController.getUserWallets);
/**
 * @swagger
 * /wallets/{walletId}/user/{userId}:
 *   get:
 *     summary: Get a specific wallet by ID
 *     tags: [Wallets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: walletId
 *         schema:
 *           type: string
 *         required: true
 *         description: Wallet ID
 *         example: "507f1f77bcf86cd799439011"
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *         example: "user_507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Wallet retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Wallet'
 *       400:
 *         description: Bad request - User ID and Wallet ID are required
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - Access denied
 *       404:
 *         description: Not Found - Wallet not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/:walletId/user/:userId', auth_middleware_1.authenticate, wallet_controller_1.WalletController.getWallet);
/**
 * @swagger
 * /wallets:
 *   post:
 *     summary: Create a new wallet
 *     tags: [Wallets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateWalletRequest'
 *     responses:
 *       201:
 *         description: Wallet created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WalletWithSecrets'
 *       400:
 *         description: Bad request - Email, name, and appId are required
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       500:
 *         description: Internal Server Error
 */
router.post('/', auth_middleware_1.authenticate, wallet_controller_1.WalletController.createWallet);
/**
 * @swagger
 * /wallets/{walletId}/user/{userId}/balance:
 *   get:
 *     summary: Get wallet balance
 *     tags: [Wallets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: walletId
 *         schema:
 *           type: string
 *         required: true
 *         description: Wallet ID
 *         example: "507f1f77bcf86cd799439011"
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *         example: "user_507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Wallet balance retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WalletBalance'
 *       400:
 *         description: Bad request - User ID and Wallet ID are required
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - Access denied
 *       404:
 *         description: Not Found - Wallet not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/:walletId/user/:userId/balance', auth_middleware_1.authenticate, wallet_controller_1.WalletController.getWalletBalance);
exports.default = router;
