export interface SupportedAssetsResponse {
    networks: string[];
    fiat: string[];
    crypto: {
        [network: string]: {
            symbol: string;
            name: string;
            decimals: number;
            address: string;
        }[];
    };
}

export interface QuoteResponse {
    statusCode: number;
    message: string;
    data: {
        inputAmount: string;
        outputAmount: number;
        inputCurrency: string;
        outputCurrency: string;
        exchangeRate: number;
        type: 'onramp' | 'offramp';
        network: string;
        fee: {
            amount: number;
            currency: string;
            details: {
                feeInKES: number;
                estimatedOutputKES: number;
            };
        };
    };
}

export interface TransactionResponse {
    status: string;
    message: string;
    data?: any;
    hash?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface StatusResponse {
    status: string;
    message: string;
    orderID?: string;
    details?: {
        phoneNumber?: string;
        mpesaReceipt?: string;
        transactionDate?: string;
        resultDescription?: string;
        ReceiverPartyPublicName?: string;
        transactionSize?: string;
        transactionSide?: string;
        initiatedAt?: string;
        completedAt?: string;
    };
}

export interface TicketResponse {
    status: string;
    data: {
        refund: {
            PhoneNumber: string;
            Amount: string;
            Description: string;
            Side: string;
            userAddress: string;
            symbol: string;
            tokenAddress: string;
            chain: string;
            _id: string;
            createdAt: string;
        };
    };
}

export interface OnRampStatusDto {
    orderID: string;
    status: 'SUCCESS' | 'FAILED' | 'PENDING';
    message: string;
    details: {
        phoneNumber: string;
        mpesaReceipt: string;
        transactionDate: string;
        resultDescription: string;
    };
}

export class GetQuoteDto {
    type!: 'onramp' | 'offramp';
    amount!: string;
    fiatCurrency!: string;
    cryptoCurrency!: string;
    network!: string;
    category?: string;
}

export class OnRampDto {
    partyA!: string;
    amount!: string;
    side!: 'onramp';
    userAddress!: string;
    tokenAddress!: string;
}

export class OffRampDto {
    chain!: string;
    hash!: string;
    partyB!: string;
    tokenAddress!: string;
}

export class DepositDto {
    chain!: string;
    address!: string;
    orderID!: string;
    project!: 'onramp';
}

export class OffRampStatusDto {
    orderID!: string;
}

export class OnRampStatusDto {
    orderID!: string;
}

export class CreateOffRampTicketDto {
    orderID?: string;
    description!: string;
    symbol?: string;
    chain?: string;
    phone?: string;
    amount?: string;
    side?: string;
    userAddress?: string;
    tokenAddress?: string;
}

export class CreateOnRampTicketDto {
    orderID?: string;
    description!: string;
    symbol?: string;
    chain?: string;
}
