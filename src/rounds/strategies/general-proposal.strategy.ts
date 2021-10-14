import { Injectable } from '@nestjs/common';
import {
    leaderboardStrategyInterface,
    LeaderboardStrategyResponse,
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
            leaderboard.remainingGeneralFundingUsd > 0 &&
            proposal.effectiveVotes > 0
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
        leaderboard.remainingGeneralFundingUsd - proposal.requestedFunding > 0
            ? proposal.requestedFunding
            : leaderboard.remainingEarmarkFundingUsd;

        proposal.receivedFunding = receivingGeneralFunding;
        leaderboard.remainingGeneralFundingUsd -= receivingGeneralFunding;

        lowestGeneralVotes = proposal.effectiveVotes;
        leaderboard.fundedProposals.push(proposal);

        return { leaderboard, lowestEarmarkVotes, lowestGeneralVotes };
    }
}
