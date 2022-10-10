import { Injectable } from '@nestjs/common';
import { WalletInfoStrategy } from '../interfaces/wallet-info-strategy.interface';
import { ChainedAddress } from '../models/chained-address.model';
import { BscStrategy } from './bsc.strategy';
import { EthereumStrategy } from './ethereum.strategy';
import { PolygonStrategy } from './polygon.strategy';

@Injectable()
export class WalletInfoStrategyCollection {
    private readonly strategies: WalletInfoStrategy[];

    public constructor(
        private bscStrategy: BscStrategy,
        private ethereumStrategy: EthereumStrategy,
        private polygonStrategy: PolygonStrategy,
    ) {
        this.strategies = [this.bscStrategy, this.ethereumStrategy, this.polygonStrategy];
    }

    public getStrategy(chainedAddress: ChainedAddress): WalletInfoStrategy {
        for (const strategy of this.strategies) {
            if (strategy.canHandle(chainedAddress)) {
                return strategy;
            }
        }
    }

    public getStrategies(): WalletInfoStrategy[] {
        return this.strategies;
    }
}
