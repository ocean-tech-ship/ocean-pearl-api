import { Injectable } from '@nestjs/common';
import { PaginationOptions } from '../../database/interfaces/pagination-options.interface';
import { ProjectRepository } from '../../database/repositories/project.repository';
import { Project } from '../../database/schemas/project.schema';

@Injectable()
export class GetProjectsPaginatedService
{
    constructor(
        private projectRepository: ProjectRepository
    ) {}

    public async execute(options: PaginationOptions): Promise<Project[]> {
        return this.projectRepository.getPaginated(options);
    }
}
