import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOkResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
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
        description: 'Leaderboard with an ordered list of proposals',
        schema: {
            properties: {
                leaderboard: {
                    type: 'object',
                    $ref: getSchemaPath(Leaderboard),
                },
                currentRound: {
                    type: 'number'
                },
            },
        },
    })
    @UsePipes(new ValidationPipe({ transform: true }))
    public async calculateLeaderboard(
        @Query() query: LeaderboardFilterQuery,
    ): Promise<{leaderboard: Leaderboard,
                currentRound: number}> {
        try {
            const currentRound: Round = await this.getCurrentRoundService.execute();

            if (currentRound.round > query.round) {
                return {
                    leaderboard: await this.generateLegacyLeaderboardService.execute(query.round),
                    currentRound: currentRound.round
                }
            }

            return {
                leaderboard: await this.generateLeaderboardService.execute(currentRound),
                currentRound: currentRound.round
            };
        } catch (error) {
            throw error;
        }
    }
}
