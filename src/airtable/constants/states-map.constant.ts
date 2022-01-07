import { DaoProposalStatusEnum } from '../../database/enums/dao-proposal-status.enum';

export const StatesMap = {
    'Running': DaoProposalStatusEnum.Running,
    'Not Granted': DaoProposalStatusEnum.NotGranted,
    'Granted': DaoProposalStatusEnum.Granted,
    'Funded': DaoProposalStatusEnum.Funded,
    'Not Funded': DaoProposalStatusEnum.NotFunded,
    'Rejected': DaoProposalStatusEnum.Rejected,
    'Received': DaoProposalStatusEnum.Received,
    'Ended': DaoProposalStatusEnum.Ended,
    'Down Voted': DaoProposalStatusEnum.DownVoted,
    'Withdrawn': DaoProposalStatusEnum.Withdrawn,
};
