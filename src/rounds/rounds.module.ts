import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { LeaderboardController } from './controller/leaderboard.controller';
import { LeaderboardProposalMapper } from './mapper/leaderboard-proposal.mapper';
import { GenerateLeaderboardService } from './services/generate-leaderboard.service';
import { GetCurrentRoundService } from './services/get-current-round.service';

@Module({
    controllers: [LeaderboardController],
    imports: [DatabaseModule],
    providers: [
        GetCurrentRoundService,
        GenerateLeaderboardService,
        LeaderboardProposalMapper,
    ],
    exports: [GetCurrentRoundService],
})
export class RoundsModule {}
