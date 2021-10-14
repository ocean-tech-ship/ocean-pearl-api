import { Injectable } from '@nestjs/common';
import {
    leaderboardStrategyInterface,
    LeaderboardStrategyResponse
} from '../interfaces/leaderboard-strategy.interface';
import { LeaderboardProposal } from '../models/leaderboard-proposal.model';
import { Leaderboard } from '../models/leaderboard.model';

@Injectable()
export class WontReceiveFundingStrategy
    implements leaderboardStrategyInterface {
    public canHandle(
        proposal: LeaderboardProposal,
        leaderboard: Leaderboard,
    ): boolean {
        return proposal.effectiveVotes <= 0;
    }

    public execute(
        proposal: LeaderboardProposal,
        leaderboard: Leaderboard,
        lowestEarmarkVotes: number,
        lowestGeneralVotes: number,
    ): LeaderboardStrategyResponse {
        proposal.neededVotes = this.calculateNeededVotes(
            proposal,
            lowestEarmarkVotes,
            lowestGeneralVotes,
            leaderboard.remainingEarmarkFundingUsd,
            leaderboard.remainingGeneralFundingUsd,
        );

        leaderboard.notFundedProposals.push(proposal);
        return { leaderboard, lowestEarmarkVotes, lowestGeneralVotes };
    }

    private calculateNeededVotes(
        proposal: LeaderboardProposal,
        lowestEarmarkVotes: number,
        lowestGeneralVotes: number,
        remainingEarmarkedFundingUsd: number,
        remainingGeneralFundingUsd: number,
    ): number {
        if (proposal.isEarmarked) {
            if (
                remainingEarmarkedFundingUsd > 0 ||
                remainingGeneralFundingUsd > 0
            ) {
                return proposal.effectiveVotes * -1 + 1;
            }

            return lowestEarmarkVotes > lowestGeneralVotes
                ? lowestGeneralVotes - proposal.effectiveVotes
                : lowestEarmarkVotes - proposal.effectiveVotes;
        }

        if (remainingGeneralFundingUsd > 0) {
            return proposal.effectiveVotes * -1 + 1;
        }

        return lowestGeneralVotes - proposal.effectiveVotes;
    }
}
