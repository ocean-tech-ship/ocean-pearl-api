import { Inject } from 'typescript-ioc';
import { DaoProposalInterface, DaoProposalRepository } from '../../../database';
import { FindQueryInterface } from '../../../database/interfaces/find-query.interface';
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
        let query: FindQueryInterface = {
            sort: { fundingRound: -1 },
        };

        return await this.daoProposalRepository.getAll(query);
    }
}
