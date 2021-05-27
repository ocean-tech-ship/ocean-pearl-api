import { DaoProposalInterface } from '../../../database';

export abstract class GetDaoProposalsCommandApi {
    abstract execute(): Promise<DaoProposalInterface[]>;
}
