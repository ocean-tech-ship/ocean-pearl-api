import { Injectable } from '@nestjs/common';
import { RoundRepository } from '../../database/repositories/round.repository';
import { Round } from '../../database/schemas/round.schema';

@Injectable()
export class GetCurrentRoundService {
    constructor(private roundRepository: RoundRepository) {}

    public async execute(): Promise<Round> {
        const currentDate = new Date();

        let currentRound = await this.roundRepository.findOne({
            find: {
                startDate: { $lte: currentDate },
                votingEndDate: { $gte: currentDate },
            },
        });

        return (
            currentRound ??
            (
                await this.roundRepository.getAll({
                    find: {
                        votingEndDate: { $gte: currentDate },
                    },
                    sort: {
                        votingEndDate: -1,
                    },
                    limit: 1,
                })
            )[0]
        );
    }
}
