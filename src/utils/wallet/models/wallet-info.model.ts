import { CryptoAddress } from '../../../database/schemas/crypto-address.schema';

export class WalletInfo {
    public balance: number = 0;
    public address: CryptoAddress;
    
    constructor(attributes: Partial<WalletInfo> = {}) {
        for (let key in attributes) {
            this[key] = attributes[key];
        }
    }
}