import { ApiProperty } from '@nestjs/swagger';
import { EarmarkTypeEnum } from '../../database/enums/earmark-type.enum';
import { PaymentOptionEnum } from '../../database/enums/payment-option.enum';
import { RemainingFundingStrategyEnum } from '../../database/enums/remaining-funding-strategy.enum';
import { RoundStatusEnum } from '../enums/round-status.enum';
import { GrantPool } from './grant-pool.model';
import { LeaderboardProposal } from './leaderboard-proposal.model';

export type LeaderboardGrantPools = {
    [key in EarmarkTypeEnum]?: GrantPool;
};

export class Leaderboard {
    @ApiProperty({
        type: LeaderboardProposal,
        isArray: true,
    })
    fundedProposals: LeaderboardProposal[] = [];

    @ApiProperty({
        type: LeaderboardProposal,
        isArray: true,
    })
    partiallyFundedProposals: LeaderboardProposal[] = [];

    @ApiProperty({
        type: LeaderboardProposal,
        isArray: true,
    })
    notFundedProposals: LeaderboardProposal[] = [];

    @ApiProperty()
    amountProposals: number = 0;

    @ApiProperty()
    maxVotes: number = 0;

    @ApiProperty({
        type: Object,
    })
    grantPools: LeaderboardGrantPools = {};

    @ApiProperty({
        type: String,
        enum: PaymentOptionEnum,
    })
    paymentOption: PaymentOptionEnum;

    @ApiProperty()
    votingStartDate: Date;

    @ApiProperty()
    votingEndDate: Date;

    @ApiProperty({
        type: String,
        enum: RoundStatusEnum,
    })
    status: RoundStatusEnum;

    @ApiProperty()
    round: number;

    @ApiProperty()
    overallFunding: number = 0;

    @ApiProperty()
    remainingFundingStrategy: RemainingFundingStrategyEnum;

    @ApiProperty()
    overallRequestedFunding: number = 0;

    @ApiProperty()
    totalVotes: number = 0;

    constructor(attributes: Partial<Leaderboard> = {}) {
        for (let key in attributes) {
            this[key] = attributes[key];
        }
    }

    public addToFundedProposals(proposal: LeaderboardProposal): void {
        this.fundedProposals.splice(this.findLocation(proposal, this.fundedProposals), 0, proposal);
    }

    public addToPartiallyFundedProposals(proposal: LeaderboardProposal): void {
        this.partiallyFundedProposals.splice(this.findLocation(proposal, this.partiallyFundedProposals), 0, proposal);
    }

    public addToNotFundedProposals(proposal: LeaderboardProposal): void {
        this.notFundedProposals.splice(this.findLocation(proposal, this.notFundedProposals), 0, proposal);
    }
    
    public moveUnusedRemainingFunding(): void {
        for (let [key, pool] of Object.entries(this.grantPools)) {
            if (key !== EarmarkTypeEnum.General) {
                this.grantPools[EarmarkTypeEnum.General].remainingFunding += pool.remainingFunding;
                pool.remainingFunding = 0;
            }
        }
    }

    private findLocation(
        proposal: LeaderboardProposal,
        proposalList: LeaderboardProposal[],
    ): number {
        if (proposalList.length === 0) {
            return -1;
        }

        for (const [index, listProposal] of proposalList.entries()) {
            if (listProposal.effectiveVotes < proposal.effectiveVotes)
                return index;
        }

        return proposalList.length;
    }
}
