import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

export default {
    secret: JWT_SECRET,
    expiresIn: JWT_EXPIRES_IN
};