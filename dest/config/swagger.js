"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Developer Portal API',
            version: '1.0.0',
            description: 'API for managing developer accounts and applications'
        },
        servers: [
            { url: 'http://localhost:4000/api/v1', description: 'Development server' },
            { url: 'https://crefy-connect-backend-7ph6.onrender.com/api/v1', description: 'Production server' },
            { url: 'https://mutually-factual-weevil.ngrok-free.app/api/v1', description: 'NGROK server' }
        ],
        tags: [
            {
                name: 'Developer Auth',
                description: 'Authentication and developer management'
            },
            {
                name: 'Applications',
                description: 'Developer applications management'
            },
            {
                name: 'Wallets',
                description: 'Wallet management and operations'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                },
                apiKeyAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'x-api-key',
                    description: 'API key for app authentication'
                }
            },
            schemas: {
                Developer: {
                    type: 'object',
                    properties: {
                        developerId: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        isVerified: { type: 'boolean' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                Application: {
                    type: 'object',
                    properties: {
                        appId: { type: 'string' },
                        name: { type: 'string' },
                        apiKey: { type: 'string' },
                        allowedDomains: {
                            type: 'array',
                            items: { type: 'string' }
                        },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                }
            }
        }
    },
    apis: ['./src/routes/*.ts']
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
