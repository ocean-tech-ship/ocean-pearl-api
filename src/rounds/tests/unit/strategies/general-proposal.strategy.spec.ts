import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { LeaderboardProposal } from '../../../models/leaderboard-proposal.model';
import { Leaderboard } from '../../../models/leaderboard.model';
import { GeneralPropsoalStrategy } from '../../../strategies/general-proposal.strategy';

describe('GeneralPropsoalStrategy', () => {
    let module: TestingModule;
    let service: GeneralPropsoalStrategy;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        service = module.get<GeneralPropsoalStrategy>(GeneralPropsoalStrategy);
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
