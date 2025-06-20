import { Session, SessionData } from 'express-session';

declare module 'express-session' {
    interface SessionData {
        socketId?: string;
        emailVerification?: EmailVerification;
        userId?: string;
        crefyId?: string;
    }
}

export interface EmailVerification {
    email: string;
    token: string;
    verified: boolean;
    createdAt: Date;
}

export interface CustomSession extends SessionData {
    socketId?: string;
    emailVerification?: EmailVerification;
    userId?: string;
    crefyId?: string;
}