import { Inject } from 'typescript-ioc';
import { DaoProposalInterface, DaoProposalRepository } from '../../../database';
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
        return await this.daoProposalRepository.getAll({ fundingRound: round });
    }
}
