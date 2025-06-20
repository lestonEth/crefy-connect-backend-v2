import { Request, Response, NextFunction } from 'express';
import { CustomSession } from '../types/express-session';

export const handleSessionSocket = (req: Request & { session: CustomSession }, res: Response, next: NextFunction) => {
    res.clearCookie('connect.sid');
    const socketId = req.query.socketId as string;

    if (socketId) {
        req.session.socketId = socketId;

        req.session.save((err) => {
            if (err) console.error('Session save error:', err);
            next();
        });
    } else {
        next();
    }
}; 