import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import session from 'express-session';
import passport from 'passport';
import { initSocket, getSocket } from './services/socket.service';
import connectDB from './config/db';
import http from 'http';
import './config/passport';
import dotenv from 'dotenv';
import { swaggerSpec } from './config/swagger';
import swaggerUi from 'swagger-ui-express';

import indexRoutes from './routes';

dotenv.config();


const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 5000;
// Correct middleware order
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-here',
    resave: true, // Changed to true
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());


// Database connection
connectDB();

// Routes
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to Crefy Connect API',
        documentation: '/api-docs',
        health_check: '/health'
    });
});

app.use('/api/v1', indexRoutes);
app.use('/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
        explorer: true,
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: "Crefy Connect API Docs"
    })
);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

// error route
app.get('/error', (req, res) => {
    // html page with error message
    res.send(`
        <html>
            <body>
                <h1>Error</h1>
                <p>Something went wrong!</p>
            </body>
        </html>
    `);
});

// OAuth work in progress route - catches all /api/oauth/* requests
app.get('/api/oauth/:provider', (req, res) => {
    const provider = req.params.provider;

    res.status(503).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>OAuth Integration - Work in Progress</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    margin: 0;
                    padding: 0;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .container {
                    background: white;
                    border-radius: 12px;
                    padding: 2rem;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                    text-align: center;
                    max-width: 500px;
                    margin: 1rem;
                }
                .icon {
                    font-size: 4rem;
                    margin-bottom: 1rem;
                }
                h1 {
                    color: #333;
                    margin-bottom: 1rem;
                    font-size: 1.8rem;
                }
                p {
                    color: #666;
                    line-height: 1.6;
                    margin-bottom: 1.5rem;
                }
                .provider {
                    background: #f8f9fa;
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    font-weight: 600;
                    color: #495057;
                    display: inline-block;
                    margin: 0.5rem 0;
                    text-transform: capitalize;
                }
                .status {
                    background: #fff3cd;
                    border: 1px solid #ffeaa7;
                    color: #856404;
                    padding: 1rem;
                    border-radius: 8px;
                    margin-top: 1rem;
                }
                .back-link {
                    display: inline-block;
                    margin-top: 1.5rem;
                    color: #667eea;
                    text-decoration: none;
                    font-weight: 500;
                    padding: 0.5rem 1rem;
                    border: 2px solid #667eea;
                    border-radius: 6px;
                    transition: all 0.3s ease;
                }
                .back-link:hover {
                    background: #667eea;
                    color: white;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="icon">🚧</div>
                <h1>OAuth Integration in Progress</h1>
                <p>We're currently working on integrating OAuth authentication for:</p>
                <div class="provider">${provider}</div>
                <div class="status">
                    <strong>Status:</strong> Under Development<br>
                    This feature will be available soon. Thank you for your patience!
                </div>
                <a href="javascript:window.close();" class="back-link">← Close Window</a>
            </div>
        </body>
        </html>
    `);
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

initSocket(httpServer);

// Add this debug logging to your SMTPService class
console.log('SMTP Configuration:', {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE,
    user: process.env.SMTP_USER
});

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
});