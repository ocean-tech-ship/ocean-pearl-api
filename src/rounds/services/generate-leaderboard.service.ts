import { Injectable } from '@nestjs/common';
import { DaoProposalStatusEnum } from '../../database/enums/dao-proposal-status.enum';
import { EarmarkTypeEnum } from '../../database/enums/earmark-type.enum';
import { DaoProposalRepository } from '../../database/repositories/dao-proposal.repository';
import { Round } from '../../database/schemas/round.schema';
import { LeaderboardProposalBuilder } from '../builder/leaderboard-proposal.builder';
import { LeaderboardMapper } from '../mapper/leaderboard.mapper';
import { LeaderboardProposal } from '../models/leaderboard-proposal.model';
import { Leaderboard, LeaderboardGrantPools } from '../models/leaderboard.model';
import { LeaderboardStrategyCollection } from '../strategies/leaderboard-strategy.collection';
import { LeaderboardCacheService } from './leaderboard-cache.service';

@Injectable()
export class GenerateLeaderboardService {
    private readonly INVALID_STATES: DaoProposalStatusEnum[] = [
        DaoProposalStatusEnum.Rejected,
        DaoProposalStatusEnum.Withdrawn,
    ];

    public constructor(
        private daoProposalRepository: DaoProposalRepository,
        private leaderboardProposalBuilder: LeaderboardProposalBuilder,
        private strategyCollection: LeaderboardStrategyCollection,
        private leaderboardMapper: LeaderboardMapper,
        private leaderboardCacheService: LeaderboardCacheService,
    ) {}

    public async execute(round: Round): Promise<Leaderboard> {
        const cachedLeaderboard = await this.leaderboardCacheService.getFromCache(round.round);

        if (cachedLeaderboard) {
            return cachedLeaderboard;
        }

        let leaderboard: Leaderboard = this.leaderboardMapper.map(round);
        let relevantProposals: LeaderboardProposal[] = [];

        const proposals = await this.daoProposalRepository.getAll({
            find: { fundingRound: round._id },
        });

        if (proposals.length === 0) {
            return leaderboard;
        }

        for (const proposal of proposals) {
            if (this.INVALID_STATES.includes(proposal.status)) {
                continue;
            }

            let leaderboardProposal: LeaderboardProposal =
                await this.leaderboardProposalBuilder.build(proposal, round);

            leaderboard.overallRequestedFunding += leaderboardProposal.requestedFunding;
            leaderboard.totalVotes += leaderboardProposal.yesVotes + leaderboardProposal.noVotes;
            leaderboard.amountProposals++;

            if (leaderboardProposal.effectiveVotes <= 0) {
                leaderboard.addToNotFundedProposals(leaderboardProposal);
                continue;
            }

            if (leaderboardProposal.isEarmarked) {
                leaderboard.grantPools[leaderboardProposal.earmarkType].totalEffectiveVotes +=
                    leaderboardProposal.effectiveVotes;
                leaderboard.grantPools[leaderboardProposal.earmarkType].relevantEffectiveVotes +=
                    leaderboardProposal.effectiveVotes;
            }
            leaderboard.grantPools[EarmarkTypeEnum.General].totalEffectiveVotes +=
                leaderboardProposal.effectiveVotes;
            leaderboard.grantPools[EarmarkTypeEnum.General].relevantEffectiveVotes +=
                leaderboardProposal.effectiveVotes;

            relevantProposals.push(leaderboardProposal);
        }

        leaderboard = this.calculateQuadraticFundingDistribution(leaderboard, relevantProposals);

        this.leaderboardCacheService.addToCache(leaderboard);
        return leaderboard;
    }

    private assignFunding(leaderboard: Leaderboard, proposals: LeaderboardProposal[]): Leaderboard {
        for (let proposal of proposals) {
            let strategy = this.strategyCollection.findMatchingStrategy(proposal);

            leaderboard = strategy.execute(proposal, leaderboard);
        }

        return leaderboard;
    }

    private calculateQuadraticFundingDistribution(
        leaderboard: Leaderboard,
        proposals: LeaderboardProposal[],
    ): Leaderboard {
        let hasProposalsUnderMinimalFunding: boolean = true;
        let totalUnusedEarmarkedPoolsFunding: number = 0;
        let previousFundedProposalsAmount: number = 0;
        const baseGrantPools: LeaderboardGrantPools = JSON.parse(
            JSON.stringify(leaderboard.grantPools),
        );

        while (hasProposalsUnderMinimalFunding) {
            for (const proposal of proposals) {
                proposal.receivedFunding = 0;
                proposal.grantPoolShare = {};
            };

            leaderboard = this.assignFunding(leaderboard, proposals);

            if (leaderboard.fundedProposals.length > previousFundedProposalsAmount) {
                previousFundedProposalsAmount = leaderboard.fundedProposals.length;

                proposals = [
                    ...leaderboard.fundedProposals,
                    ...leaderboard.partiallyFundedProposals,
                ];
                leaderboard.fundedProposals = [];
                leaderboard.partiallyFundedProposals = [];
                leaderboard.grantPools = JSON.parse(JSON.stringify(baseGrantPools));

                continue;
            }

            totalUnusedEarmarkedPoolsFunding = 0;
            for (const grantPool of Object.values(leaderboard.grantPools)) {
                if (grantPool.type !== EarmarkTypeEnum.General && grantPool.relevantFunding > 0) {
                    totalUnusedEarmarkedPoolsFunding += grantPool.relevantFunding;
                    baseGrantPools[grantPool.type].relevantFunding -= grantPool.relevantFunding;
                }
            }

            if (totalUnusedEarmarkedPoolsFunding > 0) {
                baseGrantPools[EarmarkTypeEnum.General].relevantFunding +=
                    totalUnusedEarmarkedPoolsFunding;

                proposals = [
                    ...leaderboard.fundedProposals,
                    ...leaderboard.partiallyFundedProposals,
                ];
                leaderboard.fundedProposals = [];
                leaderboard.partiallyFundedProposals = [];
                leaderboard.grantPools = JSON.parse(JSON.stringify(baseGrantPools));

                continue;
            }

            hasProposalsUnderMinimalFunding = false;
            for (let index = leaderboard.partiallyFundedProposals.length - 1; index >= 0; index--) {
                const proposal = leaderboard.partiallyFundedProposals[index];
                if (!proposal.hasReceivedMinimalFunding()) {
                    hasProposalsUnderMinimalFunding = true;

                    proposal.receivedFunding = 0;
                    proposal.grantPoolShare = {};
                    leaderboard.addToNotFundedProposals(proposal);
                    leaderboard.partiallyFundedProposals.splice(index, 1);

                    if (proposal.isEarmarked) {
                        baseGrantPools[proposal.earmarkType].relevantEffectiveVotes -=
                            proposal.effectiveVotes;
                    }

                    baseGrantPools[EarmarkTypeEnum.General].relevantEffectiveVotes -=
                        proposal.effectiveVotes;

                    proposals = [
                        ...leaderboard.fundedProposals,
                        ...leaderboard.partiallyFundedProposals,
                    ];
                    leaderboard.fundedProposals = [];
                    leaderboard.partiallyFundedProposals = [];

                    leaderboard.grantPools = JSON.parse(JSON.stringify(baseGrantPools));
                    break;
                }
            }
        }

        return leaderboard;
    }
}
