import { Injectable, Logger } from '@nestjs/common';
import { DaoProposalRepository } from '../../database/repositories/dao-proposal.repository';
import { GetCurrentRoundService } from './get-current-round.service';
import { LeaderboardProposalMapper } from '../mapper/leaderboard-proposal.mapper';
import { LeaderboardProposal } from '../models/leaderboard-proposal.model';
import { Leaderboard } from '../models/leaderboard.model';

@Injectable()
export class GenerateLeaderboardService {
    public constructor(
        private getCurrentRoundService: GetCurrentRoundService,
        private daoProposalRepository: DaoProposalRepository,
        private leaderboardProposalMapper: LeaderboardProposalMapper,
    ) {}

    public async execute(): Promise<Leaderboard> {
        let leaderboard: Leaderboard = {
            maxVotes: 0,
            fundedProposals: [],
            notFundedProposals: [],
        } as Leaderboard;
        let leaderboardProposals: LeaderboardProposal[] = [];
        let lowestEarmark: number;
        let lowestGeneral: number;

        const round = await this.getCurrentRoundService.execute();
        let { earmarked, availableFunding } = round;
        let generalFunding: number = availableFunding - earmarked;

        const proposals = await this.daoProposalRepository.getAll({
            find: { fundingRound: round._id },
        });

        if (proposals.length === 0) {
            return leaderboard;
        }

        for (const proposal of proposals) {
            leaderboardProposals.push(
                await this.leaderboardProposalMapper.map(proposal),
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

        lowestEarmark = lowestGeneral = leaderboardProposals[0].effectiveVotes;

        for (let proposal of leaderboardProposals) {
            let proposalMaxVotes: number =
                proposal.yesVotes > proposal.noVotes
                    ? proposal.yesVotes
                    : proposal.noVotes;
            leaderboard.maxVotes =
                leaderboard.maxVotes > proposalMaxVotes
                    ? leaderboard.maxVotes
                    : proposalMaxVotes;

            if (proposal.isEarmarked && proposal.effectiveVotes >= 0 && earmarked > 0) {
                if (earmarked >= proposal.requestedFunding) {
                    earmarked -= proposal.requestedFunding;
                    proposal.receivedFunding = proposal.requestedFunding;
                    lowestEarmark = proposal.effectiveVotes;
                    leaderboard.fundedProposals.push(proposal);
                    continue;
                }

                proposal.receivedFunding = earmarked;
                earmarked = 0;

                if (generalFunding > 0) {
                    if (
                        generalFunding >
                        proposal.requestedFunding - proposal.receivedFunding
                    ) {
                        generalFunding -=
                            proposal.requestedFunding -
                            proposal.receivedFunding;
                        proposal.receivedFunding = proposal.requestedFunding;
                        lowestEarmark = proposal.effectiveVotes;
                        leaderboard.fundedProposals.push(proposal);
                        continue;
                    }

                    proposal.receivedFunding += generalFunding;
                    generalFunding = 0;
                }

                lowestEarmark = proposal.effectiveVotes;
                leaderboard.fundedProposals.push(proposal);
                continue;
            }

            if (proposal.effectiveVotes >= 0 && generalFunding > 0) {
                if (generalFunding >= proposal.requestedFunding) {
                    generalFunding -= proposal.requestedFunding;
                    proposal.receivedFunding = proposal.requestedFunding;
                    lowestGeneral = proposal.effectiveVotes;
                    leaderboard.fundedProposals.push(proposal);
                    continue;
                }

                proposal.receivedFunding = generalFunding;
                generalFunding = 0;
                lowestGeneral = proposal.effectiveVotes;
                leaderboard.fundedProposals.push(proposal);
                continue;
            }

            proposal.neededVotes = this.calculateNeededVotes(
                proposal,
                lowestEarmark,
                lowestGeneral,
                earmarked,
                generalFunding
            );

            leaderboard.notFundedProposals.push(proposal);
        }

        return leaderboard;
    }

    private calculateNeededVotes(
        proposal: LeaderboardProposal,
        lowestEarmark: number,
        lowestGeneral: number,
        earmarked: number,
        generalFunding: number
    ): number {
        if (proposal.isEarmarked) {
            if (earmarked > 0 || generalFunding > 0) {
                return proposal.effectiveVotes * -1;
            }

            return lowestEarmark > lowestGeneral
                ? lowestGeneral - proposal.effectiveVotes
                : lowestEarmark - proposal.effectiveVotes;
        }

        if (generalFunding > 0) {
            return proposal.effectiveVotes * -1;
        }

        return lowestGeneral - proposal.effectiveVotes;
    }
}
