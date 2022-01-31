import { Injectable } from '@nestjs/common';
import { EarmarkTypeEnum } from '../../database/enums/earmark-type.enum';
import { leaderboardStrategyInterface } from '../interfaces/leaderboard-strategy.interface';
import { LeaderboardProposal } from '../models/leaderboard-proposal.model';
import { Leaderboard } from '../models/leaderboard.model';
import { CalculateNeededVotesService } from '../services/calculate-needed-votes.service';

@Injectable()
export class EarmarkedProposalStrategy implements leaderboardStrategyInterface {
    constructor(private calculateNeededVotesService: CalculateNeededVotesService) {}

    public canHandle(proposal: LeaderboardProposal, leaderboard: Leaderboard): boolean {
        if (
            !proposal.isEarmarked ||
            proposal.yesVotes <= proposal.noVotes ||
            proposal.effectiveVotes <= 0
        ) {
            return false;
        }

        return (
            leaderboard.grantPools[proposal.earmarkType]?.remainingFunding > 0 ||
            leaderboard.grantPools[EarmarkTypeEnum.General].remainingFunding > 0
        );
    }

    public execute(proposal: LeaderboardProposal, leaderboard: Leaderboard): Leaderboard {
        leaderboard.maxVotes = 
            Math.max(leaderboard.maxVotes, proposal.yesVotes, proposal.noVotes);

        let remainingRequestedFunding: number =
            proposal.requestedFunding - proposal.receivedFunding;

        const proposalEarmark = proposal.earmarkType;
        const receivingEarmarkFunding: number = Math.min(
            remainingRequestedFunding,
            leaderboard.grantPools[proposalEarmark].remainingFunding,
        );

        if (receivingEarmarkFunding > 0) {
            remainingRequestedFunding -= receivingEarmarkFunding;
            proposal.addToGrantPoolShare(proposalEarmark, receivingEarmarkFunding);

            leaderboard.grantPools[proposalEarmark].remainingFunding -=
                receivingEarmarkFunding;
            leaderboard.grantPools[proposalEarmark].potentialRemainingFunding -=
                receivingEarmarkFunding;
        }

        if (remainingRequestedFunding > 0) {
            const receivingGeneralFunding: number = Math.min(
                remainingRequestedFunding,
                leaderboard.grantPools[EarmarkTypeEnum.General].remainingFunding,
            );

            if (receivingGeneralFunding > 0) {
                remainingRequestedFunding -= receivingGeneralFunding;
                proposal.addToGrantPoolShare(EarmarkTypeEnum.General, receivingGeneralFunding);

                leaderboard.grantPools[EarmarkTypeEnum.General].remainingFunding -=
                    receivingGeneralFunding;
            }
        }

        proposal.receivedFunding = proposal.requestedFunding - remainingRequestedFunding;

        if (remainingRequestedFunding === 0) {
            leaderboard.addToFundedProposals(proposal);
        } else {
            proposal.neededVotes = this.calculateNeededVotesService.execute(proposal, leaderboard);
            leaderboard.addToPartiallyFundedProposals(proposal);
        }

        return leaderboard;
    }
}
