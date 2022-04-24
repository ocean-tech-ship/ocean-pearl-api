import { Injectable } from '@nestjs/common';
import { EarmarkTypeEnum } from '../../database/enums/earmark-type.enum';
import { leaderboardStrategyInterface } from '../interfaces/leaderboard-strategy.interface';
import { LeaderboardProposal } from '../models/leaderboard-proposal.model';
import { Leaderboard } from '../models/leaderboard.model';

@Injectable()
export class EarmarkedProposalStrategy implements leaderboardStrategyInterface {
    public canHandle(proposal: LeaderboardProposal): boolean {
        return proposal.isEarmarked;
    }

    public execute(proposal: LeaderboardProposal, leaderboard: Leaderboard): Leaderboard {
        leaderboard.maxVotes = Math.max(leaderboard.maxVotes, proposal.yesVotes, proposal.noVotes);

        let remainingRequestedFunding: number = proposal.requestedFunding;

        const proposalEarmark = proposal.earmarkType;
        const earmarkedFundingPerVote =
            leaderboard.grantPools[proposalEarmark].relevantFunding /
            leaderboard.grantPools[proposalEarmark].relevantEffectiveVotes;

        const potentialEamarkFunding: number = 
            leaderboard.grantPools[proposalEarmark].relevantEffectiveVotes === proposal.effectiveVotes
            ? leaderboard.grantPools[proposalEarmark].relevantFunding
            : earmarkedFundingPerVote * proposal.effectiveVotes;

        const receivingEarmarkFunding: number = Math.min(
                remainingRequestedFunding,
                potentialEamarkFunding,
            );

        remainingRequestedFunding -= receivingEarmarkFunding;
        proposal.addToGrantPoolShare(proposalEarmark, receivingEarmarkFunding);

        leaderboard.grantPools[proposalEarmark].remainingFunding -= receivingEarmarkFunding;
        leaderboard.grantPools[proposalEarmark].potentialRemainingFunding -=
            receivingEarmarkFunding;

        if (remainingRequestedFunding > 0) {
            const generalFundingPerVote =
                leaderboard.grantPools[EarmarkTypeEnum.General].relevantFunding /
                leaderboard.grantPools[EarmarkTypeEnum.General].relevantEffectiveVotes;

            const potentialGeneralFunding: number = 
                leaderboard.grantPools[EarmarkTypeEnum.General].relevantEffectiveVotes === proposal.effectiveVotes
                ? leaderboard.grantPools[EarmarkTypeEnum.General].relevantFunding
                : generalFundingPerVote * proposal.effectiveVotes;
            
            const receivingGeneralFunding: number = Math.min(
                remainingRequestedFunding,
                potentialGeneralFunding,
            );

            remainingRequestedFunding -= receivingGeneralFunding;
            proposal.addToGrantPoolShare(EarmarkTypeEnum.General, receivingGeneralFunding);

            leaderboard.grantPools[EarmarkTypeEnum.General].remainingFunding = Math.max(
                leaderboard.grantPools[EarmarkTypeEnum.General].remainingFunding -
                    receivingGeneralFunding,
                0,
            );
        }

        proposal.receivedFunding = proposal.requestedFunding - remainingRequestedFunding;

        if (remainingRequestedFunding === 0) {
            leaderboard.addToFundedProposals(proposal);
        } else {
            leaderboard.addToPartiallyFundedProposals(proposal);
        }

        for (const grantPool of [EarmarkTypeEnum.General, proposalEarmark]) {
            leaderboard.grantPools[grantPool].relevantFunding -= proposal.grantPoolShare[grantPool] ?? 0;
            leaderboard.grantPools[grantPool].relevantEffectiveVotes -= proposal.effectiveVotes;
        }

        return leaderboard;
    }
}
