import { Injectable } from '@nestjs/common';
import { PaymentOptionEnum } from '../../database/enums/payment-option.enum';
import { StandingEnum } from '../../database/enums/standing.enum';
import { ProjectRepository } from '../../database/repositories/project.repository';
import { DaoProposal } from '../../database/schemas/dao-proposal.schema';
import { Image } from '../../database/schemas/image.schema';
import { Project } from '../../database/schemas/project.schema';
import { Round } from '../../database/schemas/round.schema';
import { LeaderboardProject } from '../models/leaderboard-project.model';
import { LeaderboardProposal } from '../models/leaderboard-proposal.model';
import { AssociatedImage } from '../../account/models/associated-project.model';

@Injectable()
export class LeaderboardProposalBuilder {
    public constructor(private projectRepository: ProjectRepository) {}

    public async build(proposal: DaoProposal, round: Round): Promise<LeaderboardProposal> {
        let project = proposal.project as Project;
        project = await this.projectRepository.findOne({
            find: { id: project.id },
        });

        const mappedLeaderboardProposal = new LeaderboardProposal({
            id: proposal.id,
            title: proposal.title,
            project: new LeaderboardProject({
                id: project.id,
                title: project.title,
                completedProposals: this.countFinishedProposals(
                    project.daoProposals as DaoProposal[],
                ),
            }),
            requestedFunding:
                round.paymentOption === PaymentOptionEnum.Usd
                    ? proposal.requestedFunding.usd
                    : proposal.requestedFunding.ocean,
            receivedFunding:
                round.paymentOption === PaymentOptionEnum.Usd
                    ? proposal.receivedFunding.usd
                    : proposal.receivedFunding.ocean,
            yesVotes: proposal.yesVotes,
            noVotes: proposal.noVotes,
            effectiveVotes: this.calculateEffectiveVotes(
                proposal.yesVotes,
                proposal.noVotes,
                round.round,
            ),
            tags: [proposal.category],
        });

        if (proposal.minimumRequestedFunding) {
            mappedLeaderboardProposal.minimumRequestedFunding =
                round.paymentOption === PaymentOptionEnum.Usd
                    ? proposal.minimumRequestedFunding.usd
                    : proposal.minimumRequestedFunding.ocean;
        }

        if (proposal.earmark) {
            mappedLeaderboardProposal.isEarmarked = true;
            mappedLeaderboardProposal.earmarkType = proposal.earmark;
        }

        if (project.logo) {
            mappedLeaderboardProposal.project.logo = project.logo as Image;
        }

        return mappedLeaderboardProposal;
    }

    private calculateEffectiveVotes(yesVotes: number, noVotes: number, round: number): number {
        return round >= 8 ? yesVotes - noVotes : yesVotes;
    }

    private countFinishedProposals(proposals: DaoProposal[]): number {
        let finishedProposals = 0;

        for (const proposal of proposals) {
            finishedProposals += proposal.standing === StandingEnum.Completed ? 1 : 0;
        }

        return finishedProposals;
    }
}
