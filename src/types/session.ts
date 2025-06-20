import 'express-session';

declare module 'express-session' {
    interface SessionData {
        developerId?: string;
    }

    
}

export interface CustomSession {
    emailVerification?: {
        email: string;
        otp: string;
        expiry: Date;
    };
    developerId?: string;
} 