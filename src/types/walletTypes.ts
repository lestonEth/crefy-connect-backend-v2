export interface WalletInfo {
    address: string;
    privateKey: string;
    mnemonic: string;
    publicKey: string;
}

export interface CreateWalletRequest {
    crefyId: string;
}

export interface WalletResponse extends WalletInfo {
    id: string;
    userId: string;
    email: string;
    name: string;
    isActive: boolean;
    otp: string;
    otpExpiry: Date;
    createdAt: Date;
    updatedAt: Date;
}