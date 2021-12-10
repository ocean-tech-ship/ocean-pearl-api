import { Injectable } from '@nestjs/common';
import { DaoProposalStatusEnum } from '../../database/enums/dao-proposal-status.enum';
import { FindQuery } from '../../database/interfaces/find-query.interface';
import { DaoProposalRepository } from '../../database/repositories/dao-proposal.repository';
import { RoundRepository } from '../../database/repositories/round.repository';
import {
    DaoProposal,
    DaoProposalType,
} from '../../database/schemas/dao-proposal.schema';
import { Round } from '../../database/schemas/round.schema';

@Injectable()
export class GetOpenDaoProposalsService {
    constructor(
        private daoProposalRepository: DaoProposalRepository,
        private roundRepository: RoundRepository        
    ) {}

    public async execute(fundingRound?: number): Promise<DaoProposal[]> {
        let query: FindQuery<DaoProposalType> = {
            find: { status: DaoProposalStatusEnum.Running },
        };

        if (fundingRound) {
            const filteredRound: Round = await this.roundRepository.findOneRaw({
                find: {
                    round: fundingRound
                }
            }); 
            query.find.fundingRound = filteredRound._id;
        }

        return await this.daoProposalRepository.getAll(query);
    }
}
