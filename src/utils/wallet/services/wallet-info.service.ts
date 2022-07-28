import { Injectable } from '@nestjs/common';
import { CryptoAddress } from '../../../database/schemas/crypto-address.schema';
import { WalletInfo } from '../models/wallet-info.model';
import { WalletInfoStrategyCollection } from '../strategies/wallet-info-strategy.collection';

@Injectable()
export class WalletInfoService {
    public constructor(private walletInfoStrategyCollection: WalletInfoStrategyCollection) {}

    public async getMaxBalanceFromAddress(address: string): Promise<number> {
        let balance: number = 0;

        for (const strategy of this.walletInfoStrategyCollection.getStrategies()) {
            balance = Math.max(balance, await strategy.getBalance(address));
        }

        return balance;
    }

    public async getMaxBalanceFromObject(address: CryptoAddress): Promise<number> {
        return await this.getMaxBalanceFromObject(address);
    }

    public async getCompleteInfo(address: string): Promise<WalletInfo> {
        let completeWalletInfo: WalletInfo = new WalletInfo({
            address: new CryptoAddress({ address: address }),
        })

        for (const strategy of this.walletInfoStrategyCollection.getStrategies()) {
            let balanceOnChain = await strategy.getBalance(address);
            if (completeWalletInfo.balance < balanceOnChain) {
                completeWalletInfo.balance = balanceOnChain;
                completeWalletInfo.address.network = strategy.network;
            }
        }

        return completeWalletInfo;
    }
}
