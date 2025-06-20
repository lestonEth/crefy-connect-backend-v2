"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleAuthCallback = exports.googleAuth = void 0;
const passport_1 = __importDefault(require("passport"));
console.log("passport initialized");
exports.googleAuth = passport_1.default.authenticate('google', {
    scope: ['profile', 'email'],
    session: false // We don't need sessions
});
// Update your googleAuthCallback middleware in passport.middleware.ts
exports.googleAuthCallback = passport_1.default.authenticate('google', {
    failureRedirect: '/error=oauth_failed',
    session: false
});
