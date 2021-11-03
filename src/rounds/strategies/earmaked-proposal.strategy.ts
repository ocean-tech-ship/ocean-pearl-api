import { Injectable } from '@nestjs/common';
import {
    leaderboardStrategyInterface,
    LeaderboardStrategyResponse,
} from '../interfaces/leaderboard-strategy.interface';
import { LeaderboardProposal } from '../models/leaderboard-proposal.model';
import { Leaderboard } from '../models/leaderboard.model';

@Injectable()
export class EarmarkedPropsoalStrategy implements leaderboardStrategyInterface {
    public canHandle(
        proposal: LeaderboardProposal,
        leaderboard: Leaderboard,
    ): boolean {
        return (
            proposal.isEarmarked &&
            proposal.yesVotes > proposal.noVotes &&
            proposal.effectiveVotes > 0 &&
            (leaderboard.remainingEarmarkFunding > 0 ||
                leaderboard.remainingGeneralFunding > 0)
        );
    }

    public execute(
        proposal: LeaderboardProposal,
        leaderboard: Leaderboard,
        lowestEarmarkVotes: number,
        lowestGeneralVotes: number,
    ): LeaderboardStrategyResponse {
        const leaderboardProposalMaxVotes: number =
            proposal.yesVotes > proposal.noVotes
                ? proposal.yesVotes
                : proposal.noVotes;
        leaderboard.maxVotes =
            leaderboard.maxVotes > leaderboardProposalMaxVotes
                ? leaderboard.maxVotes
                : leaderboardProposalMaxVotes;

        const receivingEarmarkFunding: number =
            leaderboard.remainingEarmarkFunding - proposal.requestedFunding > 0
                ? proposal.requestedFunding
                : leaderboard.remainingEarmarkFunding;

        proposal.receivedFunding = receivingEarmarkFunding;
        leaderboard.remainingEarmarkFunding -= receivingEarmarkFunding;

        if (proposal.receivedFunding < proposal.requestedFunding) {
            const remainigRequestedFunding: number =
                proposal.requestedFunding - proposal.receivedFunding;
            const receivingGeneralFunding: number =
                leaderboard.remainingGeneralFunding - remainigRequestedFunding > 0
                    ? remainigRequestedFunding
                    : leaderboard.remainingGeneralFunding;

            proposal.receivedFunding += receivingGeneralFunding;
            leaderboard.remainingGeneralFunding -= receivingGeneralFunding;
        }

        lowestEarmarkVotes = proposal.effectiveVotes;
        leaderboard.fundedProposals.push(proposal);

        return { leaderboard, lowestEarmarkVotes, lowestGeneralVotes };
    }
}