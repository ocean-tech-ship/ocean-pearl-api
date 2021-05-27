import { Inject } from 'typescript-ioc';
import { DaoProposalInterface, DaoProposalRepository } from '../../../database';
import { GetFeaturedDaoProposalsCommandApi } from '../api/get-featured-dao-proposals-comand.api';

export class GetFeaturedDaoProposalsCommand
    implements GetFeaturedDaoProposalsCommandApi
{
    daoProposalRepository: DaoProposalRepository;

    constructor(
        @Inject
        daoProposalRepository: DaoProposalRepository
    ) {
        this.daoProposalRepository = daoProposalRepository;
    }

    public async execute(): Promise<DaoProposalInterface[]> {
        return await this.daoProposalRepository.getPaginated(1, 5);
    }
}
