"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const app_controller_1 = require("../controllers/app.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * components:
 *   schemas:
 *     App:
 *       type: object
 *       properties:
 *         appId:
 *           type: string
 *           example: "app_5f8d04a7b4b3c9001f3e5a9b"
 *         name:
 *           type: string
 *           example: "My Awesome App"
 *         allowedDomains:
 *           type: array
 *           items:
 *             type: string
 *           example: ["https://example.com", "https://myapp.com"]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2023-01-01T00:00:00.000Z"
 *     AppCreationResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/App'
 *         - type: object
 *           properties:
 *             apiKey:
 *               type: string
 *               description: Generated API key (only shown once during creation)
 *               example: "ak_5f8d04a7b4b3c9001f3e5a9b"
 *     AppVerificationResponse:
 *       type: object
 *       properties:
 *         isValid:
 *           type: boolean
 *           example: true
 *         appId:
 *           type: string
 *           example: "app_5f8d04a7b4b3c9001f3e5a9b"
 *         developerId:
 *           type: string
 *           example: "dev_5f8d04a7b4b3c9001f3e5a9b"
 *         allowedDomains:
 *           type: array
 *           items:
 *             type: string
 *           example: ["https://example.com"]
 */
/**
 * @swagger
 * /apps:
 *   post:
 *     summary: Create a new application
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *                 example: "My Awesome App"
 *               allowedDomains:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *                 example: ["https://example.com"]
 *     responses:
 *       201:
 *         description: Application created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppCreationResponse'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       422:
 *         description: Validation error
 */
router.post('/', auth_middleware_1.authenticate, app_controller_1.AppController.createApp);
/**
 * @swagger
 * /apps:
 *   get:
 *     summary: Get all apps for the current developer
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of apps retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/App'
 *       401:
 *         description: Unauthorized - Authentication required
 *       500:
 *         description: Internal Server Error
 */
router.get('/', auth_middleware_1.authenticate, app_controller_1.AppController.getApps);
/**
 * @swagger
 * /apps/verify:
 *   post:
 *     summary: Verify app credentials
 *     tags: [Applications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               appId:
 *                 type: string
 *                 example: "app_5f8d04a7b4b3c9001f3e5a9b"
 *               apiKey:
 *                 type: string
 *                 example: "ak_5f8d04a7b4b3c9001f3e5a9b"
 *             required:
 *               - appId
 *               - apiKey
 *     responses:
 *       200:
 *         description: Credentials verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppVerificationResponse'
 *       401:
 *         description: Unauthorized - Invalid app credentials
 *       422:
 *         description: Unprocessable Entity - App ID and API key are required
 *       500:
 *         description: Internal Server Error
 */
router.post('/verify', app_controller_1.AppController.verifyApp);
exports.default = router;
