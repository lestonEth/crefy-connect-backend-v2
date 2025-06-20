"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAppId = generateAppId;
exports.generateApiKey = generateApiKey;
// utils/generators.ts
const crypto_1 = __importDefault(require("crypto"));
function generateAppId() {
    return `app_${crypto_1.default.randomBytes(8).toString('hex')}`;
}
function generateApiKey() {
    return `ak_${crypto_1.default.randomBytes(16).toString('hex')}`;
}
