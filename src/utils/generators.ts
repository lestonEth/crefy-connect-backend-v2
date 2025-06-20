// utils/generators.ts
import crypto from 'crypto';

export function generateAppId(): string {
    return `app_${crypto.randomBytes(8).toString('hex')}`;
}

export function generateApiKey(): string {
    return `ak_${crypto.randomBytes(16).toString('hex')}`;
}