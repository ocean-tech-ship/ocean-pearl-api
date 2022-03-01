import { ApiProperty } from '@nestjs/swagger';
import { EarmarkTypeEnum } from '../../database/enums/earmark-type.enum';
import { PaymentOptionEnum } from '../../database/enums/payment-option.enum';
import { RemainingFundingStrategyEnum } from '../../database/enums/remaining-funding-strategy.enum';
import { RoundStatusEnum } from '../enums/round-status.enum';
import { GrantPool } from './grant-pool.model';
import { LeaderboardProposal } from './leaderboard-proposal.model';

export class LeaderboardProperties {
    fundedProposals?: LeaderboardProposal[];
    partiallyFundedProposals?: LeaderboardProposal[];
    notFundedProposals?: LeaderboardProposal[];
    amountProposals?: number;
    maxVotes?: number;
    grantPools?: Partial<LeaderboardGrantPools>;
    paymentOption?: PaymentOptionEnum;
    votingStartDate?: Date;
    votingEndDate?: Date;
    status?: RoundStatusEnum;
    round?: number;
    overallFunding?: number;
    remainingFundingStrategy?: RemainingFundingStrategyEnum;
    overallRequestedFunding?: number;
    totalVotes?: number;
}

export type LeaderboardGrantPools = {
    [key in EarmarkTypeEnum]: GrantPool;
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
    grantPools: Partial<LeaderboardGrantPools> = {};

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

    constructor(attributes: LeaderboardProperties = {}) {
        for (let key in attributes) {
            this[key] = attributes[key];
        }
    }

    public addToFundedProposals(proposal: LeaderboardProposal): void {
        this.fundedProposals = this.insertInOrder(proposal, this.fundedProposals);
    }

    public addToPartiallyFundedProposals(proposal: LeaderboardProposal): void {
        this.partiallyFundedProposals = this.insertInOrder(proposal, this.partiallyFundedProposals);
    }

    public addToNotFundedProposals(proposal: LeaderboardProposal): void {
        this.notFundedProposals = this.insertInOrder(proposal, this.notFundedProposals);
    }
    public moveUnusedRemainingFunding(): void {
        for (let [key, pool] of Object.entries(this.grantPools)) {
            if (key !== EarmarkTypeEnum.General) {
                this.grantPools[EarmarkTypeEnum.General].remainingFunding += pool.remainingFunding;
                pool.remainingFunding = 0;
            }
        }
    }

    private insertInOrder(
        proposal: LeaderboardProposal,
        proposalList: LeaderboardProposal[],
    ): LeaderboardProposal[] {
        if (proposalList.length === 0) {
            proposalList.push(proposal);
            return proposalList;
        }

        for (const [index, listProposal] of proposalList.entries()) {
            if (index === proposalList.length - 1) {
                listProposal.effectiveVotes >= proposal.effectiveVotes
                    ? proposalList.splice(index + 1, 0, proposal)
                    : proposalList.splice(index, 0, proposal);
                break;
            }

            if (
                listProposal.effectiveVotes > proposal.effectiveVotes &&
                proposalList[index + 1].effectiveVotes <= proposal.effectiveVotes
            ) {
                proposalList.splice(index + 1, 0, proposal);
                break;
            }
        }

        return proposalList;
    }
}
