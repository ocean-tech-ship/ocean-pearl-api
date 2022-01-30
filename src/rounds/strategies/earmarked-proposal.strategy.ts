import { Injectable } from '@nestjs/common';
import { EarmarkTypeEnum } from '../../database/enums/earmark-type.enum';
import { leaderboardStrategyInterface } from '../interfaces/leaderboard-strategy.interface';
import { LeaderboardProposal } from '../models/leaderboard-proposal.model';
import { Leaderboard } from '../models/leaderboard.model';
import { CalculateNeededVotesService } from '../services/calculate-needed-votes.service';

@Injectable()
export class EarmarkedPropsoalStrategy implements leaderboardStrategyInterface {
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
        const leaderboardProposalMaxVotes: number =
            proposal.yesVotes > proposal.noVotes ? proposal.yesVotes : proposal.noVotes;

        leaderboard.maxVotes =
            leaderboard.maxVotes > leaderboardProposalMaxVotes
                ? leaderboard.maxVotes
                : leaderboardProposalMaxVotes;

        const receivingEarmarkFunding: number =
            leaderboard.grantPools[proposal.earmarkType].remainingFunding -
                (proposal.requestedFunding - proposal.receivedFunding)  >
            0
                ? proposal.requestedFunding - proposal.receivedFunding
                : leaderboard.grantPools[proposal.earmarkType].remainingFunding;

        if (receivingEarmarkFunding > 0) {
            proposal.receivedFunding = receivingEarmarkFunding;
            proposal.grantPoolShare[proposal.earmarkType] = receivingEarmarkFunding;

            leaderboard.grantPools[proposal.earmarkType].remainingFunding -=
                receivingEarmarkFunding;
            leaderboard.grantPools[proposal.earmarkType].potentialRemainingFunding -=
                receivingEarmarkFunding;
        }

        if (proposal.receivedFunding < proposal.requestedFunding) {
            const remainigRequestedFunding: number =
                proposal.requestedFunding - proposal.receivedFunding;
            const receivingGeneralFunding: number =
                leaderboard.grantPools[EarmarkTypeEnum.General].remainingFunding -
                    remainigRequestedFunding >
                0
                    ? remainigRequestedFunding
                    : leaderboard.grantPools[EarmarkTypeEnum.General].remainingFunding;

            if (receivingGeneralFunding > 0) {
                proposal.receivedFunding += receivingGeneralFunding;
                proposal.grantPoolShare[EarmarkTypeEnum.General] = receivingGeneralFunding;

                leaderboard.grantPools[EarmarkTypeEnum.General].remainingFunding -=
                    receivingGeneralFunding;
            }
        }

        if (proposal.requestedFunding === proposal.receivedFunding) {
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
                listProposal.effectiveVotes >= proposal.effectiveVotes
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
