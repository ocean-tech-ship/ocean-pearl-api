export class WalletInfo {
    public balance = 0;
    public address: string;

    constructor(attributes: Partial<WalletInfo> = {}) {
        for (const key in attributes) {
            this[key] = attributes[key];
        }
    }
}
