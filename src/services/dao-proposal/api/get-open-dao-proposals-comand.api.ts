import { DaoProposalInterface } from '../../../database';

export abstract class GetOpenDaoProposalsCommandApi {
    abstract execute(fundingRound?: number): Promise<DaoProposalInterface[]>;
}
