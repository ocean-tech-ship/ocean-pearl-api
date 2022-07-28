import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../../app.module';
import { MainnetStrategy } from '../../../strategies/mainnet.strategy';
import { WalletUtilsModule } from '../../../wallet-utils.module';

describe('WalletInfoStrategyCollection', () => {
    let module: TestingModule;
    let service: MainnetStrategy;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [AppModule, WalletUtilsModule],
        }).compile();

        service = module.get<MainnetStrategy>(MainnetStrategy);
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
