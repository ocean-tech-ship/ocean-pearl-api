import { Module } from '@nestjs/common';
import { WalletInfoService } from './services/wallet-info.service';
import { BinanceSmartChainStrategy } from './strategies/binance-smart-chain.strategy';
import { MainnetStrategy } from './strategies/mainnet.strategy';
import { PolygonStrategy } from './strategies/polygon.strategy';
import { WalletInfoStrategyCollection } from './strategies/wallet-info-strategy.collection';

@Module({
    providers: [
        WalletInfoService,
        AddressFormatService,
        WalletInfoStrategyCollection,
        BinanceSmartChainStrategy,
        PolygonStrategy,
        MainnetStrategy,
    ],
    exports: [WalletInfoService, AddressFormatService],
})
export class WalletUtilsModule {}
