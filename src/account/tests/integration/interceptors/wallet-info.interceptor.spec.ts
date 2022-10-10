import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { WalletUtilsModule } from '../../../../utils/wallet/wallet-utils.module';
import { WalletInfoInterceptor } from '../../../interceptors/wallet-info.interceptor';

describe('WalletInfoInterceptor', () => {
    let module: TestingModule;
    let service: WalletInfoInterceptor;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [DatabaseModule, AppModule, WalletUtilsModule],
        }).compile();

        service = module.get<WalletInfoInterceptor>(WalletInfoInterceptor);
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
