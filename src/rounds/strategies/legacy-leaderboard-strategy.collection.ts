import { Injectable } from '@nestjs/common';
import { leaderboardStrategyInterface } from '../interfaces/leaderboard-strategy.interface';
import { LeaderboardProposal } from '../models/leaderboard-proposal.model';
import { Leaderboard } from '../models/leaderboard.model';
import { LegacyEarmarkedProposalStrategy } from './legacy-earmarked-proposal.strategy';
import { LegacyGeneralProposalStrategy } from './legacy-general-proposal.strategy';

@Injectable()
export class LegacyLeaderboardStrategyCollection {
    constructor(
        private legacyEarmarkedProposalStrategy: LegacyEarmarkedProposalStrategy,
        private legacyGeneralProposalStrategy: LegacyGeneralProposalStrategy,
    ) {}

    public findMatchingStrategy(
        proposal: LeaderboardProposal,
        leaderboard: Leaderboard,
    ): leaderboardStrategyInterface {
        if (this.legacyEarmarkedProposalStrategy.canHandle(proposal, leaderboard)) {
            return this.legacyEarmarkedProposalStrategy;
        }

        return this.legacyGeneralProposalStrategy;
    }
}
