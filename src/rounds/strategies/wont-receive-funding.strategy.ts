import { Injectable } from '@nestjs/common';
import {
    leaderboardStrategyInterface,
    LeaderboardStrategyResponse,
} from '../interfaces/leaderboard-strategy.interface';
import { LeaderboardProposal } from '../models/leaderboard-proposal.model';
import { Leaderboard } from '../models/leaderboard.model';

@Injectable()
export class WontReceiveFundingStrategy
    implements leaderboardStrategyInterface
{
    public canHandle(
        proposal: LeaderboardProposal,
        leaderboard: Leaderboard,
    ): boolean {
        return (
            proposal.effectiveVotes <= 0 ||
            proposal.yesVotes < proposal.noVotes ||
            (proposal.isEarmarked &&
                leaderboard.earmarks[proposal.earmarkType]?.remainingFunding <=
                    0 &&
                leaderboard.remainingGeneralFunding <= 0) ||
            (!proposal.isEarmarked && leaderboard.remainingGeneralFunding <= 0)
        );
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
            leaderboard.earmarks[proposal.earmarkType]?.remainingFunding,
            leaderboard.remainingGeneralFunding,
        );

        leaderboard.notFundedProposals.push(proposal);
        return { leaderboard, lowestEarmarkVotes, lowestGeneralVotes };
    }

    private calculateNeededVotes(
        proposal: LeaderboardProposal,
        lowestEarmarkVotes: number,
        lowestGeneralVotes: number,
        remainingEarmarkedFunding: number,
        remainingGeneralFunding: number,
    ): number {
        if (proposal.isEarmarked) {
            if (remainingEarmarkedFunding > 0 || remainingGeneralFunding > 0) {
                return proposal.effectiveVotes * -1 + 1;
            }

            return lowestEarmarkVotes > lowestGeneralVotes
                ? lowestGeneralVotes - proposal.effectiveVotes + 1
                : lowestEarmarkVotes - proposal.effectiveVotes + 1;
        }

        if (remainingGeneralFunding > 0) {
            return proposal.effectiveVotes * -1 + 1;
        }

        return lowestGeneralVotes - proposal.effectiveVotes + 1;
    }
}
