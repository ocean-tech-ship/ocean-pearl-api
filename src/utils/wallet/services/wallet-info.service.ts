import { Injectable } from '@nestjs/common';
import { WalletInfo } from '../models/wallet-info.model';
import { WalletInfoStrategyCollection } from '../strategies/wallet-info-strategy.collection';

@Injectable()
export class WalletInfoService {
    public constructor(private walletInfoStrategyCollection: WalletInfoStrategyCollection) {}

    public async getMaxBalanceFromAddress(address: string): Promise<number> {
        let balance = 0;

        for (const strategy of this.walletInfoStrategyCollection.getStrategies()) {
            balance = Math.max(balance, await strategy.getBalance(address));
        }

        return balance;
    }

    public async getMaxBalanceFromObject(address: string): Promise<number> {
        return await this.getMaxBalanceFromObject(address);
    }

    public async getCompleteInfo(address: string): Promise<WalletInfo> {
        const completeWalletInfo: WalletInfo = new WalletInfo({
            address,
        });

        for (const strategy of this.walletInfoStrategyCollection.getStrategies()) {
            const balanceOnChain = await strategy.getBalance(address);
            if (completeWalletInfo.balance < balanceOnChain) {
                completeWalletInfo.balance = balanceOnChain;
            }
        }

        return completeWalletInfo;
    }
}
