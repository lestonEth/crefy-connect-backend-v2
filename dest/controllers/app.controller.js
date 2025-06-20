"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const app_service_1 = require("../services/app.service");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class AppController {
    /**
     * Create a new app for the authenticated developer
     */
    static async createApp(req, res) {
        try {
            console.log('createApp', req.body);
            const { name, allowedDomains } = req.body;
            const token = req.headers.authorization?.split(' ')[1] || '';
            const developerId = req.user.userId || '';
            console.log('developerId', developerId);
            if (!developerId) {
                return res.status(401).json({ error: 'Authentication required' });
            }
            if (!name) {
                return res.status(422).json({ error: 'App name is required' });
            }
            const app = await app_service_1.AppService.createApp({
                name,
                developerId,
                allowedDomains: allowedDomains || []
            });
            res.status(201).json({
                appId: app.appId,
                name: app.name,
                allowedDomains: app.allowedDomains,
                createdAt: app.createdAt,
                apiKey: app.apiKey
            });
        }
        catch (error) {
            console.error('Create app error:', error);
            const message = error instanceof Error ? error.message : 'Failed to create app';
            const status = message.includes('jwt') ? 401 :
                message.includes('Invalid') ? 400 : 500;
            res.status(status).json({ error: message });
        }
    }
    /**
     * Get all apps for the authenticated developer
     */
    static async getApps(req, res) {
        try {
            const token = req.headers.authorization?.split(' ')[1] || '';
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const developerId = decoded.userId;
            if (!developerId) {
                return res.status(401).json({ error: 'Authentication required' });
            }
            const apps = await app_service_1.AppService.getAppsByDeveloper(developerId);
            res.status(200).json(apps.map(app => ({
                appId: app.appId,
                name: app.name,
                apiKey: app.apiKey,
                allowedDomains: app.allowedDomains,
                createdAt: app.createdAt
            })));
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to get apps';
            const status = message.includes('jwt') ? 401 : 500;
            res.status(status).json({ error: message });
        }
    }
    /**
     * Verify app credentials (for API authentication)
     */
    static async verifyApp(req, res) {
        try {
            const { appId, apiKey } = req.body;
            if (!appId || !apiKey) {
                return res.status(422).json({ error: 'App ID and API key are required' });
            }
            const app = await app_service_1.AppService.verifyAppCredentials(appId, apiKey);
            if (!app) {
                return res.status(401).json({ error: 'Invalid app credentials' });
            }
            res.status(200).json({
                isValid: true,
                appId: app.appId,
                developerId: app.developer,
                allowedDomains: app.allowedDomains
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Verification failed';
            res.status(500).json({ error: message });
        }
    }
}
exports.AppController = AppController;
