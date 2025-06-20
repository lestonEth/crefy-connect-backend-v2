"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const App_1 = __importDefault(require("../models/App"));
const generators_1 = require("../utils/generators");
class AppService {
    static async createApp(data) {
        try {
            const app = await App_1.default.create({
                name: data.name,
                developer: data.developerId,
                allowedDomains: data.allowedDomains || [],
                appId: (0, generators_1.generateAppId)(),
                apiKey: (0, generators_1.generateApiKey)()
            });
            return app;
        }
        catch (error) {
            throw new Error(`Failed to create app: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    static async getAppsByDeveloper(developerId) {
        try {
            return await App_1.default.find({ developer: developerId });
        }
        catch (error) {
            throw new Error(`Failed to get apps: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    static async verifyAppCredentials(appId, apiKey) {
        try {
            return await App_1.default.findOne({ appId, apiKey })
                .select('-__v')
                .lean();
        }
        catch (error) {
            throw new Error(`Failed to verify credentials: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}
exports.AppService = AppService;
