import { Injectable } from '@nestjs/common';
import { RoundRepository } from '../../database/repositories/round.repository';

@Injectable()
export class GetRoundsAmountService {
    constructor(
        private roundRepository: RoundRepository,
    ) {}

    public async execute(): Promise<number> {
        const roundsModel = this.roundRepository.getModel();

        return await roundsModel.countDocuments();
    }
}
