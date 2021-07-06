import { DaoProposalInterface } from '../../../database';

export abstract class GetDaoProposalByIdCommandApi {
    abstract execute(id: string): Promise<DaoProposalInterface>;
}
