import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '../../database/repositories/project.repository';
import { DaoProposal } from '../../database/schemas/dao-proposal.schema';
import { Project } from '../../database/schemas/project.schema';
import { LeaderboardProposal } from '../models/leaderboard-proposal.model';

@Injectable()
export class LeaderboardProposalMapper {
    private readonly EARMARK_TAG = 'earmark';

    public constructor(private projectRepository: ProjectRepository) {}

    public async map(proposal: DaoProposal): Promise<LeaderboardProposal> {
        let project = proposal.project as Project;
        project = await this.projectRepository.findOneRaw({
            find: { id: project.id }
        });

        let mappedLeaderboardProposal = {
            id: proposal.id,
            title: project.title,
            requestedFunding: proposal.requestedGrantUsd,
            yesVotes: proposal.votes,
            noVotes: proposal.counterVotes,
            effectiveVotes: proposal.votes - proposal.counterVotes,
            tags: [proposal.category],
            completedProposals: project.daoProposals.length,
            voteUrl: proposal.voteUrl,
        } as LeaderboardProposal;

        if (proposal.earmark) {
            mappedLeaderboardProposal.tags.push(this.EARMARK_TAG);
            mappedLeaderboardProposal.isEarmarked = true;
        }

        return mappedLeaderboardProposal;
    }
}
