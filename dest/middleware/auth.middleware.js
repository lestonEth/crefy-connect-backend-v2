"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateApiKey = exports.requireAuth = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const App_1 = __importDefault(require("../models/App"));
dotenv_1.default.config();
const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header required' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Bearer token required' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        console.log('decoded', decoded);
        req.user = { userId: decoded.userId };
        next();
    }
    catch (error) {
        const message = error instanceof Error ? error : 'Invalid token';
        res.status(403).json({ error: message });
    }
};
exports.authenticate = authenticate;
const requireAuth = async (req, res, next) => {
    try {
        const { crefyId } = req.body;
        if (!crefyId) {
            console.log('crefyId is required');
            return res.status(400).json({ error: 'crefyId is required' });
        }
        const app = await App_1.default.findOne({ appId: crefyId });
        if (!app) {
            console.log('App not found');
            return res.status(404).json({ error: 'App not found' });
        }
        req.crefyId = app.appId;
        console.log('req.crefyId', req.crefyId);
        next();
    }
    catch (error) {
        const message = error instanceof Error ? error : 'Invalid token';
        res.status(403).json({ error: message });
    }
};
exports.requireAuth = requireAuth;
const validateApiKey = async (req, res, next) => {
    try {
        const apiKey = req.headers['x-api-key'] || req.headers['api-key'];
        if (!apiKey) {
            return res.status(401).json({ error: 'API key is required' });
        }
        const app = await App_1.default.findOne({ apiKey: apiKey });
        if (!app) {
            return res.status(401).json({ error: 'Invalid API key' });
        }
        // Add app information to request for use in controllers
        req.app = {
            appId: app.appId,
            name: app.name,
            developer: app.developer
        };
        console.log('API key validated for app:', app.appId);
        next();
    }
    catch (error) {
        console.error('Error validating API key:', error);
        res.status(500).json({ error: 'Internal server error during API key validation' });
    }
};
exports.validateApiKey = validateApiKey;
