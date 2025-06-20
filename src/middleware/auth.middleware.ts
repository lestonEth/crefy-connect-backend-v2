// middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import App from '../models/App';

dotenv.config();

interface JwtPayload {
    userId: string;
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header required' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Bearer token required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        console.log('decoded', decoded);
        req.user = { userId: decoded.userId };
        next();
    } catch (error) {
        const message = error instanceof Error ? error : 'Invalid token';
        res.status(403).json({ error: message });
    }
};

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { crefyId } = req.body;
        if (!crefyId) {
            console.log('crefyId is required');
            return res.status(400).json({ error: 'crefyId is required' });
        }
        const app = await App.findOne({ apiKey: crefyId });
        if (!app) {
            console.log('App not found');
            return res.status(404).json({ error: 'App not found' });
        }
        (req as any).crefyId = app.appId;
        console.log('req.crefyId', (req as any).crefyId);
        next();
    } catch (error) {
        const message = error instanceof Error ? error : 'Invalid token';
        res.status(403).json({ error: message });
    }
};

export const validateApiKey = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const apiKey = req.headers['x-api-key'] || req.headers['api-key'];

        if (!apiKey) {
            return res.status(401).json({ error: 'API key is required' });
        }

        const app = await App.findOne({ apiKey: apiKey });
        if (!app) {
            return res.status(401).json({ error: 'Invalid API key' });
        }

        // Add app information to request for use in controllers
        (req as any).app = {
            appId: app.appId,
            name: app.name,
            developer: app.developer
        };

        console.log('API key validated for app:', app.appId);
        next();
    } catch (error) {
        console.error('Error validating API key:', error);
        res.status(500).json({ error: 'Internal server error during API key validation' });
    }
};