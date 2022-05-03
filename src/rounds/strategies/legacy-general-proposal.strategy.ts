import { Injectable } from '@nestjs/common';
import { EarmarkTypeEnum } from '../../database/enums/earmark-type.enum';
import { leaderboardStrategyInterface } from '../interfaces/leaderboard-strategy.interface';
import { LeaderboardProposal } from '../models/leaderboard-proposal.model';
import { Leaderboard } from '../models/leaderboard.model';

@Injectable()
export class LegacyGeneralProposalStrategy implements leaderboardStrategyInterface {
    public canHandle(proposal: LeaderboardProposal): boolean {
        return !proposal.isEarmarked;
    }

    public execute(proposal: LeaderboardProposal, leaderboard: Leaderboard): Leaderboard {
        if (proposal.receivedFunding === 0) {
            leaderboard.addToNotFundedProposals(proposal);

            return leaderboard;
        }

        leaderboard.maxVotes = Math.max(leaderboard.maxVotes, proposal.yesVotes, proposal.noVotes);

        let receivedFunding: number = proposal.receivedFunding;

        if (receivedFunding > 0) {
            proposal.addToGrantPoolShare(EarmarkTypeEnum.General, receivedFunding);

            leaderboard.grantPools[EarmarkTypeEnum.General].remainingFunding -=
            receivedFunding;
        }

        if (proposal.receivedFunding === proposal.requestedFunding) {
            leaderboard.addToFundedProposals(proposal);
        } else {
            leaderboard.addToPartiallyFundedProposals(proposal);
        }

        return leaderboard;
    }
}
