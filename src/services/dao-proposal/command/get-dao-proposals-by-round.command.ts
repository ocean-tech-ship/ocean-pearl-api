import { Inject } from 'typescript-ioc';
import { DaoProposalInterface, DaoProposalRepository } from '../../../database';
import { FindQueryInterface } from '../../../database/interfaces/find-query.interface';
import { GetDaoProposalsByRoundCommandApi } from '../api/get-dao-proposals-by-round-command.api';

export class GetDaoProposalsByRoundCommand
    implements GetDaoProposalsByRoundCommandApi
{
    daoProposalRepository: DaoProposalRepository;

    constructor(
        @Inject
        daoProposalRepository: DaoProposalRepository
    ) {
        this.daoProposalRepository = daoProposalRepository;
    }

    public async execute(round: number): Promise<DaoProposalInterface[]> {
        let query: FindQueryInterface = {
            find: { fundingRound: round },
        };

        return await this.daoProposalRepository.getAll(query);
    }
}
