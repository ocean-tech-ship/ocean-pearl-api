import { Inject } from 'typescript-ioc';
import { DaoProposalInterface, DaoProposalRepository } from '../../../database';
import { GetDaoProposalsCommandApi } from '../api/get-dao-proposals-command.api';

export class GetDaoProposalsCommand implements GetDaoProposalsCommandApi {
    daoProposalRepository: DaoProposalRepository;

    constructor(
        @Inject
        daoProposalRepository: DaoProposalRepository
    ) {
        this.daoProposalRepository = daoProposalRepository;
    }

    public async execute(): Promise<DaoProposalInterface[]> {
        return await this.daoProposalRepository.getAll();
    }
}
