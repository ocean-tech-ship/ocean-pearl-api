import { Injectable } from '@nestjs/common';
import { EarmarkTypeEnum } from '../../database/enums/earmark-type.enum';
import { leaderboardStrategyInterface } from '../interfaces/leaderboard-strategy.interface';
import { LeaderboardProposal } from '../models/leaderboard-proposal.model';
import { Leaderboard } from '../models/leaderboard.model';
import { CalculateNeededVotesService } from '../services/calculate-needed-votes.service';

@Injectable()
export class GeneralProposalStrategy implements leaderboardStrategyInterface {
    constructor(private calculateNeededVotesService: CalculateNeededVotesService) {}

    public canHandle(proposal: LeaderboardProposal, leaderboard: Leaderboard): boolean {
        return (
            leaderboard.grantPools[EarmarkTypeEnum.General].remainingFunding > 0 &&
            proposal.effectiveVotes > 0 &&
            proposal.yesVotes > proposal.noVotes
        );
    }

    public execute(proposal: LeaderboardProposal, leaderboard: Leaderboard): Leaderboard {
        leaderboard.maxVotes = Math.max(leaderboard.maxVotes, proposal.yesVotes, proposal.noVotes);

        let remainingRequestedFunding: number =
            proposal.requestedFunding - proposal.receivedFunding;

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
