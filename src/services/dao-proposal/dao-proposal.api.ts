import { Types } from 'mongoose';
import { DaoProposalInterface } from '../../database/model/dao-proposal.model';

export abstract class DaoProposalApi{
    abstract getDaoProposals(): Promise<DaoProposalInterface[]>;
    abstract getFeaturedDaoProposals(): Promise<DaoProposalInterface[]>;
    abstract getDaoProposalById(id: Types.ObjectId): Promise<DaoProposalInterface>;
}