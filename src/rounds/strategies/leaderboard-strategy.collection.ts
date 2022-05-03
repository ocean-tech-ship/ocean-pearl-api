import { Injectable } from '@nestjs/common';
import { leaderboardStrategyInterface } from '../interfaces/leaderboard-strategy.interface';
import { LeaderboardProposal } from '../models/leaderboard-proposal.model';
import { EarmarkedProposalStrategy } from './earmarked-proposal.strategy';
import { GeneralProposalStrategy } from './general-proposal.strategy';

@Injectable()
export class LeaderboardStrategyCollection {
    constructor(
        private earmarkedProposalStrategy: EarmarkedProposalStrategy,
        private generalProposalStrategy: GeneralProposalStrategy,
    ) {}

    public findMatchingStrategy(proposal: LeaderboardProposal): leaderboardStrategyInterface {
        if (this.earmarkedProposalStrategy.canHandle(proposal)) {
            return this.earmarkedProposalStrategy;
        }

        return this.generalProposalStrategy; 
    }
}
