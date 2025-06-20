"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = __importDefault(require("./walletgen/main"));
(0, main_1.default)()
    .then(() => console.log("Wallet generation completed successfully."));
