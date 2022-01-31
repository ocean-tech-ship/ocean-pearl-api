import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Round } from '../../database/schemas/round.schema';
import { LeaderboardFilterQuery } from '../models/leaderboard-filter-query.model';
import { Leaderboard } from '../models/leaderboard.model';
import { GenerateLeaderboardService } from '../services/generate-leaderboard.service';
import { GenerateLegacyLeaderboardService } from '../services/generate-legacy-leaderboard.service';
import { GetCurrentRoundService } from '../services/get-current-round.service';

@ApiTags('rounds')
@Controller('leaderboard')
export class LeaderboardController {
    constructor(
        private generateLeaderboardService: GenerateLeaderboardService,
        private generateLegacyLeaderboardService: GenerateLegacyLeaderboardService,
        private getCurrentRoundService: GetCurrentRoundService,
    ) {}

    @Get()
    @ApiOkResponse({
        type: Leaderboard,
        description: 'Leaderboard with an ordered list of proposals',
    })
    @UsePipes(new ValidationPipe({ transform: true }))
    public async calculateLeaderboard(
        @Query() query: LeaderboardFilterQuery,
    ): Promise<Leaderboard> {
        try {
            const currentRound: Round = await this.getCurrentRoundService.execute();

            if (currentRound.round > query.round) {
                return await this.generateLegacyLeaderboardService.execute(query.round);
            }

            return await this.generateLeaderboardService.execute(currentRound);
        } catch (error) {
            throw error;
        }
    }
}
