import { Injectable } from '@nestjs/common';
import { DaoProposalStatusEnum } from '../../database/enums/dao-proposal-status.enum';
import { EarmarkTypeEnum } from '../../database/enums/earmark-type.enum';
import { PaymentOptionEnum } from '../../database/enums/payment-option.enum';
import { DaoProposalRepository } from '../../database/repositories/dao-proposal.repository';
import { Round } from '../../database/schemas/round.schema';
import { LeaderboardProposalBuilder } from '../builder/leaderboard-proposal.builder';
import { LeaderboardMapper } from '../mapper/leaderboard.mapper';
import { LeaderboardProposal } from '../models/leaderboard-proposal.model';
import { Leaderboard } from '../models/leaderboard.model';
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
        let leaderboardProposals: LeaderboardProposal[] = [];

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

            leaderboard.overallRequestedFunding +=
                leaderboard.paymentOption === PaymentOptionEnum.Usd
                    ? proposal.requestedGrantUsd
                    : proposal.requestedGrantToken;
            leaderboard.totalVotes += proposal.votes + proposal.counterVotes;

            leaderboardProposals.push(await this.leaderboardProposalBuilder.build(proposal, round));
            leaderboard.amountProposals++;
        }

        leaderboardProposals.sort(
            (current: LeaderboardProposal, next: LeaderboardProposal): number => {
                return next.effectiveVotes - current.effectiveVotes;
            },
        );

        leaderboard = this.assignFunding(leaderboard, leaderboardProposals);

        this.leaderboardCacheService.addToCache(leaderboard);
        return leaderboard;
    }

    private assignFunding(leaderboard: Leaderboard, proposals: LeaderboardProposal[]): Leaderboard {
        for (let proposal of proposals) {
            let strategy = this.strategyCollection.findMatchingStrategy(proposal, leaderboard);

            leaderboard = strategy.execute(proposal, leaderboard);
        }

        return this.assignUnusedFunding(leaderboard);
    }

    private assignUnusedFunding(leaderboard: Leaderboard): Leaderboard {
        leaderboard.grantPools[EarmarkTypeEnum.General].potentialRemainingFunding =
            leaderboard.grantPools[EarmarkTypeEnum.General].remainingFunding;

        leaderboard.moveUnusedRemainingFunding();

        if (leaderboard.grantPools[EarmarkTypeEnum.General].remainingFunding === 0) {
            return leaderboard;
        }

        const proposals = [
            ...leaderboard.partiallyFundedProposals,
            ...leaderboard.notFundedProposals,
        ];
        leaderboard.partiallyFundedProposals = [];
        leaderboard.notFundedProposals = [];

        proposals.sort(
            (current: LeaderboardProposal, next: LeaderboardProposal): number =>
                next.effectiveVotes - current.effectiveVotes,
        );

        for (let proposal of proposals) {
            proposal.neededVotes = undefined;

            let strategy = this.strategyCollection.findMatchingStrategy(proposal, leaderboard);

            leaderboard = strategy.execute(proposal, leaderboard);
        }

        return leaderboard;
    }
}
