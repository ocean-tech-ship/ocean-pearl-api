import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../../app.module';
import { BinanceSmartChainStrategy } from '../../../strategies/binance-smart-chain.strategy';
import { WalletUtilsModule } from '../../../wallet-utils.module';

describe('WalletInfoStrategyCollection', () => {
    let module: TestingModule;
    let service: BinanceSmartChainStrategy;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [AppModule, WalletUtilsModule],
        }).compile();

        service = module.get<BinanceSmartChainStrategy>(BinanceSmartChainStrategy);
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
