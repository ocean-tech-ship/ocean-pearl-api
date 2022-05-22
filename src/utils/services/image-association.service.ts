import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { DaoProposalRepository } from '../../database/repositories/dao-proposal.repository';
import { ProjectRepository } from '../../database/repositories/project.repository';
import { DaoProposal } from '../../database/schemas/dao-proposal.schema';
import { Image } from '../../database/schemas/image.schema';
import { Project } from '../../database/schemas/project.schema';

@Injectable()
export class ImageAssociationService {
    public constructor(
        private projectRepository: ProjectRepository,
        private proposalRepository: DaoProposalRepository    
    ) {}

    public async isProjectPictureOwner(project: Project, image: Image): Promise<boolean> {
        for (const projectImage of [...project.images, project.logo]) {
            if (projectImage as Types.ObjectId === image._id) {
                return true;
            }
        }

        return false;
    }

    public async isImageUnassociated(image: Image): Promise<boolean> {
        const associatedProject: Project = await this.projectRepository.findOneRaw({
            find: {
                $or: [{ logo: image._id }, { images: image._id }],
            },
        });

        const associatedProposal: DaoProposal = await this.proposalRepository.findOneRaw({
            find: { images: image._id },
        });

        return !associatedProject && !associatedProposal;
    }
}