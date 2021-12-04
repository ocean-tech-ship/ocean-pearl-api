import { Injectable } from '@nestjs/common';
import {
    leaderboardStrategyInterface,
    LeaderboardStrategyResponse
} from '../interfaces/leaderboard-strategy.interface';
import { LeaderboardProposal } from '../models/leaderboard-proposal.model';
import { Leaderboard } from '../models/leaderboard.model';

@Injectable()
export class GeneralPropsoalStrategy implements leaderboardStrategyInterface {
    public canHandle(
        proposal: LeaderboardProposal,
        leaderboard: Leaderboard,
    ): boolean {
        return (
            leaderboard.remainingGeneralFunding > 0 &&
            proposal.effectiveVotes > 0 &&
            proposal.yesVotes > proposal.noVotes
        );
    }

    public execute(
        proposal: LeaderboardProposal,
        leaderboard: Leaderboard,
        lowestEarmarkVotes: number,
        lowestGeneralVotes: number,
    ): LeaderboardStrategyResponse {
        const proposalMaxVotes: number =
            proposal.yesVotes > proposal.noVotes
                ? proposal.yesVotes
                : proposal.noVotes;
        leaderboard.maxVotes =
            leaderboard.maxVotes > proposalMaxVotes
                ? leaderboard.maxVotes
                : proposalMaxVotes;

        const receivingGeneralFunding: number =
            leaderboard.remainingGeneralFunding - proposal.requestedFunding > 0
                ? proposal.requestedFunding
                : leaderboard.remainingGeneralFunding;

        proposal.receivedFunding = receivingGeneralFunding;
        leaderboard.remainingGeneralFunding -= receivingGeneralFunding;

        lowestGeneralVotes = proposal.effectiveVotes;
        leaderboard.fundedProposals.push(proposal);

        return { leaderboard, lowestEarmarkVotes, lowestGeneralVotes };
    }
}
