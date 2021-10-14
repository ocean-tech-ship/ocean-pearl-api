import { Injectable } from '@nestjs/common';
import { DaoProposalRepository } from '../../database/repositories/dao-proposal.repository';
import { Round } from '../../database/schemas/round.schema';
import { LeaderboardProposalBuilder } from '../builder/leaderboard-proposal.builder';
import { RoundStatusEnum } from '../enums/round-status.enum';
import { LeaderboardProposal } from '../models/leaderboard-proposal.model';
import { Leaderboard } from '../models/leaderboard.model';
import { StrategyCollection } from '../strategies/strategy.collection';
import { GetCurrentRoundService } from './get-current-round.service';

@Injectable()
export class GenerateLeaderboardService {
    public constructor(
        private getCurrentRoundService: GetCurrentRoundService,
        private daoProposalRepository: DaoProposalRepository,
        private leaderboardProposalBuilder: LeaderboardProposalBuilder,
        private strategyCollection: StrategyCollection,
    ) {}

    public async execute(): Promise<Leaderboard> {
        const round = await this.getCurrentRoundService.execute();

        let leaderboard: Leaderboard = {
            maxVotes: 0,
            fundedProposals: [],
            notFundedProposals: [],
            voteEndDate: round.votingEndDate,
            remainingEarmarkFundingUsd: round.earmarkedFundingUsd,
            remainingGeneralFundingUsd:
                round.availableFundingOcean - round.earmarkedFundingUsd,
            status: this.determineRoundStatus(round),
        } as Leaderboard;
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
                await this.leaderboardProposalBuilder.build(
                    proposal,
                    round.round,
                ),
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

            ({
                leaderboard,
                lowestEarmarkVotes,
                lowestGeneralVotes,
            } = strategy.execute(
                proposal,
                leaderboard,
                lowestEarmarkVotes,
                lowestGeneralVotes,
            ));
        }

        return leaderboard;
    }

    private determineRoundStatus(round: Round): RoundStatusEnum {
        const currentDate = new Date();

        if (round.submissionEndDate >= currentDate) {
            return RoundStatusEnum.ProposalSubmission;
        }

        if (round.votingStartDate >= currentDate) {
            return RoundStatusEnum.Pending;
        }

        if (round.votingEndDate >= currentDate) {
            return RoundStatusEnum.VotingInProgress;
        }

        return RoundStatusEnum.VotingFinished;
    }
}
