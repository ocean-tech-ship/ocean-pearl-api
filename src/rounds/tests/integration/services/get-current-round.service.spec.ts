import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { RoundsModule } from '../../../rounds.module';
import { GetCurrentRoundService } from '../../../services/get-current-round.service';

describe('GetCurrentRoundService', () => {
    let module: TestingModule;
    let service: GetCurrentRoundService;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [RoundsModule, AppModule, DatabaseModule],
            providers: [GetCurrentRoundService],
        }).compile();

        service = module.get<GetCurrentRoundService>(GetCurrentRoundService);
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
