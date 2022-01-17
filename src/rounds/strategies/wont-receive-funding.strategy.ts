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

        leaderboard.notFundedProposals = this.insertInOrder(
            proposal,
            leaderboard.notFundedProposals,
        );
        return leaderboard;
    }

    private insertInOrder(
        proposal: LeaderboardProposal,
        proposalList: LeaderboardProposal[],
    ): LeaderboardProposal[] {
        if (proposalList.length === 0) {
            proposalList.push(proposal);
            return proposalList;
        }

        for (const [index, listProposal] of proposalList.entries()) {
            if (index === proposalList.length - 1) {
                listProposal.effectiveVotes > proposal.effectiveVotes
                    ? proposalList.splice(index + 1, 0, proposal)
                    : proposalList.splice(index, 0, proposal);
                break;
            }

            if (
                listProposal.effectiveVotes > proposal.effectiveVotes &&
                proposalList[index + 1].effectiveVotes <= proposal.effectiveVotes
            ) {
                proposalList.splice(index + 1, 0, proposal);
                break;
            }
        }

        return proposalList;
    }
}
