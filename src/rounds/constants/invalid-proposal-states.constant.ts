import { DaoProposalStatusEnum } from '../../database/enums/dao-proposal-status.enum';

export const InvalidProposalStates = [
    DaoProposalStatusEnum.Rejected,
    DaoProposalStatusEnum.Withdrawn,
];