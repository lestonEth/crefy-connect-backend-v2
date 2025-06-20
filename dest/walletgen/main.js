"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = main;
const generate_1 = require("./generate");
async function main() {
    try {
        const wallet = (0, generate_1.generateAddress)();
        console.log("✅ New Wallet:", wallet);
    }
    catch (error) {
        if (error instanceof generate_1.WalletGenerationError) {
            console.error("⚠️ Wallet generation failed:", error.message);
        }
        else {
            console.error("❌ Unknown error:", error);
        }
    }
}
