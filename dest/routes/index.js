"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const app_routes_1 = __importDefault(require("./app.routes"));
const oauth_routes_1 = __importDefault(require("./oauth.routes"));
const email_route_1 = __importDefault(require("./email.route"));
const wallet_route_1 = __importDefault(require("./wallet.route"));
const router = (0, express_1.Router)();
router.use('/auth', auth_routes_1.default);
router.use('/apps', app_routes_1.default);
router.use('/oauth', oauth_routes_1.default);
router.use('/email', email_route_1.default);
router.use('/wallets', wallet_route_1.default);
exports.default = router;
