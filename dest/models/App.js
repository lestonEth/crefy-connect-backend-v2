"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// models/App.ts
const mongoose_1 = require("mongoose");
const appSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    appId: {
        type: String,
        required: true,
        unique: true
    },
    developer: {
        type: String,
        ref: 'Developer',
        required: true
    },
    apiKey: {
        type: String,
        required: true,
        unique: true
    },
    allowedDomains: [{
            type: String,
            trim: true
        }]
}, {
    timestamps: true
});
exports.default = (0, mongoose_1.model)('App', appSchema);
