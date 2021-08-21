import { Injectable } from '@nestjs/common';
import { FindQuery } from '../../database/interfaces/find-query.interface';
import { DaoProposalRepository } from '../../database/repositories/dao-proposal.repository';
import { RoundRepository } from '../../database/repositories/round.repository';
import { DaoProposal } from '../../database/schemas/dao-proposal.schema';
import { GetCurrentRoundService } from '../../rounds/services/get-current-round.service';
import { ProposalsFilterQuery } from '../models/ProposalsFilterQuery.model';

@Injectable()
export class GetFilteredDaoProposalsService {
    constructor(
        private daoProposalRepository: DaoProposalRepository,
        private getCurrentRoundService: GetCurrentRoundService,
        private roundRepository: RoundRepository,
    ) {}

    public async execute(
        proposalsFilterQuery: ProposalsFilterQuery,
    ): Promise<DaoProposal[]> {
        let query: FindQuery = {
            find: {},
            sort: {
                createdAt: -1
            }
        };

        for (const [key, value] of Object.entries(proposalsFilterQuery)) {
            if (!value) {
                continue;
            }

            if (key === 'round') {
                const round =
                    value === '0'
                        ? await this.getCurrentRoundService.execute()
                        : await this.roundRepository.findOne({
                              find: { round: value },
                          });

                query.find.fundingRound = round._id;

                continue;
            }

            if (key === 'search') {
                query.find.title = {
                    $regex: value,
                    $options: 'i',
                };

                continue;
            }

            query.find[key] = value;
        }

        return await this.daoProposalRepository.getAll(query);
    }
}
