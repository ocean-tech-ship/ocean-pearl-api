import { DaoProposalInterface } from '../../../database';

export abstract class GetDaoProposalsByRoundCommandApi {
    abstract execute(round: number): Promise<DaoProposalInterface[]>;
}
