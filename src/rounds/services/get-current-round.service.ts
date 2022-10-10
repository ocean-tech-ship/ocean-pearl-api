import { Injectable } from '@nestjs/common';
import { RoundRepository } from '../../database/repositories/round.repository';
import { Round } from '../../database/schemas/round.schema';

@Injectable()
export class GetCurrentRoundService {
    private readonly DATE_CORRECTION: number = 15;

    constructor(private roundRepository: RoundRepository) {}

    public async execute(): Promise<Round> {
        const searchDate = new Date();
        searchDate.setDate(searchDate.getDate() - this.DATE_CORRECTION);

        let currentRound = await this.roundRepository.findOneRaw({
            find: {
                startDate: { $lte: searchDate },
                votingEndDate: { $gte: searchDate },
            },
        });

        if (!currentRound) {
            currentRound = (
                await this.roundRepository.getAll({
                    find: {
                        votingEndDate: { $gte: searchDate },
                    },
                    sort: {
                        votingEndDate: -1,
                    },
                    limit: 1,
                })
              )[0];
        }

        return currentRound;
    }
}
