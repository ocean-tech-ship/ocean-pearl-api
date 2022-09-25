import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '../../database/repositories/project.repository';
import { Project } from '../../database/schemas/project.schema';
import { LinkedProjectMapper } from '../mapper/linked-project.mapper';
import { LinkedProject } from '../models/linked-project.model';

@Injectable()
export class GetLinkedProjectsService {
    public constructor(
        private projectRepository: ProjectRepository,
        private linkedProjectMapper: LinkedProjectMapper,
    ) {}

    public async execute(walletAddress: string): Promise<LinkedProject[]> {
        const associatedProjects = await this.projectRepository.getAll({
            find: { accessAddresses: walletAddress },
        });

        if (!associatedProjects) {
            return [];
        }

        const mappedProjects = associatedProjects.map((project: Project) =>
            this.linkedProjectMapper.map(project),
        );

        return mappedProjects;
    }
}
