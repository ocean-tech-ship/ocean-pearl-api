import { Types } from 'mongoose';
import { DaoProposalInterface } from '../../../database';

export abstract class GetDaoProposalByIdCommandApi {
    abstract execute(id: Types.ObjectId): Promise<DaoProposalInterface>;
}
