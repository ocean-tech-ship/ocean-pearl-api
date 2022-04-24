import { Injectable } from '@nestjs/common';
import { EarmarkTypeEnum } from '../../database/enums/earmark-type.enum';
import { leaderboardStrategyInterface } from '../interfaces/leaderboard-strategy.interface';
import { LeaderboardProposal } from '../models/leaderboard-proposal.model';
import { Leaderboard } from '../models/leaderboard.model';

@Injectable()
export class GeneralProposalStrategy implements leaderboardStrategyInterface {
    public canHandle(proposal: LeaderboardProposal): boolean {
        return !proposal.isEarmarked;
    }

    public execute(proposal: LeaderboardProposal, leaderboard: Leaderboard): Leaderboard {
        leaderboard.maxVotes = Math.max(leaderboard.maxVotes, proposal.yesVotes, proposal.noVotes);

        let remainingRequestedFunding: number = proposal.requestedFunding;

        const generalFundingPerVote =
            leaderboard.grantPools[EarmarkTypeEnum.General].relevantFunding /
            leaderboard.grantPools[EarmarkTypeEnum.General].relevantEffectiveVotes;

        const potentialGeneralFunding: number =
            leaderboard.grantPools[EarmarkTypeEnum.General].relevantEffectiveVotes ===
            proposal.effectiveVotes
                ? leaderboard.grantPools[EarmarkTypeEnum.General].relevantFunding
                : generalFundingPerVote * proposal.effectiveVotes;

        const receivingGeneralFunding: number = Math.min(
            remainingRequestedFunding,
            potentialGeneralFunding,
        );

        proposal.addToGrantPoolShare(EarmarkTypeEnum.General, receivingGeneralFunding);
        leaderboard.grantPools[EarmarkTypeEnum.General].remainingFunding = Math.max(
            leaderboard.grantPools[EarmarkTypeEnum.General].remainingFunding -
                receivingGeneralFunding,
            0,
        );
        proposal.receivedFunding = receivingGeneralFunding;

        if (proposal.requestedFunding === proposal.receivedFunding) {
            leaderboard.addToFundedProposals(proposal);
        } else {
            leaderboard.addToPartiallyFundedProposals(proposal);
        }

        leaderboard.grantPools[EarmarkTypeEnum.General].relevantFunding -=
            proposal.grantPoolShare[EarmarkTypeEnum.General];
        leaderboard.grantPools[EarmarkTypeEnum.General].relevantEffectiveVotes -=
            proposal.effectiveVotes;

        return leaderboard;
    }
}
