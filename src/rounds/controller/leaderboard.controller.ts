import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Leaderboard } from '../models/leaderboard.model';
import { GenerateLeaderboardService } from '../services/generate-leaderboard.service';

@ApiTags('rounds')
@Controller('leaderboard')
export class LeaderboardController {
    constructor(
        private generateLeaderboardService: GenerateLeaderboardService
    ) {}

    @Get()
    @ApiOkResponse({
        type: Leaderboard,
        description: 'Leaderboard with an ordered list of proposals'
    })
    public async calculateLeaderboard(): Promise<Leaderboard> {
        try {
            return await this.generateLeaderboardService.execute();
        } catch (error) {
            throw error;
        }
    }
}