import { Request, Response } from 'express';
import { AppService } from '../services/app.service';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

interface JwtPayload {
    userId: string;
}

export class AppController {
    /**
     * Create a new app for the authenticated developer
     */
    static async createApp(req: Request, res: Response) {
        try {
            console.log('createApp', req.body);
            const { name, allowedDomains } = req.body;
            const token = req.headers.authorization?.split(' ')[1] || '';

            const developerId = (req.user as any).userId || '';
            console.log('developerId', developerId);

            if (!developerId) {
                return res.status(401).json({ error: 'Authentication required' });
            }
            if (!name) {
                return res.status(422).json({ error: 'App name is required' });
            }

            const app = await AppService.createApp({
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
        } catch (error) {
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
    static async getApps(req: Request, res: Response) {
        try {
            const token = req.headers.authorization?.split(' ')[1] || '';
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
            const developerId = decoded.userId;

            if (!developerId) {
                return res.status(401).json({ error: 'Authentication required' });
            }

            const apps = await AppService.getAppsByDeveloper(developerId);
            res.status(200).json(apps.map(app => ({
                appId: app.appId,
                name: app.name,
                apiKey: app.apiKey,
                allowedDomains: app.allowedDomains,
                createdAt: app.createdAt
            })));
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to get apps';
            const status = message.includes('jwt') ? 401 : 500;
            res.status(status).json({ error: message });
        }
    }

    /**
     * Verify app credentials (for API authentication)
     */
    static async verifyApp(req: Request, res: Response) {
        try {
            const { appId, apiKey } = req.body;

            if (!appId || !apiKey) {
                return res.status(422).json({ error: 'App ID and API key are required' });
            }

            const app = await AppService.verifyAppCredentials(appId, apiKey);
            if (!app) {
                return res.status(401).json({ error: 'Invalid app credentials' });
            }

            res.status(200).json({
                isValid: true,
                appId: app.appId,
                developerId: app.developer,
                allowedDomains: app.allowedDomains
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Verification failed';
            res.status(500).json({ error: message });
        }
    }
}