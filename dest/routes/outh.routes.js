"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const oauth_controller_1 = require("../controllers/oauth.controller");
const passport_middleware_1 = require("../middleware/passport.middleware");
const session_middleware_1 = require("../middleware/session.middleware");
const router = (0, express_1.Router)();
// Initiate Google OAuth flow
router.get('/google', session_middleware_1.handleSessionSocket, passport_middleware_1.googleAuth);
router.get('/google/callback', session_middleware_1.handleSessionSocket, passport_middleware_1.googleAuthCallback, oauth_controller_1.OAuthController.googleAuthCallback);
// Get current OAuth user (for frontend to check auth status)
router.get('/user', oauth_controller_1.OAuthController.getOAuthUser);
exports.default = router;
