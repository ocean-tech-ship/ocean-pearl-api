import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { RoundsModule } from '../../../rounds.module';
import { GetRoundsAmountService } from '../../../services/get-rounds-amount.service';

describe('GetRoundsAmountService', () => {
    let module: TestingModule;
    let service: GetRoundsAmountService;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [RoundsModule, AppModule, DatabaseModule],
            providers: [GetRoundsAmountService],
        }).compile();

        service = module.get<GetRoundsAmountService>(GetRoundsAmountService);
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
