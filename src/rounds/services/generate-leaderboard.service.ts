import { Injectable } from '@nestjs/common';
import { DaoProposalRepository } from '../../database/repositories/dao-proposal.repository';
import { LeaderboardProposalBuilder } from '../builder/leaderboard-proposal.builder';
import { LeaderboardMapper } from '../mapper/leaderboard.mapper';
import { LeaderboardProposal } from '../models/leaderboard-proposal.model';
import { Leaderboard } from '../models/leaderboard.model';
import { LeaderboardStrategyCollection } from '../strategies/leaderboard-strategy.collection';
import { GetCurrentRoundService } from './get-current-round.service';

@Injectable()
export class GenerateLeaderboardService {
    public constructor(
        private getCurrentRoundService: GetCurrentRoundService,
        private daoProposalRepository: DaoProposalRepository,
        private leaderboardProposalBuilder: LeaderboardProposalBuilder,
        private strategyCollection: LeaderboardStrategyCollection,
        private leaderboardMapper: LeaderboardMapper,
    ) {}

    public async execute(): Promise<Leaderboard> {
        const round = await this.getCurrentRoundService.execute();
        let leaderboard: Leaderboard = this.leaderboardMapper.map(round);
        let leaderboardProposals: LeaderboardProposal[] = [];
        let lowestEarmarkVotes: number;
        let lowestGeneralVotes: number;

        const proposals = await this.daoProposalRepository.getAll({
            find: { fundingRound: round._id },
        });

        if (proposals.length === 0) {
            return leaderboard;
        }

        for (const proposal of proposals) {
            leaderboardProposals.push(
                await this.leaderboardProposalBuilder.build(proposal, round),
            );
        }

        leaderboardProposals.sort(
            (
                current: LeaderboardProposal,
                next: LeaderboardProposal,
            ): number => {
                return next.effectiveVotes - current.effectiveVotes;
            },
        );

        lowestEarmarkVotes = lowestGeneralVotes =
            leaderboardProposals[0].effectiveVotes;

        for (let proposal of leaderboardProposals) {
            let strategy = this.strategyCollection.findMatchingStrategy(
                proposal,
                leaderboard,
            );

            ({ leaderboard, lowestEarmarkVotes, lowestGeneralVotes } =
                strategy.execute(
                    proposal,
                    leaderboard,
                    lowestEarmarkVotes,
                    lowestGeneralVotes,
                ));
        }

        return leaderboard;
    }
}
