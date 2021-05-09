import { Types } from 'mongoose';
import { Inject } from 'typescript-ioc';
import { DaoProposalInterface, DaoProposalRepository } from '../../database';
import { DaoProposalApi } from './dao-proposal.api';

export class DaoProposalService implements DaoProposalApi {
    daoProposalRepository: DaoProposalRepository;

    constructor(
        @Inject
        daoProposalRepository: DaoProposalRepository
    ) {
        this.daoProposalRepository = daoProposalRepository;
    }

    async getDaoProposals(): Promise<DaoProposalInterface[]> {
        return this.daoProposalRepository.getAll();
    }

    async getFeaturedDaoProposals(): Promise<DaoProposalInterface[]> {
        let projects: DaoProposalInterface[] = await this.daoProposalRepository.getPaginated(
            1,
            5
        );

        return projects;
    }

    async getDaoProposalById(id: Types.ObjectId): Promise<DaoProposalInterface> {
        return this.daoProposalRepository.getByID(id);
    }
}
