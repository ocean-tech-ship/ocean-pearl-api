import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { RoundsModule } from '../../../rounds.module';
import { CalculateNeededVotesService } from '../../../services/calculate-needed-votes.service';

describe('CalculateNeededVotesService', () => {
    let module: TestingModule;
    let service: CalculateNeededVotesService;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [RoundsModule, AppModule],
        }).compile();

        service = module.get<CalculateNeededVotesService>(CalculateNeededVotesService);
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
