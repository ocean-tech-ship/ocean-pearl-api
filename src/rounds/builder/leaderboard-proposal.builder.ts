import { Injectable } from '@nestjs/common';
import { PaymentOptionEnum } from '../../database/enums/payment-option.enum';
import { StandingEnum } from '../../database/enums/standing.enum';
import { ProjectRepository } from '../../database/repositories/project.repository';
import { DaoProposal } from '../../database/schemas/dao-proposal.schema';
import { Project } from '../../database/schemas/project.schema';
import { Round } from '../../database/schemas/round.schema';
import { LeaderboardProposal } from '../models/leaderboard-proposal.model';
import { DaoProposalStatusEnum } from '../../database/enums/dao-proposal-status.enum';

@Injectable()
export class LeaderboardProposalBuilder {
    private readonly EARMARK_TAG = 'earmark';

    public constructor(private projectRepository: ProjectRepository) {}

    public async build(
        proposal: DaoProposal,
        round: Round,
    ): Promise<LeaderboardProposal> {
        let project = proposal.project as Project;
        project = await this.projectRepository.findOne({
            find: { id: project.id },
        });

        const mappedLeaderboardProposal = {
            id: proposal.id,
            title: proposal.title,
            project: {
                id: project.id,
                title: project.title,
                completedProposals: this.countFinishedProposals(
                    project.daoProposals as DaoProposal[],
                ),
            },
            requestedFunding:
                round.paymentOption === PaymentOptionEnum.Usd
                    ? proposal.requestedGrantUsd
                    : proposal.requestedGrantToken,
            receivedFunding: 0,
            yesVotes: proposal.votes,
            noVotes: proposal.counterVotes,
            effectiveVotes: this.calculateEffectiveVotes(
                proposal.votes,
                proposal.counterVotes,
                round.round,
            ),
            tags: [proposal.category],
            voteUrl: proposal.voteUrl,
        } as LeaderboardProposal;

        if (proposal.earmark) {
            mappedLeaderboardProposal.tags.push(this.EARMARK_TAG);
            mappedLeaderboardProposal.isEarmarked = true;
            mappedLeaderboardProposal.earmarkeType = proposal.earmark;
        }

        if (project.logo) {
            mappedLeaderboardProposal.project.logoUrl = project.logo.url;
        }

        return mappedLeaderboardProposal;
    }

    private calculateEffectiveVotes(
        votes: number,
        counterVotes: number,
        round: number,
    ): number {
        return round >= 8 ? votes - counterVotes : votes;
    }

    private countFinishedProposals(proposals: DaoProposal[]): number {
        const allowedStates = [
            DaoProposalStatusEnum.Funded,
            DaoProposalStatusEnum.Granted,
        ];
        let finishedProposals = 0;

        for (const proposal of proposals) {
            finishedProposals += allowedStates.includes(proposal.status)
                ? 1
                : 0;
        }

        return finishedProposals;
    }
}
