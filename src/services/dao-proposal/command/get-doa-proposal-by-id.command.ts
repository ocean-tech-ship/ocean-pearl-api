import { Inject } from 'typescript-ioc';
import { DaoProposalInterface, DaoProposalRepository } from '../../../database';
import { GetDaoProposalByIdCommandApi } from '../api/get-doa-proposals-by-id-command.api';

export class GetDaoProposalByIdCommand implements GetDaoProposalByIdCommandApi {
    daoProposalRepository: DaoProposalRepository;

    constructor(
        @Inject
        daoProposalRepository: DaoProposalRepository
    ) {
        this.daoProposalRepository = daoProposalRepository;
    }

    public async execute(id: string): Promise<DaoProposalInterface> {
        return this.daoProposalRepository.getByID(id);
    }
}
