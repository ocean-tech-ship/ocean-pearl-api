import { Inject } from 'typescript-ioc';
import { DaoProposalInterface, DaoProposalRepository } from '../../../database';
import { DaoProposalStatusEnum } from '../../../database/enums/dao-proposal-status.enum';
import { FindQueryInterface } from '../../../database/interfaces/find-query.interface';
import { GetOpenDaoProposalsCommandApi } from '../api/get-open-dao-proposals-comand.api';

export class GetOpenDaoProposalsCommand
    implements GetOpenDaoProposalsCommandApi
{
    daoProposalRepository: DaoProposalRepository;

    constructor(
        @Inject
        daoProposalRepository: DaoProposalRepository
    ) {
        this.daoProposalRepository = daoProposalRepository;
    }

    public async execute(
        fundingRound?: number
    ): Promise<DaoProposalInterface[]> {
        let query: FindQueryInterface = {
            find: { status: DaoProposalStatusEnum.FundingRoundActive },
        };

        if (fundingRound) {
            query.find.fundingRound = fundingRound;
        }

        return await this.daoProposalRepository.getAll(query);
    }
}
