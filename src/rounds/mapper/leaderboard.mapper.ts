import { Injectable } from '@nestjs/common';
import { EarmarkTypeEnum } from '../../database/enums/earmark-type.enum';
import { PaymentOptionEnum } from '../../database/enums/payment-option.enum';
import { Round } from '../../database/schemas/round.schema';
import { RoundStatusEnum } from '../enums/round-status.enum';
import { GrantPool, Leaderboard } from '../models/leaderboard.model';

@Injectable()
export class LeaderboardMapper {
    public map(round: Round): Leaderboard {
        let totalEarmarkFunding: number = 0;
        const isPaymentOptionUsd: boolean = round.paymentOption === PaymentOptionEnum.Usd;
        let mappedLeaderboard = {
            maxVotes: 0,
            totalVotes: 0,
            amountProposals: 0,
            overallRequestedFunding: 0,
            fundedProposals: [],
            partiallyFundedProposals: [],
            notFundedProposals: [],
            paymentOption: round.paymentOption,
            overallFunding: isPaymentOptionUsd
                ? round.availableFundingUsd
                : round.availableFundingOcean,
            grantPools: {},
            status: this.determineRoundStatus(round),
            votingStartDate: round.votingStartDate,
            votingEndDate: round.votingEndDate,
            round: round.round,
        } as Leaderboard;

        for (const [type, earmark] of Object.entries(round.earmarks)) {
            const totalFunding = isPaymentOptionUsd ? earmark.fundingUsd : earmark.fundingOcean;

            mappedLeaderboard.grantPools[type] = {
                type: earmark.type,
                totalFunding: totalFunding,
                remainingFunding: totalFunding,
                potentialRemainingFunding: totalFunding,
            } as GrantPool;

            totalEarmarkFunding += totalFunding;
        }

        const totalGeneralFunding = isPaymentOptionUsd
            ? round.availableFundingUsd - totalEarmarkFunding
            : round.availableFundingOcean - totalEarmarkFunding;

        mappedLeaderboard.grantPools[EarmarkTypeEnum.General] = {
            type: EarmarkTypeEnum.General,
            totalFunding: totalGeneralFunding,
            remainingFunding: totalGeneralFunding,
        };

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
