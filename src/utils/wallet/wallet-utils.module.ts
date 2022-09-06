import { Module } from '@nestjs/common';
import { WalletInfoService } from './services/wallet-info.service';
import { BscStrategy } from './strategies/bsc.strategy';
import { EthereumStrategy } from './strategies/ethereum.strategy';
import { PolygonStrategy } from './strategies/polygon.strategy';
import { WalletInfoStrategyCollection } from './strategies/wallet-info-strategy.collection';
import { AddressFormatService } from './services/address-format.service';

@Module({
    providers: [
        WalletInfoService,
        AddressFormatService,
        WalletInfoStrategyCollection,
        BscStrategy,
        PolygonStrategy,
        EthereumStrategy,
    ],
    exports: [WalletInfoService, AddressFormatService],
})
export class WalletUtilsModule {}
