import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../database.module';
import { BallotTypeEnum } from '../../../enums/ballot-type.enum';
import { EarmarkTypeEnum } from '../../../enums/earmark-type.enum';
import { PaymentOptionEnum } from '../../../enums/payment-option.enum';
import { RemainingFundingStrategyEnum } from '../../../enums/remaining-funding-strategy.enum';
import { VoteTypeEnum } from '../../../enums/vote-type.enum';
import { nanoid } from '../../../functions/nano-id.function';
import { RoundRepository } from '../../../repositories/round.repository';
import { Round } from '../../../schemas/round.schema';

const ROUND_ID: string = nanoid();
const ROUND_MONGO_ID: Types.ObjectId = new Types.ObjectId();

describe('RoundRepository', () => {
    const round: Round = {
        _id: ROUND_MONGO_ID,
        id: ROUND_ID,
        round: 100000000,
        maxGrant: {
            usd: 10000,
            ocean: 10000,
        },
        availableFunding: {
            usd: 10000,
            ocean: 10000,
        },
        grantPools: {
            [EarmarkTypeEnum.NewEntrants]: {
                type: EarmarkTypeEnum.NewEntrants,
                fundingUsd: 20000,
                fundingOcean: 20000,
            },
        },
        remainingFundingStrategy: RemainingFundingStrategyEnum.Burn,
        basisCurrency: PaymentOptionEnum.Usd,
        paymentOption: PaymentOptionEnum.Usd,
        usdConversionRate: 0.9,
        voteType: VoteTypeEnum.Weighted,
        ballotType: BallotTypeEnum.Batch,
        submissionEndDate: new Date(),
        votingStartDate: new Date(),
        votingEndDate: new Date(),
    } as Round;

    let module: TestingModule;
    let service: RoundRepository;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [DatabaseModule, AppModule],
        }).compile();

        service = module.get<RoundRepository>(RoundRepository);
    });

    afterAll(async () => {
        await service.delete({ find: { _id: ROUND_MONGO_ID } });
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('Given I have a round repository', () => {
        test('it should save a round', async () => {
            expect(await service.create(round)).toEqual(ROUND_MONGO_ID);
        });

        test('it should return a round', async () => {
            const dbRound = await service.getByID(round.id);

            expect({
                id: dbRound.id,
                round: dbRound.round,
                maxGrant: dbRound.maxGrant,
                availableFunding: dbRound.availableFunding,
                grantPools: dbRound.grantPools,
                remainingFundingStrategy: dbRound.remainingFundingStrategy,
                basisCurrency: dbRound.basisCurrency,
                paymentOption: dbRound.paymentOption,
                usdConversionRate: dbRound.usdConversionRate,
                voteType: dbRound.voteType,
                ballotType: dbRound.ballotType,
            }).toEqual({
                id: ROUND_ID,
                round: 100000000,
                maxGrant: {
                    usd: 10000,
                    ocean: 10000,
                },
                availableFunding: {
                    usd: 10000,
                    ocean: 10000,
                },
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: {
                        type: EarmarkTypeEnum.NewEntrants,
                        fundingUsd: 20000,
                        fundingOcean: 20000,
                    },
                },
                remainingFundingStrategy: RemainingFundingStrategyEnum.Burn,
                basisCurrency: PaymentOptionEnum.Usd,
                paymentOption: PaymentOptionEnum.Usd,
                usdConversionRate: 0.9,
                voteType: VoteTypeEnum.Weighted,
                ballotType: BallotTypeEnum.Batch,
            });
        });

        test('it should return all rounds', async () => {
            expect((await service.getAll()).length).toBeGreaterThanOrEqual(1);
        });

        test('it should update a round', async () => {
            round.ballotType = BallotTypeEnum.Granular;

            expect(await service.update(round)).toBeTruthy();
        });

        test('it should delete a round', async () => {
            expect(await service.delete({ find: { id: round.id } })).toBeTruthy();
        });
    });
});
