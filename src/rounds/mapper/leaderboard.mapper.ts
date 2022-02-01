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
            maxVotes: 0,
            totalVotes: 0,
            amountProposals: 0,
            overallRequestedFunding: 0,
            paymentOption: round.paymentOption,
            overallFunding: isPaymentOptionUsd
                ? round.availableFundingUsd
                : round.availableFundingOcean,
            remainingFundingStrategy: round.remainingFundingStrategy,
            status: this.determineRoundStatus(round),
            votingStartDate: round.votingStartDate,
            votingEndDate: round.votingEndDate,
            round: round.round,
        });

        for (const [type, earmark] of Object.entries(round.earmarks)) {
            const totalFunding = isPaymentOptionUsd ? earmark.fundingUsd : earmark.fundingOcean;

            mappedLeaderboard.grantPools[earmark.type] = new GrantPool({
                type: earmark.type,
                totalFunding: totalFunding,
                remainingFunding: totalFunding,
                potentialRemainingFunding: totalFunding,
            });

            totalEarmarkFunding += totalFunding;
        }

        const totalGeneralFunding = isPaymentOptionUsd
            ? round.availableFundingUsd - totalEarmarkFunding
            : round.availableFundingOcean - totalEarmarkFunding;

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
