import { DaoProposalInterface } from '../../../database';

export abstract class GetLatestDaoProposalsCommandApi {
    abstract execute(): Promise<DaoProposalInterface[]>;
}
