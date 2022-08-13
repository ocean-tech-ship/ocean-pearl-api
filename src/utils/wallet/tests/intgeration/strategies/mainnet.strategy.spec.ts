import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../../app.module';
import { EthereumStrategy } from '../../../strategies/ethereum.strategy';
import { WalletUtilsModule } from '../../../wallet-utils.module';

describe('WalletInfoStrategyCollection', () => {
    let module: TestingModule;
    let service: EthereumStrategy;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [AppModule, WalletUtilsModule],
        }).compile();

        service = module.get<EthereumStrategy>(EthereumStrategy);
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
