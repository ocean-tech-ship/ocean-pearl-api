import { VoteTypeEnum } from '../../database/enums/vote-type.enum';

export const VoteTypeMap = {
    'single-choice': VoteTypeEnum.SingleChoice,
    'weighted': VoteTypeEnum.Weighted,
    'quadratic': VoteTypeEnum.Quadratic,
};
