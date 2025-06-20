"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseClient = void 0;
const viem_1 = require("viem");
const chains_1 = require("viem/chains");
exports.baseClient = (0, viem_1.createPublicClient)({
    chain: chains_1.baseSepolia,
    transport: (0, viem_1.http)(),
});
