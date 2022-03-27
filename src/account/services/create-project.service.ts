import { BadRequestException, Injectable } from '@nestjs/common';
import { ProjectRepository } from '../../database/repositories/project.repository';
import { CreateProject } from '../models/create-project.model';

@Injectable()
export class CreateProjectService {
    private readonly projectLeadRole = 'project lead';

    public constructor(
        private projectRepository: ProjectRepository
    ) {}

    public async execute(createProject: CreateProject): Promise<void> {
        if (!this.validateProject(createProject)) {
            throw BadRequestException;
        }

    }

    private async validateProject(createProject: CreateProject): Promise<boolean> {
        if (this.projectRepository.getModel().exists({ title: createProject.name })) {
            return false;
        }

        for (const teamMemeber of createProject.team) {
            if (teamMemeber.role === this.projectLeadRole) {
                return true;
            }
        }

        return false
    }
}