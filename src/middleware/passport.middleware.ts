import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

console.log("passport initialized");
export const googleAuth = passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false  // We don't need sessions
});

// Update your googleAuthCallback middleware in passport.middleware.ts
export const googleAuthCallback = passport.authenticate('google', {
    failureRedirect: '/error=oauth_failed',
    session: false
});