import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';

dotenv.config();

// In passport.middleware.ts
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: 'https://mutually-factual-weevil.ngrok-free.app/api/oauth/google/callback',
    passReqToCallback: true // Add this to access the request object
}, (req, accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

// // Remove serializeUser/deserializeUser since you're not using sessions
// passport.serializeUser((user, done) => {
//     done(null, user);
// });

// passport.deserializeUser((user: Express.User, done) => {
//     done(null, user);
// });