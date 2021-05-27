import { DaoProposalInterface } from '../../../database';

export abstract class GetFeaturedDaoProposalsCommandApi {
    abstract execute(): Promise<DaoProposalInterface[]>;
}
