import { Injectable } from '@nestjs/common';
import { EarmarkTypeEnum } from '../../database/enums/earmark-type.enum';
import { leaderboardStrategyInterface } from '../interfaces/leaderboard-strategy.interface';
import { LeaderboardProposal } from '../models/leaderboard-proposal.model';
import { Leaderboard } from '../models/leaderboard.model';
import { CalculateNeededVotesService } from '../services/calculate-needed-votes.service';

@Injectable()
export class GeneralPropsoalStrategy implements leaderboardStrategyInterface {
    constructor(private calculateNeededVotesService: CalculateNeededVotesService) {}

    public canHandle(proposal: LeaderboardProposal, leaderboard: Leaderboard): boolean {
        return (
            leaderboard.grantPools[EarmarkTypeEnum.General].remainingFunding > 0 &&
            proposal.effectiveVotes > 0 &&
            proposal.yesVotes > proposal.noVotes
        );
    }

    public execute(proposal: LeaderboardProposal, leaderboard: Leaderboard): Leaderboard {
        const proposalMaxVotes: number =
            proposal.yesVotes > proposal.noVotes ? proposal.yesVotes : proposal.noVotes;
        leaderboard.maxVotes =
            leaderboard.maxVotes > proposalMaxVotes ? leaderboard.maxVotes : proposalMaxVotes;

        const willBeFullyFunded: boolean =
            leaderboard.grantPools[EarmarkTypeEnum.General].remainingFunding -
                proposal.requestedFunding >=
            0;
        const receivingGeneralFunding: number = willBeFullyFunded
            ? proposal.requestedFunding
            : leaderboard.grantPools[EarmarkTypeEnum.General].remainingFunding;

        if (receivingGeneralFunding > 0) {
            proposal.receivedFunding += receivingGeneralFunding;
            proposal.grantPoolShare[EarmarkTypeEnum.General] = receivingGeneralFunding;

            leaderboard.grantPools[EarmarkTypeEnum.General].remainingFunding -=
                receivingGeneralFunding;
        }

        if (willBeFullyFunded) {
            leaderboard.fundedProposals = this.insertInOrder(proposal, leaderboard.fundedProposals);
        } else {
            proposal.neededVotes = this.calculateNeededVotesService.execute(proposal, leaderboard);

            leaderboard.partiallyFundedProposals = this.insertInOrder(
                proposal,
                leaderboard.partiallyFundedProposals,
            );
        }

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
