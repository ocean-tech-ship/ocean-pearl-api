import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '../../database/repositories/project.repository';
import { Project } from '../../database/schemas/project.schema';
import { ManagedProjectMapper } from '../mapper/managed-project.mapper';
import { AssociatedProject } from '../models/associated-project.model';

@Injectable()
export class GetAssociatedProjectsService {
    public constructor(
        private projectRepository: ProjectRepository,
        private managedProjectMapper: ManagedProjectMapper,
    ) {}

    public async execute(walletAddress: string): Promise<AssociatedProject[]> {
        const associatedProjects = await this.projectRepository.getAll({
            find: { 'accessAddresses.address': walletAddress.toLocaleLowerCase() },
        });

        if (!associatedProjects) {
            return [];
        }

        const mappedProjects = associatedProjects.map((project: Project) => {
            return this.managedProjectMapper.map(project);
        });

        return mappedProjects;
    }
}
