"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// In passport.middleware.ts
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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
