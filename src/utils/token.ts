import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

export const generateToken = (payload: object): string => {
    return jwt.sign(payload, JWT_SECRET as jwt.Secret, {
        expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']
    });
};

export const verifyToken = (token: string): any => {
    return jwt.verify(token, JWT_SECRET);
};