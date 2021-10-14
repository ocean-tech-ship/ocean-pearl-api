import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { LeaderboardProposal } from '../../../models/leaderboard-proposal.model';
import { Leaderboard } from '../../../models/leaderboard.model';
import { WontReceiveFundingStrategy } from '../../../strategies/wont-receive-funding.strategy';

describe('WontReceiveFundingStrategy', () => {
    let module: TestingModule;
    let service: WontReceiveFundingStrategy;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        service = module.get<WontReceiveFundingStrategy>(
            WontReceiveFundingStrategy,
        );
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
