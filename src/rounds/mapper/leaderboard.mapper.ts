import { Injectable } from '@nestjs/common';
import { EarmarkTypeEnum } from '../../database/enums/earmark-type.enum';
import { PaymentOptionEnum } from '../../database/enums/payment-option.enum';
import { Round } from '../../database/schemas/round.schema';
import { RoundStatusEnum } from '../enums/round-status.enum';
import { GrantPool } from '../models/grant-pool.model';
import { Leaderboard } from '../models/leaderboard.model';

@Injectable()
export class LeaderboardMapper {
    public map(round: Round): Leaderboard {
        let totalEarmarkFunding: number = 0;
        const isPaymentOptionUsd: boolean = round.paymentOption === PaymentOptionEnum.Usd;
        let mappedLeaderboard = new Leaderboard({
            paymentOption: round.paymentOption,
            overallFunding: isPaymentOptionUsd
                ? round.availableFunding.usd
                : round.availableFunding.ocean,
            remainingFundingStrategy: round.remainingFundingStrategy,
            status: this.determineRoundStatus(round),
            votingStartDate: round.votingStartDate,
            votingEndDate: round.votingEndDate,
            round: round.round,
        });

        for (const [type, pool] of Object.entries(round.grantPools)) {
            const totalFunding = isPaymentOptionUsd ? pool.fundingUsd : pool.fundingOcean;

            mappedLeaderboard.grantPools[pool.type] = new GrantPool({
                type: pool.type,
                totalFunding: totalFunding,
                remainingFunding: totalFunding,
                potentialRemainingFunding: totalFunding,
            });

            totalEarmarkFunding += totalFunding;
        }

        const totalGeneralFunding = isPaymentOptionUsd
            ? round.availableFunding.usd - totalEarmarkFunding
            : round.availableFunding.ocean - totalEarmarkFunding;

        mappedLeaderboard.grantPools[EarmarkTypeEnum.General] = new GrantPool({
            type: EarmarkTypeEnum.General,
            totalFunding: totalGeneralFunding,
            remainingFunding: totalGeneralFunding,
        });

        return mappedLeaderboard;
    }

    private determineRoundStatus(round: Round): RoundStatusEnum {
        const currentDate = new Date();

        if (round.submissionEndDate >= currentDate) {
            return RoundStatusEnum.ProposalSubmission;
        }

        if (round.votingStartDate >= currentDate) {
            return RoundStatusEnum.Pending;
        }

        if (round.votingEndDate >= currentDate) {
            return RoundStatusEnum.VotingInProgress;
        }

        return RoundStatusEnum.VotingFinished;
    }
}
