import { Injectable } from '@nestjs/common';
import { PaymentOptionEnum } from '../../database/enums/payment-option.enum';
import { Round } from '../../database/schemas/round.schema';
import { RoundStatusEnum } from '../enums/round-status.enum';
import { Leaderboard } from '../models/leaderboard.model';

@Injectable()
export class LeaderboardMapper {
    public map(round: Round): Leaderboard {
        return {
            maxVotes: 0,
            fundedProposals: [],
            notFundedProposals: [],
            voteStartDate: round.votingStartDate,
            voteEndDate: round.votingEndDate,
            paymentOption: round.paymentOption,
            remainingEarmarkFunding: round.paymentOption === PaymentOptionEnum.Usd
                ? round.earmarkedFundingUsd
                : round.earmarkedFundingOcean,
            remainingGeneralFunding:
            round.paymentOption === PaymentOptionEnum.Usd
                ? round.availableFundingUsd - round.earmarkedFundingUsd
                : round.availableFundingOcean - round.earmarkedFundingOcean,
            status: this.determineRoundStatus(round),
        } as Leaderboard
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