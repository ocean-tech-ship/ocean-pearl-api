import { Inject } from 'typescript-ioc';
import { ProjectInterface, ProjectRepository } from '../../../database';
import { PaginationOptionsInterface } from '../../../database/interfaces/pagination-options.interface';
import { GetProjectsPaginatedCommandApi } from '../api/get-projects-paginated-command.api';

export class GetProjectsPaginatedCommand
    implements GetProjectsPaginatedCommandApi
{
    projectRepository: ProjectRepository;

    constructor(
        @Inject
        projectRepository: ProjectRepository
    ) {
        this.projectRepository = projectRepository;
    }

    public async execute(options: PaginationOptionsInterface): Promise<ProjectInterface[]> {
        return this.projectRepository.getPaginated(options);
    }
}
