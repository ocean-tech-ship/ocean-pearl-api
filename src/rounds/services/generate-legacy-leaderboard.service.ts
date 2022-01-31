import { Injectable } from '@nestjs/common';
import { PaymentOptionEnum } from '../../database/enums/payment-option.enum';
import { RemainingFundingStrategyEnum } from '../../database/enums/remaining-funding-strategy.enum';
import { FindQuery } from '../../database/interfaces/find-query.interface';
import { DaoProposalRepository } from '../../database/repositories/dao-proposal.repository';
import { RoundRepository } from '../../database/repositories/round.repository';
import { Round, RoundType } from '../../database/schemas/round.schema';
import { LeaderboardProposalBuilder } from '../builder/leaderboard-proposal.builder';
import { InvalidProposalStates } from '../constants/invalid-proposal-states.constant';
import { leaderboardStrategyInterface } from '../interfaces/leaderboard-strategy.interface';
import { LeaderboardMapper } from '../mapper/leaderboard.mapper';
import { LeaderboardProposal } from '../models/leaderboard-proposal.model';
import { Leaderboard } from '../models/leaderboard.model';
import { LegacyLeaderboardStrategyCollection } from '../strategies/legacy-leaderboard-strategy.collection';
import { LeaderboardCacheService } from './leaderboard-cache.service';

@Injectable()
export class GenerateLegacyLeaderboardService {
    public constructor(
        private roundRepository: RoundRepository,
        private leaderboardMapper: LeaderboardMapper,
        private daoProposalRepository: DaoProposalRepository,
        private leaderboardCacheService: LeaderboardCacheService,
        private leaderboardProposalBuilder: LeaderboardProposalBuilder,
        private strategyCollection: LegacyLeaderboardStrategyCollection,
    ) {}

    public async execute(round?: number): Promise<Leaderboard> {
        const fundingRound: Round = await this.roundRepository.findOneRaw({
            find: { round: round },
        } as FindQuery<RoundType>);
        let leaderboard: Leaderboard = await this.leaderboardCacheService.getFromCache(round);

        if (leaderboard) {
            return leaderboard;
        }

        leaderboard = this.leaderboardMapper.map(fundingRound);
        let leaderboardProposals: LeaderboardProposal[] = [];

        const proposals = await this.daoProposalRepository.getAll({
            find: { fundingRound: fundingRound._id },
        });

        if (proposals.length === 0) {
            return leaderboard;
        }

        for (const proposal of proposals) {
            if (InvalidProposalStates.includes(proposal.status)) {
                continue;
            }

            leaderboard.overallRequestedFunding +=
                leaderboard.paymentOption === PaymentOptionEnum.Usd
                    ? proposal.requestedGrantUsd
                    : proposal.requestedGrantToken;
            leaderboard.totalVotes += proposal.votes + proposal.counterVotes;

            leaderboardProposals.push(
                await this.leaderboardProposalBuilder.build(proposal, fundingRound),
            );
            leaderboard.amountProposals++;
        }

        leaderboard = this.assignFunding(leaderboard, leaderboardProposals);

        if (leaderboard.remainingFundingStrategy === RemainingFundingStrategyEnum.Recycle) {
            leaderboard.moveUnusedRemainingFunding();
        }

        this.leaderboardCacheService.addToCache(leaderboard);
        return leaderboard;
    }

    private assignFunding(leaderboard: Leaderboard, proposals: LeaderboardProposal[]): Leaderboard {
        for (let proposal of proposals) {
            let strategy: leaderboardStrategyInterface =
                this.strategyCollection.findMatchingStrategy(proposal, leaderboard);

            leaderboard = strategy.execute(proposal, leaderboard);
        }

        return leaderboard;
    }
}
