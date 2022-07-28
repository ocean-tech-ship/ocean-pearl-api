import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../../app.module';
import { WalletInfoService } from '../../../services/wallet-info.service';
import { WalletUtilsModule } from '../../../wallet-utils.module';

describe('WalletInfoStrategyCollection', () => {
    let module: TestingModule;
    let service: WalletInfoService;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [AppModule, WalletUtilsModule],
        }).compile();

        service = module.get<WalletInfoService>(WalletInfoService);
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
