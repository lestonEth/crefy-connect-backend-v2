// config/env.ts
import dotenv from 'dotenv';

dotenv.config();

export const env = {
    JWT_SECRET: process.env.JWT_SECRET as string,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
};