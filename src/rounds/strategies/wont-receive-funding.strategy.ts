import { Injectable } from '@nestjs/common';
import { EarmarkTypeEnum } from '../../database/enums/earmark-type.enum';
import { leaderboardStrategyInterface } from '../interfaces/leaderboard-strategy.interface';
import { LeaderboardProposal } from '../models/leaderboard-proposal.model';
import { Leaderboard } from '../models/leaderboard.model';
import { CalculateNeededVotesService } from '../services/calculate-needed-votes.service';

@Injectable()
export class WontReceiveFundingStrategy implements leaderboardStrategyInterface {
    constructor(private calculateNeededVotesService: CalculateNeededVotesService) {}

    public canHandle(proposal: LeaderboardProposal, leaderboard: Leaderboard): boolean {
        return (
            proposal.effectiveVotes <= 0 ||
            proposal.yesVotes < proposal.noVotes ||
            (proposal.isEarmarked &&
                leaderboard.grantPools[proposal.earmarkType]?.remainingFunding <= 0 &&
                leaderboard.grantPools[EarmarkTypeEnum.General].remainingFunding <= 0) ||
            (!proposal.isEarmarked &&
                leaderboard.grantPools[EarmarkTypeEnum.General].remainingFunding <= 0)
        );
    }

    public execute(proposal: LeaderboardProposal, leaderboard: Leaderboard): Leaderboard {
        proposal.neededVotes = this.calculateNeededVotesService.execute(proposal, leaderboard);

        if (proposal.receivedFunding > 0) {
            leaderboard.addToPartiallyFundedProposals(proposal);
        } else {
            leaderboard.addToNotFundedProposals(proposal);
        }

        return leaderboard;
    }
}
