import { Injectable } from '@nestjs/common';
import { EarmarkTypeEnum } from '../../database/enums/earmark-type.enum';
import { LeaderboardProposal, NeededVotes } from '../models/leaderboard-proposal.model';
import { GrantPool, Leaderboard } from '../models/leaderboard.model';

Injectable();
export class CalculateNeededVotesService {
    public execute(proposal: LeaderboardProposal, leaderboard: Leaderboard): NeededVotes {
        const earmarkedPool = leaderboard.grantPools[proposal.earmarkType];
        const generalPool = leaderboard.grantPools[EarmarkTypeEnum.General];
        const proposalsWithFunding = [
            ...leaderboard.fundedProposals,
            ...leaderboard.partiallyFundedProposals,
        ];

        proposalsWithFunding.sort(
            (current: LeaderboardProposal, next: LeaderboardProposal): number => {
                return next.effectiveVotes - current.effectiveVotes;
            },
        );

        if (proposal.isEarmarked) {
            return this.calculateNeededEarmarkedVotes(
                proposal,
                earmarkedPool,
                generalPool,
                proposalsWithFunding,
            );
        }

        return this.calculateNeededGeneralVotes(proposal, generalPool, proposalsWithFunding);
    }

    private calculateNeededEarmarkedVotes(
        proposal: LeaderboardProposal,
        earmarkedPool: GrantPool,
        generalPool: GrantPool,
        proposalsWithFunding: LeaderboardProposal[],
    ): NeededVotes {
        let fullyFunded: number;
        let partiallyFunded: number;

        let neededFunding = proposal.requestedFunding - proposal.receivedFunding;
        const potentialEarmarkFunding = earmarkedPool.potentialRemainingFunding;
        const potentialGeneralFunding = generalPool.remainingFunding - potentialEarmarkFunding;

        if (potentialEarmarkFunding > 0 || potentialGeneralFunding > 0) {
            if (
                potentialEarmarkFunding >= neededFunding ||
                potentialGeneralFunding >= neededFunding ||
                potentialEarmarkFunding + potentialGeneralFunding >= neededFunding
            ) {
                return {
                    fullyFunded: Math.abs(proposal.effectiveVotes) + 1,
                } as NeededVotes;
            }

            partiallyFunded = Math.abs(proposal.effectiveVotes) + 1;
            neededFunding -= potentialEarmarkFunding + potentialGeneralFunding;

            for (const proposalWithFunding of proposalsWithFunding.reverse()) {
                if (
                    (!proposalWithFunding.grantPoolShare[EarmarkTypeEnum.General] &&
                        !proposalWithFunding.grantPoolShare[proposal.earmarkType]) ||
                    proposal.id === proposalWithFunding.id
                ) {
                    continue;
                }

                const potentialFunding =
                    proposalWithFunding.grantPoolShare[EarmarkTypeEnum.General] ??
                    0 + proposalWithFunding.grantPoolShare[proposal.earmarkType] ??
                    0;

                neededFunding -= potentialFunding;

                if (neededFunding <= 0) {
                    fullyFunded =
                        Math.abs(proposal.effectiveVotes - proposalWithFunding.effectiveVotes) + 1;
                    break;
                }
            }

            return {
                fullyFunded,
                partiallyFunded,
            } as NeededVotes;
        }

        for (const proposalWithFunding of proposalsWithFunding.reverse()) {
            if (
                (!proposalWithFunding.grantPoolShare[EarmarkTypeEnum.General] &&
                    !proposalWithFunding.grantPoolShare[proposal.earmarkType]) ||
                proposal.id === proposalWithFunding.id
            ) {
                continue;
            }

            const potentialFunding =
                proposalWithFunding.grantPoolShare[EarmarkTypeEnum.General] ??
                0 + proposalWithFunding.grantPoolShare[proposal.earmarkType] ??
                0;

            neededFunding -= potentialFunding;

            if (neededFunding <= 0) {
                fullyFunded =
                    Math.abs(proposal.effectiveVotes - proposalWithFunding.effectiveVotes) + 1;
                break;
            }

            if (!partiallyFunded) {
                partiallyFunded =
                    Math.abs(proposal.effectiveVotes - proposalWithFunding.effectiveVotes) + 1;
            }
        }

        return {
            fullyFunded,
            partiallyFunded,
        } as NeededVotes;
    }

    private calculateNeededGeneralVotes(
        proposal: LeaderboardProposal,
        generalPool: GrantPool,
        proposalsWithFunding: LeaderboardProposal[],
    ): NeededVotes {
        let fullyFunded: number;
        let partiallyFunded: number;

        let neededFunding = proposal.requestedFunding - proposal.receivedFunding;
        const potentialGeneralFunding = generalPool.remainingFunding;

        if (potentialGeneralFunding > 0) {
            if (potentialGeneralFunding >= neededFunding) {
                return {
                    fullyFunded: Math.abs(proposal.effectiveVotes) + 1,
                } as NeededVotes;
            }

            partiallyFunded = Math.abs(proposal.effectiveVotes) + 1;
            neededFunding -= potentialGeneralFunding;

            for (const proposalWithFunding of proposalsWithFunding.reverse()) {
                if (
                    !proposalWithFunding.grantPoolShare[EarmarkTypeEnum.General] ||
                    proposal.id === proposalWithFunding.id
                ) {
                    continue;
                }

                neededFunding -= proposalWithFunding.grantPoolShare[EarmarkTypeEnum.General] ?? 0;

                if (neededFunding <= 0) {
                    fullyFunded =
                        Math.abs(proposal.effectiveVotes - proposalWithFunding.effectiveVotes) + 1;
                    break;
                }
            }

            return {
                fullyFunded,
                partiallyFunded,
            } as NeededVotes;
        }

        for (const proposalWithFunding of proposalsWithFunding.reverse()) {
            if (
                !proposalWithFunding.grantPoolShare[EarmarkTypeEnum.General] ||
                proposal.id === proposalWithFunding.id
            ) {
                continue;
            }

            neededFunding -= proposalWithFunding.grantPoolShare[EarmarkTypeEnum.General] ?? 0;

            if (neededFunding <= 0) {
                fullyFunded =
                    Math.abs(proposal.effectiveVotes - proposalWithFunding.effectiveVotes) + 1;
                break;
            }

            if (!partiallyFunded) {
                partiallyFunded =
                    Math.abs(proposal.effectiveVotes - proposalWithFunding.effectiveVotes) + 1;
            }
        }

        return {
            fullyFunded,
            partiallyFunded,
        } as NeededVotes;
    }
}
