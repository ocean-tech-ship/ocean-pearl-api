import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { RoundsModule } from '../../../rounds.module';
import { GenerateLeaderboardService } from '../../../services/generate-leaderboard.service';

describe('GenerateLeaderboardService', () => {
    let module: TestingModule;
    let service: GenerateLeaderboardService;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [RoundsModule, AppModule, DatabaseModule],
            providers: [GenerateLeaderboardService],
        }).compile();

        service = module.get<GenerateLeaderboardService>(
            GenerateLeaderboardService,
        );
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
