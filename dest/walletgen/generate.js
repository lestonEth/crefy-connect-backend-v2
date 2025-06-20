"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAddress = exports.WalletGenerationError = void 0;
const accounts_1 = require("viem/accounts");
class WalletGenerationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'WalletGenerationError';
    }
}
exports.WalletGenerationError = WalletGenerationError;
const generateAddress = () => {
    try {
        const mnemonic = (0, accounts_1.generateMnemonic)(accounts_1.english, 128);
        const account = (0, accounts_1.mnemonicToAccount)(mnemonic);
        const hdKey = account.getHdKey();
        const derivedKey = hdKey.derive("m/44'/60'/0'/0/0");
        const privateKeyBuffer = derivedKey.privateKey;
        if (!privateKeyBuffer || privateKeyBuffer.length !== 32) {
            throw new WalletGenerationError("Failed to generate a valid private key.");
        }
        const privateKey = `0x${Buffer.from(privateKeyBuffer).toString('hex')}`;
        const address = account.address;
        const publicKey = account.publicKey;
        if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
            throw new WalletGenerationError("Generated address is invalid.");
        }
        return {
            address,
            privateKey,
            mnemonic,
            publicKey
        };
    }
    catch (err) {
        console.error("Wallet generation failed:", err);
        const message = err instanceof Error ? err.message : "Unknown error occurred";
        throw new WalletGenerationError(message);
    }
};
exports.generateAddress = generateAddress;
