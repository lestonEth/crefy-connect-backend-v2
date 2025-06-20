import App from '../models/App';
import { generateApiKey, generateAppId } from '../utils/generators';

interface CreateAppData {
    name: string;
    developerId: string;
    allowedDomains?: string[];
}

export class AppService {
    static async createApp(data: CreateAppData) {
        try {
            const app = await App.create({
                name: data.name,
                developer: data.developerId,
                allowedDomains: data.allowedDomains || [],
                appId: generateAppId(),
                apiKey: generateApiKey()
            });

            return app;
        } catch (error) {
            throw new Error(`Failed to create app: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    static async getAppsByDeveloper(developerId: string) {
        try {
            return await App.find({ developer: developerId })
        } catch (error) {
            throw new Error(`Failed to get apps: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    static async verifyAppCredentials(appId: string, apiKey: string) {
        try {
            return await App.findOne({ appId, apiKey })
                .select('-__v')
                .lean();
        } catch (error) {
            throw new Error(`Failed to verify credentials: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}