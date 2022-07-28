import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../../app.module';
import { PolygonStrategy } from '../../../strategies/polygon.strategy';
import { WalletUtilsModule } from '../../../wallet-utils.module';

describe('WalletInfoStrategyCollection', () => {
    let module: TestingModule;
    let service: PolygonStrategy;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [AppModule, WalletUtilsModule],
        }).compile();

        service = module.get<PolygonStrategy>(PolygonStrategy);
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
