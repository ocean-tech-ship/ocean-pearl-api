import { Injectable } from '@nestjs/common';
import { CryptoAddress } from '../../../database/schemas/crypto-address.schema';
import { WalletInfoStrategy } from '../interfaces/wallet-info-strategy.interface';
import { BinanceSmartChainStrategy } from './binance-smart-chain.strategy';
import { MainnetStrategy } from './mainnet.strategy';
import { PolygonStrategy } from './polygon.strategy';

@Injectable()
export class WalletInfoStrategyCollection {
    private readonly strategies: WalletInfoStrategy[];

    public constructor(
        private binanceSmartChainStrategy: BinanceSmartChainStrategy,
        private mainnetStrategy: MainnetStrategy,
        private polygonStrategy: PolygonStrategy
    ) {
        this.strategies = [
            this.binanceSmartChainStrategy,
            this.mainnetStrategy,
            this.polygonStrategy
        ]
    }

    public getStrategy(address: CryptoAddress): WalletInfoStrategy {
        for (const strategy of this.strategies) {
            if (strategy.canHandle(address)) {
                return strategy;
            }
        }
    }

    public getStrategies(): WalletInfoStrategy[] {
        return this.strategies;
    }
}