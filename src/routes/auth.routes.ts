import { Router, RequestHandler } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     AuthResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: JWT authentication token
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               example: "507f1f77bcf86cd799439011"
 *             email:
 *               type: string
 *               format: email
 *               example: "developer@example.com"
 *             isVerified:
 *               type: boolean
 *               example: true
 *     DeveloperProfile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         email:
 *           type: string
 *           format: email
 *           example: "developer@example.com"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2023-01-01T00:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2023-01-01T00:00:00.000Z"
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new developer
 *     tags: [Developer Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: developer@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: "securePassword123"
 *             required:
 *               - email
 *               - password
 *     responses:
 *       202:
 *         description: Registration successful. OTP has been sent to the provided email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Registration successful. Please check your email for OTP"
 *       400:
 *         description: Bad request (generic error)
 *       409:
 *         description: Conflict - User with this email already exists
 *       422:
 *         description: Unprocessable Entity - Email and password are required
 */
router.post('/register', AuthController.register as RequestHandler);

/**
 * @swagger
 * /auth/verify:
 *   post:
 *     summary: Verify email with OTP
 *     tags: [Developer Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: developer@example.com
 *               otp:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 6
 *                 example: "123456"
 *             required:
 *               - email
 *               - otp
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Bad request (generic error)
 *       401:
 *         description: Unauthorized - Invalid or expired OTP
 *       404:
 *         description: Not Found - User with this email not found
 *       422:
 *         description: Unprocessable Entity - Email and OTP are required
 */
router.post('/verify', AuthController.verifyOTP as RequestHandler);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate developer
 *     tags: [Developer Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: developer@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "securePassword123"
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Unauthorized - Invalid credentials
 *       403:
 *         description: Forbidden - Email not verified
 *       422:
 *         description: Unprocessable Entity - Email and password are required
 */
router.post('/login', AuthController.login as RequestHandler);

/**
 * @swagger
 * /auth/profile/{developerId}:
 *   get:
 *     summary: Get developer public profile
 *     tags: [Developer Auth]
 *     parameters:
 *       - in: path
 *         name: developerId
 *         schema:
 *           type: string
 *         required: true
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Developer profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeveloperProfile'
 *       404:
 *         description: Not Found - Developer not found
 *       422:
 *         description: Unprocessable Entity - Developer ID is required
 *       500:
 *         description: Internal Server Error
 */
router.get('/profile/:developerId', AuthController.getProfile as RequestHandler);

export default router;