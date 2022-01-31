import { Injectable } from '@nestjs/common';
import { leaderboardStrategyInterface } from '../interfaces/leaderboard-strategy.interface';
import { LeaderboardProposal } from '../models/leaderboard-proposal.model';
import { Leaderboard } from '../models/leaderboard.model';
import { EarmarkedProposalStrategy } from './earmarked-proposal.strategy';
import { GeneralProposalStrategy } from './general-proposal.strategy';
import { WontReceiveFundingStrategy } from './wont-receive-funding.strategy';

@Injectable()
export class LeaderboardStrategyCollection {
    private strategies: leaderboardStrategyInterface[];

    constructor(
        private earmarkedProposalStrategy: EarmarkedProposalStrategy,
        private generalProposalStrategy: GeneralProposalStrategy,
        private wontReceiveFundingStrategy: WontReceiveFundingStrategy,
    ) {
        this.strategies = [
            this.earmarkedProposalStrategy,
            this.generalProposalStrategy,
        ];
    }

    public findMatchingStrategy(
        proposal: LeaderboardProposal,
        leaderboard: Leaderboard,
    ): leaderboardStrategyInterface {
        for (const strategy of this.strategies) {
            if (strategy.canHandle(proposal, leaderboard)) {
                return strategy;
            }
        }

        return this.wontReceiveFundingStrategy;
    }
}
