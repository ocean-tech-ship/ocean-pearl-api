import { Injectable } from '@nestjs/common';
import { PaymentOptionEnum } from '../../database/enums/payment-option.enum';
import { Round } from '../../database/schemas/round.schema';
import { RoundStatusEnum } from '../enums/round-status.enum';
import { Leaderboard } from '../models/leaderboard.model';

@Injectable()
export class LeaderboardMapper {
    public map(round: Round): Leaderboard {
        let totalEarmarkFunding: number = 0;
        const isPaymentOpetionUsd: boolean =
            round.paymentOption === PaymentOptionEnum.Usd;
        let mappedLeaderboard = {
            maxVotes: 0,
            totalVotes: 0,
            amountProposals: 0,
            overallRequestedFunding: 0,
            fundedProposals: [],
            notFundedProposals: [],
            paymentOption: round.paymentOption,
            overallFunding: isPaymentOpetionUsd
                ? round.availableFundingUsd
                : round.availableFundingOcean,
            earmarks: {},
            status: this.determineRoundStatus(round),
            voteStartDate: round.votingStartDate,
            voteEndDate: round.votingEndDate,
            round: round.round,
        } as Leaderboard;

        for (const [type, earmark] of Object.entries(round.earmarks)) {
            mappedLeaderboard.earmarks[type] = {
                type: earmark.type,
                remainingFunding: isPaymentOpetionUsd
                    ? earmark.fundingUsd
                    : earmark.fundingOcean,
            };

            totalEarmarkFunding += isPaymentOpetionUsd
                ? earmark.fundingUsd
                : earmark.fundingOcean;
        }

        mappedLeaderboard.remainingGeneralFunding = isPaymentOpetionUsd
            ? round.availableFundingUsd - totalEarmarkFunding
            : round.availableFundingOcean - totalEarmarkFunding;

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
